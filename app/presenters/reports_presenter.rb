class ReportsPresenter
  def poi_totals_by_country filtered_pois
    general = 0

    totals = Country.sorted_by_name.inject([]) do |result, country|
      total_gis = filtered_pois.all_gisworking.by_country(country.id).where('p_action_id < ?', 5 ).count
      total_navteq = filtered_pois.all_navteq.by_country(country.id).where('p_action_id < ?', 5 ).count
      total_by_country = (total_gis.to_i + total_navteq.to_i)
      general += total_by_country

      result << {
        :country => country.name,
        :gisworking => total_gis,
        :navteq => total_navteq,
        :total => total_by_country
      }
    end

    [general, totals]
  end

  def poi_totals_by_poi_type filtered_pois
    general = 0

    totals = PoiType.sorted_by_name.inject([]) do |result, poi_type|
      total_by_type = filtered_pois.where('poi_type_id = ? and  p_action_id < ? ', poi_type.id, 5 ).count
      if total_by_type.zero?
        result << nil
      else
        general += total_by_type

        result << {
          :poi_type => poi_type.name,
          :total => total_by_type
        }
      end
    end

    [general, totals.compact]
  end

  def user_totals_by_country filtered_pois
    Country.sorted_by_name.inject([]) do |result, country|
      country_total = 0
      gis_by_country = filtered_pois.all_gisworking.by_country(country.id)
      navteq_by_country = filtered_pois.all_navteq.by_country(country.id)

      source_data = [
        {:source => PoiSource.navteq.name, :total => navteq_by_country.count, :user_data => []},
        {:source => PoiSource.gisworking.name, :total => gis_by_country.count, :user_data => []}        
      ]

      User.all.each do |user|
        source_data.first[:user_data] << {
          :user => user.some_identifier,
          :total => navteq_by_country.where('user_id = ? and p_action_id < ?', user.id, 5 ).count
        }
        
        source_data.last[:user_data] << {
          :user => user.some_identifier,
          :total => gis_by_country.where('user_id = ? and p_action_id < ?', user.id, 5).count 
        }
      end

      result << {
        :country => country.name,
        :source_data => source_data        
      }
    end
  end

def user_totals_by_users filtered_pois

	User.sorted_by_name.inject([]) do |result, user|
		user_total = 0
		gis_by_user = filtered_pois.all_gisworking.by_user(user.id)
		navteq_by_user = filtered_pois.all_navteq.by_user(user.id)


      source_data = [
        {:source => PoiSource.navteq.name, :total => navteq_by_user.count, :user_data => []},
        {:source => PoiSource.gisworking.name, :total => gis_by_user.count, :user_data => []}        
      ]

      Country.all.each do |county|
        source_data.first[:user_data] << {
          :county => county.name,
          :total => navteq_by_user.by_country(county.id).where('p_action_id < ?' , 5).count
        }
        
        source_data.last[:user_data] << {
          :county => county.name,
          :total => gis_by_user.by_country(county.id).where('p_action_id < ?' , 5).count
        }
      end

      result << {
        :user => user.name,
        :source_data => source_data        
      }

	end
end
end
