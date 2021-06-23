# rubocop:disable Metrics/ClassLength
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :lockable, :confirmable, :omniauthable, :trackable,
         omniauth_providers: SocialProfile::ENABLE_PROVIDERS

  include Uploadable
  include ScopedSetting
  include FriendlyId
  include ActsAsSluggable

  friendly_id :username

  scoped_field :email_notification, default: true

  uploadable_field :avatar, versions: {
    small: "56x56",
  }

  # association
  has_one :card, dependent: :destroy
  has_one :address, dependent: :destroy
  has_one :bank_account, dependent: :destroy
  has_many :user_role, dependent: :destroy
  has_many :roles, through: :user_role
  has_many :social_profiles, dependent: :destroy
  has_many :posts, dependent: :restrict_with_error
  has_many :notifications, dependent: :destroy, foreign_key: "recipient_id"
  has_many :payment_histories, dependent: :destroy, foreign_key: "recipient_id"
  has_many :conversation_users, dependent: :restrict_with_error
  has_many :conversations, through: :conversation_users
  has_many :reservations, dependent: :restrict_with_error
  has_many :received_reservations, through: :posts, source: :reservations
  has_many :received_reviews, through: :posts, source: :reviews
  has_many :taggings, as: :taggable, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :payouts, dependent: :destroy

  has_many :reviews, as: :reviewable, dependent: :destroy
  has_one :identification, dependent: :destroy
  has_many :violation_reports, as: :reportable, dependent: :destroy

  # scope
  %w[admin host guest].each do |name|
    scope name, -> { joins(user_role: :role).where(user_roles: { roles: { name: name } }) }
  end

  # order
  scope :popular, -> { order(rating: :desc) }
  scope :recent, -> { order(created_at: :desc) }

  # includes
  scope :with_tags, -> { includes(:tags) }
  scope :with_roles, -> { includes(:roles) }
  scope :with_categories, -> { includes(:categories) }
  scope :with_avatar, -> { includes(:avatar_attachment, :identification) }
  scope :with_eager_loaded_avatar, -> { eager_load(avatar_attachment: :blob) }

  validates :avatar,
            size: { less_than: 100.megabytes, message: I18n.t("activerecord.errors.models.user.avater.size_over") },
            content_type: { in: ["image/png", "image/jpg", "image/jpeg"], message: I18n.t("activerecord.errors.models.user.avater.invalid_format") }

  VALID_PASSWORD_REGEX = /\A[a-zA-Z0-9-_]+\z/
  validates :password, format: { with: VALID_PASSWORD_REGEX }, on: :create
  validates :username, ban_reserved: true, allow_nil: true, unless: proc {|u| u.admin? }

  acts_as_voter
  # has_paper_trail only: %i(username email)

  validates :email, email_format: { message: I18n.t("activerecord.errors.models.user.email.invalid") }, length: { maximum: 100 }
  validates :username, uniqueness: true, length: { maximum: 100 }
  validates :bio, length: { maximum: 5000 }

  # enum
  enum gender: %i[female male other].freeze

  delegate :workflow_state, to: :identification, prefix: true, allow_nil: true

  %w[admin host guest].each do |name|
    define_method "#{name}?" do
      roles.map(&:name).include?(name)
    end
  end

  def self.build_with_social_profile(profile)
    email = profile.email
    self.find_or_initialize_by(email: email) do |user|
      user.password = Devise.friendly_token[0, 20]
      user.username = self.generate_available_name(profile.name)
      user.confirmed_at = Time.current
      user.email_exists = profile.email.present?
    end
    # user.skip_confirmation! 不要？
  end

  # ex.
  # todo delete
  # User.first.avatar.attach(io: File.open(Rails.root.join("public", "apple-touch-icon.png")), filename: 'apple-touch-icon.png')

  def default_avatar_path
    "/images/no-avatar.svg"
  end

  def has_stripe_customer?
    stripe_customer_id.present?
  end

  def has_stripe_card?
    card.stripe_card_id.present?
  end

  # rubocop:disable Rails/SkipsModelValidations
  def create_stripe_customer
    @customer = Stripe::Customer.create(email: email, metadata: stripe_metadata).tap do |cus|
      update_attribute(:stripe_customer_id, cus.id)
    end
  end
  # rubocop:enable Rails/SkipsModelValidations

  # ruobcbop:disable Naming/MemoizedInstanceVariableName
  def stripe_customer
    @customer ||= Stripe::Customer.retrieve(stripe_customer_id)
  end
  # ruobcbop:enable Naming/MemoizedInstanceVariableName

  def find_or_create_stripe_customer
    has_stripe_customer? ? stripe_customer : create_stripe_customer
  end

  def create_or_update_stripe_default_card(stripe_card_token)
    customer = has_stripe_customer? ? stripe_customer : create_stripe_customer
    stripe_card = customer.sources.create(source: stripe_card_token)
    customer.default_source = stripe_card.id
    card = Card.update_payment_fromt_stripe_card(self, stripe_card)
    customer.sources.data.reject {|c| c == card }.each(&:delete)
    customer.save
    card
  end

  def stripe_metadata
    {
      username: username,
    }
  end

  def stripe_account
    @account ||= Stripe::Account.retrieve(stripe_account_id)
  end

  def delete_stripe_account
    Stripe::Account.delete(stripe_account_id)
  end

  def create_or_update_stripe_external_account
    account = find_or_create_stripe_account
    Stripe::Account.create_external_account(
      account.id,
      {
        external_account: {
          object: "bank_account",
          account_number: bank_account.number,
          routing_number: "#{bank_account.bank_code}#{bank_account.branch_code}",
          account_holder_name: bank_account.name,
          currency: "jpy",
          country: "jp",
          default_for_currency: true,
          metadata: stripe_metadata,
        },
      },
    )

    delete_stripe_external_account
  end

  def delete_stripe_external_account
    return if stripe_account_id.blank?

    stripe_account.external_accounts.each do |external_account|
      next if external_account.default_for_currency

      Stripe::Account.delete_external_account(
        stripe_account_id,
        external_account.id,
      )
    end
  end

  def stripe_external_account
    return nil if stripe_account_id.blank?

    stripe_account.external_accounts.detect(&:default_for_currency)
  end

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
  def check_stripe_verification(_stripe_account = nil)
    return if identification.blank? || identification.approved?

    account = _stripe_account || stripe_account
    verification = account.individual.verification
    document_details = verification.document.details
    details = verification.details

    case verification.status
    when "verified"
      identification.approved!
      identification.update(description: details || document_details)
      identification.approved_by!(User.admin.first)
    when "unverified"
      if identification.declined?
        identification.update(description: details || document_details)
      elsif identification.requested?
        identification.declined!
        identification.update(description: details || document_details)
        identification.declined_by!(User.admin.first)
      end
    when "pending"
      identification.requested! if identification.declined?
    end
  end
  # rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity

  def available_balance
    return 0 if stripe_account_id.blank?
    return 0 unless (balance = Stripe::Balance.retrieve(stripe_account: stripe_account_id))

    balance.available.detect {|b| b.currency == "jpy" }.try("amount") || 0
  end

  def find_or_create_stripe_account
    stripe_account_id.present? ? stripe_account : create_stripe_account
  end

  def create_stripe_account
    @account = Stripe::Account.create(
      email: email,
      type: "custom",
      country: "JP",
      business_type: "individual",
      requested_capabilities: ["card_payments", "transfers"],
      tos_acceptance: { date: created_at.to_i, ip: current_sign_in_ip },
      settings: { payouts: { schedule: { interval: "manual" } } },
      metadata: stripe_metadata,
    ).tap do |acc|
      update(:stripe_account_id, acc.id)
    end
  end

  def update_stripe_legal_entity(image)
    account = find_or_create_stripe_account

    verification_document = Stripe::FileUpload.create(
      {
        purpose: "identity_document",
        file: File.new(image.tempfile),
      },
      {
        stripe_account: account.id,
      },
    )

    Stripe::Account.update(
      account.id,
      individual: individual.merge(verification: { document: { front: verification_document.id } }),
    )
  end

  def notify_condition?
    email_notification && email_exists
  end

  def notify
    update(unread_notifications_count: unread_notifications_count + 1)
  end

  def read_notifications!
    update(unread_notifications_count: 0)
  end

  def update_settings(settings)
    update(settings)
  end

  def identification_exist?
    identification.try("approved?")
  end

  def profile_exist?
    [username, bio].all?
  end

  def providers
    social_profiles.pluck("provider")
  end

  def reviews_count
    return reviews.count unless host?

    reservation_ids = Reservation.where(post_id: posts.ids).ids
    Review.where(reservation_id: reservation_ids).count
  end

  def customer_count
    Reservation.where(post_id: posts.ids).past.count
  end

  def likes_count
    get_likes.size
  end

  def create_like_activity(liked_user)
    create_activity key: "like.create", owner: liked_user
  end

  def create_unlike_activity(liked_user)
    create_activity key: "like.destroy", owner: liked_user
  end

  def active?
    published && !suspended
  end

  private

  class << self
    def generate_available_name(name)
      new_name = name
      new_name = "#{name}-#{SecureRandom.hex(1)}" until User.where(username: new_name).empty?
      new_name
    end
  end

  def individual
    {
      email: email,
      first_name_kanji: first_name,
      last_name_kanji: last_name,
      first_name_kana: first_name_kana,
      last_name_kana: last_name_kana,
      gender: gender,
      phone: "+81#{phone}",
      address_kanji: address_kanji,
      address_kana: address_kana,
      dob: dob,
    }
  end

  def address_kanji
    {
      country: "JP",
      postal_code: address.postal_code,
      state: address.state,
      city: address.city,
      town: address.town,
      line1: address.other,
    }
  end

  def address_kana
    {
      country: "JP",
      postal_code: address.postal_code,
      state: address.state_kana,
      city: address.city_kana,
      town: address.town_kana,
      line1: address.other_kana,
    }
  end

  def dob
    {
      day: birthday.day,
      month: birthday.month,
      year: birthday.year,
    }
  end
