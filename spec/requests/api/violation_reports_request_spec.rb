require "rails_helper"

RSpec.describe "Api::ViolationReports", type: :request do
  let!(:post_user) { create(:user, :with_identification_approved) }
  let!(:report_user) { create(:user) }
  let(:post_1) { create(:post, user: post_user) }
  let(:post_violation_report_attrs) { attributes_for(:violation_report, reportable_id: post_1.id, reportable_type: "Post") }
  let(:user_violation_report_attrs) { attributes_for(:violation_report, reportable_id: post_user.id, reportable_type: "User") }

  before do
    sign_in report_user
  end

  describe "Post /api/posts/:post_id/violation_reports" do
    it "create violation report successfully" do
      post api_post_violation_reports_path(post_1.id), params: { violation_report: post_violation_report_attrs }
      expect(response).to have_http_status(:ok)
      expect(json.data.attributes.content).to eq post_violation_report_attrs[:content]
      expect(json.data.attributes.violation_type).to eq post_violation_report_attrs[:violation_type]
      expect(json.data.attributes.reportable_id).to eq post_violation_report_attrs[:reportable_id]
      expect(json.data.attributes.reported_by.id).to eq report_user.id
    end
  end

  describe "Post /api/users/:user_id/violation_reports" do
    it "create violation report successfully" do
      post api_user_violation_reports_path(post_user.id), params: { violation_report: user_violation_report_attrs }
      expect(response).to have_http_status(:ok)
      expect(json.data.attributes.content).to eq user_violation_report_attrs[:content]
      expect(json.data.attributes.violation_type).to eq user_violation_report_attrs[:violation_type]
      expect(json.data.attributes.reportable_id).to eq user_violation_report_attrs[:reportable_id]
      expect(json.data.attributes.reported_by.id).to eq report_user.id
    end
  end
end
