class CreateConversations < ActiveRecord::Migration[5.2]
  def change
    create_table :conversation_users do |t|
      t.integer  :conversation_id
      t.references :user, foreign_key: true
      t.datetime :created_at,                            null: false
      t.datetime :updated_at,                            null: false
      t.integer  :unread_messages_count, default: 0,     null: false
      t.datetime :last_read_at
      t.boolean  :unread_notified,       default: false, null: false
      t.index ["conversation_id", "user_id"], name: "index_conversation_users_on_conversation_id_and_user_id", unique: true, using: :btree
      t.index ["conversation_id"], name: "index_conversation_users_on_conversation_id", using: :btree
      t.index ["unread_notified"], name: "index_conversation_users_on_unread_notified", using: :btree
    end
  
    create_table :conversations, force: :cascade do |t|
      t.references :reservation, foreign_key: true
      t.string   :slug,                       null: false
      t.datetime :created_at,                 null: false
      t.datetime :updated_at,                 null: false
      t.integer  :messages_count, default: 0, null: false
      t.index ["slug"], name: "index_conversations_on_slug", unique: true, using: :btree
    end    
  end
end
