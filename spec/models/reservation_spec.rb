require "rails_helper"

RSpec.describe Reservation, type: :model do
  xit "has a valid factory" do
    expect(create(:reservation)).to be_valid
  end

  xdescribe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to belong_to(:post) }
  end
end

# == Schema Information
#
# Table name: reservations
#
#  id               :bigint(8)        not null, primary key
#  authorized_at    :datetime
#  cancel_fee       :integer          default(0)
#  canceled_at      :datetime
#  end_date         :date
#  no               :string
#  paid_at          :datetime
#  price            :integer
#  refund_amount    :integer          default(0)
#  slug             :string
#  start_date       :date
#  workflow_state   :integer          default("requested")
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  post_id          :bigint(8)
#  stripe_charge_id :string
#  stripe_refund_id :string
#  user_id          :bigint(8)
#
# Indexes
#
#  index_reservations_on_post_id  (post_id)
#  index_reservations_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#  fk_rails_...  (user_id => users.id)
#
