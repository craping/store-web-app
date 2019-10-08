const TokenKey = 'token'

export function getToken() {
  return '9f448cdedcfe40878f79ab5038e01e0f'
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
