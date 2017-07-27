module PoisHelper
  def set_poi_user
    @poi.user_id = current_user.id unless @poi.user_id
  end

  def poi_sources_for_select
    PoiSource.sorted_by_name.map { |source| [source.name, source.id] }
  end

  def poi_statuses_for_select
    PoiStatus.sorted_by_name.map { |status| [status.human_name, status.id] }
  end

  def poi_hint attr
    return "" if @poi.original_object.nil?
    value = @poi.original_object.send(attr)
    return "" if value.to_s.empty?
    "Valor original: #{value}"
  end

  def render_search_hidden_fields form, search
    hidden_fields = ""
    search.keys.each do |param|
      hidden_fields += hidden_field_tag("dq[#{param}]", search[param])
    end
    hidden_fields.html_safe
  end

  def nokia_map_types_for_select
    [["Comunidad", "NORMAL_COMMUNITY"],
     ["Comunidad (Satelite)", "SATELLITE_COMMUNITY"],
     ["Normal", "NORMAL"],
     ["Satelite", "SATELLITE"],
     ["Terreno", "TERRAIN"]]
  end

  def verification_select
    [["Sin verificar", "f" ],
     ["Verificado", "t" ]
    ]
  end

  def formatted_control_date
    return '' if !@poi or !@poi.control_date
    @poi.control_date.strftime('%d-%m-%Y')
  end

  def poi_status_label poi


    "<label class='#{poi.poi_status_name}-status'>#{poi.poi_status_human_name}</label>".html_safe
  end


  def p_actions_for_select
    PAction.sorted_by_name.map { |p_action| [p_action.name, p_action.id] }
  end	

  def maps

    @map = Customer.find_by(subdomain: request.subdomains.first )
    return raw  "<div id='map' class='span12'></div>" if @map.nil?
    if @map.supplier_map == 'here'
      str =  "<div id='geocoding-map' class='span12'></div>"
      raw str
    else
      str =  "<div id='map' class='span12'></div>"
      raw str
    end
  end

  def supplier_map_name

   request.subdomains.first
    @map = Customer.find_by(subdomain: request.subdomains.first )
    if @map.nil?
      return 'osm'
    else
      return  @map.supplier_map.to_s
    end
  end
end
