import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Chart from './components/Chart';
import Comentario from './components/Comentario';
import Tabla from './components/Tabla';

class App extends Component {
  constructor(){
    super();
    this.state = {
      chartData:{},
      chartOption:{},
      idcomentario: [0,1,2,3,4,5,6,7,8,9,10],
      classbullet:['Bullet1',"Bullet1","Bullet1","Bullet2"],
      datosTabla:{},
      colorCelda:{}
}
}
  componentWillMount(i){
    this.getChartOptions(i);
    this.getChartData(i);
    this.getDatosTabla(i);
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
      ['2013','2014','2015','2016','2017','2018']
      ]
    var Serie = [];
    var DataSerie = [];
    Serie[0] = ["Oferta","VM Comuna","UF","Concón Reñaca","Concón Reñaca","Concón Reñaca","Concón Reñaca","Bajo UF 3.400"];
    DataSerie[0] =[
      [3850,3950,3800,4200,3400,3600,3580,4460,5290,5164],
      [81,88,90,110,109,170,98,116,120,137],
      [5700,5900,5550,5510,5000,6180,6486,6326,6100,5523],
      [98,95.5,78,81.8,78.9,68.8],
      [5600,5850,5350,6275,6288,5523],
      [48,51,57,64.6,67,69],
      [81,87,105,130,118,137],
      [16,21,18,12,9,8]
            ]
    Serie[1] = ["Disponibilidad","VM x Edificio","m2","","","","","UF3.400 a 7.950"];
    DataSerie[1] =[
      [1200,1180,900,1000,1100,1190,1050,2036,2120,2035],
      [2.1,2,2.3,3,3.5,4.6,2.6,2.7,2.4,3],
      [98,101,92,83,76,82,83,78,78,69],
      [],
      [],
      [],
      [],
      [60,68,90,98,88,102]
            ]
    Serie[2] = ["Edificios","MAS","UFm2","","","","","Sobre UF 7.950"];
    DataSerie[2] =[
      [40,44,39,38,32,36,37,43,48,46],
      [18,17,14,11,15,9,15.3,17.5,18,14.8],
      [49,51,53,56,57,64,65,67.8,65,69],
      [],
      [],
      [],
      [],
      [81,87,105,130,118,137]
            ]
    var IDAxis=["left-y-axis","left-y-axis1","right-y-axis"];
    var Axis = [[0,1,2],[2,1,2],[2,0,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    var TypeChartString = ["line","bar"]
    var TypeChart = [[0,0,1],[0,0,1],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    var backgroundColor = [ ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["black","red","rgb(139,101,176)"],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(17,10,38)","",""],
                            ["rgb(73,96,171)","rgb(243,127,235)","rgb(233,240,8)"]
                            ];
    var FillString = ["false","true"];
    var Fill=[[0,0,0,0,0,0,1],[0,0,0,0,0,0,1],[0,0,0,0,0,0,1]]
    for(var x=0;x<=7;x++){
      var SerieOp = [];
      for (var z=0;z<=2;z++){
       if(Serie[z][x]!==''){
          SerieOp.push ({
          label:Serie[z][x],
          data: DataSerie[z][x], 
          yAxisID: IDAxis[Axis[x][z]],
          type: TypeChartString[TypeChart[x][z]],
          fill: FillString[Fill[z][x]],
          lineTension: 0,
          backgroundColor: backgroundColor[x][z],
          borderColor: backgroundColor[x][z],
          })
        }
      }
      chartData[x]={
        labels: XData[x],
        datasets: SerieOp,
      }
    }
    this.setState({
      chartData: chartData,
    });
  }

getChartOptions(i){
  var Titulo = ["","","","Superficie Promedio (m2)", "Precio Promedio (UF)", "Precio Unitario (UFm2)","Ventas Mensuales","Ventas Mensuales por Tramo"]
    var NombreEjeY=[];
    var minEjeY = [];
    var maxEjeY = [];
    NombreEjeY[0] = ["# VIVIENDAS","VIVIENDAS x PROYECTO","SUPERFICIE (M2) | UFM2", "","","","",""];
    minEjeY[0] = [0,0,40,60,4000,45,0,0];
    maxEjeY[0] = [6000,9,110,100,8000,75,150,140];
    NombreEjeY[1] = ["# EDIFICIOS","VIVIENDAS x SECTOR | MESES PARA AGOTAR STOCK","PRECIO UF" ,"","","","",""];
    minEjeY[1] = [0,0,3500,0,0,0,0];
    maxEjeY[1] = [80,180,7000,0,0,0,0];
    var Step = [1000,1,10,5,500,5,10,10];
    var StepSub = [200,0.2,2,5,500,5,10,10];
    var DisplayYAxes = [[1,1,1],[1,1,1],[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,0,0]]
    var chartOption = [];
    for(var x=0;x<=7;x++){
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
            min: minEjeY[1][x],
            max: maxEjeY[1][x],
          },
          gridLines: {
            display: false,
          }
        }
        var yAxes = [];
        if(DisplayYAxes[x][0]===1){yAxes.push(yAxes1)}
        if(DisplayYAxes[x][1]===1){yAxes.push(yAxes2)}
        if(DisplayYAxes[x][2]===1){yAxes.push(yAxes3)}


      chartOption[x]={
        maintainAspectRatio: false,
        elements:{
            point:{
            radius: 0,
            },
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
          },
          legend:{
            display: true,
            position:'bottom',
            labels:{
              boxWidth:40,
              padding:10,
            },
          },
          scales: {
            yAxes: yAxes ,
            xAxes: [{
              barPercentage:1,
              categoryPercentage: 1,
            }]
          }
      }
  }
  this.setState({
      chartOption: chartOption,
    });
}
getDatosTabla(i){
    // Ajax calls here
    var datosTabla = [[["Variables","Mínimo Sector","Máximo Sector","Sector","Gespania","Respecto a Sector"],
                      ["Oferta Edificios",38,279,130,279,"Más Denso"],
                      ["Disponibilidad (sin Gespania)",3,168,49,279,"",],
                      ["Venta Mensual",0.2,14.3,4.7,"-","",],
                      ["Meses para Agotar Stock",0.7,110,14,"-","",],
                      ["Superficie Util Promedio",45.7,101.5,64,55.7,"-13%"],
                      ["Superficie Terraza",7.2,29.7,14.5,11.5,"-20%"]],
                       ];
    var colorCelda = [[["white","white","rgb(242,198,132)","white","white","rgb(242,198,132)"],
                       ["rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)","rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)"],
                       ["rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)","rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)"],
                       ["white","white","rgb(242,198,132)","white","white","rgb(242,198,132)"],
                       ["white","white","rgb(242,198,132)","white","white","rgb(242,198,132)"],
                       ["rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)","rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)"],
                       ["rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)","rgb(212,210,223)","rgb(212,210,223)","rgb(242,198,132)"]
                       ]]
    this.setState({
      datosTabla: datosTabla,
      colorCelda:colorCelda,
    });
  }

renderGrafico(i) {
  return (
  <Chart
    chartOption={this.state.chartOption[i]}
    chartData={this.state.chartData[i]}
  />
  );
}
renderComentario(i) {
  return (
  <Comentario
    idcomentario={this.state.idcomentario[i]}
    classbullet={this.state.classbullet[i]}
  />
  );
}
renderTabla(i) {
  return (
  <Tabla
    datosTabla={this.state.datosTabla[i]}
    colorCelda={this.state.colorCelda[i]}
  />
  );
}

