import React, { Component } from 'react';
import './App.css'
import grafico from './grafico.png';
import Chart from './Chart';

export class PanelForm extends React.Component {
  constructor(){
    super();
    this.state = {
      estadopanel:5,
       Elementos:[],
      cantidadElementos:0,
      AnchoGrafico:[],
      TipoElemento:[],

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


}

    this.handleClickElemento = this.handleClickElemento.bind(this);
    this.handleClickNuevoElemento = this.handleClickNuevoElemento.bind(this);
    this.handleClickCancelElemento = this.handleClickCancelElemento.bind(this);
    this.handleClickModifElemento = this.handleClickModifElemento.bind(this);

    this.handleClickMasSeries=this.handleClickMasSeries.bind(this);
    this.handleClickMenosSeries=this.handleClickMenosSeries.bind(this);
    this.handleChangeDatosX=this.handleChangeDatosX.bind(this);
    this.handleChangeSerie=this.handleChangeSerie.bind(this);
    this.handleChangeOptions=this.handleChangeOptions.bind(this);
    this.handleChangeAnchoGrafico=this.handleChangeAnchoGrafico.bind(this);
    this.onClickGrafico=this.onClickGrafico.bind(this);
    

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
    var mostrarOp=[[],[7],[1,2,5,6],[1,2,3,4,6],[7],[8],[4,5,6]];
    for(var a=8;a<=8;a++){
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
/*    var xmlhttp = new XMLHttpRequest();
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
*/
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

  render() {
    
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

        <div className="PanelInicial">
          <div className="DivBotonesLaterales" onClick={this.handleClickElemento} id="botonPanel5">
            <img src={grafico} className="Icono"/>
            <h5>Grafico</h5>
          </div>
        <div/>
        </div>

        </div>
        <div className="PanelElemento" id="panelElemento">
          <div className="BotonCancelar" onClick={this.handleClickCancelElemento}>
            <div className="LineaCancelar1"></div>
            <div className="LineaCancelar2"></div>
          </div>
          <h3 className="TituloPanel" id="TituloPanel"></h3>
          

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
        <div className="PanelCentral" id="PanelCentral">{Elementos}</div>
      </div>

    );
  }
}


    