FactoryBot.define do
  factory :review do
    body { "MyString" }
    rating { 1 }
    reviewer { create(:user, :with_identification_approved) }
    reviewable { reservation }
    reservation
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
