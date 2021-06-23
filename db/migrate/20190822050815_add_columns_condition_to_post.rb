class AddColumnsConditionToPost < ActiveRecord::Migration[5.2]
  def change
    add_reference :posts, :condition, foreign_key: true
  end
end
