module Geoworks
  module Poi
  	module Download
      XLS_HEADER = [
        :poi_pvid,
        :num_registro,
        :poi_action,
        :facility_type_desc,
        :new_facility_type_desc,
        :subcategory,
        :new_subcategory,
        :poi_name,
        :new_poi_name_full_name,
        :street_name,
        :new_street_name,
        :street_type,
        :new_street_type,
        :house_number,
        :new_house_number,
        :country,
        :new_country,
        :departamento,
        :new_departamento,
        :provincia,
        :new_provincia,
        :comuna,
        :new_comuna,
        :chain_name,
        :new_chain_name,
        :chain_id,
        :new_chain_id,
        :food_type,
        :new_food_type,
        :phone_number,
        :new_phone_number,
        :email,
	      :new_email,
      	:web_page,
      	:new_web_page,
      	:contact_info,
        :new_contact_info,
        :postal_code,
        :new_postal_code,
        :date_inclusion,
        :date_updated,
        :latitude,
        :new_latitude,
        :longitude,
        :new_longitude,
        :notes,
        :priori
      ]

      def download pois, options = {}
        directory_path = "poi/download_xls"  
        file_name = "#{Time.now.strftime("%Y-%m-%d_%H.%M")}_pois"
        sheet_data = {:sheet => "Puntos", :data => []}
        load_xls_headers sheet_data[:data]
        load_pois_data sheet_data[:data], pois, options[:prefix]

        new_directory = Navarra::Xls.generate([sheet_data], directory_path,
          {:file_name => file_name})

        [new_directory, "#{file_name}.zip"].join("/")
      end

      def load_xls_headers sheet_data
        sheet_data << XLS_HEADER.map {|column| column.to_s}
      end

      def load_pois_data sheet_data, pois, prefix = nil
        pois.includes(:poi_type, :chain, :poi_status, :poi_sub_type, :food_type, :street_type,  city: { department: { province: :country}}).find_each do |poi|
          original_poi = poi.original_object
          
          
          row = []
          row << poi.old_identifier
          row << get_formatted_identifier(poi, prefix)
          row << get_poi_action(poi)

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.poi_type_name
          else
            row << ""
          end 
          row << poi.poi_type_name
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.poi_sub_type_name
          else
            row << ""
          end 
        
          row << poi.poi_sub_type_name
       

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.name
          else
            row << ""
          end 
          row << poi.name

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.street_name
          else
            row << ""
          end 
          row << poi.street_name
          

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.street_type_name
          else
            row << ""
          end 
          row << poi.street_type_name
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.house_number
          else
            row << ""
          end 
          row << poi.house_number
          

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.country_name
          else
            row << ""
          end 
          row << poi.country_name
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.department_name
          else
            row << ""
          end 
          row << poi.department_name
          

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.province_name
          else
            row << ""
          end 
          row << poi.province_name
          

          if (get_poi_action(poi)) != 'Add' 

          row << original_poi.city_name
          else
            row << ""
          end 
          row << poi.city_name
          

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.chain_name
          else
            row << ""
          end 
          row << poi.chain_name
          

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.chain_identifier
          else
            row << ""
          end 
          row << poi.chain_identifier
         
          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.food_type_name
          else
            row << ""
          end 
          row << poi.food_type_name
          

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.phone 
          else
            row << ""
          end 
	        row << poi.phone  
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.email 
          else
            row << ""
          end 
          row << poi.email
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.website
          else
            row << ""
          end 
          row << poi.website
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.contact
          else
            row << ""
          end 
          
          row << poi.contact
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.city_zip
          else
            row << ""
          end 
          row << poi.city_zip
          row << poi.created_at.strftime("%m/%d/%Y")
          row << get_control_date(poi)

          if (get_poi_action(poi)) != 'Add' 
          row << get_latitude(original_poi)
          else
            row << ""
          end 
          row << get_latitude(poi)

          if (get_poi_action(poi)) != 'Add' 
          row << get_longitude(original_poi)
          else
            row << ""
          end 
          row << get_longitude(poi)
          row << poi.note
          row << poi.priority
          
          sheet_data << row
        end
      end

      
       def deliveries pois
        pois.includes(:poi_type, :chain, :poi_status, :poi_sub_type, :food_type, :street_type,  city: { department: { province: :country}}).find_each do |poi|
          original_poi = poi.original_object
          
          row = []
          row << poi.old_identifier
          row << get_formatted_identifier(poi)
          row << get_poi_action(poi)

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.poi_type_name
          else
            row << ""
          end 
          row << poi.poi_type_name
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.poi_sub_type_name
          else
            row << ""
          end 
        
          row << poi.poi_sub_type_name
       

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.name
          else
            row << ""
          end 
          row << poi.name

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.street_name
          else
            row << ""
          end 
          row << poi.street_name
          

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.street_type_name
          else
            row << ""
          end 
          row << poi.street_type_name
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.house_number
          else
            row << ""
          end 
          row << poi.house_number
          

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.country_name
          else
            row << ""
          end 
          row << poi.country_name
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.department_name
          else
            row << ""
          end 
          row << poi.department_name
          

          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.province_name
          else
            row << ""
          end 
          row << poi.province_name
          

          if (get_poi_action(poi)) != 'Add' 

          row << original_poi.city_name
          else
            row << ""
          end 
          row << poi.city_name
          

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.chain_name
          else
            row << ""
          end 
          row << poi.chain_name
          

         
          if (get_poi_action(poi)) != 'Add' 
          
          row << original_poi.food_type_name
          else
            row << ""
          end 
          row << poi.food_type_name
          

          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.phone 
          else
            row << ""
          end 
	        row << poi.phone  
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.email 
          else
            row << ""
          end 
          row << poi.email
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.website
          else
            row << ""
          end 
          row << poi.website
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.contact
          else
            row << ""
          end 
          
          row << poi.contact
          
          if (get_poi_action(poi)) != 'Add' 
          row << original_poi.city_zip
          else
            row << ""
          end 
          row << poi.city_zip
          row << poi.created_at.strftime("%m/%d/%Y")
          row << get_control_date(poi)

          if (get_poi_action(poi)) != 'Add' 
          row << get_latitude(original_poi)
          else
            row << 0
          end 
          row << get_latitude(poi)

          if (get_poi_action(poi)) != 'Add' 
          row << get_longitude(original_poi)
          else
            row << 0
          end 
          row << get_longitude(poi)
          row << poi.note
          row << poi.priority
          
          sheet_data << row
        end

        @sheet_data = sheet_data
        

       end
      
      
      
      def validate_add(poi, type)

          if (get_poi_action(poi)) != 'Add' 
           original_poi.poi_type_name
          else
            'vacio'  
          end
      end



      def get_poi_action poi
        if poi.p_action.blank?
          'Sin Accion'
        else
          poi.p_action.name  
        end
      end

      def get_control_date poi
        return "" if poi.control_date.nil? or poi.control_date.to_s.empty?
        poi.control_date.strftime("%m/%d/%Y")
      end


      def get_latitude poi
        return "" if poi.the_geom.nil?
        poi.the_geom.y.to_d
      end

      def get_longitude poi
        return "" unless poi.the_geom
        poi.the_geom.x.to_d
      end

      def get_formatted_identifier poi, prefix=nil
        return "" if poi.identifier.nil? or poi.identifier.to_s.empty?
        return "#{prefix}#{poi.identifier}" if prefix
        poi.identifier
      end
  	end
  end
end
