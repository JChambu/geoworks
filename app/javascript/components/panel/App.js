import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import logoGeo from './logoGeo.svg';
import logocliente from './logocliente.png';
import folder from './folder1.png';
import mapa from './mapa.png';
import reporte from './reporte.png';
import bullet from './bullet.png';
import texto from './texto.png';
import comentario from './comentario.png';
import panel from './panel.png';
import cuadrado from './cuadrado.png';
import engranajes from './engranajes.png';
import dashboard from './dashboard.png';
import grafico from './grafico.png';
import icon1 from './icon1.svg';
import icon2 from './icon2.svg';
import icon3 from './icon3.svg';
import icon4 from './icon4.svg';
import icon5 from './icon5.svg';
import mapaejemplo from './mapaejemplo.jpg';
import VectorComentario from './components/VectorComentario';
import VectorTabla from './components/VectorTabla';
import VectorGrafico from './components/VectorGrafico';
import Logo from './components/Logo';
import Titulo from './components/Titulo';
import Chart from './components/Chart';
import Comentario from './components/Comentario';
import Tabla from './components/Tabla';
import TablaEditada from './components/TablaEditada';
import MejoresPeores from './components/MejoresPeores';

class App extends Component {
  constructor(){
    super();
    this.state = {
      panelVisible:['block',"none","none","none","none","none","none","none"],
      PanelHover:[1],
      Campos:[],
      CamposCreados:[],
      displayOpAnalisis:[['none','none','none','none']],
      Analisis:[0],

      estadopanel:0,
      Elementos:[],
      cantidadElementos:0,
      AnchoGrafico:[],
      TipoElemento:[],
      ElementoWidth:[],
      ElementoAlign:[],
      ElementoMarginTop:[],
      ElementoMarginRight:[],
      ElementoMarginLeft:[],
      ElementoSize:[],
      ElementoColor:[],
      VinetaColor:[],

      BaseDatos:["","Oferta Edificios","Disponibilidad","Disponibilidad (sin Gespania)","Venta Mensual","Meses para Agotar Stock","Superficie Util Promedio","Superficie Terraza","Precio Lista | UF","Precio Unitario | UFm2","PxQ Mensual | UF miles"],
      cantidadColumnas:1,
      cantidadFilas:1,
      EncabezadoColumna:[],
      ValoresColumna:[[]],
      ValoresColumnaEditado:[[]],
      ValoresFilaD:[[]],
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
      
      chartDataElemento:[],
      chartOptionElemento:[],
      chartOption:{ 
        maintainAspectRatio: false,
        elements:{
            line:{
              borderWidth:0
            }
          },
          legend:{
            display: true,
            position:'bottom',
            labels:{
              boxWidth:40,
              padding:10,
              usePointStyle:true,
            },
          },
          scales: {
            yAxes: [{
          id: 'left-y-axis',
          type: 'linear',
          position: 'left',
          }
        ,{
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
          }
        ] ,
            xAxes: [{
              id: 'x-axis',
              barPercentage:1,
              categoryPercentage: 1,
            }]
          }},
      DatosXTitulo:["","Periodo","Año","Estado de Obra","Programa", "Edificios","Venta Mensual en Régimen","Superficie Util"],
      DatosX:[
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['2013','2014','2015','2016','2017','2018'],
      ["No Iniciado","Excavaciones","Obra Gruesa","Terminaciones","Finalizado"],
      ["1,0","1,1","1,2","2,0","2,1","3,0"],
      ],
      DataSets: [{
                label:"Nueva Serie",
                data: [1,2,3,4,5], 
                type: 'bar',
                }],
      labels:[1,2,3,4,5],
      cantidadSeries:1,
      DatosSeriesTexto:[["","Oferta Total","Disponibilidad Total","# Edificios","VM Comuna","VM x Edificio", "MAS","UF","m2","UFm2"],
                        ["","Superficie Promedio","Precio Promedio","Precio Unitario","Ventas Mensuales","Ventas Mensuales Bajo UF3.400","Ventas Mensuales UF3400 a UF7950","Ventas Mensuales sobre UF7950"],
                        ["","Venta","Disponible"],
                        ["","Absorción","Meses de Stock"]
                        ],
      DatosSeries:[
                  [[1490,1320,1030,1220,680,700,600,1325,1560,2109],
                  [500,300,100,120,290,290,220,836,910,837],
                  [13,12,10,11,7,8,7,11,13,17],
                  [29,31,20,12,28,33,19,45,68,80],
                  [2.8,3,2.7,1.4,5,5.1,3.3,4.1,4.9,4.7],
                  [14,8.5,5,7,9,8,11,18.7,12,10.5],
                  [6550,6650,7380,7100,4750,5050,5800,5084,5010,5049],
                  [95,94,97,95,68,66,67,64,66,65],
                  [55,56,60,61,60,66,67,67.9,65.8,66.4]],

                  [[94,95.1,82,66.4,64.7,65],
                  [6550,7010,5980,5155,5045,5049],
                  [54.8,58,60.5,66.2,66.5,66.4],
                  [32,29,21,28,54,80],
                  [3,2,0,0,0,0],
                  [18,19,21,28,49,69],
                  [32,29,20,28,59,80]],

                  [[240,0,480,320,240],
                  [560,0,280,251,25]],

                  [[4.2,5.6,1.7,4.1,3.2,2.5],
                  [16,9,30,11,28,25]]
                  ],
      SelectDatos:[],




      idcomentario: [0,1,2,3,4,5,6,7,8,9,10],
      datosTabla:{},
      colorCelda:{},
//      BordeSuperior:{},
 //     BordeDerecho:{},
  //    BordeInferior:{},
   //   BordeIzquierdo:{},
      AnchoMax:{},
      Alineacion:{},
      ColSpan:{},
      RowSpan:{},
      TamañoLetra:{},
      Padding:{},
      seriePeor:{},
      criterioPeor:{},
      anchografico:[450,450,450,450,450,450,450,650,450,450,450,450,450,450,450,650,650,650],
      margenizquierdo:[60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,40],
      margenderecho:[60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60],
      margensuperior:[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,50,50],
      margeninferior:[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,55,55],
      giro:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,180],
}
    this.handleClickElemento = this.handleClickElemento.bind(this);
    this.handleClickNuevoElemento = this.handleClickNuevoElemento.bind(this);
    this.handleClickCancelElemento = this.handleClickCancelElemento.bind(this);
    this.handleClickModifElemento = this.handleClickModifElemento.bind(this);

    this.onAlert=this.onAlert.bind(this);
    this.handleClickMasSeries=this.handleClickMasSeries.bind(this);
    this.handleClickMenosSeries=this.handleClickMenosSeries.bind(this);
    this.handleChangeDatosX=this.handleChangeDatosX.bind(this);
    this.handleChangeSerie=this.handleChangeSerie.bind(this);
    this.handleChangeOptions=this.handleChangeOptions.bind(this);
    this.handleChangeAnchoGrafico=this.handleChangeAnchoGrafico.bind(this);
    this.onClickGrafico=this.onClickGrafico.bind(this);
    this.handleClickCampos=this.handleClickCampos.bind(this);
    this.onAjaxCallback=this.onAjaxCallback.bind(this);
    this.handleClickBotonesLaterales=this.handleClickBotonesLaterales.bind(this);
    this.handleClickBotonesNuevo=this.handleClickBotonesNuevo.bind(this);
    this.handleChangeAnalisis=this.handleChangeAnalisis.bind(this);
    this.handleClickMasAnalisis=this.handleClickMasAnalisis.bind(this);
    this.handleClickMenosAnalisis=this.handleClickMenosAnalisis.bind(this);
    this.handleChangeNombreCampoAnalisis=this.handleChangeNombreCampoAnalisis.bind(this);
    this.handleClickGuardarAnalisis=this.handleClickGuardarAnalisis.bind(this);
    this.onAjaxCallback1=this.onAjaxCallback1.bind(this);

//    this.handleClickLapiz = this.handleClickLapiz.bind(this);

}


handleChangeNombreCampoAnalisis(event) {
  var id=event.target.id.substring(13);
  var CamposCreados=this.state.CamposCreados;
  CamposCreados[id]=document.getElementById('campoAnalisis'+id).value;
   this.setState({
   CamposCreados:CamposCreados
    });
}

handleClickMasAnalisis(event) {
 var Analisis=this.state.Analisis;
 var ultimo=Analisis[Analisis.length-1]
 Analisis.push(ultimo+1);
 var displayOpAnalisis=this.state.displayOpAnalisis;
 displayOpAnalisis.push(['none','none','none','none']);
  this.setState({
    Analisis:Analisis,
    displayOpAnalisis:displayOpAnalisis,
    });
}
handleClickMenosAnalisis(event) {
 var Analisis=this.state.Analisis;
 var displayOpAnalisis=this.state.displayOpAnalisis;
 if(Analisis.length>1){
  Analisis.pop();
  displayOpAnalisis.pop();
 }
  this.setState({
    Analisis:Analisis,
    displayOpAnalisis:displayOpAnalisis,
    });
}
handleChangeAnalisis(event) {
  var id=event.target.id.substring(12);
  var op=event.target.selectedIndex;
  var displayOpAnalisis=this.state.displayOpAnalisis;
  if(op==0){displayOpAnalisis[id][0]='none'} else{displayOpAnalisis[id][0]='inline-block';}
  for(var x=1; x<4;x++){
    if(x==op){displayOpAnalisis[id][x]='inline-block'} else{displayOpAnalisis[id][x]='none';}
  }
  this.setState({
    displayOpAnalisis:displayOpAnalisis,
    });
  
}
handleClickBotonesNuevo(event) {
  var id=event.target.id;
  if(id==''){id=event.target.parentElement.id}
  id=id.substring(10);
  var panelVisible=this.state.panelVisible;
  for(var x=0; x<8;x++){
    if(x==id){
      panelVisible[x]='block';
    }
  else{
    panelVisible[x]='none';
  }
  }
  this.setState({
    panelVisible:panelVisible,
    });
  
}
handleClickBotonesLaterales(event) {
  var id=event.target.id;
  if(id==''){id=event.target.parentElement.id}
  id=id.substring(12);
  var panelVisible=this.state.panelVisible;
  var PanelHover=this.state.PanelHover;
  for(var x=0; x<8;x++){
    if(x==id){
      panelVisible[x]='block';
      PanelHover[x]=1;
    }
  else{
    panelVisible[x]='none';
    PanelHover[x]=0.5;
  }
  }
  this.setState({
    panelVisible:panelVisible,
    PanelHover:PanelHover
    });
  
}

handleChangeAnchoGrafico(event) {
  var AnchoGrafico=document.getElementById('AnchoGrafico').value;
  document.getElementById('PanelEdicion').style.width=AnchoGrafico+'%';
  
}
handleChangeOptions(event) {
      var tituloGrafico=document.getElementById('tituloGrafico').value;
      var NombreEje1=document.getElementById('NombreEje1').value;
      var NombreEje2=document.getElementById('NombreEje2').value;
      var MinEje1=document.getElementById('MinEje1').value;
      var MinEje2=document.getElementById('MinEje2').value;
      var MaxEje1=document.getElementById('MaxEje1').value;
      var MaxEje2=document.getElementById('MaxEje2').value;
      var Step1=document.getElementById('Step1').value;
      var SubStep1=document.getElementById('SubStep1').value;
      var Ticks1={}
      if(MinEje1!='' && MaxEje1!='' & Step1!=''){var Ticks1={ min: parseInt(MinEje1),max: parseInt(MaxEje1),stepSize: parseInt(Step1),}}
      if(MinEje1!='' && MaxEje1!='' & Step1==''){var Ticks1={ min: parseInt(MinEje1),max: parseInt(MaxEje1),}}
      if(MinEje1!='' && MaxEje1=='' & Step1!=''){var Ticks1={ min: parseInt(MinEje1),stepSize: parseInt(Step1)}}
      if(MinEje1!='' && MaxEje1=='' & Step1==''){var Ticks1={min:parseInt(MinEje1)}}
      if(MinEje1=='' && MaxEje1=='' & Step1==''){var Ticks1={}}
      if(MinEje1=='' && MaxEje1!='' & Step1!=''){var Ticks1={max: parseInt(MaxEje1),stepSize: parseInt(Step1),}}
      if(MinEje1=='' && MaxEje1!='' & Step1==''){var Ticks1={max: parseInt(MaxEje1),}}
      if(MinEje1=='' && MaxEje1=='' & Step1!=''){var Ticks1={stepSize: parseInt(Step1),}}

      if(MinEje1!='' && MaxEje1!='' & SubStep1!=''){var Ticks2={display:false, min: parseInt(MinEje1),max: parseInt(MaxEje1),stepSize: parseInt(SubStep1),}}
      if(MinEje1!='' && MaxEje1!='' & SubStep1==''){var Ticks2={display:false, min: parseInt(MinEje1),max: parseInt(MaxEje1),}}
      if(MinEje1!='' && MaxEje1=='' & SubStep1!=''){var Ticks2={display:false, min: parseInt(MinEje1),stepSize: parseInt(SubStep1)}}
      if(MinEje1!='' && MaxEje1=='' & SubStep1==''){var Ticks2={display:false, min:parseInt(MinEje1)}}
      if(MinEje1=='' && MaxEje1=='' & SubStep1==''){var Ticks2={display:false, }}
      if(MinEje1=='' && MaxEje1!='' & SubStep1!=''){var Ticks2={display:false, max: parseInt(MaxEje1),stepSize: parseInt(SubStep1),}}
      if(MinEje1=='' && MaxEje1!='' & SubStep1==''){var Ticks2={display:false, max: parseInt(MaxEje1),}}
      if(MinEje1=='' && MaxEje1=='' & SubStep1!=''){var Ticks2={display:false, stepSize: parseInt(SubStep1),}}

      if(MinEje2!='' && MaxEje2!=''){var Ticks3={ min: parseInt(MinEje2),max: parseInt(MaxEje2)}}
      if(MinEje2!='' && MaxEje2==''){var Ticks3={min:parseInt(MinEje2)}}
      if(MinEje2=='' && MaxEje2==''){var Ticks3={}}
      if(MinEje2=='' && MaxEje2!=''){var Ticks3={max: parseInt(MaxEje2),}}
      var yAxes1= {
          scaleLabel: {
            display: true,
            labelString: NombreEje1,
          },
          id: 'left-y-axis',
          type: 'linear',
          position: 'left',
          ticks: Ticks1,
          gridLines: {
            drawOnChartArea: true,
          }
        }
        var yAxes2= {
          id: 'left-y-axis1',
          type: 'linear',
          position: 'left',
          ticks: Ticks2,
          gridLines: {
            drawOnChartArea: true,
            drawTicks: false,
          }
        }
        var yAxes3= {
          scaleLabel: {
            display: true,
            labelString: NombreEje2,
          },
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
          ticks: Ticks3,
          gridLines: {
            display: false,
          }
        }
        var yAxes = [];
        yAxes.push(yAxes1);
        yAxes.push(yAxes2);
        yAxes.push(yAxes3);

     var chartOption = {
        maintainAspectRatio: false,
        elements:{
            line:{
              borderWidth:0
            }
          },
          title: {
            display: true,
            text: tituloGrafico,
            fontSize: 18,
          },
          tooltips:{
            backgroundColor: 'rgb(173,189,210)',
            titleFontColor: 'rgb(115,115,115)',
            bodyFontColor: 'rgb(115,115,115)',
            intersect:false,
            caretSize:5,
          },
          legend:{
            display: true,
            position:'bottom',
            labels:{
              boxWidth:40,
              padding:10,
              usePointStyle:true,
            },
          },
          scales: {
            yAxes: yAxes ,
            xAxes: [{
              id: 'x-axis',
              barPercentage:1,
              categoryPercentage: 1,
            }]
          }
      }
 
     this.setState({
    chartOption:chartOption,
    });
}
handleChangeSerie(event) {
  var cantidadSeries=this.state.cantidadSeries;
  var DatosSeries=this.state.DatosSeries;
  var DataSets = [];
    for(var x=0;x<cantidadSeries;x++){
      var NombreSerie=document.getElementById('nomserie'+x).value;
      if(NombreSerie==''){NombreSerie="Serie"+(x+1)}
      var indiceX=document.getElementById('selectDatosX').selectedIndex;
      var indice=document.getElementById('dataserie'+x).selectedIndex;
      if (indiceX==0 || indice==0){DataSerie=[0,0,0,0]}else{var DataSerie=DatosSeries[indiceX-1][indice-1]}
      var IDAxis="left-y-axis";
      if(document.getElementById('EjeI'+x).checked==true){
        var IDAxis='left-y-axis'}
      if(document.getElementById('EjeD'+x).checked==true){
        var IDAxis='right-y-axis'}
      var backgroundColor="#6F98FC";
      backgroundColor=document.getElementById('colorserie'+x).value;
      var borderColor=backgroundColor;
      var TypeChart="bar";
      var Fill=false;
      var PointStyle='rect';
      var PointStyleString=['line','triangle','circle','rect'];
      var PointRadius=0;
      if(document.getElementById('tiposerieA'+x).checked==true){
        TypeChart='bar';
        PointStyle='rect';
      }
      if(document.getElementById('tiposerieB'+x).checked==true){
        TypeChart='line';
        PointStyle='line'
      }
      if(document.getElementById('tiposerieD'+x).checked==true){
        TypeChart='line';
        PointStyle='circle'
        borderColor='transparent';
        PointRadius=5;
      }
      if(document.getElementById('tiposerieC'+x).checked==true){
        TypeChart='line';
        Fill=true;
        PointStyle='line';
      }

          DataSets[x] = {
          label:NombreSerie,
          data: DataSerie, 
          yAxisID: IDAxis,
          type: TypeChart,
          fill: Fill,
          lineTension: 0,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          pointStyle:PointStyle,
          pointRadius:PointRadius,
          }
        }

    this.setState({
    DataSets:DataSets,
    });
}

