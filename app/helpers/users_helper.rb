module UsersHelper
  def roles_for_select
    User::ROLES.map { |role| [t("roles.#{role.downcase}"), role] }
  end

  def users_for_select
    User.sorted_by_name.map { |user| [user.some_identifier, user.id] }
  end
end
