import React, { PropTypes, PureComponent } from 'react';

export default class PageComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.object.children
  };

  render() {
    const { children, className } = this.props;
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}
