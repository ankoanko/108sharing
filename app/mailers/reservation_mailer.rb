class ReservationMailer < ApplicationMailer
  default from: Setting.mailer_from_default

  def send_reminder(notification)
    @reservation = notification.activity.trackable
    @user = notification.recipient
    @owner = @reservation.post.user
    if @owner == @user
      subject = "Your Reservation has been Reserved!"
      template_name = "reservation_remind_host"
    else
      subject = "New Reservation has been Requested!"
      template_name = "reservation_remind_guest"
    end

    subject = "Reservation reminder"
    mail(to: @reservation.user.email, subject: subject)
  end
end
