module Admin
  module API
    class CategoriesController < Admin::API::BaseController
      before_action :set_category, only: %i[update destroy]

      def create
        @category = Category.new(category_params)
        authorize @category
        if @category.save
          render json: {
            category: CategorySerializer.new(@category).serializable_hash,
            flush: { message: I18n.t("flash.model.create.success", model: Category.model_name.human), type: :success },
          }, status: :created
        else
          render json: {
            errors: @category.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def update
        if @category.update(category_params)
          render json: {
            category: CategorySerializer.new(@category).serializable_hash,
            flush: { message: I18n.t("flash.model.update.success", model: Category.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @category.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      def destroy
        if @category.destroy
          render json: {
            flush: { message: I18n.t("flash.model.delete.success", model: Category.model_name.human), type: :success },
          }, status: :ok
        else
          render json: {
            errors: @category.errors.full_messages.join(","),
          }, status: :unprocessable_entity
        end
      end

      private

      def set_category
        @category = Category.find(params[:id])
        authorize @category
      end

      def category_params
        params.require(:category).permit(:name, :name_ja, :name_en, :position)
      end
    end
  end
end
