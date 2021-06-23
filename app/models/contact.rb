class Contact < ApplicationRecord
  # TODO: user_idにrelation貼っていないのでそのユーザーIDが正しいという保証がないので修正検討
  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, email_format: { message: "Invalid Email Format" }
  validates :subject, presence: true, length: { maximum: 100 }
  validates :body, presence: true, length: { maximum: 5000 }

  include PublicActivity::Model
  tracked only: %i[create]

  def created!
    create_activity key: "contact.created"
  end
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
