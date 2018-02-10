json.extract! analytics_dashboard, :id, :title, :description, :fields, :analysis_type_id, :chart_id, :chart, :card, :created_at, :updated_at
json.url analytics_dashboard_url(analytics_dashboard, format: :json)
