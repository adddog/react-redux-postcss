import React, { PureComponent, PropTypes } from "react"
import classnames from "classnames"
import { autobind } from "core-decorators"
import RaisedButton from "material-ui/RaisedButton"

import ActionButtonComponent from "components/UI/ActionButtonComponent"

import styles from "./FileUploadComponent.css"

export default class FileUploadComponent extends PureComponent {

  static propTypes = {
    iconName: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: [],
  }

  render() {
    return (
      <div
        className={classnames([
          ...this.props.className,
          styles.root,
        ])}
      >
        <ActionButtonComponent
          label={"Choose image"}
          icon={<i className="material-icons">{this.props.iconName}</i>}
          onClick={this.props.onClick}
        />
      </div>
    )
  }
}
