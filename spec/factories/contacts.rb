FactoryBot.define do
  factory :contact do
    name { Faker::Name.name }
    sequence(:email) {|n| "user_#{n}@example.com" }
    subject { "Just a subject test." }

    body { "Just a body test." }
    status { 1 }
    note { "MyString" }
    # trait :with_user do
    #   user_id { create(user) }
    # end
  end
end

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
