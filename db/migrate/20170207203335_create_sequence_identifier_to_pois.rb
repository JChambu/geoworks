class CreateSequenceIdentifierToPois < ActiveRecord::Migration[5.0]
  def change
      
   # execute <<-SQL 
   #     CREATE SEQUENCE seq_identifier; 
   #     ALTER TABLE pois ALTER COLUMN identifier SET DEFAULT nextval('seq_identifier');  
   #   SQL
  end
end
