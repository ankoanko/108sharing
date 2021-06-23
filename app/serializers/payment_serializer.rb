class PaymentSerializer < ApplicationSerializer
  attributes :id, :price, :slug, :paid_at, :canceled_at, :cancel_fee

  has_one :receipt, serializer: ReceiptSerializer
  belongs_to :user, serializer: UserSerializer

  attribute :workflow_state, &:workflow_state_i18n
  attribute :display_price
  # attributes :display_card_brand, :display_card_last4

  attribute :paid_at do |obj|
    I18n.l obj.paid_at, format: :day if obj.paid_at.present?
  end

  attribute :canceled_at do |obj|
    I18n.l obj.canceled_at, format: :day if obj.canceled_at.present?
  end

  attribute :price do |obj|
    obj.price.to_s(:delimited)
  end

  attribute :display_price do |obj|
    if obj.any_cancel_fee?
      obj.cancel_fee.to_s(:delimited)
    else
      obj.price.to_s(:delimited)
    end
  end

  # attribute :display_card_brand do |obj|
  #   obj.user.card.brand
  # end

  # attribute :display_card_last4 do |obj|
  #   obj.user.card.last4
  # end

  def self.opt_include
    [:'user.card', :user, :receipt]
  end
end
