class AddColumnInstantToPost < ActiveRecord::Migration[5.2]
  def change
    add_column :posts, :instant, :integer, null: false, default: 0
  end
end
