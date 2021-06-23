class CreateAddresses < ActiveRecord::Migration[5.2]
  def change
    create_table :addresses do |t|
      t.references :user, foreign_key: true
      t.string :postal_code
      t.string :state
      t.string :city
      t.string :town
      t.string :other
      t.string :state_kana
      t.string :city_kana
      t.string :town_kana
      t.string :other_kana
      t.timestamps
    end
  end
end
