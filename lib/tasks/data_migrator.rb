# -*- coding: utf-8 -*-
class DataMigrator  
  def self.start args
    create_old_db_connection args
    load_users

    load_poi_types
    load_food_types
    load_chains
    load_poi_sub_types

    load_countries
    load_provinces
    load_departments
    load_cities    

    load_street_types

    load_pois
  end

  def self.load_users
    load_resource User, "users" do |new_user, old_user|
      new_user.id = old_user["id"]
      new_user.name = old_user["full_name"]
      new_user.email = "#{old_user["user_name"]}@change.me"
      new_user.password = "123456"
      new_user.role = new_role(old_user["role"])
    end
  end

  def self.new_role old_role
    return "User" unless old_role == "Admin" 
    old_role
  end

  def self.load_pois
    @not_validated_id = PoiStatus.not_validated.id
    @validated_id = PoiStatus.validated.id
    @delivered_id = PoiStatus.delivered.id

    @gisworking_id = PoiSource.gisworking.id
    @navteq_id = PoiSource.navteq.id

    puts "LOADING POIS..."
    puts "Starting at #{Time.now}"

    Poi.delete_all
    result = query "SELECT * FROM pois";

    result.each do |op|
      np = load_first_poi_version op
      load_updated_version np, op
    end
    puts "Finished at #{Time.now}"
  end

  def self.load_first_poi_version op
    np = Poi.new
    np.identifier = op["id"]
    np.old_identifier = op["old_poi_identifier"]
    np.duplicated_identifier = nil

    np.name = op["old_poi_name"]
    np.short_name = nil

    np.poi_type_id = op["old_poi_type_id"]
    np.poi_sub_type_id = op["old_poi_sub_type_id"]
    np.chain_id = op["old_chain_id"]
    np.food_type_id = op["old_food_type_id"]

    np.street_type_id = op["old_street_type_id"]
    np.street_name = op["old_street_name"]
    np.house_number = op["old_house_number"]
    np.location = nil
    np.city_id = op["old_city_id"]
    np.priority = nil
    np.the_geom = op["old_geom"]

    np.cel_number = nil
    np.phone = op["old_phone_number"]
    np.second_phone = nil
    np.fax = nil
    np.email = op["old_email"]
    np.second_email = nil
    np.website = op["old_website"]
    np.contact = nil

    np.poi_status_id = @not_validated_id
    np.poi_source_id = get_poi_source_id op["new_poi"]
    np.active = true
    np.deleted = false
    np.created_at = op["created_at"]
    np.control_date = nil
    np.user_id = nil
    np.save(validate: false)
    np
  end

  def self.load_updated_version np, op
    np.identifier = op["id"]
    np.old_identifier = op["old_poi_identifier"]
    np.duplicated_identifier = op["duplicated"]

    np.name = op["name"]
    np.short_name = op["short_name"]

    np.poi_type_id = op["poi_type_id"]
    np.poi_sub_type_id = op["poi_sub_type_id"]
    np.chain_id = op["chain_id"]
    np.food_type_id = op["food_type_id"]

    np.street_type_id = op["street_type_id"]
    np.street_name = op["street_name"]
    np.house_number = op["house_number"]
    np.location = op["location"]
    np.city_id = op["city_id"]
    np.priority = op["priority"]
    np.the_geom = op["the_geom"]

    np.cel_number = op["cel_number"]
    np.phone = op["phone_number"]
    np.second_phone = op["phone_number2"]
    np.fax = op["fax_number"]
    np.email = op["email"]
    np.note = op["other_information"]
    np.second_email = op["email2"]
    np.website = op["website"]
    np.contact = op["contracts"]

    np.poi_status_id = get_poi_status_id(op["controlled"], op["developed"])
    np.poi_source_id = get_poi_source_id(op["new_poi"])
    np.active = op["active"]
    np.deleted = op["deleted"]
    np.control_date = get_control_date(op["updated_at"].to_date, np.poi_status_id)
    np.user_id = op["user_id"]
    np.save(validate: false)
  end

  def self.get_poi_status_id validated, delivered
    return @delivered_id if delivered == 't'
    return @validated_id if validated == 't'
    @not_validated_id
  end

  def self.get_control_date(control_date, poi_status_id)
    if poi_status_id == @delivered_id or
       poi_status_id == @validated_id
       return control_date
    end
    return nil
  end

  def self.get_poi_source_id new_poi
    return @navteq_id if new_poi.nil? or new_poi == 'f'
    return @gisworking_id if new_poi == 't'
    return nil
  end

  def self.load_street_types
    load_resource StreetType, "street_types" do |new_street_type, old_street_type|
      new_street_type.id = old_street_type["id"]
      new_street_type.name = old_street_type["name"]
    end
  end

  def self.load_poi_sub_types
    load_resource PoiSubType, "poi_sub_types" do |new_poi_sub_type, old_poi_sub_type|
      new_poi_sub_type.id = old_poi_sub_type["id"]
      new_poi_sub_type.name = old_poi_sub_type["name"]
      new_poi_sub_type.poi_type_id = old_poi_sub_type["poi_type_id"]
    end
  end

  def self.load_chains
    load_resource Chain, "chains" do |new_chain, old_chain|
      new_chain.id = old_chain["id"]
      new_chain.name = old_chain["name"]
      new_chain.poi_type_id = old_chain["poi_type_id"]
    end
  end

  def self.load_food_types
    load_resource FoodType, "food_types" do |new_food_type, old_food_type|
      new_food_type.id = old_food_type["id"]
      new_food_type.name = old_food_type["name"]
      new_food_type.poi_type_id = old_food_type["poi_type_id"]
    end
  end

  def self.load_countries
    load_resource Country, "countries" do |new_country, old_country|
      new_country.id = old_country["id"]
      new_country.name = old_country["name"]
    end
  end

  def self.load_provinces
    load_resource Province, "provinces" do |new_province, old_province|
      new_province.id = old_province["id"]
      new_province.name = old_province["name"]
      new_province.country_id = old_province["country_id"]
    end
  end

  def self.load_departments
    load_resource Department, "departments" do |new_department, old_department|
      new_department.id = old_department["id"]
      new_department.name = old_department["name"]
      new_department.province_id = old_department["province_id"]
    end
  end

  def self.load_cities
    load_resource City, "cities" do |new_city, old_city|
      new_city.id = old_city["id"]
      new_city.name = old_city["name"]
      new_city.department_id = old_city["department_id"]
      new_city.zip = old_city["zip"]
      new_city.proiority =  old_city["proiority"]
    end
  end

  def self.load_poi_types
    load_resource PoiType, "poi_types" do |new_poi_type, old_poi_type|
      new_poi_type.id = old_poi_type["id"]
      new_poi_type.name = old_poi_type["name"]
    end
  end

  def self.load_resource model, table_name, clean_new_table = true
    puts "loading #{model.model_name.human.pluralize.titleize}..."

    model.delete_all if clean_new_table
    result = query "SELECT * FROM #{table_name}";

    result.each do |old_resource|
      new_resource = model.new
      yield new_resource, old_resource
      new_resource.save(validate: false)
    end

    ActiveRecord::Base.connection.execute "SELECT setval('#{table_name}_id_seq'::regclass, MAX(id)) FROM #{table_name};";
    puts "#{model.model_name.human.pluralize.titleize} loaded!!!"
  end

  def self.create_old_db_connection args
    @conn = PG.connect :host => args[:host], :user => 'postgres', :password => 'postgres', :dbname => args[:dbname]
  end

  def self.query param
    @conn.exec param
  end
end