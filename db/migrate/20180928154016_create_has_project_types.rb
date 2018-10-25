class CreateHasProjectTypes < ActiveRecord::Migration[5.1]
  def change
    create_table :has_project_types do |t|
      t.references :user, foreign_key: true
      t.references :project_type, foreign_key: true

      t.timestamps
    end
  end
end
