module Admin
  class PostsController < Admin::BaseController
    before_action :set_post, only: %i[show]

    include Pagination
    include SortableTable

    def index
      posts = policy_scope(Post).order("#{sort_column} #{sort_direction}")

      authorize posts

      @posts_json = json_pagination(
        posts,
        Admin::PostsSerializer,
        {},
        ::Post::ADMIN_POSTS_COUNT,
      )
    end

    def show
      post = PostSerializer.serialize(@post)
      # json_success_response(
      #   @post,
      #   Admin::PostSerializer
      # )
      render json: post
    end

    def new
      @post = Post.new
    end

    def edit
    end

    private

    def set_post
      # @post = Post.with_image.find(params[:id])
      @post = Post.with_images.find(params[:id])
      authorize @post
    end

    def sort_column
      params[:sort] || "id"
    end
  end
end
