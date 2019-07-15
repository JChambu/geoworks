module ChoiceListsHelper

  def choice_list_for_select
    ChoiceList.all.map {|list| [list.name, list.id]}
  end

end
