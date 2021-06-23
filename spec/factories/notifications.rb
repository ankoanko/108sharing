FactoryBot.define do
  factory :notification do
    activity
    recipient { create(:user) }
  end
end

# == Schema Information
#
# Table name: notifications
#
#  id            :bigint(8)        not null, primary key
#  activity_key  :string
#  activity_type :string
#  read_at       :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  activity_id   :bigint(8)
#  recipient_id  :integer
#
# Indexes
#
#  index_notifications_on_activity_type_and_activity_id  (activity_type,activity_id)
#
