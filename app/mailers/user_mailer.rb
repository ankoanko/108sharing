class UserMailer < Devise::Mailer
  helper :application
  include Devise::Controllers::UrlHelpers
  layout "mailer"
  default template_path: "devise/mailer"
  default from: Setting.mailer_from_default
  default reply_to: Setting.mailer_from_default
end
