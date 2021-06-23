require "rails_helper"

RSpec.describe Message, type: :model do
  subject { create :message }

  xdescribe "has a valid factory" do
    it { is_expected.to be_valid }
  end

  xdescribe "associations" do
    it { is_expected.to belong_to(:conversation) }
    it { is_expected.to belong_to(:sender) }
  end

  xdescribe "validations" do
    it { is_expected.to validate_presence_of(:body).with_message "can't be blank" }
    it { is_expected.to validate_length_of(:body).is_at_most(10_000) }
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
