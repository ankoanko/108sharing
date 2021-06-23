require "rails_helper"

describe Users::OmniauthCallbacksController, type: :request do
  let!(:role) { create(:role, :role_host) }

  # rubocop:disable RSpec/AnyInstance
  before do
    # https://github.com/omniauth/omniauth/issues/937#issuecomment-389516359
    allow_any_instance_of(
      Users::OmniauthCallbacksController,
    ).to(receive(:omniauth_params).and_return("role_ids" => [role.id]))
  end
  # rubocop:enable RSpec/AnyInstance

  describe "#facebook" do
    context "when user not exist" do
      it "status success" do
        post "/users/auth/facebook/callback"
        expect(response).to have_http_status(:found)
      end

      it "create user" do
        expect { post "/users/auth/facebook/callback" }.to change { User.count }.by(1)
      end
    end

    context "when login" do
      it "run multiple" do
        post "/users/auth/facebook/callback"
        expect { post "/users/auth/facebook/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(0)
      end
    end

    context "when user exist" do
      before { create(:user, email: "user_1@example.com") }

      it "status unproccessable_entity" do
        post "/users/auth/facebook/callback"
        expect(response).to have_http_status(:found)
      end

      it "not create user but social_profile does" do
        expect { post "/users/auth/facebook/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(1)
      end
    end
  end

  xdescribe "#twitter" do
    context "when user not exist" do
      it "status found" do
        post "/users/auth/twitter/callback"
        expect(response).to have_http_status(:found)
      end

      it "create user" do
        expect { post "/users/auth/twitter/callback" }.to change { User.count }.by(1)
      end
    end

    context "when login" do
      it "run multiple" do
        post "/users/auth/twitter/callback"
        expect { post "/users/auth/twitter/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(0)
      end
    end

    context "when user exist" do
      before { create(:user, email: "user_1@example.com") }

      it "status unproccessable_entity" do
        post "/users/auth/twitter/callback"
        expect(response).to have_http_status(:found)
      end

      it "not create user but social_profile does" do
        expect { post "/users/auth/twitter/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(1)
      end
    end
  end

  describe "#google_oauth2" do
    context "when user not exist" do
      it "status found" do
        post "/users/auth/google_oauth2/callback"
        expect(response).to have_http_status(:found)
      end

      it "create user" do
        expect { post "/users/auth/google_oauth2/callback" }.to change { User.count }.by(1)
      end
    end

    context "when login" do
      it "run multiple" do
        post "/users/auth/google_oauth2/callback"
        expect { post "/users/auth/google_oauth2/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(0)
      end
    end

    context "when user exist" do
      before { create(:user, email: "user_1@example.com") }

      it "status unproccessable_entity" do
        post "/users/auth/google_oauth2/callback"
        expect(response).to have_http_status(:found)
      end

      it "not create user but social_profile does" do
        expect { post "/users/auth/google_oauth2/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(1)
      end
    end
  end

  xdescribe "multiple social login" do
    context "when user not exist" do
      it "status found" do
        post "/users/auth/myrate/callback"
        expect(response).to have_http_status(:found)
        post "/users/auth/facebook/callback"
        expect(response).to have_http_status(:found)
        post "/users/auth/twitter/callback"
        expect(response).to have_http_status(:found)
        post "/users/auth/google_oauth2/callback"
        expect(response).to have_http_status(:found)
      end

      it "not create user with same email" do
        expect { post "/users/auth/myrate/callback" }.to change { User.count }.by(1).and change { SocialProfile.count }.by(1)
        expect { post "/users/auth/facebook/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(1)
        expect { post "/users/auth/twitter/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(1)
        expect { post "/users/auth/google_oauth2/callback" }.to change { User.count }.by(0).and change { SocialProfile.count }.by(1)
      end
    end
  end
end
