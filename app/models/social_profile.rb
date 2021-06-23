class SocialProfile < ApplicationRecord
  belongs_to :user

  ENABLE_PROVIDERS = %i[facebook twitter google_oauth2].freeze
  enum provider: { facebook: 0, twitter: 1, google_oauth2: 2, stripe_connect: 3 }

  def self.find_or_initialize_by_omniauth(auth)
    find_or_initialize_by(provider: auth.provider, uid: auth.uid) do |profile|
      policy = profile.provider_policy(auth)
      profile.email = policy.email
      profile.name = policy.name
      profile.nickname = policy.nickname
      profile.description = policy.description
      profile.image_url = policy.image_url
    end
  end

  def provider_policy(auth)
    class_name = provider.to_s.classify
    "OAuthPolicy::#{class_name}".constantize.new(auth)
  end
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
