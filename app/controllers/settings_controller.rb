class SettingsController < ApplicationController
  before_action :authenticate_user!

  def show
    render "settings/notification"
  end

  def update
    if current_user.update_settings(user_setting_casted_params)
      render json: {
        user: AccountSerializer.serialize(current_user),
        flush: {
          message: I18n.t("flash.model.update.success", model: I18n.t("settings.notification.form.#{user_setting_casted_params.first[0]}.label")),
          type: :success,
        },
      }, status: :ok

    else
      render json: { errors: user.errors.full_messages.join(",") }, status: :unprocessable_entity
    end
  end

  private

  def update_global_settings
    Setting.update(setting_params)
  end

  def update_user_settings
    user = User.find(params[:user_id])
    user.update_settings(user_setting_params)
  end

  def user_setting_casted_params
    user_setting_params.to_h.transform_values {|x| ActiveModel::Type::Boolean.new.cast(x) }
  end

  # def setting_params
  #   params.require(:settings).permit(Setting::AVAILABLE_SETTINGS)
  # end

  def user_setting_params
    params.require(:settings).permit(User::AVAILABLE_SETTINGS)
  end
end
