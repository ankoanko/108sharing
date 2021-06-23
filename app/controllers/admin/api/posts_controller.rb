module Admin
  module API
    class PostsController < Admin::API::BaseController
      before_action :set_post, only: %i[update destroy]

      def create
        @post = current_user.posts.build(post_params)
        authorize(@post)
        if @post.save
          @post_json = PostSerializer.serialize(@post, { params: { current_user: current_user } })

          render json: {
            post: @post_json,
            flush: { message: I18n.t("flash.model.create.success", model: Post.model_name.human), type: :success },
          }, status: :created
        else
          render json: {
            errors: @post.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def update
        authorize(@post)
        @post.tag_ids.clear
        if @post.update(post_params, current_user: current_user)
          @post_json = PostSerializer.serialize(@post, { params: { current_user: current_user } })
          render json: {
            post: @post_json,
            flush: { message: I18n.t("flash.model.update.success", model: Post.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @post.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def destroy
        authorize(@post)
        if @post.destroy
          render json: {
            flush: { message: I18n.t("flash.model.delete.success", model: Post.model_name.human), type: :success },
          }
        else
          render json: {
            errors: @post.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      private

      def set_post
        @post = Post.friendly.find(params[:id])
      end

      def post_params
        params.require(:post).permit(::Post::UPDATABLE_ATTRS)
      end
    end
  end
end
