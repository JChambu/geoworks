class GeoEdition < ApplicationRecord

  before_save :build_geom_line

  attr_accessor :line

  has_paper_trail
   validates :poi_status_id, presence: true
   validates :paridad, presence: true, if: "!gw_paridad.present?"
  # #validates :number_door_start_original, numericality: {odd: :true}, if: "number_door_end_original.odd? && gw_paridad.nil?"
  # #validates :number_door_end_original_, numericality: {odd: :true}, if: "number_door_start_original.odd? && gw_paridad.nil?"
   validates :gw_pta_ini, numericality: {only_integer: true, allow_nil: true, allow_blank: true} 
   validates :gw_pta_ini, numericality: {less_than: :gw_pta_fin }, if: "gw_pta_fin.present? && !gw_pta_ini.blank?"
   validates :gw_pta_ini, numericality: {odd: :true}, if: "!gw_pta_fin.blank? && gw_pta_fin.odd? && !gw_pta_fin.present? && !gw_pta_ini.blank?"
   validates :gw_pta_ini, numericality: {even: :true}, if: "!gw_pta_fin.blank? &&  gw_pta_fin.even? && !gw_pta_ini.present? && !gw_pta_ini.blank?"
   validates :gw_pta_fin, numericality: {only_integer: true, allow_nil: true}
   validates :gw_pta_fin, numericality: {grather_than: :gw_pta_ini}, if: "gw_pta_ini.present? && !gw_pta_ini.blank?"

   validate  :gw_paridad, if: :new_paridad?
   validate :yard, if: :is_yard?
   validate :wasteland, if: :is_wasteland?
   validate :poi_status_id, if: :validate_for_status
  #validate :poi_status_id, if: :validate_for_status



  def validate_for_status

    case  self.poi_status_id
      when PoiStatus.name_status('Alta').id
          validates_presence_of :gw_pta_ini, :gw_code, :gw_calleid, :gw_paridad
      when PoiStatus.name_status('Modificado').id

        if !self.yard? and !self.wasteland?
        puts self.yard?
        puts self.wasteland?
        if self.gw_pta_fin.blank? and  self.gw_paridad.blank? 
            errors[:base] = "No puede estar Gw_paridad y Gw_pta_ini no pueden estar en blanco"
          end
          validates_absence_of :gw_pta_ini, :gw_code, :gw_calleid
        end
      when PoiStatus.name_status('Baja').id
          validates_absence_of :gw_pta_ini, :gw_pta_fin, :gw_paridad, :gw_code, :line, :gw_calleid
          validates_presence_of :observations
      when PoiStatus.name_status('validated').id
          validates_absence_of :gw_pta_ini, :gw_pta_fin, :gw_paridad, :gw_code, :line, :gw_calleid
          validates_presence_of :observations
      when PoiStatus.name_status('not_validated').id
          validates_presence_of :observations
      end
  end

  def is_yard?
    self.gw_pta_ini = 77775  if self.yard?
    self.gw_pta_fin = 77777  if self.yard?
    self.gw_paridad = 'N'  if self.yard?
  end

  def is_wasteland?
    self.gw_pta_ini = 88885  if self.wasteland?
    self.gw_pta_fin = 88887  if self.wasteland?
    self.gw_paridad = 'N'  if self.wasteland?
  end

  def new_paridad?
    if :gw_paridad.present?
      if !self.gw_pta_ini.nil? && !self.gw_pta_fin.nil? 

        if (self.gw_pta_ini == 77775 && self.gw_pta_fin == 77777) || (self.gw_pta_ini == 88885 && self.gw_pta_fin == 88887 )
          self.gw_paridad = 'N'
          return
        end
        
        if self.gw_pta_ini % 2 > 0 && self.gw_pta_fin % 2 > 0 && self.gw_paridad != 'I' 
          self.errors.add(:base, :gw_paridad_error)
        end

        if self.gw_pta_ini % 2 == 0 && self.gw_pta_fin % 2 == 0 && self.gw_paridad != 'P' 
          self.errors.add(:base, :gw_paridad_error)
        end
      end
    end
  end

  def build_geom_line
    if self.line and !self.line.to_s.empty?
      self.the_geom_segment = "LINESTRING(#{self.line})"
    end
  end
end
