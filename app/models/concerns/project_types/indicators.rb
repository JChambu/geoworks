module ProjectTypes::Indicators
  extend ActiveSupport::Concern
  module ClassMethods

    def query_extent size_box, project_type_id, children=false, sql_full

      minx = size_box[0].to_f if !size_box.nil?
      miny = size_box[1].to_f if !size_box.nil?
      maxx = size_box[2].to_f if !size_box.nil?
      maxy = size_box[3].to_f if !size_box.nil?

      if sql_full.blank?
        # Aplica st_contains a indicadores basic y complex
        @data = Project.joins(:project_status, :user).
          where(project_type_id: project_type_id).
          where("shared_extensions.st_contains(shared_extensions.st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})").
          where(row_active: true)
          if children == true
            @data = @data.left_outer_joins(:project_data_child)
          end
      else
        # Aplica st_contains a indicadores advanced
        @data = sql_full.sub('where_clause', "where_clause shared_extensions.st_contains(shared_extensions.st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), main.#{:the_geom}) AND ")
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

      # Aplica st_contains a indicadores basic y complex
      if sql_full.blank?
        @data = Project.joins(:project_status, :user).
          where(project_type_id: project_type_id).
          where("st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{arr1}}'),4326), #{:the_geom})").
          where(row_active: true)
        if children == true
          @data = @data.left_outer_joins(:project_data_child)
        end
      # Aplica st_contains a indicadores advanced
      else
        @data = sql_full.sub('where_clause', "where_clause st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{arr1}}'),4326), main.#{:the_geom}) AND ")
      end

      @data
    end

    def conditions_for_attributes_and_owner data, user_id, project_type_id

      project_filters = ProjectFilter.where(user_id: user_id).where(project_type_id: project_type_id).first

      if !project_filters.nil?
        project_filters.properties.to_a.each do |prop|
          data =  data.where(" projects.properties->>'" + prop[0] +"' = '#{prop[1]}'")
        end

        if project_filters.owner == true
          data = data.where(user_id: user_id)
        end
      end
      @data = data
    end

    def filters_for_sql data, chart
      if !chart.sql_sentence.blank?
        data = data.select(chart.sql_sentence)
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

      if chart.project_field.key != 'app_usuario' && chart.project_field.key !='app_estado'
        @field_select = analysis_type(chart.analysis_type.name, chart.project_field.key, project_type_id) + ' as count'
      end
      if !chart.condition_field.blank?
        condition_field_custom =  validate_type_field(chart.condition_field)
        data =  data.where("#{condition_field_custom } #{chart.filter_input}  '#{chart.input_value}'")
      end

      data = data.where(validate_type_field(chart.group_field) + " is not null ")
      if chart.group_field.key == 'app_estado'
        @field_group = "project_statuses.name "
        @field_select += ', project_statuses.name  as name'
      end
      if chart.group_field.key == 'app_usuario'
        @field_group = "users.name"
        @field_select += ', users.name  as name'
      end

      if chart.group_field.key != 'app_usuario' && chart.group_field.key !='app_estado'
        @field_group = validate_type_field(chart.group_field, 'group')
        @field_select +=", " +  validate_type_field(chart.group_field, 'group') + " as name "
      end
      data =  data.select(@field_select).group(@field_group).order(@field_group)
      @data = data
    end

    def validate_type_field(field, method = nil)
      if field.field_type.name == 'Numerico'
        return "(projects.properties->>'#{field.key}')::numeric"
      elsif field.field_type.name == 'Listado (opción multiple)' && method == 'group'
        return "jsonb_array_elements_text(projects.properties->'#{field.key}')"
      else
        return "projects.properties->>'#{field.key}'"
      end
    end

    def filters_on_the_fly data, data_conditions, sql_full

      data_conditions.each do |key|

        @s = key.split('|')
        @field = @s[0]
        @filter = @s[1]
        @value = @s[2]

        # Aplica filtro por campo usuario
        if @field == 'app_usuario'
          if sql_full.blank?
            data =  data.where(" users.name " + @filter + " #{@value}")
          else
            data = data.sub('where_clause', "where_clause users.name #{@filter} #{@value} AND ")
          end
        end

        # Aplica filtro por campo estado
        if @field == 'app_estado'
          if sql_full.blank?
            data =  data.where(" project_statuses.name " + @filter + " #{@value} ")
          else
            data = data.sub('where_clause', "where_clause project_statuses.name #{@filter} #{@value} AND ")
          end
        end

        # Aplica filtro por otro campo
        if @field != 'app_usuario' && @field != 'app_estado'
          if sql_full.blank?
            data =  data.where(" projects.properties->>'" + @field +"'" +  @filter +" #{@value} ")
          else
            data = data.sub('where_clause', "where_clause (main.properties->>'#{@field}' #{@filter} #{@value}) AND ")
          end
        end

      end
      @data = data
    end

    def kpi_new(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, user_id)
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

            if type_box == 'extent'
              @data = query_extent size_box, project_type_id, chart.children, chart.sql_full
            else
              @data = query_draw_polygon  size_box, project_type_id, chart.children, chart.sql_full
            end

            conditions_project_filters = conditions_for_attributes_and_owner @data, user_id, project_type_id

            # Aplica los filtros
            if !data_conditions.blank?
              conditions_on_the_fly =  filters_on_the_fly @data, data_conditions, chart.sql_full
            end

            if chart.kpi_type == 'basic'
              filters_simple = filters_simple @data, chart, project_type_id
            elsif chart.kpi_type == 'complex'
              filters_for_sql = filters_for_sql @data, chart
            else
              @data = @data.sub('where_clause', "")
              @data = ActiveRecord::Base.connection.execute(@data)
            end

            @items["serie#{i}"] = @data
            @option_graph = graph
            chart_type = graph.chart.name
            ch["it#{i}"] = { "description":@data, "chart_type":chart_type, "group_field":@field_group,"chart_properties": @option_graph, "data":@items, "graphics_options": g}
          end
          ch
        end
        querys << ch
        @qu =querys
      end
      querys
    end

    def kpi_without_graph(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, user_id)

      querys=[]
      @data_fixed = ''
      @op = option_graph
      @ct = Apartment::Tenant.current

      sql_full = ''

      if type_box == 'extent'
        @data_fixed = query_extent size_box, project_type_id, sql_full
      else
        @data_fixed = query_draw_polygon  size_box, project_type_id, sql_full
      end

      @data_fixed = conditions_for_attributes_and_owner @data_fixed, user_id, project_type_id

      # Aplica los filtros
      if !data_conditions.blank?
        @data_fixed = filters_on_the_fly @data_fixed, data_conditions, sql_full
      end

      @total_row = Project.where(project_type_id: project_type_id).where(row_active: true)

      @ctotal = conditions_for_attributes_and_owner @total_row, user_id, project_type_id
      @total_row = @ctotal.count
      @row_selected = @data_fixed.count
      @avg_selected = [{ "count": ((@row_selected.to_f / @total_row.to_f) * 100).round(2)} ]
      querys << { "title":"Total", "description":"Total", "data":[{"count":@total_row}], "id": 1000}
      querys << { "title":"Selecionado", "description":"select", "data":[{"count":@row_selected}], "id": 1001}
      querys << { "title":"% del Total", "description":"AVG", "data":@avg_selected, "id": 1002}

      @analytics_charts = AnalyticsDashboard.where(project_type_id: project_type_id, graph: false)
      @analytics_charts.each do |chart|

        if type_box == 'extent'
          data = query_extent size_box, project_type_id, chart.sql_full
        else
          data = query_draw_polygon  size_box, project_type_id, chart.sql_full
        end

        if chart.kpi_type == 'basic'
          field_select = analysis_type(chart.analysis_type.name, chart.project_field.key, project_type_id) + ' as count'
          conditions_field = chart.condition_field
        elsif chart.kpi_type == 'complex'
          if !chart.sql_sentence.blank?
            field_select = chart.sql_sentence
          end
        else
          data = data.sub('where_clause', "")
          data = ActiveRecord::Base.connection.execute(data)
        end

        # Aplica los filtros
        if !data_conditions.blank?
          data = filters_on_the_fly data, data_conditions, chart.sql_full
        end

        if !conditions_field.blank?
          data =  data.where(" properties->>'" + conditions_field.key + "' " + chart.filter_input + "'#{chart.input_value}'")
        end

        if chart.kpi_type != 'advanced'
          data = data.select(field_select)
        end

        querys << { "title":"#{chart.title}", "description":"kpi_sin grafico", "data":data, "id": chart.id}
      end
      querys
    end

    def indicator_heatmap project_type_id, indicator_id, size_box, type_box, conditions, user_id

      dashboard = AnalyticsDashboard.find(indicator_id)
      @q =  kpi_new(project_type_id, true, size_box, type_box, dashboard.dashboard_id, conditions, user_id)
      @querys = @q[0]['it0'][:description].select("st_x(the_geom) as lng, st_y(the_geom) as lat").group(:the_geom)
      @querys
    end

    def analysis_type(type, field, project_type_id)

      type_field = ProjectField.where(name: field, project_type_id: project_type_id).first
      if !type_field.nil? && (type_field.field_type.name =='Listado (opción multiple)' || type_field.field_type.name == 'Texto')
        field = ' count(*)'
      else
        field = "projects.properties->>'#{field}'"
      case type
      when 'sum'
        query = " #{type}(( #{field} )::numeric) "
      when 'count'
        query = " #{type}(( #{field } )) "
      when 'avg'
        query = " #{type}(( #{field} )::numeric) "
      when 'min'
        query = " #{type}(( #{field} )::numeric) "
      when 'max'
        query = " #{type}(( #{field} )::numeric) "
      # when 'weighted_average'
      #   query = "case sum((properties->>'oferta')::numeric) when 0 then 0 else  sum((properties->>'" + field+ "')::numeric * (properties->>'oferta')::numeric) / sum((properties->>'oferta')::numeric) end "
      end
    end
    end
  end
end
