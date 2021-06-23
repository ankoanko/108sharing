require "rails_helper"

RSpec.describe "ReviewReplies", type: :request do
  describe "GET /api/review_replies" do
    let!(:guest) { create(:user, :with_identification_approved) }
    let!(:host) { create(:user, :with_identification_approved) }
    let!(:post1) { create(:post, user: host) }
    let!(:reservation) { create(:reservation, user: guest, post: post1, workflow_state: :approved) }
    let!(:review) { create(:review, reservation: reservation, reviewable: post1, reviewer: guest) }
    let(:review_reply_attrs) { attributes_for(:review_reply, review_id: review.id) }

    it "is successful" do
      sign_in host
      expect {
        post api_review_replies_path, params: { review_reply: review_reply_attrs }
      }.to change { ReviewReply.count }.by(1)
      expect(response).to have_http_status(:ok)
    end
  end
end
