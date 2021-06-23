
class CreateTaggings < ActiveRecord::Migration[5.2]
  def change
    
    create_table :taggings do |t|
      t.references :taggable, polymorphic: true
      t.integer :position
      t.integer :tag_id

      t.timestamps
    end
  
  end
end
  