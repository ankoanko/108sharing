module API
  class PostImagesController < API::ApplicationController
    before_action :find_post_image, only: %i[update destroy]

    def create
      post_image = PostImage.new(post_image_params)
      post_image.save!
      if post_image.valid_format?
        post_image_json = PostImageSerializer.serialize(post_image)
        render json: {
          post_image: post_image_json,
          flush: { message: I18n.t("flash.model.create.success", model: PostImage.model_name.human), type: :success },
        }
      else
        post_image.destroy!
        render json: {
          post_image: post_image,
          flush: { message: "image_error", type: :error },
        }
      end
    end

    def update
      if @post_image.update(post_image_params)
        post_image_json = PostImageSerializer.serialize(@post_image)
        render json: {
          post_image: post_image_json,
          flush: { message: I18n.t("flash.model.update.success", model: PostImage.model_name.human), type: :success },
        }
      else
        render json: {
          post_image: @post_image,
          flush: { message: @post_image.errors.full_messages.join(","), type: :error },
        }
      end
    end

    def destroy
      if @post_image.destroy
        post_image_json = PostImageSerializer.serialize(@post_image)
        render json: {
          post_image: post_image_json,
          flush: { message: I18n.t("flash.model.delete.success", model: PostImage.model_name.human), type: :success },
        }
      else
        render json: @post_image.errors, status: :unprocessable_entity
      end
    end

    private

    def find_post_image
      @post_image = PostImage.find params[:id]
    end

    def post_image_params
      params.require(:post_image).permit(
        :post_id, :position, :image, :description
      )
    end
  end
end
