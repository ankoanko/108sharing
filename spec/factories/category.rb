FactoryBot.define do
  factory :category do
    name { Faker::Name.name }
    sequence(:position) {|n| n }
  end
end
