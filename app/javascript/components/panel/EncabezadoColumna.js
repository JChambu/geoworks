import React, { Component } from 'react';

class EncabezadoColumnas extends Component {
  constructor(props){
    super(props);
    this.state = {
      EncabezadoColumna:this.props.EncabezadoColumna
  }
  this.handleChangeEncab = this.handleChangeEncab.bind(this);
}

  handleChangeEncab(event) {
  var id=event.target.id.substring(7);
  var EncabezadoColumna=this.state.EncabezadoColumna;
  EncabezadoColumna[id]=document.getElementById('columna'+id).value;
  this.setState({
      EncabezadoColumna:EncabezadoColumna
    });
  }
  render(){
    var cantidadColumnas=this.props.cantidadColumnas;
    var col=[];
    for(var a=0;a<cantidadColumnas;a++){col[a]=a}
    const columnas = col.map((columna) =>
      <li key={'columna'+columna.toString()} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'15%', margin:'2px 0px', fontSize:'0.5em'}}>{'Col '+(columna+1)}</p>
        <input type="text"  style={{width:'75%', display:'inline-block',margin:'2px 0px'}} id={'columna'+columna.toString()} onChange={this.handleChangeEncab} />
      </li>
      );
    return (
      <div>
        <ul>{columnas}</ul>
      </div>
      )
  }
}
export default EncabezadoColumnas;