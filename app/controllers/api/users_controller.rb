module API
  class UsersController < API::ApplicationController
    def update
      authorize(current_user)
      if current_user.update(user_params)
        bypass_sign_in(current_user)
        render json: {
          user: AccountSerializer.serialize(current_user),
          flush: { message: I18n.t("flash.model.update.success", model: User.human_attribute_name(:profile)), type: :success },
        }
      else
        render json: {
          user: AccountSerializer.serialize(current_user),
          errors: @user.errors.full_messages,
        }, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(
        :email, :username, :bio, :avatar
      )
    end
  end
end
