class PostImage < ApplicationRecord
  include Uploadable

  acts_as_list scope: :post

  # associations
  belongs_to :post
  has_one_attached :image

  uploadable_field :image, versions: {
    thumb: "216x150",
    middle: "360x220",
    large: "456x360",
  }

  # validation
  validates :description, length: { maximum: 5000 }
  validates :image,
            attached: true,
            size: { less_than: 100.megabytes, message: "は100MB以下にしてください" },
            content_type: { in: ["image/png", "image/jpg", "image/jpeg"], message: "はpng,jpg,jpegにしてください" }
  scope :with_image, -> { eager_load(image_attachment: :blob) }

  def sized(size)
    main_image.variant(combine_options: { resize: Post.sizes[size].to_s, crop: "#{Post.sizes[size]}+0+0", gravity: :center }).processed
  end

  def as_json(_options = {})
    super(methods: :image_url)
  end

  def valid_format?
    rails_representation_url(
      image.variant(strip: true).processed,
      only_path: true,
    )
  rescue
    # FIXME: remove disable comment and create error class
  end
end

# == Schema Information
#
# Table name: post_images
#
#  id          :bigint(8)        not null, primary key
#  description :text
#  position    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  post_id     :bigint(8)
#
# Indexes
#
#  index_post_images_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#
