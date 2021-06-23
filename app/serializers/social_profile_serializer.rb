class SocialProfileSerializer < ApplicationSerializer
  attributes :provider
end

# == Schema Information
#
# Table name: social_profiles
#
#  id           :bigint(8)        not null, primary key
#  access_token :string
#  description  :text
#  email        :string
#  image_url    :string
#  name         :string
#  nickname     :string
#  provider     :integer          not null
#  uid          :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint(8)        not null
#
# Indexes
#
#  index_social_profiles_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
