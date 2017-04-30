export function statistics (state) {
  return state.statistics
}

export function isUserLoggedIn (state) {
  return state.session.isLoggedIn === true
}

export function user (state) {
  return state.session.user
}

export function hasLoggedUserPermission (state, getters) {
  let user = getters.user
  return function (permission) {
    return user.permissions && user.permissions[permission] === true
  }
}
