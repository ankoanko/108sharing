class CreateNotifications < ActiveRecord::Migration[5.2]
  def change
    create_table :notifications do |t|
      t.references :activity, polymorphic: true, index: true
      t.string :activity_key
      t.integer :recipient_id, foreign_key: true
      t.datetime :read_at

      t.timestamps
    end
  end
end
