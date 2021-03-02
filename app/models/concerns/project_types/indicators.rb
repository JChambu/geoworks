module ProjectTypes::Indicators
  extend ActiveSupport::Concern
  module ClassMethods

    def query_extent size_box, project_type_id, children=false, sql_full

      minx = size_box[0].to_f if !size_box.nil?
      miny = size_box[1].to_f if !size_box.nil?
      maxx = size_box[2].to_f if !size_box.nil?
      maxy = size_box[3].to_f if !size_box.nil?

      if sql_full.blank?

        # Arma el primer query para indicadores basic y complex y aplica ST_Contains por extent
        @data = Project
          .select('DISTINCT main.*')
          .from('projects main')
          .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
          .joins('INNER JOIN public.users ON users.id = main.user_id')
          .where('main.row_active = ?', true)
          .where('main.current_season = ?', true)
          .where('main.project_type_id = ?', project_type_id)
          .where("shared_extensions.ST_Contains(shared_extensions.ST_MakeEnvelope(#{minx}, #{maxy}, #{maxx}, #{miny}, 4326), main.#{:the_geom})")

        if children == true
          @data = @data.left_outer_joins(:project_data_child)
        end

      else
        @data = ''
        # Aplica ST_Contains por extent al query de indicadores advanced
        @data = sql_full.sub('where_clause', "where_clause shared_extensions.ST_Contains(shared_extensions.ST_MakeEnvelope(#{minx}, #{maxy}, #{maxx}, #{miny}, 4326), main.#{:the_geom}) AND ")
      end

      @data
    end

    def query_draw_polygon size_box, project_type_id, children=false, sql_full

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

      # Arma el primer query para indicadores basic y complex y aplica ST_Contains por polygon
      if sql_full.blank?
        @data = Project
          .select('DISTINCT main.*')
          .from('projects main')
          .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
          .joins('INNER JOIN public.users ON users.id = main.user_id')
          .where('main.row_active = true')
          .where('main.current_season = true')
          .where('main.project_type_id = ?', project_type_id)
          .where("shared_extensions.ST_Contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{arr1}}'), 4326), main.#{:the_geom})")


        if children == true
          @data = @data.left_outer_joins(:project_data_child)
        end
      else
        @data = ''
        # Aplica ST_Contains por polygon al query de indicadores advanced
        @data = sql_full.sub('where_clause', "where_clause shared_extensions.ST_Contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{arr1}}'), 4326), main.#{:the_geom}) AND ")
      end

      @data
    end

    # Aplica filtro de time_slider
    def apply_time_slider_filter data, from_date, to_date, sql_full

      if !from_date.blank? || !to_date.blank?

        if sql_full.blank?
          data = data.where("main.gwm_created_at BETWEEN '#{from_date}' AND '#{to_date}'")
        else
          data = data.sub('where_clause', "where_clause (main.gwm_created_at BETWEEN '#{from_date}' AND '#{to_date}') AND ")
        end

      else

        if sql_full.blank?
          data = data.where('main.row_enabled = ?', true)
        else
          data = data.sub('where_clause', "where_clause main.row_enabled = true AND ")
        end

      end
      @data = data
    end

    # Aplica filtros owner, atributo e intercapa
    def conditions_for_attributes_and_owner data, user_id, project_type_id, sql_full

      project_filter = ProjectFilter.where(user_id: user_id).where(project_type_id: project_type_id).first

      if !project_filter.nil?

        # Aplica filtro owner
        if project_filter.owner == true
          if sql_full.blank?
            data = data.where('main.user_id = ?', user_id)
          else
            data = data.sub('where_clause', "where_clause (main.user_id = #{user_id}) AND ")
          end
        end

        # Aplica filtro por atributo
        if !project_filter.properties.nil?
          project_filter.properties.to_a.each do |prop|
            if sql_full.blank?
              data = data.where("main.properties ->> '#{prop[0]}' = '#{prop[1]}'")
            else
              data = data.sub('where_clause', "where_clause (main.properties ->> '#{prop[0]}' = '#{prop[1]}') AND ")
            end
          end
        end

        # Aplica filtro intercapa
        if !project_filter.cross_layer_filter_id.nil?

          cross_layer_filter = ProjectFilter.where(user_id: user_id).where(id: project_filter.cross_layer_filter_id).first

          if sql_full.blank?

            # Cruza la capa del principal que contiene los hijos con la capa secunadaria
            data = data
              .except(:from).from('projects main CROSS JOIN projects sec')
              .where('shared_extensions.ST_Intersects(main.the_geom, sec.the_geom)')
              .where('sec.project_type_id = ?', cross_layer_filter.project_type_id)
              .where('sec.row_active = ?', true)
              .where('sec.current_season = ?', true)

            # Aplica filtro por owner a capa secundaria
            if cross_layer_filter.owner == true
              data = data.where('sec.user_id = ?', user_id)
            end

            # Aplica filtro por atributo a capa secundaria
            if !cross_layer_filter.properties.nil?
              cross_layer_filter.properties.to_a.each do |prop|
                data = data.where("sec.properties->>'#{prop[0]}' = '#{prop[1]}'")
              end
            end

          else

            # Cruza la capa del principal que contiene los hijos con la capa secunadaria
            data = data.sub('from_clause', "CROSS JOIN projects sec")
            data = data.sub('where_clause', "where_clause (shared_extensions.ST_Intersects(main.the_geom, sec.the_geom))
              AND sec.project_type_id = #{cross_layer_filter.project_type_id}
              AND sec.row_active = true
              AND sec.current_season = true
              AND ")

            # Aplica filtro por owner a capa secundaria
            if cross_layer_filter.owner == true
              data = data.sub('where_clause', "where_clause (sec.user_id = #{user_id}) AND ")
            end

            # Aplica filtro por atributo a capa secundaria
            if !cross_layer_filter.properties.nil?
              cross_layer_filter.properties.to_a.each do |prop|
                data = data.sub('where_clause', "where_clause (sec.properties->>'#{prop[0]}' = '#{prop[1]}') AND ")
              end
            end

          end

        end

      end
      @data = data
    end

    def filters_for_sql data, chart
      if !chart.sql_sentence.blank?
        data = data.except(:select).select(chart.sql_sentence)
      end
      if chart.conditions_sql.blank?
        data = data.where(chart.conditions_sql)
      end
      if !chart.group_sql.blank?
        data = data.group(chart.group_sql)
      end
      if chart.order_sql.blank?
        data = data.order(chart.order_sql)
      end

      @data = data
    end

    def filters_simple data, chart, project_type_id

      if chart.project_field.key == 'app_estado'
        @field_select = analysis_type(chart.analysis_type.name, 'project_statuses.name', project_type_id) + ' as count'
      end

      if chart.project_field.key == 'app_usuario'
        @field_select = analysis_type(chart.analysis_type.name, 'users.name', project_type_id) + ' as count'
      end

      if chart.project_field.key != 'app_usuario' && chart.project_field.key != 'app_estado'
        @field_select = analysis_type(chart.analysis_type.name, chart.project_field.key, project_type_id) + ' as count'
      end

      if !chart.condition_field.blank?
        condition_field_custom = validate_type_field(chart.condition_field)
        data = data.where("#{condition_field_custom } #{chart.filter_input} '#{chart.input_value}'")
      end

      data = data.where(validate_type_field(chart.group_field) + " is not null ")

      if chart.group_field.key == 'app_estado'
        @field_group = "project_statuses.name "
        @field_select += ', project_statuses.name as name'
      end

      if chart.group_field.key == 'app_usuario'
        @field_group = "users.name"
        @field_select += ', users.name as name'
      end

      if chart.group_field.key != 'app_usuario' && chart.group_field.key !='app_estado'
        @field_group = validate_type_field(chart.group_field, 'group')
        @field_select +=", " + validate_type_field(chart.group_field, 'group') + " as name "
      end

      data = data.except(:select).select(@field_select).group(@field_group).order(@field_group)
      @data = data
    end

    def validate_type_field(field, method = nil)
      if field.field_type.name == 'Numerico'
        return "(main.properties->>'#{field.key}')::numeric"
      elsif field.field_type.name == 'Listado (opción multiple)' && method == 'group'
        return "jsonb_array_elements_text(main.properties->'#{field.key}')"
      else
        return "main.properties->>'#{field.key}'"
      end
    end

    def filters_on_the_fly data, data_conditions, filtered_form_ids, sql_full

      # Aplica filtros de padres
      if !data_conditions.blank?
        data_conditions.each do |key|

          @s = key.split('|')
          @field = @s[0]
          @filter = @s[1]
          @value = @s[2]

          # Aplica filtro por campo usuario
          if @field == 'app_usuario'
            if sql_full.blank?
              data =  data.where("users.name " + @filter + " #{@value}")
            else
              data = data.sub('where_clause', "where_clause users.name #{@filter} #{@value} AND ")
            end
          end

          # Aplica filtro por campo estado
          if @field == 'app_estado'
            if sql_full.blank?
              data =  data.where("project_statuses.name " + @filter + " #{@value} ")
            else
              data = data.sub('where_clause', "where_clause project_statuses.name #{@filter} #{@value} AND ")
            end
          end

          # Aplica filtro por otro campo
          if @field != 'app_usuario' && @field != 'app_estado'
            if sql_full.blank?
              data =  data.where("main.properties->>'" + @field +"'" +  @filter +" #{@value} ")
            else
              data = data.sub('where_clause', "where_clause (main.properties->>'#{@field}' #{@filter} #{@value}) AND ")
            end
          end

        end
      end

      # Aplica filtros de hijos
      if !filtered_form_ids.blank?

        if sql_full.blank?
          final_array = []
          filtered_form_ids.each do |ids_array|
            ids_array = JSON.parse(ids_array)
            final_array = final_array | ids_array
          end
          final_array = final_array.to_s.gsub(/\[/, '(').gsub(/\]/, ')')
          data = data.where("main.id IN #{final_array}")
        end

      end
      @data = data
    end

    def kpi_new(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, filtered_form_ids, user_id, from_date, to_date)

      querys=[]
      @op = option_graph
      @dashboard_id = dashboard_id

      @ct = Apartment::Tenant.current
      @graph = Graphic.where(dashboard_id: @dashboard_id)
      @graph.each do |g|
        @gr = GraphicsProperty.where(graphic_id: g)
        ch = {}
        @gr.each_with_index do |graph, i|
          @analytics_charts = AnalyticsDashboard.where(id: graph.analytics_dashboard_id)
          @analytics_charts.each do |chart|
            @items = {}

            # Consulta los registros según filtro geográfico
            if type_box == 'extent'
              @data = query_extent size_box, project_type_id, chart.children, chart.sql_full
            else
              @data = query_draw_polygon size_box, project_type_id, chart.children, chart.sql_full
            end

            # Aplica filtros owner, atributo e intercapa
            conditions_project_filters = conditions_for_attributes_and_owner @data, user_id, project_type_id, chart.sql_full

            # Aplica filtro time_slider
            @data = apply_time_slider_filter @data, from_date, to_date, chart.sql_full

            # Aplica filtros generados por el usuario
            conditions_on_the_fly =  filters_on_the_fly @data, data_conditions, filtered_form_ids, chart.sql_full

            if chart.kpi_type == 'basic'
              filters_simple = filters_simple @data, chart, project_type_id
            elsif chart.kpi_type == 'complex'
              filters_for_sql = filters_for_sql @data, chart
            else
              @data = @data.sub('where_clause', "")
              @data = @data.sub('from_clause', "")
              @data = ActiveRecord::Base.connection.execute(@data)
            end

            @items["serie#{i}"] = @data
            @option_graph = graph
            chart_type = graph.chart.name
            ch["it#{i}"] = { "description": @data, "chart_type": chart_type, "group_field": @field_group, "chart_properties": @option_graph, "data": @items, "graphics_options": g }
          end
          ch
        end
        querys << ch
        @qu =querys
      end
      querys
    end

    def kpi_without_graph(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, filtered_form_ids, user_id, from_date, to_date)

      querys = []
      @data_fixed = ''
      @op = option_graph
      @ct = Apartment::Tenant.current
      sql_full = ''

      # Indicadores generados por defecto
      # # # # # # # # # # # # # # # # # #

      # Consulta los registros según filtro geográfico
      if type_box == 'extent'
        @data_fixed = query_extent size_box, project_type_id, sql_full
      else
        @data_fixed = query_draw_polygon size_box, project_type_id, sql_full
      end

      # Aplica filtros owner, atributo e intercapa a "Seleccionado" y "% del Total"
      @data_fixed = conditions_for_attributes_and_owner @data_fixed, user_id, project_type_id, sql_full

      # Aplica filtro time_slider
      @data_fixed = apply_time_slider_filter @data_fixed, from_date, to_date, sql_full

      # Aplica filtros generados por el usuario
      @data_fixed = filters_on_the_fly @data_fixed, data_conditions, filtered_form_ids, sql_full

      @total_row = Project
        .select('DISTINCT main.*')
        .from('projects main')
        .where('main.project_type_id = ?', project_type_id)
        .where('main.row_active = ?', true)
        .where('main.current_season = ?', true)

      # Aplica filtros owner, atributo e intercapa al "Total"
      @ctotal = conditions_for_attributes_and_owner @total_row, user_id, project_type_id, sql_full

      # Aplica filtro time_slider
      @ctotal = apply_time_slider_filter @ctotal, from_date, to_date, sql_full

      @total_row = @ctotal.count
      @row_selected = @data_fixed.count
      @avg_selected = [{ "count": ((@row_selected.to_f / @total_row.to_f) * 100).round(2) }]
      querys << { "title": 'Total', "description": 'Total', "data": [{ "count": @total_row }], "id": 1000 }
      querys << { "title": 'Seleccionado', "description": 'select', "data": [{ "count": @row_selected }], "id": 1001 }
      querys << { "title": '% del Total', "description": 'AVG', "data": @avg_selected, "id": 1002 }

      # Indicadores generados por el usuario
      # # # # # # # # # # # # # # # # # # # #

      @analytics_charts = AnalyticsDashboard.where(project_type_id: project_type_id, graph: false)

      @analytics_charts.each do |chart|

        # Consulta los registros según filtro geográfico
        if type_box == 'extent'
          data = query_extent size_box, project_type_id, chart.sql_full
        else
          data = query_draw_polygon  size_box, project_type_id, chart.sql_full
        end

        # Aplica filtro por atributos y owner
        data = conditions_for_attributes_and_owner data, user_id, project_type_id, chart.sql_full

        # Aplica filtro time_slider
        data = apply_time_slider_filter data, from_date, to_date, chart.sql_full

        # Aplica filtros generados por el usuario
        data = filters_on_the_fly data, data_conditions, filtered_form_ids, chart.sql_full


        if chart.kpi_type == 'basic'
          field_select = analysis_type(chart.analysis_type.name, chart.project_field.key, project_type_id) + ' as count'
          conditions_field = chart.condition_field
        elsif chart.kpi_type == 'complex'
          if !chart.sql_sentence.blank?
            field_select = chart.sql_sentence
          end
        else
          data = data.sub('where_clause', "")
          data = data.sub('from_clause', "")
          data = ActiveRecord::Base.connection.execute(data)
        end

        if !conditions_field.blank?
          data = data.where("main.properties->>'" + conditions_field.key + "' " + chart.filter_input + "'#{chart.input_value}'")
        end

        if chart.kpi_type != 'advanced'
          data = data.except(:select).select(field_select)
        end

        querys << { "title": "#{chart.title}", "description": "kpi_sin grafico", "data": data, "id": chart.id }

      end
      querys
    end

    def indicator_heatmap project_type_id, indicator_id, size_box, type_box, conditions, user_id

      dashboard = AnalyticsDashboard.find(indicator_id)
      @q =  kpi_new(project_type_id, true, size_box, type_box, dashboard.dashboard_id, conditions, user_id)
      @querys = @q[0]['it0'][:description].select("st_x(main.the_geom) as lng, st_y(main.the_geom) as lat").group('main.the_geom')
      @querys
    end

    def analysis_type(type, field, project_type_id)

      # REVIEW: Esta parte porque busca el field en el name y el resultado tiende a ser nil
      type_field = ProjectField.where(name: field, project_type_id: project_type_id).first

      # REVIEW: Esta condición deja pasar los valores nil, cuando no debería ser así
      if !type_field.nil? && (type_field.field_type.name =='Listado (opción multiple)' || type_field.field_type.name == 'Texto')

        field = 'count(DISTINCT main.*)'

      else

        field = "main.properties->>'#{field}'"

        case type
          when 'sum'
            query = " #{type}(DISTINCT( #{field} )::numeric) "
          when 'count'
            query = " #{type}(DISTINCT( #{field } )) "
          when 'avg'
            query = " #{type}(DISTINCT( #{field} )::numeric) "
          when 'min'
            query = " #{type}(DISTINCT( #{field} )::numeric) "
          when 'max'
            query = " #{type}(DISTINCT( #{field} )::numeric) "
          # when 'weighted_average'
          #   query = "case sum((properties->>'oferta')::numeric) when 0 then 0 else  sum((properties->>'" + field+ "')::numeric * (properties->>'oferta')::numeric) / sum((properties->>'oferta')::numeric) end "
        end
      end
    end
  end
end
