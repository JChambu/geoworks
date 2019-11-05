class UserMailer < ApplicationMailer

  def new_user(user)
    @user = user
    mail(to: user.email, subject: 'se ha dado de alta', from: 'asergiop21@gmail.com')
  end
  
  def edit_user(user)
    @user = user
    mail(to: user.email, subject: 'Se ha modificado su perfil', from: 'asergiop21@gmail.com')
  end
  


end
