module Geoworks
  class Xls
    require 'fileutils'
    require 'spreadsheet'

    def self.generate data, directory_path, options = nil
      load_default_values options
      file_dir_path = generate_directory(directory_path)
      file_name = options[:file_name] + ".xls"
      file_path = file_dir_path + "/" + file_name

      book = Spreadsheet::Workbook.new
      data.each_with_index do |sheet_data, index|
        book.create_worksheet :name => sheet_data[:sheet]
        sheet_data[:data].each_with_index do |row, row_number|
          book.worksheet(index).insert_row(row_number, row)
        end
        autofit_cells_size book.worksheet(index)
      end

      book.write(file_path)

      compress(file_dir_path, options[:file_name])
      file_dir_path
    end

    def self.autofit_cells_size worksheet
      (0...worksheet.column_count).each do |col|
        width = 1
        row = 0
        worksheet.column(col).each do |cell|
          if cell.nil? or cell.to_s.empty?
            w = 1
          else
            w = cell.to_s.strip.split('').count + 3
          end
          ratio = worksheet.row(row).format(col).font.size/10

          w = (w*ratio).round
          width = w if w > width
          row += 1
        end
        worksheet.column(col).width = width
      end
    end

    def self.read file_path
      Spreadsheet.open(file_path) do |book|
        book.worksheets.each do |ws|
          0.upto ws.last_row_index do |index|
            row = ws.row(index)            
            yield ws, row
          end
        end
      end
    end

    def self.validate_file_to_read file
      raise Geoworks::Exceptions::XlsNoFileError unless file



      if (file.content_type != "application/xls" and  file.content_type != "application/vnd.ms-excel")
        raise Geoworks::Exceptions::InvalidXlsFileError
      end
    end

    def self.load_default_values options
      options = {} if options.nil?
      options[:file_name] = "file" unless options.has_key? :file_name
    end

    def self.dir_exist? path
     # File.exists?(path) and 
      File.directory?(path)
      #File.dirname path
    end

    def self.generate_directory directory_path
     
      xls_directory = [Rails.public_path.to_s, directory_path.to_s, Time.now.to_datetime.strftime("%d%m%Y%H%M%S")].join("/")
      FileUtils.mkdir_p(xls_directory)
      xls_directory
    end

    def self.save file, directory_path, file_name
      validate_file_to_read file
      file_name = file.original_filename unless file_name
      new_directory = generate_directory(directory_path)
      new_file_path = new_directory + '/' + file_name
      File.open(new_file_path, 'wb') do |f|
        f.write(file.read)
      end
      new_directory
    end

    def self.compress(path, file_name)
      path.sub!(%r[/$], '')
      archive = File.join(path, File.basename(file_name)) + '.zip'
      FileUtils.rm archive, :force => true

      Zip::ZipFile.open(archive, 'w') do |zip_file|
        Dir["#{path}/**/**"].each do |file|
          if file == path + '/' + file_name + '.xls'
            zip_file.add(file.sub(path + '/', ''), file)
          end
        end
      end

      archive
    end
  end
end
