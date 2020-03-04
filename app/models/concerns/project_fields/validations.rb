module ProjectFields::Validations
  extend ActiveSupport::Concern

  included do
    before_validation :key_name, on: :create
    validates :name,  presence: true,
      length: { maximum: 255 },
      uniqueness: { scope: :project_type_id }
    validates :key,  presence: true,
      length: { maximum: 255 },
      uniqueness: { scope: :project_type_id }
    validates :field_type_id,  presence: true
  end

  private

  def key_name
    self.key = self.name.gsub(/\s+/, '_').gsub(/[^0-9A-Za-z\_]/,'').downcase
  end
end
