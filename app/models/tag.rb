class Tag < ApplicationRecord
  has_many :taggings, dependent: :restrict_with_error
  has_many :posts, through: :taggings, source: :taggable, source_type: "Post"

  validates :name, presence: true, length: { maximum: 50 }, uniqueness: { case_sensitive: true }
  validates :position, presence: true, uniqueness: true

  extend ActsAsLocalizable
  acts_as_column_i18n :name
  RESPONSE_ATTRS = %i[id].freeze

  scope :by_position, -> { order(position: :asc) }
end

# == Schema Information
#
# Table name: tags
#
#  id         :bigint(8)        not null, primary key
#  name       :string           not null
#  name_en    :string
#  name_ja    :string
#  position   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
