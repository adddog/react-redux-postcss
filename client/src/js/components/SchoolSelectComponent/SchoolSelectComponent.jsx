import React, { PureComponent, Component } from "react"
import { keys, values } from "lodash"
import classnames from "classnames"
import ReactList from "react-list"
import { InputAutocomplete } from "input-autocomplete"
import Dropdown from "react-dropdown"

import styles from "./SchoolSelectComponent.css"

export default class SchoolSelectComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedValue: "",
      filteredData:[],
      opened: true,
    }
    this._data = new Map()
  }

  set data(props) {
    const { auth } = props
    const hasAGlobal = auth.get("hasAGlobal")
    const userSchools = auth.get("userSchools")
    const allSchools = auth.get("allSchools").forEach(schoolObj=>{
      if (hasAGlobal || userSchools.includes(schoolObj.id_ipeds.toString())) {
        this._data.set(schoolObj.name, schoolObj)
      }
    })
    this._dataLabels = Array.from(this._data.keys())
  }

  get listDisplayData(){
    return this.state.filteredData.size ? this.state.filteredData : this._data
  }

  get dataDisplayLabels(){
    return Array.from(this.listDisplayData.keys())
  }

  componentWillReceiveProps(nextProps) {
    this.data = nextProps
    this.setState({
      ...this.state,
      selectedValue: ""//"this._labels[0]",
    })
  }

  _toggle() {
    this.setState({
      opened: !this.state.opened,
    })
  }

  _handleOnChange(ev) {
    const inputValue = ev.currentTarget.value.toLowerCase()

    const filteredData = new Map()

    this._dataLabels.filter(
      label => !inputValue || label.toLowerCase().includes(inputValue)
    ).forEach(label=>filteredData.set(label,this._data.get(label)))


    this.setState({
      ...this.state,
      filteredData:filteredData,
    })
  }

  renderItem(index, key) {
    return (
      <div
        data-ipeds={this._data.get(this.dataDisplayLabels[index]).id_ipeds}
        data-label={this.dataDisplayLabels[index]}
        className={classnames([styles["menu-list-item"]])}
        key={key}
        onClick={e => {
          this.props.updateIpeds(
            e.target.dataset.ipeds
          )
        }}
      >
        {this.dataDisplayLabels[index]}
      </div>
    )
  }

  _renderList() {
    return (
      <div className={classnames([styles["menu"]])}>
        <input
          className={classnames([styles["menu-input"]])}
          placeholder="type"
          type="text"
          value={this.state.name}
          onChange={::this._handleOnChange}
        />
        <div className={classnames([styles["menu-list"]])}>
          <ReactList
            itemRenderer={::this.renderItem}
            length={this.listDisplayData.size}
            type="simple"
          />
        </div>
      </div>
    )
  }
  render() {
    const { auth } = this.props

    return (
      <div className={classnames([styles["root"]])}>
        <span
          className={classnames([styles["selectedValue"]])}
          onClick={this._toggle.bind(this)}
        >
          {this.state.selectedValue}
        </span>
        <span className={classnames([styles["menu-container"]])}>
          {this.state.opened ? this._renderList() : null}
        </span>
      </div>
    )
  }
}
