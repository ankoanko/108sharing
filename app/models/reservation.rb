class Reservation < ApplicationRecord
  # rubocop:disable  Metrics/ClassLength
  include ActsAsSluggable
  include Notifiable
  include PublicActivity::Model
  tracked only: %i[create], owner: proc {|_controller, model| model.user }
  attr_accessor :initial_message

  belongs_to :user
  belongs_to :post

  # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :reviews
  has_one :conversation
  has_one :receipt
  has_many :notifications, through: :activities
  # rubocop:enable Rails/HasManyOrHasOneDependent

  # rubocop:disable Rails/Date
  scope :recent, -> { order(created_at: :desc) }
  scope :cancelled, -> { where.not(canceled_at: nil) }
  scope :upcoming, -> { where("start_date > ?", Date.current) }
  scope :past, -> { where("start_date <= ?", Date.current) }

  scope :filtered_by, ->(params) { where(workflow_state: params[:states]) }
  scope :with_user, -> { includes(user: [:card, :roles]) }
  scope :with_post, -> { includes(post: [:reviews, :user, :post_images]) }
  scope :with_receipt, -> { includes(:receipt) }
  scope :with_conversation, -> { includes(:conversation) }
  scope :with_cancel_fee, -> { where("cancel_fee > ?", 0) }
  scope :receipt_accessible, -> { where.not(paid_at: nil) }

  enum workflow_state: { requested: 0, approved: 1, declined: 2, canceled: 3 }

  validate :available_dates?, on: :create
  validate :check_identification, on: :create
  validate :check_profile, on: :create
  validates :no, uniqueness: true

  delegate :name, to: :post, prefix: true

  before_validation :generate_no, on: :create
  after_create :create_conversation!, if: :initial_message

  # rubocop:disable Naming/AccessorMethodName
  def self.set_reminder(notification)
    reservation = notification.activity.trackable
    before_day = reservation.start_date.yesterday
    ReservationReminderJob.set(wait_until: before_day.noon).perform_later(notification)
  end
  # rubocop:enable Naming/AccessorMethodName

  def post_owner
    post.user
  end

  def confirm_reservation!(user, source)
    unless self.price.zero?
      self.stripe_charge_id = create_stripe_charge(user, source).id
      self.authorized_at = Time.current
    end
    self.save!
    fill_calendar!
  end

  def create_stripe_charge(user, source)
    StripeChargeService.new(
      source: source,
      user: user,
      reservation: self,
    ).charge_customer
  rescue Stripe::InvalidRequestError
    @error = "You must supply either a card or a customer id"
  rescue Stripe::CardError
    nil
    # flash的ななにか or slack通知などdele
  end

  def fill_calendar!
    calendar_bulk_form_params = {
      calendar_attributes: (self.start_date...self.end_date).map {|day| { day: day, reserved: true } },
    }
    form = Form::CreateCollectionCalendar.new(self.post, calendar_bulk_form_params)
    form.save!
  end

  # rubocop:disable Metrics/MethodLength, Metrics/PerceivedComplexity
  def next_work_flow(_user)
    if user == _user
      %i[canceled] if requested? || approved?
    else
      if requested?
        %i[declined approved]
      elsif approved?
        %i[canceled]
      end
    end
  end
  # rubocop:enable Metrics/MethodLength, Metrics/PerceivedComplexity

  def reviewable(_user)
    is_past_and_approved = (end_date < Date.current) && approved?
    is_reservation_user = self.user.id == _user.id

    # 複数回Postに対して同じユーザからReviewできない仕様
    reservation_user_review = self.post.reviews.find {|review| review.reviewer_id == self.user.id }

    is_past_and_approved && is_reservation_user && reservation_user_review.nil?
  end

  def any_cancel_fee?
    cancel_fee.positive?
  end

  def canceled_by!(user)
    create_activity key: "reservation.cancel", owner: user
  end

  def approved_by!(user)
    create_activity key: "reservation.approve", owner: user
  end

  def declined_by!(user)
    create_activity key: "reservation.decline", owner: user
  end

  def canceled_by?(user)
    activities.where(key: "reservation.cancel", owner: user).any?
  end

  def cancel_feeed?
    activities.where(key: "reservation.cancel").any?
  end

  def cancel_fee_by(user)
    self.user == user ? Reservation::RefundCalculator.new(self).cancel_fee : 0
  end

  def refund_amount_by(user)
    self.user == user ? Reservation::RefundCalculator.new(self).amount : price
  end

  private

  def available_dates?
    blocked_or_reserved_dates = post.calendars.unavailable.within_range(start_date, end_date)
    errors[:base] << "Reservation has not set an available date" if blocked_or_reserved_dates.exists?
  end

  def check_identification
    return if Setting.skip_identification || user.identification_exist?

    errors[:base] << I18n.t("activerecord.errors.models.reservation.identification_required")
  end

  def check_profile
    return if Setting.skip_profile || user.profile_exist?

    errors[:base] << I18n.t("activerecord.errors.models.user.profile_required")
  end

  def create_conversation!
    Conversation.build_between_users(self, [post_owner, user])
  end

  def generate_no
    self.no = "RE-#{SecureRandom.hex(5).upcase}"
  end
end

# == Schema Information
#
# Table name: reservations
#
#  id               :bigint(8)        not null, primary key
#  authorized_at    :datetime
#  cancel_fee       :integer          default(0)
#  canceled_at      :datetime
#  end_date         :date
#  no               :string
#  paid_at          :datetime
#  price            :integer
#  refund_amount    :integer          default(0)
#  slug             :string
#  start_date       :date
#  workflow_state   :integer          default("requested")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  post_id          :bigint(8)
#  stripe_charge_id :string
#  stripe_refund_id :string
#  user_id          :bigint(8)
#
# Indexes
#
#  index_reservations_on_post_id  (post_id)
#  index_reservations_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#  fk_rails_...  (user_id => users.id)
#
