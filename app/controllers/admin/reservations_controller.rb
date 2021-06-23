module Admin
  class ReservationsController < Admin::BaseController
    before_action :set_reservation, only: %i[show edit update destroy]

    include Pagination
    include SortableTable

    def index
      # TODO: replace .includes ... with with_xx func
      reservations = policy_scope(Reservation).includes([:post, user: [:avatar_attachment, :identification, :card]]).order("#{sort_column} #{sort_direction}")
      authorize reservations

      @reservations_json = json_pagination(
        reservations,
        Admin::ReservationsSerializer,
      )
    end

    def show
      reservation = ReservationSerializer.serialize(@reservation)
      render json: reservation
    end

    def new
      @reservation = Reservation.new
      authorize @reservation
    end

    def edit
      @reservation_json = ReservationSerializer.serialize(@reservation)
    end

    def create
      reservation = Reservation.new(reservation_params)
      authorize reservation
      if reservation.save
        render json: {
          reservation: reservation.as_json,
          flush: { message: I18n.t("flash.model.create.success", model: Reservation.model_name.human), type: :success },
        }, status: :created
      else
        render json: { errors: reservation.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    def update
      if @reservation.update(reservation_params)
        render json: {
          reservation: @reservation.as_json,
          flush: { message: I18n.t("flash.model.create.success", model: Reservation.model_name.human), type: :success },
        }, status: :ok
      else
        render json: { errors: @reservation.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    def destroy
      if @reservation.reservations.any?
        render json: {}, status: :unprocessable_entity
      else
        @reservation.destroy!
        render json: {
          flush: { message: I18n.t("flash.model.create.success", model: Reservation.model_name.human), type: :success },
        }
      end
    end

    private

    def set_reservation
      # @reservation = Reservation.with_images.find(params[:id])
      @reservation = Reservation.find(params[:id])
      authorize @reservation
    end

    def reservation_params
      params.require(:reservation).permit(:name, :name_ja, :name_en, :position)
    end

    def sort_column
      params[:sort] || "id"
    end
  end
end
