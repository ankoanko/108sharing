case
when Rails.env.development?
  Rails.application.routes.default_url_options = { host: "localhost", port: 3000 }
  Rails.application.config.default_url_options = { host: "localhost", port: 3000 }
  ActionMailer::Base.default_url_options = { host: "localhost", port: 3000 }
  ActionMailer::Base.delivery_method = :letter_opener
  ActionMailer::Base.perform_deliveries = true
  ActionMailer::Base.raise_delivery_errors = true

when Rails.env.test?
  Rails.application.routes.default_url_options = { host: "localhost", port: 3000 }
  Rails.application.config.default_url_options = { host: "localhost", port: 3000 }
  ActionMailer::Base.default_url_options = { host: "localhost", port: 3000 } # Setup for devise
  ActionMailer::Base.delivery_method = :test
  ActionMailer::Base.perform_deliveries = true
  ActionMailer::Base.raise_delivery_errors = true

when Rails.env.production?
  Rails.application.routes.default_url_options = { host: ENV['APP_HOST'], protocol: 'https' }
  Rails.application.config.default_url_options = { host: ENV['APP_HOST'] }
  Rails.application.config.action_cable.allowed_request_origins = [ "https://#{ENV['APP_HOST']}" ]
  Rails.application.config.hosts << ENV['APP_HOST']
  Rails.application.config.hosts << IPAddr.new(ENV['VPC_CIDR']) if ENV['VPC_CIDR'] # to pass healthcheck from ALB. (e.g. VPC_CIDR=10.1.0.0/16
  ActionMailer::Base.default_url_options = { host: ENV['APP_HOST'] }

  if ENV["AWS_SES"].present?
    ActionMailer::Base.delivery_method = :aws_sdk

    Aws::Rails.add_action_mailer_delivery_method(
        :aws_sdk,
        credentials: Aws::Credentials.new(ENV["AWS_ACCESS_KEY_ID"], ENV['AWS_SECRET_ACCESS_KEY']),
        region: 'ap-northeast-1'
    )
  elsif ENV['SENDGRID_USERNAME'].present? && ENV['SENDGRID_PASSWORD'].present?
    # Use SengGrid on Heroku
    ActionMailer::Base.delivery_method = :smtp
    ActionMailer::Base.smtp_settings = {
        :address        => 'smtp.sendgrid.net',
        :port           => '587',
        :authentication => :plain,
        :user_name      => ENV['SENDGRID_USERNAME'],
        :password       => ENV['SENDGRID_PASSWORD'],
        :domain         => 'heroku.com',
        :enable_starttls_auto => true
    }
  else
    # Use Mailtrap when sendgrid is not available
    ActionMailer::Base.delivery_method = :smtp
    ActionMailer::Base.smtp_settings = {
      :user_name => 'xxxxxxxxxxxxx',
      :password => 'xxxxxxxxxxxxx',
      :address => 'smtp.mailtrap.io',
      :domain => 'smtp.mailtrap.io',
      :port => '2525',
      :authentication => :cram_md5
    }
  end
end
