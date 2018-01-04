module Geoworks
  class Shp

    def self.generate_directory directory_path
      xls_directory = [Rails.public_path.to_s, directory_path.to_s, Time.now.to_datetime.strftime("%d%m%Y%H%M%S")].join("/")
      FileUtils.mkdir_p(xls_directory)
      xls_directory
    end

    def self.save files, directory_path
      new_directory = generate_directory(directory_path)
      @files = files

      files.each do |a|
        @file_name = a.original_filename 
        new_file_path = new_directory + '/' + @file_name
        File.open(new_file_path, 'wb') do |f|
          f.write(a.read)
        end
      end
      [new_directory, @file_name]
    end
  end
end
