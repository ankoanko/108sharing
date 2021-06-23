class UserSerializer < ApplicationSerializer
  set_type :user
  attributes :id, :username, :bio, :posts_count, :avatar_url, :unread_notifications_count,
             :email_notification, :identification_workflow_state, :reviews_count,
             :fullname, :birthday, :gender, :gender_i18n, :phone, :published,
             :email_exists, :suspended

  # has_one :identification, serializer: IdentificationSerializer
  has_one :card, serializer: CardSerializer
  has_many :roles, serializer: RoleSerializer

  attribute :email do |obj, params|
    obj.email if obj.id == params[:current_user]&.id
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at, format: :month
  end

  def self.opt_include
    [:roles]
  end
end

# == Schema Information
#
# Table name: users
#
#  id                         :bigint(8)        not null, primary key
#  bio                        :text
#  birthday                   :date
#  confirmation_sent_at       :datetime
#  confirmation_token         :string
#  confirmed_at               :datetime
#  current_sign_in_at         :datetime
#  current_sign_in_ip         :inet
#  email                      :string           default(""), not null
#  email_exists               :boolean          default(TRUE)
#  enable_email               :boolean          default(TRUE)
#  encrypted_password         :string           default(""), not null
#  failed_attempts            :integer          default(0), not null
#  first_name                 :string
#  first_name_kana            :string
#  fullname                   :string
#  gender                     :integer          default("female")
#  last_name                  :string
#  last_name_kana             :string
#  last_sign_in_at            :datetime
#  last_sign_in_ip            :inet
#  locked_at                  :datetime
#  phone                      :string
#  posts_count                :integer          default(0)
#  published                  :boolean          default(TRUE)
#  remember_created_at        :datetime
#  reset_password_sent_at     :datetime
#  reset_password_token       :string
#  sign_in_count              :integer          default(0), not null
#  slug                       :string
#  suspended                  :boolean          default(FALSE)
#  unconfirmed_email          :string
#  unlock_token               :string
#  unread_messages_count      :integer          default(0)
#  unread_notifications_count :integer          default(0)
#  username                   :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  stripe_account_id          :string
#  stripe_customer_id         :string
#
# Indexes
#
#  index_users_on_confirmation_token    (confirmation_token) UNIQUE
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_unlock_token          (unlock_token) UNIQUE
#
