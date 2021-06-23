FactoryBot.define do
  factory :receipt do
    reservation
    name { "MyString" }
    no { "MyString" }
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
