import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setItem(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}
export function getItem(key) {
  return sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : ''
}
