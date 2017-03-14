class PAction < ActiveRecord::Base

  def self.sorted_by_name
    self.order(:name)
  end

  def human_name
    PAction.human_attribute_name self.name
  end

def name_action name
        PAction.find_by(name: name)
end
end
