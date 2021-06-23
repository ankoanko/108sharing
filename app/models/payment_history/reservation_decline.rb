class PaymentHistory::ReservationDecline
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      reservation = activity.trackable
      [reservation.post.user]
    end

    def message(payment_history)
      reservation = payment_history.activity.trackable
      I18n.t("payment_history.reservation.declined.to_host",
             user_name: reservation.user.username,
             service_name: reservation.post.name,
             price: reservation.price.to_s(:delimited))
    end
  end
end
