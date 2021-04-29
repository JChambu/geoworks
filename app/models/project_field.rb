class ProjectField < ApplicationRecord
  include RailsSortable::Model
  include ProjectFields::Scopes
  include ProjectFields::Validations
  set_sortable :sort
  has_many :project_subfields, -> {order(:sort)}
  has_many :analytics_dashboards
  belongs_to :project_type
  belongs_to :field_type
  accepts_nested_attributes_for :project_subfields, allow_destroy: true
  end
