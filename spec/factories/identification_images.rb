FactoryBot.define do
  factory :identification_image do
    identification
    position { 1 }
    description { "MyText" }

    trait :with_image do
      image { fixture_file_upload(Rails.root.join("spec", "fixtures", "images", "license.jpg"), filename: "license.jpg") }
    end
  end
end

# == Schema Information
#
# Table name: identification_images
#
#  id                :bigint(8)        not null, primary key
#  description       :text
#  position          :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  identification_id :bigint(8)
#
# Indexes
#
#  index_identification_images_on_identification_id  (identification_id)
#
# Foreign Keys
#
#  fk_rails_...  (identification_id => identifications.id)
#
