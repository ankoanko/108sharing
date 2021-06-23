require "rails_helper"

RSpec.describe "Api::Cards", type: :request do
  let(:user) { create(:user) }
  let(:token) { StripeMock.create_test_helper.generate_card_token }
  let(:stripe_helper) { StripeMock.create_test_helper }
  before { StripeMock.start }

  after { StripeMock.stop }

  before do
    sign_in user
  end

  describe "Post /card" do
    context "when create card is failed" do
      # Todo strpe mock gemの確認
      xit "invalid card info" do
        invalid_token = StripeMock.prepare_card_error(:card_declined)
        expect {
          post api_card_path, params: { stripeToken: invalid_token }
        }.to change { Card.count }.by(0)
      end
    end

    context "when stripe customer id not present" do
      it "create cards" do
        visa_params = { number: "4242424242424242", exp_month: 9, exp_year: 2024, cvc: "999" }
        visa_token = StripeMock.create_test_helper.generate_card_token(visa_params)

        expect {
          post api_card_path, params: { stripeToken: visa_token }
        }.to change { Card.count }.by(1)
        expect(response).to have_http_status(:ok)
        expect(json.card.last4).to eq visa_params[:number][-4, 4]
        expect(json.card.exp_month).to eq visa_params[:exp_month]
        expect(json.card.exp_year).to eq visa_params[:exp_year]
      end
    end

    context "when stripe customer id present" do
      before do
        user.create_stripe_customer
      end

      it "create cards" do
        master_params = { number: "5555555555554444", exp_month: 12, exp_year: 2023, cvc: "999" }
        master_token = StripeMock.create_test_helper.generate_card_token(master_params)

        expect {
          post api_card_path, params: { stripeToken: master_token }
        }.to change { Card.count }.by(1)

        expect(response).to have_http_status(:ok)
        expect(json.card.last4).to eq master_params[:number][-4, 4]
        expect(json.card.exp_month).to eq master_params[:exp_month]
        expect(json.card.exp_year).to eq master_params[:exp_year]
      end
    end

    context "when stripe customer id and card present" do
      let(:customer) { Stripe::Customer.create(source: token, email: user.email) }
      let(:update_token) { StripeMock.create_test_helper.generate_card_token }

      before do
        user.create_or_update_stripe_default_card(token)
      end

      it "create cards" do
        expect {
          post api_card_path, params: { stripeToken: update_token }
        }.to change(user.card, :stripe_card_id)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
