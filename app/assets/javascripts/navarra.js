/**
 * Navarra Javascript library
 */

var Navarra = Navarra || {};

Navarra.namespace = function (ns_string) {
  var parts = ns_string.split('.'),
  parent = Navarra,
  i;
  // strip redundant leading global
  if (parts[0] === "Navarra") {
    parts = parts.slice(1);
  }
  for (i = 0; i < parts.length; i += 1) {
    // create a property if it doesn't exist
    if (typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {};
    }

    parent = parent[parts[i]];
  }
  return parent;
}

Navarra.exec = function( controller, action ) {
  if ( controller !== "" && Navarra[controller] && action !== "" && typeof Navarra[controller][action] == "object" && typeof Navarra[controller][action].init == "function" ) {
    Navarra[controller][action].init();
  }
}

Navarra.init = function() {
  //Index doesn't exist in IE8, that's why I'm using this patchs
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
      var len = this.length >>> 0;

      var from = Number(arguments[1]) || 0;
      from = (from < 0) ? Math.ceil(from) : Math.floor(from);

      if (from < 0)
        from += len;

      for (; from < len; from++) {
        if (from in this && this[from] === elt)
          return from;
      }

      return -1;
    };
  }
  //end patch
  
  var body = document.body,
    controller = body.getAttribute( "data-controller" ),
    action = body.getAttribute( "data-action" );

  Navarra.exec("common");
  Navarra.exec(controller, action);
}

$(document).ready(Navarra.init);