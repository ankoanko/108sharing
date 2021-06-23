module Admin
  class PostSerializer < Admin::ApplicationSerializer
    attributes :id, :slug, :name, :description, :price, :aasm_state, :published_at, :latitude, :longitude

    has_many :post_images, serializer: Admin::PostImageSerializer
    has_many :tags, serializer: Admin::TagSerializer
    has_many :reviews, serializer: Admin::ReviewSerializer

    def self.opt_include
      [:tags, :post_images, :reviews] #:'reviews.reviews_replies'
    end
  end
end
