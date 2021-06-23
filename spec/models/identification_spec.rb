require "rails_helper"

RSpec.describe Identification, type: :model do
  subject { create :identification }

  describe "has a valid factory" do
    it "has a valid factory" do
      expect(create(:identification)).to be_valid
    end
  end

  describe "associations" do
    it { is_expected.to belong_to(:user) }
  end

  describe "enums" do
    it { is_expected.to define_enum_for(:workflow_state).with(%i[requested approved declined]) }
  end
end

# == Schema Information
#
# Table name: identifications
#
#  id             :bigint(8)        not null, primary key
#  description    :text
#  workflow_state :integer          default("requested"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :bigint(8)
#
# Indexes
#
#  index_identifications_on_user_id  (user_id)
#
