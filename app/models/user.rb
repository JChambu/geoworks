class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  has_many :pois
  has_many :users
  has_many :verification_poi
  has_many :extended_listings

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable, :omniauthable,
  # :recoverable, :registerable, 
  devise :database_authenticatable, :rememberable, :trackable

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :email, :email_format => {:message => I18n.t("activerecord.errors.messages.invalid_email")}
  validates :role, presence: true
  validates :password, length: { minimum: 6 }, unless: "self.password.empty?"
  validate :is_role_valid?
  before_destroy :has_related_pois?

  ROLES = %w[User Admin Moderator]

  def self.user_role
    index = ROLES.find_index "User"
    return nil unless index
    ROLES[index]
  end

  def is? role
    role == self.role
  end

  def human_role
    I18n.t("roles.#{self.role.downcase}")
  end

  def some_identifier
    return self.name if self.name
    self.email
  end

  def has_related_pois?
    unless Poi.where(:user_id => self.id).count.zero?
      self.errors.add(:base, :related_pois)
      return false
    end
  end

  def is_role_valid?
    unless ROLES.include? self.role
      self.errors.add(:role, :invalid)
    end
  end


  def self.sorted_by_name
    self.order(:name)
  end

end
