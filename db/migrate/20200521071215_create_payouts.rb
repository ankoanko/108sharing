class CreatePayouts < ActiveRecord::Migration[5.2]
  def change
    create_table :payouts do |t|
      t.references :user, foreign_key: true, index: true
      t.string :stripe_payout_id
      t.integer :amount, null: false, default: 0
      t.string  :currency, default: "jpy"
      t.integer :status, default: 0
      t.string :failure_code
      t.text :failure_message
      t.date :arrival_date
      t.datetime :paid_at
      t.datetime :failed_at
      t.timestamps
    end
  end
end
