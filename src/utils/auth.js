export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
    .then((res) => {
      try {
        if (res.ok) {return res.json()}
      } catch(e) {
        return (e)
      }
    })
    .then((res) => {
      console.log(res)
      return res;
    })
    .catch((err) => console.log(err))
}

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  })
    .then(res=> res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      } else {
        return
      }
    })
    .catch((err) => console.log(err))
}

export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => console.log(err))
}