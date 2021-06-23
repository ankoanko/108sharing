class ViolationReport < ApplicationRecord
  belongs_to :reportable, polymorphic: true
  belongs_to :reported_by, class_name: "User"

  enum violation_type: { spam: 0, dating: 1, nuisance: 2, other: 3 }
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
