class ProjectTypesController < ApplicationController
  before_action :set_project_type, only: [:show, :edit, :update, :destroy]

  # GET /project_types
  # GET /project_types.json

  def filters
    respond_to do |format|
      format.html
      format.js

    end
  end

  def dashboard
  end

  def kpi

    @querys=[]

    #Extend
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
      
      #Datos para agrupar
      field_group_name = chart.group_field.name 
      

      @data = Project.where(project_type_id: params[:data_id])
      sql = "1=1"
     
         field_group = "properties->>'"+ chart.group_field.key + "'"
         field_select = " #{analysis_type}((properties->>'" + chart.project_field.key + "')::float) as count, "
         field_select += field_group + " as label"

        # chart_type = chart.chart.name
         @data =   @data.where(sql).select(field_select).group(field_group).order(count: :desc).limit(10)
         @querys<< { "title":"#{chart.title}", "kpi_id":chart.id,  "data":@data, "group": field_group_name, "select":chart.project_field.name}
      
      
      
      # sql = " st_contains(st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})" 
      
      # if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?

      #   field_select = " (choice_lists.color) as color"
      #   field_select += ", (choice_lists.label) as label"
      #   field_select += ", #{analysis_type}(properties->>'" + chart.project_field.key + "')"
       
      #   field_group = "properties->>'"+ chart.project_field.key + "'"
      #   field_group += ", label, color"
      
      # else
      #   p params[:graph]
      #   if params[:graph] == "true"
      #   field_select = " #{analysis_type}((properties->>'" + chart.project_field.key + "')::float)"
      #   field_select += ", properties->>'" + chart.project_field.key + "' as label "
      #   field_group = "properties->>'"+ chart.project_field.key + "'"
      #   else

      #   field_select = " #{analysis_type}(properties->>'" + chart.project_field.key + "')"
      #   field_select += ", properties->>'" + chart.project_field.key + "' as label"
      #   field_select_without_graph = " properties->>'" + chart.project_field.key + "'"
        
      #   field_group = "properties->>'"+ chart.group_field.name + "'"
      #   end
      # end 

      # if !conditions_field.blank?
      #   sql += " and properties->>'" + chart.project_field.key + "' " + chart.filter_input + "'#{chart.input_value}'"
      # end

      # if analysis_type == "Promedio"

      #   @data_extra= Project.where(sql).where("(properties->>'00d8') is not null").select("round((sum((properties->>'00d8')::numeric) / count((properties->>'05d5')::numeric)),2) as promedio")
      #   @querys << { "title":"#{chart.title}", "data":@data_extra[0]['promedio'], "id":"#{chart.id}"}

      # else
      # if analysis_type == "Participacion"
      #   @total_clientes = Project.where("project_type_id": params[:data_id]).count
      #   @data_extra_2 = 0 
      #   @data_extra_2 = Project.where(sql).select("round((((count(properties->>'05d5')::numeric) /  #{@total_clientes}) * 100 ),0)  as participacion") if @total_clientes > 0 
      #   @querys << { "title":"#{chart.title}", "data":@data_extra_2[0]['participacion'], "id":"#{chart.id}"}
      # else
      
      # if params[:graph] == "true"
      
      #   if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?
      #   @join = ("join choice_lists  on (properties->>'#{chart.project_field.key}')::integer = choice_lists.id" )
      #   @data =   @data.joins(@join).where(sql).select(field_select).group(field_group)
      # else

      #   @data =   @data.where(sql).select(field_select).group(field_group).order(count: :desc).limit(10)
      # end 
      #   chart_type = chart.chart.name

      #   @querys << { "title":"#{chart.title}", "type_chart":[chart_type],"data":@data, "group": chart.group_field.name, "select":chart.input_value}
      
      # else
      #   #@data =   Project.where(sql).sum("(#{field_select})::float") #funciona bien la suma
      #   #@data =   Project.where(sql).count("(#{field_select})::float") #funciona bien el contar
      #   @data =   @data.where(sql).send(analysis_type, "(#{field_select_without_graph})::float")
      #   @querys << { "title":"#{chart.title}", "data":@data, "id":"#{chart.id}"}

      # end
      # end
      # end
     end
    

  end


  def maps


    if params[:data_id] == '2'
      @projects = Project.where(project_type_id: params[:data_id]).select("the_geom")
    else

    @projects = Project.joins("left join choice_lists on (projects.properties->>'897d')::integer = choice_lists.id").where(project_type_id: params[:data_id]).select("the_geom,  properties->>'05d5' as client_id, 
properties->>'f2b1' as razon_social,
properties->>'9e2f' as ejecutivo, 
properties->>'00d8' as contratos,
case (properties->>'status')::integer
when 1 then 'Excelente'
when 2 then 'Bueno'
when 3 then 'Regular'
when 4 then 'Malo'
end as label,

case (properties->>'status')::integer
when 1 then '#A9F5BC'
when 2 then '#58ACFA'
when 3 then '#F7FE2E'
when 4 then '#FE2E2E'
end as color
              ")
    end                                                                

    if !params[:provincia].blank?
      @projects = @projects.where("properties->>'7926'=?", params[:provincia])
    end

  end

  def graph2
    ##  params[:data_id] = 'b4a38670-0fbc-45d6-a162-48517e4198ba'
    #  @query = ProjectType.graph2(params[:data_id])
  end


  def index
    @project_types = ProjectType.all
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
        format.html { redirect_to @project_type, notice: 'Project type was successfully created.' }
        format.json { render :show, status: :created, location: @project_type }
      else
        format.html { render :new }
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_types/1
  # PATCH/PUT /project_types/1.json
  def update
    respond_to do |format|
      if @project_type.update(project_type_params)
        format.html { redirect_to @project_type, notice: 'Project type was successfully updated.' }
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
    params.require(:project_type).permit(:name, {file:[]}, fields_attributes: [:id, :field_type, :name, :required, :cleasing_data, :georeferenced, :regexp_type_id]).merge(user_id: current_user.id)
  end
end