handleChangeDatosX(event) {
  var DatosX=this.state.DatosX
  var indice=document.getElementById('selectDatosX').selectedIndex;
  if(indice==0){var labels=[1,2,3,4,5]}else{var labels=DatosX[indice-1]}
    this.setState({
    labels:labels,
    });

//carga opciones
    var cantidadSeries=this.state.cantidadSeries;
    var fil=[];
    for(var a=0;a<cantidadSeries;a++){fil[a]=a}
  var DatosSeriesTexto=this.state.DatosSeriesTexto;
    const opcionesDatosSeries = DatosSeriesTexto[indice-1].map((opcion) =>
       <option key={opcion.toString()}>{opcion}</option>
      );
    const SelectDatos = fil.map((fila) =>
      <li key={'datos'+fila} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.5em'}}>{'Serie '+(fila+1)}</p>
        <select style={{width:'70%', display:'inline-block',margin:'2px 0px', fontSize:'0.6em'}} id={'dataserie'+fila} onChange={this.handleChangeSerie}>
            {opcionesDatosSeries}
          </select>
      </li>
      );
    this.setState({
    SelectDatos:SelectDatos,
    });
}

handleClickMasSeries(event) {

  var cantidadSeries=this.state.cantidadSeries;
    cantidadSeries++; 
    var DatosX=this.state.DatosX
    var indice=document.getElementById('selectDatosX').selectedIndex;  
     var fil=[];
    for(var a=0;a<cantidadSeries;a++){fil[a]=a}
    var DatosSeriesTexto=this.state.DatosSeriesTexto;
    const opcionesDatosSeries = DatosSeriesTexto[indice-1].map((opcion) =>
       <option key={opcion.toString()}>{opcion}</option>
      );
    const SelectDatos = fil.map((fila) =>
      <li key={'datos'+fila} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.5em'}}>{'Serie '+(fila+1)}</p>
        <select style={{width:'70%', display:'inline-block',margin:'2px 0px', fontSize:'0.6em'}} id={'dataserie'+fila} onChange={this.handleChangeSerie}>
            {opcionesDatosSeries}
          </select>
      </li>
      );

    this.setState({
    cantidadSeries:cantidadSeries,
    SelectDatos:SelectDatos,
    });
  }

handleClickMenosSeries(event) {
  var cantidadSeries=this.state.cantidadSeries;
    if(cantidadSeries>1){
    cantidadSeries--;  
    var indice=document.getElementById('selectDatosX').selectedIndex;  
     var fil=[];
    for(var a=0;a<cantidadSeries;a++){fil[a]=a}
    var DatosSeriesTexto=this.state.DatosSeriesTexto;
    const opcionesDatosSeries = DatosSeriesTexto[indice-1].map((opcion) =>
       <option key={opcion.toString()}>{opcion}</option>
      );
    const SelectDatos = fil.map((fila) =>
      <li key={'datos'+fila} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.5em'}}>{'Serie '+(fila+1)}</p>
        <select style={{width:'70%', display:'inline-block',margin:'2px 0px', fontSize:'0.6em'}} id={'dataserie'+fila} onChange={this.handleChangeSerie}>
            {opcionesDatosSeries}
          </select>
      </li>
      );
    this.setState({
    SelectDatos:SelectDatos,
    });
 
    }
    this.setState({
    cantidadSeries:cantidadSeries,
    });
  }


onAlert(event,cantidadFilas, cantidadColumnas,EncabezadoColumna,color,
  BordeIzquierdo,BordeSuperior,BordeDerecho,BordeInferior,ValoresColumna, ValoresFilaD,ValoresTexto,ValoresDato,ValoresPorcentaje){
  this.setState({
    cantidadFilas:cantidadFilas,
    cantidadColumnas:cantidadColumnas,
    EncabezadoColumna:EncabezadoColumna,
    color:color,
    BordeIzquierdo:BordeIzquierdo,
    BordeSuperior:BordeSuperior,
    BordeDerecho:BordeDerecho,
    BordeInferior:BordeInferior,
    ValoresColumna: ValoresColumna,
    ValoresFilaD: ValoresFilaD,
    ValoresTexto:ValoresTexto,
    ValoresDato:ValoresDato,
    ValoresPorcentaje:ValoresPorcentaje,
    });
}

onClickGrafico(event,chartData,chartOption,NumeroElemento){
  var labels=chartData.labels;
  var DataSets=chartData.datasets;
  var cantidadElementos=this.state.cantidadElementos;
  for(var a=0;a<cantidadElementos;a++){
    if(a!=NumeroElemento){document.getElementById('Elemento'+a).style.opacity=1}
  }
  document.getElementById('PanelCentral').style.visibility='hidden';
  this.setState({
    chartOption:chartOption,
    labels:labels,
    DataSets:DataSets
    });
}

handleClickElemento(event) {
    var idt=event.target.id;
    if(idt==''){idt=event.target.parentElement.id}
    var id=idt.substring(10)
    var TitulosPanel =["","Indicador","Mapa", "Comentario","Tabla","Grafico"];
    document.getElementById('TituloPanel').innerHTML=TitulosPanel[id];
    document.getElementById('panelElemento').style.visibility='visible';
    var estadopanel=id;
    document.getElementById('botonOkElemento').style.display='inline-block';
    document.getElementById('botonModifElemento').style.display='none';
    var mostrarOp=[[],[4,5,6],[1,2,5,6],[1,2,3,4,6],[7],[8],];
    for(var a=1;a<=8;a++){
      document.getElementById('Op'+a).style.display='none';
      for(var b=0;b<mostrarOp[estadopanel].length;b++){
       if(mostrarOp[estadopanel][b]==a){document.getElementById('Op'+a).style.display='inline-block'}
      }
    }

    if(estadopanel==4 || estadopanel==5){
      document.getElementById('PanelCentral').style.visibility='hidden';
    }      
    this.setState({
    estadopanel:estadopanel,
    });
  }

handleClickNuevoElemento(event) {
   var estadopanel=this.state.estadopanel;
   var ElementoWidth=this.state.ElementoWidth;
   var ElementoAlign=this.state.ElementoAlign;
   var ElementoMarginTop=this.state.ElementoMarginTop;
   var ElementoMarginRight=this.state.ElementoMarginRight;
   var ElementoMarginLeft=this.state.ElementoMarginLeft;
   var ElementoSize=this.state.ElementoSize;
   var ElementoColor=this.state.ElementoColor;
   var VinetaColor=this.state.VinetaColor;
   var AnchoGrafico=this.state.AnchoGrafico;

   var cantidadColumnas=this.state.cantidadColumnas;
   var cantidadFilas=this.state.cantidadFilas;
   var EncabezadoColumna=this.state.EncabezadoColumna;
   var ValoresColumna=this.state.ValoresColumna;
   ElementoWidth.push(document.getElementById('ElementoWidth').value);
   ElementoAlign.push(document.getElementById('ElementoAlign').value);
   ElementoMarginTop.push(document.getElementById('ElementoMarginTop').value);
   ElementoMarginRight.push(document.getElementById('ElementoMarginRight').value);
   ElementoMarginLeft.push(document.getElementById('ElementoMarginLeft').value);
   ElementoSize.push(document.getElementById('ElementoSize').value);
   ElementoColor.push(document.getElementById('ElementoColor').value);
   VinetaColor.push(document.getElementById('VinetaColor').value);
   var Ancho=100;
   if(estadopanel==5){Ancho=document.getElementById('AnchoGrafico').value}
  AnchoGrafico.push(Ancho)
   var TipoElemento=this.state.TipoElemento;
   TipoElemento.push(estadopanel);
   this.setState({
    ElementoWidth:ElementoWidth,
    ElementoAlign:ElementoAlign,
    ElementoMarginTop:ElementoMarginTop,
    ElementoMarginRight:ElementoMarginRight,
    ElementoMarginLeft:ElementoMarginLeft,
    ElementoSize:ElementoSize,
    ElementoColor:ElementoColor,
    VinetaColor:VinetaColor,
    TipoElemento:TipoElemento,
    AnchoGrafico:AnchoGrafico,
    });
  var cantidadElementos=this.state.cantidadElementos;
  var Elementos=this.state.Elementos;
  if(estadopanel==1){var imagen= [this.renderLogo(cantidadElementos)]}
  if(estadopanel==2){var imagen= [this.renderTitulo(cantidadElementos)]}
  if(estadopanel==3){var imagen= [this.renderComentario(cantidadElementos)]}
  if(estadopanel==4){var imagen= [this.renderTabla(cantidadElementos)]}
  if(estadopanel==5){
    var chartDataElemento=this.state.chartDataElemento;
    var chartOption=this.state.chartOption;
    var chartOptionElemento=this.state.chartOptionElemento;
    chartOptionElemento[cantidadElementos]=chartOption;
    var chartData={
      labels:this.state.labels,
      datasets: this.state.DataSets}
    chartDataElemento[cantidadElementos]=chartData;
    this.setState({
    chartDataElemento:chartDataElemento,
    chartOptionElemento:chartOptionElemento,
    });
  var imagen= [this.renderGrafico(cantidadElementos)]}
  const imagen1 = imagen.map((img) =>
  <li key={'Elemento'+cantidadElementos} style={{width:AnchoGrafico[cantidadElementos]+'%'}}>
    {img}
  </li>
);
  cantidadElementos++;
  Elementos.push(imagen1);

  document.getElementById('panelElemento').style.visibility='hidden';
  document.getElementById('PanelCentral').style.visibility='visible';
  this.setState({
    Elementos:Elementos,
    cantidadElementos:cantidadElementos,
    });

/// Guardar
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      var respuesta = xmlhttp.responseText;
    }
    }
  var TipoElemento=this.state.TipoElemento[cantidadElementos];
  var AnchoElemento=this.state.ElementoWidth[cantidadElementos];
  var AlineacionElemento=this.state.ElementoAlign[cantidadElementos];
  var MargenSupElemento=this.state.ElementoMarginTop[cantidadElementos];
  var MargenDerElemento=this.state.ElementoMarginRight[cantidadElementos];
  var MargenIzqElemento=this.state.ElementoMarginLeft[cantidadElementos];
  var TamanoElemento=this.state.ElementoSize[cantidadElementos];
  var ColorElemento=this.state.ElementoColor[cantidadElementos];
  var ColorVinElemento=this.state.VinetaColor[cantidadElementos];
  var cadenaParametros = 'Tipo='+encodeURIComponent(TipoElemento)+'&Ancho='+encodeURIComponent(AnchoElemento)+'&Alineacion='+encodeURIComponent(AlineacionElemento)
  +'&MargenSup='+encodeURIComponent(MargenSupElemento)+'&MargenDer='+encodeURIComponent(MargenDerElemento)+'&MargenIzq='+encodeURIComponent(MargenIzqElemento)
  +'&Tamano='+encodeURIComponent(TamanoElemento)+'&Color='+encodeURIComponent(ColorElemento)+'&ColorVin='+encodeURIComponent(ColorVinElemento);
  xmlhttp.open('POST', 'php/guardarelementos.php');
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
  xmlhttp.send(cadenaParametros); 

  }
