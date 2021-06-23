class Notification::PostClose
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      post = activity.trackable
      [post.user]
    end

    def title(_activity, _notification)
      I18n.t("notification.post.closed")
    end

    def sender_image(_activity, _notification)
      Setting.admin_image
    end

    def sender_name(_activity, _notification)
      Setting.admin_name
    end

    def url(activity, _notification)
      post = activity.trackable
      post_url(post)
    end

    def send_notification(notification)
      NotificationMailer.post_closed(notification).deliver_now
    end
  end
end
