class Card < ApplicationRecord
  belongs_to :user

  def self.update_payment_fromt_stripe_card(user, stripe_card)
    card = user.card || user.build_card
    card.update(
      stripe_card_id: stripe_card.id,
      fingerprint: stripe_card.fingerprint,
      brand: stripe_card.brand,
      last4: stripe_card.last4,
      exp_month: stripe_card.exp_month,
      exp_year: stripe_card.exp_year,
      cvc_check: stripe_card.cvc_check,
    )
    card
  end

  # In Case has_many association
  def make_as_default(user, customer)
    user.cards.map {|card| card.update(default: false) }
    return if customer.blank?

    customer.default_card = stripe_customer_token
    customer.save && update!(default: true)
  end

  def as_json(_options = {})
    attributes = %w[id brand last4 exp_month exp_year]
    super(only: attributes)
  end
end

# == Schema Information
#
# Table name: cards
#
#  id             :bigint(8)        not null, primary key
#  active         :boolean          default(TRUE), not null
#  brand          :string           not null
#  cvc_check      :string
#  exp_month      :integer
#  exp_year       :integer
#  fingerprint    :string           not null
#  last4          :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  stripe_card_id :string           not null
#  user_id        :bigint(8)        not null
#
# Indexes
#
#  index_cards_on_active          (active)
#  index_cards_on_fingerprint     (fingerprint)
#  index_cards_on_stripe_card_id  (stripe_card_id)
#  index_cards_on_user_id         (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
