require "rails_helper"

RSpec.describe "SocialProfiles", type: :request do
  let(:user) { create(:user) }

  before do
    sign_in user
    post "/users/auth/facebook/callback"
  end

  describe "Delete /api/social_profiles" do
    it "create review successfully" do
      expect(user.social_profiles).not_to eq []
      expect {
        delete api_social_profile_path user.social_profiles.last.provider
      }.to change { SocialProfile.count }.by(-1)
      expect(user.reload.social_profiles).to eq []
    end
  end
end
