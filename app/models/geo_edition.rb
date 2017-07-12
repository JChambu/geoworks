class GeoEdition < ApplicationRecord

  before_save :build_geom_line

  attr_accessor :line

  validates :poi_status_id, presence: true, allow_blank: false
  validates :paridad, presence: true, if: "!gw_paridad.present?"

#  validates :number_door_start_original.to_i, numericality: {odd: :true}, if: "number_door_end_original.odd? && gw_paridad.nil?"
 # validates :number_door_end_original_, numericality: {odd: :true}, if: "number_door_start_original.odd? && gw_paridad.nil?"
  
  validates :gw_pta_ini, numericality: {only_integer: true}, allow_nil: true
  validates :gw_pta_ini, numericality: {less_than: :gw_pta_fin }, if: "gw_pta_fin.present?"
  validates :gw_pta_ini, numericality: {odd: :true}, if: "gw_pta_fin.odd?"
  validates :gw_pta_ini, numericality: {even: :true}, if: "gw_pta_fin.even?"

  validates :gw_pta_fin, numericality: {only_integer: true}, allow_nil: true
  validates :gw_pta_fin, numericality: {grather_than: :gw_pta_ini}, if: "gw_pta_ini.present?"

#  validate  :gw_paridad, if: :new_paridad?
    
  def new_paridad?
    if :gw_paridad.present?
      self.errors.add(:base, :gw_paridad_error)
#    if !:gw_pta_ini.nil? && !:gw_pta_fin   
      #return true if :gw_pta_ini.odd && :gw_pta_fin.odd && :gw_paridad.upcase == 'P'
   # else
      end
    return false    
      end

  def build_geom_line

    if self.line and !self.line.to_s.empty?
      self.the_geom_segment = "LINESTRING(#{self.line})"
    end
  end
end
