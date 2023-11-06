module ProjectSubfieldsHelper
  def get_name_from_id id
    @query = ProjectSubfield
      .select(:name)
      .where(id: id)
      .first
  end

  def get_field_id_from_id id
    @query = ProjectSubfield
      .select(:project_field_id)
      .where(id: id)
      .first
  end
end
