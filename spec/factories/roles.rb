FactoryBot.define do
  factory :role do
  end

  trait :role_admin do
    name { "admin" }
  end

  trait :role_guest do
    name { "guest" }
  end

  trait :role_host do
    name { "host" }
  end
end

# == Schema Information
#
# Table name: roles
#
#  id         :bigint(8)        not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_roles_on_name  (name) UNIQUE
#
