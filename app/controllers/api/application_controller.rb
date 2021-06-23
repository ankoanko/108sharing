class API::ApplicationController < ActionController::Base
  include Pundit

  rescue_from ActiveRecord::RecordNotFound do
    render json: { message: "resource not found" }, status: :not_found
  end

  before_action :store_user_location!, if: :storable_location?
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  protected

  def user_not_authorized
    render json: { status: "error",
                   errors: { auth: "You are not authorized to perform this action." } },
           status: :unauthorized
  end

  def verify_signed_in
    redirect_to new_session_path if user_signed_in?
  end

  def set_locale
    logger.debug "* Accept-Language: #{request.env["HTTP_ACCEPT_LANGUAGE"]}"
    I18n.locale = params[:locale] || cookies[:locale] || browser_locale || I18n.default_locale
    cookies[:locale] = I18n.locale.to_s
    logger.debug "* Locale set to '#{I18n.locale}'"
  end

  def browser_locale
    locale = request.env["HTTP_ACCEPT_LANGUAGE"]&.scan(/^[a-z]{2}/)&.first
    locale.in?(I18n.available_locales) || I18n.default_locale
    locale
  end

  def default_url_options
    { locale: I18n.locale }
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:username])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username])
  end

  def storable_location?
    request.get? && is_navigational_format? && !devise_controller? && !request.xhr?
  end

  def store_user_location!
    # :user is the scope we are authenticating
    store_location_for(:user, request.fullpath)
  end
end
