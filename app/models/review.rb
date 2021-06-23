class Review < ApplicationRecord
  include ActionView::Helpers::DateHelper
  include Notifiable

  belongs_to :reviewable, polymorphic: true

  belongs_to :reservation
  belongs_to :reviewer, class_name: "User"
  validates :reviewer_id, uniqueness: { scope: :reservation_id }
  validates :body, presence: true, length: { maximum: 10_000 }
  validates :rating, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }

  has_one :notification, as: :activity #rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :review_replies, dependent: :destroy
  has_one :review_reply, dependent: :destroy
  # after_create :send_notification!

  delegate :username, :avatar_url, to: :reviewer, allow_nil: true

  scope :recent, -> { order("created_at DESC, rating DESC") }

  # association
  scope :with_reviewer, -> { includes(:reviewer) }
  scope :with_review_reply, -> { includes(:review_reply) }
  scope :with_reservation, -> { includes(reservation: [:user, :conversation, :receipt, post: [:reviews]]) }

  def title
    "Review was created at #{created_at.to_date}"
  end

  def reviewable?(user)
    reservation.reviewable(user)
  end

  def activity_path
    settings_path
  end

  def reviewee
    post.user
  end

  def send_notification!
    Notification.send_notification!(self, reviewee)
  end

  def created_time_ago
    time_ago_in_words(created_at)
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
