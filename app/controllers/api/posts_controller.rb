module API
  class PostsController < API::ApplicationController
    before_action :set_post, only: %w[update toggle_like publish close calculate]
    before_action :authenticate_user!, only: %w[create update toggle_like toggle_status publish]
    after_action :verify_authorized

    include SortableTable
    include Pagination

    # rubocop:disable Metrics/AbcSize
    def create
      authorize Post
      post = current_user.posts.build(post_params)
      if post.save
        flash[:success] = I18n.t("flash.model.create.success", model: Post.model_name.human)
        post_json = PostSerializer.serialize(post, { params: { current_user: current_user } })

        render json: {
          post: post_json,
          edit_post_path: edit_post_path(post, active: "address"),
        }, status: :created
      else
        flash[:alert] = I18n.t("flash.model.create.failure", model: Post.model_name.human)
        render json: { errors: post.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end
    # rubocop:enable Metrics/AbcSize

    def update
      authorize(@post)
      @post.tag_ids.clear
      if @post.update(post_params, current_user: current_user)
        post_json = PostSerializer.serialize(@post, { params: { current_user: current_user } })
        render json: {
          post: post_json,
          flush: { message: I18n.t("flash.model.update.success", model: Post.model_name.human), type: :success },
        }
      else
        render json: { errors: @post.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    def toggle_like
      authorize(@post)
      if current_user.voted_for?(@post)
        @post.unliked_by current_user
        @post.create_unlike_activity current_user
      else
        @post.liked_by current_user
        @post.create_like_activity current_user
      end
      render json: { like: {
        likes_count: @post.get_likes.size,
        user_liked: current_user.voted_for?(@post),
      } }
    end

    def search
      set_master
      posts = policy_scope(Post).with_reviews.search(
        params[:keywords],
        search_params,
        params[:bounds],
        set_duration_params,
      ).page(params[:page]).order("#{sort_column} #{sort_direction}")

      authorize posts
      option = { params: { current_user: current_user } }
      posts_json = json_pagination(
        posts,
        PostsSerializer,
        option,
      )
      render json: { posts: posts_json }
    end

    def calculate
      authorize(@post)
      price = @post.price_calculator(set_duration_params)
      render json: { price: price }
    end

    # 使ってない？
    def toggle_status
      authorize(@post)
      @post.toggle_status!
    end

    # TODO: updateでもadminからはaasm_stateが更新できるようになっていてstateの操作系統が複数あるのでどちらかに統一する
    def publish
      authorize(@post)
      @post.publish
      @post.save!
      post_json = PostSerializer.serialize(@post, { params: { current_user: current_user } })
      render json: {
        post: post_json,
        post_path: edit_post_path(@post),
        status: :ok,
        flush: { message: I18n.t("flash.model.update.success", model: Post.model_name.human), type: :success },
      }
    end

    def close
      authorize(@post)
      @post.close(current_user)
      if @post.save
        post_json = PostSerializer.serialize(@post, { params: { current_user: current_user } })
        render json: {
          post: post_json,
          post_path: edit_post_path(@post),
          status: :ok,
          flush: { message: I18n.t("flash.model.update.success", model: ::Post.model_name.human), type: :success },
        }
      else
        render json: { errors: @post.errors.full_messages.join(",") }, status: :unprocessable_entity
      end
    end

    private

    def set_post
      @post = Post.friendly.find(params[:id])
    end

    def set_master
      @categories = CategorySerializer.serializer_array(Category.all.by_position)
      @tags = TagSerializer.serializer_array(Tag.all.by_position)
      @conditions = ConditionSerializer.serializer_array(Condition.all.by_position)
    end

    def set_tag
      @tag = Tag.find(params[:tag_id])
    end

    def post_params
      params.require(:post).permit(::Post::UPDATABLE_ATTRS)
    end

    def sort_direction
      %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
    end

    def search_params
      params.permit(
        :min_price,
        :max_price,
        category_ids: [],
        tag_ids: [],
      )
    end

    def set_duration_params
      params.permit(
        :start_date,
        :end_date,
      )
    end
  end
end
