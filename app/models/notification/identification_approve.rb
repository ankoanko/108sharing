class Notification::IdentificationApprove
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      identification = activity.trackable
      [identification.user]
    end

    def title(activity)
      I18n.t("notification.identification.approved")
    end

    def url(activity)
      settings_identification_url
    end

    def send_notification(notification)
      NotificationMailer.identification_approved(notification).deliver_now
    end
  end
end
