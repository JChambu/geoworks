import React, { Component } from 'react';

class Chart extends Component {
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData,
      chartOption:props.chartOption,
      seriePeor:props.seriePeor,
      criterioPeor:props.criterioPeor,
      anchografico:props.anchografico,
      margenizquierdo:props.margenizquierdo,
      margenderecho:props.margenderecho,
      margensuperior:props.margensuperior,
      margeninferior:props.margeninferior,
      giro:props.giro,
  }
}

  render(){
    var chartOption=this.state.chartOption;
    var criterioPeor=this.state.criterioPeor;
    var seriePeor=this.state.seriePeor;
    var chartData=this.state.chartData;
    var anchografico=this.state.anchografico;
    var margenizquierdo=this.state.margenizquierdo;
    var margenderecho=this.state.margenderecho;
    var margensuperior=this.state.margensuperior;
    var margeninferior=this.state.margeninferior;
    var giro=this.state.giro;
    if(giro==180){var desplaz=20}else{var desplaz=0}
    var margen=[];
    var margen1=[];
    var margenanterior=0;
    var Visible=[];
    var triangulo=[];
    for(var x=0;x<3;x++){
      if(chartData['datasets'][x]['yAxisID']==='left-y-axis'){var Eje=0}
      if(chartData['datasets'][x]['yAxisID']==='right-y-axis'){var Eje=2}
      var maximo=this.state.chartOption['scales']['yAxes'][Eje]['ticks']['max'];

      if(criterioPeor[x]==='Max'){var peor=Math.max.apply(false,chartData['datasets'][x]['data'])}
      var indicePeor=chartData['datasets'][x]['data'].indexOf(peor);
      var posicion = 1/(chartData['datasets'][x]['data'].length)*(indicePeor+1)-0.5/chartData['datasets'][x]['data'].length;
      margen1[x] = margenizquierdo+posicion*(anchografico-(margenizquierdo+margenderecho))+'px';
      margen[x] = (maximo-peor)*(540-(margensuperior+margeninferior))/maximo+margensuperior-margenanterior-20+desplaz +'px';
      margenanterior =(maximo-peor)*(540-120)/maximo+margensuperior;
      if(seriePeor[x]===0){Visible[x]='hidden'}else{Visible[x]='visible'}
      if(seriePeor[x]===1){triangulo[x]='triangulo'}
      if(seriePeor[x]===2){triangulo[x]='triangulo1'}
    }
       return (
      <div>
      <div className={triangulo[0]} style={{marginLeft:margen1[0], marginTop:margen[0], transform:'rotate('+giro+'deg)', visibility: Visible[0]}}></div>
      <div className={triangulo[1]} style={{marginLeft:margen1[1], marginTop:margen[1], transform:'rotate('+giro+'deg)', visibility: Visible[1]}}></div>
      <div className={triangulo[2]} style={{marginLeft:margen1[2], marginTop:margen[2], transform:'rotate('+giro+'deg)', visibility: Visible[2]}}></div>
      </div>
      )
  }
}
export default Chart;