var GeoEditionsApplication = React.createClass({
  getInitialState: function() {
    return { events: [] };
  },
  componentDidMount: function() {
    this.getDataFromApi();
  },
  getDataFromApi: function() {
    var self = this;
    $.ajax({
      url: '/geo_editions',
      dataType: "json",
      success: function(data) {
        console.log(data);
        self.setState({ events: data });

      },
      error: function(xhr, status, error) {
        alert('Cannot get data from API: ', error);
      }
    });
  },

 handleUpdateRecord: function(old_event, event) {
           var events = this.state.events.slice();
           var index = events.indexOf(old_event);
           events.splice(index, 1, event);
           this.setState({ events: events });
         },



  render: function(){
    return(
      <div><AllItems events={this.state.events}
      handleUpdateRecord={this.handleUpdateRecord}  
      /></div>
    )
  }
})
