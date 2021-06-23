require "rails_helper"

RSpec.describe "Identifications", type: :request do
  describe "POST create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:user) { create(:user) }
        let!(:identification) { create(:identification, user: user) }

        it "is successful" do
          sign_in user
          get settings_identification_path
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end
end
