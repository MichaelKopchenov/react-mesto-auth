export const BASE_URL = 'https://auth.nomoreparties.co';

function getResponseData(res) {
  return res.ok ? res.json() : Promise.reject(`${res.status} ${res.statusText}`)
};

export const register = async (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password: password,
      email: email,
    })
  })
  .then(res => getResponseData(res))
};

export const login = async (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password: password,
      email: email,
    })
  })
  .then(res => getResponseData(res))
};

export const checkToken = async (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : `Bearer ${token}`
    }})
    .then(res => getResponseData(res))
};