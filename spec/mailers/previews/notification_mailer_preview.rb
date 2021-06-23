# Preview all emails at http://localhost:3000/rails/mailers/notification_mailer
class NotificationMailerPreview < ActionMailer::Preview
  def reservation_requested
    # notification = Notification.where(activity_key: "reservation.create").first
    NotificationMailer.reservation_requested(reservation_notification)
  end

  def reservation_approved
    # notification = Notification.where(activity_key: "reservation.approve").first
    NotificationMailer.reservation_approved(reservation_notification)
  end

  def reservation_declined
    # notification = Notification.where(activity_key: "reservation.decline").first
    NotificationMailer.reservation_declined(reservation_notification)
  end

  def reservation_canceled
    # notification = Notification.where(activity_key: "reservation.cancel").first
    NotificationMailer.reservation_canceled(reservation_notification)
  end

  def like_created
    # notification = Notification.where(activity_key: "like.create").first
    NotificationMailer.like_created(like_notification)
  end

  def identification_requested
    # notification = Notification.where(activity_key: "identification.request").first
    NotificationMailer.identification_requested(identification_notification)
  end

  def identification_approved
    # notification = Notification.where(activity_key: "identification.approve").first
    NotificationMailer.identification_approved(identification_notification)
  end

  def identification_declined
    # notification = Notification.where(activity_key: "identification.decline").first
    NotificationMailer.identification_declined(identification_notification)
  end

  private

  def reservation_notification
    Notification.where("activity_key like ?", "%reservation%").first
  end

  def like_notification
    Notification.where("activity_key like ?", "%like%").first
  end

  def identification_notification
    Notification.where("activity_key like ?", "%identification%").first
  end
end
