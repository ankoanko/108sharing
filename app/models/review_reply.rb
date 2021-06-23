class ReviewReply < ApplicationRecord
  include ActionView::Helpers::DateHelper

  belongs_to :review
  belongs_to :user
  validates :body, presence: true, length: { maximum: 10_000 }

  def created_time_ago
    time_ago_in_words(created_at)
  end
end

# == Schema Information
#
# Table name: review_replies
#
#  id         :bigint(8)        not null, primary key
#  body       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  review_id  :bigint(8)
#  user_id    :bigint(8)
#
# Indexes
#
#  index_review_replies_on_review_id  (review_id)
#  index_review_replies_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (review_id => reviews.id)
#  fk_rails_...  (user_id => users.id)
#
