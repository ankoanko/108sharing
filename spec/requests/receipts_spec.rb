require "rails_helper"

RSpec.describe "Receipts", type: :request do
  describe "GET /receipts" do
    # user名が日本語だとファイル名検証エラーがでるので、アルファベットに変更した
    let(:user) { create(:user, :with_identification_approved, username: "receipt_receiver") }
    let(:reservation) { create(:reservation, user: user) }
    let!(:receipt) { create(:receipt, reservation: reservation) }

    it "successful" do
      sign_in user
      get receipt_path receipt
      expect(response).to have_http_status(:ok)
      expect(response.header["Content-Disposition"]).to match(receipt.reservation.user.username)
    end
  end
end
