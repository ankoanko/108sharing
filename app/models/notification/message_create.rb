class Notification::MessageCreate
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      conversation = activity.trackable.conversation
      conversation.users
    end

    def title(activity)
      "メッセージが届きました"
    end

    def url(activity)
      reservation_url(activity.trackable.conversation.reservation)
    end

    # def send_notification(notification)
    #   ReservationMailer.reservation_canceled(notification).deliver_now
    #   set_reminder(notification)
    # end
  end
end
