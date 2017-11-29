import React, { PureComponent, Component } from "react"
import { keys, values } from "lodash"
import classnames from "classnames"
import Dropdown from 'react-dropdown';

export default class SchoolSelectComponent extends PureComponent {
  render() {
    const { auth } = this.props
    const schools = auth.get("schools")
    const labels = values(schools).map(({ label }) => label)
    const ipeds = keys(schools)
    return (
      <Dropdown
        options={labels}
        value={labels[0]}
        placeholder={this.props.placeholder || ""}
        onChange={e =>
          this.props.updateIpeds(ipeds[labels.indexOf(e.label)])}
      />
    )
  }
}
