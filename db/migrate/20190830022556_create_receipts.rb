class CreateReceipts < ActiveRecord::Migration[5.2]
  def change
    create_table :receipts do |t|
      t.references :reservation
      t.string :name
      t.string :no

      t.timestamps
    end
  end
end
