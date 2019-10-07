const TokenKey = 'token'

export function getToken() {
  return '6ac042205f2f4223b1718e3db31420e4'
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
