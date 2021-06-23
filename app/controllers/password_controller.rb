class PasswordController < ApplicationController
  # before_action :authenticate_user!, only: %i[new create]

  # rubocop:disable Style/GuardClause
  def update
    if current_user.update_with_password user_params
      bypass_sign_in current_user
      render json: {
        flush: { message: I18n.t("flash.model.update.success", model: User.human_attribute_name(:password)), type: :success },
      }
    else
      raise ActiveRecord::RecordInvalid, current_user
    end
  end
  # rubocop:enable Style/GuardClause

  private

  def user_params
    params.require(:user).permit(
      :password, :current_password
    )
  end
end
