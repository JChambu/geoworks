module LocationsHelper
  def cities_for_select
    City.sorted_by_name.map { |city| [city.complete_name, city.id] }
  end

  def countries_for_select
  	Country.sorted_by_name.map { |country| [country.name, country.id] }
  end

  def provinces_for_select country_id = nil
    country = Country.find_by_id country_id
  	return [] unless country
  	country.provinces.map { |province| [province.name, province.id] }
  end

  def departments_for_select province_id = nil
    province = Province.find_by_id province_id
  	return [] unless province
  	province.departments.map { |department| [department.name, department.id] }
  end

  def department_cities_for_select department_id = nil
    department = Department.find_by_id department_id
    return [] unless department
    return department.cities.map { |city| [city.name, city.id] }
  end

  def city_for_chosen city_id
    return [] unless city_id
  	city = City.find_by_id(city_id)
  	return [] unless city
  	[[city.complete_name, city.id]]
  end
end
