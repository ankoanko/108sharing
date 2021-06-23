class Notification::PayoutFail
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      payout = activity.trackable
      [payout.user]
    end

    def title(activity, notification)
      I18n.t("notification.payout.fail")
    end

    def sender_image(activity, notification)
      Setting.admin_image
    end

    def sender_name(activity, notification)
      Setting.admin_name
    end

    def url(activity, notification)
      settings_bank_account_url
    end

    def send_notification(notification)
      NotificationMailer.payout_failed(notification).deliver_now
    end
  end
end
