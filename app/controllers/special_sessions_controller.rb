class SpecialSessionsController < ApplicationController
  skip_authorize_resource :only => [:special_user_session]
  skip_before_action :authenticate_user!, only: :special_user_session

  def special_user_session
    special_user = User.find_by(email: 'public@geoworks.com')
    if special_user
      sign_in(special_user)
      redirect_to root_path
    else
      redirect_to new_user_session_path, alert: "Usuario Especial no encontrado."
    end
  end
end
