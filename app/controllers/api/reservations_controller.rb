module API
  class ReservationsController < API::ApplicationController
    before_action :authenticate_user!
    before_action :set_reservation, only: %i[approve decline cancel refund_amount]

    include Pagination
    include SortableTable

    def search
      reservations = if ActiveRecord::Type::Boolean.new.cast(filtered_params[:received])
                       search_reservations(current_user.received_reservations.with_user.with_post.with_conversation.with_receipt)
                     else
                       search_reservations(current_user.reservations.with_post.with_conversation.with_receipt)
                     end
      reservations_json = json_pagination(
        reservations,
        ReservationsSerializer,
        { params: { current_user: current_user } },
      )
      render json: reservations_json if request.xhr?
    end

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Layout/LineLength
    def create
      reservation = Reservation.new(reservation_params)
      reservation.user = current_user
      reservation.price = 0 unless Setting.payment_required
      authorize(reservation)

      # TODO: stripe error handling

      if reservation.valid?
        reservation.confirm_reservation!(current_user, stripe_params[:stripeToken])
        render json: {
          reservation: ReservationsSerializer.serialize(reservation).merge!(flush: { message: I18n.t("flash.model.create.success", model: Reservation.model_name.human), type: :success }),
        }
      else
        render json: { errors: reservation.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    def refund_amount
      price = @reservation.cancel_fee_by(current_user)
      render json: { price: price }
    end

    def approve
      # return unless @reservation.requested?

      if @reservation.stripe_charge_id.present?
        capture_charge = StripeChargeService.new(
          reservation: @reservation,
        ).capture_charge

        if capture_charge
          @reservation.paid_at = Time.current
        else
          @reservation.declined!
          return render json: { errors: I18n.t("flash.model.approve.failure", model: Reservation.model_name.human) }, status: :unprocessable_entity
        end
      end

      @reservation.approved!
      @reservation.approved_by!(current_user)
      render json: {
        reservation: ReservationsSerializer.serialize(@reservation, { params: { current_user: current_user } }),
        flush: {
          message: I18n.t("flash.model.approve.success", model: Reservation.model_name.human),
          type: :success,
        },
      }
    end

    # rubocop:disable Rails/SkipsModelValidations
    def decline
      # オーソリ期間でしかdeclineできない、
      # すぎると自動で全額オーソリキャンセルになる
      return unless @reservation.requested?

      ActiveRecord::Base.transaction do
        if @reservation.stripe_charge_id.present?
          begin
            customer_refund = Stripe::Refund.create({
              charge: @reservation.stripe_charge_id,
            })
            @reservation.stripe_refund_id = customer_refund.id
            @reservation.refund_amount = customer_refund.amount
          rescue => e
            return render json: { errors: e.message }, status: :unprocessable_entity
          end
        end

        @reservation.declined_by!(current_user)
        @reservation.canceled_at = Time.current
        @reservation.declined!

        reservation_array = (@reservation.start_date...@reservation.end_date).to_a
        @reservation.post.calendars.where(day: reservation_array, reserved: true).update_all(reserved: false)
      end
      render json: {
        reservation: ReservationsSerializer.serialize(@reservation, { params: { current_user: current_user } }),
        flush: {
          message: I18n.t("flash.model.decline.success",
                          model: Reservation.model_name.human),
          type: :success,
        },
      }
    end

    # rubocop:disable Style/GuardClause
    def cancel
      refund_amount = @reservation.refund_amount_by(current_user)
      if refund_amount != 0 && @reservation.stripe_charge_id.present?
        @customer_refund = StripeChargeService.new(
          user: current_user,
          reservation: @reservation,
          reason: params[:reason],
          refund_amount: refund_amount,
        ).refund_customer

        if @customer_refund
          @reservation.stripe_refund_id = @customer_refund.id
          @reservation.refund_amount = @customer_refund.amount
        else
          return render json: { errors: I18n.t("flash.model.cancel.failure", model: Reservation.model_name.human) }, status: :unprocessable_entity
        end
      end

      @reservation.canceled!
      @reservation.canceled_at = Time.current
      @reservation.save!

      @reservation.canceled_by!(current_user)

      # TODO: Move Model
      reservation_array = (@reservation.start_date..@reservation.end_date - 1.day).to_a
      @reservation.post.calendars.where(day: reservation_array, reserved: true).update_all(reserved: false)

      render json: {
        reservation: ReservationsSerializer.serialize(@reservation, { params: { current_user: current_user } }),
        flush: {
          message: I18n.t("flash.model.cancel.success",
                          model: Reservation.model_name.human),
          type: :success,
        },
      }
    rescue Stripe::CardError, Stripe::RateLimitError, Stripe::InvalidRequestError, Stripe::AuthenticationError, Stripe::APIConnectionError, Stripe::StripeError => e
      render_stripe_errors(e)
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Rails/SkipsModelValidations, Layout/LineLength

    private

    def render_stripe_errors(e)
      render json: { error: e.message, success: false, status: 422 }
    end

    def set_reservation
      @reservation = Reservation.friendly.find params[:id]
    end

    def stripe_params
      params.permit :stripeToken
    end

    def reservation_params
      params.require(:reservation).permit(
        :post_id, :start_date, :end_date, :price, :initial_message
      )
    end

    def filtered_params
      params.permit(:past, :received, states: [])
    end

    def search_reservations(default_scope)
      scope = default_scope
      scope = ActiveRecord::Type::Boolean.new.cast(filtered_params[:past]) ? scope.past : scope.upcoming
      scope = scope.filtered_by(filtered_params) if filtered_params[:states].present?
      scope.recent
    end
  end
end
