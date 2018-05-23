import React, { Component } from 'react';

class Comentario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [""],
      parrafo: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(event) {
  var id=event.target.id.split('-')[0];
  if(document.getElementById('Elemento'+id).style.opacity==0.4){
    document.getElementById('Elemento'+id).style.opacity=1;
  }else{
    var TipoElemento=this.props.TipoElemento;
    var TitulosPanel =["","Logo","Título", "Comentario","Tabla","Gráfico"];
    document.getElementById('TituloPanel').innerHTML=TitulosPanel[TipoElemento];
    document.getElementById('panelElemento').style.visibility='visible';
    var mostrarOp=[[],[4,5,6],[1,2,5,6],[1,2,3,4,6],[7],[8]];
    for(var a=1;a<=8;a++){
      document.getElementById('Op'+a).style.display='none';
      for(var b=0;b<mostrarOp[TipoElemento].length;b++){
       if(mostrarOp[TipoElemento][b]==a){document.getElementById('Op'+a).style.display='inline-block'}
      }
    }

    document.getElementById('botonOkElemento').style.display='none';
    document.getElementById('botonModifElemento').style.display='inline-block';
    document.getElementById('Elemento'+id).style.opacity=0.4;
  }
}

  handleChange(event) {
    var idcambiar=event.target.id;
    var idcambiar1=idcambiar.split('-')[1];
    var value1 = this.state.value;
    value1[idcambiar1] = event.target.value;
    this.setState({value: value1});
    var elem=document.getElementById(idcambiar);
    if (elem.clientHeight < elem.scrollHeight){
      var nuevoHeight = (document.getElementById(idcambiar).offsetHeight+(elem.scrollHeight-elem.clientHeight))+'px';
      document.getElementById(idcambiar).style.height=nuevoHeight;
    }
  }
  handleKeyDown(event) {
    if (event.key ==='Tab'){
      var parrafo = this.state.parrafo+1;
      this.setState({parrafo: parrafo})
      var value1 = this.state.value;
      value1.push('');
      this.setState({value: value1});
  }
}
onBlur(event) {
  var idfijar=event.target.id;
  document.getElementById(idfijar).style.height='auto';
 // if(document.getElementById(idfijar).offsetHeight<50){document.getElementById(idfijar).style.height='24px'}
  var elem=document.getElementById(idfijar);
    if (elem.clientHeight < elem.scrollHeight){
      var nuevoHeight = (document.getElementById(idfijar).offsetHeight+(elem.scrollHeight-elem.clientHeight))+'px';
      document.getElementById(idfijar).style.height=nuevoHeight;
    }
  if(document.getElementById(idfijar).value!==''){document.getElementById('bullet'+idfijar).style.visibility='visible'} else {document.getElementById('bullet'+idfijar).style.visibility='hidden'}
  }
  render() {
    var parrafo=this.state.parrafo;
    var NumeroElemento=this.props.NumeroElemento;
    var ElementoWidth=this.props.ElementoWidth;
    var ElementoMarginTop=this.props.ElementoMarginTop;
    var ElementoMarginRight=this.props.ElementoMarginRight;
    var ElementoMarginLeft=this.props.ElementoMarginLeft;
    var ElementoSize=this.props.ElementoSize;
    var ElementoColor=this.props.ElementoColor;
    var VinetaColor=this.props.VinetaColor;
    var VinetaSize=ElementoSize/2.5;
    var MarginBullet=parseFloat(ElementoMarginTop)+10;
    var l=[];
    for(var x=0;x<=parrafo;x++){
      l[x]=x;
    }

    const lineas = l.map((linea) =>
      <li key={linea.toString()} className="Bullet">
        <div className="Bullet1" id={'bullet'+NumeroElemento+'-'+linea}
            style={{
              marginLeft:ElementoMarginLeft+'px',
              marginTop:MarginBullet+'px',
              backgroundColor:VinetaColor,
              width:VinetaSize+'em',
              height:VinetaSize+'em',
            }}
        ></div>
        <textarea autoFocus className="Comentario" placeholder="Agregar Texto" value={this.state.value[linea]} 
                  onChange={this.handleChange} 
                  onKeyDown={this.handleKeyDown} 
                  id={NumeroElemento+'-'+linea}
                  onBlur={this.onBlur}
                  style={{
                    width:ElementoWidth+'px',
                    marginTop:ElementoMarginTop+'px',
                    marginRight:ElementoMarginRight+'px',
                    color:this.props.ElementoColor,
                    fontSize:ElementoSize+'em',
                    height:ElementoSize+'em,'
                  }}
                  onClick={this.handleClick}
                  />
      </li>);

    return (
    <div>
      <ul id={'Elemento'+NumeroElemento}>
          {lineas}
      </ul>
      <div className="Grafico">
            </div>
    </div>
    );
  }
}
export default Comentario;

