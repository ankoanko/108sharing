require "rails_helper"

RSpec.describe PostImage, type: :model do
  subject { create :post_image, :with_image }

  it "has a valid factory" do
    expect(subject).to be_valid
  end

  describe "associations" do
    it { is_expected.to belong_to(:post) }
  end

  describe "acts_as_list" do
    let!(:post_image3) { create(:post_image, :with_image, post: post2) }
    let!(:post_image2) { create(:post_image, :with_image, post: post1) }
    let!(:post_image1) { create(:post_image, :with_image, post: post1) }
    let!(:post2) { create(:post) }
    let!(:post1) { create(:post) }
    describe "schema" do
      it { should have_db_column(:position).of_type(:integer) }
    end

    it "increasing position in scope post" do
      expect(post_image1.position).to eq 2
      expect(post_image2.position).to eq 1
      expect(post_image3.position).to eq 1
    end
  end
end

# == Schema Information
#
# Table name: post_images
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  post_id     :bigint(8)
#
# Indexes
#
#  index_post_images_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#
