require "rails_helper"

describe "Admin Posts", type: :request do
  describe "POST create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:post_attrs) { attributes_for(:post) }

        it "is successful" do
          sign_in admin
          expect {
            post admin_api_posts_path, params: { post: post_attrs }
          }.to change { Post.count }.by(1)

          expect(response).to have_http_status(:created)
        end
      end

      context "with invalid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:post_attrs) { attributes_for(:post, name: nil) }

        it "is unsuccessful" do
          sign_in admin
          expect {
            post admin_api_posts_path, params: { post: post_attrs }
          }.not_to change { Post.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.body).to include(I18n.t("errors.messages.blank"))
        end
      end
    end

    context "as a not_authenticated user" do
      let(:user) { create(:user) }
      let(:post_attrs) { attributes_for(:post) }

      it "denies access to posts#create" do
        sign_in user
        expect {
          post admin_api_posts_path, params: { post: post_attrs }
        }.to change { Post.count }.by(0)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT #update" do
    let(:admin) { create(:user, :admin) }
    let(:post) { create(:post, name: "before_test_name") }
    let(:valid_params) { attributes_for(:post, name: "after_test_name") }
    let(:invalid_params) { attributes_for(:post, name: nil) }

    context "with valid attributes" do
      context "update by admin" do
        it "update post name" do
          sign_in admin
          expect do
            put admin_api_post_path post, params: { post: valid_params }
          end.to change { Post.find(post.id).name }.from("before_test_name").to("after_test_name")
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "Delete #destroy" do
    let(:admin) { create(:user, :admin) }
    let!(:post) { create(:post) }

    context "with valid attributes" do
      context "delete by admin" do
        it "delete post" do
          sign_in admin
          expect do
            delete admin_api_post_path post
          end.to change { Post.count }.by(-1)
          # expect(response).to have_http_status(:ok)
        end
      end

      context "post has a reservation" do
        let!(:reservation) { create(:reservation, post_id: post.id) }

        it "delete post" do
          sign_in admin
          expect do
            delete admin_api_post_path post
          end.to change { Post.count }.by(0)
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end
