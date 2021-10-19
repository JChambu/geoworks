class UserMailer < ApplicationMailer

  def new_user(user)
    @user = user
    mail(to: user.email, subject: 'se ha dado de alta', from: 'asergiop21@gmail.com')
  end
  
  def edit_user(user)
    @user = user
    mail(to: user.email, subject: 'Se ha modificado su perfil', from: 'asergiop21@gmail.com')
  end
  
  def send_alert(to,name_corp,logo_corp,header_content,html_content,img_attach_src, plain_content)
    @to = to
    @name_corp = name_corp
    @header_content = header_content
    @html_content = html_content
    attachments.inline['logo.png'] = File.read("#{Rails.root}/app/assets/images/logo_gw_hor_2.png")
    attachments.inline['logo_corp.png'] = Base64.decode64(logo_corp)
    index_img = 0
    if !img_attach_src.nil?
      img_attach_src.each do |image|
        index_img +=1
        img_name = 'imagen'+index_img.to_s+'.png'
        attachments.inline[img_name] = Base64.decode64(image)
      end
    end  
    mail(to: to, subject: 'Alerta desde '+name_corp.to_s, from: 'asergiop21@gmail.com')
  end

end
