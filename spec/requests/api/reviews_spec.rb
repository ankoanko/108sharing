require "rails_helper"

RSpec.describe "Reviews", type: :request do
  let!(:user) { create(:user, :with_identification_approved) }
  let(:reservation) { create(:reservation, user: user) }
  let(:review_attrs) { attributes_for(:review, reservation_id: reservation.id) }

  before do
    sign_in user
  end

  describe "Post /api/reviews" do
    xit "create review successfully" do
      expect {
        post api_reviews_path, params: { review: review_attrs }
      }.to change { Review.count }.by(1)
      expect(response).to have_http_status(:ok)
      expect(json.data.attributes.body).to eq review_attrs[:body]
      expect(json.data.attributes.rating).to eq review_attrs[:rating]
    end

    context "already reviewed" do
      let!(:review) { create(:review, reservation_id: reservation.id, reviewer_id: user.id) }
      it "not create review successfully" do
        expect {
          post api_reviews_path, params: { review: review_attrs }
        }.not_to change { Review.count }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
