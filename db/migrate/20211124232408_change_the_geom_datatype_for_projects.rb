class ChangeTheGeomDatatypeForProjects < ActiveRecord::Migration[5.1]
  def change
    remove_column :projects, :the_geom, :point
    add_column    :projects, :the_geom, :geometry, :srid => 4326
  end
end
