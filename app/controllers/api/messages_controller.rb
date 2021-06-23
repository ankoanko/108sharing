module API
  class MessagesController < API::ApplicationController
    before_action :authenticate_user!

    def create
      message = Message.new(message_params)
      conversation = message.conversation

      if message.save
        conversation.update_unread_counts
        broadcast(message)

        render json: { message: MessageSerializer.serialize(message) }
      else
        render json: message.errors
      end
    end

    private

    def message_params
      params.require(:message).permit(:conversation_id, :sender_id, :body, :file)
    end

    def broadcast(message)
      ActionCable.server.broadcast "conversations:#{message.conversation.id}",
                                   conversation_id: message.conversation.id,
                                   user_id: message.sender.id,
                                   message: message,
                                   serialized_message: MessageSerializer.serialize(message),
                                   created_at: message.created_at.to_date
    end
  end
end
