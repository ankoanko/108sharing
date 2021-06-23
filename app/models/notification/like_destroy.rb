class Notification::LikeDestroy
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      post = activity.trackable
      [post.user]
    end

    def title(activity)
      "お気に入りからはずされました"
    end

    def url(activity)
      post = activity.trackable
      post_url(post)
    end

    # イイねが取り消されたときは通知しないでいいことにする
    # def send_notification(notification)
    #   NotificationMailer.like_destroy(notification).deliver_now
    # end
  end
end
