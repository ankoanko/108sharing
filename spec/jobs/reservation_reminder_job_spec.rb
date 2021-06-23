require "rails_helper"

RSpec.describe ReservationReminderJob, type: :job do
  include ActiveJob::TestHelper
  ActiveJob::Base.queue_adapter = :test
  let(:approved_reservation) { create(:reservation, :approved) }
  let(:declined_reservation) { create(:reservation, :declined) }

  before do
    ActionMailer::Base.deliveries.clear
  end

  after do
    ActionMailer::Base.deliveries.clear
  end

  xit "sends reminder emails to guest and host" do
    ReservationReminderJob.perform_now(approved_reservation)
    expect(ActionMailer::Base.deliveries.count).to eq(3)
  end

  xit "sends reminder emails to guest and host" do
    ReservationReminderJob.perform_now(declined_reservation)
    expect(ActionMailer::Base.deliveries.count).to eq(2)
  end
end
