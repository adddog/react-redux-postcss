import { createSelector } from "reselect"
import { ROUTES } from "routes/configureRoutes"
import { forIn, isEmpty, map } from "lodash"

export const getLoginErrorMessages = state => {
    const { router, auth } = state
    const loginError = auth.get("error")
    const formSubmitted = auth.get("formSubmitted")

    if (loginError && formSubmitted) {
        return {
            message: `Error logging in`,
        }
    } else {
        return {
        }
    }
    switch (router.location.pathname) {
        case ROUTES.leadData.slug: {
        }
        default:
            return {}
    }
}

export const makeGetLoginErrorMessages = () =>
    createSelector(
        [state => getLoginErrorMessages(state)],
        errorMessages => {
            return errorMessages
        }
    )

export default makeGetLoginErrorMessages
