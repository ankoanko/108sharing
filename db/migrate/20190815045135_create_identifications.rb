class CreateIdentifications < ActiveRecord::Migration[5.2]
  def change
    create_table :identifications do |t|
      t.references :user
      t.text :description
      t.integer :workflow_state

      t.timestamps
    end
  end
end
