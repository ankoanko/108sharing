require "rails_helper"

describe "Api::Calendars", type: :request do
  describe "Calendars index" do
    context "with valid attributes" do
      subject do
        get "/api/posts/#{post1.id}/calendars", params: { filter: params, format: :json }
      end

      let(:user) { create(:user) }
      let(:post1) { create(:post, user: user) }

      before do
        create(:calendar, post_id: post1.id, blocked: true, daily_price: post1.price)
        create(:calendar, post_id: post1.id, reserved: true, day: Date.current.beginning_of_month + 1.days, daily_price: post1.price)
        create(:calendar, post_id: post1.id, day: Date.current.beginning_of_month + 3.days)
      end

      context "when all params is true" do
        let(:params) { { reserved: true, blocked: true, defined_price: true } }
        it "successfully applied all filter" do
          sign_in user
          subject
          expect(response).to have_http_status(:ok)
          expect(json["calendars"]["data"].count).to eq 3
        end
      end

      context "when no params of defined_price" do
        let(:params) { { reserved: true, blocked: true } }
        it "successfully applied only blocked and reserved filter" do
          sign_in user
          subject
          expect(response).to have_http_status(:ok)
          expect(json["calendars"]["data"].count).to eq 2
        end
      end

      context "when only params of defined_price" do
        let(:params) { { defined_price: true } }
        it "successfully applied only defined_price filter" do
          sign_in user
          subject
          expect(response).to have_http_status(:ok)
          expect(json["calendars"]["data"].count).to eq 1
        end
      end
    end
  end
end
