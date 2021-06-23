
class CreatePosts < ActiveRecord::Migration[5.2]
  def change
    
    create_table :posts do |t|
      t.references :user, foreign_key: true
      t.references :category, foreign_key: true
      t.string :name, null: false
      t.string :slug
      t.text :description
      t.datetime :published_at
      t.integer :likes_count, null: false, default: 0
      t.integer :aasm_state, :integer, default: 0
      t.string :country
      t.string :city
      t.string :state
      t.string :street1
      t.string :street2
      t.string :zipcode
      t.float :latitude
      t.float :longitude
      t.integer :reviews_count, default: 0
      t.integer :price, null: false, default: 0
      t.string  :currency, default: "jpy"
      t.timestamps
    end
  
  end
end
  