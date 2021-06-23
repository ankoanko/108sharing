FactoryBot.define do
  factory :bank_account do
  end
end

# == Schema Information
#
# Table name: bank_accounts
#
#  id           :bigint(8)        not null, primary key
#  account_type :integer          default("saving")
#  bank_code    :string
#  bank_name    :string
#  branch_code  :string
#  branch_name  :string
#  name         :string
#  number       :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint(8)
#
# Indexes
#
#  index_bank_accounts_on_user_id  (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
