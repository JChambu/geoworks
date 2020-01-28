class ProjectStatus < ApplicationRecord
  belongs_to :project_type, dependent: :destroy
  has_many :projects
  validates :name, :color, presence: true
end
