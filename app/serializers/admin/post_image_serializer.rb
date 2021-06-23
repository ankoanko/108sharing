module Admin
  class PostImageSerializer < Admin::ApplicationSerializer
    attributes :position, :description, :image_url
  end
end
