class AddColumnRefundAmountToReservation < ActiveRecord::Migration[5.2]
  def change
    add_column :reservations, :refund_amount, :integer
  end
end
