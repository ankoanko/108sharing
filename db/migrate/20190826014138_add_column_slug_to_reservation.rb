class AddColumnSlugToReservation < ActiveRecord::Migration[5.2]
  def change
    add_column :reservations, :slug, :string
  end
end
