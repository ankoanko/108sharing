class CreateViolationReports < ActiveRecord::Migration[6.0]
  def change
    create_table :violation_reports do |t|
      t.references :reportable, polymorphic: true, null: false
      t.integer :violation_type, default: 0, null: false
      t.string :content
      t.integer :reported_by_id, null: false

      t.timestamps
    end
  end
end
