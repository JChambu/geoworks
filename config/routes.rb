Rails.application.routes.draw do


  get 'customers/search_customer'
  post 'table_configurations/create_table'
  get 'table_configurations/search_table'
  delete 'table_configurations/destroy_table'
  patch 'table_configurations/edit_table'
  get 'project_types/maps' => 'project_types#maps'
  get 'project_types/search_name_layer' => 'project_types#search_name_layer'
  post 'project_types/kpi' => 'project_types#kpi'
  post 'project_types/search_data_dashboard' => 'project_types#search_data_dashboard'
  post 'project_types/save_interpolation' => 'project_types#save_interpolation'
  post 'project_statuses/create_status_interpolation' => 'project_statuses#create_status_interpolation'
  get 'project_types/create_quick_filters_users_subform' => 'project_types#create_quick_filters_users_subform'
  get 'project_types/search_father_children_and_photos_data' => 'project_types#search_father_children_and_photos_data'
  get 'project_types/search_report_data' => 'project_types#search_report_data'
  get 'project_types/export_geojson' => 'project_types#export_geojson'
  get 'project_types/filter_heatmap' => 'project_types#filter_heatmap'
  get 'project_types/graph3' => 'project_types#graph2'
  get 'project_types/project_type_layers' => 'project_types#project_type_layers'
  get 'project_types/get_filtered_form_ids' => 'project_types#get_filtered_form_ids'
  get 'project_types/get_geo_key' => 'project_types#get_geo_key'
  get 'layers/find' => 'layers#find'
  get 'project_fields/field_popup' => 'project_fields#field_popup'
  get 'project_fields/get_project_field_layer' => 'project_fields#get_project_field_layer'
  get 'project_fields/get_field_type' => 'project_fields#get_field_type'
  get 'project_fields/get_filter_operator' => 'project_fields#get_filter_operator'
  get 'project_fields/get_filter_values' => 'project_fields#get_filter_values'
  get 'project_fields/show_fields' => 'project_fields#show_fields'
  get 'project_subfields/show_subfields' => 'project_subfields#show_subfields'
  get 'project_subfields/get_field_type' => 'project_subfields#get_field_type'
  get 'project_types/create_share' => 'project_types#create_share', as: :create_share
  get 'projects/search_data' => 'projects#search_data'
  get 'projects/search_statuses' => 'projects#search_statuses'
  get 'projects/search_users' => 'projects#search_users'
  post 'projects/search_data_for_pdf' => 'projects#search_data_for_pdf', as: :search_data_for_pdf
  get 'projects/popup' => 'projects#popup'
  post 'project_types/get_extent' => 'project_types#get_extent'
  get 'project_types/get_kpi_without_graph_ids' => 'project_types#get_kpi_without_graph_ids'
  post 'projects/create_form' => 'projects#create_form'
  patch 'projects/update_form' => 'projects#update_form'
  patch 'projects/update_geom_and_calculated_fields' => 'projects#update_geom_and_calculated_fields'
  post 'projects/split_geometry' => 'projects#split_geometry'
  patch 'projects/change_owner' => 'projects#change_owner'
  patch 'projects/disable_form' => 'projects#disable_form'
  patch 'projects/destroy_form' => 'projects#destroy_form'
  get 'projects/get_coordinates' => 'projects#get_coordinates'
  get 'projects/get_random_points' => 'projects#get_random_points'
  post 'project_statuses/options', as: 'project_statuses_options'
  post 'project_statuses/update_priority', as: 'project_statuses_update_priority'
  get 'choice_lists/export_csv'=> 'choice_lists#export_csv', as: 'export_csv'
  get 'choice_lists/export_all_csv'=> 'choice_lists#export_all_csv', as: 'export_all_csv'
  post 'graphics/update_sort' => 'graphics#update_sort', as: :update_sort
  get 'photos/show_photos' => 'photos#show_photos'
  get 'photos/get_photos' => 'photos#get_photos'
  get 'photos_children/show_photos_children' => 'photos_children#show_photos_children'
  get 'photos_children/get_photos_children' => 'photos_children#get_photos_children'
  post 'project_data_children/show_children' => 'project_data_children#show_children', as: :show_children
  get 'users/get_user_id_and_customer_id' => 'users#get_user_id_and_customer_id'
  post 'dashboards/send_alerts'
  post 'dashboards/send_report'
  get 'reports/get_reports' => 'reports#get_reports', as: :get_reports
  get 'reports/get_data_report' => 'reports#get_data_report', as: :get_data_report
  post 'reports/save_data_report' => 'reports#save_data_report', as: :save_data_report
  post 'reports/save_form_report' => 'reports#save_form_report', as: :save_form_report

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

      namespace :projects do
        resource :import, only: [:new, :create] do
          # get :new, controller: :import, action: :new
          post :read_file
          get :mapping
          # post :save, controller: :import, action: :save
          # get :save, to: redirect{ |path_params, req| "/#{path_params[:locale]}/project_types/#{path_params[:project_type_id]}/projects/import"}
          get :download_errors
        end
      end
      resources :project_fields do
        resources :project_subfields, only: [:index]
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

      resource :data_children, only: [:new], controller: :project_data_children do
        post :read_file
        get :mapping
        post :import
        get :import, to: redirect{ |path_params, req| "/#{path_params[:locale]}/project_types/#{path_params[:project_type_id]}/data_children/new"}
        get 'import/download_errors', controller: :project_data_children, action: :download_errors
      end

    get 'project_types/share' => 'project_types#share', as: :share
    get 'project_types/filters' => 'project_types#filters', as: :filters
    get 'project_types/quick_filters' => 'project_types#quick_filters', as: :quick_filters
    get 'project_types/quick_filters_users' => 'project_types#quick_filters_users', as: :quick_filters_users
    get 'project_types/create_filters' => 'project_types#create_filters', as: :create_filters
    get 'project_types/create_quick_filters' => 'project_types#create_quick_filters', as: :create_quick_filters
    get 'project_types/create_quick_filters_users' => 'project_types#create_quick_filters_users', as: :create_quick_filters_users
    get 'project_types/heatmap' => 'project_types#heatmap', as: :heatmap
    get 'project_types/interpolation' => 'project_types#interpolation', as: :interpolation
    get 'project_types/color_by_attribute' => 'project_types#color_by_attribute', as: :color_by_attribute
    get 'project_types/create_heatmap' => 'project_types#create_heatmap', as: :create_heatmap
    get 'project_types/create_interpolation' => 'project_types#create_interpolation', as: :create_interpolation
    get 'project_types/create_color_by_attribute' => 'project_types#create_color_by_attribute', as: :create_color_by_attribute
    get 'project_types/point_colors' => 'project_types#point_colors', as: :point_colors
    get 'project_types/create_point_colors' => 'project_types#create_point_colors', as: :create_point_colors
  end


    devise_for :users, controllers: {
      registrations: 'registrations',
      passwords: 'passwords'
    }
    resources :users


    root 'dashboards#show'
  end

  match '*path', to: redirect("/#{I18n.default_locale}/%{path}"), via: :all
  match '', to: redirect("/#{I18n.default_locale}"), via: :all
end
