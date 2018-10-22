module ExtendedListingsHelper

  def users_for_select
    User.sorted_by_name.map { |user| [user.name, user.id] }
  end

  def categories_for_select
    PoiType.sorted_by_name.map { |category| [category.name, category.id] }
  end
end
