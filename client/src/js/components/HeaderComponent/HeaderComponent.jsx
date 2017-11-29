import React, { PureComponent } from 'react';
import classnames from 'classnames';

import LogoComponent from 'components/LogoComponent/LogoComponent';

import styles from './HeaderComponent.css';

export default class HeaderComponent extends PureComponent {
  render() {
    return (
      <header className={classnames(styles.root)}>
        <LogoComponent />
      </header>
    );
  }
}
