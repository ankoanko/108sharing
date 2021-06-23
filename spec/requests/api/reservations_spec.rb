require "rails_helper"

describe "Reservations", type: :request do
  describe "POST create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        before { StripeMock.start }

        after { StripeMock.stop }

        let(:user) { create(:user, :with_identification_approved) }
        let(:reservation) { create(:reservation, user: user) }

        let(:stripe_helper) { StripeMock.create_test_helper }
        let(:stripe_customer) do
          Stripe::Customer.create(
            email: user.email,
            source: stripe_helper.generate_card_token,
          )
        end
        before {
          user.update(stripe_customer_id: stripe_customer.id)
        }
        # let(:reservation_attrs) { attributes_for(:reservation, user: user, post: post ) }

        it "is successful" do
          sign_in user

          charge = Stripe::Charge.create(
            amount: 1,
            currency: "usd",
            customer: stripe_customer.id,
            source: stripe_customer.default_source,
          )
          reservation.update!(stripe_charge_id: charge.id)

          expect {
            put cancel_api_reservation_path reservation, params: { reason: "腹痛でキャンセルです" }
          }.to change { Reservation.count }.by(0)
          stripe_refund_result = Stripe::Refund.list.data.first
          # expect(json.reservation.data.attributes.stripe_refund_id).to eq stripe_refund_result.id
          expect(json.reservation.data.attributes.canceled_at).to be_present
          expect(stripe_refund_result.status).to eq "succeeded"
          expect(stripe_refund_result.metadata.reason).to eq "腹痛でキャンセルです"
        end
      end
    end
  end
end
