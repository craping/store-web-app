const TokenKey = 'token'

export function getToken() {
  return '5ae2e0609b384a6f8a5161332fd87389'
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
