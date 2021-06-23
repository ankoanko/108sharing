class ReservationsController < ApplicationController
  before_action :authenticate_user!

  def index
  end

  def new
    set_post
    @reservation = @post.reservations.build
  end

  def show
    reservation = Reservation.friendly.find(params[:id])
    @conversation = reservation.conversation
    messages = @conversation.messages.with_sender.with_file_attachment
    @messages_json = MessagesSerializer.serializer_array(messages, { params: { current_user: current_user } })
    @other_user_json = UserSerializer.serialize(@conversation.other_user(current_user))
    @user_json = UserSerializer.serialize(current_user)
    @reservation_json = ReservationsSerializer.serialize(reservation, { params: { current_user: current_user } })
    @receipt_id = reservation.receipt.try("id")
  end

  private

  def set_post
    @post = Post.friendly.find(params[:post_id])
  end
end
