module Admin
  class TagsController < Admin::BaseController
    before_action :set_tag, only: %i[show edit]

    include Pagination
    include SortableTable

    def index
      tags = policy_scope(Tag).order("#{sort_column} #{sort_direction}")
      authorize tags
      @tags_json = json_pagination(tags, TagSerializer)
    end

    def show
      render json: TagSerializer.new(@tag).serializable_hash
    end

    def new
      @tag = Tag.new
      authorize @tag
    end

    def edit
      @tag_json = TagSerializer.new(@tag).serializable_hash
    end

    private

    def set_tag
      @tag = Tag.find(params[:id])
      authorize @tag
    end

    def sort_column
      params[:sort] || "position"
    end
  end
end
