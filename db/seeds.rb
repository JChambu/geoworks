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

create_user "super@admin.com", "Admin", "superadmin", "Admin"
