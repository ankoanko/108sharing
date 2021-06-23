FactoryBot.define do
  factory :post_image do
    post

    description { Faker::Lorem.sentence }
    # Dont need
    # sequence(:position) {|n| n }

    trait :with_image do
      image { fixture_file_upload(Rails.root.join("spec", "fixtures", "images", "demo_1.jpg"), filename: "demo_1.jpg") }
    end
  end
end

# == Schema Information
#
# Table name: post_images
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  post_id     :bigint(8)
#
# Indexes
#
#  index_post_images_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#
