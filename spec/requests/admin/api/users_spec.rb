require "rails_helper"

describe "Admin Users", type: :request do
  describe "POST create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:attrs) { { user: attributes_for(:user) } }

        it "is successful" do
          sign_in admin
          expect {
            post admin_api_users_path, params: attrs
          }.to change { User.count }.by(1)

          expect(response).to have_http_status(:created)
        end
      end

      context "with invalid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:attrs) { { user: attributes_for(:user, email: nil) } }

        it "is unsuccessful" do
          sign_in admin
          expect {
            post admin_api_users_path, params: attrs
          }.not_to change { User.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.body).to include(I18n.t("errors.messages.blank"))
        end
      end
    end

    context "as a not_authenticated user" do
      let(:user) { create(:user) }
      let(:attrs) { { user: attributes_for(:user) } }

      it "denies access to users#create" do
        sign_in user
        expect {
          post admin_api_users_path, params: attrs
        }.to change { User.count }.by(0)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT #update" do
    let(:admin) { create(:user, :admin) }
    let(:user) { create(:user, username: "before_test_username") }

    let(:valid_params) { { user: attributes_for(:user, username: "after_test_username") } }

    context "with valid attributes" do
      context "update by admin" do
        it "update user username" do
          sign_in admin
          expect do
            put admin_api_user_path user, params: valid_params
          end.to change { User.find(user.id).username }.from("before_test_username").to("after_test_username")
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "Delete #destroy" do
    let(:admin) { create(:user, :admin) }
    let!(:user) { create(:user) }

    context "with valid attributes" do
      context "delete by admin" do
        it "delete user" do
          sign_in admin
          expect do
            delete admin_api_user_path user
          end.to change { User.count }.by(-1)
          # expect(response).to have_http_status(:ok)
        end
      end

      context "user has a post" do
        let!(:post) { create(:post, user_id: user.id) }

        it "delete user" do
          sign_in admin
          expect do
            delete admin_api_user_path user
          end.to change { User.count }.by(0)
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end
