GeoEditionLists = React.createClass({
  getInitialState: function() {
    return { edit: false };
  },   
  propTypes: {
    company: React.PropTypes.string,
    gw_pta_ini: React.PropTypes.string,
    gw_pta_fin: React.PropTypes.string,
    gw_paridad: React.PropTypes.string,
    gw_code: React.PropTypes.string,
    poi_status_id: React.PropTypes.string,
  },

  handleToggle: function(e) {
    e.preventDefault();
    this.setState({ edit: !this.state.edit });
  },

  handleUpdate: function(e) {

    e.preventDefault();
    if (this.validRecord()) {
      var event_data = {
        id: this.props.event.id,
        company: this.recordValue("company"),
        gw_pta_ini: this.recordValue("gw_pta_ini"),
        gw_pta_fin: this.recordValue("gw_pta_fin"),
        gw_paridad: this.recordValue("gw_paridad"),
        gw_code: this.recordValue("gw_code"),
        poi_status_id: this.recordValue("poi_status_id"),
      };
      $.ajax({
        method: 'PUT',
        url: '/geo_editions/' + this.props.event.id,
        data: { geo_edition: event_data },
        datatype: 'json',
        success: function(data) {
          this.props.handleUpdateRecord(this.props.event, data);
          this.setState({ edit: false });
        }.bind(this),
        error: function(xhr, status, error) {                  
          alert('Cannot update requested record: ', error);                                                                       
        }        
      });
    } else {
      alert('Please fill all fields.');
    }
  },

  validRecord: function() {          
    if (this.recordValue("company")){                           
      return true;             
    } else {                   
      return false;        
    }                      
  },
  
  recordValue: function(field) {
    return ReactDOM.findDOMNode(this.refs[field]).value;
  },

  renderForm: function() {
    var options = [
      { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
    ];
    return(
      <tr>
        <td></td>
        <td>
          <input name="company"
            defaultValue={this.props.event.company}
            className="form-control span12"
            type="text"
            ref="company"
          />
        </td>
        <td>
            {this.props.event.number_door_start_original}
        </td>
        <td className="input-min">
          <input name="gw_pta_ini"
            defaultValue={this.props.event.gw_pta_ini}
            className="form-control  span6"
            type="text"
            ref="gw_pta_ini"
          />
        </td>

        <td>
          {this.props.event.number_door_end_original}
        </td>
        <td>
          <input name="gw_pta_fin"
            defaultValue={this.props.event.gw_pta_fin}
            className="form-control span6"
            type="text"
            ref="gw_pta_fin"
          />
        </td>
        <td>
            {this.props.event.paridad}
        </td>
        <td>
          <input name="gw_paridad"
            defaultValue={this.props.event.gw_paridad}
            className="form-control span6"
            type="text"
            ref="gw_paridad"
          />
        </td>
        <td>
          <input name="gw_code"
            defaultValue={this.props.event.gw_code}
            className="form-control span6"
            type="text"
            ref="gw_code"
          />
        </td>
        <td>
          
          <select name="poi_status_id"
            className="form-control span12"
            ref="poi_status_id"
          defaultValue={this.props.event.poi_status_id}>
            <option value = "6">Alta</option>
            <option value = "4">Baja</option>
            <option value = "8">Check</option>
            <option value = "5">Modificacion</option>
            <option value = "1">No Validado</option>
            <option value = "8">Revisar</option>
            <option value = "2">Validado</option>
        </select>
        </td>
        <td>
          <a className="btn btn-success btn-sm"
            onClick={this.handleUpdate}>
            Save
          </a>
          <a className="btn btn-default btn-sm"
            onClick={this.handleToggle} >
            Cancel
          </a>
        </td>
      </tr>
    );
  },
  renderRecord: function() {                            
    var event = this.props.event;                       
    return(                                             
      <tr>
        <td>{event.id}</td>
        <td>{event.company}</td>
        <td>{event.number_door_start_original}</td>
        <td>{event.gw_pta_ini}</td>
        <td>{event.number_door_end_original}</td>
        <td>{event.gw_pta_fin}</td>
        <td>{event.paridad}</td>
        <td>{event.gw_paridad}</td>
        <td>{event.gw_code}</td>
        <td><a className="btn btn-primary btn-xs" onClick={this.handleToggle}> Edit </a> </td>
      </tr>
    );
  },

  render: function() {
    if (this.state.edit) {
      return(this.renderForm());
    } else {
      return(this.renderRecord());
    }
  }
});
