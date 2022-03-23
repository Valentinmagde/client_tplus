import axios from 'axios'
import Token from '@/helpers/token.js'

let instance = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API
})

let token = Token.getAccessToken();

if (token)
	instance.defaults.headers.Authorization = 'Bearer ' +  token

export default  instance
