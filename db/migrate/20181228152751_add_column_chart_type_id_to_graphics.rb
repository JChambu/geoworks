class AddColumnChartTypeIdToGraphics < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics, :chart_id, :integer
  end
end
