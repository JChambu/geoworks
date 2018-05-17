import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';

class Chart extends Component {
  constructor(props){
    super(props);
    this.state = {
      chartData:props.chartData,
      chartOption:props.chartOption,
  }
}
  static defaultProps = {
    displayLegend: true,
    responsive: false,
  }
  render(){
    return (
      <div>
       <Bar
        data={this.state.chartData}
        height={540}
        options={
          this.state.chartOption          
        }
        />
      </div>
      )
  }
}
export default Chart;