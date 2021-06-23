module Admin
  class CategoriesController < Admin::BaseController
    before_action :set_category, only: %i[show edit]

    include Pagination
    include SortableTable

    def index
      categories = policy_scope(Category).order("#{sort_column} #{sort_direction}")
      authorize categories
      @categories_json = json_pagination(categories, CategorySerializer)
    end

    def show
      render json: CategorySerializer.new(@category).serializable_hash
    end

    def new
      @category = Category.new
      authorize @category
    end

    def edit
      @category_json = CategorySerializer.new(@category).serializable_hash
    end

    private

    def set_category
      @category = Category.find(params[:id])
      authorize @category
    end

    def sort_column
      params[:sort] || "position"
    end
  end
end
