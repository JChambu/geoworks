# -*- coding: utf-8 -*-
class Users
  
  def self.create_default_users
    create_user "super@admin.com", "Admin", "superadmin", "Admin"
  end

  def self.create args
    return unless valid_args? args
    create_user args[:email], args[:name], args[:password], args[:role_name]
  end

  private

  def self.create_user email, name, pass, role
    u = User.find_by_email email
    User.delete(u.id) unless u.nil?

    options = {
      :name => name,
      :email => email,
      :password => pass,      
      :role => role
    }

    user = User.create(options)

    if user.valid?
      puts 'Usuario creado correctamente!'
      return
    end    
    puts 'Errores al crear usuario...'
    puts user.errors.messages.inspect
  end

  def self.valid_args? args
    if args[:email].nil?
      puts 'El primer parámetro debe ser un string con el email del usuario'
      return false
    end
    
    if args[:name].nil?
      puts 'El segundo parámetro debe ser un string con el nombre del usuario'
      return false
    end

    if args[:password].nil?
      puts 'El tercer parámetro debe ser un string con el password del usuario'
      return false
    end

    if args[:role_name].nil?
      puts 'El cuarto parámetro debe ser un string con el nombre del rol {#{User::ROLES.join("|")}}'
      return false
    end
    
    if !User::ROLES.include? args[:role_name]
      puts "No se encontró role con el nombre: #{args[:role_name]}"      
      return false
    end

    true
  end
end