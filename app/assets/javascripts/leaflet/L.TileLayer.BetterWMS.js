L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

  onAdd: function (map) {
    //Triggered when the layer is added to a map.
      //   Register a click listener, then do all the upstream WMS things
      L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on('click', this.getFeatureInfo, this);
  },

  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfo, this);
  },

  getFeatureInfo: function (evt) {
    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
      showResults = L.Util.bind(this.showGetFeatureInfo, this);
    $.ajax({
      url: url,
      success: function (data, status, xhr) {
        var err = typeof data === 'string' ? null : data;
        showResults(err, evt.latlng, data);
      },
      error: function (xhr, status, error) {
        showResults(error);  
      }
    });
  },

  getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
      size = this._map.getSize(),

      params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: 'poi_new',
        transparent: this.wmsParams.transparent,
        version: this.wmsParams.version,      
        format: this.wmsParams.format,
        bbox: this._map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        layers: this.wmsParams.layers,
        query_layers: this.wmsParams.layers,
        INFO_FORMAT: 'application/json',
        format_options: 'callback:getJson'
      };

    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

    // return this._url + L.Util.getParamString(params, this._url, true);

    var url = this._url + L.Util.getParamString(params, this._url, true);


    /**
     * CORS workaround (using a basic php proxy)
     * 
     * Added 2 new options:
     *  - proxy
     *  - proxyParamName
     * 
     */

    // check if "proxy" option is defined (PS: path and file name)
    if(typeof this.wmsParams.proxy !== "undefined") {

      // check if proxyParamName is defined (instead, use default value)
      if(typeof this.wmsParams.proxyParamName !== "undefined")
        this.wmsParams.proxyParamName = 'url';

      // build proxy (es: "proxy.php?url=" )
      _proxy = this.wmsParams.proxy + '?' + this.wmsParams.proxyParamName + '=';

      url = _proxy + encodeURIComponent(url);

    } 

    return url;

  },

  showGetFeatureInfo: function (err, latlng, info) {
        name_layer = Navarra.dashboards.config.name_layer;
        draw_disabled = Navarra.dashboards.config.draw_disabled;
        if (draw_disabled){

          var cc = info;
          var mymap = this._map;
          if (cc['features'].length > 0){ 
            var prop = cc['features'][0]['properties'];
            project_name_feature = cc['features'][0]['id'];
            project_name = project_name_feature.split('.fid')[0];
            var z = document.createElement('p'); // is a node
            var x = []
            var count = 1;
            var project_id = cc['features'][0]['properties']['id'];
            var data_id = Navarra.dashboards.config.project_type_id;
            if (name_layer == project_name){
              $.ajax({
                type: 'GET',
                url: '/project_fields/field_popup.json',
                datatype: 'json',
                data: {
                  project_type_id: data_id
                },
                success: function(data) {
                  $.each(data, function(i, value) {
                    // Reemplaza los guiones bajos del label por espacios
                    var label = value.toString().replace('_',' ');
                    // Pone la primer letra en mayúscula
                    label = label.charAt(0).toUpperCase() + label.slice(1)
                    var val = prop[value]
                    // Valida si el valor no es nulo
                    if (val != null && val != 'null' ) {
                      // Elimina los corchetes y comillas del valor (en caso que contenga)
                      val = val.toString().replace('/\[|\]|\"','');
                    }
                    x.push('<b>' + label + ': </b> ' + val);
                  });
                  z.innerHTML = x.join(" <br>");
                  inn = document.body.appendChild(z);
                  checked = $('#select').hasClass('active');

                  if (draw_disabled) {
                    L.popup()
                      .setLatLng(latlng)
                      .setContent(inn)
                      .openOn(mymap);
                  }
                } // Cierra success
              }); // Cierra ajax
            } // Cierra if
          } // Cierra if
        } // Cierra if
  }
  
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);  
};
