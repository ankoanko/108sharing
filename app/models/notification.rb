class Notification < ApplicationRecord
  include ActionView::Helpers::DateHelper

  belongs_to :activity
  belongs_to :recipient, class_name: "User", foreign_key: "recipient_id", inverse_of: :notifications, optional: true
  before_validation :set_activity_key, on: :create
  after_commit :send_notification, on: :create

  scope :not_messages, -> { where.not(activity_key: NOT_MESSAGES) }
  scope :unread, -> { where(read_at: nil) }
  scope :my_notifications, ->(user) { where(recipient_id: [user.id, nil]) }

  NOT_MESSAGES = [
    "message.create",
    "message.read",
    "identification.request",
    "reservation.approve",
    "payout.create",
    "payout.fail",
    "payout.pay",
    "like.create",
    "like.destroy",
  ].freeze

  TO_ALL = [
    "announcement.create",
  ].freeze

  # rubocop:disable Rails/SkipsModelValidations
  def self.read!(scope)
    scope.unread.update_all(read_at: Time.current)
  end
  # rubocop:enable Rails/SkipsModelValidations

  def self.create_notifications_for_activity(activity_id)
    activity = Activity.find activity_id
    return unless (notification_klass = get_activity_class(activity))

    users = notification_klass.recipients activity
    if TO_ALL.index(activity.key)
      Notification.create(activity: activity)
    else
      users.each {|user| Notification.create(activity: activity, recipient_id: user.id) }
    end
    notify_users users unless NOT_MESSAGES.index(activity.key)
  end

  def self.notify_users(users)
    users.each(&:notify)
  end

  # rubocop:disable Lint/UselessAssignment
  def self.get_recipients_for(activity)
    klass = activity.trackable_type.constantize
    users = klass.get_recipients_for
  end
  # rubocop:enable Lint/UselessAssignment

  def self.get_activity_class(activity)
    class_name = "Notification::#{activity.key.titlecase.delete(".").delete(" ")}"
    class_name.safe_constantize
  end

  def self.activity_preload(notifications)
    activities = notifications.includes(activity: [:trackable]).map(&:activity)
    preloader = ActiveRecord::Associations::Preloader.new
    preloader.preload(activities.select {|activity| activity.trackable_type.eql?(Reservation.name) }, trackable: [:conversation, :post, :user])
  end

  def deliver
    Notificator.new(notifiable).notify if notifiable.notify_condition?
  end

  def title
    Notification.get_activity_class(activity).title(activity)
  end

  def url
    Notification.get_activity_class(activity).url(activity)
  end

  def created_time_ago
    time_ago_in_words(created_at)
  end

  def send_notification
    notification_klass = Notification.get_activity_class(activity)
    if self.recipient.notify_condition? && notification_klass&.respond_to?(:send_notification)
      notification_klass.send_notification(self)
    end
  end

  def set_activity_key
    self.activity_key = activity.key if activity
  end
end

# == Schema Information
#
# Table name: notifications
#
#  id            :bigint(8)        not null, primary key
#  activity_key  :string
#  activity_type :string
#  read_at       :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  activity_id   :bigint(8)
#  recipient_id  :integer
#
# Indexes
#
#  index_notifications_on_activity_type_and_activity_id  (activity_type,activity_id)
#
