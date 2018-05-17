import React, { Component } from 'react';

class Tabla extends Component {
  constructor(props){
    super(props);
    this.state = {
      datosTabla:props.datosTabla,
      colorCelda:props.colorCelda,
  }
}
  render(){
    var datosTabla=this.state.datosTabla;
    var colorCelda=this.state.colorCelda;
    var IndiceTabla = [];
    for(var f=0;f<datosTabla.length;f++){
      IndiceTabla[f]=[];
      for(var c=0;c<datosTabla[0].length;c++){
       IndiceTabla[f][c] = c;
       } 
    }
    var AnchoMax = [];
    var Alineacion = [];
    var BordeDerecho = [];
    var BordeSuperior = [];
    var BordeInferior = [];
    for(f=0;f<IndiceTabla.length;f++){
      AnchoMax[f]=[];
      Alineacion[f]=[];
      BordeDerecho[f]=[];
      BordeSuperior[f]=[];
      BordeInferior[f]=[];
      for(c=0;c<IndiceTabla[0].length;c++){
        if(c===0){AnchoMax[f][c] = 260}else{AnchoMax[f][c] = 90}
        if(c===0){Alineacion[f][c] = 'left'}else{Alineacion[f][c] = 'right'}
        if(c===0||c===3){BordeDerecho[f][c] = 'solid 4px rgb(30,30,30)' }else{BordeDerecho[f][c] = 'dotted 2px rgb(80,80,80)'}
        if((c===1&&f===0)||(c===2&&f===0)||(c===3&&f===0)){BordeSuperior[f][c] = 'solid 4px rgb(30,30,30)' }else{BordeSuperior[f][c] = 'dotted 2px rgb(80,80,80)'}
        if((c===1&&f===6)||(c===2&&f===6)||(c===3&&f===6)){BordeInferior[f][c] = 'solid 4px rgb(30,30,30)' }else{BordeInferior[f][c] = 'dotted 2px rgb(80,80,80)'}
       } 
    }
    var columnas=[];
    var fi=[];
    for(var x=0;x<datosTabla.length;x++){
      fi[x]=x;
    columnas[x]=IndiceTabla[x].map((columna)=> 
      <td key={'celda'+x+'-'+columna} className="Celda" 
          style={{backgroundColor: colorCelda[x][columna], 
                  width:AnchoMax[x][columna]+'px',
                  textAlign:Alineacion[x][columna],
                  borderRight:BordeDerecho[x][columna],
                  borderTop:BordeSuperior[x][columna],
                  borderBottom:BordeInferior[x][columna],
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
