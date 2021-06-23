module API
  class IdentificationImagesController < API::ApplicationController
    before_action :authenticate_user!

    def create
      identification = Identification.find_or_create_by!(user_id: current_user.id)
      identification.identification_images.new(identification_params)

      if identification.save
        identification.requested_by!(current_user)
        render json: {
          identifcation: IdentificationSerializer.serialize(identification),
          flush: { message: I18n.t("flash.model.create.success", model: Identification.model_name.human), type: :success },
        }, status: :ok
      else
        render json: identification.errors, status: :unprocessable_entity
      end
    end

    private

    def identification_params
      params.require(:identification_image).permit(:user_id, :description, :workflow_state, :image)
    end
  end
end
