
class CreateSocialProfiles < ActiveRecord::Migration[5.2]
  def change
    
    create_table :social_profiles do |t|
      t.string :access_token
      t.text :description
      t.string :email
      t.string :image_url
      t.string :name
      t.string :nickname
      t.integer :provider, null: false
      t.string :uid, null: false
      t.references :user, foreign_key: true, null: false

      t.timestamps
    end
  
  end
end
  