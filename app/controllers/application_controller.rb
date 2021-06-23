class ApplicationController < ActionController::Base
  include Pundit
  respond_to :html, :json

  # TODO: README.mdに記載する
  if ENV["BASIC_AUTH_USERNAME"].present? && ENV["BASIC_AUTH_PASSWORD"].present?
    http_basic_authenticate_with name: ENV["BASIC_AUTH_USERNAME"], password: ENV["BASIC_AUTH_PASSWORD"]
  end

  rescue_from ActiveRecord::RecordNotFound do
    respond_to do |format|
      # TODO: 404 Redirect
      format.html { redirect_to root_path, notice: "Resource not found." }
      format.json { render json: { message: "resource not found" }, status: :not_found }
    end
  end

  # before_action :verify_signed_in, unless: :devise_controller?
  before_action :store_user_location!, if: :storable_location?
  before_action :configure_permitted_parameters, if: :devise_controller?
  # after_action :verify_authorized, unless: :devise_controller?
  before_action :set_locale

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  protected

  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(request.referer || new_user_session_path)
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
    devise_parameter_sanitizer.permit(:sign_up) do |user_params|
      user_params.permit(:username, :email, :password, role_ids: [])
    end
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

  def not_found
    raise ActiveRecord::RecordNotFound
  end
end
