class LastReadChannel < ApplicationCable::Channel
  def subscribed
    update_last_read_at
  end

  def unsubscribed
  end

  def update(data)
    update_last_read_at
  end

  private

  def update_last_read_at
    conversation_id = params[:conversation_id]
    conversation_user = current_user.conversation_users.find_by(conversation_id: conversation_id)
    conversation_user.update_last_read_at
  end
end
