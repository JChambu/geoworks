module RolesHelper

  def roles_for_select
    @a = Role.all.map { |role|  [role.name, role.id]}
  end

end
