class CreateIdentificationImages < ActiveRecord::Migration[5.2]
  def change
    create_table :identification_images do |t|
      t.references :identification, foreign_key: true
      t.integer :position
      t.text :description

      t.timestamps
    end
  end
end
