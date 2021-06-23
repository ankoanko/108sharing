require "rails_helper"

RSpec.describe ConversationUser, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
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
