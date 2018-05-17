import React from 'react';
import {PanelForm} from '../components/panel/panel_form';
import WebpackerReact from 'webpacker-react'



export class Panel extends React.Component{

  render(){
    return(
        <div>
          <PanelForm></PanelForm>
        </div>
    )
  }
}
WebpackerReact.setup({Panel});
