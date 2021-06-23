class Notification::ReservationApprove
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      reservation = activity.trackable
      [reservation.post.user]
    end

    def title(activity)
      I18n.t("notification.reservation.approved")
    end

    def url(activity)
      reservation = activity.trackable
      reservation_url(reservation)
    end

    def send_notification(notification)
      NotificationMailer.reservation_approved(notification).deliver_now
    end
  end
end
