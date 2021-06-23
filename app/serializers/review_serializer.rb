class ReviewSerializer < ApplicationSerializer
  attributes :id, :rating, :body, :created_time_ago

  belongs_to :reservation, serializer: ReservationsSerializer
  belongs_to :reviewer, record_type: :user, serializer: UserSerializer
  belongs_to :reviewable, record_type: :post, serializer: PostSerializer

  has_one :review_reply, serializer: ReviewReplySerializer

  def self.opt_include
    [:reservation, :reviewer, :review_reply, :'review_reply.user', :reviewable]
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at.to_date
  end
end

# == Schema Information
#
# Table name: reviews
#
#  id              :bigint(8)        not null, primary key
#  body            :text
#  rating          :integer          not null
#  reviewable_type :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  reservation_id  :bigint(8)
#  reviewable_id   :bigint(8)        not null
#  reviewer_id     :integer
#
# Indexes
#
#  index_reviews_on_reservation_id                     (reservation_id)
#  index_reviews_on_reviewable_type_and_reviewable_id  (reviewable_type,reviewable_id)
#
# Foreign Keys
#
#  fk_rails_...  (reservation_id => reservations.id)
#
