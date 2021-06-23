class Notification::LikeCreate
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      post = activity.trackable
      [post.user]
    end

    def title(activity)
      "お気に入りに登録されました"
    end

    def url(activity)
      post = activity.trackable
      post_url(post)
    end

    def send_notification(notification)
      # Nothing
      # NotificationMailer.like_created(notification).deliver_now
    end
  end
end
