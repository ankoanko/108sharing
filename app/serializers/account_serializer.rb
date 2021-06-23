class AccountSerializer < ApplicationSerializer
  set_type :user
  attributes :id, :username, :bio, :email, :posts_count, :avatar_url,
             :unread_notifications_count, :email_notification,
             :identification_workflow_state, :email_exists, :suspended
  has_many :roles, serializer: RoleSerializer
  has_many :social_profiles, serializer: SocialProfileSerializer

  def self.opt_include
    [:roles, :social_profiles]
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at
  end
end
