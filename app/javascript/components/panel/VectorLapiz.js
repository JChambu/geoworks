import React, { Component } from 'react';


class VectorLapiz extends Component {
  constructor(props){
    super(props);
    this.state = {
      EncabezadoColumna:this.props.EncabezadoColumna
  }
  this.handleClickCelda = this.handleClickCelda.bind(this);
}

  handleClickCelda(event) {
  var id=event.target.id;
  if(document.getElementById(id).style.opacity!=0.3){
    document.getElementById(id).style.opacity=0.3;
  } else{document.getElementById(id).style.opacity=1}
  }
  render(){
    var cantidadColumnas=this.props.cantidadColumnas;
    var cantidadFilas=this.props.cantidadFilas;
    var EncabezadoColumna=this.state.EncabezadoColumna;
    var color=this.props.color;
    var BordeIzquierdo=this.props.BordeIzquierdo;
    var BordeSuperior=this.props.BordeSuperior;
    var BordeDerecho=this.props.BordeDerecho;
    var BordeInferior=this.props.BordeInferior;
    var columnasencab=[];
    var columnas=[];
    var co=[];
    for(var x=0;x<cantidadColumnas;x++){
      co[x]=x;
    }
    var fi=[];
    for(var x=0;x<1;x++){
      fi[x]=x;
      columnasencab[x]=co.map((columna)=> 
      <td key={'celdaeditada'+x+'-'+columna} id={'celdaeditada'+x+'-'+columna} className="CeldaEdicion" onClick={this.handleClickCelda}
           style={{
              borderColor:'rgb(80,80,80)',
              background:color[x][columna],
              borderLeft:BordeIzquierdo[x][columna],
              borderTop:BordeSuperior[x][columna],
              borderRight:BordeDerecho[x][columna],
              borderBottom:BordeInferior[x][columna],
                }} >{EncabezadoColumna[columna]}</td>
      );
    }
    var fi=[];
    for(var x=1;x<=cantidadFilas;x++){
      fi[x]=x;
      columnas[x]=co.map((columna)=> 
      <td key={'celdaeditada'+x+'-'+columna} id={'celdaeditada'+x+'-'+columna} className="CeldaEdicion" onClick={this.handleClickCelda}
           style={{
              borderColor:'rgb(80,80,80)',
              background:color[x][columna],
              borderLeft:BordeIzquierdo[x][columna],
              borderTop:BordeSuperior[x][columna],
              borderRight:BordeDerecho[x][columna],
              borderBottom:BordeInferior[x][columna],
                }} >fila</td>
      );
    }

    var filas=fi.map((fila)=>
      <tr key={'fila'+fila.toString()}>
        {columnas[fila]}
      </tr>
      );


    return (
      <div>
        <table className="Tabla">
        <tbody>
          <tr>{columnasencab}</tr>
          {filas}
        </tbody>
      </table>
      </div>
      )
  }
}
export default VectorLapiz;