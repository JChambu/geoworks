SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA postgis;


--
-- Name: json_object_update_key(json, text, anyelement); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.json_object_update_key(json json, key_to_set text, value_to_set anyelement) RETURNS json
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT CASE
  WHEN ("json" -> "key_to_set") IS NULL THEN "json"
  ELSE (SELECT concat('{', string_agg(to_json("key") || ':' || "value", ','), '}')
          FROM (SELECT *
                  FROM json_each("json")
                 WHERE "key" <> "key_to_set"
                 UNION ALL
                SELECT "key_to_set", to_json("value_to_set")) AS "fields")::json
END
$$;


--
-- Name: jsonb_append(jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jsonb_append(data jsonb, insert_data jsonb) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $$
    SELECT json_object_agg(key, value)::jsonb
    FROM (
        SELECT * FROM jsonb_each(data)
        UNION ALL
        SELECT * FROM jsonb_each(insert_data)
    ) t;
$$;


--
-- Name: jsonb_delete(jsonb, text[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jsonb_delete(data jsonb, keys text[]) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $$
    SELECT json_object_agg(key, value)::jsonb
    FROM (
        SELECT * FROM jsonb_each(data)
        WHERE key <> ALL(keys)
    ) t;
$$;


--
-- Name: jsonb_lint(jsonb, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jsonb_lint(from_json jsonb, ntab integer DEFAULT 0) RETURNS jsonb
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT (CASE substring(from_json::text FROM '(?m)^[\s]*(.)') /* Get first non-whitespace */
        WHEN '[' THEN
                (E'[\n'
                        || (SELECT string_agg(repeat(E'\t', ntab + 1) || jsonb_lint(value, ntab + 1)::text, E',\n') FROM jsonb_array_elements(from_json)) ||
                E'\n' || repeat(E'\t', ntab) || ']')
        WHEN '{' THEN
                (E'{\n'
                        || (SELECT string_agg(repeat(E'\t', ntab + 1) || to_json(key)::text || ': ' || jsonb_lint(value, ntab + 1)::text, E',\n') FROM jsonb_each(from_json)) ||
                E'\n' || repeat(E'\t', ntab) || '}')
        ELSE
                from_json::text
END)::jsonb
$$;


--
-- Name: jsonb_merge(jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jsonb_merge(data jsonb, merge_data jsonb) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $$
    SELECT json_object_agg(key, value)::jsonb
    FROM (
        WITH to_merge AS (
            SELECT * FROM jsonb_each(merge_data)
        )
        SELECT *
        FROM jsonb_each(data)
        WHERE key NOT IN (SELECT key FROM to_merge)
        UNION ALL
        SELECT * FROM to_merge
    ) t;
$$;


--
-- Name: jsonb_unlint(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jsonb_unlint(from_json jsonb) RETURNS jsonb
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT (CASE substring(from_json::text FROM '(?m)^[\s]*(.)') /* Get first non-whitespace */
    WHEN '[' THEN
        ('['
            || (SELECT string_agg(jsonb_unlint(value)::text, ',') FROM jsonb_array_elements(from_json)) ||
        ']')
    WHEN '{' THEN
        ('{'
            || (SELECT string_agg(to_json(key)::text || ':' || jsonb_unlint(value)::text, ',') FROM jsonb_each(from_json)) ||
        '}')
    ELSE
        from_json::text
END)::jsonb
$$;


--
-- Name: jsonb_update(jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.jsonb_update(data jsonb, update_data jsonb) RETURNS jsonb
    LANGUAGE sql IMMUTABLE
    AS $$
    SELECT json_object_agg(key, value)::jsonb
    FROM (
        WITH old_data AS (
            SELECT * FROM jsonb_each(data)
        ), to_update AS (
            SELECT * FROM jsonb_each(update_data)
            WHERE key IN (SELECT key FROM old_data)
        )
    SELECT * FROM old_data
    WHERE key NOT IN (SELECT key FROM to_update)
    UNION ALL
    SELECT * FROM to_update
) t;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.actions (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: actions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.actions_id_seq OWNED BY public.actions.id;


--
-- Name: analysis_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analysis_types (
    id integer NOT NULL,
    name character varying,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: analysis_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analysis_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analysis_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analysis_types_id_seq OWNED BY public.analysis_types.id;


--
-- Name: analytics_dashboards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_dashboards (
    id integer NOT NULL,
    title character varying,
    description character varying,
    fields json,
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
    const_field character varying,
    group_field_id integer,
    association_id integer,
    assoc_kpi boolean DEFAULT false,
    dashboard_id integer
);


--
-- Name: analytics_dashboards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analytics_dashboards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics_dashboards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analytics_dashboards_id_seq OWNED BY public.analytics_dashboards.id;


--
-- Name: app_configurations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_configurations (
    id integer NOT NULL,
    gisworking_initial_identifier integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: app_configurations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.app_configurations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: app_configurations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.app_configurations_id_seq OWNED BY public.app_configurations.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocks (
    id integer NOT NULL,
    manzana integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blocks_id_seq OWNED BY public.blocks.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
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

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: chains; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chains (
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

CREATE SEQUENCE public.chains_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chains_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chains_id_seq OWNED BY public.chains.id;


--
-- Name: chart_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chart_properties (
    id bigint NOT NULL,
    color character varying,
    height character varying,
    width character varying,
    title character varying,
    type_chart_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: chart_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chart_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chart_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chart_properties_id_seq OWNED BY public.chart_properties.id;


--
-- Name: charts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.charts (
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

CREATE SEQUENCE public.charts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: charts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.charts_id_seq OWNED BY public.charts.id;


--
-- Name: choice_lists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.choice_lists (
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

CREATE SEQUENCE public.choice_lists_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: choice_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.choice_lists_id_seq OWNED BY public.choice_lists.id;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
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

CREATE SEQUENCE public.cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
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

CREATE SEQUENCE public.customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: dashboards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards (
    id bigint NOT NULL,
    name character varying,
    project_type_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: dashboards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboards_id_seq OWNED BY public.dashboards.id;


--
-- Name: delayed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delayed_jobs (
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

CREATE SEQUENCE public.delayed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: delayed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.delayed_jobs_id_seq OWNED BY public.delayed_jobs.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying,
    province_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: extended_listing_loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.extended_listing_loads (
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

CREATE SEQUENCE public.extended_listing_loads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extended_listing_loads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.extended_listing_loads_id_seq OWNED BY public.extended_listing_loads.id;


--
-- Name: extended_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.extended_listings (
    id integer NOT NULL,
    name character varying,
    street character varying,
    city_id integer,
    user_id integer,
    category_id integer,
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
    street_3 character varying,
    the_geom public.geometry(Geometry,4326),
    comments character varying
);


--
-- Name: extended_listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.extended_listings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extended_listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.extended_listings_id_seq OWNED BY public.extended_listings.id;


--
-- Name: extended_listings_identifier_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.extended_listings_identifier_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: extended_listings_identifier_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.extended_listings_identifier_seq OWNED BY public.extended_listings.identifier;


--
-- Name: food_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.food_types (
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

CREATE SEQUENCE public.food_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: food_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.food_types_id_seq OWNED BY public.food_types.id;


--
-- Name: generate_deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.generate_deliveries (
    id integer NOT NULL,
    name character varying,
    country_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: generate_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.generate_deliveries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: generate_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.generate_deliveries_id_seq OWNED BY public.generate_deliveries.id;


--
-- Name: geo_editions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.geo_editions (
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

CREATE SEQUENCE public.geo_editions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: geo_editions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.geo_editions_id_seq OWNED BY public.geo_editions.id;


--
-- Name: graphics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.graphics (
    id bigint NOT NULL,
    dashboard_id bigint,
    token character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: graphics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.graphics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: graphics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.graphics_id_seq OWNED BY public.graphics.id;


--
-- Name: graphics_properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.graphics_properties (
    id bigint NOT NULL,
    color character varying,
    height character varying,
    width character varying,
    title character varying,
    chart_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    analytics_dashboard_id integer,
    graphic_id integer
);


--
-- Name: graphics_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.graphics_properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: graphics_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.graphics_properties_id_seq OWNED BY public.graphics_properties.id;


--
-- Name: has_project_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.has_project_types (
    id bigint NOT NULL,
    user_id bigint,
    project_type_id bigint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: has_project_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.has_project_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: has_project_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.has_project_types_id_seq OWNED BY public.has_project_types.id;


--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_items (
    id character varying,
    name character varying,
    release_date character varying,
    manufacturer character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: load_locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.load_locations (
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

CREATE SEQUENCE public.load_locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: load_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.load_locations_id_seq OWNED BY public.load_locations.id;


--
-- Name: manufacturers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.manufacturers (
    name character varying,
    home_page character varying,
    phone character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: p_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.p_actions (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: p_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.p_actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: p_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.p_actions_id_seq OWNED BY public.p_actions.id;


--
-- Name: parkings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parkings (
    id integer NOT NULL,
    name character varying,
    street character varying,
    brand character varying,
    operator character varying,
    facility_type_id integer,
    levels integer,
    city_id integer,
    the_geom public.geometry(Point,4326),
    the_geom_entrance public.geometry(Point,4326),
    the_geom_exit public.geometry(Point,4326),
    phone character varying,
    website character varying,
    detailed_pricing_model character varying,
    price numeric(10,2),
    currency character varying,
    available_payment_methods character varying,
    regular_openning_hours character varying,
    exceptions_opening character varying,
    the_geom_area public.geometry(Polygon,4326),
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

CREATE SEQUENCE public.parkings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: parkings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parkings_id_seq OWNED BY public.parkings.id;


--
-- Name: pg_search_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pg_search_documents (
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

CREATE SEQUENCE public.pg_search_documents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pg_search_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pg_search_documents_id_seq OWNED BY public.pg_search_documents.id;


--
-- Name: poi_address_loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poi_address_loads (
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

CREATE SEQUENCE public.poi_address_loads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_address_loads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.poi_address_loads_id_seq OWNED BY public.poi_address_loads.id;


--
-- Name: poi_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poi_addresses (
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

CREATE SEQUENCE public.poi_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.poi_addresses_id_seq OWNED BY public.poi_addresses.id;


--
-- Name: poi_loads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poi_loads (
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

CREATE SEQUENCE public.poi_loads_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_loads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.poi_loads_id_seq OWNED BY public.poi_loads.id;


--
-- Name: poi_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poi_sources (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: poi_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.poi_sources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.poi_sources_id_seq OWNED BY public.poi_sources.id;


--
-- Name: poi_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poi_statuses (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: poi_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.poi_statuses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.poi_statuses_id_seq OWNED BY public.poi_statuses.id;


--
-- Name: poi_sub_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poi_sub_types (
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

CREATE SEQUENCE public.poi_sub_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_sub_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.poi_sub_types_id_seq OWNED BY public.poi_sub_types.id;


--
-- Name: poi_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poi_types (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    code character varying
);


--
-- Name: poi_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.poi_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: poi_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.poi_types_id_seq OWNED BY public.poi_types.id;


--
-- Name: pois; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pois (
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
    the_geom public.geometry(Point,4326),
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

CREATE SEQUENCE public.pois_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pois_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pois_id_seq OWNED BY public.pois.id;


--
-- Name: project_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_fields (
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

CREATE SEQUENCE public.project_fields_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_fields_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_fields_id_seq OWNED BY public.project_fields.id;


--
-- Name: project_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_types (
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

CREATE SEQUENCE public.project_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_types_id_seq OWNED BY public.project_types.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    properties jsonb,
    project_type_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    properties_original jsonb,
    the_geom public.geometry(Geometry,4326)
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provinces (
    id integer NOT NULL,
    name character varying,
    country_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.provinces_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;


--
-- Name: regexp_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regexp_types (
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

CREATE SEQUENCE public.regexp_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: regexp_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.regexp_types_id_seq OWNED BY public.regexp_types.id;


--
-- Name: restaurant_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurant_types (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: restaurant_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restaurant_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restaurant_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restaurant_types_id_seq OWNED BY public.restaurant_types.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: street_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.street_types (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: street_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.street_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: street_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.street_types_id_seq OWNED BY public.street_types.id;


--
-- Name: streets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.streets (
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

CREATE SEQUENCE public.streets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: streets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.streets_id_seq OWNED BY public.streets.id;


--
-- Name: terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.terms (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: terms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.terms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: terms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.terms_id_seq OWNED BY public.terms.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
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
    locked_at timestamp without time zone,
    token character varying,
    authentication_token character varying(30)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_projects (
    id bigint NOT NULL,
    user_id integer,
    project_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: users_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_projects_id_seq OWNED BY public.users_projects.id;


--
-- Name: verification_pois; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_pois (
    id integer NOT NULL,
    poi_id integer,
    user_id integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: verification_pois_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.verification_pois_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: verification_pois_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.verification_pois_id_seq OWNED BY public.verification_pois.id;


--
-- Name: versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.versions (
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

CREATE SEQUENCE public.versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.versions_id_seq OWNED BY public.versions.id;


--
-- Name: view_luminarias; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_luminarias AS
 SELECT public.st_x(projects.the_geom) AS x,
    public.st_y(projects.the_geom) AS y,
    projects.the_geom
   FROM public.projects
  WHERE (projects.project_type_id = 9)
 LIMIT 50000;


--
-- Name: view_project_geoserver; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_project_geoserver AS
 SELECT public.st_x(projects.the_geom) AS x,
    public.st_y(projects.the_geom) AS y,
    projects.the_geom,
    projects.project_type_id
   FROM public.projects;


--
-- Name: actions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actions ALTER COLUMN id SET DEFAULT nextval('public.actions_id_seq'::regclass);


--
-- Name: analysis_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_types ALTER COLUMN id SET DEFAULT nextval('public.analysis_types_id_seq'::regclass);


--
-- Name: analytics_dashboards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_dashboards ALTER COLUMN id SET DEFAULT nextval('public.analytics_dashboards_id_seq'::regclass);


--
-- Name: app_configurations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_configurations ALTER COLUMN id SET DEFAULT nextval('public.app_configurations_id_seq'::regclass);


--
-- Name: blocks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks ALTER COLUMN id SET DEFAULT nextval('public.blocks_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: chains id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chains ALTER COLUMN id SET DEFAULT nextval('public.chains_id_seq'::regclass);


--
-- Name: chart_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_properties ALTER COLUMN id SET DEFAULT nextval('public.chart_properties_id_seq'::regclass);


--
-- Name: charts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts ALTER COLUMN id SET DEFAULT nextval('public.charts_id_seq'::regclass);


--
-- Name: choice_lists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choice_lists ALTER COLUMN id SET DEFAULT nextval('public.choice_lists_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: dashboards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards ALTER COLUMN id SET DEFAULT nextval('public.dashboards_id_seq'::regclass);


--
-- Name: delayed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delayed_jobs ALTER COLUMN id SET DEFAULT nextval('public.delayed_jobs_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: extended_listing_loads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extended_listing_loads ALTER COLUMN id SET DEFAULT nextval('public.extended_listing_loads_id_seq'::regclass);


--
-- Name: extended_listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extended_listings ALTER COLUMN id SET DEFAULT nextval('public.extended_listings_id_seq'::regclass);


--
-- Name: extended_listings identifier; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extended_listings ALTER COLUMN identifier SET DEFAULT nextval('public.extended_listings_identifier_seq'::regclass);


--
-- Name: food_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.food_types ALTER COLUMN id SET DEFAULT nextval('public.food_types_id_seq'::regclass);


--
-- Name: generate_deliveries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generate_deliveries ALTER COLUMN id SET DEFAULT nextval('public.generate_deliveries_id_seq'::regclass);


--
-- Name: geo_editions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.geo_editions ALTER COLUMN id SET DEFAULT nextval('public.geo_editions_id_seq'::regclass);


--
-- Name: graphics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graphics ALTER COLUMN id SET DEFAULT nextval('public.graphics_id_seq'::regclass);


--
-- Name: graphics_properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graphics_properties ALTER COLUMN id SET DEFAULT nextval('public.graphics_properties_id_seq'::regclass);


--
-- Name: has_project_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.has_project_types ALTER COLUMN id SET DEFAULT nextval('public.has_project_types_id_seq'::regclass);


--
-- Name: load_locations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.load_locations ALTER COLUMN id SET DEFAULT nextval('public.load_locations_id_seq'::regclass);


--
-- Name: p_actions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.p_actions ALTER COLUMN id SET DEFAULT nextval('public.p_actions_id_seq'::regclass);


--
-- Name: parkings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parkings ALTER COLUMN id SET DEFAULT nextval('public.parkings_id_seq'::regclass);


--
-- Name: pg_search_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pg_search_documents ALTER COLUMN id SET DEFAULT nextval('public.pg_search_documents_id_seq'::regclass);


--
-- Name: poi_address_loads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_address_loads ALTER COLUMN id SET DEFAULT nextval('public.poi_address_loads_id_seq'::regclass);


--
-- Name: poi_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_addresses ALTER COLUMN id SET DEFAULT nextval('public.poi_addresses_id_seq'::regclass);


--
-- Name: poi_loads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_loads ALTER COLUMN id SET DEFAULT nextval('public.poi_loads_id_seq'::regclass);


--
-- Name: poi_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_sources ALTER COLUMN id SET DEFAULT nextval('public.poi_sources_id_seq'::regclass);


--
-- Name: poi_statuses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_statuses ALTER COLUMN id SET DEFAULT nextval('public.poi_statuses_id_seq'::regclass);


--
-- Name: poi_sub_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_sub_types ALTER COLUMN id SET DEFAULT nextval('public.poi_sub_types_id_seq'::regclass);


--
-- Name: poi_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_types ALTER COLUMN id SET DEFAULT nextval('public.poi_types_id_seq'::regclass);


--
-- Name: pois id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pois ALTER COLUMN id SET DEFAULT nextval('public.pois_id_seq'::regclass);


--
-- Name: project_fields id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_fields ALTER COLUMN id SET DEFAULT nextval('public.project_fields_id_seq'::regclass);


--
-- Name: project_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_types ALTER COLUMN id SET DEFAULT nextval('public.project_types_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);


--
-- Name: regexp_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regexp_types ALTER COLUMN id SET DEFAULT nextval('public.regexp_types_id_seq'::regclass);


--
-- Name: restaurant_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_types ALTER COLUMN id SET DEFAULT nextval('public.restaurant_types_id_seq'::regclass);


--
-- Name: street_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.street_types ALTER COLUMN id SET DEFAULT nextval('public.street_types_id_seq'::regclass);


--
-- Name: streets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.streets ALTER COLUMN id SET DEFAULT nextval('public.streets_id_seq'::regclass);


--
-- Name: terms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms ALTER COLUMN id SET DEFAULT nextval('public.terms_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_projects ALTER COLUMN id SET DEFAULT nextval('public.users_projects_id_seq'::regclass);


--
-- Name: verification_pois id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_pois ALTER COLUMN id SET DEFAULT nextval('public.verification_pois_id_seq'::regclass);


--
-- Name: versions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions ALTER COLUMN id SET DEFAULT nextval('public.versions_id_seq'::regclass);


--
-- Name: actions actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: analysis_types analysis_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analysis_types
    ADD CONSTRAINT analysis_types_pkey PRIMARY KEY (id);


--
-- Name: analytics_dashboards analytics_dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_dashboards
    ADD CONSTRAINT analytics_dashboards_pkey PRIMARY KEY (id);


--
-- Name: app_configurations app_configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_configurations
    ADD CONSTRAINT app_configurations_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: blocks blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chains chains_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chains
    ADD CONSTRAINT chains_pkey PRIMARY KEY (id);


--
-- Name: chart_properties chart_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chart_properties
    ADD CONSTRAINT chart_properties_pkey PRIMARY KEY (id);


--
-- Name: charts charts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT charts_pkey PRIMARY KEY (id);


--
-- Name: choice_lists choice_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.choice_lists
    ADD CONSTRAINT choice_lists_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: dashboards dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_pkey PRIMARY KEY (id);


--
-- Name: delayed_jobs delayed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delayed_jobs
    ADD CONSTRAINT delayed_jobs_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: extended_listing_loads extended_listing_loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extended_listing_loads
    ADD CONSTRAINT extended_listing_loads_pkey PRIMARY KEY (id);


--
-- Name: extended_listings extended_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.extended_listings
    ADD CONSTRAINT extended_listings_pkey PRIMARY KEY (id);


--
-- Name: food_types food_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.food_types
    ADD CONSTRAINT food_types_pkey PRIMARY KEY (id);


--
-- Name: generate_deliveries generate_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generate_deliveries
    ADD CONSTRAINT generate_deliveries_pkey PRIMARY KEY (id);


--
-- Name: geo_editions geo_editions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.geo_editions
    ADD CONSTRAINT geo_editions_pkey PRIMARY KEY (id);


--
-- Name: graphics graphics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graphics
    ADD CONSTRAINT graphics_pkey PRIMARY KEY (id);


--
-- Name: graphics_properties graphics_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graphics_properties
    ADD CONSTRAINT graphics_properties_pkey PRIMARY KEY (id);


--
-- Name: has_project_types has_project_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.has_project_types
    ADD CONSTRAINT has_project_types_pkey PRIMARY KEY (id);


--
-- Name: load_locations load_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.load_locations
    ADD CONSTRAINT load_locations_pkey PRIMARY KEY (id);


--
-- Name: p_actions p_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.p_actions
    ADD CONSTRAINT p_actions_pkey PRIMARY KEY (id);


--
-- Name: parkings parkings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parkings
    ADD CONSTRAINT parkings_pkey PRIMARY KEY (id);


--
-- Name: pg_search_documents pg_search_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pg_search_documents
    ADD CONSTRAINT pg_search_documents_pkey PRIMARY KEY (id);


--
-- Name: poi_address_loads poi_address_loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_address_loads
    ADD CONSTRAINT poi_address_loads_pkey PRIMARY KEY (id);


--
-- Name: poi_addresses poi_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_addresses
    ADD CONSTRAINT poi_addresses_pkey PRIMARY KEY (id);


--
-- Name: poi_loads poi_loads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_loads
    ADD CONSTRAINT poi_loads_pkey PRIMARY KEY (id);


--
-- Name: poi_sources poi_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_sources
    ADD CONSTRAINT poi_sources_pkey PRIMARY KEY (id);


--
-- Name: poi_statuses poi_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_statuses
    ADD CONSTRAINT poi_statuses_pkey PRIMARY KEY (id);


--
-- Name: poi_sub_types poi_sub_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_sub_types
    ADD CONSTRAINT poi_sub_types_pkey PRIMARY KEY (id);


--
-- Name: poi_types poi_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poi_types
    ADD CONSTRAINT poi_types_pkey PRIMARY KEY (id);


--
-- Name: pois pois_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pois
    ADD CONSTRAINT pois_pkey PRIMARY KEY (id);


--
-- Name: project_fields project_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_fields
    ADD CONSTRAINT project_fields_pkey PRIMARY KEY (id);


--
-- Name: project_types project_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_types
    ADD CONSTRAINT project_types_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- Name: regexp_types regexp_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regexp_types
    ADD CONSTRAINT regexp_types_pkey PRIMARY KEY (id);


--
-- Name: restaurant_types restaurant_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_types
    ADD CONSTRAINT restaurant_types_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: street_types street_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.street_types
    ADD CONSTRAINT street_types_pkey PRIMARY KEY (id);


--
-- Name: streets streets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.streets
    ADD CONSTRAINT streets_pkey PRIMARY KEY (id);


--
-- Name: terms terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_projects users_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_projects
    ADD CONSTRAINT users_projects_pkey PRIMARY KEY (id);


--
-- Name: verification_pois verification_pois_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_pois
    ADD CONSTRAINT verification_pois_pkey PRIMARY KEY (id);


--
-- Name: versions versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions
    ADD CONSTRAINT versions_pkey PRIMARY KEY (id);


--
-- Name: delayed_jobs_priority; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX delayed_jobs_priority ON public.delayed_jobs USING btree (priority, run_at);


--
-- Name: idx_geom; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_geom ON public.projects USING gist (the_geom);


--
-- Name: index_analytics_dashboards_on_analysis_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_dashboards_on_analysis_type_id ON public.analytics_dashboards USING btree (analysis_type_id);


--
-- Name: index_analytics_dashboards_on_chart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_dashboards_on_chart_id ON public.analytics_dashboards USING btree (chart_id);


--
-- Name: index_analytics_dashboards_on_project_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_dashboards_on_project_type_id ON public.analytics_dashboards USING btree (project_type_id);


--
-- Name: index_chart_properties_on_type_chart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_chart_properties_on_type_chart_id ON public.chart_properties USING btree (type_chart_id);


--
-- Name: index_dashboards_on_project_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_dashboards_on_project_type_id ON public.dashboards USING btree (project_type_id);


--
-- Name: index_graphics_on_dashboard_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_graphics_on_dashboard_id ON public.graphics USING btree (dashboard_id);


--
-- Name: index_graphics_properties_on_chart_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_graphics_properties_on_chart_id ON public.graphics_properties USING btree (chart_id);


--
-- Name: index_has_project_types_on_project_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_has_project_types_on_project_type_id ON public.has_project_types USING btree (project_type_id);


--
-- Name: index_has_project_types_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_has_project_types_on_user_id ON public.has_project_types USING btree (user_id);


--
-- Name: index_pg_search_documents_on_searchable_type_and_searchable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pg_search_documents_on_searchable_type_and_searchable_id ON public.pg_search_documents USING btree (searchable_type, searchable_id);


--
-- Name: index_project_fields_on_project_type_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_fields_on_project_type_id ON public.project_fields USING btree (project_type_id);


--
-- Name: index_project_types_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_types_on_user_id ON public.project_types USING btree (user_id);


--
-- Name: index_users_on_authentication_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_authentication_token ON public.users USING btree (authentication_token);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_token ON public.users USING btree (token);


--
-- Name: index_users_on_unlock_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_unlock_token ON public.users USING btree (unlock_token);


--
-- Name: index_versions_on_item_type_and_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_versions_on_item_type_and_item_id ON public.versions USING btree (item_type, item_id);


--
-- Name: project_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX project_type_idx ON public.projects USING btree (project_type_id);


--
-- Name: has_project_types fk_rails_3852bc0f07; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.has_project_types
    ADD CONSTRAINT fk_rails_3852bc0f07 FOREIGN KEY (project_type_id) REFERENCES public.project_types(id);


--
-- Name: analytics_dashboards fk_rails_67ca88eba4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_dashboards
    ADD CONSTRAINT fk_rails_67ca88eba4 FOREIGN KEY (chart_id) REFERENCES public.charts(id);


--
-- Name: analytics_dashboards fk_rails_899c706712; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_dashboards
    ADD CONSTRAINT fk_rails_899c706712 FOREIGN KEY (project_type_id) REFERENCES public.project_types(id);


--
-- Name: project_fields fk_rails_b6f8db6003; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_fields
    ADD CONSTRAINT fk_rails_b6f8db6003 FOREIGN KEY (project_type_id) REFERENCES public.project_types(id);


--
-- Name: analytics_dashboards fk_rails_c8a5c46e0a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_dashboards
    ADD CONSTRAINT fk_rails_c8a5c46e0a FOREIGN KEY (analysis_type_id) REFERENCES public.analysis_types(id);


--
-- Name: projects fk_rails_d7ca4cafeb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fk_rails_d7ca4cafeb FOREIGN KEY (project_type_id) REFERENCES public.project_types(id);


--
-- Name: project_types fk_rails_f786c03c54; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_types
    ADD CONSTRAINT fk_rails_f786c03c54 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: has_project_types fk_rails_fbff27e15c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.has_project_types
    ADD CONSTRAINT fk_rails_fbff27e15c FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

SET search_path TO "public", "postgis";

INSERT INTO "schema_migrations" (version) VALUES
('0'),
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
('20180530014129'),
('20180601030159'),
('20180601114253'),
('20180606181003'),
('20180606200023'),
('20180823034917'),
('20180823135344'),
('20180824132439'),
('20180921062715'),
('20180924022044'),
('20180928041240'),
('20180928041601'),
('20180928145521'),
('20180928154016'),
('20180929143018'),
('20181025220040'),
('20181101181415'),
('20181102015157'),
('20181102015616'),
('20181102145900'),
('20181102150151'),
('20181102154702'),
('20181102202047'),
('20181102204525');


