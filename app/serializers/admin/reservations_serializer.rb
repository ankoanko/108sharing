module Admin
  class ReservationsSerializer < Admin::ApplicationSerializer
    attributes :id,
               :post_name,
               :start_date,
               :end_date,
               :workflow_state,
               :price,
               :paid_at,
               :slug,
               :stripe_refund_id,
               :stripe_charge_id,
               :canceled_at,
               :created_at,
               :updated_at,
               :refund_amount,
               :authorized_at,
               :workflow_state

    belongs_to :post, serializer: PostSerializer
    belongs_to :user, serializer: UserSerializer

    def self.opt_include
      [:user, :post]
    end

    attribute :start_date do |obj|
      I18n.l obj.start_date, format: :day
    end

    attribute :end_date do |obj|
      I18n.l obj.end_date, format: :day
    end

    attribute :created_at do |obj|
      I18n.l obj.created_at, format: :day
    end

    attribute :updated_at do |obj|
      I18n.l obj.updated_at, format: :day
    end

    attribute :paid_at do |obj|
      I18n.l obj.paid_at, format: :day if obj.paid_at.present?
    end

    attribute :canceled_at do |obj|
      I18n.l obj.canceled_at, format: :day if obj.canceled_at.present?
    end

    attribute :price do |obj|
      obj.price.to_s(:delimited)
    end
  end
end
