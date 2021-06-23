# frozen_string_literal: true

# rubocop:disable  Metrics/ClassLength
class Post < ApplicationRecord
  include ActsAsSluggable
  include PublicActivity::Model
  include AASM
  UPDATABLE_ATTRS = [
    :user_id, :category_id, :name, :price,
    :published_at, :description, :aasm_state, :note,
    :country, :city, :state, :street1, :street2, :zipcode, :latitude,
    :longitude, tag_ids: []
  ].freeze
  paginates_per 10
  RELATED_POSTS_COUNT = 4
  ADMIN_POSTS_COUNT = 25

  # extensions
  acts_as_votable
  is_impressionable

  counter_culture :user
  AASM_STATES = %i[draft published closed].freeze
  AASM_EVENTS = {
    "published" => "publish!",
    "closed" => "close!",
  }

  # associations
  belongs_to :user
  belongs_to :category, optional: true
  belongs_to :condition, optional: true

  has_many :taggings, as: :taggable, dependent: :destroy
  has_many :tags, through: :taggings

  has_many :reservations, dependent: :restrict_with_error
  has_many :reviews, through: :reservations

  has_many :post_images, -> { includes([image_attachment: :blob]).order(position: :asc) }, inverse_of: :post, dependent: :destroy
  has_one :post_image, -> {
    order(position: :asc)
  }, inverse_of: :post

  has_many :calendars, dependent: :destroy
  has_many :reviews, as: :reviewable, source: "review" #rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :violation_reports, as: :reportable, dependent: :destroy

  # delegate
  delegate :username, to: :user
  delegate :name, to: :category, prefix: true

  # scope
  scope :recent, -> { order(published_at: :desc) }
  scope :oldest, -> { order(published_at: :asc) }
  scope :by_likes, -> { order(likes_count: :desc) }
  scope :published, -> { where.not(published_at: nil) }
  scope :in_public, -> { where(aasm_state: [:published]) }
  scope :not_draft, -> { where(aasm_state: [:published, :closed]) }
  scope :with_image, -> { includes(post_image: [image_attachment: :blob]) }
  scope :with_images, -> { includes(post_images: [image_attachment: :blob]) }
  scope :with_tags, -> { includes(:tags) }
  scope :with_user, -> { includes(user: [avatar_attachment: :blob]) }
  scope :with_category, -> { includes(:category) }
  scope :with_reviews, -> { includes(:reviews) }
  scope :related_posts, ->(self_id) { published.where.not(id: self_id).with_image.with_tags }

  KEYWORDS_ATTRS = %i[name description].freeze
  # ransack
  # rubocop:disable Style/MethodCalledOnDoEndBlock
  scope :with_keywords, ->(keywords) {
    if keywords.present?
      where(keywords.split(/[[:space:]]/).reject(&:empty?).map do |keyword|
        KEYWORDS_ATTRS.map {|a| arel_table[a].matches("%#{keyword}%") }.inject(:or)
      end.inject(:and))
    end
  }
  # rubocop:enable Style/MethodCalledOnDoEndBlock

  scope :filter_by_name, ->(keyword) { where("lower(name) LIKE ?", "%#{keyword.downcase}%") }
  scope :above_or_equal_to_price, ->(price) { where("price >= ?", price) }
  scope :below_or_equal_to_price, ->(price) { where("price <= ?", price) }
  scope :search_by, ->(params) {
                      ransack(
                        category_id_in: params[:category_ids],
                        price_gteq: params[:min_price],
                        price_lteq: params[:max_price],
                        tags_id_in: params[:tag_ids],
                      ).result(distinct: true)
                    } # joinなどひつようあれば別スコープにて

  # validation
  validates :name, presence: true, length: { maximum: 100 }
  validates :description, presence: true, length: { maximum: 5000 }

  STRIPE_MINIMUM_PRICE = 50
  validates :price,
            numericality: { greater_than_or_equal_to: STRIPE_MINIMUM_PRICE, message: I18n.t("activerecord.errors.models.post.invalid_price_value") },
            if: proc { Setting.payment_required && price != 0 }

  # enum
  enum instant: { request: 0, instant: 1 }
  enum aasm_state: AASM_STATES

  aasm enum: true do
    state :draft, initial: true
    state :published
    state :closed

    event :publish do
      transitions from: %i[draft closed], to: :published
      after do
        self.published_at = Time.current if self.published_at.nil?
      end
    end

    event :close do
      transitions from: %i[draft published], to: :closed
      after do |user|
        self.published_at = nil
        self.closed_by!(user)
      end
    end
  end

  # rubocop:disable Lint/UselessAssignment
  def self.search(keywords, search_params, bounds, set_duration_params)
    scope = published.in_public.with_user.with_category.with_tags.with_image.with_keywords(keywords).search_by(search_params)
    scope = scope.in_bounds(bounds) if bounds.present?
    scope = scope.available(set_duration_params) if set_duration_params.present?
    scope
  end
  # rubocop:enable Lint/UselessAssignment

  # days = ["2019-8-10", "2019-8-11"]
  def self.available(duration)
    days = (duration[:start_date]..duration[:end_date]).to_a
    not_in_available = joins(:calendars).merge(Calendar.unavailable.where(day: days))
    where.not(id: not_in_available)
  end

  def self.order_scope
    order("#{sort_column} #{sort_direction}")
  end

  def update(params, current_user: nil)
    Post.transaction do
      send(AASM_EVENTS[params[:aasm_state]], current_user) if params[:aasm_state]
      super(params)
    end
  end

  def closed_by!(user)
    create_activity key: "post.close", owner: user if user.admin?
  end

  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
  end

  def create_like_activity(liked_user)
    create_activity key: "like.create", owner: liked_user
  end

  def create_unlike_activity(liked_user)
    create_activity key: "like.destroy", owner: liked_user
  end

  def sort_column
    column_names.include?(params[:sort]) ? params[:sort] : "name"
  end

  def toggle_status!
    if published?
      closed!
    else
      published?
    end
  end

  def owner?(user)
    return false if user.blank?

    self.user == user
  end

  def likes_count
    get_likes.count
  end

  # money

  def pay?
    price.positive?
  end

  def price_calculator(duration)
    PostPriceCalculator.new(self, duration).process!
  end

  def full_address
    "#{state} #{city} #{street1} #{street2}"
  end

  def public_address
    "#{state} #{city}"
  end

  def related_post
    Post.recent.where.not(id: id).limit(3)
  end

  def published
    published_at.present?
  end

  def viewed_count
    impressionist_count
  end

  def avarage_review_score
    reviews.count.zero? ? 0 : reviews.average(:rating).round(2).to_i
  end

  def self.in_bounds(bounds)
    where("latitude < ?", bounds[:northEast][:lat]).
      where("latitude > ?", bounds[:southWest][:lat]).
      where("longitude > ?", bounds[:southWest][:lng]).
      where("longitude < ?", bounds[:northEast][:lng])
  end

  def new?
    created_at > DateTime.current.ago(3.days)
  end

  def active?
    published && user.active?
  end

  private

  def set_published_at
    if aasm_state_change
      self.published_at = published? ? Time.current : nil
    end
  end
end

# == Schema Information
#
# Table name: posts
#
#  id            :bigint(8)        not null, primary key
#  aasm_state    :integer          default("draft")
#  capacity      :string
#  city          :string
#  country       :string
#  currency      :string           default("jpy")
#  description   :text
#  functionality :string
#  instant       :integer          default("request"), not null
#  integer       :integer          default(0)
#  latitude      :float
#  likes_count   :integer          default(0), not null
#  longitude     :float
#  name          :string           not null
#  note          :text
#  price         :integer          default(0), not null
#  published_at  :datetime
#  reviews_count :integer          default(0)
#  size          :string
#  slug          :string
#  state         :string
#  street1       :string
#  street2       :string
#  zipcode       :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :bigint(8)
#  condition_id  :bigint(8)
#  user_id       :bigint(8)
#
# Indexes
#
#  index_posts_on_category_id   (category_id)
#  index_posts_on_condition_id  (condition_id)
#  index_posts_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (condition_id => conditions.id)
#  fk_rails_...  (user_id => users.id)
#
