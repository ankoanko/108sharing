class ChangeColumnOnIdentification < ActiveRecord::Migration[5.2]
  def change
    change_column_null :identifications, :workflow_state, false, 0
    change_column :identifications, :workflow_state, :integer, default: 0
  end
end
