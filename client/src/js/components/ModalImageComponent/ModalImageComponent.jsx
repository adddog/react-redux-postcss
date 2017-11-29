import React, { Component, PropTypes } from "react"
import { findDOMNode } from "react-dom"
import { autobind } from "core-decorators"
import { find, omit } from "lodash"
import classnames from "classnames"
import ReactTooltip from "react-tooltip"
import validator from "validator"
import CircleCloseComponent from "components/UI/CircleCloseComponent"
import TextFieldComponent from "components/UI/TextFieldComponent"
import SeparatorComponent from "components/UI/SeparatorComponent"
import ModalIconLabelComponent from "components/ModalComponent/ModalIconLabelComponent"

import styles from "./ModalImageComponent.css"

const TYPES = {
  UPLOAD: "UPLOAD",
  LINK: "LINK",
}

const SelectChoiceComponent = (state, props) => {
  switch (state.activeChoice) {
    case TYPES.UPLOAD:
      break
    case TYPES.LINK:
      return (
        <div className={classnames([styles["link"]])}>
          {!!state.viewbookImageLinkError
            ? <p className={classnames([styles["link--error"]])}>
                {state.viewbookImageLinkError}
              </p>
            : null}
          <TextFieldComponent
            iconClass="fa fa-link"
            onChange={props.onChange}
            onKeyPress={props.onKeyPress}
            className={[styles["link--textfield"]]}
            hintText="Paste a link..."
            multiLine={false}
            autoFocus={true}
            rows={1}
          />
          <ModalIconLabelComponent
            classes={["root--yes", "root--padding"]}
            onClick={() => {
              if (!state.viewbookImageLinkError) {
                props.onYes()
              }
            }}
            icon="check_circle"
          />
        </div>
      )
      break
    default: {
      return (
        <ModalIconLabelComponent
          className={classnames([styles["root__image__inner"]])}
          icon={props.icon}
          label={props.label}
        />
      )
    }
  }
}

const ChoiceComponent = ({ children, ...props }) =>
  <div
    {...omit(props, [
      "label",
      "icon",
      "state",
      "onYes",
      "onKeyPress",
      "onChange",
    ])}
  >
    {SelectChoiceComponent(props.state, props)}
  </div>

export default class ModalImageComponent extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    onImageSelected: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      viewbookImageLink: "",
      viewbookImageLinkError: false,
      activeChoice: null,
      imageChosen: false,
    }
  }

  _renderChoice(type, props) {
    if (this.state.activeChoice && this.state.activeChoice !== type)
      return null
    return (
      <ChoiceComponent
        type={type}
        className={classnames([
          styles["root__image"],
          this.state.activeChoice === type
            ? [styles["root__image--active"]]
            : null,
        ])}
        onClick={() => {
          if (type === TYPES.UPLOAD) {
            this.refs.inputEl.click()
          } else {
            this.setState({ activeChoice: type })
          }
        }}
        state={this.state}
        {...props}
      />
    )
  }

  _renderSeperator() {
    if (!!this.state.activeChoice) return null
    return <SeparatorComponent />
  }

  _renderClose() {
    return (
      <CircleCloseComponent
        onClick={() => {
          if (!this.state.activeChoice) {
            this.props.closeModal()
          } else {
            this.setState({ activeChoice: null })
          }
        }}
        className={["fa fa-close", styles.closeIcon]}
      />
    )
  }

  @autobind
  _onFileSelected(e) {
    this.setState({ imageChosen: true })
    this.props.onImageSelected(e.target.files)
  }

  render() {
    return (
      <div
        ref="rootEl"
        className={classnames([
          styles.root,
          !!this.state.activeChoice ? styles["root--clicked"] : null,
          this.state.activeChoice === TYPES.LINK
            ? styles["root--clicked--right"]
            : styles["root--clicked--left"],
        ])}
      >
        <input
          ref="inputEl"
          className={classnames([styles.input])}
          onChange={this._onFileSelected}
          type="file"
          id="files"
          name="files[]"
          placeholder=""
        />
        {this._renderChoice(TYPES.UPLOAD, {
          icon: this.state.imageChosen ? "collections" : "image",
          label: "Upload a photo",
        })}
        {this._renderSeperator()}
        {this._renderChoice(TYPES.LINK, {
          value: this.state.viewbookImageLink,
          icon: "link",
          label: "Paste a link",
          onKeyPress: (e, val) => {
            if (
              e.charCode === 13 &&
              this.state.viewbookImageLink.length &&
              !this.state.viewbookImageLinkError
            ) {
              this.props.viewbookImageLinkSelectd()
            }
          },
          onChange: (e, val) => {
            const validURL = validator.isURL(val)
            this.setState({
              viewbookImageLink: val,
              viewbookImageLinkError: !validURL
                ? "Not a valid URL"
                : false,
            })
            if (validURL) {
              this.props.viewbookImageLink(val)
            }
          },
          onYes: () => {
            if (!!this.state.viewbookImageLink.length) {
              if (!this.state.viewbookImageLinkError) {
                this.props.viewbookImageLinkSelectd()
              }
            } else {
              this.props.closeModal()
            }
          },
        })}
        {this._renderClose()}
      </div>
    )
  }
}
