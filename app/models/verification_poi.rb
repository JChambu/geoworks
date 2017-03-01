class VerificationPoi < ActiveRecord::Base


  belongs_to :user
  belongs_to :poi


  def self.create_verification(user_id, poi_id)


      @pois = poi_id

      @pois.each do |poi| 

      VerificationPoi.where( poi_id: poi).first_or_create do |verification|

        verification.user_id = user_id
        verification.poi_id = poi

        verification.save
      end
    end

  end

end
