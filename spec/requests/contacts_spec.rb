require "rails_helper"

# TODO: apiフォルダに移動する、api/contacts_controllerの内容でテスト内容を書き直す
xdescribe "Contacts", type: :request do
  describe "Post /contacts" do
    let(:contact_attrs) { attributes_for(:contact) }
    it "send email to sidekiq" do
      expect {
        post contacts_path, params: { contact: contact_attrs }
      }.to change { Contact.count }.by(1)

      expect(ContactNotiferJob).to have_been_enqueued
      # ContactNotiferJob

      # expect {
      #   post contacts_path, params: { contact: contact_attrs }
      # }.to change( Sidekiq::Worker.jobs, :size ).by(1)
      # ActionMailer::Base.deliveries.clear
      # expect(ContactMailer.deliveries.size).to eq 1
    end
  end
end
