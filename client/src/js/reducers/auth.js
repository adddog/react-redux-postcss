import {
  AUTH_LOGIN,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  API_ALL_SCHOOLS_SUCCESS,
  AUTH_UPDATE_IPEDS,
} from "actions/actionTypes"
import Auth from "modules/Auth"
import QS from "query-string"
import { has } from "lodash"

import { Map } from "immutable"

const RESET_LOGOUT = state =>
  state
    .set("id_ipeds", null)
    .set("offline", has(QS.parse(location.search), "offline"))
    .set("isUserAuthenticated", Auth.isUserAuthenticated())
    .set("error", null)
    .set("formSubmitted", null)
    .set("token", Auth.getToken())
    .set("isLoggedIn", Auth.getToken() ? true : false)
    .set("userSchools", [])
    .set("allSchools", [])
    .set("hasAGlobal", false)

const initialState = RESET_LOGOUT(new Map())

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGIN_ERROR: {
      const { error } = action
      Auth.deauthenticateUser()
      return state
        .set("error", error)
        .set("formSubmitted", error.formSubmitted)
        .set("isLoggedIn", false)
    }
    case AUTH_LOGIN_SUCCESS: {
      console.log('AUTH_LOGIN_SUCCESS: user: ', user)
      const { user } = action
      const { jwt } = user
      let userSchools = []
      let initialSchool = null
      if (user.remember) {
        Auth.authenticateUser(jwt)
      }
      if (Array.isArray(user.schools) && user.schools.length) {
        userSchools = user.schools
        initialSchool = userSchools[0]
      }
      return state
        .set("token", jwt)
        .set("isUserAuthenticated", Auth.isUserAuthenticated())
        .set("formSubmitted", user.formSubmitted)
        .set("error", null)
        .set("isLoggedIn", jwt ? true : false)
        .set("userSchools", userSchools)
        .set("hasAGlobal", user.hasAGlobal)
        .set("id_ipeds", initialSchool)
    }
    case AUTH_LOGOUT_SUCCESS: {
      Auth.deauthenticateUser()
      return RESET_LOGOUT(state)
    }
    case API_ALL_SCHOOLS_SUCCESS: {
      const { response } = action
      return state.set("allSchools", response)
    }
    case AUTH_UPDATE_IPEDS: {
      const { payload } = action
      if (!payload) return state
      return state.set("id_ipeds", payload)
    }
    default: {
      return state
    }
  }
}
