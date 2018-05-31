SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgis;


SET search_path = public, pg_catalog;

--
-- Name: create_jsonb_flat_view(text, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION create_jsonb_flat_view(table_name text, regular_columns text, json_column text) RETURNS text
    LANGUAGE plpgsql
    AS $_$
declare
    cols text;
begin
    execute format ($ex$
        select string_agg(format('%2$s->>%%1$L "%%1$s"', key), ', ')
        from (
            select distinct key
            from %1$s, jsonb_each(%2$s)
            order by 1
            ) s;
        $ex$, table_name, json_column)
    into cols;
    execute format($ex$
        drop view if exists %1$s_view;
        create view %1$s_view as 
        select %2$s, %3$s from %1$s
        $ex$, table_name, regular_columns, cols);
    return cols;
end $_$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE actions (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: actions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE actions_id_seq OWNED BY actions.id;


--
-- Name: analysis_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE analysis_types (
    id integer NOT NULL,
    name character varying,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: analysis_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE analysis_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analysis_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE analysis_types_id_seq OWNED BY analysis_types.id;


--
-- Name: analytics_dashboards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE analytics_dashboards (
    id integer NOT NULL,
    title character varying,
    description character varying,
    analysis_type_id integer,
    chart_id integer,
    graph boolean,
    card boolean,
    project_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    project_field_id integer,
    filter_input character varying,
    input_value character varying,
    condition_field_id integer,
    group_field_id integer
);


--
-- Name: analytics_dashboards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE analytics_dashboards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics_dashboards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE analytics_dashboards_id_seq OWNED BY analytics_dashboards.id;


--
-- Name: app_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE app_configurations (
    id integer NOT NULL,
    gisworking_initial_identifier integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: app_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE app_configurations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: app_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE app_configurations_id_seq OWNED BY app_configurations.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE blocks (
    id integer NOT NULL,
    manzana integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE blocks_id_seq OWNED BY blocks.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE categories (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    category_original integer,
    prefix boolean DEFAULT false
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- Name: chains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE chains (
    id integer NOT NULL,
    name character varying,
    identifier character varying,
    poi_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    objetive integer DEFAULT 0,
    country_id integer,
    alias character varying
);


--
-- Name: chains_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE chains_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE chains_id_seq OWNED BY chains.id;


--
-- Name: charts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE charts (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    project_type_id integer,
    properties jsonb
);


--
-- Name: charts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE charts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: charts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE charts_id_seq OWNED BY charts.id;


--
-- Name: choice_lists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE choice_lists (
    id integer NOT NULL,
    name character varying,
    key character varying,
    value character varying,
    label character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    color character varying
);


--
-- Name: choice_lists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE choice_lists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: choice_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE choice_lists_id_seq OWNED BY choice_lists.id;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE cities (
    id integer NOT NULL,
    name character varying,
    department_id integer,
    zip character varying,
    proiority integer,
    the_geom point,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE cities_id_seq OWNED BY cities.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE countries (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE countries_id_seq OWNED BY countries.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE customers (
    id integer NOT NULL,
    name character varying,
    subdomain character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    supplier_map character varying DEFAULT 'osm'::character varying
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE customers_id_seq OWNED BY customers.id;


--
-- Name: delayed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE delayed_jobs (
    id integer NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    handler text NOT NULL,
    last_error text,
    run_at timestamp without time zone,
    locked_at timestamp without time zone,
    failed_at timestamp without time zone,
    locked_by character varying,
    queue character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: delayed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE delayed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE delayed_jobs_id_seq OWNED BY delayed_jobs.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE departments (
    id integer NOT NULL,
    name character varying,
    province_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE departments_id_seq OWNED BY departments.id;


--
-- Name: extended_listing_loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE extended_listing_loads (
    id integer NOT NULL,
    name character varying,
    status character varying,
    success_count integer,
    fail_count integer,
    already_loaded_count integer,
    directory_name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: extended_listing_loads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE extended_listing_loads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extended_listing_loads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE extended_listing_loads_id_seq OWNED BY extended_listing_loads.id;


--
-- Name: extended_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE extended_listings (
    id integer NOT NULL,
    name character varying,
    street character varying,
    city_id integer,
    user_id integer,
    category_id integer,
    the_geom point,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    phone character varying,
    source character varying,
    address character varying,
    number character varying,
    hash_value character varying,
    identifier integer NOT NULL,
    poi_status_id integer DEFAULT 2,
    category_original_id integer,
    poi_type_id integer,
    poi_sub_type_id integer,
    website character varying,
    email character varying,
    neighborhood_id integer,
    phone_2 character varying,
    phone_2_new character varying,
    street_2 character varying,
    street_3 character varying
);


--
-- Name: extended_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE extended_listings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extended_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE extended_listings_id_seq OWNED BY extended_listings.id;


--
-- Name: extended_listings_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE extended_listings_identifier_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extended_listings_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE extended_listings_identifier_seq OWNED BY extended_listings.identifier;


--
-- Name: food_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE food_types (
    id integer NOT NULL,
    name character varying,
    poi_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    code character varying
);


--
-- Name: food_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE food_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: food_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE food_types_id_seq OWNED BY food_types.id;


--
-- Name: generate_deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE generate_deliveries (
    id integer NOT NULL,
    name character varying,
    country_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: generate_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE generate_deliveries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: generate_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE generate_deliveries_id_seq OWNED BY generate_deliveries.id;


--
-- Name: geo_editions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE geo_editions (
    id integer NOT NULL,
    name character varying,
    street character varying,
    number character varying,
    address character varying,
    company character varying,
    city integer,
    recid integer,
    number_door_start_original character varying,
    number_door_start character varying,
    number_door_end_original character varying,
    number_door_end character varying,
    code character varying,
    the_geom point,
    the_geom_segment line,
    the_geom_segment_original line,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    poi_status_id integer,
    gw_div1 integer,
    gw_div2 integer,
    gw_geomainid integer,
    gw_qh integer,
    gw_calleid integer,
    gw_pta_ini integer,
    gw_pta_fin integer,
    gw_paridad character varying,
    gw_status character varying,
    paridad character varying,
    user_id integer,
    gw_street character varying,
    gw_code character varying,
    observations text,
    delivered boolean DEFAULT false,
    yard boolean,
    wasteland boolean
);


--
-- Name: geo_editions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE geo_editions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: geo_editions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE geo_editions_id_seq OWNED BY geo_editions.id;


--
-- Name: load_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE load_locations (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    status character varying,
    directory_name character varying
);


--
-- Name: load_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE load_locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: load_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE load_locations_id_seq OWNED BY load_locations.id;


--
-- Name: p_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE p_actions (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: p_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE p_actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: p_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE p_actions_id_seq OWNED BY p_actions.id;


--
-- Name: parkings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE parkings (
    id integer NOT NULL,
    name character varying,
    street character varying,
    brand character varying,
    operator character varying,
    facility_type_id integer,
    levels integer,
    city_id integer,
    the_geom geometry(Point,4326),
    the_geom_entrance geometry(Point,4326),
    the_geom_exit geometry(Point,4326),
    phone character varying,
    website character varying,
    detailed_pricing_model character varying,
    price numeric(10,2),
    currency character varying,
    available_payment_methods character varying,
    regular_openning_hours character varying,
    exceptions_opening character varying,
    the_geom_area geometry(Polygon,4326),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    number integer,
    restrinctions character varying,
    max_drive_height character varying,
    max_drive_width character varying,
    elevators boolean DEFAULT false,
    escalators boolean DEFAULT false,
    handicapped_accessible boolean DEFAULT false,
    handicapped_parking_spaces boolean DEFAULT false,
    women_parking_spaces boolean DEFAULT false,
    sanitation_facilities boolean DEFAULT false,
    restroom_available boolean DEFAULT false,
    secure_parking boolean DEFAULT false,
    security_manned boolean DEFAULT false,
    electric_vehicle_charging_points boolean DEFAULT false,
    connector_type boolean DEFAULT false,
    number_of_connectors boolean DEFAULT false,
    charge_point_operator boolean DEFAULT false,
    payment_methods boolean DEFAULT false,
    light boolean DEFAULT false,
    motorcycle_parking_spaces boolean DEFAULT false,
    family_friendly boolean DEFAULT false,
    carwash boolean DEFAULT false,
    parking_disc boolean DEFAULT false,
    parking_ticket boolean DEFAULT false,
    gate boolean DEFAULT false,
    monitored boolean DEFAULT false,
    "none" boolean DEFAULT false,
    total_space character varying,
    space_available character varying,
    available character varying,
    trend character varying,
    total_disabled_space character varying,
    available_disabled_space character varying,
    flag boolean DEFAULT false,
    the_geom_area_original character varying,
    user_id integer,
    p_action_id integer,
    poi_status_id integer,
    payment character varying,
    parking_configuration character varying,
    parking_capacity character varying,
    parking_type character varying,
    machine_readable boolean,
    maximum_duration character varying,
    tow_away_zone boolean,
    street_sweeping boolean,
    street_mall_time_market boolean,
    pedestrian_zone_time boolean,
    snow_route boolean,
    clearway boolean,
    residential boolean,
    handicapped boolean,
    diplomatic boolean,
    media_press boolean,
    other boolean,
    loading_unloading_zone boolean,
    drop_pick_up_zona boolean,
    disabled_handicap_only boolean,
    private_parking boolean,
    commercial_vehicles_only boolean,
    side_street character varying,
    max_duration_parking_disc character varying
);


--
-- Name: parkings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE parkings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: parkings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE parkings_id_seq OWNED BY parkings.id;


--
-- Name: pg_search_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE pg_search_documents (
    id integer NOT NULL,
    content text,
    searchable_type character varying,
    searchable_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: pg_search_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE pg_search_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pg_search_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE pg_search_documents_id_seq OWNED BY pg_search_documents.id;


--
-- Name: poi_address_loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE poi_address_loads (
    id integer NOT NULL,
    name character varying,
    status character varying,
    directory_name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    success_count character varying,
    fail_count character varying,
    already_loaded_count character varying,
    city_id integer,
    color character varying
);


--
-- Name: poi_address_loads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poi_address_loads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_address_loads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE poi_address_loads_id_seq OWNED BY poi_address_loads.id;


--
-- Name: poi_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE poi_addresses (
    id integer NOT NULL,
    city_id integer,
    street character varying,
    number character varying,
    neighborhood character varying,
    block character varying,
    house character varying,
    the_geom point,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_id integer,
    source character varying,
    color character varying,
    address_complete character varying,
    rol_number character varying,
    city_name character varying,
    department_name character varying,
    province_name character varying,
    country_name character varying,
    p_action_id integer,
    note character varying,
    phone character varying,
    web character varying,
    name character varying,
    recid integer,
    name_company character varying,
    phone_company character varying,
    birthdate date
);


--
-- Name: poi_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poi_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE poi_addresses_id_seq OWNED BY poi_addresses.id;


--
-- Name: poi_loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE poi_loads (
    id integer NOT NULL,
    name character varying,
    load_date timestamp without time zone,
    status character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    success_count integer,
    fail_count integer,
    already_loaded_count integer,
    directory_name character varying
);


--
-- Name: poi_loads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poi_loads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_loads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE poi_loads_id_seq OWNED BY poi_loads.id;


--
-- Name: poi_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE poi_sources (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: poi_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poi_sources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE poi_sources_id_seq OWNED BY poi_sources.id;


--
-- Name: poi_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE poi_statuses (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: poi_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poi_statuses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE poi_statuses_id_seq OWNED BY poi_statuses.id;


--
-- Name: poi_sub_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE poi_sub_types (
    id integer NOT NULL,
    name character varying,
    poi_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    identifier integer
);


--
-- Name: poi_sub_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poi_sub_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_sub_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE poi_sub_types_id_seq OWNED BY poi_sub_types.id;


--
-- Name: poi_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE poi_types (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    code character varying
);


--
-- Name: poi_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE poi_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE poi_types_id_seq OWNED BY poi_types.id;


--
-- Name: pois; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE pois (
    id integer NOT NULL,
    name character varying,
    short_name character varying,
    website character varying,
    email character varying,
    second_email character varying,
    note text,
    cel_number character varying,
    phone character varying,
    second_phone character varying,
    fax character varying,
    house_number character varying,
    contact text,
    priority integer,
    location text,
    city_id integer,
    chain_id integer,
    food_type_id integer,
    poi_source_id integer,
    poi_type_id integer,
    poi_sub_type_id integer,
    street_name character varying,
    street_type_id integer,
    user_id integer,
    poi_status_id integer,
    active boolean DEFAULT true,
    deleted boolean DEFAULT false,
    duplicated_identifier integer,
    identifier integer,
    control_date date,
    the_geom geometry(Point,4326),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    poi_load_id integer,
    old_identifier integer,
    identifier_hash character varying,
    p_action_id integer,
    verification boolean DEFAULT false,
    internal_observation character varying,
    restaurant_type_id integer,
    last_update date
);


--
-- Name: pois_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE pois_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pois_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE pois_id_seq OWNED BY pois.id;


--
-- Name: project_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE project_fields (
    id integer NOT NULL,
    name character varying,
    field_type character varying,
    required boolean,
    cleasing_data boolean,
    georeferenced boolean,
    project_type_id integer,
    regexp_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    key character varying,
    choice_list_id character varying
);


--
-- Name: project_fields_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE project_fields_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE project_fields_id_seq OWNED BY project_fields.id;


--
-- Name: project_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE project_types (
    id integer NOT NULL,
    name character varying,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    directory_name character varying
);


--
-- Name: project_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE project_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE project_types_id_seq OWNED BY project_types.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE projects (
    id integer NOT NULL,
    properties jsonb,
    project_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    the_geom geometry(Geometry,4326),
    properties_original jsonb
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE projects_id_seq OWNED BY projects.id;


--
-- Name: projects_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW projects_view AS
 SELECT projects.id,
    (projects.properties ->> '0245'::text) AS "0245",
    (projects.properties ->> '0263'::text) AS "0263",
    (projects.properties ->> '02b2'::text) AS "02b2",
    (projects.properties ->> '03db'::text) AS "03db",
    (projects.properties ->> '045d'::text) AS "045d",
    (projects.properties ->> '0570'::text) AS "0570",
    (projects.properties ->> '05d5'::text) AS "05d5",
    (projects.properties ->> '07f0'::text) AS "07f0",
    (projects.properties ->> '0ee0'::text) AS "0ee0",
    (projects.properties ->> '0f1e'::text) AS "0f1e",
    (projects.properties ->> '0f93'::text) AS "0f93",
    (projects.properties ->> '1173'::text) AS "1173",
    (projects.properties ->> '119c'::text) AS "119c",
    (projects.properties ->> '1413'::text) AS "1413",
    (projects.properties ->> '14b7'::text) AS "14b7",
    (projects.properties ->> '1569'::text) AS "1569",
    (projects.properties ->> '1587'::text) AS "1587",
    (projects.properties ->> '159b'::text) AS "159b",
    (projects.properties ->> '15f5'::text) AS "15f5",
    (projects.properties ->> '1623'::text) AS "1623",
    (projects.properties ->> '1645'::text) AS "1645",
    (projects.properties ->> '1713'::text) AS "1713",
    (projects.properties ->> '1732'::text) AS "1732",
    (projects.properties ->> '1802'::text) AS "1802",
    (projects.properties ->> '186d'::text) AS "186d",
    (projects.properties ->> '18e4'::text) AS "18e4",
    (projects.properties ->> '1915'::text) AS "1915",
    (projects.properties ->> '1bbb'::text) AS "1bbb",
    (projects.properties ->> '1fc3'::text) AS "1fc3",
    (projects.properties ->> '230b'::text) AS "230b",
    (projects.properties ->> '2330'::text) AS "2330",
    (projects.properties ->> '2356'::text) AS "2356",
    (projects.properties ->> '241a'::text) AS "241a",
    (projects.properties ->> '26d8'::text) AS "26d8",
    (projects.properties ->> '27d3'::text) AS "27d3",
    (projects.properties ->> '2807'::text) AS "2807",
    (projects.properties ->> '284a'::text) AS "284a",
    (projects.properties ->> '2873'::text) AS "2873",
    (projects.properties ->> '28f9'::text) AS "28f9",
    (projects.properties ->> '2924'::text) AS "2924",
    (projects.properties ->> '292e'::text) AS "292e",
    (projects.properties ->> '2c78'::text) AS "2c78",
    (projects.properties ->> '2d55'::text) AS "2d55",
    (projects.properties ->> '2df0'::text) AS "2df0",
    (projects.properties ->> '2e65'::text) AS "2e65",
    (projects.properties ->> '2ef5'::text) AS "2ef5",
    (projects.properties ->> '2f03'::text) AS "2f03",
    (projects.properties ->> '2f52'::text) AS "2f52",
    (projects.properties ->> '300a'::text) AS "300a",
    (projects.properties ->> '30f2'::text) AS "30f2",
    (projects.properties ->> '3158'::text) AS "3158",
    (projects.properties ->> '3191'::text) AS "3191",
    (projects.properties ->> '3232'::text) AS "3232",
    (projects.properties ->> '33d4'::text) AS "33d4",
    (projects.properties ->> '3436'::text) AS "3436",
    (projects.properties ->> '346f'::text) AS "346f",
    (projects.properties ->> '349f'::text) AS "349f",
    (projects.properties ->> '3514'::text) AS "3514",
    (projects.properties ->> '359c'::text) AS "359c",
    (projects.properties ->> '3771'::text) AS "3771",
    (projects.properties ->> '3796'::text) AS "3796",
    (projects.properties ->> '38e4'::text) AS "38e4",
    (projects.properties ->> '3a8d'::text) AS "3a8d",
    (projects.properties ->> '3af5'::text) AS "3af5",
    (projects.properties ->> '3c5b'::text) AS "3c5b",
    (projects.properties ->> '3d4b'::text) AS "3d4b",
    (projects.properties ->> '3e55'::text) AS "3e55",
    (projects.properties ->> '3e5e'::text) AS "3e5e",
    (projects.properties ->> '3e94'::text) AS "3e94",
    (projects.properties ->> '3f43'::text) AS "3f43",
    (projects.properties ->> '3f72'::text) AS "3f72",
    (projects.properties ->> '407a'::text) AS "407a",
    (projects.properties ->> '412c'::text) AS "412c",
    (projects.properties ->> '4133'::text) AS "4133",
    (projects.properties ->> '4206'::text) AS "4206",
    (projects.properties ->> '4430'::text) AS "4430",
    (projects.properties ->> '44cc'::text) AS "44cc",
    (projects.properties ->> '45b0'::text) AS "45b0",
    (projects.properties ->> '4687'::text) AS "4687",
    (projects.properties ->> '46bb'::text) AS "46bb",
    (projects.properties ->> '46e1'::text) AS "46e1",
    (projects.properties ->> '4703'::text) AS "4703",
    (projects.properties ->> '4742'::text) AS "4742",
    (projects.properties ->> '4797'::text) AS "4797",
    (projects.properties ->> '484d'::text) AS "484d",
    (projects.properties ->> '4858'::text) AS "4858",
    (projects.properties ->> '4a42'::text) AS "4a42",
    (projects.properties ->> '4a60'::text) AS "4a60",
    (projects.properties ->> '4bf3'::text) AS "4bf3",
    (projects.properties ->> '4c01'::text) AS "4c01",
    (projects.properties ->> '4c25'::text) AS "4c25",
    (projects.properties ->> '4cdb'::text) AS "4cdb",
    (projects.properties ->> '4fa2'::text) AS "4fa2",
    (projects.properties ->> '5032'::text) AS "5032",
    (projects.properties ->> '5074'::text) AS "5074",
    (projects.properties ->> '5151'::text) AS "5151",
    (projects.properties ->> '5184'::text) AS "5184",
    (projects.properties ->> '530b'::text) AS "530b",
    (projects.properties ->> '54f6'::text) AS "54f6",
    (projects.properties ->> '5516'::text) AS "5516",
    (projects.properties ->> '553e'::text) AS "553e",
    (projects.properties ->> '5557'::text) AS "5557",
    (projects.properties ->> '55a0'::text) AS "55a0",
    (projects.properties ->> '55e3'::text) AS "55e3",
    (projects.properties ->> '5680'::text) AS "5680",
    (projects.properties ->> '57d4'::text) AS "57d4",
    (projects.properties ->> '583b'::text) AS "583b",
    (projects.properties ->> '585d'::text) AS "585d",
    (projects.properties ->> '58ae'::text) AS "58ae",
    (projects.properties ->> '5a7f'::text) AS "5a7f",
    (projects.properties ->> '5ac5'::text) AS "5ac5",
    (projects.properties ->> '5b19'::text) AS "5b19",
    (projects.properties ->> '5bf1'::text) AS "5bf1",
    (projects.properties ->> '5c7e'::text) AS "5c7e",
    (projects.properties ->> '5d56'::text) AS "5d56",
    (projects.properties ->> '5fe4'::text) AS "5fe4",
    (projects.properties ->> '5fe6'::text) AS "5fe6",
    (projects.properties ->> '60b0'::text) AS "60b0",
    (projects.properties ->> '6407'::text) AS "6407",
    (projects.properties ->> '6474'::text) AS "6474",
    (projects.properties ->> '6508'::text) AS "6508",
    (projects.properties ->> '6648'::text) AS "6648",
    (projects.properties ->> '6652'::text) AS "6652",
    (projects.properties ->> '6767'::text) AS "6767",
    (projects.properties ->> '6928'::text) AS "6928",
    (projects.properties ->> '6959'::text) AS "6959",
    (projects.properties ->> '6a32'::text) AS "6a32",
    (projects.properties ->> '6a75'::text) AS "6a75",
    (projects.properties ->> '6d79'::text) AS "6d79",
    (projects.properties ->> '6e96'::text) AS "6e96",
    (projects.properties ->> '6f8b'::text) AS "6f8b",
    (projects.properties ->> '6ff4'::text) AS "6ff4",
    (projects.properties ->> '701e'::text) AS "701e",
    (projects.properties ->> '717a'::text) AS "717a",
    (projects.properties ->> '721c'::text) AS "721c",
    (projects.properties ->> '7250'::text) AS "7250",
    (projects.properties ->> '7300'::text) AS "7300",
    (projects.properties ->> '73e8'::text) AS "73e8",
    (projects.properties ->> '7429'::text) AS "7429",
    (projects.properties ->> '742e'::text) AS "742e",
    (projects.properties ->> '742f'::text) AS "742f",
    (projects.properties ->> '762c'::text) AS "762c",
    (projects.properties ->> '7670'::text) AS "7670",
    (projects.properties ->> '7751'::text) AS "7751",
    (projects.properties ->> '78de'::text) AS "78de",
    (projects.properties ->> '7926'::text) AS "7926",
    (projects.properties ->> '7998'::text) AS "7998",
    (projects.properties ->> '79e4'::text) AS "79e4",
    (projects.properties ->> '7a5f'::text) AS "7a5f",
    (projects.properties ->> '7a62'::text) AS "7a62",
    (projects.properties ->> '7a97'::text) AS "7a97",
    (projects.properties ->> '7b45'::text) AS "7b45",
    (projects.properties ->> '7b87'::text) AS "7b87",
    (projects.properties ->> '7bc5'::text) AS "7bc5",
    (projects.properties ->> '7d55'::text) AS "7d55",
    (projects.properties ->> '7f52'::text) AS "7f52",
    (projects.properties ->> '7f69'::text) AS "7f69",
    (projects.properties ->> '80c2'::text) AS "80c2",
    (projects.properties ->> '80f4'::text) AS "80f4",
    (projects.properties ->> '810f'::text) AS "810f",
    (projects.properties ->> '815a'::text) AS "815a",
    (projects.properties ->> '8370'::text) AS "8370",
    (projects.properties ->> '8374'::text) AS "8374",
    (projects.properties ->> '83c4'::text) AS "83c4",
    (projects.properties ->> '85e6'::text) AS "85e6",
    (projects.properties ->> '860e'::text) AS "860e",
    (projects.properties ->> '8614'::text) AS "8614",
    (projects.properties ->> '8892'::text) AS "8892",
    (projects.properties ->> '892f'::text) AS "892f",
    (projects.properties ->> '897d'::text) AS "897d",
    (projects.properties ->> '89d2'::text) AS "89d2",
    (projects.properties ->> '89ea'::text) AS "89ea",
    (projects.properties ->> '8a0a'::text) AS "8a0a",
    (projects.properties ->> '8bb9'::text) AS "8bb9",
    (projects.properties ->> '8cff'::text) AS "8cff",
    (projects.properties ->> '8d2e'::text) AS "8d2e",
    (projects.properties ->> '8d49'::text) AS "8d49",
    (projects.properties ->> '8deb'::text) AS "8deb",
    (projects.properties ->> '9020'::text) AS "9020",
    (projects.properties ->> '9022'::text) AS "9022",
    (projects.properties ->> '9042'::text) AS "9042",
    (projects.properties ->> '90f6'::text) AS "90f6",
    (projects.properties ->> '9264'::text) AS "9264",
    (projects.properties ->> '938a'::text) AS "938a",
    (projects.properties ->> '93a7'::text) AS "93a7",
    (projects.properties ->> '93f0'::text) AS "93f0",
    (projects.properties ->> '93f7'::text) AS "93f7",
    (projects.properties ->> '9542'::text) AS "9542",
    (projects.properties ->> '95c3'::text) AS "95c3",
    (projects.properties ->> '96cd'::text) AS "96cd",
    (projects.properties ->> '9757'::text) AS "9757",
    (projects.properties ->> '979a'::text) AS "979a",
    (projects.properties ->> '97a0'::text) AS "97a0",
    (projects.properties ->> '9820'::text) AS "9820",
    (projects.properties ->> '9a07'::text) AS "9a07",
    (projects.properties ->> '9b2a'::text) AS "9b2a",
    (projects.properties ->> '9c3d'::text) AS "9c3d",
    (projects.properties ->> '9e08'::text) AS "9e08",
    (projects.properties ->> '9e2f'::text) AS "9e2f",
    (projects.properties ->> '9e81'::text) AS "9e81",
    (projects.properties ->> '9fab'::text) AS "9fab",
    (projects.properties ->> '9fe9'::text) AS "9fe9",
    (projects.properties ->> 'a09a'::text) AS a09a,
    (projects.properties ->> 'a11e'::text) AS a11e,
    (projects.properties ->> 'a175'::text) AS a175,
    (projects.properties ->> 'a2b5'::text) AS a2b5,
    (projects.properties ->> 'a401'::text) AS a401,
    (projects.properties ->> 'a44c'::text) AS a44c,
    (projects.properties ->> 'a453'::text) AS a453,
    (projects.properties ->> 'a760'::text) AS a760,
    (projects.properties ->> 'a7d6'::text) AS a7d6,
    (projects.properties ->> 'a870'::text) AS a870,
    (projects.properties ->> 'aa8e'::text) AS aa8e,
    (projects.properties ->> 'aaae'::text) AS aaae,
    (projects.properties ->> 'ad0f'::text) AS ad0f,
    (projects.properties ->> 'ae59'::text) AS ae59,
    (projects.properties ->> 'af47'::text) AS af47,
    (projects.properties ->> 'b079'::text) AS b079,
    (projects.properties ->> 'b232'::text) AS b232,
    (projects.properties ->> 'b2e9'::text) AS b2e9,
    (projects.properties ->> 'b361'::text) AS b361,
    (projects.properties ->> 'b7f6'::text) AS b7f6,
    (projects.properties ->> 'b885'::text) AS b885,
    (projects.properties ->> 'b8c2'::text) AS b8c2,
    (projects.properties ->> 'ba2d'::text) AS ba2d,
    (projects.properties ->> 'ba69'::text) AS ba69,
    (projects.properties ->> 'bb53'::text) AS bb53,
    (projects.properties ->> 'bb60'::text) AS bb60,
    (projects.properties ->> 'bc62'::text) AS bc62,
    (projects.properties ->> 'bcb7'::text) AS bcb7,
    (projects.properties ->> 'bcba'::text) AS bcba,
    (projects.properties ->> 'beff'::text) AS beff,
    (projects.properties ->> 'bf4a'::text) AS bf4a,
    (projects.properties ->> 'bf6a'::text) AS bf6a,
    (projects.properties ->> 'bfe9'::text) AS bfe9,
    (projects.properties ->> 'c021'::text) AS c021,
    (projects.properties ->> 'c022'::text) AS c022,
    (projects.properties ->> 'c0c0'::text) AS c0c0,
    (projects.properties ->> 'c1f0'::text) AS c1f0,
    (projects.properties ->> 'c205'::text) AS c205,
    (projects.properties ->> 'c221'::text) AS c221,
    (projects.properties ->> 'c3e2'::text) AS c3e2,
    (projects.properties ->> 'c46d'::text) AS c46d,
    (projects.properties ->> 'c472'::text) AS c472,
    (projects.properties ->> 'c4b0'::text) AS c4b0,
    (projects.properties ->> 'c4ce'::text) AS c4ce,
    (projects.properties ->> 'c5f5'::text) AS c5f5,
    (projects.properties ->> 'c730'::text) AS c730,
    (projects.properties ->> 'c770'::text) AS c770,
    (projects.properties ->> 'c839'::text) AS c839,
    (projects.properties ->> 'cc1f'::text) AS cc1f,
    (projects.properties ->> 'cc7e'::text) AS cc7e,
    (projects.properties ->> 'cc80'::text) AS cc80,
    (projects.properties ->> 'cd12'::text) AS cd12,
    (projects.properties ->> 'cf2b'::text) AS cf2b,
    (projects.properties ->> 'cfda'::text) AS cfda,
    (projects.properties ->> 'Ciudad'::text) AS "Ciudad",
    (projects.properties ->> 'Cliente'::text) AS "Cliente",
    (projects.properties ->> 'created_at'::text) AS created_at,
    (projects.properties ->> 'd027'::text) AS d027,
    (projects.properties ->> 'd028'::text) AS d028,
    (projects.properties ->> 'd130'::text) AS d130,
    (projects.properties ->> 'd207'::text) AS d207,
    (projects.properties ->> 'd225'::text) AS d225,
    (projects.properties ->> 'd3c0'::text) AS d3c0,
    (projects.properties ->> 'd3f3'::text) AS d3f3,
    (projects.properties ->> 'd511'::text) AS d511,
    (projects.properties ->> 'd70c'::text) AS d70c,
    (projects.properties ->> 'd70d'::text) AS d70d,
    (projects.properties ->> 'd9b4'::text) AS d9b4,
    (projects.properties ->> 'd9cc'::text) AS d9cc,
    (projects.properties ->> 'd9d4'::text) AS d9d4,
    (projects.properties ->> 'dadb'::text) AS dadb,
    (projects.properties ->> 'dafd'::text) AS dafd,
    (projects.properties ->> 'db36'::text) AS db36,
    (projects.properties ->> 'dc2a'::text) AS dc2a,
    (projects.properties ->> 'dc85'::text) AS dc85,
    (projects.properties ->> 'dd35'::text) AS dd35,
    (projects.properties ->> 'df66'::text) AS df66,
    (projects.properties ->> 'df8d'::text) AS df8d,
    (projects.properties ->> 'Dirección'::text) AS "Dirección",
    (projects.properties ->> 'e19d'::text) AS e19d,
    (projects.properties ->> 'e394'::text) AS e394,
    (projects.properties ->> 'e4e9'::text) AS e4e9,
    (projects.properties ->> 'e693'::text) AS e693,
    (projects.properties ->> 'ea04'::text) AS ea04,
    (projects.properties ->> 'ebe4'::text) AS ebe4,
    (projects.properties ->> 'ece2'::text) AS ece2,
    (projects.properties ->> 'ecee'::text) AS ecee,
    (projects.properties ->> 'ee0d'::text) AS ee0d,
    (projects.properties ->> 'EECC'::text) AS "EECC",
    (projects.properties ->> 'f0df'::text) AS f0df,
    (projects.properties ->> 'f130'::text) AS f130,
    (projects.properties ->> 'f199'::text) AS f199,
    (projects.properties ->> 'f24e'::text) AS f24e,
    (projects.properties ->> 'f2b1'::text) AS f2b1,
    (projects.properties ->> 'f2e1'::text) AS f2e1,
    (projects.properties ->> 'f3ac'::text) AS f3ac,
    (projects.properties ->> 'f422'::text) AS f422,
    (projects.properties ->> 'f4d1'::text) AS f4d1,
    (projects.properties ->> 'f61d'::text) AS f61d,
    (projects.properties ->> 'f63c'::text) AS f63c,
    (projects.properties ->> 'f6c8'::text) AS f6c8,
    (projects.properties ->> 'f6f2'::text) AS f6f2,
    (projects.properties ->> 'f8b4'::text) AS f8b4,
    (projects.properties ->> 'f9b4'::text) AS f9b4,
    (projects.properties ->> 'fa4e'::text) AS fa4e,
    (projects.properties ->> 'fad9'::text) AS fad9,
    (projects.properties ->> 'fbb4'::text) AS fbb4,
    (projects.properties ->> 'fc7f'::text) AS fc7f,
    (projects.properties ->> 'fc83'::text) AS fc83,
    (projects.properties ->> 'fcc4'::text) AS fcc4,
    (projects.properties ->> 'latitude'::text) AS latitude,
    (projects.properties ->> 'longitude'::text) AS longitude,
    (projects.properties ->> 'NOMBRE'::text) AS "NOMBRE",
    (projects.properties ->> 'Provincia'::text) AS "Provincia",
    (projects.properties ->> 'Razón Social'::text) AS "Razón Social",
    (projects.properties ->> 'status'::text) AS status,
    (projects.properties ->> 'TELCONTACTO'::text) AS "TELCONTACTO"
   FROM projects;


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE provinces (
    id integer NOT NULL,
    name character varying,
    country_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE provinces_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE provinces_id_seq OWNED BY provinces.id;


--
-- Name: regexp_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE regexp_types (
    id integer NOT NULL,
    name character varying,
    expresion character varying,
    observations text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: regexp_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE regexp_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: regexp_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE regexp_types_id_seq OWNED BY regexp_types.id;


--
-- Name: restaurant_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE restaurant_types (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: restaurant_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE restaurant_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restaurant_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE restaurant_types_id_seq OWNED BY restaurant_types.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


--
-- Name: street_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE street_types (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: street_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE street_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: street_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE street_types_id_seq OWNED BY street_types.id;


--
-- Name: streets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE streets (
    id integer NOT NULL,
    start_number integer,
    end_number integer,
    count_intersections integer,
    meters_long_intersection double precision,
    the_geom line,
    name character varying,
    city_id integer,
    street_type_id integer,
    code integer,
    city_name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: streets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE streets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: streets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE streets_id_seq OWNED BY streets.id;


--
-- Name: terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE terms (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: terms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE terms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: terms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE terms_id_seq OWNED BY terms.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id integer NOT NULL,
    role character varying,
    name character varying,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    failed_attempts integer DEFAULT 0 NOT NULL,
    unlock_token character varying,
    locked_at timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: verification_pois; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE verification_pois (
    id integer NOT NULL,
    poi_id integer,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: verification_pois_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE verification_pois_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: verification_pois_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE verification_pois_id_seq OWNED BY verification_pois.id;


--
-- Name: versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE versions (
    id integer NOT NULL,
    item_type character varying NOT NULL,
    item_id integer NOT NULL,
    event character varying NOT NULL,
    whodunnit character varying,
    object text,
    created_at timestamp without time zone
);


--
-- Name: versions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE versions_id_seq OWNED BY versions.id;


--
-- Name: actions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY actions ALTER COLUMN id SET DEFAULT nextval('actions_id_seq'::regclass);


--
-- Name: analysis_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY analysis_types ALTER COLUMN id SET DEFAULT nextval('analysis_types_id_seq'::regclass);


--
-- Name: analytics_dashboards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY analytics_dashboards ALTER COLUMN id SET DEFAULT nextval('analytics_dashboards_id_seq'::regclass);


--
-- Name: app_configurations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY app_configurations ALTER COLUMN id SET DEFAULT nextval('app_configurations_id_seq'::regclass);


--
-- Name: blocks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY blocks ALTER COLUMN id SET DEFAULT nextval('blocks_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- Name: chains id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY chains ALTER COLUMN id SET DEFAULT nextval('chains_id_seq'::regclass);


--
-- Name: charts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY charts ALTER COLUMN id SET DEFAULT nextval('charts_id_seq'::regclass);


--
-- Name: choice_lists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY choice_lists ALTER COLUMN id SET DEFAULT nextval('choice_lists_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY cities ALTER COLUMN id SET DEFAULT nextval('cities_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY countries ALTER COLUMN id SET DEFAULT nextval('countries_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY customers ALTER COLUMN id SET DEFAULT nextval('customers_id_seq'::regclass);


--
-- Name: delayed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY delayed_jobs ALTER COLUMN id SET DEFAULT nextval('delayed_jobs_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY departments ALTER COLUMN id SET DEFAULT nextval('departments_id_seq'::regclass);


--
-- Name: extended_listing_loads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY extended_listing_loads ALTER COLUMN id SET DEFAULT nextval('extended_listing_loads_id_seq'::regclass);


--
-- Name: extended_listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY extended_listings ALTER COLUMN id SET DEFAULT nextval('extended_listings_id_seq'::regclass);


--
-- Name: extended_listings identifier; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY extended_listings ALTER COLUMN identifier SET DEFAULT nextval('extended_listings_identifier_seq'::regclass);


--
-- Name: food_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY food_types ALTER COLUMN id SET DEFAULT nextval('food_types_id_seq'::regclass);


--
-- Name: generate_deliveries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY generate_deliveries ALTER COLUMN id SET DEFAULT nextval('generate_deliveries_id_seq'::regclass);


--
-- Name: geo_editions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY geo_editions ALTER COLUMN id SET DEFAULT nextval('geo_editions_id_seq'::regclass);


--
-- Name: load_locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY load_locations ALTER COLUMN id SET DEFAULT nextval('load_locations_id_seq'::regclass);


--
-- Name: p_actions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY p_actions ALTER COLUMN id SET DEFAULT nextval('p_actions_id_seq'::regclass);


--
-- Name: parkings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY parkings ALTER COLUMN id SET DEFAULT nextval('parkings_id_seq'::regclass);


--
-- Name: pg_search_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY pg_search_documents ALTER COLUMN id SET DEFAULT nextval('pg_search_documents_id_seq'::regclass);


--
-- Name: poi_address_loads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_address_loads ALTER COLUMN id SET DEFAULT nextval('poi_address_loads_id_seq'::regclass);


--
-- Name: poi_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_addresses ALTER COLUMN id SET DEFAULT nextval('poi_addresses_id_seq'::regclass);


--
-- Name: poi_loads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_loads ALTER COLUMN id SET DEFAULT nextval('poi_loads_id_seq'::regclass);


--
-- Name: poi_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_sources ALTER COLUMN id SET DEFAULT nextval('poi_sources_id_seq'::regclass);


--
-- Name: poi_statuses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_statuses ALTER COLUMN id SET DEFAULT nextval('poi_statuses_id_seq'::regclass);


--
-- Name: poi_sub_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_sub_types ALTER COLUMN id SET DEFAULT nextval('poi_sub_types_id_seq'::regclass);


--
-- Name: poi_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_types ALTER COLUMN id SET DEFAULT nextval('poi_types_id_seq'::regclass);


--
-- Name: pois id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY pois ALTER COLUMN id SET DEFAULT nextval('pois_id_seq'::regclass);


--
-- Name: project_fields id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY project_fields ALTER COLUMN id SET DEFAULT nextval('project_fields_id_seq'::regclass);


--
-- Name: project_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY project_types ALTER COLUMN id SET DEFAULT nextval('project_types_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);


--
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY provinces ALTER COLUMN id SET DEFAULT nextval('provinces_id_seq'::regclass);


--
-- Name: regexp_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY regexp_types ALTER COLUMN id SET DEFAULT nextval('regexp_types_id_seq'::regclass);


--
-- Name: restaurant_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY restaurant_types ALTER COLUMN id SET DEFAULT nextval('restaurant_types_id_seq'::regclass);


--
-- Name: street_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY street_types ALTER COLUMN id SET DEFAULT nextval('street_types_id_seq'::regclass);


--
-- Name: streets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY streets ALTER COLUMN id SET DEFAULT nextval('streets_id_seq'::regclass);


--
-- Name: terms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY terms ALTER COLUMN id SET DEFAULT nextval('terms_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: verification_pois id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY verification_pois ALTER COLUMN id SET DEFAULT nextval('verification_pois_id_seq'::regclass);


--
-- Name: versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY versions ALTER COLUMN id SET DEFAULT nextval('versions_id_seq'::regclass);


--
-- Name: actions actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: analysis_types analysis_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY analysis_types
    ADD CONSTRAINT analysis_types_pkey PRIMARY KEY (id);


--
-- Name: analytics_dashboards analytics_dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY analytics_dashboards
    ADD CONSTRAINT analytics_dashboards_pkey PRIMARY KEY (id);


--
-- Name: app_configurations app_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY app_configurations
    ADD CONSTRAINT app_configurations_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chains chains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY chains
    ADD CONSTRAINT chains_pkey PRIMARY KEY (id);


--
-- Name: charts charts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY charts
    ADD CONSTRAINT charts_pkey PRIMARY KEY (id);


--
-- Name: choice_lists choice_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY choice_lists
    ADD CONSTRAINT choice_lists_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: delayed_jobs delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY delayed_jobs
    ADD CONSTRAINT delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: extended_listing_loads extended_listing_loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY extended_listing_loads
    ADD CONSTRAINT extended_listing_loads_pkey PRIMARY KEY (id);


--
-- Name: extended_listings extended_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY extended_listings
    ADD CONSTRAINT extended_listings_pkey PRIMARY KEY (id);


--
-- Name: food_types food_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY food_types
    ADD CONSTRAINT food_types_pkey PRIMARY KEY (id);


--
-- Name: generate_deliveries generate_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY generate_deliveries
    ADD CONSTRAINT generate_deliveries_pkey PRIMARY KEY (id);


--
-- Name: geo_editions geo_editions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY geo_editions
    ADD CONSTRAINT geo_editions_pkey PRIMARY KEY (id);


--
-- Name: load_locations load_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY load_locations
    ADD CONSTRAINT load_locations_pkey PRIMARY KEY (id);


--
-- Name: p_actions p_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY p_actions
    ADD CONSTRAINT p_actions_pkey PRIMARY KEY (id);


--
-- Name: parkings parkings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY parkings
    ADD CONSTRAINT parkings_pkey PRIMARY KEY (id);


--
-- Name: pg_search_documents pg_search_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY pg_search_documents
    ADD CONSTRAINT pg_search_documents_pkey PRIMARY KEY (id);


--
-- Name: poi_address_loads poi_address_loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_address_loads
    ADD CONSTRAINT poi_address_loads_pkey PRIMARY KEY (id);


--
-- Name: poi_addresses poi_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_addresses
    ADD CONSTRAINT poi_addresses_pkey PRIMARY KEY (id);


--
-- Name: poi_loads poi_loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_loads
    ADD CONSTRAINT poi_loads_pkey PRIMARY KEY (id);


--
-- Name: poi_sources poi_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_sources
    ADD CONSTRAINT poi_sources_pkey PRIMARY KEY (id);


--
-- Name: poi_statuses poi_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_statuses
    ADD CONSTRAINT poi_statuses_pkey PRIMARY KEY (id);


--
-- Name: poi_sub_types poi_sub_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_sub_types
    ADD CONSTRAINT poi_sub_types_pkey PRIMARY KEY (id);


--
-- Name: poi_types poi_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY poi_types
    ADD CONSTRAINT poi_types_pkey PRIMARY KEY (id);


--
-- Name: pois pois_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY pois
    ADD CONSTRAINT pois_pkey PRIMARY KEY (id);


--
-- Name: project_fields project_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY project_fields
    ADD CONSTRAINT project_fields_pkey PRIMARY KEY (id);


--
-- Name: project_types project_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY project_types
    ADD CONSTRAINT project_types_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- Name: regexp_types regexp_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY regexp_types
    ADD CONSTRAINT regexp_types_pkey PRIMARY KEY (id);


--
-- Name: restaurant_types restaurant_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY restaurant_types
    ADD CONSTRAINT restaurant_types_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: street_types street_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY street_types
    ADD CONSTRAINT street_types_pkey PRIMARY KEY (id);


--
-- Name: streets streets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY streets
    ADD CONSTRAINT streets_pkey PRIMARY KEY (id);


--
-- Name: terms terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY terms
    ADD CONSTRAINT terms_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_pois verification_pois_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY verification_pois
    ADD CONSTRAINT verification_pois_pkey PRIMARY KEY (id);


--
-- Name: versions versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY versions
    ADD CONSTRAINT versions_pkey PRIMARY KEY (id);


--
-- Name: delayed_jobs_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX delayed_jobs_priority ON delayed_jobs USING btree (priority, run_at);


--
-- Name: index_analytics_dashboards_on_analysis_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_dashboards_on_analysis_type_id ON analytics_dashboards USING btree (analysis_type_id);


--
-- Name: index_analytics_dashboards_on_chart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_dashboards_on_chart_id ON analytics_dashboards USING btree (chart_id);


--
-- Name: index_analytics_dashboards_on_project_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_dashboards_on_project_type_id ON analytics_dashboards USING btree (project_type_id);


--
-- Name: index_pg_search_documents_on_searchable_type_and_searchable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pg_search_documents_on_searchable_type_and_searchable_id ON pg_search_documents USING btree (searchable_type, searchable_id);


--
-- Name: index_project_fields_on_project_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_fields_on_project_type_id ON project_fields USING btree (project_type_id);


--
-- Name: index_project_types_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_types_on_user_id ON project_types USING btree (user_id);


--
-- Name: index_projects_on_project_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_on_project_type_id ON projects USING btree (project_type_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_on_unlock_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_unlock_token ON users USING btree (unlock_token);


--
-- Name: index_versions_on_item_type_and_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_versions_on_item_type_and_item_id ON versions USING btree (item_type, item_id);


--
-- Name: project_geomx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX project_geomx ON projects USING btree (the_geom NULLS FIRST);


--
-- Name: properties_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX properties_idx ON projects USING gin (properties);


--
-- Name: analytics_dashboards fk_rails_67ca88eba4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY analytics_dashboards
    ADD CONSTRAINT fk_rails_67ca88eba4 FOREIGN KEY (chart_id) REFERENCES charts(id);


--
-- Name: analytics_dashboards fk_rails_899c706712; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY analytics_dashboards
    ADD CONSTRAINT fk_rails_899c706712 FOREIGN KEY (project_type_id) REFERENCES project_types(id);


--
-- Name: project_fields fk_rails_b6f8db6003; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY project_fields
    ADD CONSTRAINT fk_rails_b6f8db6003 FOREIGN KEY (project_type_id) REFERENCES project_types(id);


--
-- Name: analytics_dashboards fk_rails_c8a5c46e0a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY analytics_dashboards
    ADD CONSTRAINT fk_rails_c8a5c46e0a FOREIGN KEY (analysis_type_id) REFERENCES analysis_types(id);


--
-- Name: projects fk_rails_d7ca4cafeb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT fk_rails_d7ca4cafeb FOREIGN KEY (project_type_id) REFERENCES project_types(id);


--
-- Name: project_types fk_rails_f786c03c54; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY project_types
    ADD CONSTRAINT fk_rails_f786c03c54 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "public", "postgis";

INSERT INTO "schema_migrations" (version) VALUES
('20130712200422'),
('20130712202501'),
('20130712203244'),
('20130712213531'),
('20130712213701'),
('20130712213724'),
('20130712213824'),
('20130712214619'),
('20130715204959'),
('20130716162158'),
('20130716222456'),
('20130722201635'),
('20130723171738'),
('20130727224622'),
('20130727225014'),
('20130729152410'),
('20130729232640'),
('20130730205108'),
('20130802161930'),
('20130802213706'),
('20140321173957'),
('20140321183208'),
('20140321191518'),
('20150211192354'),
('20150815025523'),
('20150903144510'),
('20151111162301'),
('20151216185716'),
('20160125121901'),
('20160331042003'),
('20160411132731'),
('20160610180826'),
('20160614135136'),
('20160711122603'),
('20160714144748'),
('20160714190301'),
('20160728141659'),
('20160818182716'),
('20160824025942'),
('20160902151714'),
('20160906171104'),
('20160906181015'),
('20160908161607'),
('20160915185501'),
('20160929122519'),
('20160929130245'),
('20161006163523'),
('20161018115728'),
('20161020181359'),
('20161028130406'),
('20161109132537'),
('20161118150927'),
('20161130170735'),
('20161130172957'),
('20161130195711'),
('20161228214311'),
('20170116205359'),
('20170117141109'),
('20170203140610'),
('20170207203335'),
('20170209123239'),
('20170209123540'),
('20170211192009'),
('20170228223801'),
('20170329141559'),
('20170330153434'),
('20170331135955'),
('20170331144751'),
('20170331211118'),
('20170401132722'),
('20170404134053'),
('20170405021153'),
('20170405142624'),
('20170405172200'),
('20170420052648'),
('20170424200126'),
('20170424200710'),
('20170424203712'),
('20170425174157'),
('20170426121854'),
('20170502023002'),
('20170502040156'),
('20170505122458'),
('20170510131228'),
('20170515134255'),
('20170519153942'),
('20170519155838'),
('20170602133837'),
('20170605120723'),
('20170608111444'),
('20170609121847'),
('20170626184150'),
('20170705122736'),
('20170808193743'),
('20170818121523'),
('20170831134941'),
('20170915125850'),
('20170927130628'),
('20171003123035'),
('20171011204141'),
('20171012170523'),
('20171012171528'),
('20171106220541'),
('20171116124255'),
('20171129141820'),
('20180131133941'),
('20180205185939'),
('20180205190009'),
('20180205192133'),
('20180205192340'),
('20180213134336'),
('20180213191820'),
('20180213202457'),
('20180214133448'),
('20180227225634'),
('20180301151945'),
('20180303134221'),
('20180306150411'),
('20180306211512'),
('20180306214255'),
('20180317044723'),
('20180530014129');


