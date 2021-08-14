class PhotosChildrenController < ApplicationController

  def show_photos_children

    project_data_child_id = params[:project_data_child_id]

    child_photos = PhotoChild
      .where(project_data_child_id: project_data_child_id)
      .where(row_active: true)

    child_photos_array = []
    child_photos.each do |c_photo|
      c_photo_hash = {}
      c_photo_hash['id'] = c_photo.id
      c_photo_hash['name'] = c_photo.name
      c_photo_hash['image'] = c_photo.image
      child_photos_array.push(c_photo_hash)
    end

    render json: child_photos_array

  end

end
