class CreateCalendars < ActiveRecord::Migration[5.2]
  def change
    create_table :calendars do |t|
      t.references :post, foreign_key: true
      t.date :day, null: false
      t.boolean :available, default: false
      t.boolean :reserved, default: false
      t.boolean :blocked, default: false
      t.integer :daily_price

      t.timestamps
    end
  end
end
