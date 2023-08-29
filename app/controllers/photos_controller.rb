class PhotosController < ApplicationController

    def show_photos
      project_id = params[:project_id]

      father_photos = Photo
        .where(project_id: project_id)
        .where(row_active: true)
        .order(gwm_created_at: :desc)

      father_photos_array = []

      father_photos.each do |f_photo|
        f_photo_hash = {}
        f_photo_hash['id'] = f_photo.id
        f_photo_hash['name'] = f_photo.name
        f_photo_hash['gwm_created_at'] = f_photo.gwm_created_at
        f_photo_hash['image'] = f_photo.image
        father_photos_array.push(f_photo_hash)
      end

      render json: father_photos_array

    end

    def get_photos
      ids = params[:ids]
      # ids_father = params[:ids_father]

      photos_all = []
      # photos_father_all = []

      if !ids.nil?
        ids.each do | project_id |
          father_photos = Photo
            .where(project_id: project_id)
            .where(row_active: true)
            .order(gwm_created_at: :desc)

          father_photos_array = []

          father_photos.each do |f_photo|
            f_photo_hash = {}
            f_photo_hash[project_id] = f_photo.image
            father_photos_array.push(f_photo_hash)
          end
          photos_all.push(father_photos_array)
        end
      end

      # if !ids_father.nil?
      #   ids_father.each do | project_id |
      #     byebug
      #     father_photos_grouped = Photo
      #       .where(project_id: project_id)
      #       .where(row_active: true)
      #       .order(gwm_created_at: :desc)
      #
      #     father_photos_grouped_array = []
      #
      #     father_photos_grouped.each do |f_photo|
      #       byebug
      #       f_photo_grouped_hash = {}
      #       f_photo_grouped_hash[project_id] = f_photo.image
      #       father_photos_grouped_array.push(f_photo_grouped_hash)
      #     end
      #     byebug
      #     photos_father_all.push(father_photos_grouped_array)
      #   end
      # end

      render json: { photos_all: photos_all }

    end

end
