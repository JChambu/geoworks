import React, { Component } from 'react';

class ValoresColumnas extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectColumna:[]
  }
  this.handleChangeSelect = this.handleChangeSelect.bind(this);
}
handleChangeSelect(event){
  var idsel=event.target.id.substring(3);
  var selectColumna=this.state.selectColumna;
  selectColumna[idsel]=document.getElementById('sel'+idsel).value;
  this.setState({
    selectColumna: selectColumna
    });
}
  render(){
    var cantidadColumnas=this.props.cantidadColumnas;
    var cantidadFilas=this.props.cantidadFilas;
    var col=[];
    for(var a=0;a<cantidadColumnas;a++){col[a]=a}
    const columnas = col.map((columna) =>
      <li key={'valorcolumna'+columna.toString()} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'15%', margin:'2px 0px', fontSize:'0.5em'}}>{'Col '+(columna+1)}</p>
        <select style={{width:'75%', display:'inline-block',margin:'2px 0px'}} id={'sel'+columna} onChange={this.handleChangeSelect}>
            <option value={0}></option>
            <option value={1}>Texto</option>
            <option value={2}>Dato</option>
            <option value={3}>Sumatoria</option>
            <option value={4}>Minimo</option>
            <option value={5}>Maximo</option>
            <option value={6}>Promedio Simple</option>
            <option value={7}>Promedio Ponderado</option>
            <option value={8}>Porcentaje</option>
          </select>
      </li>
      );
    return (
      <div>
        <ul>{columnas}</ul>
      </div>
      )
  }
}
export default ValoresColumnas;