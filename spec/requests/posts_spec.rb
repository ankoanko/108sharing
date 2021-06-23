require "rails_helper"

describe "Posts", type: :request do
  describe "#GET show" do
    context "匿名アクセスの場合" do
      let(:post) { create(:post) }

      xit "increase impressionist_count" do
        expect { get post_url post }.to change {
          post.reload.impressionist_count
        }.by(1)
        expect { get post_url post.id }.to change {
          post.reload.impressionist_count
        }.by(0)
      end
    end

    xcontext "自分の投稿の場合" do
      let(:user) { create(:user) }
      let!(:post) { create(:post, user: user) }

      it "カウント数は変化しない" do
        sign_in user

        expect { get post_url post }.to change {
          post.reload.impressionist_count
        }.by(0)
      end
    end
  end
end
