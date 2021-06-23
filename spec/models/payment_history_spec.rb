require "rails_helper"

RSpec.describe PaymentHistory, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: payment_histories
#
#  id            :bigint(8)        not null, primary key
#  activity_key  :string
#  activity_type :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  activity_id   :bigint(8)
#  recipient_id  :integer
#
# Indexes
#
#  index_payment_histories_on_activity_type_and_activity_id  (activity_type,activity_id)
#
