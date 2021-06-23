class CreateReviewReplies < ActiveRecord::Migration[5.2]
  def change
    create_table :review_replies do |t|
      t.references :review, foreign_key: true
      t.text :body
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
