class AddColumnSqlSentenceToAnalyticsDashbards < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :sql_sentence, :text
  end
end
