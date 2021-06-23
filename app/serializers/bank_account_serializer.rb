class BankAccountSerializer < ApplicationSerializer
  attributes :id, :user_id, :bank_name, :branch_name, :number, :name, :account_type, :account_type_i18n, :bank_code, :branch_code

  attribute :created_at do |obj|
    I18n.l obj.created_at
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
