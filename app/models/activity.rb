class Activity < PublicActivity::Activity
  has_many :notifications

  paginates_per 10

  def title
    trackable.title
  end

  def activity_path
    trackable.activity_path
  end
end

# == Schema Information
#
# Table name: activities
#
#  id             :bigint(8)        not null, primary key
#  key            :string
#  owner_type     :string
#  parameters     :text
#  recipient_type :string
#  trackable_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  owner_id       :bigint(8)
#  recipient_id   :bigint(8)
#  trackable_id   :bigint(8)
#
# Indexes
#
#  index_activities_on_owner_id_and_owner_type          (owner_id,owner_type)
#  index_activities_on_owner_type_and_owner_id          (owner_type,owner_id)
#  index_activities_on_recipient_id_and_recipient_type  (recipient_id,recipient_type)
#  index_activities_on_recipient_type_and_recipient_id  (recipient_type,recipient_id)
#  index_activities_on_trackable_id_and_trackable_type  (trackable_id,trackable_type)
#  index_activities_on_trackable_type_and_trackable_id  (trackable_type,trackable_id)
#
