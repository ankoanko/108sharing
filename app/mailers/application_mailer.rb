class ApplicationMailer < ActionMailer::Base
  default from: Setting.mailer_from_default
  layout "mailer"

  def set_url_locale
    (I18n.locale == I18n.default_locale) ? nil : I18n.locale
  end
end
