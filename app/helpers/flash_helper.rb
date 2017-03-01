module FlashHelper
  def flash_messages
    flash_messages = []
    flash.each do |type, message|
      next if message.blank? or type == :base_errors
      
      if type == :notice or type == :success
        type = :success
      elsif type == :alert or type == :error
        type = :error
        message = get_formatted_errors message, flash[:base_errors]
      else
        type = :info
      end

      text = content_tag(:div,
        content_tag(:button, raw("&times;"), :class => "close", "data-dismiss" => "alert") +
        message.to_s.html_safe, :class => "alert fade in alert-#{type}")
      flash_messages << text if message
    end
    flash_messages.join("\n").html_safe
  end

  def get_formatted_errors message, errors
    message = message.to_s
    return message unless errors
    message += "<ul><li>#{flash[:base_errors].join("</li><li>")}</li></ul>" if errors
    message
  end
end
