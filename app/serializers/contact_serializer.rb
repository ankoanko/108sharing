class ContactSerializer < ApplicationSerializer
  attributes :id, :name, :email, :subject, :body, :status, :note, :user_id, :created_at, :updated_at
  cache_options store: Rails.cache, namespace: "jsonapi-serializer", expires_in: 1.days
end

# == Schema Information
#
# Table name: contacts
#
#  id         :bigint(8)        not null, primary key
#  body       :text
#  email      :string
#  name       :string
#  note       :string
#  status     :integer
#  subject    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :integer
#
