import React, { Component } from 'react';
import '../../src/panel.css';
import grafico from './grafico.png';
import Chart from './Chart';
import panel from './panel.png';

export class PanelForm extends React.Component {
    constructor(){
    super();

    this.state = {
  //    url:'http://www.misfinanzassimples.com/Graficos/php/'
      url:'http://45.55.84.16/es/',
      baseProyectos:'project_types/index.json',
      panelVisible:['block',"none","none","none","none","none","none","none"],
      PanelHover:[1],
      Campos:[],
      Analisis:[],
      KPI:[],
      Proyectos:[],
      IDProyectos:[],
      IDProyectoActual:0,
      
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
      DatosXTitulo:[],
      DatosIDKpi:[],
      DatosX:[],
      indiceDatosX:1,
      DataSets: [{
                label:"Serie 1",
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
      datosTabla:[],
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
    this.handleClickMasAnalisis=this.handleClickMasAnalisis.bind(this);
    this.handleClickMenosAnalisis=this.handleClickMenosAnalisis.bind(this);
    this.handleClickGuardarAnalisis=this.handleClickGuardarAnalisis.bind(this);
    this.onAjaxCallback1=this.onAjaxCallback1.bind(this);
    this.buscarKPI=this.buscarKPI.bind(this);
    this.onAjaxCallback2=this.onAjaxCallback2.bind(this);
    this.buscarProyectos=this.buscarProyectos.bind(this);
    this.onAjaxCallbackProyectos=this.onAjaxCallbackProyectos.bind(this);
    this.onAjaxCallbackGuardarElementos=this.onAjaxCallbackGuardarElementos.bind(this);
    //this.onAjaxCallbackElementos=this.onAjaxCallbackElementos.bind(this);
    this.getElementos=this.getElementos.bind(this);
    window.graphs = this.graphs.bind(this);
    window.handleKpi=this.handleKpi.bind(this);
    window.size_box;
    window.handleIdProyecto=this.handleIdProyecto.bind(this);
   
}

handleIdProyecto(event) {
  console.log("handle" + event);
   this.setState({
    IDProyectoActual:event,
    url:"hola",
    });
     }

  handleKpi(event) {
     //this.sizeBox = this.state.size_box;
     var box = size_box;
    this.buscarKPI(box);
    this.getElementos();
     }

  graphs(){
    //console.log(IDProyectoActual);
      
      this.getElementos();

      //this.IDProyectoActual = this.IDProyectoActual;
  }

handleClickMasAnalisis(event) {
 var Analisis=this.state.Analisis;
 var ultimo=Analisis[Analisis.length-1]
 Analisis.push(ultimo+1);
  this.setState({
    Analisis:Analisis,
    });
}

handleClickMenosAnalisis(event) {
 var Analisis=this.state.Analisis;
 var displayOpAnalisis=this.state.displayOpAnalisis;
 if(Analisis.length>1){
  Analisis.pop();
 }
  this.setState({
    Analisis:Analisis,
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
    indiceDatosX:indice,
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
    var AcantidadFilas= this.state.cantidadFilas;
    var AcantidadColumnas= this.state.cantidadColumnas;
    var AEncabezadoColumna= this.state.EncabezadoColumna;
    var Acolor= this.state.color;
    var ABordeIzquierdo= this.state.BordeIzquierdo;
    var ABordeSuperior= this.state.BordeSuperior;
    var ABordeDerecho= this.state.BordeDerecho;
    var ABordeInferior= this.state.BordeInferior;
    var AValoresColumna= this.state.ValoresColumna;
    var AValoresFilaD= this.state.ValoresFilaD;
    var AValoresTexto= this.state.ValoresTexto;
    var AValoresDato= this.state.ValoresDato;
    var AValoresPorcentaje= this.state.ValoresPorcentaje;
    AcantidadFilas.push(cantidadFilas)
    AcantidadColumnas.push(cantidadColumnas)
    AEncabezadoColumna.push(EncabezadoColumna)
    Acolor.push(color)
    ABordeIzquierdo.push(BordeIzquierdo)
    ABordeSuperior.push(BordeSuperior)
    ABordeDerecho.push(BordeDerecho)
    ABordeInferior.push(BordeInferior)
    AValoresColumna.push(ValoresColumna)
    AValoresFilaD.push(ValoresFilaD)
    AValoresTexto.push(ValoresTexto)
    AValoresDato.push(ValoresDato)
    AValoresPorcentaje.push(ValoresPorcentaje)
  this.setState({
    cantidadFilas:AcantidadFilas,
    cantidadColumnas:AcantidadColumnas,
    EncabezadoColumna:AEncabezadoColumna,
    color:Acolor,
    BordeIzquierdo:ABordeIzquierdo,
    BordeSuperior:ABordeSuperior,
    BordeDerecho:ABordeDerecho,
    BordeInferior:ABordeInferior,
    ValoresColumna: AValoresColumna,
    ValoresFilaD: AValoresFilaD,
    ValoresTexto:AValoresTexto,
    ValoresDato:AValoresDato,
    ValoresPorcentaje:AValoresPorcentaje,
    });
}

onClickGrafico(event,chartData,chartOption,NumeroElemento){
  var labels=chartData.labels;
  var DataSets=chartData.datasets;
  var cantidadElementos=this.state.cantidadElementos;
  var AnchoGrafico=this.state.AnchoGrafico;
  var DatosX=this.state.DatosX;
  var DatosXTitulo=this.state.DatosXTitulo;
  for(var a=0;a<cantidadElementos;a++){
    if(a!=NumeroElemento){document.getElementById('Elemento'+a).style.opacity=1}
  }
  document.getElementById('PanelCentral').style.visibility='hidden';
  document.getElementById('AnchoGrafico').value = AnchoGrafico[NumeroElemento];
  var AnchoGrafico1=AnchoGrafico[NumeroElemento]+'%';
  if(AnchoGrafico[NumeroElemento]==''){document.getElementById('PanelEdicion').style.width='25%'}else{document.getElementById('PanelEdicion').style.width=AnchoGrafico1}
  var posicion=DatosX.indexOf(labels);
  document.getElementById('selectDatosX').selectedIndex = (posicion+1);
  var cantidadSeries=DataSets.length;
  var fil=[];
    for(var a=0;a<cantidadSeries;a++){fil[a]=a}
  var DatosSeriesTexto=this.state.DatosSeriesTexto;
  var seleccion=[];
  for(var a=0;a<DatosSeriesTexto[posicion].length;a++){
    var data=chartData.datasets[a].data;
    var posicion1=DatosSeriesTexto[posicion].indexOf(data);
//  alert(data)
 // alert(posicion1);
    if (a==posicion1){seleccion[a]='true'}else{seleccion[a]='false'}
  }
    const opcionesDatosSeries = DatosSeriesTexto[posicion].map((opcion) =>
       <option key={opcion.toString()} selected={seleccion[opcion]}>{opcion}</option>
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
    chartOption:chartOption,
    labels:labels,
    DataSets:DataSets,
    SelectDatos:SelectDatos,
    });
  /*
  label:Serie[z][x],
          data: DataSerie[z][x], 
          yAxisID: IDAxis[Axis[x][z]],
          type: TypeChartString[TypeChart[x][z]],
          fill: FillString[Fill[z][x]],
          lineTension: 0,
          backgroundColor: backgroundColor[x][z],
          borderColor: borderColor[x][z],
          pointStyle:PointStyleString[PointStyleIndex[x][z]]
          */
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
    var mostrarOp=[[],[7],[1,2,5,6],[1,2,3,4,6],[7],[8],[4,5,6]];
    for(var a=1;a<=8;a++){
      document.getElementById('Op'+a).style.display='none';
      for(var b=0;b<mostrarOp[estadopanel].length;b++){
       if(mostrarOp[estadopanel][b]==a){document.getElementById('Op'+a).style.display='inline-block'}
      }
    }

    if(estadopanel==4 || estadopanel==5){
      document.getElementById('PanelCentral').style.visibility='hidden';
    } 
    if(estadopanel==5){
  document.getElementById('AnchoGrafico').value = '';
  document.getElementById('PanelEdicion').style.width='25%';
  document.getElementById('selectDatosX').selectedIndex = 0;
  var cantidadSeries=1;
  var fil=[];
    for(var a=0;a<cantidadSeries;a++){fil[a]=a}
  var DatosSeriesTexto=this.state.DatosSeriesTexto;
  var seleccion=[];
  for(var a=0;a<DatosSeriesTexto[0].length;a++){if (a==0){seleccion[a]='true'}else{seleccion[a]='false'}}
    const opcionesDatosSeries = DatosSeriesTexto[0].map((opcion) =>
       <option key={opcion.toString()} selected={seleccion[opcion]}>{opcion}</option>
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
      DataSets: [{
                label:"Serie 1",
                data: [1,2,3,4,5], 
                type: 'bar',
                }],
      labels:[1,2,3,4,5],
      cantidadSeries:1,  

    estadopanel:estadopanel,
    });
  }
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
//  if(estadopanel==1){var imagen= [this.renderLogo(cantidadElementos)]}
  if(estadopanel==1){var imagen= [this.renderTabla(cantidadElementos)]}
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

//  var TipoElemento=this.state.TipoElemento[cantidadElementos];
//  var AnchoElemento=this.state.ElementoWidth[cantidadElementos];
//  var AlineacionElemento=this.state.ElementoAlign[cantidadElementos];
//  var MargenSupElemento=this.state.ElementoMarginTop[cantidadElementos];
//  var MargenDerElemento=this.state.ElementoMarginRight[cantidadElementos];
//  var MargenIzqElemento=this.state.ElementoMarginLeft[cantidadElementos];
//  var TamanoElemento=this.state.ElementoSize[cantidadElementos];
//  var ColorElemento=this.state.ElementoColor[cantidadElementos];
//  var ColorVinElemento=this.state.VinetaColor[cantidadElementos];
//  var cadenaParametros = 'Tipo='+encodeURIComponent(TipoElemento)+'&Ancho='+encodeURIComponent(AnchoElemento)+'&Alineacion='+encodeURIComponent(AlineacionElemento)
//  +'&MargenSup='+encodeURIComponent(MargenSupElemento)+'&MargenDer='+encodeURIComponent(MargenDerElemento)+'&MargenIzq='+encodeURIComponent(MargenIzqElemento)
//  +'&Tamano='+encodeURIComponent(TamanoElemento)+'&Color='+encodeURIComponent(ColorElemento)+'&ColorVin='+encodeURIComponent(ColorVinElemento);

var chartDataElemento=this.state.chartDataElemento;
var chartOptionElemento=this.state.chartOptionElemento;
var indiceX=document.getElementById('selectDatosX').selectedIndex;
var DatosIDKpi=this.state.DatosIDKpi;
var DatosEnviar={};
for(var a=0;a<chartDataElemento.length;a++){
  var cantidadseries=chartDataElemento[a].datasets.length;
  var Series=[];
  for(var b=0;b<cantidadseries;b++){
    var indiceSerie=document.getElementById('dataserie'+b).selectedIndex;
    var DatosIDKpiElemento=DatosIDKpi[indiceX-1][indiceSerie];
    Series[b]={"label":chartDataElemento[a].datasets[b].label,
              "data":DatosIDKpiElemento,
              "type":"bar",
             }
    }
  DatosEnviar={"kpi":DatosIDKpiElemento,
                      "datasets":Series,
                    }
}

//var cadenaParametros = 'DatosEnviar='+encodeURIComponent(DatosEnviar);
var myo = {};
myo = DatosEnviar;
console.log(DatosEnviar);
var myo_json = JSON.stringify(myo);
//var myo_json = DatosEnviar;

  var IDProyectos=this.state.IDProyectos;
  var IDProy1=document.getElementById('selectProyecto').selectedIndex;
  var IDProy=IDProyectos[IDProy1-1];

  console.log(IDProy);
  fetch('http://45.55.84.16/es/charts/create?properties='+myo_json+'&project_type_id='+IDProy, {'credentials': 'same-origin',
  method: 'post', 
  //  body: cadenaParametros,
  headers:{
            'X-CSRF-Token': window.TokenSocial.token
          }
}).then(this.onAjaxCallbackGuardarElementos);
}

onAjaxCallbackGuardarElementos(xmlhttp) {
  if ( xmlhttp.status==200){
    var Respuesta=xmlhttp.text();
    Respuesta.then(
      function(value) {
      this.setState({
    });
      }.bind(this),
      );   
  }
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
    if(TipoElemento[a]==1){var imagen= [this.renderTabla(a)]}
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
}

renderTitulo(i) {
}


renderComentario(i) {
 
}

  componentWillMount(i){
    this.buscarProyectos(i);
    this.buscarKPI(i);
  }

  getElementos(i){

//document.getElementById('botonNuevo6').click();
fetch('http://45.55.84.16/es/charts/index.json', {'credentials': 'same-origin'
  }).then(response => response.json()).then((value) => {
   
   //console.log("chart"+ value);

        var valuearray = value;
        var TipoElemento=[];
        var chartDataElemento=[];
        var chartOptionElemento=[];
        var Elementos=[];
        var DatosX=this.state.DatosX
        var DatosSeries=this.state.DatosSeries;
        var DatosIDKpi=this.state.DatosIDKpi;

        console.log("chart" + DatosX);


         for(var y=0;y<valuearray.length;y++){
         var arr_properties = JSON.parse(valuearray[y].properties); 
          var datasets=arr_properties.datasets;
          var DataSets=[];
          for(var z=0;z<datasets.length;z++){
            var indice=datasets[z].data;
          for (var i = 0; i < DatosIDKpi.length; i++) {
            var index = DatosIDKpi[i].indexOf(indice);

            if (index > -1) {
            var indice1=i;
            var indice2=index;
           }     }
            var labelX=DatosX[indice1];
            var labeldata=datasets[z].label;
            var data=DatosSeries[indice1][indice2];
            var type=datasets[z].type;
            DataSets[z]={
                label:labeldata,
                data: data, 
                type: type,
                }
          }
          var chartData={
          labels:labelX,
          datasets: DataSets,
        }
        var chartOption={}
        chartDataElemento.push(chartData);
        chartOptionElemento.push(chartOption);
        TipoElemento.push(5);
        this.setState({
          chartDataElemento:chartDataElemento,
          chartOptionElemento:chartOptionElemento,
          TipoElemento:TipoElemento,
        });   
       
        var imagen= [this.renderGrafico(y)];
        
        const imagen1 = imagen.map((img) =>
        <li key={'Elemento'+y}>
          {img}
         </li>
        );
        Elementos.push(imagen1);
}
document.getElementById('panelElemento').style.visibility='hidden';
    document.getElementById('PanelCentral').style.visibility='visible';
this.setState({
    Elementos:Elementos,
    cantidadElementos:valuearray.length,
       });
    });
}

renderGrafico(i) {
  var chartData=this.state.chartDataElemento[i];
    return (
  <Chart
    chartOption={this.state.chartOptionElemento[i]}
    chartData={chartData}
    NumeroElemento={i}
    TipoElemento={this.state.TipoElemento[i]}
    onClick={this.onClickGrafico}

  />
  );
}

renderTabla(i) {
  
}

//// Llamada Ajax Proyectos
buscarProyectos(event){
var url=this.state.url;
var baseProyectos=this.state.baseProyectos;
fetch('http://45.55.84.16/es/project_types/index.json', {'credentials': 'same-origin'})
    .then(this.onAjaxCallbackProyectos);
}


onAjaxCallbackProyectos(xmlhttp) {
  if ( xmlhttp.status==200){
    var Respuesta=xmlhttp.text();
    Respuesta.then(
      function(value) {
        var valuearray =JSON.parse(value);
        var Proyectos=[];
        var IDProyectos=[];
        for(var x=0;x<valuearray.length;x++){
          Proyectos[x]=valuearray[x].name;
          IDProyectos[x]=valuearray[x].id;
        }
        this.setState({
        Proyectos: Proyectos,
        IDProyectos: IDProyectos,
    });
      }.bind(this),
      );
  }
}

//// Primera llamada Ajax
handleClickCampos(event){
  var IDProyectos=this.state.IDProyectos;
  var IDProy1=document.getElementById('nombreTabla').selectedIndex;
  var IDProy=IDProyectos[IDProy1-1];
  this.state.project_type_id = IDProy;

  var cadenaParametros = 'IDP='+encodeURIComponent(IDProy);
 fetch('http://45.55.84.16/es/project_fields/index.json?id='+IDProy, {'credentials': 'same-origin'
    
}).then(this.onAjaxCallback);
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
///Segundo llamado Ajax

handleClickGuardarAnalisis(event){
  var Tabla=document.getElementById('nombreTabla').value;
  var Detalle=[];
  var Analisis=this.state.Analisis;
  for(var x=0;x<Analisis.length;x++){
    Detalle.push(document.getElementById('campoAnalisis'+x).value);
    Detalle.push(document.getElementById('opagrupado'+x).value);
    Detalle.push(document.getElementById('campo1Analisis'+x).value);
    Detalle.push(document.getElementById('campo2Analisis'+x).value);
    Detalle.push(document.getElementById('campo3Analisis'+x).value);
    Detalle.push(document.getElementById('filtroAnalisis'+x).value);
    Detalle.push(document.getElementById('valorfiltroAnalisis'+x).value);
  }
  var Det=JSON.stringify(Detalle);
  var cadenaParametros = 'Tabla='+encodeURIComponent(Tabla)+'&Detalle='+encodeURIComponent(Det);
  fetch('/project_fields/create?data ='+cadenaParametros, {'credentials': 'same-origin',
  method: 'post', 
  body: cadenaParametros,
  headers:{
            'X-CSRF-Token': window.TokenSocial.token
          }
}).then(this.onAjaxCallback1);
}

onAjaxCallback1(xmlhttp) {
  if ( xmlhttp.status==200){
    var Respuesta=xmlhttp.text();
    Respuesta.then(
      function(value) {
        alert("Analisis Guardado Correctamente");
      this.setState({
    });
      }.bind(this),
      );    
  }
  }


///Tercer llamado Ajax

buscarKPI(box){
   //console.log("buscarKPI"+ window.IDProyectoActual);
   
   /*var Prueba=this.state.IDProyectoActual;
   var urlPrueba=this.state.url;
   console.log("esto es prueba"+ Prueba);
   console.log("esto es pruebaurl"+ urlPrueba);*/
fetch('http://45.55.84.16/project_types/kpi.json?data_id=24&graph=true&size_box='+ box, {'credentials': 'same-origin',
//  var IDProyectos=this.state.IDProyectos;
//  var IDProy1=document.getElementById('selectProyecto').selectedIndex;
 // var IDProy=IDProyectos[IDProy1-1];
 // var cadenaParametros = 'IDP='+encodeURIComponent(IDProy);
 // fetch('/project_fields/create?data ='+cadenaParametros, {'credentials': 'same-origin',
  //method: 'post', 

  }).then(this.onAjaxCallback2);
}

onAjaxCallback2(xmlhttp) {
  if ( xmlhttp.status==200){
    var Respuesta=xmlhttp.text();
    Respuesta.then(
      function(value) {
        var valuearray =JSON.parse(value);
        var DatosXTitulo=[""];
        var DatosSeriesTexto=[];
        var DatosX=[];
        var DatosSeries=[];
        var DatosIDKpi=[];
        for(var y=0;y<valuearray.length;y++){
          var existe=0;
          var K1=[];
          var K2=[];
          var D=valuearray[y].data;
            for(var x=0;x<D.length;x++){
             K1[x]=D[x].label;
             K2[x]=D[x].count;
            }
          for(var z=0;z<DatosXTitulo.length;z++){
            if(valuearray[y].group==DatosXTitulo[z]){
              existe=1;
              DatosSeriesTexto[z-1].push(valuearray[y].select);
              DatosIDKpi[z-1].push(valuearray[y].kpi_id);
              DatosSeries[z-1][DatosSeriesTexto[z-1].length-2]=K2;
            }
          }
          if(existe==0){
            DatosXTitulo.push(valuearray[y].group);
            DatosSeriesTexto[DatosXTitulo.length-2]=[""];
            DatosIDKpi[DatosXTitulo.length-2]=[""];
            DatosSeriesTexto[DatosXTitulo.length-2].push(valuearray[y].select);
            DatosIDKpi[DatosXTitulo.length-2].push(valuearray[y].kpi_id);
            DatosX[DatosXTitulo.length-2]=K1;
            DatosSeries[DatosXTitulo.length-2]=[];
            DatosSeries[DatosXTitulo.length-2][0]=K2;
          }
        }
     //   alert(DatosIDKpi);
        this.setState({
        DatosXTitulo:DatosXTitulo,
        DatosX: DatosX,
        DatosSeries: DatosSeries,
        DatosSeriesTexto: DatosSeriesTexto,
        DatosIDKpi:DatosIDKpi,
    });
      }.bind(this),
      );
  }
  }

  render() {
    var panelVisible=this.state.panelVisible;
    if(panelVisible[6]=='block'){var panelVisibleInv='none'}else{ var panelVisibleInv='inline-block'}
    var PanelHover=this.state.PanelHover;

    var Proyectos=this.state.Proyectos;
    var IDProyectos=this.state.IDProyectos;
    const opcionesProyectos = Proyectos.map((opcion) =>
    <option key={IDProyectos[opcion]} value={IDProyectos[opcion]}>{opcion}</option>
      );
    var tablaProyecto=[];
    for(var x=0;x<Proyectos.length;x++){
      var fi=[x];
      tablaProyecto[x]=fi.map((columna)=> 
       <tr key={'filaProy'+columna}>
        <td>{Proyectos[x]}</td>
        <td>Indicadores de Gestión</td>
        <td>Editar</td>
        </tr>
           );
    }
    var KPI=this.state.KPI;
    const opcionesAnalisis = KPI.map((opcion) =>
    <option key={opcion.toString()}>{opcion}</option>
      );
    var tablaKPI=[];
    for(var x=0;x<KPI.length;x++){
      var fi=[x];
      tablaKPI[x]=fi.map((columna)=> 
       <tr key={'filaKPI'+columna}>
        <td>{KPI[x]}</td>
        <td>Tablero</td>
        <td>Editar</td>
        </tr>
           );
    }
    var Campos=this.state.Campos;
    const opcionescampos = Campos.map((opcion) =>
    <option key={opcion.toString()}>{opcion}</option>
      );
    var Analisis=this.state.Analisis;
    const LineasAnalisis = Analisis.map((linea) =>
      <div key={'lineaanalisis'+linea}>
      <input type="text" className="Entrada" placeholder="Nombre Campo" id={'campoAnalisis'+linea}/>
        <select className="Entrada" id={"opagrupado"+linea}>
              <option></option>
              <option>Sumatoria</option>
              <option>Cantidad Registros</option>
              <option>Promedio</option>
              <option>Mínimo</option>
              <option>Máximo</option>
            </select>
            <select className="Entrada" id={"campo1Analisis"+linea} style={{marginLeft:'0px'}}>{opcionescampos}</select>
            <h3 style={{marginTop:'0px'}}>Agrupado por:</h3>
            <select className="Entrada" id={"campo2Analisis"+linea} style={{marginLeft:'0px'}}>{opcionescampos}</select>
            <h3 style={{marginTop:'0px'}}>condición:</h3>
            <select className="Entrada" id={"campo3Analisis"+linea} style={{marginLeft:'0px'}}>{opcionescampos}</select>
            <select className="Entrada" id={"filtroAnalisis"+linea}>
              <option></option>
              <option>Igual</option>
              <option>Distinto</option>
              <option>Mayor</option>
              <option>MayorIgual</option>
              <option>Menor</option>
              <option>MenorIgual</option>
            </select>
            <input className="Entrada" id={"valorfiltroAnalisis"+linea} type="text" placeholder="Valor" style={{width:'50px'}} />
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
    var DataSets=this.state.DataSets;
    var LabelTraer=[];
    var longDataSets=DataSets.length;
    var fil=[];
    for(var a=0;a<cantidadSeries;a++){
      fil[a]=a;
      var b=a+1;
      if(a<longDataSets){LabelTraer[a]=DataSets[a].label;}else{LabelTraer[a]='Serie'+b}
    }
    const NombSerie = fil.map((columna) =>
      <li key={'nombreserie'+columna} style={{width:'100%', padding:'0px'}}>
        <p style={{display:'inline-block', width:'20%', margin:'2px 0px', fontSize:'0.5em'}}>{'Serie '+(parseInt(columna)+1)}</p>
        <input className="InputPanel" type="text"  style={{width:'70%', display:'inline-block',margin:'2px 0px'}} id={'nomserie'+columna} onChange={this.handleChangeSerie} value={LabelTraer[columna]}  />
      </li>
      );
     
    var fil=[];
    for(var a=0;a<cantidadSeries;a++){fil[a]=a}
    var DatosSeriesTexto=this.state.DatosSeriesTexto;
    var indiceDatosX=this.state.indiceDatosX;
    const opcionesDatosSeries = DatosSeriesTexto[indiceDatosX-1].map((opcion) =>
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
          <div className="DivBotonesLaterales" onClick={this.handleClickBotonesLaterales} id="botonLateral2" style={{opacity:PanelHover[2]}}>
            <img src={panel} className="Icono"/>
            <h5>Tableros</h5>
          </div>
            <div className="Division" > </div>
        </div>

        <div className="PanelInicial" style={{display:panelVisible[6]}}>
          <div className="DivBotonesLaterales" onClick={this.handleClickElemento} id="botonPanel5">
            <img src={grafico} className="Icono" style={{width:'4%', marginLeft:'15%'}}/>
            <h5>Grafico</h5>
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

         </div>

         <div id="Op8" style={{width:'100%', overflowY:'scroll', overflowX:'hidden', height:'380px'}}>
         <p style={{width:'30%'}}>Ancho</p>
         <input className="InputPanel" type="text" style={{width:'30%'}} id="AnchoGrafico" onChange={this.handleChangeAnchoGrafico} />
         <p style={{width:'50%'}}>Datos en X</p>
         <div>
            <select style={{width:'90%'}} id="selectDatosX" onChange={this.handleChangeDatosX}>{opciones}</select>
          </div>
         <p style={{width:'50%'}}>SERIES</p>
         <input type="button" className="BotonMas" id='botonMasSerie' value="+" onClick={this.handleClickMasSeries} />
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


         <div className="PanelProyectos" style={{display:panelVisible[2]}}>
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
              <td onClick={this.getElementos}>Abril - GESPANIA</td>
              <td onClick={this.getElementos}>Ver</td>
              <td>Editar</td>
            </tr>
             <tr>
              <td onClick={this.getElementos}>Mayo - GESPANIA</td>
              <td onClick={this.getElementos}>Ver</td>
              <td>Editar</td>
            </tr>
            </tbody>
          </table>
          </div>
          </div>


         <div className="PanelProyectos" style={{display:panelVisible[6]}}>
           <h6>Proyecto</h6>
             <select className="Entrada" id="selectProyecto" onChange={this.buscarKPI}>
              <option></option>
              {opcionesProyectos}
            </select>
         </div>
        <div className="PanelCentral" id="PanelCentral">{Elementos}</div>
        <div>
        
        </div>
          
      </div>
    );
  }
}
