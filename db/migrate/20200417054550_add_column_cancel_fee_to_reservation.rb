class AddColumnCancelFeeToReservation < ActiveRecord::Migration[5.2]
  def change
    add_column :reservations, :cancel_fee, :integer, default: 0
  end
end
