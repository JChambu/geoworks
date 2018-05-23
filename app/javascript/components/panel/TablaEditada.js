import React, { Component } from 'react';

class TablaEditada extends Component {
  constructor(props){
    super(props);
    this.state = {
      cantidadColumnas:1,
      cantidadFilas:this.props.cantidadFilas,
      EncabezadoColumna:[],
      ValoresColumna:[[]],
      ValoresColumnaEditado:[[]],
      ValoresFilaD:[[]],
      ValoresFilaDEditada:[[]],
      ValoresTexto:[[]],
      ValoresDato:[[]],
      ValoresPorcentaje:[[]],
      color:[["white"],["white"]],
      BordeIzquierdo:[["solid 2px"],["solid 2px"]],
      contadorBI:0,
      BordeSuperior:[["solid 2px"],["solid 2px"]],
      contadorBS:0,
      BordeDerecho:[["solid 2px"],["solid 2px"]],
      contadorBD:0,
      BordeInferior:[["solid 2px"],["solid 2px"]],
      contadorBIn:0,
  }
  this.handleClickCelda = this.handleClickCelda.bind(this);
  this.handleClickMasColumnas = this.handleClickMasColumnas.bind(this);
  this.handleClickMenosColumnas = this.handleClickMenosColumnas.bind(this);
  this.handleClickMasFilas = this.handleClickMasFilas.bind(this);
  this.handleClickMenosFilas = this.handleClickMenosFilas.bind(this);
  this.handleChangeColor = this.handleChangeColor.bind(this);
  this.handleClickBordeIzquierdo = this.handleClickBordeIzquierdo.bind(this);
  this.handleClickBordeSuperior = this.handleClickBordeSuperior.bind(this);
  this.handleClickBordeDerecho = this.handleClickBordeDerecho.bind(this);
  this.handleClickBordeInferior = this.handleClickBordeInferior.bind(this);
  this.handleChangeEncab = this.handleChangeEncab.bind(this);
  this.handleChangeValores = this.handleChangeValores.bind(this);
  this.handleChangeFila = this.handleChangeFila.bind(this);
  this.handleChangeTexto = this.handleChangeTexto.bind(this);
  this.handleChangeDato = this.handleChangeDato.bind(this);
  this.handleChangePorcentaje = this.handleChangePorcentaje.bind(this);
  this.onClick=this.onClick.bind(this)
  
}

onClick(event,cantidadFilas,cantidadColumnas,EncabezadoColumna,color,
  BordeIzquierdo,BordeSuperior,BordeDerecho,BordeInferior,ValoresColumna,ValoresFilaD,ValoresTexto,ValoresDato,ValoresPorcentaje) {
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var EncabezadoColumna=this.state.EncabezadoColumna;
  var color=this.state.color;
  var BordeIzquierdo=this.state.BordeIzquierdo;
  var BordeSuperior=this.state.BordeSuperior;
  var BordeDerecho=this.state.BordeDerecho;
  var BordeInferior=this.state.BordeInferior;
  var ValoresColumna=this.state.ValoresColumna;
  var ValoresFilaD=this.state.ValoresFilaD;
  var ValoresTexto=this.state.ValoresTexto;
  var ValoresDato=this.state.ValoresDato;
  var ValoresPorcentaje=this.state.ValoresPorcentaje
  this.props.onClick(event,cantidadFilas,cantidadColumnas,EncabezadoColumna,color,
    BordeIzquierdo,BordeSuperior,BordeDerecho,BordeInferior,ValoresColumna, ValoresFilaD, ValoresTexto, ValoresDato,ValoresPorcentaje)
  }
handleChangePorcentaje(event) {
  var id=event.target.id.substring(9);
  var idfil=id.split('-')[0];
  var idcol=id.split('-')[1];
  var ValoresPorcentaje=this.state.ValoresPorcentaje;
  ValoresPorcentaje[idfil][idcol]=document.getElementById('valorporc'+idfil+'-'+idcol).value;
  this.setState({
      ValoresPorcentaje:ValoresPorcentaje,
    });
  }
handleChangeDato(event) {
  var id=event.target.id.substring(9);
  var idfil=id.split('-')[0];
  var idcol=id.split('-')[1];
  var ValoresDato=this.state.ValoresDato;
  ValoresDato[idfil][idcol]=document.getElementById('valordato'+idfil+'-'+idcol).value;
  this.setState({
      ValoresDato:ValoresDato,
    });
  }
handleChangeTexto(event) {
  var id=event.target.id.substring(10);
  var idfil=id.split('-')[0];
  var idcol=id.split('-')[1];
  var ValoresTexto=this.state.ValoresTexto;
  ValoresTexto[idfil][idcol]=document.getElementById('valortexto'+idfil+'-'+idcol).value;
  this.setState({
      ValoresTexto:ValoresTexto,
    });
  alert(ValoresTexto)
  }

handleChangeEncab(event) {
  var id=event.target.id.substring(7);
  var EncabezadoColumna=this.state.EncabezadoColumna;
  EncabezadoColumna[id]=document.getElementById('columna'+id).value;
  this.setState({
      EncabezadoColumna:EncabezadoColumna
    });
  }

handleChangeValores(event) {
  var id=event.target.id.substring(3);
  var ValoresColumna=this.state.ValoresColumna;
  var cantidadFilas=this.state.cantidadFilas;
  for (var a=1;a<=cantidadFilas;a++){
    ValoresColumna[a-1][id]=document.getElementById('sel'+id).value;
  }
  var ValoresColumnaEditado=this.state.ValoresColumnaEditado;
  for(var a=1;a<=cantidadFilas;a++){
  var co=[id];
  var filaanterior=a-1;
  if(ValoresColumna[a-1][id]==0){
    var ValCol=co.map((columna)=> <p></p>);
  }
  if(ValoresColumna[a-1][id]==1){
     var ValCol=co.map((columna)=> <p style={{marginTop:'5px'}}>Titulo Fila</p>);
  }
  if(ValoresColumna[a-1][id]==2){
    var ValCol=co.map((columna)=> <input type="text" style={{width:'90%'}} id={'valordato'+filaanterior+'-'+columna} placeholder="Dato a buscar" onChange={this.handleChangeDato}/>);
  }
  if(ValoresColumna[a-1][id]==3){
    var ValCol=co.map((columna)=> <p style={{marginTop:'5px'}}>Sum</p>);
  }
  if(ValoresColumna[a-1][id]==4){
    var ValCol=co.map((columna)=> <p style={{marginTop:'5px'}}>Min</p>);
  }
  if(ValoresColumna[a-1][id]==5){
    var ValCol=co.map((columna)=> <p style={{marginTop:'5px'}}>Max</p>);
  }
  if(ValoresColumna[a-1][id]==6){
    var ValCol=co.map((columna)=> <p style={{marginTop:'5px'}}>Prom.</p>);
  }
  if(ValoresColumna[a-1][id]==7){
    var ValCol=co.map((columna)=> <p style={{marginTop:'5px'}}>Prom.Pond.</p>);
  }
  if(ValoresColumna[a-1][id]==8){
    var ValCol=co.map((columna)=> <input type="text" style={{width:'90%'}} id={'valorporc'+filaanterior+'-'+columna} 
      placeholder="Col/ColBase" onChange={this.handleChangePorcentaje}/>);
  }  
  if(ValoresColumna[a-1][id]==9){
     var ValCol=co.map((columna)=> <input type="text" style={{width:'90%'}} id={'valortexto'+filaanterior+'-'+columna} onChange={this.handleChangeTexto}/>);
  }
  ValoresColumnaEditado[a-1][id]=ValCol;
  }
  this.setState({
      ValoresColumna:ValoresColumna,
      ValoresColumnaEditado:ValoresColumnaEditado,
    });
  }

handleChangeFila(event) {
  var id=event.target.id.substring(5);
  var ValoresFilaD=this.state.ValoresFilaD;
  var cantidadColumnas=this.state.cantidadColumnas;
  for (var a=0;a<cantidadColumnas;a++){
    ValoresFilaD[id][a]=document.getElementById('filaD'+id).selectedIndex;
  }
  var ValoresFilaDEditada=this.state.ValoresFilaDEditada;
  for(var a=0;a<cantidadColumnas;a++){
  var fi=[id];
  var ValFi=fi.map((fila)=> <p style={{marginTop:'5px'}}>{document.getElementById('filaD'+id).options[ValoresFilaD[id][a]].text}</p>);
  
  ValoresFilaDEditada[id][a]=ValFi;
  }
  this.setState({
      ValoresFilaD:ValoresFilaD,
      ValoresFilaDEditada:ValoresFilaDEditada,
    });
  }

handleClickCelda(event) {
  var id=event.target.id;
  if(id==''){id=event.target.parentElement.id}
  if(document.getElementById(id).style.opacity!=0.3){
    document.getElementById(id).style.opacity=0.3;
  } else{document.getElementById(id).style.opacity=1}
}

handleChangeColor(event){
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var color=this.state.color;
  for(var a=0;a<=cantidadFilas;a++){
    for(var b=0;b<cantidadColumnas;b++){
    if(document.getElementById('celdaeditada'+a+'-'+b).style.opacity==0.3){
      color[a][b]=document.getElementById('colorcolumna').value;
    }
    }
  }
  this.setState({
    color:color
    });
}
handleClickBordeIzquierdo(event){
  var contadorBI=this.state.contadorBI;
  contadorBI++;
  if(contadorBI>5){contadorBI=0}
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var BordeIzquierdo=this.state.BordeIzquierdo;
  var BIText=["solid 2px","solid 1px","none","dotted 2px", "dotted 1px", "solid 3px"];
  document.getElementById('BordeIzquierdo').style.borderLeft=BIText[contadorBI];
  for(var a=0;a<=cantidadFilas;a++){
    for(var b=0;b<cantidadColumnas;b++){
     if(document.getElementById('celdaeditada'+a+'-'+b).style.opacity==0.3){
    BordeIzquierdo[a][b]=document.getElementById('BordeIzquierdo').style.borderLeft;
    }
  }
  }
  this.setState({
    BordeIzquierdo:BordeIzquierdo,
    contadorBI:contadorBI
    });
}
handleClickBordeSuperior(event){
  var contadorBS=this.state.contadorBS;
  contadorBS++;
  if(contadorBS>5){contadorBS=0}
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var BordeSuperior=this.state.BordeSuperior;
  var BIText=["solid 2px","solid 1px","none","dotted 2px", "dotted 1px", "solid 3px"];
  document.getElementById('BordeSuperior').style.borderTop=BIText[contadorBS];
  for(var a=0;a<=cantidadFilas;a++){
    for(var b=0;b<cantidadColumnas;b++){
     if(document.getElementById('celdaeditada'+a+'-'+b).style.opacity==0.3){
    BordeSuperior[a][b]=document.getElementById('BordeSuperior').style.borderTop;
    }
  }
  }
  this.setState({
    BordeSuperior:BordeSuperior,
    contadorBS:contadorBS
    });
}
handleClickBordeDerecho(event){
  var contadorBD=this.state.contadorBD;
  contadorBD++;
  if(contadorBD>5){contadorBD=0}
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var BordeDerecho=this.state.BordeDerecho;
  var BIText=["solid 2px","solid 1px","none","dotted 2px", "dotted 1px", "solid 3px"];
  document.getElementById('BordeDerecho').style.borderRight=BIText[contadorBD];
  for(var a=0;a<=cantidadFilas;a++){
    for(var b=0;b<cantidadColumnas;b++){
     if(document.getElementById('celdaeditada'+a+'-'+b).style.opacity==0.3){
    BordeDerecho[a][b]=document.getElementById('BordeDerecho').style.borderRight;
    }
  }
  }
  this.setState({
    BordeDerecho:BordeDerecho,
    contadorBD:contadorBD
    });
}
handleClickBordeInferior(event){
  var contadorBIn=this.state.contadorBIn;
  contadorBIn++;
  if(contadorBIn>5){contadorBIn=0}
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var BordeInferior=this.state.BordeInferior;
  var BIText=["solid 2px","solid 1px","none","dotted 2px", "dotted 1px", "solid 3px"];
  document.getElementById('BordeInferior').style.borderBottom=BIText[contadorBIn];
  for(var a=0;a<=cantidadFilas;a++){
    for(var b=0;b<cantidadColumnas;b++){
     if(document.getElementById('celdaeditada'+a+'-'+b).style.opacity==0.3){
    BordeInferior[a][b]=document.getElementById('BordeInferior').style.borderBottom;
    }
  }
  }
  this.setState({
    BordeInferior:BordeInferior,
    contadorBIn:contadorBIn
    });
}


handleClickMasColumnas(event) {
  var cantidadColumnas=this.state.cantidadColumnas;
  var cantidadFilas=this.state.cantidadFilas;
  var color=this.state.color;
  var BordeIzquierdo=this.state.BordeIzquierdo;
  var BordeSuperior=this.state.BordeSuperior;
  var BordeDerecho=this.state.BordeDerecho;
  var BordeInferior=this.state.BordeInferior;
  var ValoresFilaD=this.state.ValoresFilaD;
  var ValoresFilaDEditada=this.state.ValoresFilaDEditada;
  for(var a=0;a<=cantidadFilas;a++){
    var ultimocolor=color[a][cantidadColumnas-1];
    var ultimoBI=BordeIzquierdo[a][cantidadColumnas-1];
    var ultimoBS=BordeSuperior[a][cantidadColumnas-1];
    var ultimoBD=BordeDerecho[a][cantidadColumnas-1];
    var ultimoBIn=BordeInferior[a][cantidadColumnas-1];
    
    color[a].push(ultimocolor);
    BordeIzquierdo[a].push(ultimoBI);
    BordeSuperior[a].push(ultimoBS);
    BordeDerecho[a].push(ultimoBD);
    BordeInferior[a].push(ultimoBIn);
    if(a<cantidadFilas){
      var ultimaF=ValoresFilaD[a][cantidadColumnas-1];
      var ultimaFEdi=ValoresFilaDEditada[a][cantidadColumnas-1];
     ValoresFilaD[a].push(ultimaF);
     ValoresFilaDEditada[a].push(ultimaFEdi);
    }
  }
    cantidadColumnas++;   
    this.setState({
    cantidadColumnas:cantidadColumnas,
    color:color,
    BordeIzquierdo: BordeIzquierdo,
    BordeSuperior: BordeSuperior,
    BordeDerecho: BordeDerecho,
    BordeInferior: BordeInferior,
    ValoresFilaD:ValoresFilaD,
    ValoresFilaDEditada: ValoresFilaDEditada,
    });
  }

handleClickMenosColumnas(event) {
    var cantidadColumnas=this.state.cantidadColumnas;
    var cantidadFilas=this.state.cantidadFilas;
    var color=this.state.color;
    var BordeIzquierdo=this.state.BordeIzquierdo;
    var BordeSuperior=this.state.BordeSuperior;
    var BordeDerecho=this.state.BordeDerecho;
    var BordeInferior=this.state.BordeInferior;
    var ValoresFilaD=this.state.ValoresFilaD;
    var ValoresFilaDEditada=this.state.ValoresFilaDEditada;
    if(cantidadColumnas>1){
      for(var a=0;a<=cantidadFilas;a++){
      color[a].pop();
      BordeIzquierdo[a].pop();
      BordeSuperior[a].pop();
      BordeDerecho[a].pop();
      BordeInferior[a].pop();
      if(a<cantidadFilas){
        ValoresFilaD[a].pop();
        ValoresFilaDEditada[a].pop();
      }
     }
      cantidadColumnas--} 
    this.setState({
    cantidadColumnas:cantidadColumnas,
    color:color,
    BordeIzquierdo: BordeIzquierdo,
    BordeSuperior: BordeSuperior,
    BordeDerecho: BordeDerecho,
    BordeInferior: BordeInferior,
    ValoresFilaD:ValoresFilaD,
    ValoresFilaDEditada: ValoresFilaDEditada,
    });
  }

handleClickMasFilas(event) {
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var color=this.state.color;
  var BordeIzquierdo=this.state.BordeIzquierdo;
  var BordeSuperior=this.state.BordeSuperior;
  var BordeDerecho=this.state.BordeDerecho;
  var BordeInferior=this.state.BordeInferior;
  var ValoresColumna=this.state.ValoresColumna;
  var ValoresColumnaEditado=this.state.ValoresColumnaEditado;
  var ValoresFilaD=this.state.ValoresFilaD;
  var ValoresFilaDEditada=this.state.ValoresFilaDEditada;
  var ValoresTexto=this.state.ValoresTexto;
  var ValoresDato=this.state.ValoresDato;
  var ValoresPorcentaje=this.state.ValoresPorcentaje;
  ValoresFilaD.push([]);
  ValoresFilaDEditada.push([]);
  var ultimo=[];
  var ultimoBI=[];
  var ultimoBS=[];
  var ultimoBD=[];
  var ultimoBIn=[];
  var ultimoValCol=[];
  var ultimoValColEdi=[];
  for(var b=0;b<cantidadColumnas;b++){
    var ultimocolor=color[cantidadFilas][b];
    var ultimobi=BordeIzquierdo[cantidadFilas][b];
    var ultimobs=BordeSuperior[cantidadFilas][b];
    var ultimobd=BordeDerecho[cantidadFilas][b];
    var ultimobin=BordeInferior[cantidadFilas][b];
    var ultimovalcol=ValoresColumna[cantidadFilas-1][b];
    var ultimovalcoledi=ValoresColumnaEditado[cantidadFilas-1][b];
    ultimo.push(ultimocolor);
    ultimoBI.push(ultimobi);
    ultimoBS.push(ultimobs);
    ultimoBD.push(ultimobd);
    ultimoBIn.push(ultimobin);
    ultimoValCol.push(ultimovalcol);
    ultimoValColEdi.push(ultimovalcoledi);
  }
  color.push(ultimo);
  BordeIzquierdo.push(ultimoBI);
  BordeSuperior.push(ultimoBS);
  BordeDerecho.push(ultimoBD);
  BordeInferior.push(ultimoBIn);
  ValoresColumna.push(ultimoValCol);
  ValoresColumnaEditado.push(ultimoValColEdi)
  ValoresTexto.push([]);
  ValoresDato.push([]);
  ValoresPorcentaje.push([]);
    cantidadFilas++;   
    this.setState({
    cantidadFilas:cantidadFilas,
    color:color,
    BordeIzquierdo: BordeIzquierdo,
    BordeSuperior: BordeSuperior,
    BordeDerecho: BordeDerecho,
    BordeInferior: BordeInferior,
    ValoresColumna: ValoresColumna,
    ValoresColumnaEditado: ValoresColumnaEditado,
    ValoresTexto:ValoresTexto,
    ValoresDato: ValoresDato,
    ValoresPorcentaje:ValoresPorcentaje,
    });
  }

handleClickMenosFilas(event) {
    var cantidadFilas=this.state.cantidadFilas;
    var color=this.state.color;
    var BordeIzquierdo=this.state.BordeIzquierdo;
    var BordeSuperior=this.state.BordeSuperior;
    var BordeDerecho=this.state.BordeDerecho;
    var BordeInferior=this.state.BordeInferior;
    var ValoresColumna=this.state.ValoresColumna;
    var ValoresColumnaEditado=this.state.ValoresColumnaEditado;
    var ValoresFilaD=this.state.ValoresFilaD;
    var ValoresFilaDEditada=this.state.ValoresFilaDEditada;
    var ValoresTexto=this.state.ValoresTexto;
    var ValoresDato=this.state.ValoresDato;
    var ValoresPorcentaje=this.state.ValoresPorcentaje
    if(cantidadFilas>1){
      ValoresFilaD.pop();
      ValoresFilaDEditada.pop();
      color.pop();
      BordeIzquierdo.pop();
      BordeSuperior.pop();
      BordeDerecho.pop();
      BordeInferior.pop();
      ValoresColumna.pop();
      ValoresColumnaEditado.pop();
      ValoresTexto.pop();
      ValoresDato.pop();
      ValoresPorcentaje.pop();
      cantidadFilas--;    
    }
    this.setState({
    cantidadFilas:cantidadFilas,
    color:color,
    BordeIzquierdo: BordeIzquierdo,
    BordeSuperior: BordeSuperior,
    BordeDerecho: BordeDerecho,
    BordeInferior: BordeInferior,
    ValoresColumna: ValoresColumna,
    ValoresColumnaEditado: ValoresColumnaEditado,
    });
  }

