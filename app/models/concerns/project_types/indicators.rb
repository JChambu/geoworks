module ProjectTypes::Indicators
  extend ActiveSupport::Concern
  module ClassMethods
    def kpi_new(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, user_id)
      @arr1 = []
      @size = size_box
      if type_box == 'polygon'
        @size.each do |a,x|
          z = []
          @a = a
          @x = x
          x.each do |b,y|
            @b = b
            @y = y
            z.push(y)
          end
          @arr1.push([z])
        end
      else
        minx = size_box[0].to_f if !size_box.nil?
        miny = size_box[1].to_f if !size_box.nil?
        maxx = size_box[2].to_f if !size_box.nil?
        maxy = size_box[3].to_f if !size_box.nil?
      end
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
              data = Project.joins("left outer join project_data_children on projects.id = project_data_children.project_id", :project_status, :user).where(project_type_id: project_type_id).where("#{@ct}.st_contains(#{@ct}.st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})")
            else
              data = Project.joins("left outer join project_data_children on projects.id = project_data_children.project_id", :project_status, :user).where(project_type_id: project_type_id).where("st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{@arr1}}'),4326), #{:the_geom})")
            end

            project_filters = ProjectFilter.where(user_id: user_id).where(project_type_id: project_type_id)

            if !project_filters.nil?
              project_filters.each do |filter|
                filter.properties.to_a.each do |prop|
                  data =  data.where(" projects.properties->>'" + prop[0] +"' = '#{prop[1]}'")
                end
              end
            end

            if !chart.sql_sentence.blank?
              if chart.group_sql.blank?
                @field_group = "projects.properties->>'"+ chart.group_field.key + "'"
              else
                @field_group = chart.group_sql
              end
              if chart.order_sql.blank?
                data = data.select(chart.sql_sentence).group(@field_group).order(@field_group)
              else
                @order_sql = chart.order_sql
                data = data.select(chart.sql_sentence).group(@field_group).order(@order_sql)
              end
            else
              if chart.project_field.key == 'app_estado'
                @field_select = analysis_type(chart.analysis_type.name, 'project_statuses.name') + ' as count'
                @field_select += ', project_statuses.name  as name'
              end
              if chart.project_field.key == 'app_usuario'
                @field_select = analysis_type(chart.analysis_type.name, 'users.name') + ' as count'
                @field_select += ', users.name  as name'
              end

              if chart.project_field.key != 'app_usuario' && chart.project_field.key !='app_estado'
                @field_select = analysis_type(chart.analysis_type.name, "projects.properties->>'#{chart.project_field.key}'") + ' as count'
                @field_select += ", projects.properties->>'" + chart.group_field.key + "' as name "
              end

              if chart.project_field.key == 'app_estado'
                @field_group = "project_statuses.name "
              end
              if chart.project_field.key == 'app_usuario'
                @field_group = "users.name"
              end

              if chart.project_field.key != 'app_usuario' && chart.project_field.key !='app_estado'
                @field_group = "projects.properties->>'"+ chart.group_field.key + "'"
              end

              data =  data.select(@field_select).group(@field_group).order(@field_group)
            end
            if !data_conditions.blank?
              data_conditions.each do |key| 
                @s = key.split('|')
                @field = @s[0]
                @filter = @s[1]
                @value = @s[2]
                data =  data.where(" projects.properties->>'" + @field +"'" +  @filter +"#{@value}")
              end
            end
            conditions_field = chart.condition_field
            @ch = chart
            @cf = conditions_field
            if !conditions_field.blank?
              data =  data.where("projects.properties->>'" + conditions_field.name + "' " + chart.filter_input + "'#{chart.input_value}'")
            else
              data = data.where(chart.conditions_sql) if !chart.conditions_sql.blank? 
            end
            @items["serie#{i}"] = data
            @option_graph = graph
            chart_type = graph.chart.name
            ch["it#{i}"] = { "description":data.to_sql, "chart_type":chart_type, "group_field":@field_group,"chart_properties": @option_graph, "data":@items, "graphics_options": g}
          end
          ch
        end
        querys << ch
        @qu =querys
      end
      querys
    end

    def self.kpi_without_graph(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions, user_id)

      @ct = Apartment::Tenant.current
      @type_box = type_box
      @arr1 = []

      @size = size_box

      @size = size_box
      if type_box == 'polygon'
        @size.each do |a,x|
          z = []
          @a = a
          @x = x
          x.each do |b,y|
            @b = b
            @y = y
            z.push(y)
          end
          @arr1.push([z])
        end
      else
        minx = size_box[0].to_f if !size_box.nil?
        miny = size_box[1].to_f if !size_box.nil?
        maxx = size_box[2].to_f if !size_box.nil?
        maxy = size_box[3].to_f if !size_box.nil?
      end
      querys=[]
      @data_fixed = ''
      @op = option_graph

      if type_box == 'extent'
        data = Project.where(project_type_id: project_type_id).where("#{@ct}.st_contains(#{@ct}.st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})")
        @data_fixed = data
      end

      if type_box == 'polygon'
        data = Project.where(project_type_id: project_type_id).where("st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{@arr1}}'),4326), #{:the_geom})")
        @data_fixed = data
      end

      project_filters = ProjectFilter.where(user_id: user_id).where(project_type_id: project_type_id)
      if !project_filters.nil?
        project_filters.each do |filter|
          filter.properties.to_a.each do |prop|
            data =  data.where(" projects.properties->>'" + prop[0] +"' = '#{prop[1]}'")
          end
        end
      end
      @data_fixed = data
      if !data_conditions.blank?
        data_conditions.each do |key| 
          @s = key.split('|')
          @field = @s[0]
          @filter = @s[1]
          @value = @s[2]
          if (@filter == '<' || @filter == '>' || @filter == '>=' || @filter == '<=' )
            data =  data.where(" (properties->>'" + @field +"')::numeric" +  @filter +"#{@value}")
          else
            data =  data.where(" properties->>'" + @field +"'" +  @filter +"#{@value}")
          end 
        end
        @data_fixed = data
      end


      @total_row = Project.where(project_type_id: project_type_id)

      if !project_filters.nil?
        project_filters.each do |filter|
          filter.properties.to_a.each do |prop|
            @total_row = @total_row.where(" projects.properties->>'" + prop[0] +"' = '#{prop[1]}'")

          end
        end
      end
      @total_row = @total_row.count
      @row_selected = @data_fixed.count 
      @avg_selected = [{ "count": ((@row_selected.to_f / @total_row.to_f) * 100).round(2)} ]
      querys << { "title":"Total", "description":"Total", "data":[{"count":@total_row}], "id": 1000}
      querys << { "title":"Selecionado", "description":"select", "data":[{"count":@row_selected}], "id": 1001}
      querys << { "title":"% del Total", "description":"AVG", "data":@avg_selected, "id": 1002}

      @analytics_charts = AnalyticsDashboard.where(project_type_id: project_type_id, graph: false)
      @analytics_charts.each do |chart|


        if !chart.sql_sentence.blank?

          field_select = chart.sql_sentence
        else
          field_select = analysis_type(chart.analysis_type.name, "projects.properties->>'#{chart.project_field.key}'") 
          conditions_field = chart.condition_field
        end
        if !data_conditions.blank?
          data_conditions.each do |key| 
            @s = key.split('|')
            @field = @s[0]
            @filter = @s[1]
            @value = @s[2]
            if (@filter == '<' || @filter == '>' || @filter == '>=' || @filter == '<=' )
              data =  data.where(" (properties->>'" + @field +"')::numeric" +  @filter +"#{@value}")
            else
              data =  data.where(" properties->>'" + @field +"'" +  @filter +"#{@value}")
            end 
          end
        end
        if !conditions_field.blank?
          data =  data.where(" properties->>'" + conditions_field.name + "' " + chart.filter_input + "'#{chart.input_value}'")
        end
        data=   data.select(field_select)
        querys << { "title":"#{chart.title}", "description":"kpi_sin grafico", "data":data, "id": chart.id}
      end
      querys
    end
  end
end
