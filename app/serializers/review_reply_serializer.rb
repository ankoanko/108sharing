class ReviewReplySerializer < ApplicationSerializer
  attributes :id, :body, :created_time_ago

  belongs_to :user, serializer: UserSerializer
  belongs_to :review, serializer: ReviewSerializer

  def self.opt_include
    [:user]
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at.to_date
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
