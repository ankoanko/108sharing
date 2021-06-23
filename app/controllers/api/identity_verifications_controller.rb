module Api
  class IdentityVerificationsController < API::ApplicationController
    before_action :authenticate_user!
    before_action :create_stripe_account, only: [:create]

    # rubocop:disable Metrics/AbcSize
    def create
      @form = Form::CreateIdentityVerification.new(current_user, user_params)
      ActiveRecord::Base.transaction do
        @form.save!
        current_user.update_stripe_legal_entity((user_params[:identification_image_attributes][:image]))
      end

      identification = current_user.identification
      identification.requested_by!(current_user)
      render json: {
        identifcation: IdentificationSerializer.serialize(identification),
        user: UserSerializer.serialize(current_user),
        flush: { message: I18n.t("flash.model.update.success", model: Identification.model_name.human), type: :success },
      }
    rescue Stripe::StripeError => e
      # Display a very generic error to the user, and maybe send
      # yourself an email
      render json: { errors: "Stripeエラー: #{e.message}" }, status: :unprocessable_entity
    rescue => e
      render json: {
        user: UserSerializer.serialize(current_user),
        errors: @form.errors.full_messages.presence || e.message,
      }, status: :unprocessable_entity
    end
    # rubocop:enable Metrics/AbcSize

    private

    def user_params
      params.require(:user).permit(
        :last_name, :last_name_kana, :first_name, :first_name_kana, :birthday, :gender, :phone,
        address_attributes: [:postal_code, :state, :city, :town, :other, :state_kana, :city_kana, :town_kana, :other_kana],
        identification_image_attributes: [:description, :workflow_state, :image]
      )
    end

    def create_stripe_account
      # this should be out of transaction
      current_user.create_stripe_account if current_user.stripe_account_id.blank?
    end
  end
end
