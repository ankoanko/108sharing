class NotificationMailer < ApplicationMailer
  default from: Setting.mailer_from_default

  def reservation_requested(notification)
    @notification = Notification.find(notification.id)
    @reservation = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.reservation.created")
    template_name = "reservation_requested"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def reservation_approved(notification)
    @notification = Notification.find(notification.id)
    @reservation = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.reservation.approved")
    template_name = "reservation_approved"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def reservation_declined(notification)
    @notification = Notification.find(notification.id)
    @reservation = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.reservation.declined")
    template_name = "reservation_declined"
    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def reservation_canceled(notification)
    @notification = Notification.find(notification.id)
    @reservation = notification.activity.trackable
    @user = notification.recipient
    @owner = @reservation.post.user

    template_name = if @owner == @user
                      "reservation_canceled_from_host"
                    else
                      "reservation_canceled_from_guest"
                    end
    subject = I18n.t("notification.reservation.canceled")
    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def review_requested(notification)
  end

  def review_created(notification)
  end

  def review_reply_created(notification)
  end

  def like_created(notification)
    @notification = Notification.find(notification.id)
    @like = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.like.created")
    template_name = "like_created"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def identification_requested(notification)
    @notification = Notification.find(notification.id)
    @identification = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.identification.requested")
    template_name = "identification_requested"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def identification_approved(notification)
    @notification = Notification.find(notification.id)
    @identification = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.identification.approved")
    template_name = "identification_approved"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def identification_declined(notification)
    @notification = Notification.find(notification.id)
    @identification = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.identification.declined")
    template_name = "identification_declined"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def contact_created(notification)
    @notification = Notification.find(notification.id)
    @contact = notification.activity.trackable
    @user = notification.recipient
    subject = I18n.t("notification.contact.created", subject: @contact.subject)
    template_name = "contact_created_receiver"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def message_created(notification)
    @notification = Notification.find(notification.id)
    @conversation = @notification.activity.trackable
    @user = @notification.recipient
    subject = I18n.t("notification.message.created", username: @conversation.sender.username)
    template_name = "message_created"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def post_closed(notification)
    @notification = Notification.find(notification.id)
    @post = @notification.activity.trackable
    @user = @notification.recipient
    subject = I18n.t("notification.post.closed")
    template_name = "post_closed"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def payout_created(notification)
    @notification = Notification.find(notification.id)
    @payout = @notification.activity.trackable
    @user = @notification.recipient
    subject = I18n.t("notification.payout.created")
    template_name = "payout_created"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def payout_failed(notification)
    @notification = Notification.find(notification.id)
    @payout = @notification.activity.trackable
    @user = @notification.recipient
    @owner = @payout.user
    subject = I18n.t("notification.payout.failed")
    template_name = "payout_failed"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def payout_paid(notification)
    @notification = Notification.find(notification.id)
    @payout = @notification.activity.trackable
    @user = @notification.recipient
    subject = I18n.t("notification.payout.paid")
    template_name = "payout_paid"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def function_updated(notification)
    @notification = Notification.find(notification.id)
    @user = @notification.recipient
    subject = I18n.t("notification.function_updated")
    template_name = "function_updated"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def service_maintenanced(notification)
    @notification = Notification.find(notification.id)
    @user = @notification.recipient
    subject = I18n.t("notification.service_maintenanced")
    template_name = "service_maintenanced"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end

  def holiday_announce(notification)
    @notification = Notification.find(notification.id)
    @user = @notification.recipient
    subject = I18n.t("notification.holiday_announce")
    template_name = "holiday_announce"

    mail(to: @user.email, subject: subject, template_name: template_name)
  end
end
