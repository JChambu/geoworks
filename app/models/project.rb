class Project < ApplicationRecord

  require "json"
  belongs_to :project_type
  has_many :project_data_child
  #validate :validate_properties

  def self.geometry_bounds project_type_id

    Project.
      where(project_type_id: project_type_id).
      select("st_Xmin(st_collect(the_geom)) as minx, 
                        st_Ymin(st_collect(the_geom)) as miny,
                        st_Xmax(st_collect(the_geom)) as maxx,
                        st_Ymax(st_collect(the_geom)) as maxy").
      group(:project_type_id)

  end

  def validate_properties

    if !project_type.fields.nil?
      project_type.fields.each do |field|
        if field.required? && properties[field.name].blank?
          errors.add field.name, "must not be blank"
        end
        if field.cleasing_data?
          new_field = "new_" + field.name
          reg = RegexpType.find(field.regexp_type_id)
          regexp_type = /#{reg.expresion}/
          data_field = properties[field.name]
          regexp_data = regexp_type.match(data_field) 
          self.properties[new_field] = regexp_data[1] if !regexp_data.nil?
        end
      end
    end
  end

  def self.to_csv

    attributes = ProjectField.where(project_type_id: 6).select(:name)

    @at = [] 
    attributes.each do |a| 
      @at << a.name
    end

    CSV.generate(headers: true) do |csv|
      csv << @at
      @all = all
      all.each do |product|
        p product
        csv << @at.map { |attr|  product.send(attr) } 
      end
    end
  end

  def self.properties_field

    @fields = ProjectField.where(project_type_id: 31)
    @properties = Project.where(project_type_id: 32).select("properties->>'form_values'")

    #   @data = JSON.parse(@properties.to_h)
    #@properties.each do |row|  
    #


  end




end
