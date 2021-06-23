class FavoritesController < ApplicationController
  before_action :authenticate_user!

  include Pagination
  include SortableTable

  def index
    favorite_post_ids = current_user.find_voted_items.pluck(:id)
    posts = Post.where(id: favorite_post_ids).with_image.with_category.with_reviews.with_user.with_tags.order("#{sort_column} #{sort_direction}")

    option = { params: { current_user: current_user } }

    @posts_json = json_pagination(
      posts,
      PostsSerializer,
      option,
    )
  end
end
