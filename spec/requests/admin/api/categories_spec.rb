require "rails_helper"

describe "Admin Categorys", type: :request do
  describe "POST create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:category_attrs) { attributes_for(:category) }

        it "is successful" do
          sign_in admin
          expect {
            post admin_api_categories_path, params: { category: category_attrs }
          }.to change { Category.count }.by(1)

          expect(response).to have_http_status(:created)
        end
      end

      context "with invalid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:category_attrs) { attributes_for(:category, name: nil) }

        it "is unsuccessful" do
          sign_in admin
          expect {
            post admin_api_categories_path, params: { category: category_attrs }
          }.not_to change { Category.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.body).to include(I18n.t("errors.messages.blank"))
        end
      end
    end

    context "as a not_authenticated user" do
      let(:user) { create(:user) }
      let(:category_attrs) { attributes_for(:category) }

      it "denies access to categories#create" do
        sign_in user
        expect {
          post admin_api_categories_path, params: { category: category_attrs }
        }.to change { Category.count }.by(0)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT #update" do
    let(:admin) { create(:user, :admin) }
    let(:category) { create(:category, name: "before_test_name") }
    let(:valid_params) { attributes_for(:category, name: "after_test_name") }
    let(:invalid_params) { attributes_for(:category, name: nil) }

    context "with valid attributes" do
      context "update by admin" do
        it "update category name" do
          sign_in admin
          expect do
            put admin_api_category_path category, params: { category: valid_params }
          end.to change { Category.find(category.id).name }.from("before_test_name").to("after_test_name")
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "Delete #destroy" do
    let(:admin) { create(:user, :admin) }
    let!(:category) { create(:category) }

    context "with valid attributes" do
      context "delete by admin" do
        it "delete category" do
          sign_in admin
          expect do
            delete admin_api_category_path category
          end.to change { Category.count }.by(-1)
          expect(response).to have_http_status(:ok)
        end
      end

      context "category has a post" do
        let!(:post) { create(:post) }

        before {
          post.category = category
          post.save!
        }

        it "does not delete category" do
          sign_in admin
          expect do
            delete admin_api_category_path category
          end.to change { Category.count }.by(0)
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end
