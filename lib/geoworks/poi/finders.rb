module Geoworks
	module Poi
		module Finders
		require 'date'
      def name_like term, limit = nil
				q = self.where("name ILIKE ?", "%#{term}%")
				q = q.limit(limit) if limit
				q
			end

			def to_deliver
				self.not_deleted.validated.active.month_back.not_info
			end

      def not_info
        self.where('p_action_id < ?', 5)
      end
      
      
      def not_duplicated
				self.where(:duplicated_identifier => nil)
			end

			def not_deleted
				self.where(:deleted => [false, nil])
			end

			def validated
				self.where(:poi_status_id => PoiStatus.validated.id)
			end
  
      def month_back
          self.where('control_date > ?',  Date.today - 180.days)
      end

			def active
				self.where(:active => true)
			end

			def sorted_by_name
				self.order(:name)
			end

			def all_gisworking
				self.where(:poi_source_id => PoiSource.gisworking.id).order(:id)
			end

			def all_navteq
				self.where(:poi_source_id => PoiSource.navteq.id).order(:id)
			end

			def by_country country_id
				self.joins(:city => {:department => :province}).
					where(["provinces.country_id = ?", country_id])
			end

			def by_user user_id

				self.where(user_id: user_id)
			end

			def find_possible_duplicates attributes
				q = self.scoped

				if attributes[:name].present?
					dictionary_terms = Term.by_names(attributes[:name].downcase.split).pluck(:name)
					terms = attributes[:name].downcase.split - dictionary_terms
					regex_str = String.new
					regex_str += "(\ |^)" + terms.join("(\ |$)|(\ |^)") + "(\ |$)|" unless terms.empty?
					regex_str += "^#{attributes[:name]}$"
					q = q.where("pois.name ~* '#{regex_str}'")
					q = q.where(:poi_type_id => attributes[:poi_type_id]) if attributes[:poi_type_id].present?
					q = q.where(:food_type_id => attributes[:food_type_id]) if attributes[:food_type_id].present?
					q = q.where(:chain_id => attributes[:chain_id]) if attributes[:chain_id].present?
					if attributes[:email].present?
						q = q.where(:email => [attributes[:email], attributes[:second_email]])
					end
					q = q.where('pois.street_name ilike ?', "%#{attributes[:street_name]}%") if attributes[:street_name].present?
					q = q.where(:website => attributes[:website]) if attributes[:website].present?
					q = q.where(:city_id => attributes[:city_id]) if attributes[:city_id].present?
					pois = q.all.sort! do |a,b|
						(b.name.downcase.split & attributes[:name].downcase.split ).count <=> (a.name.downcase.split & attributes[:name].downcase.split ).count
					end
					return pois.first(5)
				end
				return nil
			end


			def duplicated_pois

				duplicated_hashes = self.not_duplicated.distinct.group(:identifier_hash).
					select([:identifier_hash]).having("count(*) > 1").
					pluck(:identifier_hash)

        
				duplicated_pois = []
				self.to_deliver.distinct.select([:identifier_hash]).each do |poi|
          next if !duplicated_hashes.include?(poi.identifier_hash)
					self.where(:identifier_hash => poi.identifier_hash).each do |duplicated_poi|

              
              duplicated_pois <<  duplicated_poi
					end
				end
				duplicated_pois
			end
		end
	end
end
