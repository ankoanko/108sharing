class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.references :user, foreign_key: true, null: false
      t.string :stripe_card_id, null: false, index: true
      t.string :fingerprint, null: false, index: true
      t.boolean :active, null: false, default: true, index: true
      t.string :last4, null: false
      t.string :brand, null: false
      t.integer :exp_month
      t.integer :exp_year
      t.string :cvc_check

      t.timestamps
    end
  end
end
