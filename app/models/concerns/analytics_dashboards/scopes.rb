module AnalyticsDashboards::Scopes
  extend ActiveSupport::Concern

  included do
    scope :ordered, -> { order :title }
  end
end
