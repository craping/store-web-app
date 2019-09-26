const TokenKey = 'token'

export function getToken() {
  return 'b0bf740aaf4b401ba1e64cc016d366b5'
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
