class AppConfiguration < ActiveRecord::Base
	before_destroy :validate_configuration_existance
  validates :gisworking_initial_identifier, :numericality => {:greater_than_or_equal_to => 0}

  def validate_configuration_existance
    if AppConfiguration.all.size == 1
      self.errors.add(:base, :al_least_one_configuration)
      return false
    end
  end
end
