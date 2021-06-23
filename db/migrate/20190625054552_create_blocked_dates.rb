class CreateBlockedDates < ActiveRecord::Migration[5.2]
  def change
    create_table :blocked_dates do |t|
      t.references :post, foreign_key: true
      t.date :blocked_date
      t.timestamps
    end
  end
end
