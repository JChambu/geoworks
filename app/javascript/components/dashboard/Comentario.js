import React, { Component } from 'react';

class Comentario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [""],
      parrafo: 0,
      idcomentario:props.idcomentario,
      classbullet:props.classbullet,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(event) {
    var idcambiar=event.target.id;
    var idcambiar1=idcambiar.substring(2);
    var value1 = this.state.value;
  //  var parrafo=this.state.parrafo;
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
  if(document.getElementById(idfijar).offsetHeight<50){document.getElementById(idfijar).style.height='24px'}
  var elem=document.getElementById(idfijar);
    if (elem.clientHeight < elem.scrollHeight){
      var nuevoHeight = (document.getElementById(idfijar).offsetHeight+(elem.scrollHeight-elem.clientHeight))+'px';
      document.getElementById(idfijar).style.height=nuevoHeight;
    }
  if(document.getElementById(idfijar).value!==''){document.getElementById('bullet'+idfijar).style.visibility='visible'} else {document.getElementById('bullet'+idfijar).style.visibility='hidden'}
  }
  render() {
    var parrafo=this.state.parrafo;
    var comentario=this.state.idcomentario;
    var l=[];
    for(var x=0;x<=parrafo;x++){
      l[x]=x;
    }
    var classbullet=this.state.classbullet;
    const lineas = l.map((linea) =>
      <li key={linea.toString()} className="Bullet">
        <div className={classbullet} id={'bullet'+comentario+'-'+linea}></div>
        <textarea className="Comentario" placeholder="Agregar Texto" value={this.state.value[linea]} 
                  onChange={this.handleChange} 
                  onKeyDown={this.handleKeyDown} 
                  id={comentario+'-'+linea}
                  onBlur={this.onBlur}
                  />
      </li>);

    return (
    <div>
      <ul>
          {lineas}
      </ul>
      <div className="Grafico">
          </div>
    </div>
    );
  }
}
export default Comentario;

