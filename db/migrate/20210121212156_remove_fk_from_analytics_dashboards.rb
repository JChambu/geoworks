class RemoveFkFromAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:analytics_dashboards, :analysis_types)
      remove_foreign_key :analytics_dashboards, :analysis_types
    end
  end
end
