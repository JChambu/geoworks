module PoiLoadsHelper
  def render_xls_link poi_load
    if poi_load.source_file_exist?
      return link_to(t("true_value"), download_source_file_poi_load_path(poi_load.id))
    end
    t("false_value")
  end	

  def render_error_link poi_load
    if poi_load.error_file_exist?
      return link_to(t("true_value"), download_errors_file_poi_load_path(poi_load.id))
    end
    t("false_value")
  end

  def poi_load_status_label poi_load
    "<label class='#{poi_load.status.to_s}-status'>#{poi_load.human_status}</label>".html_safe
  end
end
