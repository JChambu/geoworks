module UsersHelper
  def roles_for_select
    Role.sorted_by_name { |role| [role.name, role.id] }
  end

  def users_for_select
    User.sorted_by_name.map { |user| [user.some_identifier, user.id] }
  end

  def users_for_select_share_projects
    current_tenant = Apartment::Tenant.current
    customer_id = Customer.find_by(name: current_tenant)
    User.joins(:user_customers).
        where(user_customers:{customer_id: customer_id}).
        where.not(id: HasProjectType.select(:user_id).
        where(project_type_id: params[:project_type_id])).sorted_by_name.map  { |user|
      [user.some_identifier, user.id] }
  end 

  def users_for_select_unshare_projects
    current_tenant = Apartment::Tenant.current
    customer_id = Customer.find_by(name: current_tenant)
    User.joins(:user_customers).
      where(user_customers:{customer_id: customer_id}).
      where(id: HasProjectType.select(:user_id).where(project_type_id: params[:project_type_id])).sorted_by_name.map  { |user|
      [user.some_identifier, user.id] }
  end 
end
