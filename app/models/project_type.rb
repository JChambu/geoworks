class ProjectType < ApplicationRecord

  include ProjectTypes::Geoserver
  include ProjectTypes::Indicators
  include ProjectTypes::Scopes
  include ProjectTypes::Validations
  include ProjectTypes::GeoJson

  if Apartment::Tenant.current == 'fepedi'
    has_paper_trail on: [:destroy]
  end

  require 'rgeo/shapefile'
  require 'rgeo/geo_json'
  require 'json'
  require 'fileutils'
  require 'rgeoserver'
  require 'net/http'
  require 'uri'
  require 'csv'

  has_many :project_fields, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :dashboards, dependent: :destroy
  has_many :has_project_types, dependent: :destroy
  has_many :users, through: :has_project_types
  has_many :project_statuses, dependent: :destroy
  has_many :project_filters, dependent: :destroy
  has_many :analytics_dashboard, dependent: :destroy
  has_many :api_connection
  belongs_to :folder, optional: true
  accepts_nested_attributes_for :project_fields, allow_destroy: true
  accepts_nested_attributes_for :projects, allow_destroy: true

  FILTERS = %w(--> = < > <= >= !=)

  attr_accessor :file, :latitude, :longitude, :address, :department, :province, :country, :data, :type_file, :kind_file

  after_create :create_project_statuses
  after_create :new_dashboard
  after_create :load_file, if: :create_project_is_for_file
  after_create :create_view
  after_destroy :destroy_view
  after_update :destroy_view
  after_update :create_view

  def create_project_is_for_file
    return true if self.kind_file == 'true'
    return false
  end

  def create_project_statuses
    ProjectStatus.create(name: ProjectStatus::DEFAULT_NAME, color:"#f34c48", project_type_id: self.id, status_type: 'Asignable', priority: 1)
  end

  def new_dashboard
    Dashboard.create(name: "Dashboard_1", project_type_id: self.id )
  end

  def validate_options
    if !self.fields.nil?
      self.fields.each do |field|
        if field.cleasing_data?
          new_field = "new_" + field.name
          @new_project_field =  ProjectField.create(name: new_field, field_type: 'text_field', project_type_id: field.product_type_id)
          @new_project_field.save
        end
      end
    end
  end

  def self.counters(id)
    count = Project.where(project_type_id: id).count
  end

  def create_view
    fields = self.project_fields
    current_tenant = Apartment::Tenant.current
    project_type_id = self.id
    name_layer = self.name_layer
    type_geometry = self.type_geometry

    vv = "CREATE OR REPLACE VIEW #{current_tenant}.#{name_layer} AS "
    vv += " select "
    fields.each do |field|
      if field.key != ''
        if field.key != 'app_estado' && field.key != 'app_usuario' && field.key != 'app_id'
          vv += " properties->>'#{field.key}' as #{field.key}, "
        end
      end
    end
    vv += " users.name as app_usuario, "
    vv += " project_statuses.name as app_estado, "
    vv += " projects.id as app_id, "
    vv += " projects.gwm_created_at, "
    vv += " projects.gwm_updated_at, "
    vv += " projects.row_enabled, "
    vv += " projects.disabled_at, "
    vv += " projects.project_type_id, "
    vv += " shared_extensions.st_y(the_geom),  " if type_geometry == 'Point'
    vv += " shared_extensions.st_x(the_geom), "if type_geometry == 'Point'
    vv += " project_statuses.color, "
    vv += " the_geom "
    vv += " FROM #{current_tenant}.projects "
    vv += " LEFT OUTER JOIN #{current_tenant}.project_statuses ON projects.project_status_id = project_statuses.id "
    vv += " JOIN public.users ON users.id = projects.user_id "
    vv += " where projects.project_type_id =#{project_type_id} and row_active = true and current_season = true; "
    view = ActiveRecord::Base.connection.execute(vv)
    return
  end

  def destroy_view
    query = "DROP VIEW IF EXISTS #{self.name_layer}"
    ActiveRecord::Base.connection.execute(query)
  end

  def create_view_interpolation project_type_id
    name_layer = ProjectType.where(id: project_type_id).pluck(:name_layer).first
    fields = ProjectField.where(project_type_id:project_type_id)
    current_tenant = Apartment::Tenant.current

    vv = "CREATE OR REPLACE VIEW #{current_tenant}.#{name_layer} AS "
    vv += " select "
    fields.each do |field|
      if field.key != ''
        if field.key != 'app_estado' && field.key != 'app_usuario' && field.key != 'app_id'
          vv += " properties->>'#{field.key}' as #{field.key}, "
        end
      end
    end
    vv += " users.name as app_usuario, "
    vv += " project_statuses.name as app_estado, "
    vv += " projects.id as app_id, "
    vv += " projects.gwm_created_at, "
    vv += " projects.gwm_updated_at, "
    vv += " projects.row_enabled, "
    vv += " projects.disabled_at, "
    vv += " projects.project_type_id, "
    vv += " project_statuses.color, "
    vv += " the_geom "
    vv += " FROM #{current_tenant}.projects "
    vv += " LEFT OUTER JOIN #{current_tenant}.project_statuses ON projects.project_status_id = project_statuses.id "
    vv += " JOIN public.users ON users.id = projects.user_id "
    vv += " where projects.project_type_id =#{project_type_id} and row_active = true and current_season = true; "
    view = ActiveRecord::Base.connection.execute(vv)
    return
  end

  def destroy_view_interpolation project_type_id
    name_layer = ProjectType.where(id: project_type_id).pluck(:name_layer).first
    query = "DROP VIEW IF EXISTS #{name_layer}"
    ActiveRecord::Base.connection.execute(query)
  end

end
