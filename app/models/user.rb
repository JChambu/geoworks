class User < ApplicationRecord

  include Users::Scopes

  has_many :has_project_types
  has_many :project_types, through: :has_project_types
  has_many :user_customers
  has_many :customers, through: :user_customers
  has_many :project_filters, dependent: :destroy
  has_many :projects
  accepts_nested_attributes_for :user_customers, allow_destroy: true

  belongs_to :role

  # Include devise modules. Others available are:
  # :confirmable, :validatable :registerable, :timeoutable and :omniauthable
  devise :database_authenticatable, :rememberable, :trackable, :lockable, :confirmable, :recoverable

  before_create :generate_password, on: :create

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :email, :email_format => {:message => I18n.t("activerecord.errors.messages.invalid_email")}
  # validates :role, presence: true
  validates :password, length: { minimum: 6 }, unless: -> { !:password.blank? }
  validates :password, confirmation: {case_sensitive: true}
  # validate :is_role_valid?
  # before_destroy :has_related_pois?
  before_create :generate_token, on: :create

  attr_accessor :customer_id, :project

  ROLES = %w[User Admin Moderator]

  def generate_password
    if self.email != 'super@admin.com'
      self.password = Devise.friendly_token.first(8)
    end
  end

  def generate_token
      self.token = SecureRandom.base64(15)
      self.authentication_token =  SecureRandom.base64(15)
  end

  def is_active?
   return User.find(self.id).active
  end

  def exist_user_in_user_customers
    if !self.email == 'super@admin.com'
      current_tenant = Apartment::Tenant.current
      customer_id = Customer.where(subdomain: current_tenant).pluck(:id).first
      user_customer= UserCustomer.find_or_create_by(email: email, customer_id: customer_id, user_id: id)
    end
  end

  def active_for_authentication?
    super && is_active?
    super && is_validated?
  end

  def inactive_message
      is_active? ? :is_locked :  super
  end

  def is_validated?


    current_tenant = Apartment::Tenant.current
    @customer_id = Customer.where(subdomain: current_tenant)
    @user = UserCustomer.where(user_id: self.id, customer_id: @customer_id )
    return true if @user.present?
    return false
  end

  # def self.user_role
  #   index = ROLES.find_index "User"
  #   return nil unless index
  #   ROLES[index]
  # end

  # def is? role
  #   role == self.role
  # end

  def human_role
    #I18n.t("roles.#{self.role.downcase}")
  end

  def some_identifier
    return self.name if self.name
    self.email
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
