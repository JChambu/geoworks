####### Important information ####################
#This file is used to setup a shared extensions #
#within a dedicated schema. This gives us the   #
#advantage of only needing to enable extensions #
#in one place.                                  #
#                                               #
#This task should be run AFTER db:create but    #
#BEFORE db:migrate.                             #
################################################


namespace :db do
  desc 'Also create shared_extensions Schema'
  task :extensions => :environment  do
    # Create Schema
    ActiveRecord::Base.connection.execute 'CREATE SCHEMA IF NOT EXISTS shared_extensions;'
    # Enable Postgis
    ActiveRecord::Base.connection.execute 'CREATE EXTENSION IF NOT EXISTS postgis SCHEMA shared_extensions;'
    # Grant usage to public
    ActiveRecord::Base.connection.execute 'GRANT usage ON SCHEMA shared_extensions to public;'
    # Update search_path
    ActiveRecord::Base.connection.execute "ALTER DATABASE #{ENV.fetch("POSTGRES_DATABASE")} SET search_path = public, shared_extensions;"
  end
end

Rake::Task["db:create"].enhance do
  Rake::Task["db:extensions"].invoke
end

Rake::Task["db:test:purge"].enhance do
  Rake::Task["db:extensions"].invoke
end
