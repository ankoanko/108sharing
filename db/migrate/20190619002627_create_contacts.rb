
class CreateContacts < ActiveRecord::Migration[5.2]
  def change
    
    create_table :contacts do |t|
      t.string :name
      t.string :email
      t.string :subject
      t.text :body
      t.integer :status
      t.string :note
      t.integer :user_id

      t.timestamps
    end
  
  end
end
  