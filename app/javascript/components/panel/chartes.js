import React from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2'


export class Chartes extends React.Component{

  constructor(props){
    super(props)

    this.state = {
      chartData:{
        labels:['red', 'blue'],
        datasets:[
          {
            label: 'colores',
            data:[50 , 80],
            backgroundColor:['red', 'blue']
          }
      ]
    }
    }
  }

  render(){
    return(
      <div>

        <Pie
	          data={this.state.chartData}
            width={100}
             height={10}
	           options={{}}
/>
      </div>
    )
  }

}
