require "rails_helper"

RSpec.describe ViolationReport, type: :model do
  describe "has a valid factory" do
    let!(:user1) { create(:user) }
    let!(:user2) { create(:user) }
    let!(:post1) { create(:post, user: user1) }

    context "reportable: Post" do
      subject { create(:violation_report, reported_by: user2, reportable_type: "Post", reportable_id: post1.id) }

      it { is_expected.to be_valid }
    end

    context "reportable: User" do
      subject { create(:violation_report, reported_by: user2, reportable_type: "User", reportable_id: user1.id) }

      it { is_expected.to be_valid }
    end
  end
end

# == Schema Information
#
# Table name: violation_reports
#
#  id              :bigint(8)        not null, primary key
#  content         :string
#  reportable_type :string           not null
#  violation_type  :integer          default("spam"), not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  reportable_id   :bigint(8)        not null
#  reported_by_id  :integer          not null
#
# Indexes
#
#  index_violation_reports_on_reportable_type_and_reportable_id  (reportable_type,reportable_id)
#
