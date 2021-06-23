class Notification::IdentificationDecline
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      identification = activity.trackable
      [identification.user]
    end

    def title(activity)
      I18n.t("notification.identification.declined")
    end

    def url(activity)
      settings_bank_account_url
    end

    def send_notification(notification)
      NotificationMailer.identification_declined(notification).deliver_now
    end
  end
end
