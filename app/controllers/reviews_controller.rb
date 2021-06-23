class ReviewsController < ApplicationController
  before_action :set_reservation, only: %w[new]
  before_action :authenticate_user!

  def new
    render json: { errors: "レビューできません" } unless @reservation.reviewable(current_user)
    @reservation_json = ReservationsSerializer.serialize(@reservation)
    @user_json = UserSerializer.serialize(current_user)
    @post_json = PostSerializer.serialize(@reservation.post, { params: { current_user: current_user } })
  end

  private

  def set_reservation
    @reservation = Reservation.find(params[:reservation_id])
  end
end
