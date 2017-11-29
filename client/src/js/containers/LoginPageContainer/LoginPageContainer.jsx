import React, { Component, PropTypes } from "react"
import LoginFormComponent from "components/LoginFormComponent/LoginFormComponent"
import classnames from "classnames"
import Util from "util"

import styles from "./LoginPageContainer.css"

export default class LoginPageContainer extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    loginErrorMessages: PropTypes.object.isRequired
  }

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props)

    const storedMessage = localStorage.getItem("successMessage")
    let successMessage = ""

    if (storedMessage) {
      successMessage = storedMessage
      localStorage.removeItem("successMessage")
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      rememberSelected:true,
      user: {
        email: "",
        password: ""
      }
    }

    this.processForm = this.processForm.bind(this)
    this.changeUser = this.changeUser.bind(this)
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    event.preventDefault()
    this.props.login({
      username: encodeURIComponent(this.state.user.username),
      password: encodeURIComponent(this.state.user.password),
      remember:this.state.rememberSelected,
      formSubmitted: true
    })
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name
    const user = this.state.user
    user[field] = event.target.value
    this.setState({
      user
    })
  }

  /**
   * Render the component.
   */
  render() {
    const { loginErrorMessages,auth } = this.props
    return (
      <div className="u-page u-flex-center">
        <LoginFormComponent
          rememberSelected={this.state.rememberSelected}
          rememberClicked={()=>{
            this.setState({
              rememberSelected:!this.state.rememberSelected
            })
          }}
          loginErrorMessages={loginErrorMessages}
          className={classnames(styles.root)}
          onSubmit={this.processForm}
          onChange={this.changeUser}
          user={this.state.user}
        />
      </div>
    )
  }
}
