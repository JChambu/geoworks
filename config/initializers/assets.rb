# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'
%w(eot svg ttf woff woff2).each do |ext|
    Rails.application.config.assets.precompile << "fontawesome-webfont.#{ext}"
end
#Rails.application.config.assets.paths << Rails.root.join('vendor', 'assets')
# Add additional assets to the asset load path||
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
