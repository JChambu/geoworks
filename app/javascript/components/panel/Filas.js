import React, { Component } from 'react';

class Filas extends Component {
  render(){
    var cantidadFilas=this.props.cantidadFilas;
    var BaseDatos=this.props.BaseDatos;
    const opciones = BaseDatos.map((opcion) =>
       <option key={opcion.toString()}>{opcion}</option>
      );
    var fil=[];
    for(var a=0;a<cantidadFilas;a++){fil[a]=a}
    const filas = fil.map((fila) =>
      <li key={'baseFila'+fila.toString()} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'15%', margin:'2px 0px', fontSize:'0.5em'}}>{'Fila '+(fila+1)}</p>
        <select style={{width:'78%', display:'inline-block',margin:'2px 0px', fontSize:'0.6em'}}>
            {opciones}
          </select>
      </li>
      );
    return (
      <div>
        <ul>{filas}</ul>
      </div>
      )
  }
}
export default Filas;