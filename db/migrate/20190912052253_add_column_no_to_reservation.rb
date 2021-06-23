class AddColumnNoToReservation < ActiveRecord::Migration[5.2]
  def change
    add_column :reservations, :no, :string
  end
end
