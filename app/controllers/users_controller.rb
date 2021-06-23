class UsersController < ApplicationController
  before_action :set_user, only: [:show]

  include SortableTable
  include Pagination

  def edit
    authorize User
    @user = AccountSerializer.serialize(current_user)
  end

  def profile
    authorize User
    @account_json = AccountSerializer.serialize(current_user)
    render "settings/profile"
  end

  def show
    authorize @user
    option = { params: { current_user: current_user } }
    @user_json = UserSerializer.serialize(@user, option)

    # TODO: use API for pagination
    @posts_json = posts_json
    @reviews_json = reviews_json
  end

  private

  def user_params
    params.require(:user).permit(
      :username, :avatar
    )
  end

  def set_user
    @user = User.friendly.find(params[:id])
    not_found unless @user.host?
    not_found if current_user != @user && !@user.active?
  end

  def posts_json
    posts = policy_scope(@user.posts.published).with_category.with_image.with_tags.with_reviews.order("#{sort_column} #{sort_direction}")
    json_pagination(
      posts,
      PostsSerializer,
      { params: { current_user: current_user }, page: params[:page_post] || 1 },
    )
  end

  def reviews_json
    reviews = @user.received_reviews.with_reviewer.with_review_reply.with_reservation.order("#{sort_column} #{sort_direction}")
    json_pagination(
      reviews,
      ReviewSerializer,
      { params: { current_user: current_user }, page: params[:page_review] || 1 },
    )
  end
end
