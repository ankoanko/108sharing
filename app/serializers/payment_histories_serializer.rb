class PaymentHistoriesSerializer < ApplicationSerializer
  attributes :id, :message, :activity_key

  attribute :trackable_id do |obj|
    obj.activity.trackable_id
  end

  attribute :trackable_type do |obj|
    obj.activity.trackable_type
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at.to_date
  end
end
