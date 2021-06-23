class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
      t.references :reservation, foreign_key: true
      t.references :reviewable, null: false, polymorphic: true, index: true
      t.integer :reviewer_id
      t.integer :rating, null: false
      t.text :body

      t.timestamps
    end
  end
end
