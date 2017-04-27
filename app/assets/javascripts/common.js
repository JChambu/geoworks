Navarra.namespace("common.validations");
Navarra.namespace("common.form");
Navarra.namespace("common.request");
Navarra.namespace("common.math");
Navarra.namespace("common.poi");

Navarra.common.request = function() {
  var ajax = function(url, type, successFunction, errorFunction, data) {
    if(!url) {
      console.log("Undefined url param");
      return;
    }

    if(!type || (type != "POST" && type != "GET")) {
      console.log("Undefined type param");
      return;
    }

    var settings = {"url": url, "type": type};

    if(data) {
      settings["data"] = data;
    }

    settings["error"] = function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }

    if(errorFunction) {
      settings["error"] = function(jqXHR, textStatus, errorThrown) {
        errorFunction(jqXHR, textStatus, errorThrown);
      }
    }

    settings["success"] = function(data, textStatus, jqXHR) {
      console.log(textStatus);
      console.log(data);
    }

    if(successFunction) {
      settings["success"] = function(data, textStatus, jqXHR) {
        successFunction(data, textStatus, jqXHR);
      }
    }

    $.ajax(settings);
  };

  var postAjax = function(url, successFunction, errorFunction, data) {
    ajax(url, "POST", successFunction, errorFunction, data);
  },

  getAjax = function(url, successFunction, errorFunction, data) {
    ajax(url, "GET", successFunction, errorFunction, data);
  }

  return {
    postAjax: postAjax,
    getAjax: getAjax
  }    
}();

Navarra.common.validations = function() {
  var isPositiveInteger = function(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
  }

  return {
    isPositiveInteger: isPositiveInteger
  }
}();

Navarra.common.poi = function() {
  var initHeaderSearch = function(str) {
    $("#poi_select").ajaxChosen({
      method: 'GET',
      url: '/pois/search',
      dataType: 'json'
    }, function (data) {
      var terms = {};
      $.each(data, function (i, e) {
        terms[e.id] = e.name;
      });
      return terms;
    }).change(function() {
      window.location = "/pois/" + $("#poi_select").val() + "/edit"
    });
  };

  return {
    initHeaderSearch: initHeaderSearch
  }
}();

Navarra.common.math = function() {
    var round = function(num, decimals) {
        return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
    };

    return {
        round: round
    }        
}();

Navarra.common.form = function() {
  var chosen = function(selectors, sourceUrl) {
    $.each(selectors, function(index, selector) {
      $(selector).ajaxChosen({
        method: 'GET',
        url: sourceUrl,
        dataType: 'json'
      }, function (data) {
        var terms = {};                
        $.each(data, function (i, e) {
            terms[e.id] = e.name;
        });
        return terms;
      });
    });
  },

  loadComboOptions = function(combo, collection, attr) {
    var result = '<option></option>';
    $.each(collection, function(index, item) {
      result += "<option value='" + item.id + "'>" + item[attr] + "</option>";
    });

    $(combo).html(result);
  },

  searchAddress = function(location){
       
      var options = {};  
      var locationArr = location.split(", ");

        if(locationArr[0] != undefined) {
          options["location"] = locationArr[0];
        }

        if(locationArr[1] != undefined) {
          options["county"] = locationArr[2];
        }

        if(locationArr[3] != undefined) {
          options["country"] = locationArr[3];
        }
    return options;
  };

  
  return {
    chosen: chosen,
    loadComboOptions: loadComboOptions,
    searchAddress: searchAddress
  }
}();
