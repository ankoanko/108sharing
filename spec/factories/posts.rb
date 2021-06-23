FactoryBot.define do
  factory :post do
    name { Faker::Book.title }
    description { Faker::Lorem.sentence }
    price { 10000 }
    user
    category
  end
end

# == Schema Information
#
# Table name: posts
#
#  id            :bigint(8)        not null, primary key
#  aasm_state    :integer          default("draft")
#  capacity      :string
#  city          :string
#  country       :string
#  currency      :string           default("jpy")
#  description   :text
#  functionality :string
#  instant       :integer          default("request"), not null
#  integer       :integer          default(0)
#  latitude      :float
#  likes_count   :integer          default(0), not null
#  longitude     :float
#  name          :string           not null
#  note          :text
#  price         :integer          default(0), not null
#  published_at  :datetime
#  reviews_count :integer          default(0)
#  size          :string
#  slug          :string
#  state         :string
#  street1       :string
#  street2       :string
#  zipcode       :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  category_id   :bigint(8)
#  condition_id  :bigint(8)
#  user_id       :bigint(8)
#
# Indexes
#
#  index_posts_on_category_id   (category_id)
#  index_posts_on_condition_id  (condition_id)
#  index_posts_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (condition_id => conditions.id)
#  fk_rails_...  (user_id => users.id)
#
