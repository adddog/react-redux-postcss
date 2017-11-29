import React, { PureComponent, Component } from 'react';
import classnames from 'classnames';

import styles from './SpinnerComponent.css';

export default class SpinnerComponent extends PureComponent {
  static defaultProps = {
    classes: []
  };

  render() {
    return (
      <div className="la-ball-clip-rotate la-dark la-2x">
        <div />
      </div>
    );
  }
}

export class SpinnerWrapperComponent extends PureComponent {
  static defaultProps = {
    classes: []
  };

  render() {
    if (!this.props.isVisible) return null;
    return (
      <div
        className={classnames(
          styles['root__wrapper'],
          ...this.props.classes.map(c => styles[c])
        )}
      >
        <SpinnerComponent />
      </div>
    );
  }
}
