module ProjectTypes::Validations
  extend ActiveSupport::Concern

  included do
    validates :name,  presence: true,
              uniqueness: { case_sensitive: false },
              length: { maximum: 255 }
    validates :type_geometry, presence: true
    validates :geo_restriction, exclusion: { in: [nil] }
    validates :notification_email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  end

end
