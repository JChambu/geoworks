module Geoworks
  module Poi
  	module Attributes
	  def complete_name
      complete_name = []
	    complete_name << self.name if self.name
	    complete_name << self.complete_address if self.complete_address
	    complete_name.join(", ")
	  end

	  def complete_address
	    address = []
	    address << self.street_type_name if self.street_type_name 
	    address << self.street_name if self.street_name
	    address << self.house_number if self.house_number
	    address << self.city_complete_name if self.city_complete_name
	    address.join(" ")
	  end

	  def human_active
	    human_boolean self.active
	  end

	  def human_deleted
	    human_boolean self.deleted
	  end

	  def human_boolean boolean_value
	    I18n.t("#{boolean_value}_value")
	  end
  	
  end
end
end
