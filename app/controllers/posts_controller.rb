class PostsController < ApplicationController
  before_action :set_post, only: %i[show edit close reopen toggle_status]
  before_action :authenticate_user!, only: %i[index new close reopen toggle_status]
  after_action :verify_authorized, only: %i[new close reopen toggle_status]

  include SortableTable
  include Pagination

  def index
    posts = policy_scope(current_user.posts).with_category.with_image.with_reviews.with_tags.order("#{sort_column} #{sort_direction}")
    authorize posts

    option = { params: { current_user: current_user } }
    @posts_json = json_pagination(
      posts,
      PostsSerializer,
      option,
    )
  end

  def search
    set_master
    posts = policy_scope(Post).in_public.with_reviews.search(
      params[:keywords],
      search_params,
      params[:bounds],
      set_duration_params,
    ).page(params[:page]).order("#{sort_column} #{sort_direction}")

    authorize posts
    option = { params: { current_user: current_user } }
    @posts_json = json_pagination(
      posts,
      PostsSerializer,
      option,
    )
  end

  def show
    @post_json = PostSerializer.serialize(@post, { params: { current_user: current_user } })
    # return unless @post.owner? current_user
    impressionist(@post, nil) if @post.impressions.where(session_hash: session.to_hash["session_id"]).empty?
  end

  def new
    post = Post.new
    authorize(post)
    set_master
    @post_json = PostSerializer.serialize(post, { params: { current_user: current_user } })
  end

  def edit
    set_master
    authorize(@post)
    @post_json = PostSerializer.serialize(@post, { params: { current_user: current_user } })
  end

  # 　使ってない？
  def close
    authorize(@post)
    @post.close!
    redirect_back(fallback_location: root_path)
  end

  # 　使ってない？
  def toggle_status
    authorize(@post)
    @post.toggle_status!
  end

  # 　使ってない？
  def reopen
    authorize(@post)
    @post.reopen!
    redirect_back(fallback_location: root_path)
  end

  private

  def set_post
    @post = Post.friendly.find(params[:id])
    not_found if current_user&.id != @post.user_id && !@post.active?
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
