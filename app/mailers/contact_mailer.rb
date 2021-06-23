class ContactMailer < ApplicationMailer
  default from: Setting.mailer_from_default

  def notify_to_inquirer(contact)
    @contact = contact
    subject = "お問い合わせを受け付けました"
    template_name = "notify_to_inquirer"

    mail(to: @contact.email, subject: subject, template_name: template_name)
  end
end
