class ProjectStatus < ApplicationRecord
  belongs_to :project_type, dependent: :destroy
  validates :name, :color, presence: true
end
