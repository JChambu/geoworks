module Navarra
  module Exceptions
    class FlashManagerError < Exception; end

    class XlsError < Exception; end

    class XlsFieldsError < XlsError
      attr :errors

      def initialize(errors)
        super("fields with errors")
        @errors = errors
      end
    end

    class PoiLoadError < XlsError; end
    class XlsNoFileError < XlsError; end
    class InvalidXlsFileError < XlsError; end
  end
end