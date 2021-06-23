require "rails_helper"

RSpec.describe Review, type: :model do
  subject { create :review }

  xdescribe "has a valid factory" do
    it { is_expected.to be_valid }
  end

  xdescribe "associations" do
    it { is_expected.to belong_to(:reservation) }
    it { is_expected.to belong_to(:reviewer) }
  end

  describe "validations" do
    # it { is_expected.to validate_presence_of(:body).with_message "can't be blank" }
    # it { is_expected.to validate_length_of(:body).is_at_most(10_000) }
  end
end

# == Schema Information
#
# Table name: reviews
#
#  id              :bigint(8)        not null, primary key
#  body            :text
#  rating          :integer          not null
#  reviewable_type :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  reservation_id  :bigint(8)
#  reviewable_id   :bigint(8)        not null
#  reviewer_id     :integer
#
# Indexes
#
#  index_reviews_on_reservation_id                     (reservation_id)
#  index_reviews_on_reviewable_type_and_reviewable_id  (reviewable_type,reviewable_id)
#
# Foreign Keys
#
#  fk_rails_...  (reservation_id => reservations.id)
#
