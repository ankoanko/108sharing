class AddAuthorizedAtToReservation < ActiveRecord::Migration[5.2]
  def change
    add_column :reservations, :authorized_at, :datetime
  end
end
