namespace :daily do
  desc "run daily tasks"
  task run: :environment do
    Rails.logger.info("Start DailyJob======================================")
    Rails.logger.info("End DailyJob======================================")
  end
end

namespace :hourly do
  desc "run daily tasks"
  task run: :environment do
    Rails.logger.info("Start HourJob======================================")
    Rails.logger.info("End DailyJob======================================")
  end
end
