require "rails_helper"

RSpec.describe Conversation, type: :model do
  subject { create :conversation }

  xdescribe "has a valid factory" do
    it { is_expected.to be_valid }
  end

  xdescribe "associations" do
    it { is_expected.to have_many(:users) }
    it { is_expected.to have_many(:conversation_users) }
    it { is_expected.to have_many(:messages) }
    it { is_expected.to have_one(:message) }
    it { is_expected.to belong_to(:reservation) }
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