  render() {
    return (
      <div className="App">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="Titulo1">Costa Montemar</h2>
          <h2 className="Titulo2">Concón, Región de Valparaíso</h2>
          <h2 className="Titulo3">Estudio Mercado Inmobiliario</h2>
          <h2 className="Titulo2">Edificios Residenciales en Venta</h2>
          <h2 className="Titulo2" style={{marginTop: 50+'px'}}>Abril 2018</h2>
          <div className="SaltoDePagina"></div>
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="Titulo4">Evolución Histórica</h2>
          <div className="SaltoDePagina"></div>
          <h2 className="Titulo5">Concón & Reñaca</h2>
          <h2 className="Titulo6">| Evolución Actividad y Precio</h2>
          <br/>
          <div className="Contenedor">
          <div className="Grafico">
             {this.renderGrafico(0)}
          </div>
          <div className="Grafico">
             {this.renderGrafico(1)}
          </div>
          <div className="Grafico">
             {this.renderGrafico(2)}
          </div>
           <div className="DivComentario">
             {this.renderComentario(0)}
          </div>
          <div className="DivComentario">
             {this.renderComentario(1)}
          </div>
          <div className="DivComentario">
             {this.renderComentario(2)}
          </div>
          </div>
          <div className="SaltoDePagina"></div>
          <h2 className="Titulo5">Concón & Reñaca</h2>
          <h2 className="Titulo6">| Superficie y Precio</h2>
          <br/>
           <div className="Contenedor">
           <div className="Grafico">
             {this.renderGrafico(3)}
          </div>
           <div className="Grafico">
             {this.renderGrafico(4)}
          </div>
           <div className="Grafico">
             {this.renderGrafico(5)}
          </div>
          </div>
          <div className="SaltoDePagina"></div>
          <h2 className="Titulo5">Concón & Reñaca</h2>
          <h2 className="Titulo6">| Ventas Mensuales</h2>
          <br/>
           <div className="Contenedor">
           <div className="Grafico">
             {this.renderGrafico(6)}
          </div>
           <div className="Grafico1">
             {this.renderGrafico(7)}
          </div>
          </div>
          <div className="SaltoDePagina"></div>
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="Titulo4">Posicionamiento Edificio Montemar Gespania</h2>
          <div className="SaltoDePagina"></div>
          <h2 className="Titulo5">Costa Montemar</h2>
          <h2 className="Titulo6">| Conclusiones</h2>
          <div className="DivComentario1">
             {this.renderComentario(3)}
          </div>
          <div className="SaltoDePagina"></div>
          <h2 className="Titulo5">Posicionamiento</h2>
          <h2 className="Titulo6">| Conclusiones</h2>
          <div className="DivTabla">
            {this.renderTabla(0)}
          </div>
          <div className="SaltoDePagina"></div>
          
      </div>
    );
  }
}

export default App;

    