FactoryBot.define do
  factory :tag do
    name { Faker::Name.name }
    sequence(:position) {|n| n }
  end
end

# == Schema Information
#
# Table name: tags
#
#  id         :bigint(8)        not null, primary key
#  name       :string           not null
#  name_en    :string
#  name_ja    :string
#  position   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
