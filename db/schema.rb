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

ActiveRecord::Schema.define(version: 20171003123035) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"
  enable_extension "hstore"
  enable_extension "uuid-ossp"

  create_table "20170531_gw_manzanas_ush", primary_key: "ogc_fid", force: :cascade do |t|
    t.string   "ciudad nom",   limit: 254
    t.decimal  "div1",                                                  precision: 10
    t.string   "departamen",   limit: 254
    t.decimal  "div2",                                                  precision: 10
    t.string   "localidad",    limit: 254
    t.decimal  "manzana",                                               precision: 10
    t.string   "manzana_1",    limit: 254
    t.decimal  "hogares",                                               precision: 10
    t.decimal  "geoposici?",                                            precision: 24, scale: 15
    t.decimal  "geoposic_1",                                            precision: 24, scale: 15
    t.geometry "wkb_geometry", limit: {:srid=>4326, :type=>"geometry"}
    t.index ["wkb_geometry"], name: "20170531_gw_manzanas_ush_wkb_geometry_geom_idx", using: :gist
  end

  create_table "20170531_gw_tramos_lr", primary_key: "ogc_fid", force: :cascade do |t|
    t.string   "source",       limit: 254
    t.string   "empresa",      limit: 254
    t.float    "geodiv1id"
    t.string   "departamen",   limit: 254
    t.float    "geodiv2id"
    t.string   "localidad",    limit: 254
    t.float    "geomanid"
    t.string   "nombre_man",   limit: 254
    t.decimal  "coordenada",                                            precision: 33, scale: 16
    t.decimal  "coordena_1",                                            precision: 33, scale: 16
    t.float    "calleid"
    t.string   "nombre_cal",   limit: 254
    t.float    "puerta_ini"
    t.float    "puerta_fin"
    t.string   "paridad",      limit: 254
    t.string   "coordena_2",   limit: 254
    t.string   "coordena_3",   limit: 254
    t.string   "coordena_4",   limit: 254
    t.string   "coordena_5",   limit: 254
    t.string   "id_zona",      limit: 254
    t.string   "zona_nombr",   limit: 254
    t.string   "cod_manzan",   limit: 254
    t.float    "orden"
    t.float    "id_gis"
    t.string   "cor_x1_gis",   limit: 254
    t.decimal  "cor_x2_gis",                                            precision: 33, scale: 16
    t.string   "cor_y1_gis",   limit: 254
    t.decimal  "cor_y2_gis",                                            precision: 33, scale: 16
    t.string   "observ",       limit: 254
    t.decimal  "gw_div1",                                               precision: 10
    t.decimal  "gw_div2",                                               precision: 10
    t.decimal  "gw_geoman",                                             precision: 10
    t.decimal  "gw_qh",                                                 precision: 10
    t.decimal  "gw_calleid",                                            precision: 10
    t.decimal  "gw_pta_ini",                                            precision: 10
    t.decimal  "gw_pta_fin",                                            precision: 10
    t.string   "gw_paridad",   limit: 2
    t.decimal  "gw_coorx1",                                             precision: 13, scale: 6
    t.decimal  "gw_coory1",                                             precision: 13, scale: 6
    t.decimal  "gw_coorx2",                                             precision: 13, scale: 6
    t.decimal  "gw_coory2",                                             precision: 13, scale: 6
    t.string   "gw_estado",    limit: 50
    t.geometry "wkb_geometry", limit: {:srid=>0, :type=>"line_string"}
    t.index ["wkb_geometry"], name: "20170531_gw_tramos_lr_wkb_geometry_geom_idx", using: :gist
  end

  create_table "20170531_gw_tramos_ush", primary_key: "ogc_fid", force: :cascade do |t|
    t.string   "source",       limit: 254
    t.string   "empresa",      limit: 254
    t.float    "geodiv1id"
    t.string   "departamen",   limit: 254
    t.float    "geodiv2id"
    t.string   "localidad",    limit: 254
    t.float    "geomanid"
    t.string   "nombre_man",   limit: 254
    t.string   "coordenada",   limit: 254
    t.string   "coordena_1",   limit: 254
    t.float    "calleid"
    t.string   "nombre_cal",   limit: 254
    t.float    "puerta_ini"
    t.float    "puerta_fin"
    t.string   "paridad",      limit: 254
    t.string   "coordena_2",   limit: 254
    t.string   "coordena_3",   limit: 254
    t.string   "coordena_4",   limit: 254
    t.string   "coordena_5",   limit: 254
    t.string   "id_zona",      limit: 254
    t.string   "zona_nombr",   limit: 254
    t.string   "cod_manzan",   limit: 254
    t.float    "orden"
    t.float    "id_gis"
    t.decimal  "coor_x1_gi",                                               precision: 33, scale: 16
    t.decimal  "coor_x2_gi",                                               precision: 33, scale: 16
    t.decimal  "coor_y1_gi",                                               precision: 33, scale: 16
    t.decimal  "coor_y2_gi",                                               precision: 33, scale: 16
    t.string   "observ",       limit: 254
    t.decimal  "gw_div1",                                                  precision: 10
    t.decimal  "gw_div2",                                                  precision: 10
    t.decimal  "gw_geoman",                                                precision: 10
    t.decimal  "gw_qh",                                                    precision: 10
    t.decimal  "gw_calleid",                                               precision: 10
    t.decimal  "gw_pta_ini",                                               precision: 10
    t.decimal  "gw_pta_fin",                                               precision: 10
    t.string   "gw_paridad",   limit: 2
    t.decimal  "gw_coorx1",                                                precision: 13, scale: 6
    t.decimal  "gw_coory1",                                                precision: 13, scale: 6
    t.decimal  "gw_coorx2",                                                precision: 13, scale: 6
    t.decimal  "gw_coory2",                                                precision: 13, scale: 6
    t.string   "gw_estado",    limit: 50
    t.decimal  "20170531_p",                                               precision: 10
    t.geometry "wkb_geometry", limit: {:srid=>4326, :type=>"line_string"}
    t.index ["wkb_geometry"], name: "20170531_gw_tramos_ush_wkb_geometry_geom_idx", using: :gist
  end

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

  create_table "blocks", primary_key: "gid", id: :integer, default: -> { "nextval('\"20170427_manzanas_lh_gid_seq\"'::regclass)" }, force: :cascade do |t|
    t.string   "ciudad nom", limit: 254
    t.decimal  "div1",                                             precision: 10
    t.string   "departamen", limit: 254
    t.decimal  "div2",                                             precision: 10
    t.string   "localidad",  limit: 254
    t.decimal  "manzana",                                          precision: 10
    t.string   "manzana_1",  limit: 254
    t.decimal  "hogares",                                          precision: 10
    t.decimal  "geoposici?"
    t.decimal  "geoposic_1"
    t.geometry "geom",       limit: {:srid=>4326, :type=>"point"}
    t.index ["geom"], name: "20170427_manzanas_lh_geom_idx", using: :gist
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

  create_table "cobertura", primary_key: "gid", force: :cascade do |t|
    t.string   "name",       limit: 254
    t.string   "descriptio", limit: 254
    t.string   "timestamp",  limit: 24
    t.string   "begin",      limit: 24
    t.string   "end",        limit: 24
    t.string   "altitudemo", limit: 254
    t.decimal  "tessellate",                                                                           precision: 10
    t.decimal  "extrude",                                                                              precision: 10
    t.decimal  "visibility",                                                                           precision: 10
    t.decimal  "draworder",                                                                            precision: 10
    t.string   "icon",       limit: 254
    t.geometry "geom",       limit: {:srid=>4326, :type=>"multi_polygon", :has_z=>true, :has_m=>true}
    t.index ["geom"], name: "cobertura_geom_idx", using: :gist
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
    t.geometry "the_geom",             limit: {:srid=>4326, :type=>"point"}
    t.integer  "poi_type_id"
    t.integer  "poi_sub_type_id"
    t.string   "website"
    t.string   "email"
    t.integer  "neighborhood_id"
    t.geometry "the_geom_new",         limit: {:srid=>4326, :type=>"point"}
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
    t.geometry "the_geom",                   limit: {:srid=>4326, :type=>"point"}
    t.datetime "created_at",                                                                             null: false
    t.datetime "updated_at",                                                                             null: false
    t.geometry "the_geom_segment_original",  limit: {:srid=>4326, :type=>"line_string"}
    t.geometry "the_geom_segment",           limit: {:srid=>4326, :type=>"line_string"}
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
    t.index ["the_geom_segment_original"], name: "gw_geom", using: :gist
  end

  create_table "geomanid", primary_key: "gid", force: :cascade do |t|
    t.string   "geomanids",  limit: 254
    t.string   "ciudad nom", limit: 254
    t.decimal  "div1",                                             precision: 10
    t.string   "departamen", limit: 254
    t.decimal  "div2",                                             precision: 10
    t.string   "localidad",  limit: 254
    t.decimal  "manzana",                                          precision: 10
    t.string   "manzana_1",  limit: 254
    t.decimal  "hogares",                                          precision: 10
    t.decimal  "geoposici?"
    t.decimal  "geoposic_1"
    t.decimal  "q_clientes",                                       precision: 10
    t.decimal  "share"
    t.geometry "geom",       limit: {:srid=>4326, :type=>"point"}
    t.index ["geom"], name: "geomanid_geom_idx", using: :gist
  end

  create_table "gw_geoman_bar", primary_key: "ogc_fid", id: :integer, default: -> { "nextval('\"20170602_gw_geoman_bar_ogc_fid_seq\"'::regclass)" }, force: :cascade do |t|
    t.string   "ciudad nom",   limit: 254
    t.decimal  "div1",                                               precision: 10
    t.string   "departamen",   limit: 254
    t.decimal  "div2",                                               precision: 10
    t.string   "localidad",    limit: 254
    t.decimal  "manzana",                                            precision: 10
    t.string   "manzana_1",    limit: 254
    t.decimal  "hogares",                                            precision: 10
    t.decimal  "geoposici?",                                         precision: 24, scale: 15
    t.decimal  "geoposic_1",                                         precision: 24, scale: 15
    t.geometry "wkb_geometry", limit: {:srid=>4326, :type=>"point"}
    t.index ["wkb_geometry"], name: "20170602_gw_geoman_bar_wkb_geometry_geom_idx", using: :gist
  end

  create_table "gw_tramos_bar", primary_key: "ogc_fid", id: :integer, default: -> { "nextval('\"20170602_gw_tramos_bar_ogc_fid_seq\"'::regclass)" }, force: :cascade do |t|
    t.string   "source",       limit: 254
    t.string   "empresa",      limit: 254
    t.float    "geodiv1id"
    t.string   "departamen",   limit: 254
    t.float    "geodiv2id"
    t.string   "localidad",    limit: 254
    t.float    "geomanid"
    t.string   "nombre_man",   limit: 254
    t.decimal  "coordenada",                                               precision: 33, scale: 16
    t.decimal  "coordena_1",                                               precision: 33, scale: 16
    t.float    "calleid"
    t.string   "nombre_cal",   limit: 254
    t.float    "puerta_ini"
    t.float    "puerta_fin"
    t.string   "paridad",      limit: 254
    t.string   "coordena_2",   limit: 254
    t.string   "coordena_3",   limit: 254
    t.string   "coordena_4",   limit: 254
    t.string   "coordena_5",   limit: 254
    t.string   "id_zona",      limit: 254
    t.string   "zona_nombr",   limit: 254
    t.string   "cod_manzan",   limit: 254
    t.float    "orden"
    t.float    "id_gis"
    t.decimal  "coorx1_gis",                                               precision: 33, scale: 16
    t.decimal  "coorx2_gis",                                               precision: 33, scale: 16
    t.decimal  "coory1_gis",                                               precision: 33, scale: 16
    t.decimal  "coor_y2",                                                  precision: 33, scale: 16
    t.string   "obeserv",      limit: 254
    t.decimal  "gw_div1",                                                  precision: 10
    t.decimal  "gw_div2",                                                  precision: 10
    t.decimal  "gw_geoman",                                                precision: 10
    t.decimal  "gw_qh",                                                    precision: 10
    t.decimal  "gw_calleid",                                               precision: 10
    t.decimal  "gw_pta_ini",                                               precision: 10
    t.decimal  "gw_pta_fin",                                               precision: 10
    t.string   "gw_paridad",   limit: 2
    t.decimal  "gw_coorx1",                                                precision: 13, scale: 6
    t.decimal  "gw_coory1",                                                precision: 13, scale: 6
    t.decimal  "gw_coorx2",                                                precision: 13, scale: 6
    t.decimal  "gw_coory2",                                                precision: 13, scale: 6
    t.string   "gw_estado",    limit: 50
    t.decimal  "20170602_d",                                               precision: 10
    t.geometry "wkb_geometry", limit: {:srid=>4326, :type=>"line_string"}
    t.index ["wkb_geometry"], name: "20170602_gw_tramos_bar_wkb_geometry_geom_idx", using: :gist
  end

  create_table "la_rioja_geoman", primary_key: "ogc_fid", force: :cascade do |t|
    t.string   "ciudad nom",   limit: 254
    t.decimal  "div1",                                               precision: 10
    t.string   "departamen",   limit: 254
    t.decimal  "div2",                                               precision: 10
    t.string   "localidad",    limit: 254
    t.decimal  "manzana",                                            precision: 10
    t.string   "manzana_1",    limit: 254
    t.decimal  "hogares",                                            precision: 10
    t.decimal  "geoposici",                                          precision: 24, scale: 15
    t.decimal  "geoposic_1",                                         precision: 24, scale: 15
    t.geometry "wkb_geometry", limit: {:srid=>4326, :type=>"point"}
    t.index ["wkb_geometry"], name: "la_rioja_geoman_wkb_geometry_geom_idx", using: :gist
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
    t.geometry "the_geom",                         limit: {:srid=>4326, :type=>"point"}
    t.geometry "the_geom_entrance",                limit: {:srid=>4326, :type=>"point"}
    t.geometry "the_geom_exit",                    limit: {:srid=>4326, :type=>"point"}
    t.string   "phone"
    t.string   "website"
    t.string   "detailed_pricing_model"
    t.decimal  "price",                                                                        precision: 10, scale: 2
    t.string   "currency"
    t.string   "available_payment_methods"
    t.string   "regular_openning_hours"
    t.string   "exceptions_opening"
    t.geometry "the_geom_area",                    limit: {:srid=>4326, :type=>"polygon"}
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
    t.geometry "the_geom_segment",                 limit: {:srid=>4326, :type=>"line_string"}
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
    t.geometry "the_geom",         limit: {:srid=>4326, :type=>"point"}
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

  create_table "pois", force: :cascade do |t|
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
    t.geometry "the_geom",              limit: {:srid=>4326, :type=>"point"}
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

  create_table "tmp_streets", id: :integer, default: -> { "nextval('tmp_segment_id_seq'::regclass)" }, force: :cascade do |t|
    t.geometry "the_geom",             limit: {:srid=>4326, :type=>"geometry"}
    t.integer  "start_number"
    t.integer  "end_number"
    t.integer  "number_intersections"
    t.index ["the_geom"], name: "tmp_streets_the_geom", using: :gist
  end

  create_table "tramo", primary_key: "gid", force: :cascade do |t|
    t.string   "source",     limit: 255
    t.string   "empresa",    limit: 255
    t.decimal  "geodiv1id"
    t.string   "departamen", limit: 255
    t.decimal  "geodiv2id"
    t.string   "localidad",  limit: 255
    t.decimal  "geomanid"
    t.string   "nombre_man", limit: 255
    t.decimal  "coordenada"
    t.decimal  "coordena_1"
    t.decimal  "calleid"
    t.string   "nombre_cal", limit: 255
    t.decimal  "puerta_ini"
    t.decimal  "puerta_fin"
    t.string   "paridad",    limit: 255
    t.string   "coordena_2", limit: 255
    t.string   "coordena_3", limit: 255
    t.string   "coordena_4", limit: 255
    t.string   "coordena_5", limit: 255
    t.string   "id_zona",    limit: 255
    t.string   "zona_nombr", limit: 255
    t.string   "cod_manzan", limit: 255
    t.decimal  "new_coorx1"
    t.decimal  "new_coory1"
    t.decimal  "new_coorx2"
    t.decimal  "new_coory2"
    t.decimal  "pta_medio"
    t.string   "obs",        limit: 255
    t.decimal  "id_tramo"
    t.decimal  "orden"
    t.geometry "geom",       limit: {:srid=>4326, :type=>"multi_line_string"}
    t.index ["geom"], name: "tramo_geom_idx", using: :gist
  end

  create_table "tramov1", primary_key: "gid", id: :integer, default: -> { "nextval('\"20170426_tramos_lh_v1_gid_seq\"'::regclass)" }, force: :cascade do |t|
    t.string   "source",     limit: 254
    t.string   "empresa",    limit: 254
    t.decimal  "geodiv1id"
    t.string   "departamen", limit: 254
    t.decimal  "geodiv2id"
    t.string   "localidad",  limit: 254
    t.decimal  "geomanid"
    t.string   "nombre_man", limit: 254
    t.decimal  "coordenada"
    t.decimal  "coordena_1"
    t.decimal  "calleid"
    t.string   "nombre_cal", limit: 254
    t.decimal  "puerta_ini"
    t.decimal  "puerta_fin"
    t.string   "paridad",    limit: 254
    t.string   "coordena_2", limit: 254
    t.string   "coordena_3", limit: 254
    t.string   "coordena_4", limit: 254
    t.string   "coordena_5", limit: 254
    t.string   "id_zona",    limit: 254
    t.string   "zona_nombr", limit: 254
    t.string   "cod_manzan", limit: 254
    t.decimal  "new_coorx1"
    t.decimal  "new_coory1"
    t.decimal  "new_coorx2"
    t.decimal  "new_coory2"
    t.decimal  "pta_medio"
    t.string   "obs",        limit: 254
    t.decimal  "id_tramo"
    t.decimal  "dif_pta",                                                precision: 10
    t.string   "desfasaje",  limit: 50
    t.string   "trm_s_coor", limit: 50
    t.decimal  "gw_div1",                                                precision: 10
    t.decimal  "gw_div2",                                                precision: 10
    t.decimal  "gw_geoman",                                              precision: 10
    t.decimal  "gw_qh",                                                  precision: 10
    t.decimal  "gw_calleid",                                             precision: 10
    t.decimal  "gw_pta_ini",                                             precision: 10
    t.decimal  "gw_pta_fin",                                             precision: 10
    t.string   "gw_paridad", limit: 2
    t.float    "gw_coorx1"
    t.float    "gw_coory1"
    t.float    "gw_coorx2"
    t.float    "gw_coory2"
    t.string   "gw_estado",  limit: 50
    t.geometry "geom",       limit: {:srid=>4326, :type=>"line_string"}
    t.index ["geom"], name: "20170426_tramos_lh_v1_geom_idx", using: :gist
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

end
