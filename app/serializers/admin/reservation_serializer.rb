module Admin
  class ReservationSerializer < Admin::ApplicationSerializer
    attributes :id, :user_id, :post_id, :start_date, :end_date, :workflow_state, :price, :paid_at, :canceled_at, :updated_at, :refund_amount, :authorized_at
  end
end
