class ConversationSerializer < ApplicationSerializer
  attributes :id, :slug

  has_one :reservation, serializer: ReservationsSerializer
  has_many :messages, serializer: MessageSerializer

  attribute :other_user do |obj, params|
    obj.other_user(params[:current_user])
  end

  def self.opt_include
    []
  end
end

# == Schema Information
#
# Table name: conversations
#
#  id             :bigint(8)        not null, primary key
#  messages_count :integer          default(0), not null
#  slug           :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  reservation_id :bigint(8)
#
# Indexes
#
#  index_conversations_on_reservation_id  (reservation_id)
#  index_conversations_on_slug            (slug) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (reservation_id => reservations.id)
#
