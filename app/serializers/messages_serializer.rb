class MessagesSerializer < ApplicationSerializer
  attributes :id, :body, :file_attached, :file_url
  # :sender_username, :sender_avatar_url, :file_attached, :file_url

  belongs_to :conversation, serializer: ConversationSerializer
  belongs_to :sender, record_type: :user, serializer: UserSerializer

  attribute :sent_at do |obj|
    I18n.l obj.sent_at, format: :short
  end

  attribute :other do |obj, params|
    obj.sender == params[:current_user]
  end

  def self.opt_include
    [:'conversation.reservation', :conversation, :sender]
  end
end
