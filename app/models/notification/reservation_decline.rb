class Notification::ReservationDecline
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      reservation = activity.trackable
      case activity.owner
      when reservation.user
        [reservation.post.user]
      when reservation.post.user
        [reservation.user]
      else
        []
      end
    end

    def title(activity)
      I18n.t("notification.reservation.declined")
    end

    def url(activity)
      reservation = activity.trackable
      reservation_url(reservation)
    end

    def send_notification(notification)
      NotificationMailer.reservation_declined(notification).deliver_now
    end
  end
end
