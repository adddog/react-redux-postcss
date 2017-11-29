import React, { PureComponent,Component } from 'react';
import {getMuiTheme} from 'material-ui/styles'

export class PureMaterialUIComponent extends PureComponent {
  static childContextTypes = {
    muiTheme: React.PropTypes.object
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    }
  }
}


export class MaterialUIComponent extends Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme()
    }
  }
}
