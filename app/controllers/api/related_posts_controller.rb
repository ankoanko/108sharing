module API
  class RelatedPostsController < API::ApplicationController
    include SortableTable
    include Pagination
    def show
      target_post = Post.find params[:id]
      posts = policy_scope(Post).related_posts(target_post.id).order("#{sort_column} #{sort_direction}")
      authorize posts

      option = { params: { current_user: current_user } }
      posts_json = json_pagination(
        posts,
        PostsSerializer,
        option,
        ::Post::RELATED_POSTS_COUNT,
      )
      render json: posts_json
    end
  end
end
