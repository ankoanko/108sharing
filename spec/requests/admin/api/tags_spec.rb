require "rails_helper"

describe "Admin Tags", type: :request do
  describe "POST create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:tag_attrs) { attributes_for(:tag) }

        it "is successful" do
          sign_in admin
          expect {
            post admin_api_tags_path, params: { tag: tag_attrs }
          }.to change { Tag.count }.by(1)

          expect(response).to have_http_status(:created)
        end
      end

      context "with invalid attributes" do
        let(:admin) { create(:user, :admin) }
        let(:tag_attrs) { attributes_for(:tag, name: nil) }

        it "is unsuccessful" do
          sign_in admin
          expect {
            post admin_api_tags_path, params: { tag: tag_attrs }
          }.not_to change { Tag.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.body).to include(I18n.t("errors.messages.blank"))
        end
      end
    end

    context "as a not_authenticated user" do
      let(:user) { create(:user) }
      let(:tag_attrs) { attributes_for(:tag) }

      it "denies access to tags#create" do
        sign_in user
        expect {
          post admin_api_tags_path, params: { tag: tag_attrs }
        }.to change { Tag.count }.by(0)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PUT #update" do
    let(:admin) { create(:user, :admin) }
    let(:tag) { create(:tag, name: "before_test_name") }
    let(:valid_params) { attributes_for(:tag, name: "after_test_name") }
    let(:invalid_params) { attributes_for(:tag, name: nil) }

    context "with valid attributes" do
      context "update by admin" do
        it "update tag name" do
          sign_in admin
          expect do
            put admin_api_tag_path tag, params: { tag: valid_params }
          end.to change { Tag.find(tag.id).name }.from("before_test_name").to("after_test_name")
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end

  describe "Delete #destroy" do
    let(:admin) { create(:user, :admin) }
    let!(:tag) { create(:tag) }

    context "with valid attributes" do
      context "delete by admin" do
        it "delete tag" do
          sign_in admin
          expect do
            delete admin_api_tag_path tag
          end.to change { Tag.count }.by(-1)
          # expect(response).to have_http_status(:ok)
        end
      end

      context "tag has a post" do
        let!(:post) { create(:post) }

        before {
          post.tags << tag
          post.save!
        }

        it "delete tag" do
          sign_in admin
          expect do
            delete admin_api_tag_path tag
          end.to change { Tag.count }.by(0)
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end
