import React, { PureComponent, Component } from 'react';
import classnames from "classnames";
import { PureMaterialUIComponent } from 'components/BaseMaterialUI';
import styles from "./ArrowComponent.css"
export default class ArrowComponent extends PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        className={classnames([
          styles.root,
          this.props.className,
          this.props.isLeft ? styles['root--left'] : null
        ])}
        onClick={()=>this.props.onClick(!!this.props.isLeft)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M7.5 4.5L6.44 5.56 9.88 9l-3.44 3.44L7.5 13.5 12 9z"/></svg>
      </div>
    )
  }
}
