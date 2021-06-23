class MessageSerializer < ApplicationSerializer
  attributes :id, :body, :file_attached, :file_url, :activity_id
  # :sender_username, :sender_avatar_url, :file_attached, :file_url

  belongs_to :sender, record_type: :user, serializer: UserSerializer

  attribute :body do |obj|
    obj.activity_message || obj.body
  end

  attribute :sent_at do |obj|
    I18n.l obj.sent_at, format: :short
  end

  def self.opt_include
    [:sender]
  end
end

# == Schema Information
#
# Table name: messages
#
#  id              :bigint(8)        not null, primary key
#  activity_key    :string
#  activity_type   :string
#  body            :string           not null
#  read_at         :datetime
#  sent_at         :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  activity_id     :bigint(8)
#  conversation_id :integer          not null
#  recipient_id    :integer
#  sender_id       :integer
#
# Indexes
#
#  index_messages_on_activity_id                    (activity_id)
#  index_messages_on_activity_type_and_activity_id  (activity_type,activity_id)
#  index_messages_on_conversation_id                (conversation_id)
#  index_messages_on_recipient_id                   (recipient_id)
#  index_messages_on_sender_id                      (sender_id)
#
