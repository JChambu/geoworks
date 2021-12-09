class FieldType < ApplicationRecord
  TEXT = 1
  SINGLE_LIST = 2
  DATE = 3
  BOOLEAN = 4
  NUMERIC = 5
  SUBFORM = 7
  MULT_LIST = 10
  SUBTITLE = 11
  has_many :project_fields
end
