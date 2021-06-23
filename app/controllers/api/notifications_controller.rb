module API
  class NotificationsController < API::ApplicationController
    before_action :authenticate_user!

    include Pagination
    include SortableTable

    def index
      notifications = Notification.my_notifications(current_user).not_messages.includes(activity: [:trackable]).order(created_at: :desc)
      Notification.activity_preload(notifications)

      if current_user.notifications.unread.present?
        Notification.read!(current_user.notifications.unread)
      end
      current_user.read_notifications!

      notification_json = json_pagination(
        notifications,
        ::NotificationsSerializer,
      )
      render json: notification_json
    end

    def update
      if params[:id] == "unread"
        current_user.read_notifications!
        Notification.read!(current_user.notifications.unread)
        render json: :ok
      end
    end
  end
end
