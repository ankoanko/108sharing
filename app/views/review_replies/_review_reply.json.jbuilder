json.extract! review_reply, :id, :review_id, :body, :user_id, :created_at, :updated_at
json.url review_reply_url(review_reply, format: :json)
