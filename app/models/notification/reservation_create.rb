class Notification::ReservationCreate
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      reservation = activity.trackable
      [reservation.post.user]
    end

    def title(activity)
      I18n.t("notification.reservation.created")
    end

    def url(activity)
      reservation = activity.trackable
      reservation_url(reservation)
    end

    def send_notification(notification)
      NotificationMailer.reservation_requested(notification).deliver_now
      set_reminder(notification)
    end

    #rubocop:disable  Naming/AccessorMethodName
    def set_reminder(notification)
      reservation = notification.activity.trackable
      before_day = reservation.start_date.yesterday
      ReservationReminderJob.set(wait_until: before_day.noon).perform_later(notification)
    end
    #rubocop:enable  Naming/AccessorMethodName
  end
end
