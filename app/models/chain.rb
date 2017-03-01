class Chain < ApplicationRecord
  def self.sorted_by_name
    self.order(:name)
  end
end
