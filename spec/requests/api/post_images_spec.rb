require "rails_helper"

describe "Api::PostImages", type: :request do
  describe "PostImage create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:user) { create(:user) }
        let(:post1) { create(:post, user: user) }
        let(:post_image_attrs) { attributes_for(:post_image, :with_image, user: user, post_id: post1.id) }

        it "is successful" do
          sign_in user
          expect {
            post api_post_images_url, params: { post_image: post_image_attrs }
          }.to change { PostImage.count }.by(1)
          expect(response).to have_http_status(:ok)
          expect(json.post_image.data.attributes.id).to eq PostImage.last.id
          expect(json.post_image.data.attributes.position).to eq 1
        end
      end
    end
  end

  describe "PostImage update" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:user) { create(:user) }
        let(:post1) { create(:post, user: user) }
        let(:post_image) { create(:post_image, :with_image, post: post1) }
        # let!(:image) { fixture_file_upload(Rails.root.join("spec", "fixtures", "images", "demo_1.jpg")) }

        it "is successful" do
          sign_in user
          expect {
            patch api_post_image_url post_image, params: { post_image: { description: "updated_description" } }
          }.to change { PostImage.find(post_image.id).description }.to("updated_description")
          expect(response).to have_http_status(:ok)
          expect(json.post_image.data.attributes.id).to eq PostImage.last.id
          expect(json.post_image.data.attributes.position).to eq 1
        end
      end
    end
  end

  describe "PostImage delete" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:user) { create(:user) }
        let(:post1) { create(:post, user: user) }
        let!(:post_image) { create(:post_image, :with_image, post: post1) }

        it "is successful" do
          sign_in user

          expect do
            delete api_post_image_url post_image
          end.to change { PostImage.count }.by(-1)

          expect(response).to have_http_status(:ok)
        end
      end
    end
  end
end
