class Conversation < ApplicationRecord
  include ActsAsSluggable

  belongs_to :reservation
  has_many :messages, dependent: :destroy
  has_one :message, -> {
    order(updated_at: :desc)
  }, inverse_of: :conversation
  has_many :conversation_users, dependent: :destroy
  has_many :users, through: :conversation_users

  scope :by_recent, -> { order(updated_at: :desc) }

  def self.build_between_users(reservation, users)
    conversation = reservation.create_conversation(users: users)
    conversation.messages.create!(sender: reservation.user, body: reservation.initial_message)
  end

  def unread_messages_count(user)
    conversation_users.find_by(user: user)&.unread_messages_count
  end

  def update_unread_counts
    conversation_users.each(&:update_unread_messages_count)
  end

  def other_users(user)
    users.with_avatar - [user]
  end

  def other_user(user)
    (users.with_avatar - [user]).first
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
