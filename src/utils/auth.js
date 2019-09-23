const TokenKey = 'token'

export function getToken() {
  return "f45d7239024e451e88298acf2d4f249d";
  // return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
