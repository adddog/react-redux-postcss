import {
  AUTH_LOGIN,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS
} from "actions/actionTypes"
import Auth from "modules/Auth"
import QS from "query-string"
import { has } from "lodash"

import { Map } from "immutable"

const initialState = new Map()
  //TODO
  .set("id_ipeds", process.env.DEV ? process.env.IPEDS : process.env.IPEDS)
  .set("offline", has(QS.parse(location.search), "offline"))
  .set("isUserAuthenticated", Auth.isUserAuthenticated())
  .set("error", null)
  .set("formSubmitted", null)
  .set("token", Auth.getToken())
  .set("isValidToken", Auth.isValidToken())
  .set("isLoggedIn", Auth.getToken() && Auth.isValidToken())
  .set("schools", [])

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
      const { user } = action;
      const { jwt } = user;
      console.log(user);
      if(user.remember){
        Auth.authenticateUser(jwt)
      }
      const isValidToken = Auth.isValidToken();
      return state
        .set("token", jwt)
        .set(
          "isUserAuthenticated",
          Auth.isUserAuthenticated()
        )
        .set("formSubmitted", user.formSubmitted)
        .set("error", null)
        .set("isValidToken", isValidToken)
        .set("isLoggedIn", jwt && isValidToken)
        .set("schools", user.schools && user.schools.length ? user.schools : [])
    }
    default: {
      return state
    }
  }
}