handleClickCancelElemento(event) {
    document.getElementById('panelElemento').style.visibility='hidden';
    var cantidadElementos=this.state.cantidadElementos;
    for(var a=0;a<cantidadElementos;a++){document.getElementById('Elemento'+a).style.opacity=1}
    document.getElementById('PanelCentral').style.visibility='visible';
}
handleClickModifElemento(event) { 
   var estadopanel=this.state.estadopanel;
   var ElementoWidth=this.state.ElementoWidth;
   var ElementoAlign=this.state.ElementoAlign;
   var ElementoMarginTop=this.state.ElementoMarginTop;
   var ElementoMarginRight=this.state.ElementoMarginRight;
   var ElementoMarginLeft=this.state.ElementoMarginLeft;
   var ElementoSize=this.state.ElementoSize;
   var ElementoColor=this.state.ElementoColor;
   var VinetaColor=this.state.VinetaColor;
   var AnchoGrafico=this.state.AnchoGrafico;

  var cantidadElementos=this.state.cantidadElementos;
  var Elementos=this.state.Elementos;
  for(var a=0;a<cantidadElementos;a++){if(document.getElementById('Elemento'+a).style.opacity=='0.4'){
    var Ancho=100;
    var TipoElemento=this.state.TipoElemento;
   if(TipoElemento[a]==5){Ancho=document.getElementById('AnchoGrafico').value}
    AnchoGrafico[a]=Ancho;
    ElementoWidth[a]=(document.getElementById('ElementoWidth').value);
    if(document.getElementById('ElementoAlign').value!=''){ElementoAlign[a]=(document.getElementById('ElementoAlign').value)}
    ElementoMarginTop[a]=(document.getElementById('ElementoMarginTop').value);
    ElementoMarginRight[a]=(document.getElementById('ElementoMarginRight').value);
    ElementoMarginLeft[a]=(document.getElementById('ElementoMarginLeft').value);
    ElementoSize[a]=(document.getElementById('ElementoSize').value);
    ElementoColor[a]=(document.getElementById('ElementoColor').value);
    VinetaColor[a]=(document.getElementById('VinetaColor').value);
  }
  }

    this.setState({
    ElementoWidth:ElementoWidth,
    ElementoAlign:ElementoAlign,
    ElementoMarginTop:ElementoMarginTop,
    ElementoMarginRight:ElementoMarginRight,
    ElementoMarginLeft:ElementoMarginLeft,
    ElementoSize:ElementoSize,
    ElementoColor:ElementoColor,
    VinetaColor:VinetaColor,
    AnchoGrafico:AnchoGrafico,
    });
    
  for(var a=0;a<cantidadElementos;a++){if(document.getElementById('Elemento'+a).style.opacity=='0.4'){
    if(TipoElemento[a]==1){var imagen= [this.renderLogo(a)]}
    if(TipoElemento[a]==2){var imagen= [this.renderTitulo(a)]}
    if(TipoElemento[a]==3){var imagen= [this.renderComentario(a)]}
    if(TipoElemento[a]==4){var imagen= [this.renderTabla(a)]}
    if(TipoElemento[a]==5){
    var chartDataElemento=this.state.chartDataElemento;
    var chartOption=this.state.chartOption;
    var chartOptionElemento=this.state.chartOptionElemento;
    chartOptionElemento[a]=chartOption;
    var chartData={
      labels:this.state.labels,
      datasets: this.state.DataSets}
    chartDataElemento[a]=chartData;
    this.setState({
    chartDataElemento:chartDataElemento,
    chartOptionElemento:chartOptionElemento,
    });

  var imagen= [this.renderGrafico(a)]}
    const imagen1 = imagen.map((img) =>
      <li key={'Elemento'+a} style={{width:AnchoGrafico[a]+'%'}}>
      {img}
    </li>
    );
    Elementos[a]=(imagen1);
  }
  }
  for(var a=0;a<cantidadElementos;a++){document.getElementById('Elemento'+a).style.opacity=1}
  document.getElementById('panelElemento').style.visibility='hidden';
  document.getElementById('PanelCentral').style.visibility='visible';
  this.setState({
    Elementos:Elementos,
    });
}


renderLogo(i) {

  return (
  <Logo
    NumeroElemento={i}
    TipoElemento={this.state.TipoElemento[i]}
    ElementoWidth={this.state.ElementoWidth[i]}
    ElementoAlign={this.state.ElementoAlign[i]}
    ElementoMarginTop={this.state.ElementoMarginTop[i]}
    ElementoMarginRight={this.state.ElementoMarginRight[i]}
    ElementoMarginLeft={this.state.ElementoMarginLeft[i]}

  />
  );
}
renderTitulo(i) {
  return (
  <Titulo
    NumeroElemento={i}
    TipoElemento={this.state.TipoElemento[i]}
    ElementoAlign={this.state.ElementoAlign[i]}
    ElementoMarginTop={this.state.ElementoMarginTop[i]}
    ElementoMarginRight={this.state.ElementoMarginRight[i]}
    ElementoMarginLeft={this.state.ElementoMarginLeft[i]}
    ElementoSize={this.state.ElementoSize[i]}
    ElementoColor={this.state.ElementoColor[i]}

  />
  );
}

renderComentario(i) {
  return (
  <Comentario
    NumeroElemento={i}
    TipoElemento={this.state.TipoElemento[i]}
    ElementoWidth={this.state.ElementoWidth[i]}
    ElementoMarginTop={this.state.ElementoMarginTop[i]}
    ElementoMarginRight={this.state.ElementoMarginRight[i]}
    ElementoMarginLeft={this.state.ElementoMarginLeft[i]}
    ElementoSize={this.state.ElementoSize[i]}
    ElementoColor={this.state.ElementoColor[i]}
    VinetaColor={this.state.VinetaColor[i]}
  />
  );
}
  componentWillMount(i){
  //  this.getElementos(i);
  }

  getElementos(i){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      var respuesta = xmlhttp.responseText;
      var c=8;
      

for(var x=0; x<respuesta.length/c; x++){
    var TipoElemento=respuesta[x*c]
   var ElementoWidth= respuesta[x*c+1];
   var ElementoAlign= respuesta[x*c+2];
   var ElementoMarginTop=respuesta[x*c+3];
   var ElementoMarginRight=respuesta[x*c+4];
   var ElementoMarginLeft=respuesta[x*c+5];
   var ElementoSize=respuesta[x*c+6]
   var ElementoColor=respuesta[x*c+7];
   var VinetaColor=respuesta[x*c+8]   
   

   //var AnchoGrafico=respuesta[x*c+9]

   //var cantidadColumnas=this.state.cantidadColumnas;
   //var cantidadFilas=this.state.cantidadFilas;
   //var EncabezadoColumna=this.state.EncabezadoColumna;
   //var ValoresColumna=this.state.ValoresColumna;
   ElementoWidth.push(document.getElementById('ElementoWidth').value);
   ElementoAlign.push(document.getElementById('ElementoAlign').value);
   ElementoMarginTop.push(document.getElementById('ElementoMarginTop').value);
   ElementoMarginRight.push(document.getElementById('ElementoMarginRight').value);
   ElementoMarginLeft.push(document.getElementById('ElementoMarginLeft').value);
   ElementoSize.push(document.getElementById('ElementoSize').value);
   ElementoColor.push(document.getElementById('ElementoColor').value);
   VinetaColor.push(document.getElementById('VinetaColor').value);
   var Ancho=100;
 //  if(estadopanel==5){Ancho=document.getElementById('AnchoGrafico').value}
 // AnchoGrafico.push(Ancho)
 //  var TipoElemento=this.state.TipoElemento;
   TipoElemento.push(TipoElemento);
   this.setState({
    ElementoWidth:ElementoWidth,
    ElementoAlign:ElementoAlign,
    ElementoMarginTop:ElementoMarginTop,
    ElementoMarginRight:ElementoMarginRight,
    ElementoMarginLeft:ElementoMarginLeft,
    ElementoSize:ElementoSize,
    ElementoColor:ElementoColor,
    VinetaColor:VinetaColor,
    TipoElemento:TipoElemento,
//    AnchoGrafico:AnchoGrafico,
    });
  var cantidadElementos=x;
  var Elementos=this.state.Elementos;
  if(TipoElemento==1){var imagen= [this.renderLogo(cantidadElementos)]}
  if(TipoElemento==2){var imagen= [this.renderTitulo(cantidadElementos)]}
  if(TipoElemento==3){var imagen= [this.renderComentario(cantidadElementos)]}
/*  if(TipoElemento==4){var imagen= [this.renderTabla(cantidadElementos)]}
  if(TipoElemento==5){
    var chartDataElemento=this.state.chartDataElemento;
    var chartOption=this.state.chartOption;
    var chartOptionElemento=this.state.chartOptionElemento;
    chartOptionElemento[cantidadElementos]=chartOption;
    var chartData={
      labels:this.state.labels,
      datasets: this.state.DataSets}
    chartDataElemento[cantidadElementos]=chartData;
    this.setState({
    chartDataElemento:chartDataElemento,
    chartOptionElemento:chartOptionElemento,
    });
  var imagen= [this.renderGrafico(cantidadElementos)]}
  */
  const imagen1 = imagen.map((img) =>
  <li key={'Elemento'+cantidadElementos}>
    {img}
  </li>
);
 
  Elementos.push(imagen1);

  document.getElementById('panelElemento').style.visibility='hidden';
  document.getElementById('PanelCentral').style.visibility='visible';
  this.setState({
    Elementos:Elementos,
    cantidadElementos:cantidadElementos,
    });



      }

    }
    }
  var cadenaParametros = '';
  xmlhttp.open('POST', 'php/buscarelementos.php');
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
  xmlhttp.send(cadenaParametros); 
}



  getMejoresPeores(i){
    //  0= no lo muestra 1=mejor 2=peor 3=Gespania
    var seriePeor=[
    [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[1,1,0],[1,2,0]
    ];
    var criterioPeor=[
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],["Max","Max","Max"],["Max","Max","Max"]
    ];
    this.setState({
      seriePeor:seriePeor,
      criterioPeor:criterioPeor,
    });
  }
  getChartData(i){
    // Ajax calls here
    var chartData = [];
    var XData= [
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['No Iniciado','Excavaciones','Obra Gruesa','Terminaciones','Finalizado'],
      ["1,0","1,1","1,2","2,0","2,1","3,0"]
      ]
    var MuestraValor=[[0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,0,0,0],
                      [1,1,1,1,1],
                      [1,1,1,1,1,1]]
    var Serie = [];
    var DataSerie = [];
    Serie[0] = ["Oferta","VM Comuna","UF","Concón Reñaca","Concón Reñaca","Concón Reñaca","Concón Reñaca","Bajo UF 3.400","Oferta","VM Comuna","UF","Concón Reñaca","Concón Reñaca","Concón Reñaca","Concón Reñaca","Bajo UF 3.400","VENTA","ABSORCION"];
    DataSerie[0] =[
      [3850,3950,3800,4200,3400,3600,3580,4460,5290,5164],
      [81,88,90,110,109,170,98,116,120,137],
      [5700,5900,5550,5510,5000,6180,6486,6326,6100,5523],
      [98,95.5,78,81.8,78.9,68.8],
      [5600,5850,5350,6275,6288,5523],
      [48,51,57,64.6,67,69],
      [81,87,105,130,118,137],
      [16,21,18,12,9,8],

      [1490,1320,1030,1220,680,700,600,1325,1560,2109],
      [29,31,20,12,28,33,19,45,68,80],
      [6550,6650,7380,7100,4750,5050,5800,5084,5010,5049],
      [94,95.1,82,66.4,64.7,65],
      [6550,7010,5980,5155,5045,5049],
      [54.8,58,60.5,66.2,66.5,66.4],
      [32,29,21,28,54,80],
      [3,2,0,0,0,0],

      [240,0,480,320,240],
      [4.2,5.6,1.7,4.1,3.2,2.5]
            ]
    Serie[1] = ["Disponibilidad","VM x Edificio","m2","","","","","UF3.400 a 7.950","Disponibilidad","VM x Edificio","m2","","","","","UF3.400 a 7.950","DISPONIBLE","MESES STOCK"];
    DataSerie[1] =[
      [1200,1180,900,1000,1100,1190,1050,2036,2120,2035],
      [2.1,2,2.3,3,3.5,4.6,2.6,2.7,2.4,3],
      [98,101,92,83,76,82,83,78,78,69],
      [],
      [],
      [],
      [],
      [60,68,90,98,88,102],

      [500,300,100,120,290,290,220,836,910,837],
      [2.8,3,2.7,1.4,5,5.1,3.3,4.1,4.9,4.7],
      [95,94,97,95,68,66,67,64,66,65],
      [],
      [],
      [],
      [],
      [18,19,21,28,49,69],

      [560,0,280,251,25],
      [16,9,30,11,28,25]
            ]
    Serie[2] = ["Edificios","MAS","UFm2","","","","","Sobre UF 7.950","Edificios","MAS","UFm2","","","","","Sobre UF 7.950","",""];
    DataSerie[2] =[
      [40,44,39,38,32,36,37,43,51,46],
      [18,17,14,11,15,9,15.3,17.5,18,14.8],
      [49,51,53,56,57,64,65,67.8,65,69],
      [],
      [],
      [],
      [],
      [81,87,105,130,118,137],

      [13,12,10,11,7,8,7,11,13,17],
      [14,8.5,5,7,9,8,11,18.7,12,10.5],
      [55,56,60,61,60,66,67,67.9,65.8,66.4],
      [],
      [],
      [],
      [],
      [32,29,20,28,59,80],

      [],
      []
      ];
    
    var IDAxis=["left-y-axis","left-y-axis1","right-y-axis"];
    var Axis = [[0,0,2],[2,0,2],[2,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,2],[2,0,2],[2,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,2,0]];
    var TypeChartString = ["line","bar","scatter"]
    var TypeChart = [[0,0,1],[0,0,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[1,1,0],[0,0,0]];
    var backgroundColor = [ ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["rgba(100,100,100,0.5)","rgba(100,100,100,0.9)",""],
                            ["rgba(100,100,100,0.5)","rgba(100,100,100,0.9)",""]
                            ];
    var borderColor = [ ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["rgba(100,100,100,0.5)","rgba(100,100,100,0.9)",""],
                            ["transparent","transparent",""]
                            ];
    var FillString = [false,true];
    var Fill=[[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0]];
    var PointStyleString=['line','triangle','circle','rect'];
    var PointStyleIndex=[[0,0,3],[0,0,3],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,3],[0,0,3],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[3,3,0],[2,1,0]];
    
    for(var x=0;x<XData.length;x++){
      var SerieOp = [];
      for (var z=0;z<=2;z++){ 
          SerieOp.push ({
          label:Serie[z][x],
          data: DataSerie[z][x], 
          yAxisID: IDAxis[Axis[x][z]],
          type: TypeChartString[TypeChart[x][z]],
          fill: FillString[Fill[z][x]],
          lineTension: 0,
          backgroundColor: backgroundColor[x][z],
          borderColor: borderColor[x][z],
          pointStyle:PointStyleString[PointStyleIndex[x][z]]
          })
      }
      chartData[x]={
        labels: XData[x],
        datasets: SerieOp,
      }
    }
   

// Chart Options

  var Titulo = ["","","","Superficie Promedio (m2)", "Precio Promedio (UF)", "Precio Unitario (UFm2)","Ventas Mensuales","Ventas Mensuales por Tramo","","","","Superficie Promedio (m2)", "Precio Promedio (UF)", "Precio Unitario (UFm2)","Ventas Mensuales","Ventas Mensuales por Tramo","SEGUN ESTADO AVANCE DE OBRA","ABSORCION & MESEES DE STOCK POR PROGRAMA"];
    var NombreEjeY=[];
    var minEjeY = [];
    var maxEjeY = [];
    NombreEjeY[0] = ["# VIVIENDAS","VIVIENDAS x PROYECTO","SUPERFICIE (M2) | UFM2", "","","","","","# VIVIENDAS","VIVIENDAS x PROYECTO","SUPERFICIE (M2) | UFM2", "","","","","","CANTIDAD DE UNIDADES","ABSORCION MENSUAL"];
    minEjeY[0] = [0,0,40,60,4000,45,0,0,0,0,30,60,4000,40,0,0,0,0];
    maxEjeY[0] = [6000,9,110,100,8000,75,150,140,2500,9,100,100,8000,80,100,90,600,10];
    NombreEjeY[1] = ["# EDIFICIOS","VIVIENDAS x SECTOR | MESES PARA AGOTAR STOCK","PRECIO UF" ,"","","","","","# EDIFICIOS","VIVIENDAS x SECTOR | MESES PARA AGOTAR STOCK","PRECIO UF" ,"","","","","","","MESES AGOTARSTOCK"];
    minEjeY[2] = [0,0,3500,0,0,0,0,0,0,0,4000,0,0,0,0,0,0,0];
    maxEjeY[2] = [80,180,7000,0,0,0,0,0,80,100,7500,0,0,0,0,0,0,40];
    var Step = [1000,1,10,5,500,5,10,10,500,1,10,2.5,500,5,10,10,50,1];
    var StepSub = [200,0.2,2,5,500,5,10,10,100,0.2,2,2.5,500,5,10,10,50,0.25];
    var DisplayYAxes = [[1,1,1],[1,1,1],[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1],[1,1,1],[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]];
    var barPercentage = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1.3,1];
    var categoryPercentage = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.5,1];
    var Radius=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7];
    var chartOption = [];
    for(var x=0;x<Titulo.length;x++){
        var yAxes1= {
          scaleLabel: {
            display: true,
            labelString: NombreEjeY[0][x],
          },
          id: 'left-y-axis',
          type: 'linear',
          position: 'left',
          ticks: {
            min: minEjeY[0][x],
            max: maxEjeY[0][x],
            stepSize: Step[x],
          },
          gridLines: {
            drawOnChartArea: true,
          }
          
        }
        var yAxes2= {
          id: 'left-y-axis1',
          type: 'linear',
          position: 'left',
          ticks: {
            display: false,
            min: minEjeY[0][x],
            max: maxEjeY[0][x],
            stepSize: StepSub[x],
          },
          gridLines: {
            drawOnChartArea: true,
            drawTicks: false,
          }
        }
        var yAxes3= {
          scaleLabel: {
            display: true,
            labelString: NombreEjeY[1][x],
          },
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
          ticks: {
            min: minEjeY[2][x],
            max: maxEjeY[2][x],
          },
          gridLines: {
            display: false,
          }
        }
        var yAxes = [];
        if(DisplayYAxes[x][0]===1){yAxes.push(yAxes1)}
        if(DisplayYAxes[x][1]===1){yAxes.push(yAxes2)}
        if(DisplayYAxes[x][2]===1){yAxes.push(yAxes3)}

        var Rotulos =[];
        var c=0;
        var contarb=0;
        var AjusteY=14;
        for(var w=0;w<3;w++){if(TypeChart[x][w]==1){contarb++}}
        if(contarb>1){var AjusteX=18}else{var AjusteX=1}
        for(var y=0;y<3;y++){
          AjusteX=AjusteX*(-1);
          if(x==17&&y==1){
            AjusteY=AjusteY*(-1)}
        for(var z=0;z<XData[x].length;z++){
          c++;
          var alturaRotulo = 220-((DataSerie[y][x][z]-minEjeY[(Axis[x][y])][x])/(maxEjeY[Axis[x][y]] [x]-minEjeY[(Axis[x][y])][x])*440)-AjusteY;
          Rotulos[c]= {
            drawTime: "afterDatasetsDraw",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis',
            value: XData[x][z],
            borderColor: "transparent",
            borderWidth: 0,
            label: {
              backgroundColor: "white",
              fontColor:"rgb(80,80,80)",
              content:DataSerie[y][x][z],
              enabled: MuestraValor[x][z],
              yAdjust: alturaRotulo,
              xAdjust: AjusteX,
              xPadding:2,
              yPadding:2,
              cornerRadius:0,
              fontStyle:'normal',
              fontSize:12,
            },
          }
         }
       }
        chartOption[x]={
        maintainAspectRatio: false,
        elements:{
            point:{
            radius: Radius[x],
            },
            line:{
              borderWidth:0
            }
          },
          title: {
            display: true,
            text: Titulo[x],
            fontSize: 18,
          },
          tooltips:{
            backgroundColor: 'rgb(173,189,210)',
            titleFontColor: 'rgb(115,115,115)',
            bodyFontColor: 'rgb(115,115,115)',
            intersect:false,
            caretSize:5,
          },
          legend:{
            display: true,
            position:'bottom',
            labels:{
              boxWidth:40,
              padding:10,
              usePointStyle:true,
            },
          },
          scales: {
            yAxes: yAxes ,
            xAxes: [{
              id: 'x-axis',
              barPercentage:barPercentage[x],
              categoryPercentage: categoryPercentage[x],

            }]
          },
          annotation: {
            annotations:Rotulos,
        }

      }
  }
   
  this.setState({
    chartData: chartData,
    chartOption: chartOption,
    });
}


