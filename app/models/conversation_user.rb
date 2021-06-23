class ConversationUser < ApplicationRecord
  belongs_to :conversation
  belongs_to :user
  counter_culture :user, column_name: "unread_messages_count", delta_column: "unread_messages_count"

  validates :user_id, uniqueness: { scope: :conversation_id }

  def activities
    PublicActivity::Activity.where(recipient: conversation).where(owner: user)
  end

  def update_unread_messages_count
    self.unread_messages_count = other_messages.count - read_activities.count
    save!
  end

  def update_last_read_at
    update!(last_read_at: Time.current)
    other_messages.where("updated_at < ?", read_at).find_each {|message| message.read_by!(user) }
    conversation.update_unread_counts
  end

  private

  def read_activities
    activities.where(key: "message.read")
  end

  def other_messages
    conversation.messages.where.not(sender: user)
  end
end

# == Schema Information
#
# Table name: conversation_users
#
#  id                    :bigint(8)        not null, primary key
#  last_read_at          :datetime
#  unread_messages_count :integer          default(0), not null
#  unread_notified       :boolean          default(FALSE), not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  conversation_id       :integer
#  user_id               :bigint(8)
#
# Indexes
#
#  index_conversation_users_on_conversation_id              (conversation_id)
#  index_conversation_users_on_conversation_id_and_user_id  (conversation_id,user_id) UNIQUE
#  index_conversation_users_on_unread_notified              (unread_notified)
#  index_conversation_users_on_user_id                      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
