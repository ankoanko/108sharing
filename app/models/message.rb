class Message < ApplicationRecord
  include Uploadable
  include PublicActivity::Model
  tracked only: %i[create], owner: proc {|_controller, model| model.sender }

  belongs_to :activity, optional: true
  belongs_to :sender, class_name: "User"
  belongs_to :recipient, class_name: "User", optional: true
  belongs_to :conversation

  before_validation :set_sent_at, on: :create
  after_create :update_conversation_unread

  validates :body, presence: true, length: { maximum: 10_000 }

  scope :by_recent, -> { order(created_at: :asc) }

  scope :with_sender, -> { includes([{ sender: [:avatar_attachment] }]) }
  scope :with_recipient, -> { includes(:recipient) }
  scope :with_file_attachment, -> { includes(:file_attachment) }
  scope :as_recipient, ->(user) { where(recipient_id: [user.id, nil]) }

  uploadable_field :file, versions: {
    thumb: "216x150",
    middle: "360x220",
    large: "456x360",
  }

  delegate :username, :avatar_url, to: :sender, prefix: true, allow_nil: true

  def self.send_notification(_notification)
    nil
  end

  def self.get_activity_class(activity)
    class_name = "ActivityMessage::#{activity.key.titlecase.delete(".").delete(" ")}"
    class_name.safe_constantize
  end

  # rubocop:disable Metrics/MethodLength
  def self.create_messages_for_activity(activity_id)
    activity = Activity.find activity_id
    return unless (activity_message_klass = get_activity_class(activity))

    conversation = activity_message_klass.conversation activity
    users = activity_message_klass.recipients activity
    users.each do |user|
      message = Message.new(
        conversation_id: conversation.id,
        activity_id: activity.id,
        recipient_id: user.id,
        body: "activity",
        sent_at: DateTime.current,
      )
      message.save(validate: false)

      ActionCable.server.broadcast "conversations:#{message.conversation.id}",
                                   conversation_id: message.conversation.id,
                                   user_id: nil,
                                   message: message,
                                   serialized_message: MessageSerializer.serialize(message),
                                   created_at: message.created_at.to_date,
                                   recipient_id: user.id
    end
  end
  # rubocop:enable Metrics/MethodLength

  def read_by!(user)
    return if user == sender

    create_activity key: "message.read", owner: user, recipient: conversation
  end

  def read?
    activities.where(key: "message.read").any?
  end

  def read_by?(user)
    activities.where(key: "message.read", owner: user).any?
  end

  def set_sent_at
    self.sent_at = Time.current
  end

  def formatted_sent_time
    sent_at.strftime("%Y/%m/%d %H:%M")
  end

  def default_file_path
    nil
  end

  def activity_message
    return nil if activity_id.blank? || recipient_id.blank?

    Message.get_activity_class(activity)&.message(activity, recipient)
  end

  private

  def update_conversation_unread
    conversation.update_unread_counts
  end
end

# == Schema Information
#
# Table name: messages
#
#  id              :bigint(8)        not null, primary key
#  activity_key    :string
#  activity_type   :string
#  body            :string           not null
#  read_at         :datetime
#  sent_at         :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  activity_id     :bigint(8)
#  conversation_id :integer          not null
#  recipient_id    :integer
#  sender_id       :integer
#
# Indexes
#
#  index_messages_on_activity_id                    (activity_id)
#  index_messages_on_activity_type_and_activity_id  (activity_type,activity_id)
#  index_messages_on_conversation_id                (conversation_id)
#  index_messages_on_recipient_id                   (recipient_id)
#  index_messages_on_sender_id                      (sender_id)
#
