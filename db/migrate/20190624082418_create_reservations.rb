class CreateReservations < ActiveRecord::Migration[5.2]
  def change
    create_table :reservations do |t|
      t.references :user, foreign_key: true
      t.references :post, foreign_key: true
      t.date :start_date
      t.date :end_date
      t.integer :workflow_state, default: 0
      t.integer :price
      t.datetime :paid_at
      t.datetime :canceled_at
      t.string :stripe_charge_id
      t.string :stripe_refund_id

      t.timestamps
    end
  end
end
