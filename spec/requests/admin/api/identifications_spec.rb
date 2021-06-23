require "rails_helper"

describe "Admin Identifications", type: :request do
  describe "PUT #approve" do
    let(:admin) { create(:user, :admin) }
    let!(:identification) { create(:identification, workflow_state: :requested) }
    # let(:valid_params) { attributes_for(:category, name: "after_test_name" ) }

    context "with valid attributes" do
      context "update by admin" do
        it "update workflow_state to approved" do
          sign_in admin
          expect do
            put approve_admin_api_identification_path identification
          end.to change { Identification.find(identification.id).workflow_state }.from(:requested.to_s).to(:approved.to_s)

          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "PUT #decline" do
    let(:admin) { create(:user, :admin) }
    let!(:identification) { create(:identification, workflow_state: :requested) }
    # let(:valid_params) { attributes_for(:category, name: "after_test_name" ) }

    context "with valid attributes" do
      context "update by admin" do
        it "update workflow_state to declined" do
          sign_in admin
          expect do
            put decline_admin_api_identification_path identification
          end.to change { Identification.find(identification.id).workflow_state }.from(:requested.to_s).to(:declined.to_s)

          expect(response).to have_http_status(:ok)
        end
      end
    end
  end
end
