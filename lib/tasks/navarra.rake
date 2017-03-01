# -*- coding: utf-8 -*-
namespace :geoworks do
  desc "Crear usuario por defecto | usr: super@admin.com / pass: superadmin"
  task :create_default_users => :environment do
    require 'tasks/users.rb'
    Users.create_default_users
  end
  desc "Crear usuario | Params: 1 - email:string / 2 - name:string / 3 - password:string / 4 - role_name:string {Admin | User}"
  task :create_user, [:email, :name, :password, :role_name] => :environment do |t, args|
    require 'tasks/users.rb'
    Users.create args
  end
  desc "Crear datos falsos para tablas de lookup"
  task :load_fake_lookup_data => :environment do
    require 'tasks/data_loader.rb'
    DataLoader.load_fake_lookup_data
  end
  desc "Migrar datos con la estructura del viejo Navarra a la nueva versión"
  task :migrate_data, [:host, :dbname] => :environment do |t, args|
    require 'tasks/data_migrator.rb'
    DataMigrator.start args
  end
end