class ProjectTypesController < ApplicationController
  before_action :set_project_type, only: [:show, :edit, :update, :destroy, :geocoding]

  # GET /project_types
  # GET /project_types.json

  def geocoding
      
    if params[:q].present?
      geo = ProjectType.build_geom(params[:q], params[:id])  
    end
  end
  
  
  def import_file
    @csv_load = ProjectType.read_csv(@project_type.file)
  end

  def filters

    respond_to do |format|
      format.html
      format.js
    end
  end

  def dashboard
  end

  def kpi
   
    @op_graph = params[:graph]
    @data_conditions = params[:data_conditions]

    filter_condition = []
    if !@data_conditions.nil?

      project_field = params[:data_conditions][:project_field]
      filter = params[:data_conditions][:filter]
      input_value = params[:data_conditions][:input_value]
      filter_condition = [project_field, filter, input_value]
    end

    @querys = ''
    if @op_graph == 'true'
      @querys = ProjectType.kpi_new(params[:data_id], @op_graph, params[:size_box], params[:type_box])
    else
      @querys = ProjectType.kpi_without_graph(params[:data_id], @op_graph, params[:size_box], params[:type_box], filter_condition)
    end
  end


  def kpi_2
    @querys = ProjectType.kpi_new(params[:data_id], params[:graph], params[:size_box])
    @querys=[]
    #Extend
    #
    minx = params[:size_box][0].to_f if !params[:size_box].nil?
    miny = params[:size_box][1].to_f if !params[:size_box].nil?
    maxx = params[:size_box][2].to_f if !params[:size_box].nil?
    maxy = params[:size_box][3].to_f if !params[:size_box].nil?

    @analytics_charts = AnalyticsDashboard.where(project_type_id: params[:data_id], graph: params[:graph])

    @analytics_charts.each do |chart|

      #tipo de analisis
      analysis_type = chart.analysis_type.name
      #condiciones extras
      conditions_field = chart.condition_field


      @data = Project.where(project_type_id: params[:data_id])
      sql = " st_contains(st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})" 

      if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?

        field_select = " (choice_lists.color) as color"
        field_select += ", (choice_lists.label) as label"
        field_select += ", #{analysis_type}(properties->>'" + chart.project_field.key + "')"

        field_group = "properties->>'"+ chart.project_field.key + "'"
        field_group += ", label, color"

      else
        if params[:graph] == true
          field_select = " #{analysis_type}(properties->>'" + chart.project_field.key + "')"
          field_select += ", properties->>'" + chart.project_field.key + "' as label "
          field_group = "properties->>'"+ chart.project_field.key + "'"
        else

          field_select = " #{analysis_type}(properties->>'" + chart.project_field.key + "') #{chart.const_field} "
          field_select += ", properties->>'" + chart.project_field.key + "' as label"
          field_select_without_graph = " properties->>'" + chart.project_field.key + "'"

          field_group = "properties->>'"+ chart.project_field.key + "'"
        end
      end 

      if !conditions_field.blank?
        sql = " properties->>'" + chart.project_field.key + "' " + chart.filter_input + "'#{chart.input_value}'"
      end

      if analysis_type == "Promedio"

        @data_extra= Project.where(sql).where("(properties->>'00d8') is not null").select("round((sum((properties->>'00d8')::numeric) / count((properties->>'05d5')::numeric)),2) as promedio")
        @querys << { "title":"#{chart.title}", "data":@data_extra[0]['promedio'], "id":"#{chart.id}"}

      else
        if analysis_type == "Participacion"
          @total_clientes = Project.where("project_type_id": params[:data_id]).count
          @data_extra_2 = 0 
          @data_extra_2 = Project.where(sql).select("round((((count(properties->>'05d5')::numeric) /  #{@total_clientes}) * 100 ),0)  as participacion") if @total_clientes > 0 
          @querys << { "title":"#{chart.title}", "data":@data_extra_2[0]['participacion'], "id":"#{chart.id}"}
        else

          if params[:graph] == "true"

            if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?
              @join = ("join choice_lists  on (properties->>'#{chart.project_field.key}')::integer = choice_lists.id" )
              @data =   @data.joins(@join).where(sql).select(field_select).group(field_group)
            else

              @data =   @data.where(sql).select(field_select).group(field_group).order(field_group)
            end 
            chart_type = chart.chart.name

            @querys << { "title":"#{chart.title}", "type_chart":[chart_type],"data":{"serie1":@d1, "serie2":@d2}}
          else
            #@data =   Project.where(sql).sum("(#{field_select})::float") #funciona bien la suma
            #@data =   Project.where(sql).count("(#{field_select})::float") #funciona bien el contar
            if chart.const_field.nil?
              @data =   @data.where(sql).send( analysis_type,"(#{field_select_without_graph}) ")
            else
              @data =   @data.where(sql).send(analysis_type, "(#{field_select_without_graph}))::float  #{chart.const_field} ")
            end
            @querys << { "title":"#{chart.title}", "data":@data, "id":"#{chart.id}"}
          end
        end
      end
    end
  end


  def kpi_anterior

    @querys=[]
    ####nuevo"""
    #    @size_box = params[:size_box].split(',') if !params[:size_box].nil?
    #    p minx = @size_box[0].to_f if !params[:size_box].nil?
    #    p miny = @size_box[1].to_f if !params[:size_box].nil?
    #    p maxx = @size_box[2].to_f if !params[:size_box].nil?
    #    p maxy = @size_box[3].to_f if !params[:size_box].nil?
    #########3
    #Extend
    #minx = params[:size_box][0].to_f if !params[:size_box].nil?
    #miny = params[:size_box][1].to_f if !params[:size_box].nil?
    #maxx = params[:size_box][2].to_f if !params[:size_box].nil?
    #maxy = params[:size_box][3].to_f if !params[:size_box].nil?

    @analytics_charts = AnalyticsDashboard.where(project_type_id: params[:data_id], graph: params[:graph])

    @analytics_charts.each do |chart|

      #tipo de analisis
      analysis_type = chart.analysis_type.name

      #condiciones extras
      conditions_field = chart.condition_field 

      #Datos para agrupar
      field_group_name = chart.group_field.name 
      @data = Project.where(project_type_id: params[:data_id])
      #     sql = "1=1"
      #sql += "and  st_contains(st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})" 

      field_group = "properties->>'"+ chart.group_field.key + "'"
      field_select = " #{analysis_type}((properties->>'" + chart.project_field.key + "')::float) as count, "
      field_select += field_group + " as label"

      # chart_type = chart.chart.name
      @data =   @data.where(sql).select(field_select).group(field_group).order(count: :desc).limit(100)
      @querys<< { "title":"#{chart.title}", "kpi_id":chart.id,  "data":@data, "group": field_group_name, "select":chart.project_field.name}


      sql = " st_contains(st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})" 

      if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?

        field_select = " (choice_lists.color) as color"
        field_select += ", (choice_lists.label) as label"
        field_select += ", #{analysis_type}(properties->>'" + chart.project_field.key + "')"
        field_group = "properties->>'"+ chart.project_field.key + "'"
        field_group += ", label, color"

      else
        p params[:graph]
        if params[:graph] == "true"
          field_select = " #{analysis_type}((properties->>'" + chart.project_field.key + "')::float)"
          field_select += ", properties->>'" + chart.project_field.key + "' as label "
          field_group = "properties->>'"+ chart.project_field.key + "'"
        else

          field_select = " #{analysis_type}(properties->>'" + chart.project_field.key + "')"
          field_select += ", properties->>'" + chart.project_field.key + "' as label"
          field_select_without_graph = " properties->>'" + chart.project_field.key + "'"

          field_group = "properties->>'"+ chart.group_field.name + "'"
        end
      end 

      if !conditions_field.blank?
        sql += " and properties->>'" + chart.project_field.key + "' " + chart.filter_input + "'#{chart.input_value}'"
      end

      if analysis_type == "Promedio"

        @data_extra= Project.where(sql).where("(properties->>'00d8') is not null").select("round((sum((properties->>'00d8')::numeric) / count((properties->>'05d5')::numeric)),2) as promedio")
        @querys << { "title":"#{chart.title}", "data":@data_extra[0]['promedio'], "id":"#{chart.id}"}

      else
        if analysis_type == "Participacion"
          @total_clientes = Project.where("project_type_id": params[:data_id]).count
          @data_extra_2 = 0 
          @data_extra_2 = Project.where(sql).select("round((((count(properties->>'05d5')::numeric) /  #{@total_clientes}) * 100 ),0)  as participacion") if @total_clientes > 0 
          @querys << { "title":"#{chart.title}", "data":@data_extra_2[0]['participacion'], "id":"#{chart.id}"}
        else

          if params[:graph] == "true"

            if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?
              @join = ("join choice_lists  on (properties->>'#{chart.project_field.key}')::integer = choice_lists.id" )
              @data =   @data.joins(@join).where(sql).select(field_select).group(field_group)
            else

              @data =   @data.where(sql).select(field_select).group(field_group).order(count: :desc).limit(10)
            end 
            chart_type = chart.chart.name

            @querys << { "title":"#{chart.title}", "type_chart":[chart_type],"data":@data, "group": chart.group_field.name, "select":chart.input_value}

          else
            #@data =   Project.where(sql).sum("(#{field_select})::float") #funciona bien la suma
            #@data =   Project.where(sql).count("(#{field_select})::float") #funciona bien el contar
            @data =   @data.where(sql).send(analysis_type, "(#{field_select_without_graph})::float")
            @querys << { "title":"#{chart.title}", "data":@data, "id":"#{chart.id}"}

          end
        end
      end
    end


  end


  def maps

    if params[:data_id] == '2'
      @projects = Project.where(project_type_id: params[:data_id]).select("the_geom")
    else

      @projects = Project.where(project_type_id: params[:data_id]).select("st_x(the_geom) as x, st_y(the_geom)as y ")
    end                                                                


    if !params[:project_field].blank?
      project_field = params[:project_field]
      filter = params[:filter]
      input_value = params[:input_value]

      @projects = @projects.where("properties->>'" + project_field +  "' " + filter  + " ?", input_value)
    end

  end

  def index

    #@has_project_types = HasProjectType.where(user_id: current_user.id )
    #@project_types = ProjectType.where(id: @has_project_types.project_type_id)
    if params[:search_project].nil? || params[:search_project].empty?
      @project_types = ProjectType.all
    else
      @project_types = ProjectType.where("name ILIKE :name", name: "%#{params[:search_project]}%")
    end
    @project_types = @project_types.paginate(:page => params[:page])
    #@project_fulcrum = ProjectType.query_fulcrum
  end

  # GET /project_types/1
  # GET /project_types/1.json
  def show
  end

  # GET /project_types/new
  def new
    @project_type = ProjectType.new
  end

  # GET /project_types/1/edit
  def edit

  end

  # POST /project_types
  # POST /project_types.json
  def create
    @project_type = ProjectType.new(project_type_params)

    respond_to do |format|
      if @project_type.save
        format.html { redirect_to project_types_path(), notice: 'Project type was successfully created.' }
        format.json { render :show, status: :created, location: @project_type }
      else
        format.html { render :new, status: :no_created}
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_types/1
  # PATCH/PUT /project_types/1.json
  def update
    respond_to do |format|
      if @project_type.update(project_type_params)
        format.html { redirect_to project_types_path(), notice: 'Project type was successfully updated.' }
        format.json { render :show, status: :ok, location: @project_type }
      else
        format.html { render :edit }
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /project_types/1
  # DELETE /project_types/1.json
  def destroy
    @project_type.destroy
    respond_to do |format|
      format.html { redirect_to project_types_url, notice: 'Project type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_project_type
    @project_type = ProjectType.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def project_type_params
    params.require(:project_type).permit(:name, {file:[]}, fields_attributes: [:id, :field_type, :name, :required, :cleasing_data, :georeferenced, :regexp_type_id])
  end
end
