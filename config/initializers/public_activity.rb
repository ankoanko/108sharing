PublicActivity::Activity.class_eval do
  has_many :notifications, dependent: :destroy
  has_many :messages, dependent: :destroy
  has_many :payment_histories, dependent: :destroy

  after_commit :create_notifications, :create_messages, :create_payment_history

  def create_notifications
    ::Notification.create_notifications_for_activity(self.id)
  end
  
  def create_messages
    ::Message.create_messages_for_activity(self.id)
  end
  
  def create_payment_history
    ::PaymentHistory.create_payment_histories_for_activity(self.id)
  end
end
