class ProjectFilter < ApplicationRecord
  belongs_to :user
  belongs_to :project_type
end
