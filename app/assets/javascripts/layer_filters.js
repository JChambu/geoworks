Navarra.namespace("layer_filters");
Navarra.layer_filters = function() {
	function init(layer, label_layer){
		var new_item =
        '<div>'+
          '<a class="dropdown-item" href="#">'+
            '<div class="d-inline mr-3">'+
            	'<div class="custom-control custom-checkbox" >'+
            		'<input class="custom-control-input" onchange="select_layer()" id="checkbox_'+layer+'" type="checkbox" name="radio_mapabase">'+
            		'<label id="checkboxlabel_'+layer+'" class="string optional control-label custom-control-label" for="checkbox_'+layer+'"> </label>'+
            	'</div>'+
            	'<label for=mapa_base1>'+label_layer+'</label>'+
            '</div>'+
            '<i class="fas fa-chevron-down float-right" onclick="Navarra.layer_filters.openlayer(event)" namelayer="'+layer+'"></i>'+
            '<div class="pl-4 d-none" style="width:33vw" id="div_filter_'+layer+'">'+
            	'<div class="custom-control custom-switch">'+
            		'<input type="checkbox" id="switch_'+layer+'" class="custom-control-input layer_filter_switch" onchange="switch_filtered_layer()">'+
            		'<label id="switchlabel_'+layer+'" class="custom-control-label custom-role-colour" for="switch_'+layer+'">Interceptar Capa Activa</label>'+
            	'</div>'+
            	'<div class="pt-2">'+
            		'<p class="m-0">Filtros</p>'+
            		'<div style="max-width:500px; white-space:normal" id="active_filter_container_'+layer+'"></div>'+
	            	'<div class="form-row">'+
				    	'<div class="col-md-4">'+
      						'<select namelayer="'+layer+'" id="filter_field_layer_'+layer+'" class="form-control form-control-sm" onchange="Navarra.layer_filters.change_filter_field(event)">'+
      						'</select>'+
						'</div>'+
      					'<div class="col-md-2">'+
        					'<select name="" id="filter_operator_layer_'+layer+'" class="form-control form-control-sm">'+
							'</select>'+
      					'</div>'+
      					'<div class="col-md-4">'+
      						'<input type="text" class="form-control form-control-sm" id="filter_value_layer_'+layer+'">'+
        					'<select namelayer="'+layer+'" class="d-none form-control form-control-sm" id="filter_value_layer_select_'+layer+'" onchange="Navarra.layer_filters.change_filter_value(event)">'+
        					'</select>'+
      					'</div>'+
      					'<div class="col-md-2">'+
      						'<i namelayer="'+layer+'" id="set_values_layer_icon'+layer+'" class="fas fa-list mr-2" style="font-size: 1.2em ; cursor:pointer; " onclick="Navarra.layer_filters.set_values_layer(event)"></i>'+
      						'<i namelayer="'+layer+'" class="fas fa-check-circle" style="font-size: 1.5em ; cursor:pointer; " onclick="Navarra.layer_filters.set_filter_layer(event)"></i>'+
      					'</div>'+
      				'</div>'+
	            '</div>'+
            	'<div class="pt-2">'+
            		'<p class="m-0">Rango Temporal</p>'+
            		'<div class="form-row mb-2">'+
            			'<div class="col-md-4 static_datetimepicker">'+
		            		'<input class="form-control form-control-sm layer_time_slider" type="text" id="fromdate_layer_'+layer+'" style="cursor:pointer">'+
		            	'</div>'+
		            	'<div class="col-md-4 static_datetimepicker">'+
		            		'<input class="form-control form-control-sm layer_time_slider" type="text" id="todate_layer_'+layer+'" style="cursor:pointer">'+
		            	'</div>'+
		            	'<div class="col-md-3">'+
		            		'<i namelayer="'+layer+'" class="fas fa-calendar-check" style="font-size: 1.5em ; cursor:pointer; " onclick="Navarra.layer_filters.set_timeslider_layer(event)"></i>'+
		            		'<i namelayer="'+layer+'" class="fas fa-calendar-times ml-2" style="font-size: 1.5em ; cursor:pointer; " onclick="Navarra.layer_filters.remove_timeslider_layer(event)"></i>'+
      					'</div>'+
		            '</div>'+
    			'</div>'+
            '</div>'+            
            '</a>'+
            '</div>';
        return new_item;
	}
	function openlayer(event){
		var namelayer = $(event.target).attr("namelayer");
		if($('#div_filter_'+namelayer).hasClass('d-none')){
			$('#div_filter_'+namelayer).removeClass('d-none');
			if(!$('#div_filter_'+namelayer).hasClass('already_open')){
				//Busca campos de la capa
				$.ajax({
    				type: 'GET',
    				url: '/project_fields/get_project_field_layer.json',
	                datatype: 'json',
    				data: {
      					name_layer:namelayer
    			},
    				success: function(data) {
    					data.forEach(function(field){
    						$('#filter_field_layer_'+namelayer).append('<option value="'+field.key+'">'+field.name+'</option>')
    					})
    				}
    			});
    			//Busca operadores
				$.ajax({
    				type: 'GET',
    				url: '/project_fields/get_filter_operator.json',
	                datatype: 'json',
    				data: {
      					name_layer:namelayer
    			},
    				success: function(data) {console.log(data)
    					data.forEach(function(operator){
    						$('#filter_operator_layer_'+namelayer).append('<option value="'+operator+'">'+operator+'</option>')
    					})
    				}
    			});
			}
			$('#div_filter_'+namelayer).addClass('already_open');
		} else {
			$('#div_filter_'+namelayer).addClass('d-none');
		}
	}

	function setdate_time_picker(){
		$('.layer_time_slider').datetimepicker({
        format: "DD/MM/YYYY",
        viewMode: "days",
        locale: moment.locale('en', {
          week: {
            dow: 1,
            doy: 4
          }
        }),
      });
	}

	function set_timeslider_layer(e){
		var namelayer = $(event.target).attr("namelayer");
		var fromdate_layer = $('#fromdate_layer_'+namelayer).val();
		var todate_layer = $('#todate_layer_'+namelayer).val();
		if(fromdate_layer=='' || todate_layer == ''){
			$('#text_toast').html("Las fechas no son válidas");
		    $('#toast').toast('show');
		}
		else{
			Navarra.project_types.config.timeslider_layers[namelayer] = {
				from_date: fromdate_layer.split('/')[2] + '-' + fromdate_layer.split('/')[1] + '-' + fromdate_layer.split('/')[0],
				to_date: todate_layer.split('/')[2] + '-' + todate_layer.split('/')[1] + '-' + todate_layer.split('/')[0]
			}
			Navarra.geomaps.layers_internal();
			Navarra.geomaps.show_kpis();
		}
	}
	
	function remove_timeslider_layer(e){
		var namelayer = $(event.target).attr("namelayer");
		$('#fromdate_layer_'+namelayer).val("");
		$('#todate_layer_'+namelayer).val("");
		Navarra.project_types.config.timeslider_layers[namelayer] = {
			from_date: '',
			to_date: ''
		}
		Navarra.geomaps.layers_internal();
		Navarra.geomaps.show_kpis();
	}

	function set_filter_layer(e){
		var namelayer = $(event.target).attr("namelayer");
		var filter_field_layer = $('#filter_field_layer_'+namelayer).val();
		var filter_field_layer_name = $('#filter_field_layer_'+namelayer +' :selected').text();
		var filter_operator_layer = $('#filter_operator_layer_'+namelayer).val();
		var filter_value_layer = $('#filter_value_layer_'+namelayer).val();
		// crea el view con el filtro
		var filter_view_layer = filter_field_layer_name + " " + filter_operator_layer+ " " + filter_value_layer;
		var new_active_filter = '<div class="d-inline message text-light chart-bg-transparent px-2 mb-1 py-1 rounded border border-dark shadow" style="white-space:nowrap">'+
      					'<p class="m-0 d-inline" style="font-size:0.9em">'+filter_view_layer+'</p>'+
        				'<button type="button" namelayer="'+namelayer+'" class="close d-inline float-none ml-2" onclick="Navarra.layer_filters.delete_filter_layer(event)">×</button>'+
      					'</div>'
		$('#active_filter_container_'+namelayer).append(new_active_filter);
		$('#active_filter_container_'+namelayer).addClass('mb-2');
		
		//setea la variable global
		if(Navarra.project_types.config.filters_layers[namelayer]==undefined){
			Navarra.project_types.config.filters_layers[namelayer] = [];
		}
		Navarra.project_types.config.filters_layers[namelayer].push({
			filter_field: filter_field_layer,
			filter_operator: filter_operator_layer,
			filter_value: filter_value_layer
		})
		Navarra.geomaps.layers_internal();
		Navarra.geomaps.show_kpis();
	}

	function delete_filter_layer(e){
		var index = $(event.target).parent().index();
		var namelayer = $(event.target).attr("namelayer");
		Navarra.project_types.config.filters_layers[namelayer].splice(index,1);
		var index = $(event.target).parent().remove();
		if(Navarra.project_types.config.filters_layers[namelayer].length==0){
			$('#active_filter_container_'+namelayer).removeClass('mb-2');
		}
		Navarra.geomaps.layers_internal();
		Navarra.geomaps.show_kpis();
	}

	function set_values_layer(e,layer){
		if(e==null){
			var namelayer = layer;
		} else {
			var namelayer = $(event.target).attr("namelayer");
		}
		if($('#filter_value_layer_select_'+namelayer).hasClass('d-none') || e==null){
			$('#filter_value_layer_select_'+namelayer).empty();
			$('#filter_value_layer_select_'+namelayer).append('<option></option>')
			$('#filter_value_layer_select_'+namelayer).removeClass('d-none');
			$('#filter_value_layer_'+namelayer).addClass('d-none');
			var filter_field_layer = $('#filter_field_layer_'+namelayer).val();
			//Busca valores para filtro de la capa
				$.ajax({
    				type: 'GET',
    				url: "/projects/search_data.json",
      				data: {
        			table: "Formularios",
        			project_field_key: filter_field_layer,
        			name_layer: namelayer
      			},
    			success: function(data) {
    				$.each(data['data'][0]['values'], function(value, a) {
    					value_text = a.p_name;
    					if(value_text!=null){
    						value_text = value_text.replace(/[\[\]\"]/g, "");
    					}
    					$('#filter_value_layer_select_'+namelayer).append('<option value="'+a.p_name+'">'+value_text+'</option>')
    				});
    			}
    			});
		} else {
			$('#filter_value_layer_select_'+namelayer).addClass('d-none');
			$('#filter_value_layer_'+namelayer).removeClass('d-none');
		}
	}

	function change_filter_field(e){
		var namelayer = $(event.target).attr("namelayer");
		if(!$('#filter_value_layer_select_'+namelayer).hasClass('d-none')){
			set_values_layer(null,namelayer);
		};
	}

	function change_filter_value(e){
		var namelayer = $(event.target).attr("namelayer");
		var value_selected = $(event.target).val(); 
		$('#filter_value_layer_'+namelayer).val(value_selected);
	}

	return {
    init: init,
    openlayer: openlayer,
    setdate_time_picker: setdate_time_picker,
    set_timeslider_layer: set_timeslider_layer,
    remove_timeslider_layer: remove_timeslider_layer,
    set_filter_layer: set_filter_layer,
    delete_filter_layer: delete_filter_layer,
    set_values_layer: set_values_layer,
    change_filter_field: change_filter_field,
    change_filter_value: change_filter_value
  }
}();
