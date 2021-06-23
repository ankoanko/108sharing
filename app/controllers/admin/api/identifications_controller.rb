module Admin
  module API
    class IdentificationsController < Admin::API::BaseController
      before_action :set_identification, only: %i[approve decline]

      def approve
        authorize(@identification)
        if @identification.approved!
          @identification.approved_by!(current_user)

          render json: {
            identification: Admin::IdentificationSerializer.serialize(@identification),
            flush: { message: I18n.t("flash.model.update.success", model: Identification.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @identification.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def decline
        authorize(@identification)

        if @identification.declined!
          @identification.declined_by!(current_user)
          render json: {
            identification: Admin::IdentificationSerializer.serialize(@identification),
            flush: { message: I18n.t("flash.model.update.success", model: Identification.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @identification.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      private

      def set_identification
        @identification = Identification.find params[:id]
      end
    end
  end
end
