class CreateMessage < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.integer  :sender_id
      t.integer  :conversation_id, null: false
      t.string   :body,            null: false
      t.datetime :sent_at
      t.references :activity, polymorphic: true, index: true
      t.string :activity_key
      t.integer :recipient_id, foreign_key: true
      t.datetime :read_at

      t.timestamps

      t.index ["activity_id"], name: "index_messages_on_activity_id"
      t.index ["conversation_id"], name: "index_messages_on_conversation_id"
      t.index ["recipient_id"], name: "index_messages_on_recipient_id"
      t.index ["sender_id"], name: "index_messages_on_sender_id"
      end  
  end
end
