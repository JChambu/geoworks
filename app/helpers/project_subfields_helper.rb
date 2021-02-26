module ProjectSubfieldsHelper
  def get_name_from_id id
    @query = ProjectSubfield
      .select(:name)
      .where(id: id)
      .first
  end
end
