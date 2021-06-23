module Admin
  class UserSerializer < Admin::ApplicationSerializer
    attributes :id, :email, :bio, :username, :posts_count,
               :unread_notifications_count, :email, :email_notification,
               :fullname, :birthday, :gender, :gender_i18n, :phone, :published,
               :email_exists
    has_many :roles, serializer: Admin::RoleSerializer

    def self.opt_include
      [:roles] #:'reviews.reviews_replies'
    end

    attribute :suspended do |obj|
      obj.suspended.to_s
    end
  end
end
