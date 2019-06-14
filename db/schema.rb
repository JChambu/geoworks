# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20190605132741) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "actions", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "analysis_types", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "analytics_dashboards", id: :serial, force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.json "fields"
    t.integer "analysis_type_id"
    t.integer "chart_id"
    t.boolean "graph"
    t.boolean "card"
    t.integer "project_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_field_id"
    t.string "filter_input"
    t.string "input_value"
    t.integer "condition_field_id"
    t.string "const_field"
    t.integer "group_field_id"
    t.integer "association_id"
    t.boolean "assoc_kpi", default: false
    t.integer "dashboard_id"
    t.text "sql_sentence"
    t.integer "order"
    t.string "order_sql"
    t.index ["analysis_type_id"], name: "index_analytics_dashboards_on_analysis_type_id"
    t.index ["chart_id"], name: "index_analytics_dashboards_on_chart_id"
    t.index ["project_type_id"], name: "index_analytics_dashboards_on_project_type_id"
  end



  create_table "categories", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category_original"
    t.boolean "prefix", default: false
  end


  create_table "charts", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_type_id"
    t.jsonb "properties"
  end

  create_table "choice_list_items", force: :cascade do |t|
    t.string "name"
    t.bigint "choice_list_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["choice_list_id"], name: "index_choice_list_items_on_choice_list_id"
  end

  create_table "choice_lists", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "key"
    t.string "value"
    t.string "label"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "color"
  end

  create_table "customers", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "subdomain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "supplier_map", default: "osm"
    t.string "url"
  end

  create_table "dashboards", force: :cascade do |t|
    t.string "name"
    t.bigint "project_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_type_id"], name: "index_dashboards_on_project_type_id"
  end

  create_table "delayed_jobs", id: :serial, force: :cascade do |t|
    t.integer "priority", default: 0, null: false
    t.integer "attempts", default: 0, null: false
    t.text "handler", null: false
    t.text "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string "locked_by"
    t.string "queue"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["priority", "run_at"], name: "delayed_jobs_priority"
  end

  create_table "field_types", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end




  create_table "graphics", force: :cascade do |t|
    t.bigint "dashboard_id"
    t.string "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.integer "width"
    t.integer "height"
    t.string "label_x_axis"
    t.string "label_y_axis_left"
    t.string "label_y_axis_right"
    t.boolean "stack", default: false
    t.decimal "tick_x_min"
    t.decimal "tick_x_max"
    t.decimal "tick_y_min"
    t.decimal "tick_y_max"
    t.decimal "step_x"
    t.decimal "substep_x"
    t.boolean "data_labelling", default: false
    t.integer "chart_id"
    t.decimal "scale", default: "1.0"
    t.index ["dashboard_id"], name: "index_graphics_on_dashboard_id"
  end

  create_table "graphics_properties", force: :cascade do |t|
    t.string "color"
    t.string "height"
    t.string "width"
    t.string "title"
    t.bigint "chart_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "analytics_dashboard_id"
    t.integer "graphic_id"
    t.string "label_datasets"
    t.boolean "left_y_axis"
    t.string "point_type"
    t.index ["chart_id"], name: "index_graphics_properties_on_chart_id"
  end

  create_table "has_project_types", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "project_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_admin?"
    t.index ["project_type_id"], name: "index_has_project_types_on_project_type_id"
    t.index ["user_id"], name: "index_has_project_types_on_user_id"
  end

  create_table "pg_search_documents", id: :serial, force: :cascade do |t|
    t.text "content"
    t.string "searchable_type"
    t.integer "searchable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["searchable_type", "searchable_id"], name: "index_pg_search_documents_on_searchable_type_and_searchable_id"
  end

  create_table "photos", force: :cascade do |t|
    t.string "name"
    t.text "image"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_data_children", force: :cascade do |t|
    t.jsonb "properties"
    t.integer "project_id"
    t.integer "project_field_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_fields", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "field_type"
    t.boolean "required"
    t.boolean "cleasing_data"
    t.boolean "georeferenced"
    t.integer "project_type_id"
    t.integer "regexp_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "key"
    t.string "choice_list_key"
    t.integer "choice_list_id"
    t.integer "field_type_id"
    t.boolean "hidden", default: false
    t.integer "sort"
    t.boolean "read_only", default: false
    t.index ["project_type_id"], name: "index_project_fields_on_project_type_id"
  end

  create_table "project_subfields", force: :cascade do |t|
    t.string "name"
    t.bigint "project_field_id"
    t.bigint "regexp_type_id"
    t.string "key"
    t.bigint "choice_list_id"
    t.bigint "field_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "required"
    t.boolean "hidden", default: false
    t.boolean "read_only", default: false
    t.index ["choice_list_id"], name: "index_project_subfields_on_choice_list_id"
    t.index ["field_type_id"], name: "index_project_subfields_on_field_type_id"
    t.index ["project_field_id"], name: "index_project_subfields_on_project_field_id"
    t.index ["regexp_type_id"], name: "index_project_subfields_on_regexp_type_id"
  end

  create_table "project_types", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "directory_name"
    t.string "name_layer"
    t.index ["user_id"], name: "index_project_types_on_user_id"
  end

  create_table "projects", id: :serial, force: :cascade do |t|
    t.jsonb "properties"
    t.integer "project_type_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "properties_original"
    t.geometry "the_geom", limit: {:srid=>4326, :type=>"geometry"}
    t.index ["project_type_id"], name: "index_projects_on_project_type_id"
  end

  create_table "regexp_types", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "expresion"
    t.text "observations"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_customers", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "customer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_user_customers_on_customer_id"
    t.index ["user_id"], name: "index_user_customers_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "role"
    t.string "name"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.string "token"
    t.string "authentication_token", limit: 30
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["token"], name: "index_users_on_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
  end

  create_table "versions", id: :serial, force: :cascade do |t|
    t.string "item_type", null: false
    t.integer "item_id", null: false
    t.string "event", null: false
    t.string "whodunnit"
    t.text "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id"
  end

  add_foreign_key "analytics_dashboards", "charts"
  add_foreign_key "has_project_types", "users"
  add_foreign_key "project_fields", "project_types"
  add_foreign_key "project_types", "users"
  add_foreign_key "projects", "project_types"
end
