
class CreateCategories < ActiveRecord::Migration[5.2]
  def change
    
    create_table :categories do |t|
      t.string :name, null: false
      t.string :name_en
      t.string :name_ja
      t.integer :position

      t.timestamps
    end
  
  end
end
  