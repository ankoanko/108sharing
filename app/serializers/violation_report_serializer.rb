class ViolationReportSerializer < ApplicationSerializer
  attributes :id, :reportable_type, :reportable_id, :violation_type, :content, :reported_by

  belongs_to :reported_by, record_type: :user, serializer: UserSerializer
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
