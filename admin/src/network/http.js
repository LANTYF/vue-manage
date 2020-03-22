import axios from 'axios'

const http = axios.create({
  baseURL: "http://localhost:8888/api/private/v1/"
})

http.interceptors.request.use(config => {
  const AUTH_TOKEN = sessionStorage.getItem("token");
  config.headers.common["Authorization"] = AUTH_TOKEN;
  return config
})

export default http