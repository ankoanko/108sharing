require "rails_helper"

RSpec.describe ContactMailer, type: :mailer do
  include ActiveJob::TestHelper

  let(:contact) { create(:contact) }

  xit "job is created and enqueued" do
    ActiveJob::Base.queue_adapter = :test
    expect do
      ContactMailer.notify_to_inquirer(contact.id).deliver_later
    end.to have_enqueued_job.on_queue("mailers")
  end

  xit "contact mail is sent" do
    expect do
      perform_enqueued_jobs do
        ContactMailer.notify_to_inquirer(contact.id).deliver_later
      end
    end.to change { ActionMailer::Base.deliveries.size }.by(1)
  end

  xit "contact mail is sent to the right user" do
    perform_enqueued_jobs do
      ContactMailer.notify_to_inquirer(contact.id).deliver_later
    end

    mail = ActionMailer::Base.deliveries.last
    expect(mail.to[0]).to eq contact.email
    expect(mail.subject).to include "お問い合わせを受け付けました"
    expect(mail.body).to include "お問い合わせを受け付けました"
  end

  xit "send to support" do
    # Setting.mailer_from_default
    # expect(mail.to[0]).to eq contact.email
  end
end
