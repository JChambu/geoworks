module CategoriesHelper
  def categories_for_select
      Category.sorted_by_name.map {|category| [category.name, category.id]}
  end
end
