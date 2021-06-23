require "rails_helper"

RSpec.describe "Receipts", type: :request do
  describe "POST /receipts" do
    context "with valid attributes" do
      let(:user) { create(:user, :with_identification_approved) }
      let(:reservation) { create(:reservation, user: user) }
      let(:receipt_attrs) { attributes_for(:receipt).merge(reservation_id: reservation.id) }

      it "is successful" do
        sign_in user
        post api_receipts_path, params: { receipt: receipt_attrs }
        expect(response).to have_http_status(:ok)
        expect(json.receipt.data.id.to_i).to eq Receipt.last.id
      end
    end
  end
end
