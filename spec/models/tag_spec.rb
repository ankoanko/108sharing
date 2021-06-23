require "rails_helper"

RSpec.describe Tag, type: :model do
  subject { create :tag }

  it "has a valid factory" do
    expect(create(:tag)).to be_valid
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:name).with_message "can't be blank" }
    it { is_expected.to validate_uniqueness_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(50) }
    it { is_expected.to validate_uniqueness_of(:position) }
  end

  describe "associations" do
    it { is_expected.to have_many(:posts) }
  end

  describe ".scope" do
    let!(:tag1) { create(:tag, position: 2) }
    let!(:tag2) { create(:tag, position: 1) }
    it "by_sort" do
      expect(Tag.by_position).to eq [tag2, tag1]
    end
  end
end

# == Schema Information
#
# Table name: tags
#
#  id         :bigint(8)        not null, primary key
#  name       :string           not null
#  name_en    :string
#  name_ja    :string
#  position   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
