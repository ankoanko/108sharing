require "rails_helper"

RSpec.describe "Cards", type: :request do
  let(:user) { create(:user) }
  let(:token) { StripeMock.create_test_helper.generate_card_token }
  let(:stripe_helper) { StripeMock.create_test_helper }
  before { StripeMock.start }

  after { StripeMock.stop }

  before do
    sign_in user
    user.create_or_update_stripe_default_card(token)
  end

  describe "Show /card" do
    it "show cards successfully" do
      get settings_card_path
      expect(response).to have_http_status(:ok)
      expect(response.body).to include user.card.last4
    end
  end
end
