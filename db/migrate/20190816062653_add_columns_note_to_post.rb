class AddColumnsNoteToPost < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :note, :text
    add_column :posts, :size, :string
    add_column :posts, :capacity, :string
    add_column :posts, :functionality, :string    
  end
end
