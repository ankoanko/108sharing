class ReservationsSerializer < ApplicationSerializer
  attributes :id, :post_name, :start_date, :end_date, :price, :slug, :workflow_state, :workflow_state_i18n

  has_one :conversation, serializer: ConversationSerializer
  has_one :receipt, serializer: ReceiptSerializer
  belongs_to :post, serializer: PostSerializer
  belongs_to :user, serializer: UserSerializer

  attribute :reviewable do |obj, params|
    current_user = params[:current_user]
    if current_user
      obj.reviewable(current_user)
    end
  end

  attribute :next_work_flow_state do |obj, params|
    current_user = params[:current_user]
    if current_user
      obj.next_work_flow(current_user)
    end
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

  attribute :canceled_at do |obj|
    I18n.l obj.canceled_at if obj.canceled_at.present?
  end

  attribute :price do |obj|
    obj.price.to_s(:delimited)
  end

  def self.opt_include
    [:conversation, :receipt, :user, :'user.roles', :post, :'post.user', :'post.post_images']
  end
end
