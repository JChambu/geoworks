import React, { Component } from 'react';

class Tabla extends Component {
  render(){
    var datosTabla=this.props.datosTabla;
    var color=this.props.color;
    var BordeSuperior=this.props.BordeSuperior;
    var BordeDerecho=this.props.BordeDerecho;
    var BordeInferior=this.props.BordeInferior;
    var BordeIzquierdo=this.props.BordeIzquierdo;
    var AnchoMax=this.props.AnchoMax;
    var Alineacion=this.props.Alineacion;
    var ColSpan=this.props.ColSpan;
    var RowSpan=this.props.RowSpan;
    var TamañoLetra=this.props.TamañoLetra;
    var Padding=this.props.Padding;

    var IndiceTabla = [];
    for(var f=0;f<datosTabla.length;f++){
      IndiceTabla[f]=[];
      for(var c=0;c<datosTabla[f].length;c++){
       IndiceTabla[f][c] = c;
       } 
    }
    var columnas=[];
    var fi=[];
    for(var x=0;x<datosTabla.length;x++){
      fi[x]=x;
      columnas[x]=IndiceTabla[x].map((columna)=> 
      <td key={'celda'+x+'-'+columna} className="Celda" colSpan={ColSpan[x][columna]} rowSpan={RowSpan[x][columna]}
          style={{backgroundColor: color[x][columna], 
                  width:AnchoMax[x][columna]+'px',
                  textAlign:Alineacion[x][columna],
                  borderTop:BordeSuperior[x][columna],
                  borderRight:BordeDerecho[x][columna],
                  borderBottom:BordeInferior[x][columna],
                  borderLeft:BordeIzquierdo[x][columna],
                  fontSize:TamañoLetra[x][columna],
                  padding:Padding[x][columna],
                }} >{datosTabla[x][columna]}</td>
      );
    }
    var filas=fi.map((fila)=>
      <tr key={'fila'+fila.toString()}>
        {columnas[fila]}
      </tr>
      );
    return (
     <table className="Tabla">
        <tbody>
          {filas}
        </tbody>
      </table>
      )
  }
}
export default Tabla;
