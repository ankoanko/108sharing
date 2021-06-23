class ReservationReminderJob < ApplicationJob
  queue_as :mailers

  def perform(notification)
    reservation = notification.activity.trackable

    ReservationMailer.send_reminder(notification).deliver_now if reservation.approved?
  end
end
