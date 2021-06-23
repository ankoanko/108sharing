module Admin
  module API
    class UsersController < Admin::API::BaseController
      before_action :set_user, only: %i[update destroy]

      def create
        @user = User.new(create_user_params)
        authorize @user
        if @user.save
          @user_json = UserSerializer.serialize(@user)
          render json: {
            user: @user_json,
            flush: { message: I18n.t("flash.model.create.success", model: User.model_name.human), type: :success },
          }, status: :created
        else
          render json: {
            errors: @user.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def update
        send_suspended_notification = update_user_params[:suspended] unless @user.suspended
        @user.assign_attributes(update_user_params)
        if @user.valid?
          @user.save
          UserMailer.account_suspend(@user).deliver_now if send_suspended_notification
          @user_json = UserSerializer.serialize(@user)
          render json: {
            user: @user_json,
            flush: { message: I18n.t("flash.model.update.success", model: User.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @user.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def destroy
        if @user.destroy
          render json: {
            flush: { message: I18n.t("flash.model.delete.success", model: User.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @user.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = User.friendly.find(params[:id])
        authorize @user
      end

      def update_user_params
        params.require(:user).permit(:email, :bio, :username, :email_notification, role_ids: [])
      end

      def create_user_params
        params.require(:user).permit(:email, :bio, :password, :username, :email_notification, role_ids: [])
      end
    end
  end
end
