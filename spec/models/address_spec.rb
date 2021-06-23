require "rails_helper"

RSpec.describe Address, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: addresses
#
#  id          :bigint(8)        not null, primary key
#  city        :string
#  city_kana   :string
#  other       :string
#  other_kana  :string
#  postal_code :string
#  state       :string
#  state_kana  :string
#  town        :string
#  town_kana   :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint(8)
#
# Indexes
#
#  index_addresses_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
