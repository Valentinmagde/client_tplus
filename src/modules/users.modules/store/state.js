import auth from "@/services/auth";
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  isUserLoggedIn: () => {
    let isAuthenticated = false

    const firebaseCurrentUser = firebase.auth().currentUser

    if (auth.isAuthenticated() || firebaseCurrentUser)
			isAuthenticated = true

    return isAuthenticated
  },
  token: null,
	roles: [], // The user's roles in the current association
  user: null,
  user_id: null,
	refreshToken: null,
  expires_in: null,
  phone: null,
}
