class PhotosController < ApplicationController

    def show_photos

      project_id = params[:project_id]

      father_photos = Photo
        .where(project_id: project_id)
        .where(row_active: true)

      father_photos_array = []

      father_photos.each do |f_photo|
        f_photo_hash = {}
        f_photo_hash['id'] = f_photo.id
        f_photo_hash['name'] = f_photo.name
        f_photo_hash['image'] = f_photo.image
        father_photos_array.push(f_photo_hash)
      end

      render json: father_photos_array

    end

end
