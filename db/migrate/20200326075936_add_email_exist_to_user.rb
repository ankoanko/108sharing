class AddEmailExistToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :email_exists, :boolean, default: true
  end
end
