#encoding: utf-8
class Poi < ActiveRecord::Base
  extend Geoworks::Poi::Download
  include Geoworks::Poi::Attributes
  extend Geoworks::Poi::Finders  

  has_paper_trail
 # set_rgeo_factory_for_column(:the_geom, RGeo::Geographic.spherical_factory(:srid => 4326))

  belongs_to :poi_type
  belongs_to :poi_load
  belongs_to :chain
  belongs_to :poi_status
  belongs_to :poi_sub_type
  belongs_to :food_type
  belongs_to :poi_source
  belongs_to :street_type
  belongs_to :user
  belongs_to :city
  belongs_to :p_action
  belongs_to :restaurant_type
  has_one :department, :through => :city
  has_one :province, :through => :department
  has_one :country, :through => :province
  has_many :verification_poi

  #before_validation :build_identifier #comentar para la autogeneracion de identiier
  before_validation :build_geom
  before_save :build_geom
  before_save :load_identifier_hash
  before_save :strip_whitespace, only: [:name, :street_name, :house_number]
  #after_save :add_dictionary_terms

  #validates :poi_source_id, :presence => true, :if => :was_validated?
  #validate :control_date_present?
  #validates :poi_status_id, :presence => true
  ##validates :user_id, :presence => true, :if => :was_validated?
  validates :poi_type_id, :presence => true
  validates :name, :presence => true,  :if => :was_validated?
  validates :city_id,  :street_name,  :presence => true  , :if => :was_validated?
  validates :street_type_id, :presence => true  , :if => :was_validated?
  validates  :house_number, :presence => true  , :if => :was_validated?

  validates :identifier, :presence => true, :uniqueness => true, :unless => :poi_without_source?,  on: :update #comentar la la validacion de identifier
  validates :old_identifier, :presence => true, :if => :is_navteq_poi?
  validates :p_action_id, :presence => true, on: :update, if: :action_type
  validates :email, :second_email,
    :email_format => {:message => I18n.t("activerecord.errors.messages.invalid_email"),
                      :allow_nil => true, :allow_blank => true}, :if => :was_validated?
  validates :phone, :second_phone, :cel_number,
    :format => {:with => %r{\A(([0-9]{1,4})([\-]{1})([\d]{1,10}))?\z}i,
                :message => I18n.t("activerecord.errors.messages.invalid_phone")},
    :allow_nil => true, :allow_blank => true, :if => :was_validated?
  validates :website,
    :format => {:with => %r{\Ahttps?:\/\/([^\s:@]+:[^\s:@]*@)?[A-Za-z\d\-]+(\.[A-Za-z\d\-]+)+\.?(:\d{1,5})?([\/?]\S*)?\z}i,
                :message => I18n.t("activerecord.errors.messages.invalid_url")},
    :allow_nil => true, :allow_blank => true, :if => :was_validated?,
    length:  {maximum: 200}
  validate :geometry_setted?
  validate :duplicated_identifier_exist? #ver? 
  #  validate :country_restaurant_type? 



  delegate :complete_name, :to => :city, :prefix => true, :allow_nil => true
  delegate :name, :to => :country, :prefix => true, :allow_nil => true
  delegate :name, :to => :province, :prefix => true, :allow_nil => true
  delegate :name, :to => :department, :prefix => true, :allow_nil => true
  delegate :name, :to => :city, :prefix => true, :allow_nil => true
  delegate :zip, :to => :city, :prefix => true, :allow_nil => true
  delegate :name, :to => :chain, :prefix => true, :allow_nil => true
  delegate :identifier, :to => :chain, :prefix => true, :allow_nil => true
  delegate :name, :to => :poi_source, :prefix => true, :allow_nil => true
  delegate :name, :to => :food_type, :prefix => true, :allow_nil => true
  delegate :name, :to => :street_type, :prefix => true, :allow_nil => true
  delegate :name, :to => :poi_type, :prefix => true, :allow_nil => true
  delegate :name, :to => :poi_sub_type, :prefix => true, :allow_nil => true
  delegate :name, :to => :restaurant_type, :prefix => true, :allow_nil => true
  delegate :name, :to => :user, :prefix => true, :allow_nil => true
  delegate :some_identifier, :to => :user, :allow_nil => true
  delegate :human_name, :to => :poi_status, :prefix => true, :allow_nil => true
  delegate :name, :to => :poi_status, :prefix => true, :allow_nil => true
  delegate :name, :to=> :p_action, :prefix => true, :allow_nil => true

  attr_accessor :latitude, :longitude


  #scope :pois_around, lambda {select(" st_y(the_geom), st_x(the_geom) ").where(name: 'Falabella')}
  #scope :pois_around, ->(lat, lon) {select(" st_y(the_geom), st_x(the_geom) ").where("ST_DWithin(the_geom, ST_SetSRID(ST_Point(#{lon} , #{lat} ), 4326), 0.005)")}
  scope :pois_around, ->(lat, lon, poi_type_id) {select("id, st_y(the_geom), st_x(the_geom), pois.name, street_name, poi_type_id, house_number, identifier").where("ST_Within(the_geom, ST_Transform(ST_Buffer(ST_Transform(ST_SetSRID(ST_MakePoint(#{lon} , #{lat}), 4326), 3857), 400), 4326)) and poi_type_id = #{poi_type_id} ").order(:name) }
  scope :total_validates, lambda {select("id, st_y(the_geom), st_x(the_geom), pois.name, street_name, poi_type_id, house_number, identifier").where(" poi_status_id = #{PoiStatus.restricted.id}").order(:name) }


  def country_restaurant_type?

    if self.country_name != 'México' && !self.restaurant_type_id.blank?
      self.errors.add(:base, :restaurant_type_error)
      return false
    end 
  end 

  def  action_type

    if (poi_source_id == PoiSource.gisworking.id && (p_action_id != PAction.Add.id && p_action_id != PAction.check.id ))
      self.errors.add(:base, :invalid_poi_action)
    end
  end

  def self.update_revised user_id

    @poi = Poi.where(poi_status_id: 7, id: VerificationPoi.where(user_id: user_id).select(:poi_id)).update_all(poi_status_id: 4, verification: true, control_date: Date.current )

  end

  def strip_whitespace

    self.name = self.name.strip unless self.name.nil?
    self.street_name = self.street_name.strip unless self.street_name.nil?
    self.house_number = self.house_number.strip unless self.house_number.nil?
    self.name = self.name.gsub('"', '')
  end

  def self.verification_pois(options = nill) 

    q =  self.where(verification: false, poi_status_id: [2,7], p_action_id: [1,2,3,4])
    q =  q.where(city_id: City.where(department_id: Department.where(province_id: Province.where(country_id: Country.where(id: options[:country_id]).select(:id)).select(:id)).select(:id)).select(:id)) if !options[:country_id].blank?
    q = q.where(poi_type_id: options[:poi_type_id] ) if !options[:poi_type_id].blank?
    q = q.where(user_id: options[:user_id])   if !options[:user_id].blank?
    q = q.where(chain_id: options[:chain_id])   if !options[:chain_id].blank?
    q = q.where(p_action_id: options[:p_action_id])   if !options[:p_action_id].blank?
    q = q.select(:old_identifier, :control_date, :name, :street_name, :city_id, :poi_type_id, :poi_sub_type_id, :phone, :website, :poi_source_id, :user_id, :poi_status_id, :p_action_id, :id, :house_number, :note, :chain_id, :restaurant_type_id, :food_type_id)
    q = q.order(:city_id, 'st_y(the_geom) ASC', :name )
    q = q.limit(20) if options[:user_id].blank? && options[:country_id].blank? && options[:poi_type_id].blank? && options[:chain_id].blank?
    q
  end

  def self.deliver pois
    count = 0
    pois.each do |poi|
      if (poi.poi_status_id == PoiStatus.verificado.id) and poi.active and poi.p_action_id < 6
        pp = Poi.find_by(id: poi.id) #workaround in order to avoid ActiveRecord::ReadOnlyRecord error
        pp.poi_status_id = PoiStatus.delivered.id
        count += 1 if pp.save
      end
    end
    count
  end

  def original_object

    begin
      return self.versions.second.reify
    rescue
      return Poi.find_by(id: self.id)
    end
  end

  def was_validated?

    if ( self.p_action_id != 5  && self.p_action_id != PAction.name_action('check').id )
      (self.poi_status_id == PoiStatus.name_status('validated').id or
       self.poi_status_id == PoiStatus.name_status('delivered').id) 
    end
  end

  private

  def is_navteq_poi?
    (self.poi_source_id == PoiSource.navteq.id)
  end

  def poi_without_source?
    self.poi_source.nil?
  end

  def duplicated_identifier_exist?
    return true if self.duplicated_identifier.nil?
    duplicated = Poi.find_by_old_identifier self.duplicated_identifier

    if !duplicated
      self.errors.add(:duplicated_identifier, :nonexistent)
      return false
    end

    if duplicated.id == self.id
      self.errors.add(:duplicated_identifier, :same_original_and_duplicated)
      return false
    end
  end

  def control_date_present?
    return true unless was_validated?
    if self.control_date.nil?
      self.errors.add(:base, :undefined_control_date)
      return false
    end
  end

  def geometry_setted?
    
    if self.the_geom.nil?
      self.errors.add(:base, :empty_geometry)
      return false
    end
  end

  def build_identifier
    if self.identifier.nil? and
      self.poi_source_id == PoiSource.gisworking.id
      last_gis_poi_identifier = Poi.all_gisworking.order(:identifier).try(:last).try(:identifier)
      gisworking_initial_identifier = AppConfiguration.first.gisworking_initial_identifier
      if last_gis_poi_identifier and
        (last_gis_poi_identifier + 1) > gisworking_initial_identifier
        self.identifier = (last_gis_poi_identifier + 1)
      else
        self.identifier = gisworking_initial_identifier
      end

    end
  end

  def build_geom
    if self.latitude and self.longitude and
      !self.latitude.to_s.empty? and !self.longitude.to_s.empty?
      self.the_geom = "POINT(#{self.longitude} #{self.latitude})"
    end
  end

  def load_identifier_hash
    self.identifier_hash = Digest::MD5.hexdigest(
      (self.name.to_s.delete(" ").downcase + 
       self.poi_type_id.to_s.delete(" ").downcase + 
       self.street_name.to_s.delete(" ").downcase + 
       self.house_number.to_s.delete(" ").downcase + 
       self.city_id.to_s.delete(" ").downcase))
  end

  def add_dictionary_terms
    self.name.to_s.split.each do |term|
      c = Poi.where("pois.name ~* '(\ |^)#{Regexp.escape(term.gsub(/'/, "\'\'"))}(\ |$)'").count
      d = Poi.where("pois.name ilike '%#{Regexp.escape(self.name.gsub(/'/, "\'\'"))}%'").count
      if ((c - d) > 10 )
        Term.find_or_create_by_name(term)
      end
    end
  end    

=begin
  def migration_pois

    Poi.where(event: 'update').finch_each do |poi| 
    Poi.update(poi.id, poi_migration: true)
 end

end
=end
end
