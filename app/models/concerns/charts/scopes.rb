module Charts::Scopes
  extend ActiveSupport::Concern

  included do
    scope :ordered, -> { order :name }
  end
end
