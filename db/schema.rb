# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_06_04_003230) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "activities", force: :cascade do |t|
    t.string "trackable_type"
    t.bigint "trackable_id"
    t.string "owner_type"
    t.bigint "owner_id"
    t.string "key"
    t.text "parameters"
    t.string "recipient_type"
    t.bigint "recipient_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type"
    t.index ["owner_type", "owner_id"], name: "index_activities_on_owner_type_and_owner_id"
    t.index ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type"
    t.index ["recipient_type", "recipient_id"], name: "index_activities_on_recipient_type_and_recipient_id"
    t.index ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type"
    t.index ["trackable_type", "trackable_id"], name: "index_activities_on_trackable_type_and_trackable_id"
  end

  create_table "addresses", force: :cascade do |t|
    t.bigint "user_id"
    t.string "postal_code"
    t.string "state"
    t.string "city"
    t.string "town"
    t.string "other"
    t.string "state_kana"
    t.string "city_kana"
    t.string "town_kana"
    t.string "other_kana"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_addresses_on_user_id"
  end

  create_table "announcements", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.text "body"
    t.string "url"
    t.datetime "publish_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_announcements_on_user_id"
  end

  create_table "audits", force: :cascade do |t|
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.text "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.index ["associated_type", "associated_id"], name: "associated_index"
    t.index ["auditable_type", "auditable_id", "version"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "bank_accounts", force: :cascade do |t|
    t.bigint "user_id"
    t.string "bank_name"
    t.string "branch_name"
    t.string "number"
    t.string "name"
    t.integer "account_type", default: 0
    t.string "bank_code"
    t.string "branch_code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_bank_accounts_on_user_id", unique: true
  end

  create_table "blocked_dates", force: :cascade do |t|
    t.bigint "post_id"
    t.date "blocked_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_blocked_dates_on_post_id"
  end

  create_table "calendars", force: :cascade do |t|
    t.bigint "post_id"
    t.date "day", null: false
    t.boolean "reserved", default: false
    t.boolean "blocked", default: false
    t.integer "daily_price"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_calendars_on_post_id"
  end

  create_table "cards", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "stripe_card_id", null: false
    t.string "fingerprint", null: false
    t.boolean "active", default: true, null: false
    t.string "last4", null: false
    t.string "brand", null: false
    t.integer "exp_month"
    t.integer "exp_year"
    t.string "cvc_check"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_cards_on_active"
    t.index ["fingerprint"], name: "index_cards_on_fingerprint"
    t.index ["stripe_card_id"], name: "index_cards_on_stripe_card_id"
    t.index ["user_id"], name: "index_cards_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.string "name_en"
    t.string "name_ja"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "conditions", force: :cascade do |t|
    t.string "name"
    t.string "name_en"
    t.string "name_ja"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "contacts", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "subject"
    t.text "body"
    t.integer "status"
    t.string "note"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "conversation_users", force: :cascade do |t|
    t.integer "conversation_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "unread_messages_count", default: 0, null: false
    t.datetime "last_read_at"
    t.boolean "unread_notified", default: false, null: false
    t.index ["conversation_id", "user_id"], name: "index_conversation_users_on_conversation_id_and_user_id", unique: true
    t.index ["conversation_id"], name: "index_conversation_users_on_conversation_id"
    t.index ["unread_notified"], name: "index_conversation_users_on_unread_notified"
    t.index ["user_id"], name: "index_conversation_users_on_user_id"
  end

  create_table "conversations", force: :cascade do |t|
    t.bigint "reservation_id"
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "messages_count", default: 0, null: false
    t.index ["reservation_id"], name: "index_conversations_on_reservation_id"
    t.index ["slug"], name: "index_conversations_on_slug", unique: true
  end

  create_table "identification_images", force: :cascade do |t|
    t.bigint "identification_id"
    t.integer "position"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["identification_id"], name: "index_identification_images_on_identification_id"
  end

  create_table "identifications", force: :cascade do |t|
    t.bigint "user_id"
    t.text "description"
    t.integer "workflow_state", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_identifications_on_user_id"
  end

  create_table "impressions", force: :cascade do |t|
    t.string "impressionable_type"
    t.integer "impressionable_id"
    t.integer "user_id"
    t.string "controller_name"
    t.string "action_name"
    t.string "view_name"
    t.string "request_hash"
    t.string "ip_address"
    t.string "session_hash"
    t.text "message"
    t.text "referrer"
    t.text "params"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["controller_name", "action_name", "ip_address"], name: "controlleraction_ip_index"
    t.index ["controller_name", "action_name", "request_hash"], name: "controlleraction_request_index"
    t.index ["controller_name", "action_name", "session_hash"], name: "controlleraction_session_index"
    t.index ["impressionable_type", "impressionable_id", "ip_address"], name: "poly_ip_index"
    t.index ["impressionable_type", "impressionable_id", "params"], name: "poly_params_request_index"
    t.index ["impressionable_type", "impressionable_id", "request_hash"], name: "poly_request_index"
    t.index ["impressionable_type", "impressionable_id", "session_hash"], name: "poly_session_index"
    t.index ["impressionable_type", "message", "impressionable_id"], name: "impressionable_type_message_index"
    t.index ["user_id"], name: "index_impressions_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.integer "sender_id"
    t.integer "conversation_id", null: false
    t.string "body", null: false
    t.datetime "sent_at"
    t.string "activity_type"
    t.bigint "activity_id"
    t.string "activity_key"
    t.integer "recipient_id"
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_id"], name: "index_messages_on_activity_id"
    t.index ["activity_type", "activity_id"], name: "index_messages_on_activity_type_and_activity_id"
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["recipient_id"], name: "index_messages_on_recipient_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "activity_type"
    t.bigint "activity_id"
    t.string "activity_key"
    t.integer "recipient_id"
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_type", "activity_id"], name: "index_notifications_on_activity_type_and_activity_id"
  end

  create_table "payment_histories", force: :cascade do |t|
    t.string "activity_type"
    t.bigint "activity_id"
    t.string "activity_key"
    t.integer "recipient_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_type", "activity_id"], name: "index_payment_histories_on_activity_type_and_activity_id"
  end

  create_table "payouts", force: :cascade do |t|
    t.bigint "user_id"
    t.string "stripe_payout_id"
    t.integer "amount", default: 0, null: false
    t.string "currency", default: "jpy"
    t.integer "status", default: 0
    t.string "failure_code"
    t.text "failure_message"
    t.date "arrival_date"
    t.datetime "paid_at"
    t.datetime "failed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_payouts_on_user_id"
  end

  create_table "post_images", force: :cascade do |t|
    t.bigint "post_id"
    t.integer "position"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_post_images_on_post_id"
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "category_id"
    t.string "name", null: false
    t.string "slug"
    t.text "description"
    t.datetime "published_at"
    t.integer "likes_count", default: 0, null: false
    t.integer "aasm_state", default: 0
    t.integer "integer", default: 0
    t.string "country"
    t.string "city"
    t.string "state"
    t.string "street1"
    t.string "street2"
    t.string "zipcode"
    t.float "latitude"
    t.float "longitude"
    t.integer "reviews_count", default: 0
    t.integer "price", default: 0, null: false
    t.string "currency", default: "jpy"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "instant", default: 0, null: false
    t.text "note"
    t.string "size"
    t.string "capacity"
    t.string "functionality"
    t.bigint "condition_id"
    t.index ["category_id"], name: "index_posts_on_category_id"
    t.index ["condition_id"], name: "index_posts_on_condition_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "receipts", force: :cascade do |t|
    t.bigint "reservation_id"
    t.string "name"
    t.string "no"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reservation_id"], name: "index_receipts_on_reservation_id"
  end

  create_table "reservations", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "post_id"
    t.date "start_date"
    t.date "end_date"
    t.integer "workflow_state", default: 0
    t.integer "price"
    t.datetime "paid_at"
    t.datetime "canceled_at"
    t.string "stripe_charge_id"
    t.string "stripe_refund_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "refund_amount", default: 0
    t.datetime "authorized_at"
    t.string "slug"
    t.string "no"
    t.integer "cancel_fee", default: 0
    t.index ["post_id"], name: "index_reservations_on_post_id"
    t.index ["user_id"], name: "index_reservations_on_user_id"
  end

  create_table "review_replies", force: :cascade do |t|
    t.bigint "review_id"
    t.text "body"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["review_id"], name: "index_review_replies_on_review_id"
    t.index ["user_id"], name: "index_review_replies_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "reservation_id"
    t.string "reviewable_type", null: false
    t.bigint "reviewable_id", null: false
    t.integer "reviewer_id"
    t.integer "rating", null: false
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reservation_id"], name: "index_reviews_on_reservation_id"
    t.index ["reviewable_type", "reviewable_id"], name: "index_reviews_on_reviewable_type_and_reviewable_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "settings", force: :cascade do |t|
    t.string "var", null: false
    t.text "value"
    t.integer "thing_id"
    t.string "thing_type", limit: 30
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["thing_type", "thing_id", "var"], name: "index_settings_on_thing_type_and_thing_id_and_var", unique: true
  end

  create_table "social_profiles", force: :cascade do |t|
    t.string "access_token"
    t.text "description"
    t.string "email"
    t.string "image_url"
    t.string "name"
    t.string "nickname"
    t.integer "provider", null: false
    t.string "uid", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_social_profiles_on_user_id"
  end

  create_table "taggings", force: :cascade do |t|
    t.string "taggable_type"
    t.bigint "taggable_id"
    t.integer "position"
    t.integer "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["taggable_type", "taggable_id"], name: "index_taggings_on_taggable_type_and_taggable_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.string "name_en"
    t.string "name_ja"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_roles", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "fullname"
    t.string "username"
    t.text "bio"
    t.integer "posts_count", default: 0
    t.integer "unread_messages_count", default: 0
    t.integer "unread_notifications_count", default: 0
    t.string "stripe_customer_id"
    t.string "stripe_account_id"
    t.boolean "enable_email", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "birthday"
    t.integer "gender", default: 0
    t.string "phone"
    t.boolean "published", default: true
    t.boolean "email_exists", default: true
    t.string "slug"
    t.string "last_name"
    t.string "first_name"
    t.string "last_name_kana"
    t.string "first_name_kana"
    t.boolean "suspended", default: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "violation_reports", force: :cascade do |t|
    t.string "reportable_type", null: false
    t.bigint "reportable_id", null: false
    t.integer "violation_type", default: 0, null: false
    t.string "content"
    t.integer "reported_by_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["reportable_type", "reportable_id"], name: "index_violation_reports_on_reportable_type_and_reportable_id"
  end

  create_table "votes", id: :serial, force: :cascade do |t|
    t.string "votable_type"
    t.integer "votable_id"
    t.string "voter_type"
    t.integer "voter_id"
    t.boolean "vote_flag"
    t.string "vote_scope"
    t.integer "vote_weight"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["votable_id", "votable_type", "vote_scope"], name: "index_votes_on_votable_id_and_votable_type_and_vote_scope"
    t.index ["voter_id", "voter_type", "vote_scope"], name: "index_votes_on_voter_id_and_voter_type_and_vote_scope"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "addresses", "users"
  add_foreign_key "announcements", "users"
  add_foreign_key "bank_accounts", "users"
  add_foreign_key "blocked_dates", "posts"
  add_foreign_key "calendars", "posts"
  add_foreign_key "cards", "users"
  add_foreign_key "conversation_users", "users"
  add_foreign_key "conversations", "reservations"
  add_foreign_key "identification_images", "identifications"
  add_foreign_key "payouts", "users"
  add_foreign_key "post_images", "posts"
  add_foreign_key "posts", "categories"
  add_foreign_key "posts", "conditions"
  add_foreign_key "posts", "users"
  add_foreign_key "reservations", "posts"
  add_foreign_key "reservations", "users"
  add_foreign_key "review_replies", "reviews"
  add_foreign_key "review_replies", "users"
  add_foreign_key "reviews", "reservations"
  add_foreign_key "social_profiles", "users"
end
