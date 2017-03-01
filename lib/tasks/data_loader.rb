# -*- coding: utf-8 -*-
class DataLoader  
  def self.load_fake_lookup_data
    load_locations
    load_poi_types
    load_street_types
    load_random_pois
  end

  def self.load_street_types
    StreetType.find_or_create_by_name("Calle")
    StreetType.find_or_create_by_name("Avenida")
  end

  def self.load_poi_types
    bank = PoiType.find_or_create_by_name("Bank")
    restaurant = PoiType.find_or_create_by_name("Restaurant")
    coffe_shop = PoiType.find_or_create_by_name("Coffe Shop")
    hotel = PoiType.find_or_create_by_name("Hotel")

    PoiSubType.find_or_create_by_name("Santander", {:poi_type_id => bank.id})
    PoiSubType.find_or_create_by_name("Itau", {:poi_type_id => bank.id})
    PoiSubType.find_or_create_by_name("Manso Pancho", {:poi_type_id => restaurant.id})
    PoiSubType.find_or_create_by_name("Mr Dog", {:poi_type_id => restaurant.id})

    Chain.find_or_create_by_name("Mr Comida Mugre", {:poi_type_id => restaurant.id})
    Chain.find_or_create_by_name("Comidita Caliente srl", {:poi_type_id => restaurant.id})

    FoodType.find_or_create_by_name("Pizza", {:poi_type_id => restaurant.id})
    FoodType.find_or_create_by_name("Pollo", {:poi_type_id => restaurant.id} )       
  end

  def self.load_locations
    arg = Country.find_or_create_by_name("Argentina")

    mendoza = Province.find_or_create_by_name("Mendoza", {:country_id => arg.id})
    sluis = Province.find_or_create_by_name("San Luis", {:country_id => arg.id})

    gc = Department.find_or_create_by_name("Godoy Cruz", {:province_id => mendoza.id})
    lc = Department.find_or_create_by_name("Lujan de Cuyo", {:province_id => mendoza.id})
    cap = Department.find_or_create_by_name("Capital", {:province_id => mendoza.id})

    City.find_or_create_by_name("Carrodilla", {:department_id => lc.id})
    City.find_or_create_by_name("Pedriel", {:department_id => lc.id})
    City.find_or_create_by_name("El Bombal", {:department_id => gc.id})
    City.find_or_create_by_name("La sexta", {:department_id => gc.id})
  end

  def self.load_random_pois
    Poi.delete_all

    [*100..200].sample.times do
      pt = random_object(PoiType)
      chain_id = Chain.find_by_poi_type_id(pt.id).try(:id)
      poi_sub_type_id = PoiSubType.find_by_poi_type_id(pt.id).try(:id)
      food_type_id = FoodType.find_by_poi_type_id(pt.id).try(:id)
      poi_source = random_object(PoiSource)

      params = {
        :name => fake_name,
        :short_name => fake_name,
        :website => fake_web,
        :email => fake_mail,
        :second_email => fake_mail,
        :cel_number => fake_phone,
        :phone => fake_phone,
        :second_phone => fake_phone,
        :house_number => fake_number,
        :contact => fake_name,
        :priority => fake_priority,
        :city_id => random_object(City).id,
        :chain_id => chain_id,
        :food_type_id => food_type_id,
        :poi_source_id => poi_source.id,
        :poi_type_id => pt.id,
        :poi_sub_type_id => poi_sub_type_id,
        :street_name => fake_name,
        :street_type_id => random_object(StreetType).id,
        :user_id => random_object(User).id,
        :poi_status_id => random_object(PoiStatus).id,
        :control_date => time_rand(Time.local(2013, 1, 1)),
        :old_identifier => random_id,
        :active => random_boolean,
        :deleted => random_boolean,
        :the_geom => fake_point
      }

      unless poi_source.id == PoiSource.gisworking.id
        params[:identifier] = random_identifier
      end

      poi = Poi.create(params)
      if poi.valid?
        puts "Poi creado: #{poi.name}"
      else
        puts 'Inválido'
        puts poi.errors.inspect
      end
    end
  end

  def self.time_rand from = 0.0, to = Time.now
    Time.at(from + rand * (to.to_f - from.to_f))
  end

  def self.random_id
    rand(99999999)
  end

  def self.random_identifier
    [*0..AppConfiguration.first.gisworking_initial_identifier].sample
  end

  def self.random_object clazz
    clazz.all.shuffle.first
  end

  def self.fake_priority
    rand(6)
  end

  def self.fake_number
    "#{rand(9999)}"
  end

  def self.fake_phone
    "542-#{[*100000..999999].sample}"
  end

  def self.fake_name 
    RandomWord.nouns.next
  end

  def self.fake_web
    "http://www.#{fake_name.gsub("_", "")}.com"
  end

  def self.fake_mail
    "#{fake_name}@fake.com"
  end

  def self.fake_point
    "POINT(#{[*-180..180].sample} #{[*-90..90].sample})"
  end

  def self.random_boolean
    (rand(10) % 2) == 1
  end
end