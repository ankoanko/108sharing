class ConversationsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_conversation, only: %i[show destroy]
  after_action :verify_authorized

  def create
    users = User.find(params[:user_ids])
    conversation = Conversation.between(users)
    authorize conversation
    render json: { conversation: conversation, redirect_path: conversation_path(conversation) }
  end

  def show
    messages = @conversation.messages.by_recent.with_sender.with_file_attachment
    @messages_json = MessagesSerializer.serializer_array(messages, { params: { current_user: current_user } })
    @other_user_json = UserSerializer.serialize(@conversation.other_user(current_user))
    @user_json = UserSerializer.serialize(current_user)
  end

  def new
    @conversation = Conversation.new
    authorize @conversation
  end

  def destroy
    @conversation.destroy!
    redirect_to conversations_url, notice: "Conversation was successfully destroyed."
  end

  private

  def set_conversation
    @conversation = Conversation.friendly.find(params[:id])
    authorize @conversation
  end

  # Only allow a trusted parameter "white list" through.
  def conversation_params
    params.require(:conversation).permit(:slug)
  end
end
