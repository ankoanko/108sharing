module Admin
  class UsersController < Admin::BaseController
    before_action :set_user, only: %i[show edit]

    include Pagination
    include SortableTable

    def index
      users = policy_scope(User).with_roles.with_avatar.order("#{sort_column} #{sort_direction}")
      authorize users
      @users_json = json_pagination(users, Admin::UserSerializer)
    end

    def show
      @posts = Post.where(user_id: @user.id)
    end

    def new
      @user = User.new
      authorize @user
    end

    def edit
      @user_json = Admin::UserSerializer.serialize(@user)
    end

    private

    def set_user
      @user = User.find(params[:id])
      authorize @user
    end

    def sort_column
      params[:sort] || "id"
    end
  end
end
