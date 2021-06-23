class CreateConditions < ActiveRecord::Migration[5.2]
  def change
    create_table :conditions do |t|
      t.string :name
      t.string :name_en
      t.string :name_ja
      t.integer :position

      t.timestamps
    end
  end
end
