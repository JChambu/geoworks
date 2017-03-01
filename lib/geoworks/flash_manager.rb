module Geoworks
  class FlashManager
  	attr_reader :resource, :flash

		def initialize resource = nil, flash = nil
    	@resource = get_formatted_resource resource
    	@flash = flash
    end

  	def method_missing(method_name, *args, &block)
  		if method_name.to_s.start_with?('to_') and method_name.size > 3
  			type = method_name[3..-1]
        message = args.first
  			return message_by_type type, message

  		elsif method_name.to_s.end_with?('_success') and method_name.size > 8
  			return to_notice(controller_message(method_name))
  		
  		elsif method_name.to_s.end_with?('_fail') and method_name.size > 5
        load_base_errors args
  			return to_alert(controller_message(method_name))
  		end

    	super
  	end

  	private

      def load_base_errors args
        begin
          base_errors = args.first.errors.messages[:base]
          load_flash(:base_errors, base_errors) unless base_errors.empty?
        rescue
          puts 'no general errors'
        end
      end

			def controller_message message
				if self.resource and !self.resource.empty?
					params = {resource: self.resource}
					message = "resource_#{message}"
				end

				I18n.t("flash_message.controller.#{message}", params)
			end

			def message_by_type type, message = ''
				load_flash type, message
				{type.to_sym => message}
			end

      def load_flash type, message
        flash[type.to_sym] = message if flash
      end

      def get_formatted_resource resource        
        begin
          model = resource.to_s.split("/").first.singularize.camelize.constantize
          return model.model_name.human(:count => 1)
        rescue
          resource
        end
      end
  end
end