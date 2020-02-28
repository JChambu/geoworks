class ProjectField < ApplicationRecord
 include RailsSortable::Model
 include ProjectFields::Scopes
   set_sortable :sort

  has_many :project_subfields, -> {order(:sort)}
  has_many :analytics_dashboards
  belongs_to :project_type
  belongs_to :field_type
   
  accepts_nested_attributes_for :project_subfields, allow_destroy: true
  before_create :key_name

  def key_name
    self.key = self.name.gsub(/\s+/, '_').gsub(/[^0-9A-Za-z\_]/,'').downcase
  end
end
