class Payout < ApplicationRecord
  # Stripe document
  # Current status of the payout: paid, pending, in_transit, canceled or failed.
  # A payout is pending until it is submitted to the bank,when it becomes in_transit.
  # The status then changes to paid if the transaction goes through,
  # or to failed or canceled (within 5 business days).
  # Some failed payouts may initially show as paid but then change to failed.
  include PublicActivity::Model
  belongs_to :user

  enum status: { pending: 0, paid: 1, in_transit: 2, canceled: 3, failed: 4 }

  validate :check_payout_available, on: :create

  def created_by!(user)
    create_activity key: "payout.create", owner: user
  end

  def failed_by!
    update(failed_at: DateTime.current)
    create_activity key: "payout.fail", owner: user
  end

  def paid_by!
    update(paid_at: DateTime.current)
    create_activity key: "payout.pay", owner: user
  end

  def strip_payout
    return nil if stripe_payout_id.blank?

    Stripe::Payout.retrieve(
      stripe_payout_id,
      { stripe_account: user.stripe_account_id },
    )
  end

  def create_stripe_payout
    Stripe::Payout.create(
      {
        amount: amount,
        currency: currency,
        metadata: {
          user_id: user.slug,
        },
      },
      { stripe_account: user.stripe_account_id },
    )
  end

  def update_by_remote(_strip_payout = nil)
    payout = _strip_payout || strip_payout
    return nil if payout.blank?

    status_changed = payout.status != status
    update(
      stripe_payout_id: payout.id,
      status: payout.status,
      failure_code: payout.failure_code,
      failure_message: payout.failure_message,
      arrival_date: Time.zone.at(payout.arrival_date),
    )

    return unless status_changed

    if paid?
      self.paid_by!
    elsif failed?
      self.failed_by!
    end
  end

  private

  # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity
  def check_payout_available
    # identification
    if user.stripe_account_id.blank? || user.identification.blank?
      errors.add(:base, I18n.t("activerecord.errors.messages.identification.not_register"))
    elsif user.identification.requested?
      errors.add(:base, I18n.t("activerecord.errors.messages.identification.validating"))
    elsif user.identification.declined?
      errors.add(:base, I18n.t("activerecord.errors.messages.identification.declined"))
    end

    # bank account
    if user.bank_account.blank?
      errors.add(:base, I18n.t("activerecord.errors.messages.bank.not_register_bank_account"))
    elsif ["new", "verified"].exclude?(user.stripe_external_account.try("status"))
      # https://stripe.com/docs/api/external_account_bank_accounts/object#account_bank_account_object-status
      errors.add(:base, I18n.t("activerecord.errors.messages.bank.not_accepted"))
    end

    # balance
    errors.add(:base, I18n.t("activerecord.errors.messages.balance.insufficient")) if errors.blank? && amount > user.available_balance
  end
  # rubocop:enable Metrics/AbcSize, Metrics/PerceivedComplexity
end

# == Schema Information
#
# Table name: payouts
#
#  id               :bigint(8)        not null, primary key
#  amount           :integer          default(0), not null
#  arrival_date     :date
#  currency         :string           default("jpy")
#  failed_at        :datetime
#  failure_code     :string
#  failure_message  :text
#  paid_at          :datetime
#  status           :integer          default("pending")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  stripe_payout_id :string
#  user_id          :bigint(8)
#
# Indexes
#
#  index_payouts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
