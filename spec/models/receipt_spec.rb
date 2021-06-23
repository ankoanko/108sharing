require "rails_helper"

RSpec.describe Receipt, type: :model do
  subject { create :receipt }

  xit "has a valid factory" do
    expect(create(:receipt)).to be_valid
  end

  xdescribe "validations" do
    it { is_expected.to validate_uniqueness_of(:no) }
  end

  xdescribe "associations" do
    it { is_expected.to belong_to(:reservation) }
  end
end

# == Schema Information
#
# Table name: receipts
#
#  id             :bigint(8)        not null, primary key
#  name           :string
#  no             :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  reservation_id :bigint(8)
#
# Indexes
#
#  index_receipts_on_reservation_id  (reservation_id)
#
