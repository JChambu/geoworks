class AddSideImageToCustomers < ActiveRecord::Migration[5.1]
  def change
    add_column :customers, :side_image, :text
  end
end
