class Notification::AnnouncementCreate
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      User.to_a
    end

    def title(activity, notification)
      announcement = activity.trackable
      announcement.title
    end

    def sender_image(activity, notification)
      Setting.admin_image
    end

    def sender_name(activity, notification)
      Setting.admin_name
    end

    def url(activity, notification)
      announcement = activity.trackable
      announcement.url.presence || nil
    end

    # def send_notification(notification)
    #   NotificationMailer.result_created(notification).deliver_now
    # end
  end
end
