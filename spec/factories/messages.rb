FactoryBot.define do
  factory :message do
    sender { create(:user) }
    conversation
    body { "MyText" }
    sent_at { "2019-03-15 07:08:57" }
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
