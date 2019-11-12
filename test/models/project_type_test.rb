require 'test_helper'

class ProjectTypeTest < ActiveSupport::TestCase

  test "Validate exist layer in geoserver" do
    name = 'rec7'
    current_tenant = 'geoworks'
    layer = ProjectType.get_layer_rgeoserver( name, current_tenant )
    assert layer[0] == true
  end

  test "Validate doesn't exist layer in geoserver" do
    name = 'rec10'
    current_tenant = 'geoworks'
    layer = ProjectType.get_layer_rgeoserver( name, current_tenant )
    assert layer[0] == false
  end

  test 'Validate name layer not exist in view and geoserver' do
    name = 'rec8'
    current_tenant = 'geoworks'
    layer = ProjectType.exist_layer_rgeoserver( name, current_tenant )
    assert layer[1] == "400"
  end

  test 'Validate and load name layer that only exist in view ' do
    # No existe en las vista ni en Geoserver
    name = 'test7'
    current_tenant = 'geoworks'
    layer = ProjectType.exist_layer_rgeoserver( name, current_tenant )
    assert layer[1] == "201"
  end
  
  test 'Validate and reload name layer exist in view and geoserver' do
    name = 'test7'
    current_tenant = 'geoworks'
    layer = ProjectType.exist_layer_rgeoserver( name, current_tenant )
    assert layer[1] == "200"
  end

end
