class PostImageSerializer < ApplicationSerializer
  attributes :id, :position, :description, :image_url, :image_attached

  belongs_to :post, serializer: PostsSerializer do |_post_image, params|
    if params[:current_user].present?
      true
    end
    # 以下だと500エラーになる
    # params[:current_user].present? ? true : false
  end

  attribute :created_at do |obj|
    I18n.l obj.created_at
  end

  attribute :updated_at do |obj|
    I18n.l obj.updated_at
  end

  def self.opt_include
    [:post]
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
