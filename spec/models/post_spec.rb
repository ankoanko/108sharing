require "rails_helper"

RSpec.describe Post, type: :model do
  it "has a valid factory" do
    expect(create(:post)).to be_valid
  end

  describe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:category).optional }
    it { is_expected.to belong_to(:condition).optional }
    it { is_expected.to have_one(:post_image) }
    it { is_expected.to have_many(:post_images) }
    it { is_expected.to have_many(:taggings) }
    it { is_expected.to have_many(:reservations) }
    it { is_expected.to have_many(:reviews) }
    it { is_expected.to have_many(:calendars) }
  end

  # describe 'validation' do
  #   it { is_expected.to validate_presence_of(:body).with_message "can't be blank" }
  #   it { is_expected.to validate_length_of(:name).is_at_most(100) }
  #   it { is_expected.to validate_length_of(:name).is_at_most(5000) }
  # end

  describe ".scope" do
    describe ".recent" do
      let!(:post1) { create(:post, published_at: Time.current.yesterday) }
      let!(:post2) { create(:post, published_at: Time.current) }
      it do
        expect(Post.recent).to eq [post2, post1]
      end
    end
  end

  describe ".before_validation" do
    let(:post) { create :post }

    it ".ensure_slug" do
      expect(post.slug.length).to eq 16
    end
  end

  it "Post登録時にUserレコードがカウント増加していること" do
    user = create(:user)
    post = create(:post, user: user)
    expect(user.reload.posts_count).to eq 1
  end
end

# == Schema Information
#
# Table name: posts
#
#  id            :bigint(8)        not null, primary key
#  aasm_state    :integer          default("draft")
#  capacity      :string
#  city          :string
#  country       :string
#  currency      :string           default("jpy")
#  description   :text
#  functionality :string
#  instant       :integer          default("request"), not null
#  integer       :integer          default(0)
#  latitude      :float
#  likes_count   :integer          default(0), not null
#  longitude     :float
#  name          :string           not null
#  note          :text
#  price         :integer          default(0), not null
#  published_at  :datetime
#  reviews_count :integer          default(0)
#  size          :string
#  slug          :string
#  state         :string
#  street1       :string
#  street2       :string
#  zipcode       :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :bigint(8)
#  condition_id  :bigint(8)
#  user_id       :bigint(8)
#
# Indexes
#
#  index_posts_on_category_id   (category_id)
#  index_posts_on_condition_id  (condition_id)
#  index_posts_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (condition_id => conditions.id)
#  fk_rails_...  (user_id => users.id)
#
