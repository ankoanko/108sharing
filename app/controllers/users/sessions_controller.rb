# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  responders :devise
  # before_action :configure_sign_in_params, only: %i[create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  # def create
  #   super
  # end

  def create
    user = User.find_for_database_authentication(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      return suspended if user.suspended

      set_flash_message!(:notice, :signed_in)
      sign_in :user, user
      respond_with resource, location: after_sign_in_path_for(user)
    else
      invalid_mail_or_password
    end
  end
  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  def after_sign_in_path_for(resource)
    return admin_posts_path if resource.admin?

    super
  end

  def invalid_mail_or_password
    warden.custom_failure!
    render json: { errors: t("session.invalid_mail_or_password") }, status: :unauthorized
  end

  def suspended
    warden.custom_failure!
    render json: { errors: t("session.suspended") }, status: :unauthorized
  end
end
