class ProjectStatus < ApplicationRecord

  DEFAULT_NAME = 'Default'
  belongs_to :project_type, dependent: :destroy
  has_many :projects
  validates :name, :color, presence: true

  include RailsSortable::Model
  set_sortable :priority

  def self.default
    find_by(name: DEFAULT_NAME)
  end

  # Actualiza el priority del proyecto
  def update_priority! priority
    self.priority = priority
    save
  end
end
