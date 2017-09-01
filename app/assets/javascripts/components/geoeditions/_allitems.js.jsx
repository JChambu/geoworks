var AllItems = React.createClass({

  handleUpdateRecord: function(old_event, event) {
           this.props.handleUpdateRecord(old_event, event);
         },



  render: function(){
    var events = [];
        this.props.events.forEach(function(event) {
                events.push(<GeoEditionLists event={event}
                  key={'event' + event.id}
                  handleUpdateRecord={this.handleUpdateRecord}/>);
              }.bind(this));


    return(

    <table className="table table-striped">
       <thead>
              <tr>
                <th className="col-md-3">id</th>
                <th className="col-md-3">Nombre</th>
                <th className="col-md-1">Puerta Inicio</th>
                <th className="col-md-2">GW Puerta Inicio</th>
                <th className="col-md-3">Puerta Fin</th>
                <th className="col-md-3">GW Puerta Fin</th>
                <th className="col-md-4">Paridad</th>
                <th className="col-md-4">GW Paridad</th>
                <th className="col-md-4">Code</th>
              </tr>
            </thead>
            <tbody>{events}
            </tbody>
    
    </table>
  ) 
  }
});
