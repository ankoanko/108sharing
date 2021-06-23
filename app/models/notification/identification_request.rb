class Notification::IdentificationRequest
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      User.admin
    end

    def title(activity)
      I18n.t("notification.identification.requested")
    end

    def url(activity)
      admin_identifications_url
    end

    def send_notification(notification)
      NotificationMailer.identification_requested(notification).deliver_now
    end
  end
end
