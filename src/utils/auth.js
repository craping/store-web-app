const TokenKey = 'token'

export function getToken() {
  return '8821f40509ee4e6291f7b8df4a3c8092'
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
