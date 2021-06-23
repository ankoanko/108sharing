require "rails_helper"

RSpec.describe ReviewReply, type: :model do
  xit "has a valid factory" do
    expect(create(:review_reply)).to be_valid
  end

  describe "associations" do
    it { is_expected.to belong_to(:review) }
    it { is_expected.to belong_to(:user) }
  end
end

# == Schema Information
#
# Table name: review_replies
#
#  id         :bigint(8)        not null, primary key
#  body       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  review_id  :bigint(8)
#  user_id    :bigint(8)
#
# Indexes
#
#  index_review_replies_on_review_id  (review_id)
#  index_review_replies_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (review_id => reviews.id)
#  fk_rails_...  (user_id => users.id)
#
