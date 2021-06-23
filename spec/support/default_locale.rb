RSpec.configure do |config|
  config.before(:suite) { I18n.locale = :en }
end
