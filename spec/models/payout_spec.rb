require "rails_helper"

RSpec.describe Payout, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: payouts
#
#  id               :bigint(8)        not null, primary key
#  amount           :integer          default(0), not null
#  arrival_date     :date
#  currency         :string           default("jpy")
#  failed_at        :datetime
#  failure_code     :string
#  failure_message  :text
#  paid_at          :datetime
#  status           :integer          default("pending")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  stripe_payout_id :string
#  user_id          :bigint(8)
#
# Indexes
#
#  index_payouts_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
