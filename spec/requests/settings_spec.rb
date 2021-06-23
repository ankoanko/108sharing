require "rails_helper"

RSpec.describe "Settings", type: :request do
  let(:user) { create(:user) }

  before do
    sign_in user
  end

  describe "Update /settings" do
    it "update email_notification from false to true" do
      user.email_notification = false
      params = { email_notification: true }
      expect {
        patch settings_setting_path, params: { settings: params }
      }.to change { user.email_notification }.from(false).to(true)
    end

    it "update email_notification from true to false" do
      user.email_notification = true
      params = { email_notification: false }
      expect {
        patch settings_setting_path, params: { settings: params }
      }.to change { user.email_notification }.from(true).to(false)
    end
  end
end
