import React, { Component, PropTypes } from 'react';
import { isUndefined } from 'lodash';
import classnames from 'classnames';
import { MuiThemeProvider } from 'material-ui/styles';

import HeaderComponent from 'components/HeaderComponent/HeaderComponent';
import SideMenuComponent from 'components/SideMenuComponent/SideMenuComponent';
import LoginPageMediator from 'mediators/LoginPageMediator';
import NavigationMediator from 'mediators/NavigationMediator';
import AppContentContainer from './AppContentContainer';

import styles from './AppPageContainer.css';

export default class AppPageContainer extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._premiumPartnerApi();
  }
  componentDidUpdate() {
    this.props.resize();
    this._premiumPartnerApi();
  }

  _premiumPartnerApi() {
    const { auth } = this.props;
    if (auth.get('isLoggedIn')) {
      this.props.premiumPartnerApiRequest();
    }
  }

  _render() {
    const { auth } = this.props;
    if (auth.get('isLoggedIn')) {
      return (
        <main
          data-ui-ref="AppContentContainer"
          className={classnames(styles.root)}
        >
          <NavigationMediator />
          <div className="u-container full u-flex" data-ui-ref="AppContent">
            <AppContentContainer />
            <SideMenuComponent />
          </div>
        </main>
      );
    } else {
      return <LoginPageMediator />;
    }
  }

  render() {
    return this._render();
  }
}
