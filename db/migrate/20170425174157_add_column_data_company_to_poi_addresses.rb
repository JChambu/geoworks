class AddColumnDataCompanyToPoiAddresses < ActiveRecord::Migration[5.0]
  def change
        add_column :poi_addresses, :name_company, :string
        add_column :poi_addresses, :phone_company, :string
      
  end
end
