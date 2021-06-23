FactoryBot.define do
  factory :activity do
    trait :with_reservation_create do
      trackable factory: :reservation
      owner factory: :user
      key { "reservation.create" }
    end
  end
end
