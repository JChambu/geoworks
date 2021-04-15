Rails.application.routes.draw do


  get 'project_types/maps' => 'project_types#maps'
  get 'project_types/search_name_layer' => 'project_types#search_name_layer'
  get 'projects/popup' => 'projects#popup'
  get 'project_types/kpi' => 'project_types#kpi'
  get 'project_types/search_data_dashboard' => 'project_types#search_data_dashboard'
  get 'project_types/search_father_children_and_photos_data' => 'project_types#search_father_children_and_photos_data'
  get 'project_types/search_report_data' => 'project_types#search_report_data'
  get 'project_types/filter_heatmap' => 'project_types#filter_heatmap'
  get 'project_types/graph3' => 'project_types#graph2'
  get 'project_types/project_type_layers' => 'project_types#project_type_layers'
  get 'layers/find' => 'layers#find'
  get 'project_fields/field_popup' => 'project_fields#field_popup'
  get 'project_types/create_share' => 'project_types#create_share', as: :create_share
  get 'projects/search_data' => 'projects#search_data'
  get 'projects/search_statuses' => 'projects#search_statuses'
  get 'projects/search_users' => 'projects#search_users'
  post 'project_statuses/options', as: 'project_statuses_options'
  post 'project_statuses/update_priority', as: 'project_statuses_update_priority'

  scope ":locale", locale: /#{I18n.available_locales.join("|")}/  do


    post 'project_fields/create'
    post 'analytics_dashboards/create'
    post 'charts/create'
    get 'project_types/:id/geocoding' => 'project_types#geocoding', as: :project_types_geocoding
    get 'project_types/:id/dashboard' => 'project_types#dashboard',  :as => :project_types_dashboard
    get 'project_types/import_file' => 'project_types#import_file', as: :import_file
    get 'dashboards/show' => 'dashboards#show'

    resources :field_types
    resources :layers
    resources :choice_lists do
      collection { post :import } 
    end
    resources :charts
    resources :analysis_types
    resources :regexp_types
    resources :events
    resources :model_types


    namespace :admin do
      post 'users/search_projects'
      post 'users/search_roles'
      post 'users/search_fields'
      post 'users/search_properties_data'
      get 'users/search_projects'
      get 'users/search_roles'
      get 'users/search_fields'
      resources :users
      resources :roles
      resources :customers
      get 'dashboards/index'
      root 'dashboards#index'
    end

    resources :project_types do
      resources :dashboards do
        get 'create_graph'
        resources :graphics
        resources :graphics_properties
        resources :analytics_dashboards
      end
      resources :project_statuses
      resources :projects do
        resources :project_data_children
      end
      resources :project_fields do
        resource :project_subfields do
          collection do
            get :edit_multiple
            put :update_multiple
          end
        end
        collection do
          get :edit_multiple
          put :update_multiple
        end
      end

    get 'project_types/share' => 'project_types#share', as: :share
    get 'project_types/filters' => 'project_types#filters', as: :filters
    get 'project_types/quick_filters' => 'project_types#quick_filters', as: :quick_filters
    get 'project_types/quick_filters_users' => 'project_types#quick_filters_users', as: :quick_filters_users
    get 'project_types/create_filters' => 'project_types#create_filters', as: :create_filters
    get 'project_types/create_quick_filters' => 'project_types#create_quick_filters', as: :create_quick_filters
    get 'project_types/create_quick_filters_users' => 'project_types#create_quick_filters_users', as: :create_quick_filters_users
    get 'project_types/heatmap' => 'project_types#heatmap', as: :heatmap
    get 'project_types/create_heatmap' => 'project_types#create_heatmap', as: :create_heatmap
    get 'project_types/point_colors' => 'project_types#point_colors', as: :point_colors
    get 'project_types/create_point_colors' => 'project_types#create_point_colors', as: :create_point_colors

  end


    devise_for :users, :controllers => {:passwords => "passwords"}
    resources :users


    root 'dashboards#show'
  end

  match '*path', to: redirect("/#{I18n.default_locale}/%{path}"), via: :all
  match '', to: redirect("/#{I18n.default_locale}"), via: :all
end
