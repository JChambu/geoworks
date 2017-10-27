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

ActiveRecord::Schema.define(version: 20171012171528) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"
  enable_extension "hstore"
  enable_extension "uuid-ossp"


  create_table "actions", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "app_configurations", force: :cascade do |t|
    t.integer  "gisworking_initial_identifier"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end


  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.integer  "category_original"
    t.boolean  "prefix",            default: false
  end

  create_table "chains", force: :cascade do |t|
    t.string   "name"
    t.string   "identifier"
    t.integer  "poi_type_id"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.integer  "objetive",    default: 0
    t.integer  "country_id"
    t.string   "alias"
  end

  create_table "cities", force: :cascade do |t|
    t.string   "name"
    t.integer  "department_id"
    t.string   "zip"
    t.integer  "proiority"
    t.point    "the_geom"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end


  create_table "countries", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "customers", force: :cascade do |t|
    t.string   "name"
    t.string   "subdomain"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "supplier_map", default: "osm"
  end

  create_table "data_cleasing_projects", force: :cascade do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "data_cleasings", force: :cascade do |t|
    t.jsonb    "properties"
    t.integer  "data_cleasing_project_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "data_cleasings_fields", force: :cascade do |t|
    t.string   "name"
    t.boolean  "required"
    t.boolean  "cleasing_data"
    t.integer  "data_cleasing_project_id"
    t.integer  "regexp_type_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree
  end

  create_table "departments", force: :cascade do |t|
    t.string   "name"
    t.integer  "province_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "extended_listing_loads", force: :cascade do |t|
    t.string   "name"
    t.string   "status"
    t.integer  "success_count"
    t.integer  "fail_count"
    t.integer  "already_loaded_count"
    t.string   "directory_name"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  create_table "extended_listings", force: :cascade do |t|
    t.string   "name"
    t.string   "street"
    t.integer  "city_id"
    t.integer  "user_id"
    t.integer  "category_id"
    t.datetime "created_at",                                                             null: false
    t.datetime "updated_at",                                                             null: false
    t.string   "phone"
    t.string   "source"
    t.string   "address"
    t.string   "number"
    t.string   "hash_value"
    t.serial   "identifier",                                                             null: false
    t.integer  "poi_status_id",                                              default: 2
    t.integer  "category_original_id"
    t.point "the_geom",        :srid=>4326
    t.integer  "poi_type_id"
    t.integer  "poi_sub_type_id"
    t.string   "website"
    t.string   "email"
    t.integer  "neighborhood_id"
    t.point "the_geom_new",        :srid=>4326
    t.string   "phone_2"
    t.string   "phone_2_new"
    t.string   "street_2"
    t.string   "street_3"
  end

  create_table "food_types", force: :cascade do |t|
    t.string   "name"
    t.integer  "poi_type_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "code"
  end

  create_table "generate_deliveries", force: :cascade do |t|
    t.string   "name"
    t.integer  "country_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "geo_editions", force: :cascade do |t|
    t.string   "name"
    t.string   "street"
    t.string   "number"
    t.string   "address"
    t.string   "company"
    t.integer  "city"
    t.integer  "recid"
    t.string   "number_door_start_original"
    t.string   "number_door_start"
    t.string   "number_door_end_original"
    t.string   "number_door_end"
    t.string   "code"
    t.point "the_geom",         :srid=>4326
    t.datetime "created_at",                                                                             null: false
    t.datetime "updated_at",                                                                             null: false
    t.line "the_geom_segment_original",  :srid=>4326
    t.line "the_geom_segment",           :srid=>4326
    t.integer  "poi_status_id"
    t.integer  "gw_div1"
    t.integer  "gw_div2"
    t.integer  "gw_geomainid"
    t.integer  "gw_qh"
    t.integer  "gw_calleid"
    t.integer  "gw_pta_ini"
    t.integer  "gw_pta_fin"
    t.string   "gw_paridad"
    t.string   "gw_status"
    t.string   "paridad"
    t.integer  "user_id"
    t.string   "gw_street"
    t.string   "gw_code"
    t.text     "observations"
    t.boolean  "delivered",                                                              default: false
    t.boolean  "yard"
    t.boolean  "wasteland"
  #t.index ["the_geom_segment_original"], name: "gw_geom", using: :gist
  end



  create_table "load_locations", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.string   "status"
    t.string   "directory_name"
  end

  create_table "p_actions", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "parkings", force: :cascade do |t|
    t.string   "name"
    t.string   "street"
    t.string   "brand"
    t.string   "operator"
    t.integer  "facility_type_id"
    t.integer  "levels"
    t.integer  "city_id"
    t.point "the_geom",                         :srid=>4326 
    t.point "the_geom_entrance",                :srid=>4326
    t.point "the_geom_exit",                    :srid=>4326
    t.string   "phone"
    t.string   "website"
    t.string   "detailed_pricing_model"
    t.decimal  "price",                                                                        precision: 10, scale: 2
    t.string   "currency"
    t.string   "available_payment_methods"
    t.string   "regular_openning_hours"
    t.string   "exceptions_opening"
    t.polygon "the_geom_area",                  :srid=>4326
    t.datetime "created_at",                                                                                                            null: false
    t.datetime "updated_at",                                                                                                            null: false
    t.integer  "number"
    t.string   "restrinctions"
    t.string   "max_drive_height"
    t.string   "max_drive_width"
    t.boolean  "elevators",                                                                                             default: false
    t.boolean  "escalators",                                                                                            default: false
    t.boolean  "handicapped_accessible",                                                                                default: false
    t.boolean  "handicapped_parking_spaces",                                                                            default: false
    t.boolean  "women_parking_spaces",                                                                                  default: false
    t.boolean  "sanitation_facilities",                                                                                 default: false
    t.boolean  "restroom_available",                                                                                    default: false
    t.boolean  "secure_parking",                                                                                        default: false
    t.boolean  "security_manned",                                                                                       default: false
    t.boolean  "electric_vehicle_charging_points",                                                                      default: false
    t.boolean  "connector_type",                                                                                        default: false
    t.boolean  "number_of_connectors",                                                                                  default: false
    t.boolean  "charge_point_operator",                                                                                 default: false
    t.boolean  "payment_methods",                                                                                       default: false
    t.boolean  "light",                                                                                                 default: false
    t.boolean  "motorcycle_parking_spaces",                                                                             default: false
    t.boolean  "family_friendly",                                                                                       default: false
    t.boolean  "carwash",                                                                                               default: false
    t.boolean  "parking_disc",                                                                                          default: false
    t.boolean  "parking_ticket",                                                                                        default: false
    t.boolean  "gate",                                                                                                  default: false
    t.boolean  "monitored",                                                                                             default: false
    t.boolean  "none",                                                                                                  default: false
    t.string   "total_space"
    t.string   "space_available"
    t.string   "available"
    t.string   "trend"
    t.string   "total_disabled_space"
    t.string   "available_disabled_space"
    t.boolean  "flag",                                                                                                  default: false
    t.string   "the_geom_area_original"
    t.integer  "user_id"
    t.integer  "p_action_id"
    t.integer  "poi_status_id"
    t.line "the_geom_segment",                 :srid=>4326
    t.string   "payment"
    t.string   "parking_configuration"
    t.string   "parking_capacity"
    t.string   "parking_type"
    t.boolean  "machine_readable"
    t.string   "maximum_duration"
    t.boolean  "tow_away_zone"
    t.boolean  "street_sweeping"
    t.boolean  "street_mall_time_market"
    t.boolean  "pedestrian_zone_time"
    t.boolean  "snow_route"
    t.boolean  "clearway"
    t.boolean  "residential"
    t.boolean  "handicapped"
    t.boolean  "diplomatic"
    t.boolean  "media_press"
    t.boolean  "other"
    t.boolean  "loading_unloading_zone"
    t.boolean  "drop_pick_up_zona"
    t.boolean  "disabled_handicap_only"
    t.boolean  "private_parking"
    t.boolean  "commercial_vehicles_only"
    t.string   "side_street"
    t.string   "max_duration_parking_disc"
  end

  create_table "pg_search_documents", force: :cascade do |t|
    t.text     "content"
    t.string   "searchable_type"
    t.integer  "searchable_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["searchable_type", "searchable_id"], name: "index_pg_search_documents_on_searchable_type_and_searchable_id", using: :btree
  end

  create_table "poi_address_loads", force: :cascade do |t|
    t.string   "name"
    t.string   "status"
    t.string   "directory_name"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.string   "success_count"
    t.string   "fail_count"
    t.string   "already_loaded_count"
    t.integer  "city_id"
    t.string   "color"
  end

  create_table "poi_addresses", force: :cascade do |t|
    t.integer  "city_id"
    t.string   "street"
    t.string   "number"
    t.string   "neighborhood"
    t.string   "block"
    t.string   "house"
    t.datetime "created_at",                                             null: false
    t.datetime "updated_at",                                             null: false
    t.integer  "user_id"
    t.string   "source"
    t.string   "color"
    t.string   "address_complete"
    t.string   "rol_number"
    t.string   "city_name"
    t.string   "department_name"
    t.string   "province_name"
    t.string   "country_name"
    t.integer  "p_action_id"
    t.string   "note"
    t.point "the_geom",         :srid=>4326
    t.string   "phone"
    t.string   "web"
    t.string   "name"
    t.integer  "recid"
    t.string   "name_company"
    t.string   "phone_company"
    t.date     "birthdate"
  end

  create_table "poi_loads", force: :cascade do |t|
    t.string   "name"
    t.datetime "load_date"
    t.string   "status"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "success_count"
    t.integer  "fail_count"
    t.integer  "already_loaded_count"
    t.string   "directory_name"
  end

  create_table "poi_sources", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "poi_statuses", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "poi_sub_types", force: :cascade do |t|
    t.string   "name"
    t.integer  "poi_type_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "identifier"
  end

  create_table "poi_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "code"
  end

  create_table "poia", force: :cascade do |t|
    t.string   "name"
    t.string   "short_name"
    t.string   "website"
    t.string   "email"
    t.string   "second_email"
    t.text     "note"
    t.string   "cel_number"
    t.string   "phone"
    t.string   "second_phone"
    t.string   "fax"
    t.string   "house_number"
    t.text     "contact"
    t.integer  "priority"
    t.text     "location"
    t.integer  "city_id"
    t.integer  "chain_id"
    t.integer  "food_type_id"
    t.integer  "poi_source_id"
    t.integer  "poi_type_id"
    t.integer  "poi_sub_type_id"
    t.string   "street_name"
    t.integer  "street_type_id"
    t.integer  "user_id"
    t.integer  "poi_status_id"
    t.boolean  "active",                                                      default: true
    t.boolean  "deleted",                                                     default: false
    t.integer  "duplicated_identifier"
    t.integer  "identifier"
    t.date     "control_date"
    t.point "the_geom",              :srid=>4326
    t.datetime "created_at",                                                                  null: false
    t.datetime "updated_at",                                                                  null: false
    t.integer  "poi_load_id"
    t.integer  "old_identifier"
    t.string   "identifier_hash"
    t.integer  "p_action_id"
    t.boolean  "verification",                                                default: false
    t.string   "internal_observation"
    t.integer  "restaurant_type_id"
    t.date     "last_update"
  end

  create_table "project_fields", force: :cascade do |t|
    t.string   "name"
    t.string   "field_type"
    t.boolean  "required"
    t.boolean  "cleasing_data"
    t.boolean  "georeferenced"
    t.integer  "project_type_id"
    t.integer  "regexp_type_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["project_type_id"], name: "index_project_fields_on_project_type_id", using: :btree
  end

  create_table "project_types", force: :cascade do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_project_types_on_user_id", using: :btree
  end

  create_table "projects", force: :cascade do |t|
    t.jsonb    "properties"
    t.integer  "project_type_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["project_type_id"], name: "index_projects_on_project_type_id", using: :btree
  end

  create_table "provinces", force: :cascade do |t|
    t.string   "name"
    t.integer  "country_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "regexp_types", force: :cascade do |t|
    t.string   "name"
    t.string   "expresion"
    t.text     "observations"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "restaurant_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "street_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "streets", force: :cascade do |t|
    t.integer  "start_number"
    t.integer  "end_number"
    t.integer  "count_intersections"
    t.float    "meters_long_intersection"
    t.line     "the_geom"
    t.string   "name"
    t.integer  "city_id"
    t.integer  "street_type_id"
    t.integer  "code"
    t.string   "city_name"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "terms", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end




  create_table "users", force: :cascade do |t|
    t.string   "role"
    t.string   "name"
    t.string   "email",               default: "", null: false
    t.string   "encrypted_password",  default: "", null: false
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",       default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
  end

  create_table "verification_pois", force: :cascade do |t|
    t.integer  "poi_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",  null: false
    t.integer  "item_id",    null: false
    t.string   "event",      null: false
    t.string   "whodunnit"
    t.text     "object"
    t.datetime "created_at"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree
  end

  add_foreign_key "project_fields", "project_types"
  add_foreign_key "project_types", "users"
  add_foreign_key "projects", "project_types"
end
