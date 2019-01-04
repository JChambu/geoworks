class CreateProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    create_table :project_subfields do |t|

      t.string :name
      t.string :required
      t.references :project_field
      t.references :regexp_type
      t.string :key
      t.references :choice_list
      t.references :field_type

      t.timestamps
    end
  end
end
