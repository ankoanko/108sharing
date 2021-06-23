class ContactsController < ApplicationController
  # before_action :skip_authenticate_user!
  before_action :verify_signed_in, only: %i[new]

  def new
    @contact = Contact.new
  end

  private

  def verify_signed_in
    if current_user.nil?
      flash[:alert] = I18n.t("devise.failure.unauthenticated")
      redirect_to new_user_session_url
    end
  end
end
