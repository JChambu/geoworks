class Permission < ApplicationRecord
  belongs_to :role
  belongs_to :event
  belongs_to :model_type
end
