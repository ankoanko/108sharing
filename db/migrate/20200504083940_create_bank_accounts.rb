class CreateBankAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :bank_accounts do |t|
      t.references :user, index: { unique: true }, foreign_key: true
      t.string :bank_name
      t.string :branch_name
      t.string :number
      t.string :name
      t.integer :account_type, default: 0
      t.string :bank_code
      t.string :branch_code
      t.timestamps
    end
  end
end
