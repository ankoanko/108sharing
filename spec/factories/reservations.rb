FactoryBot.define do
  factory :reservation do
    user { create(:user, :with_identification_approved) }
    post
    start_date { 1.week.from_now }
    end_date { 2.week.from_now }
    price { 10000 }

    trait :upcoming do
      start_date { 1.week.from_now }
      end_date { 2.week.from_now }
    end

    trait :requested do
      workflow_state { :requested }
      authorized_at { 1.week.ago }
      stripe_charge_id { "ch_1F1N85AcuXu5XI2SgkRltzIq" }
    end

    trait :approved do
      workflow_state { :approved }
      paid_at { 1.week.ago }
      stripe_charge_id { "ch_1F1N85AcuXu5XI2SgkRltzIq" }
    end

    trait :declined do
      workflow_state { :declined }
      stripe_charge_id { "ch_1F1N85AcuXu5XI2SgkRltzIq" }
    end

    trait :canceled do
      workflow_state { :canceled }
      canceled_at { 1.week.ago }
      stripe_charge_id { "ch_1F1N85AcuXu5XI2SgkRltzIq" }
      stripe_refund_id { "re_1F1N85AcuXu5XI2SgkRltzIq" }
    end
  end
end

# == Schema Information
#
# Table name: reservations
#
#  id               :bigint(8)        not null, primary key
#  authorized_at    :datetime
#  cancel_fee       :integer          default(0)
#  canceled_at      :datetime
#  end_date         :date
#  no               :string
#  paid_at          :datetime
#  price            :integer
#  refund_amount    :integer          default(0)
#  slug             :string
#  start_date       :date
#  workflow_state   :integer          default("requested")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  post_id          :bigint(8)
#  stripe_charge_id :string
#  stripe_refund_id :string
#  user_id          :bigint(8)
#
# Indexes
#
#  index_reservations_on_post_id  (post_id)
#  index_reservations_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#  fk_rails_...  (user_id => users.id)
#
