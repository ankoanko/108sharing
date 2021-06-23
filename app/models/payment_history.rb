class PaymentHistory < ApplicationRecord
  belongs_to :activity
  belongs_to :recipient, class_name: "User", foreign_key: "recipient_id", optional: true
  before_validation :set_activity_key, on: :create

  scope :recent, -> { order(created_at: :desc) }
  scope :with_activity, -> { includes(activity: [:trackable]) }

  def message
    PaymentHistory.get_activity_class(activity).message(self)
  end

  def self.create_payment_histories_for_activity(activity_id)
    activity = Activity.find activity_id
    return unless (payment_history_klass = get_activity_class(activity))

    users = payment_history_klass.recipients activity
    users.each do |user|
      PaymentHistory.create(activity: activity, recipient_id: user.id)
    end
  end

  private

  class << self
    def get_activity_class(activity)
      class_name = "PaymentHistory::#{activity.key.titlecase.delete(".").delete(" ")}"
      class_name.safe_constantize
    end
  end

  def set_activity_key
    self.activity_key = activity.key if activity
  end
end

# == Schema Information
#
# Table name: payment_histories
#
#  id            :bigint(8)        not null, primary key
#  activity_key  :string
#  activity_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  activity_id   :bigint(8)
#  recipient_id  :integer
#
# Indexes
#
#  index_payment_histories_on_activity_type_and_activity_id  (activity_type,activity_id)
#
