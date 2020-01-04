import axios from 'axios'

export function request (config) {
  const req = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })
  req.interceptors.request.use(config => {
    config.headers.authorization = window.sessionStorage.getItem('token')
    return config
  })
  req.interceptors.response.use(res => {
    return res.data
  })
  return req(config)
}
