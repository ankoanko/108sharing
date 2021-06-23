require "rails_helper"

RSpec.describe Notification, type: :model do
  it "has a valid factory" do
    expect(build(:notification)).to be_valid
  end

  describe "associations" do
    it { expect(build(:notification)).to belong_to(:recipient).class_name("User").optional }
  end
end

# == Schema Information
#
# Table name: notifications
#
#  id            :bigint(8)        not null, primary key
#  activity_key  :string
#  activity_type :string
#  read_at       :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  activity_id   :bigint(8)
#  recipient_id  :integer
#
# Indexes
#
#  index_notifications_on_activity_type_and_activity_id  (activity_type,activity_id)
#
