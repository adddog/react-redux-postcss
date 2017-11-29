import React, { PropTypes } from "react"
import { isEmpty } from "lodash"
import classnames from "classnames"
import { Link } from "react-router"
import { Card, CardText } from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import TextField from "material-ui/TextField"
import { PureMaterialUIComponent } from "components/BaseMaterialUI"

import bassObject from "components/UI/TextFieldComponent.sss"
import CheckBoxComponent from "components/UI/CheckBoxComponent"
import ActionButtonComponent from "components/UI/ActionButtonComponent"

import styles from "./LoginFormComponent.css"

export default class LoginFormComponent extends PureMaterialUIComponent {
  static propTypes = {
    loginErrorMessages: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  }

  render() {
    const {
      loginErrorMessages,
      onSubmit,
      onChange,
      user,
    } = this.props

    return (
      <div className={classnames([])}>
        <div className={classnames([styles.logo])} />
        <form
          action="/"
          onSubmit={onSubmit}
          className={classnames([
            "container",
            styles.uCardNoAnim,
            styles["uCard--light"],
            styles.root,
          ])}
        >
          <p className={classnames([styles.title])}>
            Sign in to start your session
          </p>

          {!isEmpty(loginErrorMessages)
            ? <p className={classnames([styles.uError])}>
                {loginErrorMessages.message}
              </p>
            : null}

          <div className="field-line">
            <TextField
              floatingLabelText="Email"
              underlineFocusStyle={bassObject[".underlineFocusStyle"]}
              name="username"
              onChange={onChange}
              value={user.username}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Password"
              underlineFocusStyle={bassObject[".underlineFocusStyle"]}
              type="password"
              name="password"
              onChange={onChange}
            />
          </div>

          <CheckBoxComponent
            label={"Remember me"}
            className={[styles["remember"]]}
            classes={["root--left"]}
            onCheck={this.props.rememberClicked}
            isSelected={this.props.rememberSelected}
          />

          <div className={[styles["submit__row"]]}>
            <ActionButtonComponent
              label={"Login"}
              onClick={this.props.onSubmit}
            />
          </div>
        </form>
      </div>
    )
  }
}
