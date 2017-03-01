class CreateVerificationPois < ActiveRecord::Migration[5.0]
  def change
    create_table :verification_pois do |t|
      t.integer :poi_id
      t.integer :user_id

      t.timestamps
    end
  end
end
