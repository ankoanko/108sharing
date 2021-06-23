class PaymentHistory::PayoutCreate
  class << self
    include Rails.application.routes.url_helpers

    def recipients(activity)
      payout = activity.trackable
      [payout.user]
    end

    def message(payment_history)
      payout = payment_history.activity.trackable
      I18n.t("payment_history.payout.created.to_host",
             amount: payout.amount.to_s(:delimited))
    end
  end
end
