class AddColumnTheGeomToProjects < ActiveRecord::Migration[5.0]
  def change

    add_column :projects, :the_geom, :point, srid: 4326
  end
end
