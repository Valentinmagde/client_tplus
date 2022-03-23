
export default {

  getToken: state =>  state.token ,
  getRoles: state =>  Array.from(state.roles),
  getAuth: 	state => state.user,
  getPhone: state => state.phone,
  uploadUrl : () =>  (process.env == 'development') ? 'http://localhost:8080/api/user/association/upload' : `${process.env.VUE_APP_ROOT_API}api/user/association/upload`
}
