module ApplicationHelper
	LEFT_SIDEBAR_COLUMNS = 3
	CONTENT_COLUMNS = 12

  def safe_action_name action
    return "action_#{action}"
  end

	def content_span_class
		columns = CONTENT_COLUMNS
		columns = CONTENT_COLUMNS - LEFT_SIDEBAR_COLUMNS if content_for? :left_sidebar
		"col-md-#{columns}"
	end

	def def left_sidebar_span_class
		"col-md-#{LEFT_SIDEBAR_COLUMNS}"
	end

	def nav_item label, path
		content_tag :li, link_to(t(label), path)
	end

	def nav_divider 
    "<li class='divider'></li>".html_safe
    
  end
	def nav_dropdown_item label
		return nav_item(label, "#") unless block_given?
		content_tag(:li, class: 'dropdown') do
			link_to(t(label), "#", class: 'dropdown-toggle', data: {toggle: 'dropdown'}) +

			content_tag(:ul, yield, class: 'dropdown-menu')
		end
	end

	def nav_subdropdown_item label
		return nav_item(label, "#") unless block_given?
		content_tag(:li, class: 'dropdown-submenu') do
			link_to(t(label), "#", class: 'dropdown-toggle', data: {toggle: 'dropdown'}) +
			content_tag(:ul, yield, class: 'dropdown-menu')
	end
	end
	def pager collection
		will_paginate collection,
			:previous_label => t("pager.previous"),
			:next_label => t("pager.next"),
			renderer: BootstrapPagination::Rails
	end

  def control_group control, attr = ''

    ctrl_group = "<div class='form-group'>"
    ctrl_group += "<label>#{attr}</label>"
    ctrl_group += "<div class='controls'>"
    ctrl_group += control 
    ctrl_group += "</div>"
    ctrl_group += "</div>"
    ctrl_group.html_safe
  end

  def order_link model_class, attr
  	return model_class.human_attribute_name(attr) unless @search
  	sort_link @search, attr, model_class.human_attribute_name(attr)
  end

  def yes_no_label boolean
    "<label class='#{boolean.to_s}-status'>#{t("#{boolean.to_s}_value")}</label>".html_safe
  end

  def table_action_button path, type, options = nil
    settings = {}
    settings[:class] = "ui-icon ui-icon-#{type.to_s}"

    if options
      settings[:class] = [settings[:class], options[:class]].join(" ") if options.has_key? :class
      settings[:title] = t(options[:title]) if options.has_key? :title
      settings[:method] = options[:method] if options.has_key? :method
      settings[:data] = {:confirm => options[:confirm]} if options.has_key? :confirm
    end

    "<td style=\"width: 20px;\">" +
    "<div class=\"ui-state-default ui-corner-all\">" +
    link_to('', path, settings) +
    "</div>" + 
    "</td>"
  end
end
