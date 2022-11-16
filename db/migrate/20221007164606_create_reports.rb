class CreateReports < ActiveRecord::Migration[5.1]
  def change
    create_table :reports do |t|
      t.integer :user_id
      t.jsonb :report_data
      t.jsonb :quiz
    end
  end
end
