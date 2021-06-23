module Admin
  module API
    class BaseController < ApplicationController
      layout "admin"

      include Pundit
      before_action :authenticate_user!
      after_action :verify_authorized

      rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

      def authorize(record, query = nil)
        super([:admin, record], query)
      end

      def policy_scope(scope)
        super([:admin, scope])
      end

      def require_admin
        redirect_to root_path unless user_signed_in? && current_user.admin?
      end

      def user_not_authorized
        render json: { status: "error",
                       errors: { auth: I18n.t("activerecord.errors.messages.user_not_authorized") } },
               status: :unauthorized
      end
    end
  end
end
