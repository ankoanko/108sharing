require "rails_helper"

RSpec.describe ReservationMailer, type: :mailer do
  include ActiveJob::TestHelper
  ActiveJob::Base.queue_adapter = :test

  let(:reservation) { create(:reservation) }

  before { ActionMailer::Base.deliveries.clear }

  after { ActionMailer::Base.deliveries.clear }

  xit "job is created and enqueued" do
    expect do
      ReservationMailer.send_reminder(reservation).deliver_later
    end.to have_enqueued_job.on_queue("mailers")
    # .at((1.week.from_now - 1.day).noon)
  end

  xit "reservation reminder mail is sent" do
    expect do
      perform_enqueued_jobs do
        ReservationMailer.send_reminder(reservation).deliver_later
      end
    end.to change { ActionMailer::Base.deliveries.size }.by(3)
  end

  xit "reservation mail is sent to the right user" do
    perform_enqueued_jobs do
      ReservationMailer.send_reminder(reservation).deliver_later
    end

    mail = ActionMailer::Base.deliveries.last
    expect(mail.to[0]).to eq reservation.user.email
  end

  xit "notification contains correct subject" do
    perform_enqueued_jobs do
      reservation.activities.last.notifications do |_notification|
        ReservationMailer.send_reminder(reservation.activities.first).deliver_later
      end
    end

    mail = ActionMailer::Base.deliveries.last
    expect(mail.subject).to include "reservation reminder"
  end
end
