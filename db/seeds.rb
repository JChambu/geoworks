# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#


def create_user email, name, pass, role
	u = User.find_by_email email
	User.delete(u.id) unless u.nil?

	options = {
	  :name => name,
	  :email => email,
	  :password => pass,      
	  :role => role
	}

	user = User.create(options)
end

AppConfiguration.delete_all
AppConfiguration.create(:gisworking_initial_identifier => 500000)
  
create_user "super@admin.com", "Admin", "superadmin", "Admin"

PoiSource.find_or_create_by(name: "Navteq")
PoiSource.find_or_create_by(name: "Gisworking")
PoiSource.find_or_create_by(name: "Extra")

PoiStatus.find_or_create_by(name: "not_validated")
PoiStatus.find_or_create_by(name: "validated")
PoiStatus.find_or_create_by(name: "delivered")
PoiStatus.find_or_create_by(name: "Verificado")
PoiStatus.find_or_create_by(name: "restricted")
PoiStatus.find_or_create_by(name: "Pendiente")
PoiStatus.find_or_create_by(name: "Revisad")

# Creamos los actions

PAction.find_or_create_by(name: "New")
PAction.find_or_create_by(name: "Update")
PAction.find_or_create_by(name: "Keep")
PAction.find_or_create_by(name: "Delete")
PAction.find_or_create_by(name: "No Info")
PAction.find_or_create_by(name: "Restricted")
PAction.find_or_create_by(name: "check")
