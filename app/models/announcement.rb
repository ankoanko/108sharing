class Announcement < ApplicationRecord
  include PublicActivity::Model
  tracked only: [:create], owner: proc {|_controller, model| model.user }

  belongs_to :user

  scope :recent, -> { order("created_at desc") }
  validates :title, presence: true, length: { maximum: 100 }
end

# == Schema Information
#
# Table name: announcements
#
#  id         :bigint(8)        not null, primary key
#  body       :text
#  publish_at :datetime
#  title      :string
#  url        :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint(8)
#
# Indexes
#
#  index_announcements_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
