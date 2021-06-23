# == Schema Information
#
# Table name: contacts
#
#  id         :bigint(8)        not null, primary key
#  body       :text
#  email      :string
#  name       :string
#  note       :string
#  status     :integer
#  subject    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :integer
#

require "rails_helper"

RSpec.describe Contact, type: :model do
  it "has a valid factory" do
    expect(create(:contact)).to be_valid
  end

  describe "validations" do
    it { is_expected.to validate_presence_of :name }
    it { is_expected.to validate_presence_of :email }
    it { is_expected.to validate_presence_of :subject }
    it { is_expected.to validate_presence_of :body }
    it { should validate_email_format_of(:email).with_message("Invalid Email Format") }
  end
end