renderGrafico(i) {
    return (
  <Chart
    chartOption={this.state.chartOptionElemento[i]}
    chartData={this.state.chartDataElemento[i]}
    NumeroElemento={i}
    TipoElemento={this.state.TipoElemento[i]}
    onClick={this.onClickGrafico}

  />
  );
}
renderGrafico1(i) {

  var chartData = [];
    var XData= [
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['13.4','14.1','14.4','15.2','15.5','16.2','16.5','17.3','17.5','18.2'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['2013','2014','2015','2016','2017','2018'],
      ['No Iniciado','Excavaciones','Obra Gruesa','Terminaciones','Finalizado'],
      ["1,0","1,1","1,2","2,0","2,1","3,0"]
      ]
    var MuestraValor=[[0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,0,0,0],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,0,0,0,0,1,0,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,1,1,1],
                      [0,0,0,0,0,0],
                      [1,1,1,1,1],
                      [1,1,1,1,1,1]]
    var Serie = [];
    var DataSerie = [];
    Serie[0] = ["Oferta","VM Comuna","UF","Concón Reñaca","Concón Reñaca","Concón Reñaca","Concón Reñaca","Bajo UF 3.400","Oferta","VM Comuna","UF","Concón Reñaca","Concón Reñaca","Concón Reñaca","Concón Reñaca","Bajo UF 3.400","VENTA","ABSORCION"];
    DataSerie[0] =[
      [3850,3950,3800,4200,3400,3600,3580,4460,5290,5164],
      [81,88,90,110,109,170,98,116,120,137],
      [5700,5900,5550,5510,5000,6180,6486,6326,6100,5523],
      [98,95.5,78,81.8,78.9,68.8],
      [5600,5850,5350,6275,6288,5523],
      [48,51,57,64.6,67,69],
      [81,87,105,130,118,137],
      [16,21,18,12,9,8],

      [1490,1320,1030,1220,680,700,600,1325,1560,2109],
      [29,31,20,12,28,33,19,45,68,80],
      [6550,6650,7380,7100,4750,5050,5800,5084,5010,5049],
      [94,95.1,82,66.4,64.7,65],
      [6550,7010,5980,5155,5045,5049],
      [54.8,58,60.5,66.2,66.5,66.4],
      [32,29,21,28,54,80],
      [3,2,0,0,0,0],

      [240,0,480,320,240],
      [4.2,5.6,1.7,4.1,3.2,2.5]
            ]
    Serie[1] = ["Disponibilidad","VM x Edificio","m2","","","","","UF3.400 a 7.950","Disponibilidad","VM x Edificio","m2","","","","","UF3.400 a 7.950","DISPONIBLE","MESES STOCK"];
    DataSerie[1] =[
      [1200,1180,900,1000,1100,1190,1050,2036,2120,2035],
      [2.1,2,2.3,3,3.5,4.6,2.6,2.7,2.4,3],
      [98,101,92,83,76,82,83,78,78,69],
      [],
      [],
      [],
      [],
      [60,68,90,98,88,102],

      [500,300,100,120,290,290,220,836,910,837],
      [2.8,3,2.7,1.4,5,5.1,3.3,4.1,4.9,4.7],
      [95,94,97,95,68,66,67,64,66,65],
      [],
      [],
      [],
      [],
      [18,19,21,28,49,69],

      [560,0,280,251,25],
      [16,9,30,11,28,25]
            ]
    Serie[2] = ["Edificios","MAS","UFm2","","","","","Sobre UF 7.950","Edificios","MAS","UFm2","","","","","Sobre UF 7.950","",""];
    DataSerie[2] =[
      [40,44,39,38,32,36,37,43,51,46],
      [18,17,14,11,15,9,15.3,17.5,18,14.8],
      [49,51,53,56,57,64,65,67.8,65,69],
      [],
      [],
      [],
      [],
      [81,87,105,130,118,137],

      [13,12,10,11,7,8,7,11,13,17],
      [14,8.5,5,7,9,8,11,18.7,12,10.5],
      [55,56,60,61,60,66,67,67.9,65.8,66.4],
      [],
      [],
      [],
      [],
      [32,29,20,28,59,80],

      [],
      []
      ];
    
    var IDAxis=["left-y-axis","left-y-axis1","right-y-axis"];
    var Axis = [[0,0,2],[2,0,2],[2,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,2],[2,0,2],[2,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,2,0]];
    var TypeChartString = ["line","bar","scatter"]
    var TypeChart = [[0,0,1],[0,0,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[1,1,0],[0,0,0]];
    var backgroundColor = [ ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["rgba(100,100,100,0.5)","rgba(100,100,100,0.9)",""],
                            ["rgba(100,100,100,0.5)","rgba(100,100,100,0.9)",""]
                            ];
    var borderColor = [ ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"],
                            ["rgba(100,100,100,0.5)","rgba(100,100,100,0.9)",""],
                            ["transparent","transparent",""]
                            ];
    var FillString = [false,true];
    var Fill=[[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0]];
    var PointStyleString=['line','triangle','circle','rect'];
    var PointStyleIndex=[[0,0,3],[0,0,3],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,3],[0,0,3],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[3,3,0],[2,1,0]];
    
    for(var x=0;x<XData.length;x++){
      var SerieOp = [];
      for (var z=0;z<=2;z++){ 
          SerieOp.push ({
          label:Serie[z][x],
          data: DataSerie[z][x], 
          yAxisID: IDAxis[Axis[x][z]],
          type: TypeChartString[TypeChart[x][z]],
          fill: FillString[Fill[z][x]],
          lineTension: 0,
          backgroundColor: backgroundColor[x][z],
          borderColor: borderColor[x][z],
          pointStyle:PointStyleString[PointStyleIndex[x][z]]
          })
      }
      chartData[x]={
        labels: XData[x],
        datasets: SerieOp,
      }
    }
   

// Chart Options

  var Titulo = ["","","","Superficie Promedio (m2)", "Precio Promedio (UF)", "Precio Unitario (UFm2)","Ventas Mensuales","Ventas Mensuales por Tramo","","","","Superficie Promedio (m2)", "Precio Promedio (UF)", "Precio Unitario (UFm2)","Ventas Mensuales","Ventas Mensuales por Tramo","SEGUN ESTADO AVANCE DE OBRA","ABSORCION & MESEES DE STOCK POR PROGRAMA"];
    var NombreEjeY=[];
    var minEjeY = [];
    var maxEjeY = [];
    NombreEjeY[0] = ["# VIVIENDAS","VIVIENDAS x PROYECTO","SUPERFICIE (M2) | UFM2", "","","","","","# VIVIENDAS","VIVIENDAS x PROYECTO","SUPERFICIE (M2) | UFM2", "","","","","","CANTIDAD DE UNIDADES","ABSORCION MENSUAL"];
    minEjeY[0] = [0,0,40,60,4000,45,0,0,0,0,30,60,4000,40,0,0,0,0];
    maxEjeY[0] = [6000,9,110,100,8000,75,150,140,2500,9,100,100,8000,80,100,90,600,10];
    NombreEjeY[1] = ["# EDIFICIOS","VIVIENDAS x SECTOR | MESES PARA AGOTAR STOCK","PRECIO UF" ,"","","","","","# EDIFICIOS","VIVIENDAS x SECTOR | MESES PARA AGOTAR STOCK","PRECIO UF" ,"","","","","","","MESES AGOTARSTOCK"];
    minEjeY[2] = [0,0,3500,0,0,0,0,0,0,0,4000,0,0,0,0,0,0,0];
    maxEjeY[2] = [80,180,7000,0,0,0,0,0,80,100,7500,0,0,0,0,0,0,40];
    var Step = [1000,1,10,5,500,5,10,10,500,1,10,2.5,500,5,10,10,50,1];
    var StepSub = [200,0.2,2,5,500,5,10,10,100,0.2,2,2.5,500,5,10,10,50,0.25];
    var DisplayYAxes = [[1,1,1],[1,1,1],[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1],[1,1,1],[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]];
    var barPercentage = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1.3,1];
    var categoryPercentage = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.5,1];
    var Radius=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7];
    var chartOption = [];
    for(var x=0;x<Titulo.length;x++){
        var yAxes1= {
          scaleLabel: {
            display: true,
            labelString: NombreEjeY[0][x],
          },
          id: 'left-y-axis',
          type: 'linear',
          position: 'left',
          ticks: {
            min: minEjeY[0][x],
            max: maxEjeY[0][x],
            stepSize: Step[x],
          },
          gridLines: {
            drawOnChartArea: true,
          }
          
        }
        var yAxes2= {
          id: 'left-y-axis1',
          type: 'linear',
          position: 'left',
          ticks: {
            display: false,
            min: minEjeY[0][x],
            max: maxEjeY[0][x],
            stepSize: StepSub[x],
          },
          gridLines: {
            drawOnChartArea: true,
            drawTicks: false,
          }
        }
        var yAxes3= {
          scaleLabel: {
            display: true,
            labelString: NombreEjeY[1][x],
          },
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
          ticks: {
            min: minEjeY[2][x],
            max: maxEjeY[2][x],
          },
          gridLines: {
            display: false,
          }
        }
        var yAxes = [];
        if(DisplayYAxes[x][0]===1){yAxes.push(yAxes1)}
        if(DisplayYAxes[x][1]===1){yAxes.push(yAxes2)}
        if(DisplayYAxes[x][2]===1){yAxes.push(yAxes3)}

        var Rotulos =[];
        var c=0;
        var contarb=0;
        var AjusteY=14;
        for(var w=0;w<3;w++){if(TypeChart[x][w]==1){contarb++}}
        if(contarb>1){var AjusteX=18}else{var AjusteX=1}
        for(var y=0;y<3;y++){
          AjusteX=AjusteX*(-1);
          if(x==17&&y==1){
            AjusteY=AjusteY*(-1)}
        for(var z=0;z<XData[x].length;z++){
          c++;
          var alturaRotulo = 220-((DataSerie[y][x][z]-minEjeY[(Axis[x][y])][x])/(maxEjeY[Axis[x][y]] [x]-minEjeY[(Axis[x][y])][x])*440)-AjusteY;
          Rotulos[c]= {
            drawTime: "afterDatasetsDraw",
            type: "line",
            mode: "vertical",
            scaleID: 'x-axis',
            value: XData[x][z],
            borderColor: "transparent",
            borderWidth: 0,
            label: {
              backgroundColor: "white",
              fontColor:"rgb(80,80,80)",
              content:DataSerie[y][x][z],
              enabled: MuestraValor[x][z],
              yAdjust: alturaRotulo,
              xAdjust: AjusteX,
              xPadding:2,
              yPadding:2,
              cornerRadius:0,
              fontStyle:'normal',
              fontSize:12,
            },
          }
         }
       }
        chartOption[x]={
        maintainAspectRatio: false,
        elements:{
            point:{
            radius: Radius[x],
            },
            line:{
              borderWidth:0
            }
          },
          title: {
            display: true,
            text: Titulo[x],
            fontSize: 18,
          },
          tooltips:{
            backgroundColor: 'rgb(173,189,210)',
            titleFontColor: 'rgb(115,115,115)',
            bodyFontColor: 'rgb(115,115,115)',
            intersect:false,
            caretSize:5,
          },
          legend:{
            display: true,
            position:'bottom',
            labels:{
              boxWidth:40,
              padding:10,
              usePointStyle:true,
            },
          },
          scales: {
            yAxes: yAxes ,
            xAxes: [{
              id: 'x-axis',
              barPercentage:barPercentage[x],
              categoryPercentage: categoryPercentage[x],

            }]
          },
          annotation: {
            annotations:Rotulos,
        }

      }
  }
   
 
    return (
  <Chart
    chartOption={chartOption[i]}
    chartData={chartData[i]}
    NumeroElemento={i}
    TipoElemento={5}


  />
  );
}
renderMejoresPeores(i){
   return (
  <MejoresPeores
    chartOption={this.state.chartOption[i]}
    chartData={this.state.chartData[i]}
    criterioPeor={this.state.criterioPeor[i]}
    seriePeor={this.state.seriePeor[i]}
    anchografico={this.state.anchografico[i]}
    margenizquierdo={this.state.margenizquierdo[i]}
    margenderecho={this.state.margenderecho[i]}
    margensuperior={this.state.margensuperior[i]}
    margeninferior={this.state.margeninferior[i]}
    giro={this.state.giro[i]}
  />
  );
}

