import React, { Component } from 'react';
import logo from './logo.png';

class Logo extends Component {
  constructor(props){
    super(props);
    this.state = {
      
  }
    this.handleClick = this.handleClick.bind(this);
}

handleClick(event) {
  var NumeroElemento=this.props.NumeroElemento;
  var TipoElemento=this.props.TipoElemento;
  var id=event.target.id;
  if(document.getElementById(id).style.opacity==0.4){
    document.getElementById(id).style.opacity=1;
  }else{
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
    document.getElementById(id).style.opacity=0.4;
  }
}
  render(){
    var NumeroElemento=this.props.NumeroElemento;
    var ElementoWidth=this.props.ElementoWidth;
    var ElementoAlign=this.props.ElementoAlign;
    var ElementoMarginTop=this.props.ElementoMarginTop;
    var ElementoMarginRight=this.props.ElementoMarginRight;
    var ElementoMarginLeft=this.props.ElementoMarginLeft;
   
    return (
      <div id={'Elementodiv'+NumeroElemento}style={{textAlign:ElementoAlign, width:'100%'}} autoFocus>
        <img src={logo} className="Logo" alt="logo" 
          style={{width:ElementoWidth+'px', 
                  marginTop:ElementoMarginTop+'px',
                  marginRight:ElementoMarginRight+'px',
                  marginLeft:ElementoMarginLeft+'px',
                }}
          onClick={this.handleClick}
          id={'Elemento'+NumeroElemento}
           />
      </div>
      )
  }
}
export default Logo;