   render(){
    var cantidadColumnas=this.state.cantidadColumnas;
    var cantidadFilas=this.state.cantidadFilas;
    var col=[];
    for(var a=0;a<cantidadColumnas;a++){col[a]=a}
    const columnasEn = col.map((columna) =>
      <li key={'columna'+columna.toString()} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'15%', margin:'2px 0px', fontSize:'0.5em'}}>{'Col '+(columna+1)}</p>
        <input type="text"  style={{width:'75%', display:'inline-block',margin:'2px 0px'}} id={'columna'+columna} onChange={this.handleChangeEncab} />
      </li>
      );

    var col=[];
    for(var a=0;a<cantidadColumnas;a++){col[a]=a}
    const columnasVal = col.map((columna) =>
      <li key={'valorcolumna'+columna.toString()} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'15%', margin:'2px 0px', fontSize:'0.5em'}}>{'Col '+(columna+1)}</p>
        <select style={{width:'75%', display:'inline-block',margin:'2px 0px'}} id={'sel'+columna} onChange={this.handleChangeValores}>
            <option value={0}></option>
            <option value={1}>Titulo Fila</option>
            <option value={2}>Dato</option>
            <option value={3}>Sumatoria</option>
            <option value={4}>Minimo</option>
            <option value={5}>Maximo</option>
            <option value={6}>Promedio Simple</option>
            <option value={7}>Promedio Ponderado</option>
            <option value={8}>Porcentaje</option>
            <option value={9}>Texto</option>
          </select>
      </li>
      );

    var BaseDatos=this.props.BaseDatos;
    const opciones = BaseDatos.map((opcion) =>
       <option key={opcion.toString()}>{opcion}</option>
      );
    var fil=[];
    for(var a=0;a<cantidadFilas;a++){fil[a]=a}
    const filasD = fil.map((fila) =>
      <li key={'baseFila'+fila.toString()} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'15%', margin:'2px 0px', fontSize:'0.5em'}}>{'Fila '+(fila+1)}</p>
        <select style={{width:'78%', display:'inline-block',margin:'2px 0px', fontSize:'0.6em'}} id={'filaD'+fila} onChange={this.handleChangeFila}>
            {opciones}
          </select>
      </li>
      );

    
    var EncabezadoColumna=this.state.EncabezadoColumna;
    var ValoresColumna=this.state.ValoresColumna;
    var ValoresColumnaEditado=this.state.ValoresColumnaEditado;
    var ValoresFilaD=this.state.ValoresFilaD;
    var ValoresFilaDEditada=this.state.ValoresFilaDEditada
    
    var color=this.state.color;
    var BordeIzquierdo=this.state.BordeIzquierdo;
    var BordeSuperior=this.state.BordeSuperior;
    var BordeDerecho=this.state.BordeDerecho;
    var BordeInferior=this.state.BordeInferior;
    var ValEdit=[];
    var ValEdit1=[];
    var co=[];
    for(var x=0;x<cantidadColumnas;x++){
      co[x]=x;
    }
    
    var fi=[];
    for(var x=0;x<cantidadFilas;x++){
      fi[x]=x;
      ValEdit[x]=co.map((columna)=> 
      <div>
      <h3 key={'valedit'+x+'-'+columna} id={'valedit'+x+'-'+columna} 
           style={{}} >{ValoresColumnaEditado[x][columna]}</h3>
      <h3 key={'valedit1'+x+'-'+columna} id={'valedit1'+x+'-'+columna} 
           style={{}} >{ValoresFilaDEditada[x][columna]}</h3>
      </div>
      );
    }

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
                }} >{ValEdit[x-1][columna]}</td>
      );
    }

    var filas=fi.map((fila)=>
      <tr key={'fila'+fila.toString()}>
        {columnas[fila]}
      </tr>
      );

    return (
        <div>
          <input type="button" value="Confirmar" onClick={this.onClick}/>
          <p style={{width:'50%'}}>COLUMNAS</p>
          <input type="button" className="BotonMas" value="+" onClick={this.handleClickMasColumnas} />
          <input type="button" className="BotonMas" value="-" onClick={this.handleClickMenosColumnas} />
          <p style={{width:'90%', marginTop:'5px'}}>Encabezado</p> 
          <div>
          <ul>{columnasEn}</ul>
          </div>
          <p style={{marginTop:'5px'}} >Valores</p> 
           <div>
            <ul>{columnasVal}</ul>
          </div>
          <p style={{width:'50%'}}>FILAS</p>
          <input type="button" className="BotonMas" value="+" onClick={this.handleClickMasFilas} />
          <input type="button" className="BotonMas" value="-" onClick={this.handleClickMenosFilas} />
          <p style={{width:'90%', marginTop:'5px'}}>Buscar Datos en</p> 
          <div>
            <ul>{filasD}</ul>
          </div>
          <div className="PanelEdicion">
          <p style={{margin:'10px 0px', width:'100%'}}>Editar Tabla</p>
          <input type="color" id="colorcolumna" onChange={this.handleChangeColor} />
          <div className="BordeIzquierdo" id="BordeIzquierdo" onClick={this.handleClickBordeIzquierdo}></div>
          <div className="BordeSuperior" id="BordeSuperior" onClick={this.handleClickBordeSuperior}></div>
          <div className="BordeDerecho" id="BordeDerecho" onClick={this.handleClickBordeDerecho}></div>
          <div className="BordeInferior" id="BordeInferior" onClick={this.handleClickBordeInferior}></div>
           <div>
            <table className="Tabla">
            <tbody>
            <tr>{columnasencab}</tr>
            {filas}
          </tbody>
          </table>
          </div>
          </div>
        </div>
        );
 }
}
export default TablaEditada;
