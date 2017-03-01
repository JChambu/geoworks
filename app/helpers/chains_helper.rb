module ChainsHelper
  def chains_for_select
    Chain.sorted_by_name.map { |chain| [chain.name, chain.id] }
  end

  def poi_country_for_select
    Country.sorted_by_name.map { |poi_country| [poi_country.name, poi_country.id] }
  end

  def  label_chain chain 

      [chain.name, chain.alias].compact.join ' | '
  end

end
