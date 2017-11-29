import React, { PureComponent, PropTypes } from "react"
import classnames from "classnames"
import { TableRow } from "material-ui/Table"
import { PureMaterialUIComponent } from "components/BaseMaterialUI"

import CheckBox from "material-ui/Checkbox"
import CheckboxChecked from 'material-ui/svg-icons/toggle/check-box';
import CheckboxCheckedOut from 'material-ui/svg-icons/toggle/check-box-outline-blank';

import {
  selectedCheckbox,
  unselectedCheckbox
} from "./icons/checkbox"

import styles from "./CheckBoxComponent.css"

export default class CheckBoxComponent extends PureMaterialUIComponent {

  static defaultProps = {
    className: [],
    classes: []
  }

  render() {
    return (
      <div
        className={classnames([
          styles.root,
          this.props.isSelected ? styles["selected"] : null,
          ...this.props.className,
          ...this.props.classes.map(c=>styles[c]),
        ])}
      >
        <span>
          {this.props.label}
        </span>
        <div
          className={classnames(styles.icon)}
          defaultChecked={this.props.defaultChecked}
          onClick={this.props.onCheck}
        >
        {this.props.isSelected ? <CheckboxChecked/> :  <CheckboxCheckedOut/>}
        </div>
      </div>
    )
  }
}
