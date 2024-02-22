module ProjectTypes::Indicators
  extend ActiveSupport::Concern
  module ClassMethods

    def validate_type_field(field, method = nil)
      if field.field_type.name == 'Numerico'
        return "(main.properties->>'#{field.key}')::numeric"
      elsif field.field_type.name == 'Listado (opción multiple)' && method == 'group'
        return "jsonb_array_elements_text(main.properties->'#{field.key}')"
      elsif field.field_type.name == 'Fecha' && method == 'group'
        #elimina la hora y da vuelta el formato
        #el replace -- es temporal mientras se eliminan las fechas mal formateadas en la db
        return "replace(concat(split_part(split_part(properties->>'#{field.key}',' ',1),'/',3),'-',split_part(split_part(properties->>'#{field.key}',' ',1),'/',2),'-',split_part(split_part(properties->>'#{field.key}',' ',1),'/',1)),'--','')"
      else
        return "main.properties->>'#{field.key}'"
      end
    end

    def data_for_initial_query chart, project_type_id , is_heatmap
      #Trae los datos de los indicadores básicos y los ajusta según sean numéricos, tipo Listado, etc.
      #Busca seleccionado en básico
      if chart.project_field.key == 'app_estado'
        field_select = 'project_statuses.name'
      end
      if chart.project_field.key == 'app_usuario'
        field_select = 'users.name'
      end
      if chart.project_field.key != 'app_usuario' && chart.project_field.key != 'app_estado'
        field_select = validate_type_field(chart.project_field)
      end

      #Busca campo condicional
      if !chart.condition_field.blank?
        condition_field_custom = validate_type_field(chart.condition_field)
        condition_where = " AND #{condition_field_custom } #{chart.filter_input} '#{chart.input_value}'"
      else
        condition_where = ""
      end

      #Busca campo agrupado
      if !chart.group_field.blank?
        if chart.group_field.key == 'app_estado'
          field_group = "project_statuses.name "
        end
        if chart.group_field.key == 'app_usuario'
          field_group = "users.name"
        end
        if chart.group_field.key != 'app_usuario' && chart.group_field.key !='app_estado'
          field_group = validate_type_field(chart.group_field, 'group')
        end
      end

      #Genera query básico
      query_full = initial_query chart.analysis_type.name, field_select,condition_where,field_group,project_type_id , is_heatmap

      query_full
    end

    def initial_query (type, field, condition_where, group_by , project_type_id , is_heatmap)
      #Genera un query completo con el formato de los avanzados. Esto es así para poder tomar un DISTINC ON
      #DISTINCT es necesario por los INNERJOIN que pueden generar duplicados
      #DISTINCT ON (main.id) es para tomar como distinto sólo los ids
      add_group_by = ""
      add_group_by_table = ""
      order_group_by = ""
      if !group_by.blank?
        add_group_by = ", #{group_by} as name_row"
        add_group_by_table = ", name_row as name"
        order_group_by = "GROUP BY name_row ORDER BY name_row"
      end
      select_heat_map = ""
      if is_heatmap
        type = ""
        order_group_by = ""
        select_heat_map = " , st_x(main.the_geom) as lng, st_y(main.the_geom) as lat ,  main.the_geom"
        select_heat_map_table = " , lat as lat , lng as lng ,  the_geom as the_geom "
      end

      current_tenant = Apartment::Tenant.current
      # Arma el primer query para indicadores basic y seleccionado
      data_query = " WITH tabla AS (SELECT DISTINCT ON (main.id) (#{field} ) as row_table #{add_group_by} #{select_heat_map} "
      data_query += " FROM #{current_tenant}.projects main from_clause"
      data_query += " INNER JOIN #{current_tenant}.project_statuses ON project_statuses.id = main.project_status_id"
      data_query += " INNER JOIN public.users ON users.id = main.user_id"
      data_query += " AND where_clause main.project_type_id = #{project_type_id} #{condition_where} "
      data_query += " ) SELECT #{type}(row_table) as count #{add_group_by_table} #{select_heat_map_table}"
      data_query += " FROM tabla #{order_group_by}"

      data_query
    end

    def query_extent size_box, project_type_id, children=false, data_query
      # Aplica ST_Contains por extent
      minx = size_box[0].to_f if !size_box.nil?
      miny = size_box[1].to_f if !size_box.nil?
      maxx = size_box[2].to_f if !size_box.nil?
      maxy = size_box[3].to_f if !size_box.nil?
      data_query = data_query.gsub('where_clause', "where_clause shared_extensions.ST_Contains(shared_extensions.ST_MakeEnvelope(#{minx}, #{maxy}, #{maxx}, #{miny}, 4326), main.#{:the_geom}) AND ")

      data_query
    end

    def query_draw_polygon size_box, project_type_id, children=false, data_query
      # Aplica ST_Contains por polygon
      arr1 = []
      size_box.each do |a,x|
        z = []
        @a = a
        @x = x
        x.each do |b,y|
          @b = b
          @y = y
          z.push(y)
        end
        arr1.push([z])
      end
      data_query = data_query.gsub('where_clause', "where_clause shared_extensions.ST_Contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{arr1}}'), 4326), main.#{:the_geom}) AND ")

      data_query
    end

    # Aplica filtro de time_slider para proyecto activo, filtro de time_slider para subformularios y filtro timeslider para capas
    def apply_time_slider_filter data, from_date, to_date, from_date_subform, to_date_subform , timeslider_layers
      if !from_date.blank? && !to_date.blank?
        data = data.gsub('where_clause', "where_clause (main.gwm_created_at BETWEEN '#{from_date}' AND '#{to_date}') AND ")
      else
        data = data.gsub('where_clause', "where_clause main.row_enabled = true AND ")
      end

      #Aplica time_slider de hijos
      if !from_date_subform.blank? || !to_date_subform.blank?
        data = data.gsub('where_subform_clause', "where_subform_clause (sub.gwm_created_at BETWEEN '#{from_date_subform}' AND '#{to_date_subform}') AND ")
      else
        data = data.gsub('where_subform_clause', "where_subform_clause sub.row_enabled = true AND ")
      end

      #Aplica time_slider de la capa
      if data.include?("name_layer_for_filters:")
        name_layer = data.split("name_layer_for_filters:")[1]
        if !timeslider_layers.nil?
          timeslider_layer = timeslider_layers[name_layer]
          if timeslider_layer.nil?
            data = data.gsub('where_layer_clause', "where_layer_clause sec.row_enabled = true AND ")
          else
            from_date_layer = timeslider_layer["from_date"]
            to_date_layer = timeslider_layer["to_date"]
            if !from_date_layer.blank? && !to_date_layer.blank?
              data = data.gsub('where_layer_clause', "where_layer_clause (sec.gwm_created_at BETWEEN '#{from_date_layer}' AND '#{to_date_layer}') AND ")
            else
              data = data.gsub('where_layer_clause', "where_layer_clause sec.row_enabled = true AND ")
            end
          end
        else
          data = data.gsub('where_layer_clause', "where_layer_clause sec.row_enabled = true AND ")
        end
      end

      data_query = data

      data_query
    end

    # Aplica filtros owner, atributo e intercapa
    def conditions_for_attributes_and_owner data, user_id, project_type_id

      project_filter = ProjectFilter.where(user_id: user_id).where(project_type_id: project_type_id).first

      if !project_filter.nil?

        # Aplica filtro owner
        if project_filter.owner == true
          data = data.gsub('where_clause', "where_clause (main.user_id = #{user_id}) AND ")
        end

        # Aplica filtro por atributo
        if !project_filter.properties.nil?
          project_filter.properties.to_a.each do |prop|
            data = data.gsub('where_clause', "where_clause (main.properties ->> '#{prop[0]}' = '#{prop[1]}') AND ")
          end
        end

        # Aplica filtro intercapa
        if !project_filter.cross_layer_filter_id.nil?

          cross_layer_filter = ProjectFilter.where(user_id: user_id).where(id: project_filter.cross_layer_filter_id).first

          # Cruza la capa del principal que contiene los hijos con la capa secunadaria
          data = data.gsub('from_clause', "INNER JOIN projects sec_filter ON ST_Intersects(main.the_geom, sec_filter.the_geom) from_clause")
          data = data.gsub('where_clause', "where_clause sec_filter.project_type_id = #{cross_layer_filter.project_type_id}
            AND sec_filter.row_active = true
            AND sec_filter.current_season = true
            AND ")

          # Aplica filtro por owner a capa secundaria
          if cross_layer_filter.owner == true
            data = data.gsub('where_clause', "where_clause (sec_filter.user_id = #{user_id}) AND ")
          end

          # Aplica filtro por atributo a capa secundaria
          if !cross_layer_filter.properties.nil?
            cross_layer_filter.properties.to_a.each do |prop|
              data = data.gsub('where_clause', "where_clause (sec_filter.properties->>'#{prop[0]}' = '#{prop[1]}') AND ")
            end
          end

        end

      end
      data_query = data
      data_query
    end

    def filters_on_the_fly data, data_conditions, filtered_form_ids, filter_children, filter_user_children, filters_layers, intersect_width_layers, active_layers, timeslider_layers

      # Aplica filtros row_active y current_season
      data = data.gsub('where_clause', "where_clause main.row_active = true AND ")
      data = data.gsub('where_clause', "where_clause main.current_season = true AND ")
      data = data.gsub('where_layer_clause', "where_layer_clause sec.row_active = true AND ")
      data = data.gsub('where_layer_clause', "where_layer_clause sec.current_season = true AND ")
      data = data.gsub('where_subform_clause', "where_subform_clause sub.row_active = true AND ")
      data = data.gsub('where_subform_clause', "where_subform_clause sub.current_season = true AND ")

      # Aplica filtros de padres
      if !data_conditions.blank?
        data_conditions.each do |key|

          s = key.split('|')
          field = s[0]
          filter = s[1]
          value = s[2]
          type = s[3]

          # Aplica filtro por campo usuario
          if field == 'app_usuario'
            data = data.gsub('where_clause', "where_clause users.name #{filter} '#{value}' AND ")
          end

          # Aplica filtro por campo estado
          if field == 'app_estado'
            data = data.gsub('where_clause', "where_clause project_statuses.name #{filter} '#{value}' AND ")
          end

          # Aplica filtro por otro campo
          if field != 'app_usuario' && field != 'app_estado'
            if(type == '5' and value!='null')
              text = "(main.properties->>'#{field}')::numeric #{filter}'#{value}' AND main.properties->>'#{field}' IS NOT NULL"
            elsif (type =='3' and value!='null')
              text = "to_date(main.properties->>'#{field}','DD/MM/YYYY') #{filter} to_date('#{value}','DD/MM/YYYY') AND main.properties->>'#{field}' IS NOT NULL"
            else
              text = "main.properties->>'#{field}'#{filter}'#{value}'"
            end
            text = text.gsub("!='null'"," IS NOT NULL ")
            text = text.gsub("='null'"," IS NULL ")
              data = data.gsub('where_clause', "where_clause (#{text}) AND ")
          end
        end
      end

      # Aplica filtros de hijos
      if !filtered_form_ids.blank?
        final_array = []
        filtered_form_ids.each do |i,ids_array|
          #ids_array = JSON.parse(ids_array)
          if !final_array.blank?
            final_array = final_array & ids_array
          else
            final_array = ids_array
          end
        end
        if final_array.blank?
          final_array.push(-1)
        end
        final_array = final_array.to_s.gsub(/\[/, '(').gsub(/\]/, ')').gsub(',', '),(').gsub(/\"/, '')
        data = data.gsub('from_clause', "from_clause INNER JOIN (VALUES #{final_array} ) vals(v) ON (main.id = v) ")
        # Aplica filtros de hijos a los hijos
        # Aplica filtros por hijos
        if !filter_children.blank?
          filter_children.each do |filter_child|
            s = filter_child.split('|')
            field = s[0]
            operator = s[1]
            value = s[2]
            type = s[3]
            if(type == '5' and value!='null')
              text = "(sub.properties->>'#{field}')::numeric #{operator}'#{value}' AND sub.properties->>'#{field}' IS NOT NULL"
            elsif (type == '3' and value!='null')
              text = "to_date(sub.properties ->> '#{field}', 'DD/MM/YYYY') #{operator} to_date('#{value}','DD/MM/YYYY') AND sub.properties->>'#{field}' IS NOT NULL"
            else
              text = "sub.properties ->> '#{field}' #{operator}'#{value}'"
            end
            text = text.gsub("!='null'"," IS NOT NULL ")
            text = text.gsub("='null'"," IS NULL ")

            data = data.gsub('where_subform_clause', "where_subform_clause ("+text+") AND ")
          end
        end
        # Aplica filtros de usuario de hijos
        if !filter_user_children.blank?
          filter_user_children.each do |filter_child|
            @value = filter_child
            data = data.gsub('where_subform_clause', "where_subform_clause (sub.user_id = '#{@value}') AND ")
          end
        end
      end

      # Aplica filtros on the fly de capas secundarias para indicadores que traen datos de esa capa secundaria
      if data.include?("name_layer_for_filters:") #El indicador debe traer ese dato
        name_layer = data.split("name_layer_for_filters:")[1]
        if !filters_layers.nil?
          filters_layer = filters_layers[name_layer]
          if !filters_layer.nil?
            filters_layer.each do |i,filter|
              field = filter["filter_field"]
              operator = filter["filter_operator"]
              value = filter["filter_value"]
              type = filter["field_type"]
              if(type == '5' and value!='null')
                text = "(sec.properties->>'#{field}')::numeric #{operator}'#{value}' AND sec.properties->>'#{field}' IS NOT NULL"
              elsif (type == '3' and value!='null')
                text = "to_date(sec.properties ->> '#{field}', 'DD/MM/YYYY') #{operator} to_date('#{value}','DD/MM/YYYY') AND sec.properties->>'#{field}' IS NOT NULL"
              else
                text = "sec.properties ->> '#{field}' #{operator}'#{value}'"
              end
              text = text.gsub("!='null'"," IS NOT NULL ")
              text = text.gsub("='null'"," IS NULL ")

              data = data.gsub('where_layer_clause', "where_layer_clause ("+text+") AND ")
            end
          end
        end
        # Aplica filtros de time-slider de la capa
        if !timeslider_layers.nil?
          timeslider_layer = timeslider_layers[name_layer]
          if timeslider_layer.nil?
            data = data.gsub('where_layer_clause', "where_layer_clause sec.row_enabled = true AND ")
          else
            from_date_layer = timeslider_layer["from_date"]
            to_date_layer = timeslider_layer["to_date"]
            if !from_date_layer.blank? && !to_date_layer.blank?
              data = data.gsub('where_layer_clause', "where_layer_clause (sec.gwm_created_at BETWEEN '#{from_date_layer}' AND '#{to_date_layer}') AND ")
            else
              data = data.gsub('where_layer_clause', "where_layer_clause sec.row_enabled = true AND ")
            end
          end
        else
          data = data.gsub('where_layer_clause', "where_layer_clause sec.row_enabled = true AND ")
        end
      end

      # Aplica filtro de capas secundarias on the fly para el proyecto activo (INTERSECT DEL PROYECTO ACTIVO)
      if(intersect_width_layers=='true')
        current_tenant = Apartment::Tenant.current
        if !active_layers.nil?
          active_layers.each do |active_layer|
            active_layer_id = ProjectType.where(name_layer: active_layer).pluck(:id).first
            data = data.gsub('from_clause', "from_clause INNER JOIN #{current_tenant}.projects intersect_"+active_layer+" ON ST_Intersects(main.the_geom, intersect_"+active_layer+".the_geom)")
            data = data.gsub('where_clause', "where_clause intersect_"+active_layer+".project_type_id = #{active_layer_id} AND intersect_"+active_layer+".row_active = true AND intersect_"+active_layer+".current_season = true AND ")
            # Aplica filtros de la capa
            if !filters_layers.nil?
              filters_layer = filters_layers[active_layer]
              if !filters_layer.nil?
                filters_layer.each do |i,filter|
                  field = filter["filter_field"]
                  operator = filter["filter_operator"]
                  value = filter["filter_value"]
                  type = filter["field_type"]
                  if(type == '5' and value!='null')
                    text = "(intersect_"+active_layer+".properties->>'#{field}')::numeric #{operator}'#{value}' AND intersect_"+active_layer+".properties->>'#{field}' IS NOT NULL"
                  elsif (type == '3' and value!='null')
                    text = "to_date(intersect_"+active_layer+".properties ->> '#{field}', 'DD/MM/YYYY') #{operator} to_date('#{value}','DD/MM/YYYY') AND intersect_"+active_layer+".properties->>'#{field}' IS NOT NULL"
                  else
                    text = "intersect_"+active_layer+".properties ->> '#{field}' #{operator}'#{value}'"
                  end
                  text = text.gsub("!='null'"," IS NOT NULL ")
                  text = text.gsub("='null'"," IS NULL ")
                  data = data.gsub('where_clause', "where_clause ("+text+") AND ")
                end
              end
            end
            # Aplica filtros de time-slider de la capa
            if !timeslider_layers.nil?
              timeslider_layer = timeslider_layers[active_layer]
              if timeslider_layer.nil?
                data = data.gsub('where_clause', "where_clause intersect_"+active_layer+".row_enabled = true AND ")
              else
                from_date_layer = timeslider_layer["from_date"]
                to_date_layer = timeslider_layer["to_date"]
                if !from_date_layer.blank? && !to_date_layer.blank?
                  data = data.gsub('where_clause', "where_clause (intersect_"+active_layer+".gwm_created_at BETWEEN '#{from_date_layer}' AND '#{to_date_layer}') AND ")
                else
                  data = data.gsub('where_clause', "where_clause intersect_"+active_layer+".row_enabled = true AND ")
                end
              end
            else
              data = data.gsub('where_clause', "where_clause intersect_"+active_layer+".row_enabled = true AND ")
            end
          end
        end
      end

      data_query = data
      data_query
    end

    def get_kpi_without_graph_ids (id, is_graph)
      if is_graph == "true"
        id_dashboard = Dashboard.where(project_type_id: id).pluck(:id).first
        analytics_charts_ids = Graphic.where(dashboard_id: id_dashboard).order(:sort).pluck(:id)
      else
        analytics_charts_ids = AnalyticsDashboard.where(project_type_id: id, graph: false).order(:description).pluck(:id)
      end

      analytics_charts_ids
    end

    def kpi_new(graph_id,project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, filtered_form_ids, filter_children, filter_user_children, user_id, from_date, to_date, from_date_subform, to_date_subform , timeslider_layers, filters_layers,intersect_width_layers, active_layers)

      querys=[]

      @ct = Apartment::Tenant.current
      graph = Graphic.where(id: graph_id)
      graph.each do |g|
        gr = GraphicsProperty.where(graphic_id: g).order(:label_datasets)
        ch = {}
        gr.each_with_index do |graph, i|
          analytics_charts = AnalyticsDashboard.where(id: graph.analytics_dashboard_id)
          analytics_charts.each do |chart|
            items = {}

            if chart.sql_full.blank?
              data_query = data_for_initial_query chart, project_type_id , false
            else
              data_query = chart.sql_full
            end

            # Consulta los registros según filtro geográfico
            if type_box == 'extent'
              data_query = query_extent size_box, project_type_id, chart.children, data_query
            else
              data_query = query_draw_polygon size_box, project_type_id, chart.children, data_query
            end

            # Aplica filtros owner, atributo e intercapa
            data_query = conditions_for_attributes_and_owner data_query, user_id, project_type_id

            # Aplica filtro time_slider
            data_query = apply_time_slider_filter data_query, from_date, to_date, from_date_subform, to_date_subform , timeslider_layers

            # Aplica filtros generados por el usuario y condición row_active y current_season (momentáneamente)
            data_query =  filters_on_the_fly data_query, data_conditions, filtered_form_ids, filter_children, filter_user_children, filters_layers, intersect_width_layers, active_layers, timeslider_layers

            data_query = data_query.gsub('where_clause', "")
            data_query = data_query.gsub('where_layer_clause', "")
            data_query = data_query.gsub('name_layer_for_filters:', "-- name_layer_for_filters:")
            data_query = data_query.gsub('where_subform_clause', "")
            data_query = data_query.gsub('from_clause', "")
            data_query = ActiveRecord::Base.connection.execute(data_query)

            items["serie#{i}"] = data_query
            option_graph = graph
            chart_type = graph.chart.name
            ch["it#{i}"] = { "description": data_query, "chart_type": chart_type, "group_field": @field_group, "chart_properties": option_graph, "data": items, "graphics_options": g }
          end

        end
        querys << ch
      end
      querys
    end


    def kpi_without_graph_one_by_one(kpi_default,project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, filtered_form_ids, filter_children, filter_user_children, user_id, from_date, to_date, from_date_subform, to_date_subform, indicator_id, timeslider_layers, filters_layers,intersect_width_layers, active_layers)

      querys = []
      query_full = ''
      @ct = Apartment::Tenant.current
      sql_full = ''

      if kpi_default == "false"
        chart = AnalyticsDashboard.where(project_type_id: project_type_id, id: indicator_id, graph: false).first
        sql_full = chart.sql_full
        if sql_full.blank?
          query_full = data_for_initial_query chart, project_type_id, false
        else
          #Trae query avanzado
          query_full = chart.sql_full
        end
      else
        #Genera query para Seleccionados
        query_full = initial_query "count", "main.id","","",project_type_id , false
      end


      if type_box == 'extent'
        query_full = query_extent size_box, project_type_id, false, query_full
      else
        query_full = query_draw_polygon size_box, project_type_id, false, query_full
      end

      if kpi_default == "true"
        current_tenant = Apartment::Tenant.current
        total = " SELECT DISTINCT main.id "
        total += " FROM #{current_tenant}.projects main from_clause"
        total += " WHERE where_clause main.project_type_id = #{project_type_id}"
        total += " AND main.row_active = true AND main.current_season = true"

        # Aplica filtros owner, atributo e intercapa (para total también)
        total = conditions_for_attributes_and_owner total, user_id, project_type_id

        # Aplica filtro time_slider para total
        total = apply_time_slider_filter total, from_date, to_date, from_date_subform, to_date_subform , timeslider_layers

        total = total.gsub('where_clause', "")
        total = total.gsub('from_clause', "")

        total = ActiveRecord::Base.connection.execute(total)
      end

      # Aplica filtros owner, atributo e intercapa (para total también)
      query_full = conditions_for_attributes_and_owner query_full, user_id, project_type_id

      # Aplica filtro time_slider
      query_full = apply_time_slider_filter query_full, from_date, to_date, from_date_subform, to_date_subform , timeslider_layers

      # Aplica filtros generados por el usuario y condición row_active y current_season (momentáneamente)
      query_full =  filters_on_the_fly query_full, data_conditions, filtered_form_ids, filter_children, filter_user_children, filters_layers, intersect_width_layers, active_layers, timeslider_layers

      #Limpia el query
      query_full = query_full.gsub('where_clause', "")
      query_full = query_full.gsub('where_layer_clause', "")
      query_full = query_full.gsub('name_layer_for_filters:', "-- name_layer_for_filters:")
      query_full = query_full.gsub('where_subform_clause', "")
      query_full = query_full.gsub('from_clause', "")

      #ejecuta el query
      query_full = ActiveRecord::Base.connection.execute(query_full)
      if(kpi_default == "true")
        total_row = total.count
        row_selected = query_full.to_a[0]["count"]
        avg_selected = [{ "count": ((row_selected.to_f / total_row.to_f) * 100).round(2) }]
        querys << { "title": 'Total', "description": 'Total', "data": [{ "count": total_row }], "id": 1000 }
        querys << { "title": 'Seleccionado', "description": 'select', "data": [{ "count": row_selected }], "id": 1001 }
        querys << { "title": '% del Total', "description": 'AVG', "data": avg_selected, "id": 1002 }
        querys
      else
        querys << { "title": "#{chart.title}", "description": "kpi_sin grafico", "data": query_full, "id": chart.id }
        querys
      end

    end


    def indicator_heatmap (project_type_id, indicator_id, size_box, type_box, data_conditions, user_id, from_date, to_date, from_date_subform, to_date_subform, filtered_form_ids , filter_children , filter_user_children, filters_layers, intersect_width_layers, active_layers , timeslider_layers)
      #Revisar cuando el indicador es avanzado.
      chart = AnalyticsDashboard.find(indicator_id)

      items = {}
      if chart.sql_full.blank?
        data_query = data_for_initial_query chart, project_type_id , true
      else
        data_query = chart.sql_full
      end

      # Consulta los registros según filtro geográfico
      if type_box == 'extent'
        data_query = query_extent size_box, project_type_id, chart.children, data_query
      else
        data_query = query_draw_polygon size_box, project_type_id, chart.children, data_query
      end

      # Aplica filtros owner, atributo e intercapa
      data_query = conditions_for_attributes_and_owner data_query, user_id, project_type_id

      # Aplica filtro time_slider
      data_query = apply_time_slider_filter data_query, from_date, to_date, from_date_subform, to_date_subform , filters_layers

      # Aplica filtros generados por el usuario y condición row_active y current_season (momentáneamente)
      data_query =  filters_on_the_fly data_query, data_conditions, filtered_form_ids, filter_children, filter_user_children, filters_layers, intersect_width_layers, active_layers, timeslider_layers

      data_query = data_query.gsub('where_clause', "")
      data_query = data_query.gsub('where_layer_clause', "")
      data_query = data_query.gsub('name_layer_for_filters:', "-- name_layer_for_filters:")
      data_query = data_query.gsub('where_subform_clause', "")
      data_query = data_query.gsub('from_clause', "")
      data_query = ActiveRecord::Base.connection.execute(data_query)

      #querys = data_query.select("st_x(main.the_geom) as lng, st_y(main.the_geom) as lat").group('main.the_geom')
      data_query
    end
  end
end
