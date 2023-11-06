class PhotosChildrenController < ApplicationController

  def show_photos_children
    project_data_child_id = params[:project_data_child_id]

    child_photos = PhotoChild
      .where(project_data_child_id: project_data_child_id)
      .where(row_active: true)
      .order(gwm_created_at: :desc)

    child_photos_array = []
    child_photos.each do |c_photo|
      c_photo_hash = {}
      c_photo_hash['id'] = c_photo.id
      c_photo_hash['name'] = c_photo.name
      c_photo_hash['gwm_created_at'] = c_photo.gwm_created_at
      c_photo_hash['image'] = c_photo.image
      child_photos_array.push(c_photo_hash)
    end
    render json: child_photos_array
  end

  def get_photos_children
    ids = params[:ids]
    photos_all = []
    if !ids.nil?
      ids.each do | subproject_id |
        children_photos = PhotoChild
          .where(project_data_child_id: subproject_id)
          .where(row_active: true)
          .order(gwm_created_at: :desc)

        children_photos_array = []
        children_photos.each do |f_photo|
          f_photo_hash = {}
          f_photo_hash[subproject_id] = f_photo.image
          children_photos_array.push(f_photo_hash)
        end
        photos_all.push(children_photos_array)
      end
    end
    render json: photos_all
  end

  def save_child_photo
    base64_photo = params[:image]
    project_data_child_id = params[:project_data_child_id]
    photo_name = params[:photoChildName]
    base64_decode_photo = base64_photo.sub(/^data:image\/[a-z]+;base64,/, '')
    new_photo = PhotoChild.new(name: photo_name, image: base64_decode_photo, project_data_child_id: project_data_child_id, row_active: true)
    new_photo.save
  end

end
