import React, { Component, PropTypes } from 'react';
import configureRoutes from 'routes/configureRoutes';

export default class AppContentContainer extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
  }

  render() {
    return configureRoutes();
  }
}
