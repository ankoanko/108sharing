class Calendar < ApplicationRecord
  validates :day, presence: true

  belongs_to :post
  scope :filter_by_date_range, ->(date) { where(day: date.beginning_of_month..date.end_of_month) }
  scope :blocked, -> { where(blocked: true) }
  scope :reserved, -> { where(reserved: true) }
  scope :defined_price, ->(post_price) { where.not(daily_price: post_price) }
  scope :unavailable, -> { blocked.or(reserved) }
  scope :within_range, ->(from, to) { where("day BETWEEN ? AND ?", from, to) }

  def self.apply_or_filter(scope, values, post_price)
    filter_group = []

    values.each do |value|
      filter_group << blocked if value == :blocked
      filter_group << reserved if value == :reserved
      filter_group << defined_price(post_price) if value == :defined_price
    end

    scopes = filter_group.reduce(&:or)
    scope.merge scopes
  end
end

# == Schema Information
#
# Table name: calendars
#
#  id          :bigint(8)        not null, primary key
#  blocked     :boolean          default(FALSE)
#  daily_price :integer
#  day         :date             not null
#  reserved    :boolean          default(FALSE)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  post_id     :bigint(8)
#
# Indexes
#
#  index_calendars_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#
