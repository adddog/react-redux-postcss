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
    .set(
      "id_ipeds",
      process.env.DEV ? process.env.IPEDS : process.env.IPEDS
    )
    .set("offline", has(QS.parse(location.search), "offline"))
    .set("isUserAuthenticated", Auth.isUserAuthenticated())
    .set("error", null)
    .set("formSubmitted", null)
    .set("token", Auth.getToken())
    .set("isValidToken", Auth.isValidToken())
    .set("isLoggedIn", true) // Auth.getToken() && Auth.isValidToken())
    .set("schools", [
      { id_ipeds: 100654, name: "Alabama A & M University" },
      {
        id_ipeds: 100663,
        name: "University of Alabama at Birmingham",
      },
      { id_ipeds: 100690, name: "Amridge University" },
    ])

const initialState = RESET_LOGOUT(new Map())

export default function auth(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGIN_ERROR: {
      const { error } = action
      Auth.deauthenticateUser()
      return state
        .set("error", error)
        .set("formSubmitted", error.formSubmitted)
      //.set("isLoggedIn", false)
    }
    case AUTH_LOGIN_SUCCESS: {
      const { user } = action
      const { jwt } = user
      if (user.remember) {
        Auth.authenticateUser(jwt)
      }
      const isValidToken = Auth.isValidToken()
      return state
        .set("token", jwt)
        .set("isUserAuthenticated", Auth.isUserAuthenticated())
        .set("formSubmitted", user.formSubmitted)
        .set("error", null)
        .set("isValidToken", isValidToken)
        .set("isLoggedIn", jwt && isValidToken)
        .set(
          "schools",
          user.schools && user.schools.length ? user.schools : []
        )
    }
    case AUTH_LOGOUT_SUCCESS: {
      Auth.deauthenticateUser()
      return RESET_LOGOUT(state)
    }
    case API_ALL_SCHOOLS_SUCCESS: {
      const { response } = action
      return state.set("schools", response)
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
