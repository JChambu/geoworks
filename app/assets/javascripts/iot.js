Navarra.namespace("iot");
Navarra.iot = function() {
var count_dashboard = 0;
var dashboard_opened = [];
var position_dashboard = []
var open_mode = 2 ;

function open_iot_monitoring(app_id_popup){
    if (dashboard_opened.indexOf(app_id_popup) < 0 ){
        count_dashboard ++;
        var position_asigned = 0;
        dashboard_opened.push(app_id_popup);
        width_dashboard = "49%";
        height_dashboard = "84vh";
        left_dashboard = "50.5%";
        top_dashboard = "10vh";
        for (let x = 1; x<= open_mode ; x ++ ) {
            if (position_dashboard.indexOf(x) < 0 ) {
                position_dashboard.push(x);
                position_asigned = x;
                break;
            }
        }
        if (position_asigned != 0) {
            switch (open_mode) {
            case 2: 
                width_dashboard = "49%";
                height_dashboard = "84vh";
                if (position_asigned == 1) {
                    left_dashboard = "50.5%";
                } else {
                    left_dashboard = "0.5%";
                }
                top_dashboard = "10vh";
                break;
            case 4: 
                width_dashboard = "49%";
                height_dashboard = "40vh";
                if (position_asigned == 1 || position_asigned == 3) {
                    left_dashboard = "50.5%";
                } else {
                    left_dashboard = "0.5%";
                }
                if (position_asigned > 2) {
                    top_dashboard = "55vh";
                } else {
                    top_dashboard = "10vh";
                }
                break;
            case 9: 
                width_dashboard = "32%";
                height_dashboard = "25vh";
                if (position_asigned == 1 || position_asigned == 4 || position_asigned == 7) {
                    left_dashboard = "66%";
                } 
                if (position_asigned == 2 || position_asigned == 5 || position_asigned == 8) {
                    left_dashboard = "33%";
                }
                if (position_asigned == 3 || position_asigned == 6 || position_asigned == 9) {
                    left_dashboard = "0.5%";
                }
                if (position_asigned == 1 || position_asigned == 3 || position_asigned == 3) {
                    top_dashboard = "10vh";
                } 
                if (position_asigned == 4 || position_asigned == 5 || position_asigned == 6) {
                    top_dashboard = "40vh";
                }
                if (position_asigned == 7 || position_asigned == 8 || position_asigned == 9) {
                    top_dashboard = "70vh";
                }
                break;
            default: 
                width_dashboard = "49%";
                height_dashboard = "84vh";
                if (position_asigned == 1) {
                    left_dashboard = "50.5%";
                } else {
                    left_dashboard = "0.5%";
                }
                top_dashboard = "10vh";
                break;
            }
            Navarra.geomaps.close_all_popups();
            $('.leaflet-top.leaflet-right').addClass("d-none");
            if (( open_mode == 2 && position_asigned == 2) || ( open_mode == 4 && position_asigned == 2) || ( open_mode == 9 && position_asigned == 3) ){
                $('.leaflet-top.leaflet-left').addClass("d-none");
                $('.status_panel').addClass("d-none");
            }
            let iframeHtml = '<div id="iot_monitoring_' + app_id_popup + '" class="popup_iot " style="width:'+width_dashboard+' ;top:'+top_dashboard+' ;left:'+left_dashboard+'">';
            iframeHtml += '<div class="card-header chart-header-bg-transparent py-1 px-2 card_data" ';
            iframeHtml += '<h7 class="d-inline">Monitoreo Sensor ' + app_id_popup + '</h7>';
            iframeHtml += '<div class="view-data-container">';
            iframeHtml += '<i class="fas fa-th iot_icon" onclick="Navarra.iot.multi_screen_iot('+ app_id_popup +')"></i>';
            iframeHtml += '<i class="fas fa-th-large iot_icon" onclick="Navarra.iot.quarter_screen_iot('+ app_id_popup +')"></i>';
            iframeHtml += '<i class="fas fa-columns iot_icon" onclick="Navarra.iot.half_screen_iot('+ app_id_popup +')"></i>';
            iframeHtml += '<i class="fas fa-square iot_icon" onclick="Navarra.iot.full_screen_iot('+ app_id_popup +')"></i>';
            iframeHtml += '<i class="fas fa-times iot_icon" onclick="Navarra.iot.close_iot(' + app_id_popup+ ')"></i>';
            iframeHtml += '</div></div><div style="height:'+height_dashboard+'" class="pop_iot_container" id="iot_container_'+app_id_popup+'">';
            iframeHtml += '<iframe src="https://iot.geoworks.com.ar/dashboard/'+app_id_popup+'?id=' + app_id_popup + '"';
            iframeHtml +=' class="popup_iot_iframe"></iframe>';
            iframeHtml += ' </div></div>'
            $(document.body).append(iframeHtml);
 
        }        
    }
}

function close_iot(app_id_popup) {
    $('#iot_monitoring_'+app_id_popup).remove();
    count_dashboard --;
    let index = dashboard_opened.indexOf(app_id_popup);
    let close_position = position_dashboard[index];
    if (close_position == 1) {
        $('.leaflet-top.leaflet-right').removeClass("d-none");
    }
    if (open_mode == 1 || ( open_mode == 2 && close_position == 2) || ( open_mode == 4 && close_position == 2) || ( open_mode == 9 && close_position == 3) ){
        $('.leaflet-top.leaflet-left').removeClass("d-none");
        $('.status_panel').removeClass("d-none");
    }
    dashboard_opened.splice(index, 1);
    position_dashboard.splice(index, 1);

}

function full_screen_iot(app_id_popup) {
    open_mode = 1;
    $('.leaflet-top.leaflet-left').addClass("d-none");
    $('.status_panel').addClass("d-none");
    $('.leaflet-top.leaflet-right').removeClass("d-none");
    $(".popup_iot").each(function(index,element) {
        var element_id = element.id.substr(15,element.id.length);
        if (element_id != app_id_popup){
            $(element).remove();
        } else {
            $(element).css("width","99%");
            $(element).css("left","0.5%");
            $("#iot_container_"+element_id).css("height","84vh");
            $(element).css("top","10vh");
            dashboard_opened = [app_id_popup];
            position_dashboard = [1];
        }
    });
    count_dashboard = 1;
}

function half_screen_iot(app_id_popup) {
    open_mode = 2;
    dashboard_opened = [];
    position_dashboard = [];
    var new_index = 0;
    $(".popup_iot").each(function(index,element) {
        var element_id = element.id.substr(15,element.id.length);
        if (element_id != app_id_popup && count_dashboard > 2){
            $(element).remove();
            count_dashboard --;
            dashboard_opened.splice(index,1);
            position_dashboard.splice(index,1);
        } else {
            new_index++;
            dashboard_opened.push(parseInt(element_id));
            position_dashboard.push(new_index);
            if (new_index %2 == 0 ) {
                left_pos = "0.5%";
                $('.leaflet-top.leaflet-left').addClass("d-none");
                $('.status_panel').addClass("d-none");
            } else {
                $('.leaflet-top.leaflet-right').addClass("d-none");
                left_pos = "50.5%";
            }
            $(element).css("width","49%");
            $("#iot_container_"+element_id).css("height","84vh");
            $(element).css("left",left_pos);
            $(element).css("top","10vh");
        }
    });
    if (new_index > 1) {
        $('.leaflet-top.leaflet-left').addClass("d-none");
        $('.status_panel').addClass("d-none");
    } else {
        $('.leaflet-top.leaflet-left').removeClass("d-none");
        $('.status_panel').removeClass("d-none");
    }
}

function quarter_screen_iot(app_id_popup) {
    open_mode = 4;
    dashboard_opened = [];
    position_dashboard = [];
    var new_index = 0;
    $(".popup_iot").each(function(index,element) {
        var element_id = element.id.substr(15,element.id.length);
        if (element_id != app_id_popup && count_dashboard > 4){
            $(element).remove();
            count_dashboard --;
        } else {
            new_index++;
            dashboard_opened.push(parseInt(element_id));
            position_dashboard.push(new_index);
            if (new_index %2 == 0 ) {
                left_pos = "0.5%";
                $('.leaflet-top.leaflet-left').addClass("d-none");
                $('.status_panel').addClass("d-none");
            } else {
                $('.leaflet-top.leaflet-right').addClass("d-none");
                left_pos = "50.5%";
            }
            if (new_index > 2 ) {
                top_pos = "55vh";
            } else {
                top_pos = "10vh";
            }
            $(element).css("width","49%");
            $("#iot_container_"+element_id).css("height","40vh");
            $(element).css("left",left_pos);
            $(element).css("top",top_pos);
        }
    });
    if (new_index > 1) {
        $('.leaflet-top.leaflet-left').addClass("d-none");
        $('.status_panel').addClass("d-none");
    } else {
        $('.leaflet-top.leaflet-left').removeClass("d-none");
        $('.status_panel').removeClass("d-none");
    }
}

function multi_screen_iot(app_id_popup) {
    open_mode = 9;
    dashboard_opened = [];
    position_dashboard = [];
    var new_index = 0;
    $(".popup_iot").each(function(index,element) {
        var element_id = element.id.substr(15,element.id.length);
        if (element_id != app_id_popup && count_dashboard > 4){
            $(element).remove();
            count_dashboard --;
        } else {
            new_index++;
            dashboard_opened.push(parseInt(element_id));
            position_dashboard.push(new_index);
            if (new_index == 1 || new_index == 4 || new_index == 7) {
                left_pos = "66%";
            } 
            if (new_index == 2 || new_index == 5 || new_index == 8) {
                left_pos = "33%";
            }
            if (new_index == 3 || new_index == 6 || new_index == 9) {
                left_pos = "0.5%";
            }
            if (new_index == 1 || new_index == 3 || new_index == 3) {
                top_pos = "10vh";
            } 
            if (new_index == 4 || new_index == 5 || new_index == 6) {
                top_pos = "40vh";
            }
            if (new_index == 7 || new_index == 8 || new_index == 9) {
                top_pos = "70vh";
            }
            if (new_index == 3) {
                $('.leaflet-top.leaflet-left').addClass("d-none");
                $('.status_panel').addClass("d-none");
            } 
            if (new_index == 1) {
                $('.leaflet-top.leaflet-right').addClass("d-none");
            }
            $(element).css("width","32%");
            $("#iot_container_"+element_id).css("height","25vh");
            $(element).css("left",left_pos);
            $(element).css("top",top_pos);
        }
    });
    if (new_index > 3) {
        $('.leaflet-top.leaflet-left').addClass("d-none");
        $('.status_panel').addClass("d-none");
    } else {
        $('.leaflet-top.leaflet-left').removeClass("d-none");
        $('.status_panel').removeClass("d-none");
    }
}

return {
    open_iot_monitoring: open_iot_monitoring,
    close_iot: close_iot,
    full_screen_iot: full_screen_iot,
    quarter_screen_iot: quarter_screen_iot,
    half_screen_iot: half_screen_iot,
    multi_screen_iot: multi_screen_iot
}
}();