renderTabla(i) {

    // Ajax calls here
    var NombreEdificio=["Gespania","Gespania","Gespania","Gespania","Gespania","Amira","Amira","Amira","Velas Montemar","Velas Montemar","Velas Montemar","Velas Montemar","Velas Montemar","Costa Montemar","Costa Montemar","Costa Montemar","Costa Montemar","Costa Montemar","Costa Montemar","Altair","Altair","Altair","Altair","Altair","Mares Montemar","Mares Montemar","Mares Montemar","Mares Montemar","Mares Montemar","Tantum E2","Tantum E2","Tantum E2","Tantum E2","Tantum E2","Dunas Montemar","Dunas Montemar","Dunas Montemar","Dunas Montemar","Dunas Montemar","Dunas Montemar","Mirador Montemar","Mirador Montemar","Mirador Montemar","Mirador Montemar","Mirador Montemar","Mirador Montemar","Almar","Almar","Almar","Almar","Marina de Montemar","Marina de Montemar","Marina de Montemar","Marina de Montemar","Marina de Montemar","Vista Higuerillas","Vista Higuerillas","Vista Higuerillas","Vista Brava","Vista Brava","Vista Brava","Vista Brava","Costa Montemar E2","Costa Montemar E2","Costa Montemar E2","Costa Montemar E2","Alto Lilenes","Alto Lilenes","Entre Lomas E1","Entre Lomas E1","Entre Lomas E1","Entre Lomas E1","Entre Lomas E1","Entre Lomas E2","Entre Lomas E2","Entre Lomas E2","Entre Lomas E2","Brava","Brava","Brava","Brava","Brava","Brava","Brava","Brava"];
    var Util=[39.3,51.5,64.2,56.4,82.3,106.9,76.2,63.2,87.0,88.7,55.3,57.6,56.9,58.6,56.6,69.5,43.2,32.8,60.9,43.4,51.5,48.9,62.3,79.1,35.8,37.2,55.4,60.8,90.0,62.0,62.0,64.8,103.9,110.5,36.5,45.8,55.8,65.6,67.1,86.4,54.4,66.3,65.3,84.0,136.8,142.5,35.6,62.8,63.7,65.5,39.6,56.2,66.1,79.2,103.2,37.6,54.4,73.9,42.0,60.8,109.2,123.9,32.8,43.4,55.5,73.5,65.6,119.5,34.6,47.8,51.9,64.7,73.8,34.1,47.9,52.2,64.5,33.1,61.5,65.0,67.0,96.0,110.8,116.3,129.4];
    var Terraza=[7.25667,7.45000,13.86333,14.10709,16.35000,21.75000,19.38000,17.84000,13.28000,19.97000,12.48000,15.23000,10.88000,11.06000,11.66000,9.17000,8.56000,8.25000,8.25000,14.91000,9.21000,9.21000,10.68000,14.91000,11.12000,12.77000,17.85000,12.79000,13.78000,13.54000,23.00000,19.20000,22.06000,14.49000,7.53000,9.64000,6.97000,9.89000,7.47000,8.71000,11.40000,23.59000,20.43000,12.11000,130.73000,157.69000,13.16000,13.05000,15.70000,15.90000,6.52000,15.46000,18.23000,12.48000,17.25000,11.80000,13.50000,12.90000,15.12000,22.00000,24.06000,29.52000,8.90000,11.10000,11.60000,9.50000,15.30000,36.84000,4.26000,4.55000,8.55000,10.42000,10.56000,5.10000,5.40000,10.00000,12.40000,7.40000,13.39000,11.50000,11.96000,20.70000,14.63000,17.16000,25.76000];
    var Dormitorios=[1,1,2,2,3,3,2,2,3,3,2,2,2,2,2,3,1,1,2,1,1,1,2,1,1,1,2,2,3,2,2,1,3,3,1,1,2,2,2,2,2,2,2,2,3,3,1,2,2,2,1,2,2,2,3,1,2,2,1,2,3,3,1,1,2,3,2,3,1,1,2,2,2,1,1,2,2,1,1,2,2,3,3,3,3];
    var Mediodormi=[0,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0.1,0.1,0,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,0.1,0,0,0.1,0.1,0,0,0,0,0,0,0,0,0,0.1,0,0,0,0.1,0,0,0,0,0,0.1,0,0,0,0,0,0.1,0,0,0.1,0,0.1,0,0,0,0.1,0,0.1,0,0,0,0];
    var Oferta=[84,28,84,55,28,45,46,23,11,11,44,22,11,26,44,26,26,16,8,1,39,18,19,36,21,21,7,14,22,9,9,11,16,8,25,25,27,53,26,27,10,11,7,8,1,1,42,84,42,42,44,22,44,22,23,24,72,24,4,20,9,5,58,55,54,18,22,44,36,49,92,17,16,49,47,31,14,55,7,42,25,6,6,6,6];
    var Disponible=[84,28,84,55,28,5,4,1,0,4,1,0,0,0,0,0,0,0,3,0,16,3,1,18,6,6,2,3,7,3,3,0,2,2,25,23,16,52,25,27,2,4,5,7,1,1,7,25,17,20,39,19,42,20,22,4,9,5,3,17,8,4,38,35,35,13,12,32,0,0,5,0,0,8,7,8,4,41,6,23,18,3,6,3,1];
    var Descuento=[0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,8,8,8,8,8,5,5,5,5,5,5,3,3,3,3,3,3,2,2,2,2,12,12,12,12,12,8,8,8,10,10,10,10,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,12,12,12,12];
    var UFMinimo=[2266,3121,4049,3608,4619,6831,5635,4771,6900,6542,4475,4700,4650,3450,3333,3780,2821,2300,4000,2868,3376,3525,4141,4377,5580,2690,3950,4130,5470,6170,6294,6205,7966,8706,1990,2642,3710,4090,3890,4790,4824,5720,5458,6024,13680,15783,3348,3990,4390,4621,2835,4764,4856,6208,7252,2964,4042,5312,3890,6312,8658,10550,2750,3524,4110,4890,4850,5850,2100,2901,3457,4005,4597,2371,2997,3649,4467,3247,6036,5630,6621,8512,9683,9632,11746];
    var UFMaximo=[2812,3546,4587,4154,5168,8111,6121,4771,6900,7800,4475,4700,4650,3900,3954,4000,2932,2478,4050,3368,3895,3548,4141,5190,3515,4100,4943,4850,6660,6461,6567,6281,8303,8795,2726,3015,3837,4980,4729,5731,4835,5889,5625,6207,13680,15783,3540,5382,5743,5776,3092,5027,5119,6274,7392,3247,4534,5930,4090,6620,10320,10900,3050,3700,4300,5210,5730,8550,2447,3088,3621,4211,4955,2622,3513,4036,4927,4456,6892,6814,7147,8827,10854,9765,11746];
    var Estado=[1,1,1,1,1,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,3,3,3,1,1,1,1,1,1,1,1,4,4,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1];
    var FechaVenta=["2018-03","2018-03","2018-03","2018-03","2018-03","2014-10","2014-10","2014-10","2014-03","2014-03","2014-03","2014-03","2014-03","2015-08","2015-08","2015-08","2015-08","2015-08","2015-08","2015-09","2015-09","2015-09","2015-09","2015-09","2015-12","2015-12","2015-12","2015-12","2015-12","2015-11","2015-11","2015-11","2015-11","2015-11","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07","2017-01","2017-01","2017-01","2017-01","2017-01","2017-01","2017-01","2017-01","2017-01","2017-01","2017-05","2017-05","2017-05","2017-05","2017-05","2017-07","2017-07","2017-07","2017-12","2017-12","2017-12","2017-12","2017-10","2017-10","2017-10","2017-10","2016-11","2016-11","2017-02","2017-02","2017-02","2017-02","2017-02","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07","2017-07"];
    var FechaEntrega=["","","","","","2016-12","2016-12","2016-12","2016-12","2016-12","2016-12","2016-12","2016-12","2018-07","2018-07","2018-07","2018-07","2018-07","2018-07","2018-12","2018-12","2018-12","2018-12","2018-12","2018-11","2018-11","2018-11","2018-11","2018-11","2017-11","2017-11","2017-11","2017-11","2017-11","2019-10","2019-10","2019-10","2019-10","2019-10","2019-10","2018-10","2018-10","2018-10","2018-10","2018-10","2018-10","2019-04","2019-04","2019-04","2019-04","2019-05","2019-05","2019-05","2019-05","2019-05","2020-06","2020-06","2020-06","2019-12","2019-12","2019-12","2019-12","2021-06","2021-06","2021-06","2021-06","2018-07","2018-07","2019-12","2019-12","2019-12","2019-12","2019-12","2020-12","2020-12","2020-12","2020-12","2020-12","2020-12","2020-12","2020-12","2020-12","2020-12","2020-12","2020-12"];

    var FechaCatastro="2018-03";
    var FechaReporte="2018-04";
    var FechaInicial="2014-05-02";
    var FechaFinal="2020-12-02";


    //Procesamiento de datos
    var cantidadDatos=NombreEdificio.length;
    var UtilMediaTerraza=[];
    var Vendidos=[];
    var SupUtil=[];
    var SupTerraza=[];
    var UFMinimoDesc=[];
    var UFMaximoDesc=[];
    var UFPromedioDesc=[];
    var UF=[];
    var SupUtilDisp=[];
    var UFDisp=[];
    var UFm2=[];
    var UFm2xUtil=[];
    for(var a=0;a<cantidadDatos;a++){
      UtilMediaTerraza[a]=Util[a]+0.5*Terraza[a];
      Vendidos[a]=Oferta[a]-Disponible[a];
      SupUtil[a]=Util[a]*Oferta[a];
      SupTerraza[a]=Terraza[a]*Oferta[a];
      UFMinimoDesc[a]=UFMinimo[a]*(1-Descuento[a]/100);
      UFMaximoDesc[a]=UFMaximo[a]*(1-Descuento[a]/100);
      UFPromedioDesc[a]=(UFMinimoDesc[a]+UFMaximoDesc[a])/2;
      UF[a]=UFPromedioDesc[a]*SupUtil[a];
      SupUtilDisp[a]=Util[a]*Disponible[a];
      UFDisp[a]=UFPromedioDesc[a]*SupUtilDisp[a];
      UFm2[a]=UFPromedioDesc[a]/UtilMediaTerraza[a];
      UFm2xUtil[a]=UFm2[a]*SupUtil[a];
    }
    var MesesVenta=[];
    for(a=0;a<cantidadDatos;a++){
      MesesVenta[a]=[((Date.parse(FechaCatastro)-Date.parse(FechaVenta[a]))/(1000*60*60*24*365/12)).toFixed(0)];
    }
    var VentaMensual=[];
    var VentaMensualDis=[]
    for(a=0;a<cantidadDatos;a++){
      if(MesesVenta[a]!=0){
      VentaMensual[a]=Vendidos[a]/MesesVenta[a];
      } else {VentaMensual[a]=0}
      if(Disponible[a]>0){VentaMensualDis[a]=VentaMensual[a]}else{VentaMensualDis[a]=0}
    }

    //Sumatoria por Edificio
    var Edificios=[];
    var UtilEdif=[];
    var OfertaEdif=[];
    var DisponibleEdif=[];
    var VendidosEdif=[];
    var TotalOferta=0;
    var TotalDisponible=0;
    var TotalVendidos=0;
    var TotalVentaMensualDis=0;
    var TotalSupUtil=0;
    var TotalSupTerraza=0;
    var TotalUF=0;
    var FechaVentaEdif=[];
    var FechaEntregaEdif=[];
    var MesesVentaEdif=[];
    var VentaMensualEdif=[];
    var VentaMensualDisEdif=[];
    var SupUtilEdif=[];
    var SupTerrazaEdif=[];
    var UFEdif=[];
    var UFDispEdif=[];
    var SupUtilDispEdif=[];
    var UFm2xUtilEdif=[];
    for(a=0;a<cantidadDatos;a++){
      var existe=0;
      TotalOferta=TotalOferta+Oferta[a];
      TotalDisponible=TotalDisponible+Disponible[a];
      TotalVendidos=TotalVendidos+Vendidos[a];
      TotalVentaMensualDis=TotalVentaMensualDis+VentaMensualDis[a];
      TotalSupUtil=TotalSupUtil+SupUtil[a];
      TotalSupTerraza=TotalSupTerraza+SupTerraza[a];
      TotalUF=TotalUF+UF[a];
      for(var b=0;b<Edificios.length;b++){
        if(NombreEdificio[a]===Edificios[b]){
          existe=1;
          UtilEdif[b]=UtilEdif[b]+Util[a];
          OfertaEdif[b]=OfertaEdif[b]+Oferta[a];
          DisponibleEdif[b]=DisponibleEdif[b]+Disponible[a];
          VendidosEdif[b]=VendidosEdif[b]+Vendidos[a];
          VentaMensualEdif[b]=VentaMensualEdif[b]+VentaMensual[a];
          VentaMensualDisEdif[b]=VentaMensualDisEdif[b]+VentaMensualDis[a];
          SupUtilEdif[b]=SupUtilEdif[b]+SupUtil[a];
          SupTerrazaEdif[b]=SupTerrazaEdif[b]+SupTerraza[a];
          UFEdif[b]=UFEdif[b]+UF[a];
          UFDispEdif[b]=UFDispEdif[b]+UFDisp[a];
          SupUtilDispEdif[b]=SupUtilDispEdif[b]+SupUtilDisp[a];
          UFm2xUtilEdif[b]=UFm2xUtilEdif[b]+UFm2xUtil[a];
        }
      }
      if(existe===0){
        Edificios.push(NombreEdificio[a]);
        UtilEdif.push(Util[a]);
        OfertaEdif.push(Oferta[a]);
        DisponibleEdif.push(Disponible[a]);
        VendidosEdif.push(Vendidos[a]);
        FechaVentaEdif.push(FechaVenta[a]);
        FechaEntregaEdif.push(FechaEntrega[a]);
        MesesVentaEdif.push(MesesVenta[a]);
        VentaMensualEdif.push(VentaMensual[a]);
        VentaMensualDisEdif.push(VentaMensualDis[a]);
        SupUtilEdif.push(SupUtil[a]);
        SupTerrazaEdif.push(SupTerraza[a]);
        UFDispEdif.push(UFDisp[a]);
        UFEdif.push(UF[a]);
        SupUtilDispEdif.push(SupUtilDisp[a]);
        UFm2xUtilEdif.push(UFm2xUtil[a]);
      }
    }
    var cantidadEdificios=Edificios.length;
    var MASEdif=[];
    var PPSupUtil=[];
    var PPSupTerraza=[];
    var PPUFEdif=[];
    var PPUFDispEdif=[];
    var PPUFm2Edif=[];
    var PxQEdif=[];
    for(a=0;a<cantidadEdificios;a++){
      if(VentaMensualDisEdif[a]==0){MASEdif[a]=0}else{MASEdif[a]=DisponibleEdif[a]/VentaMensualDisEdif[a]}
      PPSupUtil[a]=SupUtilEdif[a]/OfertaEdif[a];
      PPSupTerraza[a]=SupTerrazaEdif[a]/OfertaEdif[a];
      PPUFEdif[a]=UFEdif[a]/SupUtilEdif[a];
      PPUFDispEdif[a]=UFDispEdif[a]/SupUtilDispEdif[a];
      PPUFm2Edif[a]=UFm2xUtilEdif[a]/SupUtilEdif[a];
      PxQEdif[a]=PPUFEdif[a]*VentaMensualEdif[a]/1000;
    }
    var SectorOferta=TotalOferta/cantidadEdificios;
    var TotalDisponiblesinProyecto=TotalDisponible-DisponibleEdif[0];
    var SectorDisponiblesinProyecto=TotalDisponiblesinProyecto/(cantidadEdificios-1);
    var SectorVentaMensualDis=TotalVentaMensualDis/(cantidadEdificios-1);
    var SectorMAS=TotalDisponible/TotalVentaMensualDis;
    var SectorPPSupUtil= TotalSupUtil/TotalOferta;
    var SectorPPSupTerraza=TotalSupTerraza/TotalOferta;
    var SectorPPUF=TotalUF/TotalSupUtil;

    var cantidadtrimestres=Math.ceil((Date.parse(FechaFinal)-Date.parse(FechaInicial))/(1000*60*60*24*365/12)/3);
    var cantidadtrimestresReporte=Math.ceil((Date.parse(FechaReporte)-Date.parse(FechaInicial))/(1000*60*60*24*365/12)/3);
    var anioI= new Date(FechaInicial);
    var anioInicial=anioI.getFullYear();
    var primerTrimestre=Math.ceil((Date.parse(anioInicial+'-12-31')-Date.parse(FechaInicial))/(1000*60*60*24*365/12)/3);


    var Cronograma=[];

      Cronograma[0]=[];
      Cronograma[0][0]="SECTOR";
      Cronograma[1]=[];
      Cronograma[1][0]="Edificio";
    for(a=0;a<cantidadtrimestres/4;a++){
      Cronograma[0][a+1]=anioInicial+a;
    }
      Cronograma[0][a+1]="Viviendas Edificio";
      Cronograma[0][a+2]="Viviendas Disponibles";
      Cronograma[0][a+3]="Meses en Venta";
      Cronograma[0][a+4]="Inicio Ventas";
      Cronograma[0][a+5]="Entrega Informada";

    var titulosTrim=["4T","3T","2T","1T"];
    var trim=primerTrimestre-1;
    for(a=0;a<cantidadtrimestres;a++){
      Cronograma[1][a+1]=[titulosTrim[trim]];
      trim--
      if(trim<0){trim=3}
    }
    Cronograma[2]=[];
    Cronograma[2][0]="Costa Montemar";
    
    for(b=0;b<cantidadEdificios;b++){
      Cronograma[3+b]=[];
      Cronograma[3+b][0]=Edificios[b];
      var cantidadtrimestresEntrega=Math.ceil((Date.parse(FechaEntregaEdif[b]+'-5')-Date.parse(FechaInicial))/(1000*60*60*24*365/12)/3);
      for(a=0;a<cantidadtrimestres;a++){
        Cronograma[3+b][a+1]="";
        if(a==(cantidadtrimestresReporte+1 - Math.ceil(MesesVentaEdif[b]/3))) {Cronograma[3+b][a+1]="V"}
        if(a==cantidadtrimestresEntrega-1) {Cronograma[3+b][a+1]="E"}
        if(a==cantidadtrimestres-1 && cantidadtrimestresEntrega>cantidadtrimestres){Cronograma[3+b][a+1]="E>"}
       }
      Cronograma[3+b][a+1]=MASEdif[b].toFixed(1);
      Cronograma[3+b][a+2]=DisponibleEdif[b];
      Cronograma[3+b][a+3]=MesesVentaEdif[b];
      Cronograma[3+b][a+4]=FechaVentaEdif[b];
      Cronograma[3+b][a+5]=FechaEntregaEdif[b];
    }
    var ColorCrono=[];
    for(a=0;a<Cronograma.length;a++){
      ColorCrono[a]=[];
      for(b=0;b<Cronograma[a].length;b++){
        ColorCrono[a][b]=0;
        if(b==Cronograma[a].length-3 && a!=1){ColorCrono[a][b]=1}
        if(b==Cronograma[a].length-4 && a!=1){ColorCrono[a][b]=1}
        if(b==Cronograma[a].length-5 && a!=1){ColorCrono[a][b]=1}
        if(b==cantidadtrimestresReporte+1){ColorCrono[a][b]=5}
        if(b>(cantidadtrimestresReporte+1 - Math.ceil(MesesVentaEdif[a-3]/3)) && b<cantidadtrimestresReporte+1){ColorCrono[a][b]=3}
        if(b<(cantidadtrimestresReporte+1 + Math.ceil(MASEdif[a-3]/3)) && b>cantidadtrimestresReporte+1 && b<=cantidadtrimestres){ColorCrono[a][b]=4}
        if(Math.ceil(MASEdif[a-3]/3)>cantidadtrimestres- cantidadtrimestresReporte && b==cantidadtrimestres){
          if(Math.ceil(MASEdif[a-3]/3)-cantidadtrimestres+cantidadtrimestresReporte>4){Cronograma[a][b]=">>"}else{Cronograma[a][b]=">"}
        }
      }
    }

////********///// Carga DINAMICA de DATOS en las TABLAS

  var DatosT=["",OfertaEdif,DisponibleEdif,DisponibleEdif.slice(1),VentaMensualDisEdif.slice(1),MASEdif.slice(1),PPSupUtil,PPSupTerraza,PPUFEdif,PPUFm2Edif,PxQEdif.slice(1)];
  var TituloTabla=this.state.EncabezadoColumna;
  var ColumnasT=["Oferta Edificios","Disponibilidad (sin Gespania)","Venta Mensual","Meses para Agotar Stock","Superficie Util Promedio","Superficie Terraza","Precio Lista | UF","Precio Unitario | UFm2","PxQ Mensual | UF miles"];
  // ValorT = valor a Mostrar en la Tabla: 0=Encabezado Columna 1=Sumatoria Total 2=Mínimo 3=Máximo 4=Promedio Simple 5=Promedio Ponderado 6=Valor Unico[posición en el Array] 7=Porcentaje[columna a calcular, columna total] 8=Texto Libre
  var ValorT=[  [[0],[2,0,0],[3,0,0],[4,0,0],[6,0,0,0],[8,"Mas Denso"]],
                [[0],[2,2,0],[3,2,0],[4,2,0],[6,1,0,0],[8,""]],
                [[0],[2,3,1],[3,3,1],[4,3,1],[8,"-"],[8,""]],
                [[0],[2,4,1],[3,4,1],[4,4,1],[8,"-"],[8,""]],
                [[0],[2,5,1],[3,5,1],[4,5,1],[6,5,0,1],[7,4,3,0]],
                [[0],[2,6,1],[3,6,1],[4,6,1],[6,6,0,1],[7,4,3,0]],
                [[0],[2,7,0],[3,7,0],[4,7,0],[6,7,0,1],[7,4,3,0]],
                [[0],[2,8,1],[3,8,1],[4,8,1],[6,8,0,1],[7,4,3,0]],
                [[0],[2,9,1],[3,9,1],[4,9,1],[8,"-"],[8,""]] ]
  var ValorT=[];
  var ValoresColumna=this.state.ValoresColumna;
  var ValoresFilaD=this.state.ValoresFilaD;
  var ValoresTexto=this.state.ValoresTexto;
  var ValoresDato=this.state.ValoresDato;
  var ValoresPorcentaje=this.state.ValoresPorcentaje;
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  for(var a=0;a<cantidadFilas;a++){
    ValorT[a]=[];
    for(var b=0;b<cantidadColumnas;b++){
     ValorT[a][b]=[ValoresColumna[a][b],ValoresFilaD[a][b],0]
    }
  }
  //Armado de Tabla:
  var Valor=[];
  var cantidadFilas=this.state.cantidadFilas;
  var cantidadColumnas=this.state.cantidadColumnas;
  var BaseDatos=this.state.BaseDatos;
  Valor[0]=TituloTabla;
  for(a=0;a<cantidadFilas;a++){
    Valor[a+1]=[];
    for(b=0;b<cantidadColumnas;b++){
      if(ValorT[a][b][0]==''){Valor[a+1][b]=''}
      if(ValorT[a][b][0]==1){Valor[a+1][b]=BaseDatos[ValoresFilaD[a][b]]}
      if(ValorT[a][b][0]==2){
        var posicion=Edificios.indexOf(ValoresDato[a][b]);
        Valor[a+1][b]=DatosT[ValorT[a][b][1]][posicion];
      }
      if(ValorT[a][b][0]==3){Valor[a+1][b]=(DatosT[ValorT[a][b][1]].reduce(function(v1,v2){return v1+v2})).toFixed(ValorT[a][b][3])}
      if(ValorT[a][b][0]==4){Valor[a+1][b]=Math.min.apply(false,DatosT[ValorT[a][b][1]]).toFixed(ValorT[a][b][3])}
      if(ValorT[a][b][0]==5){Valor[a+1][b]=Math.max.apply(false,DatosT[ValorT[a][b][1]]).toFixed(ValorT[a][b][3])}
      if(ValorT[a][b][0]==6){Valor[a+1][b]=((DatosT[ValorT[a][b][1]].reduce(function(v1,v2){return v1+v2}))/DatosT[ValorT[a][b][1]].length).toFixed(ValorT[a][b][3])}
      if(ValorT[a][b][0]==7){Valor[a+1][b]=(DatosT[ValorT[a][b][1]][ValorT[a][b][2]]).toFixed(ValorT[a][b][3]) }
      if(ValorT[a][b][0]==9){Valor[a+1][b]=ValoresTexto[a][b]}
    }
   for(b=0;b<cantidadColumnas;b++){
     if(ValorT[a][b][0]==8){

      Valor[a+1][b]=((parseFloat( Valor[a+1][ValoresPorcentaje[a][b].split('/')[0]]) - parseFloat( Valor[a+1][ValoresPorcentaje[a][b].split('/')[1]]))/parseFloat( Valor[a+1][ValoresPorcentaje[a][b].split('/')[1]])*100).toFixed(ValorT[a][b][3])+'%'}
    }
  }
    //Carga de datos en las tablas de los reportes
    var datosTabla = [
      Valor,


  //     Cronograma
       ];

    var colorCeldaString=["white","rgb(212,210,223)","rgb(242,198,132)","rgb(239,239,106","rgb(247,162,199)","black"]
    var colorCeldaIndex = [ [[0,0,2,0,0,2],
                            [1,1,2,1,1,2],
                            [1,1,2,1,1,2],
                            [0,0,2,0,0,2],
                            [0,0,2,0,0,2],
                            [1,1,2,1,1,2],
                            [1,1,2,1,1,2],
                            [1,1,2,1,1,2],
                            [1,1,2,1,1,2],
                            [1,1,2,1,1,2]],
                          [[0,0,0],
                          [0,0,0],
                          [1,1,1],
                          [1,1,1],
                          [1,1,1],
                          [0,0,0],
                          [0,0,0],
                          [0,0,0],
                          [1,1,1],
                          [1,1,1],
                          [1,1,1],
                          [1,1,1],
                          [1,1,1],
                          [0,0,0]],

                          ColorCrono
                          ];
    var borderString=["dotted 2px rgb(30,30,30)","solid 4px rgb(30,30,30)","none","solid 2px rgb(30,30,30)"];
    //Indices de Bordes para cada celda: Top,Right,Bottom,Left
    var borderIndex=[[[[0,1,0,0],[1,0,0,1],[1,0,0,0],[1,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,0,1],[0,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,0,0]],
                      [[0,1,0,0],[0,0,1,1],[0,0,1,0],[0,1,1,0],[0,0,0,1],[0,0,0,0]]  ],
                      
                      [[[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                      [[0,0,0,0],[0,0,0,0],[0,0,0,0]]],

                      [[[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3]],
                      [[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3],[3,3,3,3]],
                      [[3,2,3,2]],
                      [[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2]],
                      [[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2]],
                      [[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2]],
                      [[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2]],
                      [[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2],[2,2,2,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]],
                      [[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2],[2,2,3,2]]]

                      ];

    var AnchoMax=[];
    var Alineacion=[];
    var ColSpan=[];
    var RowSpan=[];
    var TamañoLetra=[];
    var Padding=[];
    var Negrita=[];
    for (var t=0;t<datosTabla.length;t++){
      AnchoMax[t]=[];
      Alineacion[t]=[];
      ColSpan[t]=[];
      RowSpan[t]=[];
      TamañoLetra[t]=[];
      Padding[t]=[];
      Negrita[t]=[];
      for(var f=0;f<datosTabla[t].length;f++){
        AnchoMax[t][f]=[];
        Alineacion[t][f]=[];
        ColSpan[t][f]=[];
        RowSpan[t][f]=[];
        TamañoLetra[t][f]=[];
        Padding[t][f]=[];
        Negrita[t][f]=[];
        for(var c=0;c<datosTabla[t][f].length;c++){
              if(t===0||t===1){
                if(c===0){AnchoMax[t][f][c] = 260}else{AnchoMax[t][f][c] = 90}
              }
              if((t===2)){
                if(c===0){AnchoMax[t][f][c] = 140}else{
                  if(c<=28){AnchoMax[t][f][c] = 20}else{AnchoMax[t][f][c] = 60}
                }
              }
              if(c===0){Alineacion[t][f][c] = 'left'}else{
                if(t===0||t===1){Alineacion[t][f][c] = 'right'}
                if((t===2)){Alineacion[t][f][c] = 'center'}
                }
              ColSpan[t][f][c] = 1;
              if((t===2)&&(f===0)&&((c===1||c===2||c===3||c===4||c===5||c===6||c===7))){ColSpan[t][f][c] = 4}
              if((t===2)&&(f===2)&&(c===0)){ColSpan[t][f][c] = 36}
              RowSpan[t][f][c] = 1;
              if((t===2)&&(f===0)&&((c===8||c===9||c===10||c===11||c===12))){RowSpan[t][f][c] = 2}
              TamañoLetra[t][f][c] = '18px';
              if(t===2){TamañoLetra[t][f][c] = '10px'}
              Padding[t][f][c]='10px';
              if(t===2){
                Padding[t][f][c] = '2px 0px';
                if(((c===0||c>=8)&&(f===0))||(c===0&&f===2)) {Padding[t][f][c] = '2px 5px';}
                if(c===0&&f!==0&&f!==2) {Padding[t][f][c] = '2px 15px';}
              }
        }
      }
    }
    this.setState({
      datosTabla: datosTabla,
      AnchoMax:AnchoMax,
      Alineacion:Alineacion,
      ColSpan:ColSpan,
      RowSpan:RowSpan,
      TamañoLetra:TamañoLetra,
      Padding:Padding,
    });
  return (
  <Tabla
    datosTabla={datosTabla[i]}
    color={this.state.color}
    BordeSuperior={this.state.BordeSuperior}
    BordeDerecho={this.state.BordeDerecho}
    BordeInferior={this.state.BordeInferior}
    BordeIzquierdo={this.state.BordeIzquierdo}
    AnchoMax={AnchoMax[i]}
    Alineacion={Alineacion[i]}
    ColSpan={ColSpan[i]}
    RowSpan={RowSpan[i]}
    TamañoLetra={TamañoLetra[i]}
    Padding={Padding[i]}
  />
  );
}



handleClickCampos(event){
fetch('http://www.misfinanzassimples.com/Graficos/php/buscarcampos.php')
      .then(this.onAjaxCallback);

}

onAjaxCallback(xmlhttp) {
  if ( xmlhttp.status==200){
    var Respuesta=xmlhttp.text();
    Respuesta.then(
      function(value) {
        var valuearray =JSON.parse(value);
        var Campos=[];
        for(var x=1;x<valuearray.length;x++){
          Campos[x]=valuearray[x].name;
        }
        this.setState({
        Campos: Campos,
    });
      }.bind(this),
      );

    
  }
  }



handleClickGuardarAnalisis(event){
  var Tabla=document.getElementById('nombreTabla').value;
  var NombreAnalisis=document.getElementById('NombreAnalisis').value;
  var Analisis=this.state.Analisis;
  var Detalle=[];
  for(var x=0;x<Analisis.length;x++){
    Detalle.push(document.getElementById('campoAnalisis'+x).value);
    Detalle.push(document.getElementById('tipoAnalisis'+x).value);
    Detalle.push(document.getElementById('campo1Analisis'+x).value);
    Detalle.push(document.getElementById('campo2Analisis'+x).value);
    Detalle.push(document.getElementById('k1Analisis'+x).value);
    Detalle.push(document.getElementById('k2Analisis'+x).value);
    Detalle.push(document.getElementById('operadorAnalisis'+x).value);
    Detalle.push(document.getElementById('filtroAnalisis'+x).value);
    Detalle.push(document.getElementById('valorfiltroAnalisis'+x).value);
  }
  var Det=JSON.stringify(Detalle);
  var cadenaParametros = 'Tabla='+encodeURIComponent(Tabla)+'&NombreAnalisis='+encodeURIComponent(NombreAnalisis)+'&Detalle='+encodeURIComponent(Det);

  fetch('http://www.misfinanzassimples.com/Graficos/php/guardaranalisis.php',{
  method: 'post',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  },
  body: cadenaParametros,

}).then(this.onAjaxCallback1);

}

onAjaxCallback1(xmlhttp) {
  if ( xmlhttp.status==200){
    var Respuesta=xmlhttp.text();
    Respuesta.then(
      function(value) {
        alert("Analisis Guardado Correctamente")
      this.setState({
    });
      }.bind(this),
      );

    
  }
  }



  render() {
    var panelVisible=this.state.panelVisible;
    if(panelVisible[6]=='block'){var panelVisibleInv='none'}else{ var panelVisibleInv='inline-block'}
    var PanelHover=this.state.PanelHover;
    var displayOpAnalisis=this.state.displayOpAnalisis;

    var Campos=this.state.Campos;
    var longcampos=Campos.length;
    var CamposCreados=this.state.CamposCreados;
    var CamposTotales=Campos.concat(CamposCreados);
    const opcionescampos = CamposTotales.map((opcion) =>
    <option key={opcion.toString()}>{opcion}</option>
      );
    var Analisis=this.state.Analisis;
    const LineasAnalisis = Analisis.map((linea) =>
      <div key={'lineaanalisis'+linea}>
      <input type="text" className="Entrada" placeholder="Nombre Campo" id={'campoAnalisis'+linea} onChange={this.handleChangeNombreCampoAnalisis}/>
        <select className="Entrada" onChange={this.handleChangeAnalisis} id={"tipoAnalisis"+linea}>
          <option></option>
          <option>Agrupar Valores</option>
          <option>Resultado de Valores</option>
          <option>Filtrar Valores</option>
        </select>
        <h3 style={{display:displayOpAnalisis[linea][1],marginTop:'0px'}}>agrupar:</h3>
            <input className="Entrada" id={"k1Analisis"+linea} type="text" placeholder="K" style={{display:displayOpAnalisis[linea][2], width:'20px'}} />
            <h3 style={{display:displayOpAnalisis[linea][2], margin:'0px'}}>*</h3>
            <h3 style={{display:displayOpAnalisis[linea][3], marginTop:'0px'}}>filtrar:</h3>
            <select className="Entrada" id={"campo1Analisis"+linea} style={{display:displayOpAnalisis[linea][0], marginLeft:'0px'}}>{opcionescampos.slice(0,parseInt(longcampos)+parseInt(linea))}</select>
            <h3 style={{display:displayOpAnalisis[linea][1],marginTop:'0px'}}>por:</h3>
            <select className="Entrada" id={"operadorAnalisis"+linea} style={{display:displayOpAnalisis[linea][2]}}>
              <option></option>
              <option>+</option>
              <option>-</option>
              <option>*</option>
              <option>/</option>
            </select>
            <input className="Entrada" type="text" id={"k2Analisis"+linea} placeholder="K" style={{display:displayOpAnalisis[linea][2], width:'20px'}}/>
            <h3 style={{display:displayOpAnalisis[linea][2], margin:'0px'}}>*</h3>
            <h3 style={{display:displayOpAnalisis[linea][3],marginTop:'0px'}}>condición:</h3>
             <select className="Entrada" id={"campo2Analisis"+linea} style={{display:displayOpAnalisis[linea][0], marginLeft:'0px'}}>{opcionescampos} </select>
            <select className="Entrada" id={"filtroAnalisis"+linea} style={{display:displayOpAnalisis[linea][3]}}>
              <option></option>
              <option>Igual</option>
              <option>Distinto</option>
              <option>Mayor</option>
              <option>MayorIgual</option>
              <option>Menor</option>
              <option>MenorIgual</option>
            </select>
            <input className="Entrada" id={"valorfiltroAnalisis"+linea} type="text" placeholder="Valor" style={{display:displayOpAnalisis[linea][3], width:'50px'}} />
        <br/>
      </div>
      );
    var Elementos=this.state.Elementos;
    var DatosT=["","Oferta x Edificio","Disponibles x Edificio","Disponibles s/Gespania","Venta Mensual x Edificio","M.A.S. x Edificio","PP Sup. Util x Edificio", "PP Sup. Terraza x Edificio","PP UF x Edificio","PP UF/m2 x Edificio","PxQ x Edificio"];
    
    var DatosXTitulo=this.state.DatosXTitulo;
    const opciones = DatosXTitulo.map((opcion) =>
       <option key={opcion.toString()}>{opcion}</option>
      );

    var cantidadSeries=this.state.cantidadSeries;
    var fil=[];
    for(var a=0;a<cantidadSeries;a++){fil[a]=a}
    const NombSerie = fil.map((columna) =>
      <li key={'nombreserie'+columna} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.5em'}}>{'Serie '+(columna+1)}</p>
        <input className="InputPanel" type="text"  style={{width:'70%', display:'inline-block',margin:'2px 0px'}} id={'nomserie'+columna} onChange={this.handleChangeSerie}  />
      </li>
      );
    
    const EjeSerie = fil.map((fila) =>
      <li key={'datos'+fila} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.5em', verticalAlign:'midle'}}>{'Serie '+(fila+1)}</p>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.7em', verticalAlign:'midle'}}>Izq</p>
        <input type="radio" style={{display:'inline-block',margin:'2px 0px', verticalAlign:'midle'}} name={"radioEje"+fila} id={'EjeI'+fila} onChange={this.handleChangeSerie} />
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.7em', verticalAlign:'midle'}}>Der.</p>
        <input type="radio" style={{display:'inline-block',margin:'2px 0px', verticalAlign:'midle'}} name={"radioEje"+fila} id={'EjeD'+fila} onChange={this.handleChangeSerie} />
      </li>
      );
    const TipoGrafico = fil.map((fila) =>
      <li key={'tipograf'+fila} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'100%', margin:'2px 0px', fontSize:'0.5em', verticalAlign:'midle'}}>{'Serie '+(fila+1)}</p>
        <p style={{display:'inline-block', width:'35%', margin:'2px 0px', fontSize:'0.7em', verticalAlign:'midle'}}>Barras</p>
        <input type="radio" style={{display:'inline-block',margin:'2px 0px', verticalAlign:'midle'}} name={"TipoGrafico"+fila} id={'tiposerieA'+fila} onChange={this.handleChangeSerie}/>
        <p style={{display:'inline-block', width:'35%', margin:'2px 0px', fontSize:'0.7em', verticalAlign:'midle'}}>Líneas</p>
        <input type="radio" style={{display:'inline-block',margin:'2px 0px', verticalAlign:'midle'}} name={"TipoGrafico"+fila}  id={'tiposerieB'+fila} onChange={this.handleChangeSerie}/>
        <p style={{display:'inline-block', width:'35%', margin:'2px 0px', fontSize:'0.7em', verticalAlign:'midle'}}>Areas</p>
        <input type="radio" style={{display:'inline-block',margin:'2px 0px', verticalAlign:'midle'}} name={"TipoGrafico"+fila}  id={'tiposerieC'+fila} onChange={this.handleChangeSerie}/>
        <p style={{display:'inline-block', width:'35%', margin:'2px 0px', fontSize:'0.7em', verticalAlign:'midle'}}>Puntos</p>
        <input type="radio" style={{display:'inline-block',margin:'2px 0px', verticalAlign:'midle'}} name={"TipoGrafico"+fila}  id={'tiposerieD'+fila} onChange={this.handleChangeSerie}/>
      </li>
      );

    const ColorSerie = fil.map((fila) =>
      <li key={'colorSerie'+fila} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.5em', verticalAlign:'midle'}}>{'Serie '+(fila+1)}</p>
        <input type="color" style={{width:'20%'}} id={'colorserie'+fila} onChange={this.handleChangeSerie}/>
      </li>
      );
    
    var IDAxis=["left-y-axis","left-y-axis1","right-y-axis"];
    //var chartData=this.state.chartData;  
    var chartOption=this.state.chartOption; 
    

    var DataSets=this.state.DataSets;

   
    return (
      <div className="App">
        <div className="PanelControl">
          <img src={logoGeo} className="LogoGeo"/>
        <div className="PanelInicial" id="PanelInicial" style={{display:panelVisibleInv}}>
          <div className="DivBotonesLaterales" onClick={this.handleClickBotonesLaterales} id="botonLateral0" style={{opacity:PanelHover[0]}}>
            <img src={folder} className="Icono"/>
            <h5>Proyectos</h5>
          </div>
            <div className="Division" > </div>
          <div className="DivBotonesLaterales" onClick={this.handleClickBotonesLaterales} id="botonLateral1" style={{opacity:PanelHover[1]}}>
            <img src={engranajes} className="Icono"/>
            <h5>Indicadores</h5>
          </div>
            <div className="Division" > </div>
          <div className="DivBotonesLaterales" onClick={this.handleClickBotonesLaterales} id="botonLateral2" style={{opacity:PanelHover[2]}}>
            <img src={panel} className="Icono"/>
            <h5>Tableros</h5>
          </div>
            <div className="Division" > </div>
          <div className="DivBotonesLaterales" onClick={this.handleClickBotonesLaterales} id="botonLateral3" style={{opacity:PanelHover[3]}}>
            <img src={reporte} className="Icono"/>
            <h5>Reportes</h5>
          </div>
        </div>

        <div className="PanelInicial" style={{display:panelVisible[6]}}>
          <div className="ElementoPanel" style={{display:panelVisibleInv}}>
          <img src={logo} className="LogoPanel" id="botonPanel1" onClick={this.handleClickElemento} />
          </div>
          <div className="ElementoPanel" style={{display:panelVisibleInv}}>
            <h2 className="Titulo" id="botonPanel2" style={{display:panelVisibleInv}} onClick={this.handleClickElemento}>T</h2>
            </div>
          <div className="ElementoPanel" style={{display:panelVisibleInv}}>
            <VectorComentario  />
            <div className="DivClick" id="botonPanel3"  onClick={this.handleClickElemento}></div>
          </div>
          <h6>TABLERO</h6>
          <div className="DivBotonesLaterales" onClick={this.handleClickElemento} id="botonPanel1">
            <img src={cuadrado} className="Icono"/>
            <h5>Indicador</h5>
          </div>
          <div className="Division" > </div>
          <div className="DivBotonesLaterales" onClick={this.handleClickElemento} id="botonPanel2">
            <img src={mapa} className="Icono"/>
            <h5>Mapa</h5>
          </div>
          <div className="Division" > </div>
          <div className="DivBotonesLaterales" onClick={this.handleClickElemento} id="botonPanel5">
            <img src={grafico} className="Icono"/>
            <h5>Grafico</h5>
          </div>
          <div className="Division" > </div>
          <div className="DivBotonesLaterales" onClick={this.handleClickElemento} id="botonPanel4">
            <img src={dashboard} className="Icono"/>
            <h5>Tabla</h5>
          </div>
          <div className="ElementoPanel" style={{display:panelVisibleInv}}>
            <h3 className="SaltoPTexto" style={{display:panelVisible[6]}}>Salto de Pagina</h3>
          </div>
        </div>
        </div>
        <div className="PanelElemento" id="panelElemento">
          <div className="BotonCancelar" onClick={this.handleClickCancelElemento}>
            <div className="LineaCancelar1"></div>
            <div className="LineaCancelar2"></div>
          </div>
          <h3 className="TituloPanel" id="TituloPanel"></h3>
          <div id="Op1">
          <p>Tamaño Letra</p> 
          <input className="InputPanel" type="text" id="ElementoSize"  />
          </div>
          <div id="Op2" style={{width:'100%'}}>
          <p>Color</p> 
          <input type="color" id="ElementoColor" />
          </div>
          <div id="Op3" style={{width:'100%'}}>
          <p>Color Viñeta</p> 
          <input type="color" id="VinetaColor"  />
          </div>
          <div id="Op4">
          <p>Ancho</p> 
          <input className="InputPanel" id="ElementoWidth" style={{width:'20%'}} />
          </div>
          <div id="Op5">
          <p style={{width:'90%'}}>Alineación</p>
          <select id="ElementoAlign" style={{width:'90%'}} > 
            <option value=""></option>
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
          </div>
          <div id="Op6">
          <p>Margenes</p>
          <br/>
          <p style={{marginTop:'0px'}}>Superior</p>
          <input className="InputPanel" type="text" id="ElementoMarginTop" />
          <p style={{marginTop:'0px'}}>Derecho</p>
          <input className="InputPanel" type="text" id="ElementoMarginRight" />
          <p style={{marginTop:'0px'}}>Izquierdo</p>
          <input className="InputPanel" type="text" id="ElementoMarginLeft"  />
          </div>

          <div id="Op7" style={{width:'100%', overflowY:'scroll', overflowX:'hidden', height:'380px'}}>

          <div className="Lapiz" onClick={this.handleClickLapiz}>
            <div className="PuntaLapiz"></div>
            <div className="CentroLapiz"></div>
            <div className="FinalLapiz"></div>
          </div>
         <TablaEditada
          BaseDatos={this.state.BaseDatos}
          onClick={this.onAlert}
          cantidadFilas={this.state.cantidadFilas}
         />
         </div>

         <div id="Op8" style={{width:'100%', overflowY:'scroll', overflowX:'hidden', height:'380px'}}>
         <p style={{width:'30%'}}>Ancho</p>
         <input className="InputPanel" type="text" style={{width:'30%'}} id="AnchoGrafico" onChange={this.handleChangeAnchoGrafico} />
         <p style={{width:'50%'}}>Datos en X</p>
         <div>
            <select style={{width:'90%'}} id="selectDatosX" onChange={this.handleChangeDatosX}>{opciones}</select>
          </div>
         <p style={{width:'50%'}}>SERIES</p>
         <input type="button" className="BotonMas" value="+" onClick={this.handleClickMasSeries} />
         <input type="button" className="BotonMas" value="-" onClick={this.handleClickMenosSeries} />
         <p style={{width:'90%', marginTop:'5px'}}>Nombre</p> 
         <ul>{NombSerie}</ul>
         <p style={{marginTop:'5px'}} >Datos</p> 
         <ul>{this.state.SelectDatos}</ul>
         <p style={{width:'90%'}}>Eje</p>
         <ul>{EjeSerie}</ul>
         <p style={{width:'90%'}}>Tipo Grafico</p>
          <ul>{TipoGrafico}</ul>
         <p>Color</p> 
          <ul>{ColorSerie}</ul>
        <p style={{width:'80%'}}>TITULO GRAFICO</p>
        <input className="InputPanel" type="text" style={{width:'80%'}} id="tituloGrafico" onChange={this.handleChangeOptions} />
        <p style={{width:'80%'}}>EJE Y (Izquierdo)</p>
        <p style={{width:'80%',marginTop:'5px'}}>Nombre</p>
        <input className="InputPanel" type="text" style={{width:'80%'}} id="NombreEje1" onChange={this.handleChangeOptions} />
        <p style={{width:'40%',marginTop:'5px'}}>Mínimo</p>
        <input  className="InputPanel" type="text" style={{width:'30%'}} id="MinEje1" onChange={this.handleChangeOptions} />
        <p style={{width:'40%' ,marginTop:'5px'}}>Máximo</p>
        <input className="InputPanel" type="text" style={{width:'30%'}} id="MaxEje1" onChange={this.handleChangeOptions} />
        <p style={{width:'40%' ,marginTop:'5px'}}>Espacio Grilla</p>
        <input className="InputPanel" type="text" style={{width:'30%'}} id="Step1" onChange={this.handleChangeOptions} />
        <p style={{width:'40%',marginTop:'5px'}}>SubEspacio Grilla</p>
        <input className="InputPanel" type="text" style={{width:'30%'}} id="SubStep1" onChange={this.handleChangeOptions} />

        <p style={{width:'80%'}}>EJE Y (Derecho)</p>
        <p style={{width:'80%',marginTop:'5px'}}>Nombre</p>
        <input className="InputPanel" type="text" style={{width:'80%'}} id="NombreEje2" onChange={this.handleChangeOptions} />
        <p style={{width:'40%',marginTop:'5px'}}>Mínimo</p>
        <input className="InputPanel" type="text" style={{width:'30%'}} id="MinEje2" onChange={this.handleChangeOptions} />
        <p style={{width:'40%',marginTop:'5px'}}>Máximo</p>
        <input className="InputPanel" type="text" style={{width:'30%'}} id="MaxEje2" onChange={this.handleChangeOptions} />
        
         <div className="PanelEdicion" id="PanelEdicion">
         <Chart
            chartOption={chartOption}
            chartData={{
                labels:this.state.labels,
                datasets: this.state.DataSets,}}
          /> 
          </div>

          </div>

          <input type="button" className="BotonOk" value="Agregar" id="botonOkElemento" onClick={this.handleClickNuevoElemento} />
          <input type="button" className="BotonOk" value="Modificar" id="botonModifElemento" onClick={this.handleClickModifElemento} />

        </div>

        <div className="PanelProyectos" style={{display:panelVisible[0]}}>
          <img src={logocliente} className="LogoCliente" />
          <h4>Proyectos</h4>
          <div className="DivBotonNuevo">
          <input type="button" className="BotonNuevo" value="NUEVO PROYECTO" onClick={this.handleClickBotonesNuevo} id="botonNuevo4" />
          </div>
          <div className="Box">
          <table>
            <thead>
              <tr>
                <td>Nombre</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>GESPANIA</td>
              <td>Indicadores de Gestión</td>
              <td>Editar</td>
            </tr>
             <tr>
              <td>REGION METROPOLITANA</td>
              <td>Indicadores de Gestión</td>
              <td>Editar</td>
            </tr>
            </tbody>
          </table>
          </div>
        </div>

        <div className="PanelProyectos" style={{display:panelVisible[1]}}>
          <img src={logocliente} className="LogoCliente" />
          <h4>INDICADORES DE GESTION</h4>
          <div className="DivBotonNuevo">
          <input type="button" className="BotonNuevo" value="NUEVOS INDICADORES "onClick={this.handleClickBotonesNuevo} id="botonNuevo5" />
          </div>
          <div className="Box">
          <table>
            <thead>
              <tr>
                <td>Nombre</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>Abril - GESPANIA</td>
              <td>Tablero</td>
              <td>Editar</td>
            </tr>
             <tr>
              <td>Mayo - GESPANIA</td>
              <td>Tablero</td>
              <td>Editar</td>
            </tr>
            </tbody>
          </table>
          </div>
        </div>

         <div className="PanelProyectos" style={{display:panelVisible[2]}}>
         <img src={logocliente} className="LogoCliente" />
          <h4>Tableros</h4>
           <div className="DivBotonNuevo">
          <input type="button" className="BotonNuevo" value="NUEVO TABLERO " onClick={this.handleClickBotonesNuevo} id="botonNuevo6" />
          </div>
          <div className="Box">
           <table>
            <thead>
              <tr>
                <td>Nombre</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>Abril - GESPANIA</td>
              <td>Ver</td>
              <td>Editar</td>
            </tr>
             <tr>
              <td>Mayo - GESPANIA</td>
              <td>Ver</td>
              <td>Editar</td>
            </tr>
            </tbody>
          </table>
          </div>
          </div>

         <div className="PanelProyectos" style={{display:panelVisible[3]}}>
         <img src={logocliente} className="LogoCliente" />
          <h4>Reportes</h4>
           <div className="DivBotonNuevo">
          <input type="button" className="BotonNuevo" value="NUEVO REPORTE" onClick={this.handleClickBotonesNuevo} id="botonNuevo7"/>
          </div>
          <div className="Box">
           <table>
            <thead>
              <tr>
                <td>Nombre</td>
                <td></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>Abril - GESPANIA</td>
              <td>Ver</td>
              <td>Editar</td>
            </tr>
             <tr>
              <td>Mayo - GESPANIA</td>
              <td>Ver</td>
              <td>Editar</td>
            </tr>
            </tbody>
          </table>
          </div>
          </div>

        <div className="PanelProyectos" style={{display:panelVisible[4]}}>
         <img src={logocliente} className="LogoCliente" />
          <h4>Nuevo Proyecto</h4>
          <div className="Box">
           <h6>Nombre</h6>
           <input type="text" className="Entrada" />
           <br/>
            <h6>Campos</h6>
           <input type="button" className="BotonMas1" value="+" />
           <input type="button" className="BotonMas1" value="-" />
           <br/>
           <select className="Entrada">
            <option></option>
            <option>Texto</option>
            <option>Numero</option>
            <option>Fecha</option>
            <option>Check</option>
           </select>
           <input type="text" className="Entrada" placeholder="Nombre del Campo" />
          <div className="DivBotonNuevo">
            <input type="button" className="BotonNuevo" value="CREAR PROYECTO" />
          </div>
          </div>
          </div>

        <div className="PanelProyectos" style={{display:panelVisible[5]}}>
         <img src={logocliente} className="LogoCliente" />
          <h4>Nuevos Indicadores de Gestión</h4>
          <div className="Box">
            <h6>Datos desde Proyecto</h6>
             <select className="Entrada" id="nombreTabla" onChange={this.handleClickCampos}>
              <option value=""></option>
              <option value="GESPANIA">GESPANIA</option>
              <option value="REGION METROPOLITANA">REGION METROPOLITANA</option>
            </select>
            <br/>
            <h6>Nombre</h6>
            <input type="text" id="NombreAnalisis" className="Entrada" />
            <br/>
            <h6>Campos</h6>
            <input type="button" className="BotonMas1" value="+" onClick={this.handleClickMasAnalisis}/>
            <input type="button" className="BotonMas1" value="-" onClick={this.handleClickMenosAnalisis} />
            <div>{LineasAnalisis}</div>
            <div className="DivBotonNuevo">
              <input type="button" className="BotonNuevo" value="CREAR INDICADORES DE GESTION" onClick={this.handleClickGuardarAnalisis} />
            </div>
          </div>
          </div>

         <div className="PanelProyectos" style={{display:panelVisible[6]}}>
            <h6 style={{verticalAlign:'midle', marginLeft:'5px'}}>Indicadores</h6>
             <select className="Entrada" id="nombreTabla" onChange={this.handleClickCampos} style={{verticalAlign:'midle', marginLeft:'5px'}}>
              <option value=""></option>
              <option value="KPI GESPANIA">KPI GESPANIA</option>
            </select>
            <img src={icon1} className="Icono1"/>
            <img src={icon2} className="Icono1"/>
            <img src={icon3} className="Icono1"/>
            <img src={icon4} className="Icono1"/>
            <img src={icon5} className="Icono1"/>
         <select className="Entrada" style={{marginLeft:'5px'}}>{opcionescampos}</select>
         <img src={mapaejemplo} className="Mapa"/>
         </div>
        <div className="PanelCentral" id="PanelCentral">{Elementos}</div>
        <div>
        
        </div>
          
      </div>
    );
  }
}

export default App;

    