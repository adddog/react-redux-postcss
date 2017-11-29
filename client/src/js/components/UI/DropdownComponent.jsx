import React, { PureComponent, Component } from 'react';
import classnames from "classnames";
import {map} from "lodash";

import { PureMaterialUIComponent } from 'components/BaseMaterialUI';
import Dropdown from 'react-dropdown';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import s from "./DropdownComponent.scss";

export default class DropdownComponent extends Component {

  constructor(props){
    super(props)
    this.state={
      value:0
    }
  }

  render(){
    // this.labels =  this.props.menu.map(o=>o.label)
    this.labels = map({
      100654: {label: "Alabama A & M University"},
      100663: {label: "University of Alabama at Birmingham"},
      100690: {label: "Amridge University"}
    })
    return(
        <Dropdown
          options={this.labels}
          value={this.state.value}
          placeholder={this.props.placeholder || ""}
          onChange={(e)=>{
            this.setState({value:this.labels.indexOf(e.label)})
            this.props.onChange(e)
          }}
        />
    )
  }
}
