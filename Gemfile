source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.0'
gem 'pg', '~> 0.18'
gem 'puma', '~> 3.0'
gem 'sass-rails', '~> 5.0.6'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'pg_search'
gem 'inline_svg'
# See https://github.com/rails/execjs#readme for more supported runtimes
gem 'therubyracer', platforms: :ruby
# Use jquery as the JavaScript library
gem 'nested_form_fields'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'fulcrum'
gem 'rgeoserver'
gem 'responders', '~> 2.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'json'
gem 'figaro'
gem "font-awesome-rails", github: "bokmann/font-awesome-rails", branch: "master"
gem 'jbuilder', '~> 2.5'
gem 'webpack-rails'
gem 'foreman'
gem 'devise'
gem 'apartment'
gem 'cancancan'
gem 'pry'
gem 'rgeo', '0.6.0'
gem 'rgeo-activerecord'
gem 'rgeo-shapefile'
gem 'rgeo-geojson'
gem 'activerecord-postgis-adapter'
gem 'will_paginate-bootstrap' 
gem 'simple_form'
gem 'paper_trail'
gem 'validates_email_format_of'
gem 'listen', '~> 3.0.5'
#gem 'twitter-bootstrap-rails'
#gem 'ransack', github:"activerecord-hackery/ransack", branch:"master"
gem 'ransack'
#gem 'twitter-bootstrap-rails'
#gem 'less-rails-bootstrap'
gem 'spreadsheet'
gem 'delayed_job_active_record'
gem 'daemons'
gem 'geocoder'
#gem 'react-rails'
#gem 'webpacker'
#gem 'webpacker-react', "~> 0.3.2"

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platform: :mri
  gem 'capistrano', '~> 3.6'
  gem 'capistrano-rails', '~> 1.2'
  gem 'capistrano-rvm'
  gem 'capistrano-bundler'
  gem 'capistrano3-unicorn'

end
gem 'unicorn'
group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.0.5'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
group :production do
    gem 'passenger'
end

