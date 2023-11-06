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

    photos_all = []
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
    render json: photos_all
  end

  def save_photos
    base64_photo = params[:image]
    project_id = params[:project_id]
    photo_name = params[:photoName]
    base64_decode_photo = base64_photo.sub(/^data:image\/[a-z]+;base64,/, '')
    new_photo = Photo.new(name: photo_name, image: base64_decode_photo, project_id: project_id, row_active: true)
    new_photo.save
  end

  private

  def photo_params
    params.require(:photo).permit(:name, :image, :project_id, :role, :password_confirmation)
  end

end
