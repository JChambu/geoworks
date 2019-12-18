class Admin::RolesController < ApplicationController
  before_action :set_role, only: [:show, :edit, :update, :destroy]

  # GET /roles
  # GET /roles.json
  def index
    @roles = Role.all
  end

  # GET /roles/1
  # GET /roles/1.json
  def show
  end

  # GET /roles/new
  def new
    @role = Role.new
    @permission = @role.permissions.build
  end

  # GET /roles/1/edit
  def edit
    @permissions = @role.permissions.all
  end

  # POST /roles
  # POST /roles.json
  def create
    @role = Role.new(role_params)
    respond_to do |format|
      if @role.save
        if !params[:permissions].nil?
        params[:permissions].each do |a|
          params[:permissions][a].each do |r| 
            @a = Permission.new
            @a['event_id'] = r.to_i
            @a['model_type_id'] = a.to_i
            @a['role_id'] = @role.id
            @a.save!
          end 
        end 
        end 
        format.html { redirect_to admin_roles_path, notice: 'Role was successfully created.' }
        format.json { render :show, status: :created, location: @role }
      else
        format.html { render :new }
        format.json { render json: @role.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /roles/1
  # PATCH/PUT /roles/1.json
  def update
    respond_to do |format|
       if @role.update(role_params)
         Permission.where(role_id: @role.id).destroy_all
        if !params[:permissions].nil?
        params[:permissions].each do |a|
          params[:permissions][a].each do |r|
            @a = Permission.new()
            @a['event_id'] = r.to_i
            @a['model_type_id'] = a.to_i
            @a['role_id'] = @role.id
            @a.save!
          end 
        end 
        end 
         format.html { redirect_to admin_roles_path, notice: 'Role was successfully updated.' }
         format.json { render :show, status: :ok, location: @role }
       else
         format.html { render :edit }
         format.json { render json: @role.errors, status: :unprocessable_entity }
       end
    end
  end

  # DELETE /roles/1
  # DELETE /roles/1.json
  def destroy
    @role.destroy
    respond_to do |format|
      format.html { redirect_to admin_roles_path, notice: 'Role was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_role
    @role = Role.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def role_params
    params.require(:role).permit(:name, permissions_attributes: [:id, :event_id, :role_id, :model_type_id])
  end
end
