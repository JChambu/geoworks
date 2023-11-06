Navarra.namespace("geomap_tools");
Navarra.geomap_tools = function() {

	function get_style_geoserver(type_geometry){
		switch (type_geometry) {
      case 'Point':
        style = 'poi_new';
        break;
      case 'Polygon':
        style = 'polygon_new';
        break;
      case 'LineString':
        style = 'line_new';
        break;  
      default:
        style = 'poi_new';
    }
    return style;
	}

	function get_style_geoserver_selected(type_geometry){
		switch (type_geometry) {
      case 'Point':
        style = 'poi_new_selected';
        break;
      case 'Polygon':
        style = 'polygon_new_selected';
        break;
      case 'LineString':
        style = 'line_new_selected';
        break;  
      default:
        style = 'poi_new_selected';
    }
    return style;
	}

	function get_geometry_draw(geometry_draw_array){
		let geometry_draw = "MULTIPOLYGON(";
    for (xx = 0; xx < geometry_draw_array.length; xx++) {
      if (xx > 0) {
        geometry_draw += ",((";
      } else {
        geometry_draw += "((";
      }
      for (x = 0; x < geometry_draw_array[xx].length; x++) {
        if (x > 0) {
          geometry_draw += " , ";
        }
        geometry_draw += geometry_draw_array[xx][x][0] + " " + geometry_draw_array[xx][x][1];
      }
      geometry_draw += "))";
    }
    geometry_draw += ")";

    return geometry_draw;
	}

  return {
    get_style_geoserver: get_style_geoserver,
    get_style_geoserver_selected: get_style_geoserver_selected,
    get_geometry_draw: get_geometry_draw
	}

}();