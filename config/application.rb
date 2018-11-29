require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require 'apartment/elevators/subdomain' 
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Geoworks
  class Application < Rails::Application
    config.middleware.use Apartment::Elevators::Subdomain
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.time_zone = 'Buenos Aires'
    config.i18n.default_locale = :es
    WillPaginate.per_page = 20
    config.enable_dependency_loading = true
    config.autoload_paths += %W(#{config.root}/lib)
    PaperTrail.serializer = JSON
    #config.active_job.queue_adapter = :delayed_job
    #config.active_record.schema_format = :sql
  end
end
