class IdentificationImage < ApplicationRecord
  include Uploadable

  belongs_to :identification

  has_one_attached :image

  uploadable_field :image, versions: {
    thumb: "216x150",
    middle: "360x220",
    large: "456x360",
  }

  # scope :with_image, -> { eager_load(image_attachment: :blob) }
  validates :image,
            attached: true,
            size: { less_than: 100.megabytes, message: "は100MB以下にしてください" },
            content_type: { in: ["image/png", "image/jpg", "image/jpeg"], message: "はpng,jpg,jpegにしてください" }
  validates :description, length: { maximum: 5000 }
end

# == Schema Information
#
# Table name: identification_images
#
#  id                :bigint(8)        not null, primary key
#  description       :text
#  position          :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  identification_id :bigint(8)
#
# Indexes
#
#  index_identification_images_on_identification_id  (identification_id)
#
# Foreign Keys
#
#  fk_rails_...  (identification_id => identifications.id)
#
