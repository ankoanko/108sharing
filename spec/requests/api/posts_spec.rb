require "rails_helper"

describe "Posts", type: :request do
  describe "POST create" do
    let(:admin) { create(:user, :admin) }
    let(:user) { create(:user) }
    let(:post_attrs) { attributes_for(:post, category_id: create(:category).id) }

    describe "#GET search" do
      # 例: /posts/search?tag_ids[]=9&tag_ids[]=8&tag_ids[]=1
      let(:category1) { create(:category, id: 1) }
      let(:category2) { create(:category, id: 2) }
      let(:category3) { create(:category, id: 3) }
      let(:tag1) { create(:tag, id: 1) }
      let(:tag2) { create(:tag, id: 2) }
      # TODO: min_price、max_price加える

      let!(:post1) { create(:post, aasm_state: :published, name: "dummy1", category: category1, tags: [tag1, tag2]) }
      let!(:post2) { create(:post, aasm_state: :published, name: "dummy2", category: category1, tags: [tag1, tag2]) }

      # Todo Gemの利用をみなおす
      xit "increase impressionist_count" do
        sign_in user
        get search_api_posts_path, params: { tag_ids: [1, 2, 3], category_ids: [1, 2] }
        expect(json.posts.posts.data.pluck(:id).map(&:to_i)).to match_array [post1.id, post2.id]
      end
    end

    context "with valid attributes" do
      it "create by user" do
        sign_in user
        expect do
          post api_posts_path, params: { post: post_attrs }
        end.to change { Post.count }.by(1)
        expect(response).to have_http_status(:created)
        expect(json.post.data.attributes.id).to eq(Post.last.id)
        expect(json.post.data.attributes.slug).to eq(Post.last.slug)
      end

      it "create by admin" do
        sign_in admin
        expect do
          post api_posts_path, params: { post: post_attrs }
        end.to change { Post.count }.by(1)
        expect(response).to have_http_status(:created)
        expect(json.post.data.attributes.id).to eq(Post.last.id)
        expect(json.post.data.attributes.slug).to eq(Post.last.slug)
      end

      it "create by not authorized user" do
        expect do
          post api_posts_path, params: { post: post_attrs }
        end.not_to change { Post.count }
        expect(response).to have_http_status(:found)
      end
    end

    context "with invalid attributes" do
      let(:invalid_post_attrs) { attributes_for(:post, user: user, name: nil, category_id: nil) }

      it "is unsuccessful" do
        sign_in user
        expect do
          post api_posts_path, params: { post: invalid_post_attrs }
        end.not_to change { Post.count }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json.errors).to match "Nameを入力してください"
      end
    end
  end

  describe "PUT #update" do
    let(:admin) { create(:user, :admin) }
    let(:user) { create(:user) }
    let(:owner) { create(:user) }
    let(:post1) { create(:post, name: "before_test_name", user: owner) }
    let(:valid_params) { attributes_for(:post, user: user, name: "after_test_name") }
    let(:invalid_params) { attributes_for(:post, user: user, name: nil) }

    context "with valid attributes" do
      context "update by post_owner" do
        it "status success" do
          sign_in owner
          expect do
            put api_post_url post1, params: { id: post1, post: valid_params }
          end.to change { Post.find(post1.id).name }.from("before_test_name").to("after_test_name")
          expect(response).to have_http_status(:ok)
        end
      end

      context "update post name by admin" do
        before { sign_in admin }

        it "success" do
          expect do
            put api_post_url post1, params: { id: post1, post: valid_params }
          end.to change { Post.find(post1.id).name }.from("before_test_name").to("after_test_name")
          expect(response).to have_http_status(:ok)
        end
      end

      context "update post status by admin" do
        before { sign_in admin }

        let(:post1) { create(:post, name: "before_test_name", aasm_state: "published", user: owner) }
        let(:valid_params) { attributes_for(:post, user: user, aasm_state: "closed") }
        it "success" do
          expect do
            put api_post_url post1, params: { id: post1, post: valid_params }
          end.to change { Post.find(post1.id).aasm_state }.from("published").to("closed")
          expect(response).to have_http_status(:ok)
        end
      end

      context "update by user" do
        it "denied to update post name" do
          sign_in user
          expect do
            put api_post_url post1, params: { id: post1, post: valid_params }
          end.not_to change { Post.find(post1.id).name }
          expect(response).to have_http_status(:unauthorized)
        end
      end
    end

    context "with invalid attributes" do
      it "is unsuccessful" do
        sign_in owner
        expect {
          put api_post_url post1, params: { post: invalid_params }
        }.not_to change { Post.find(post1.id).name }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json.errors).to match "Nameを入力してください"
      end
    end
  end

  describe "GET #calculate" do
    let!(:owner) { create(:user) }
    let!(:post1) { create(:post, name: "before_test_name", user: owner) }
    let!(:calendar) { create(:calendar, post_id: post1.id, day: "2020-10-31") }

    context "an overnight stay" do
      it "returns one day default price" do
        attr = { start_date: "2020-11-11", end_date: "2020-11-12" }
        get calculate_api_post_path(id: post1.id), params: attr
        expect(response).to have_http_status(:ok)
        expect(json.price).to eq(post1.price)

        attr2 = { start_date: "2020-10-30", end_date: "2020-10-31" }
        get calculate_api_post_path(id: post1.id), params: attr2
        expect(response).to have_http_status(:ok)
        expect(json.price).to eq(post1.price)
      end

      it "returns one day custom price" do
        attr = { start_date: "2020-10-31", end_date: "2020-11-01" }
        get calculate_api_post_path(id: post1.id), params: attr
        expect(response).to have_http_status(:ok)
        expect(json.price).to eq(calendar.daily_price)
      end
    end

    context "consecutive stay" do
      it "returns correct calculation" do
        attr1 = { start_date: "2020-11-11", end_date: "2020-11-15" }
        attr2 = { start_date: "2020-10-30", end_date: "2020-11-02" }

        get calculate_api_post_path(id: post1.id), params: attr1
        expect(response).to have_http_status(:ok)
        expect(json.price).to eq(post1.price * 4)

        get calculate_api_post_path(id: post1.id), params: attr2
        expect(response).to have_http_status(:ok)
        expect(json.price).to eq(post1.price * 2 + calendar.daily_price)
      end
    end
  end
end
