require "rails_helper"

RSpec.describe "Identifications", type: :request do
  describe "POST create" do
    context "as an authenticated user" do
      context "with valid attributes" do
        let(:user) { create(:user) }
        let(:valid_attrs) { attributes_for(:identification_image, :with_image) }

        it "is successful" do
          sign_in user
          post api_identification_images_path, params: { user_id: user.id, identification_image: valid_attrs }
          identification_image = IdentificationImage.last
          expect(identification_image.image).to be_attached
          expect(response).to have_http_status(:ok)
        end

        it "is successful" do
          sign_in user
          post api_identification_images_path, params: { user_id: user.id, identification_image: valid_attrs }
          post api_identification_images_path, params: { user_id: user.id, identification_image: valid_attrs }
          post api_identification_images_path, params: { user_id: user.id, identification_image: valid_attrs }
          post api_identification_images_path, params: { user_id: user.id, identification_image: valid_attrs }

          expect(IdentificationImage.count).to eq 4
          expect(Identification.count).to eq 1
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end
end
