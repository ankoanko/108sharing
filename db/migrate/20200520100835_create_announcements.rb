class CreateAnnouncements < ActiveRecord::Migration[5.2]
  def change
    create_table :announcements do |t|
      t.references :user, foreign_key: true, index: true
      t.string :title
      t.text :body
      t.string :url
      t.datetime :publish_at
      t.timestamps
    end
  end
end
