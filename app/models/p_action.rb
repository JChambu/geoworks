class PAction < ActiveRecord::Base

  def self.sorted_by_name
    self.order(:name)
  end

  def human_name
    PAction.human_attribute_name self.name
  end


  PAction.all.each do |action|
    self.class.class_eval do
      method_name = action.name
       define_method method_name do
        PAction.find_by_name(action.name)
       end
    end
  end

end