end
# rubocop:enable Metrics/ClassLength

# == Schema Information
#
# Table name: users
#
#  id                         :bigint(8)        not null, primary key
#  bio                        :text
#  birthday                   :date
#  confirmation_sent_at       :datetime
#  confirmation_token         :string
#  confirmed_at               :datetime
#  current_sign_in_at         :datetime
#  current_sign_in_ip         :inet
#  email                      :string           default(""), not null
#  email_exists               :boolean          default(TRUE)
#  enable_email               :boolean          default(TRUE)
#  encrypted_password         :string           default(""), not null
#  failed_attempts            :integer          default(0), not null
#  first_name                 :string
#  first_name_kana            :string
#  fullname                   :string
#  gender                     :integer          default("female")
#  last_name                  :string
#  last_name_kana             :string
#  last_sign_in_at            :datetime
#  last_sign_in_ip            :inet
#  locked_at                  :datetime
#  phone                      :string
#  posts_count                :integer          default(0)
#  published                  :boolean          default(TRUE)
#  remember_created_at        :datetime
#  reset_password_sent_at     :datetime
#  reset_password_token       :string
#  sign_in_count              :integer          default(0), not null
#  slug                       :string
#  suspended                  :boolean          default(FALSE)
#  unconfirmed_email          :string
#  unlock_token               :string
#  unread_messages_count      :integer          default(0)
#  unread_notifications_count :integer          default(0)
#  username                   :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  stripe_account_id          :string
#  stripe_customer_id         :string
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#
