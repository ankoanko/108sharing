module Admin
  module API
    class TagsController < Admin::API::BaseController
      before_action :set_tag, only: %i[update destroy]

      def create
        @tag = Tag.new(tag_params)
        authorize @tag
        if @tag.save
          render json: {
            tag: TagSerializer.new(@tag).serializable_hash,
            flush: { message: I18n.t("flash.model.create.success", model: Tag.model_name.human), type: :success },
          }, status: :created
        else
          render json: {
            errors: @tag.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def update
        if @tag.update(tag_params)
          render json: {
            tag: TagSerializer.new(@tag).serializable_hash,
            flush: { message: I18n.t("flash.model.update.success", model: Tag.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @tag.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def destroy
        if @tag.destroy
          render json: {
            flush: { message: I18n.t("flash.model.delete.success", model: Tag.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @tag.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      private

      def set_tag
        @tag = Tag.find(params[:id])
        authorize @tag
      end

      def tag_params
        params.require(:tag).permit(:name, :name_ja, :name_en, :position)
      end
    end
  end
end
