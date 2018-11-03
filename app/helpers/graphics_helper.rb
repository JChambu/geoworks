module GraphicsHelper

  def kpi_for_select
    AnalyticsDashboard.where(dashboard_id: params[:dashboard_id]).map { |source| [source.title, source.id] }
  end
end
