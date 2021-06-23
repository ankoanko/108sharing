class Notification::ContactCreate
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      User.admin
    end

    def title(activity)
      contact = activity.trackable
      I18n.t("notification.contact.created", { subject: contact.subject })
    end

    def url(activity)
      admin_contacts_url
    end

    def send_notification(notification)
      NotificationMailer.contact_created(notification).deliver_now
    end
  end
end
