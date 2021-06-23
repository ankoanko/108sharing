class ChangeRefundAmountDefaultOnReservations < ActiveRecord::Migration[5.2]
  def change
    change_column_default :reservations, :refund_amount, from: nil, to: 0
  end
end
