Rails.application.routes.draw do

  resources :field_types
  get 'locations/cities' => 'locations#cities'
  get 'streets/search' => 'streets#search'
  get 'geo_editions/search_blocks' => 'geo_editions#search_blocks'
  get 'pois/possible_duplicates' => 'pois#possible_duplicates'
  get 'geo_editions/errors' => 'geo_editions#errors'
  get 'parkings/possible_duplicates' => 'parkings#possible_duplicates'
  get 'extended_listings/possible_duplicates' => 'extended_listings#possible_duplicates'
  get 'pois/around' => 'pois#around'
  get 'pois/total_poi_validates' => 'pois#total_poi_validates'
  get 'poi_addresses/total_poi_validates' => 'poi_addresses#total_poi_validates'
  get 'poi_types/:id/sub_types' => 'poi_types#sub_types'
  get 'country/:id/provinces' => 'locations#provinces'
  get 'province/:id/departments' => 'locations#departments'
  get 'department/:id/cities' => 'locations#department_cities'
  get 'poi_types/:id/chains' => 'poi_types#chains'
  get 'poi_types/:id/food_types' => 'poi_types#food_types'
  get 'project_types/maps' => 'project_types#maps'
  get 'project_types/kpi' => 'project_types#kpi'
  get 'project_types/filter_heatmap' => 'project_types#filter_heatmap'
#  get 'project_types/heatmap' => 'project_types#heatmap'

  get 'project_types/graph3' => 'project_types#graph2'

  scope ":locale", locale: /#{I18n.available_locales.join("|")}/  do

    get 'project_fields/index'
    post 'project_fields/create'
    post 'analytics_dashboards/create'
    get 'project_fields/:id/show' =>'project_fields#show'
    #get 'project_types/index'
       
    resources :choice_lists
    post 'charts/create'
    resources :charts
    resources :analysis_types
    get 'project_types/:id/geocoding' => 'project_types#geocoding', as: :project_types_geocoding
    get 'project_types/:id/dashboard' => 'project_types#dashboard',  :as => :project_types_dashboard

    get 'project_types/import_file' => 'project_types#import_file', as: :import_file

    get 'panel', to: 'project_types#panel'
    resources :project_types do 
      resources :dashboards do
        get 'create_graph'
        resources :graphics 
        resources :graphics_properties
        resources :analytics_dashboards
      end
      resources :projects
      get 'project_types/filters' => 'project_types#filters', as: :filters
      get 'project_types/create_filters' => 'project_types#create_filters', as: :create_filters
      get 'project_types/heatmap' => 'project_types#heatmap', as: :heatmap

      get 'project_types/create_heatmap' => 'project_types#create_heatmap', as: :create_heatmap
      get 'project_types/point_colors' => 'project_types#point_colors', as: :point_colors
      get 'project_types/create_point_colors' => 'project_types#create_point_colors', as: :create_point_colors

    end
    resources :regexp_types
    #  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
    resources :customers
    resources :streets
    resources :geo_editions
    # get "geo_editions/geoeditions_edit" => 'geo_editions#geoeditions_edit' 

    resources :extended_listings  do
      collection do
        get :duplicated
        get :georeferenced
        get :congrated_points
      end
    end

    resources :parkings do
      collection do
        get :search
      end
    end
    resources :extended_listing_loads
    resources :categories
    resources :customers
    get "reports/pois"
    get 'poi_addresses/georeferenced' 
    resources :restaurant_types
    resources :poi_address_loads
    resources :generate_deliveries
    get "reports/users"
    get "reports/poi_verification"
    get "reports/poi_verification_maps"
    get "reports/update" => 'reports#update', :as=> :update_poi

    get "reports/verificated_multiple" => 'reports#verificated_multiple'
    get "reports/update_revised" => 'reports#update_revised'
    get 'pois/check' => 'pois#check'
    get 'configuration' => 'configuration#index'
    put 'configuration/:id' => 'configuration#update', :as => :update_configuration
    resources :poi_addresses
    resources :pois do
      collection do
        get :download
        get :search
        get :deliver
        get :deliveries_pois
        get :duplicated

        delete :delete_multiple
      end
    end

    resources :load_locations, :except => [:edit, :update] do
      collection do
        get :upload_xls
      end
    end

    resources :poi_loads, :except => [:edit, :update] do
      collection do
        get :download_xls_example
      end
      member do
        get :download_source_file
        get :download_errors_file
      end
    end

    resources :poi_sub_types
    resources :poi_sources
    resources :street_types
    resources :food_types
    resources :poi_types
    resources :chains
    devise_for :users
    resources :users

    # The priority is based upon order of creation: first created -> highest priority.
    # See how all your routes lay out with "rake routes".

    # You can have the root of your site routed with "root"

    #root 'pois#index'
    root 'project_types#index'
    #end

    # Example of regular route:
    #   get 'products/:id' => 'catalog#view'

    # Example of named route that can be invoked with purchase_url(id: product.id)
    #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

    # Example resource route (maps HTTP verbs to controller actions automatically):
    #   resources :products

    # Example resource route with options:
    #   resources :products do
    #     member do
    #       get 'short'
    #       post 'toggle'
    #     end
    #
    #     collection do
    #       get 'sold'
    #     end
    #   end

    # Example resource route with sub-resources:
    #   resources :products do
    #     resources :comments, :sales
    #     resource :seller
    #   end

    # Example resource route with more complex sub-resources:
    #   resources :products do
    #     resources :comments
    #     resources :sales do
    #       get 'recent', on: :collection
    #     end
    #   end

    # Example resource route with concerns:
    #   concern :toggleable do
    #     post 'toggle'
    #   end
    #   resources :posts, concerns: :toggleable
    #   resources :photos, concerns: :toggleable

    # Example resource route within a namespace:
    #   namespace :admin do
    #     # Directs /admin/products/* to Admin::ProductsController
    #     # (app/controllers/admin/products_controller.rb)
    #     resources :products
    #   end
  end
  match '*path', to: redirect("/#{I18n.default_locale}/%{path}"), via: :all
  match '', to: redirect("/#{I18n.default_locale}"), via: :all
end
