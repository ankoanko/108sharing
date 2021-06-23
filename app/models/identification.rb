class Identification < ApplicationRecord
  include PublicActivity::Model

  belongs_to :user
  has_many :identification_images, -> { includes([image_attachment: :blob]) }, inverse_of: :identification, dependent: :destroy
  validates :description, length: { maximum: 5000 }

  enum workflow_state: %i[requested approved declined].freeze

  def requested_by!(user)
    create_activity key: "identification.request", owner: user
  end

  def approved_by!(user)
    create_activity key: "identification.approve", owner: user
  end

  def declined_by!(user)
    create_activity key: "identification.decline", owner: user
  end
end

# == Schema Information
#
# Table name: identifications
#
#  id             :bigint(8)        not null, primary key
#  description    :text
#  workflow_state :integer          default("requested"), not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  user_id        :bigint(8)
#
# Indexes
#
#  index_identifications_on_user_id  (user_id)
#
