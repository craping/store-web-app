const TokenKey = 'token'

export function getToken() {
  return 'bdb16df60ce040aaa1a5571036bf50ac'
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
