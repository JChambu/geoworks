module ProjectTypes::Validations
  extend ActiveSupport::Concern
  
  include do
    validates :name,  presence: true,
              uniqueness: { case_sensitive: false },
              length: { maximum: 255 }
  end
end
