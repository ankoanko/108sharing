require "rails_helper"

RSpec.describe "Admin::Api::Settings", type: :request do
  let(:admin) { create(:user, :admin) }

  before do
    sign_in admin
  end

  describe "Update /settings" do
    it "update default_site" do
      Setting.default_site = "site"
      params = { default_site: "update_site" }
      expect {
        patch admin_api_setting_path, params: params
      }.to change { Setting.default_site }.from("site").to("update_site")
    end
  end
end
