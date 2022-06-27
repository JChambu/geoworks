class CreateServiceApps < ActiveRecord::Migration[5.1]
  def self.up
    if !table_exists? :service_apps
      create_table :service_apps do |t|
        t.string :private_key
        t.string :public_key
        t.string :name

        t.timestamps
      end
      add_index :service_apps, :name, unique: true
    end
  end

  def self.down
    drop_table :service_apps if !table_exists?(:service_apps)
  end
end
