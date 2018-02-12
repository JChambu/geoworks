namespace :migration_fulcrum do
desc "Migrar proyectos"
  task :project => :environment do
      ProjectType.migration
  end

end
