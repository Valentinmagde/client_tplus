<template>

  <form @key.enter="auth">
    <!-- Numéron de téléphone -->
    <vue-tel-input
          validate
          name="pseudo"
          :placeholder="$t('phone')"
          @input="onInput"
          validCharactersOnly
          class="select-large mt-6 w-full telephone"
      >
    </vue-tel-input>

    <!-- Mot de passe -->
    <vs-input
        id="password-field"
        data-vv-validate-on="blur"
        v-validate="'required|min:6'"
        type="password"
        name="password"
        :label-placeholder="$t('password')"
        v-model="password"
        class="w-full mt-6 cursor-pointer" />

      <!-- Eye Icon -->
      <span v-if="hidden" class="cursor-pointer icon-eyes"
        @click="displayOrHide">
          <feather-icon icon="EyeIcon" svgClass="h-1 w-1"
          style="width: 16px; color: #999; top: 4px"/>
      </span>

      <!-- Eye off Icon -->
      <span v-if="!hidden" class="cursor-pointer icon-eyes"
        @click="displayOrHide">
          <feather-icon icon="EyeOffIcon" svgClass="h-1 w-1"
          style="width: 16px; color: #999; top: 4px"/>
      </span>

    <span class="text-danger text-sm">{{ errors.first('Mot_de_passe') }}</span>

    <div class="flex flex-wrap justify-between mt-5">
        <!-- Se souvenir de moi -->
        <vs-checkbox v-model="rememberMe" class="mb-4">{{$t('rememberMe')}}</vs-checkbox>

        <!-- Mot de passe oublié -->
        <div>
          <vs-icon icon-pack="streameline" icon="icon-door-lock" style="font-size: 18px"
            size="small" color="grey"></vs-icon>
          <span class="float-right ml-1 cursor-pointer"
            @click="$router.push({name: 'user:recovery-password'}).catch(() => {})">
              &nbsp;{{$t('forgotPassword')}}?
            </span>
        </div>
    </div>

    <vs-button class="w-full mt-3" id="button-with-loading"
      @click="loginJWT" :disabled="!validateForm">
        {{$t('login')}}
      </vs-button>
    <vs-divider color="dark">{{$t('or')}} {{$t('connectWith').toLowerCase()}}</vs-divider>

    <div class="social-login-buttons flex flex-wrap items-center mt-4 vx-row justify-center">

      <!-- facebook -->
      <div class="bg-facebook pt-4 pb-3 px-4 mr-4 rounded-full cursor-pointer vx-col justify-center"
        @click="loginWithFacebook">
        <svg aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="facebook-f"
          class="text-white h-4 w-4 svg-inline--fa fa-facebook-f fa-w-9"
          role="img" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 264 512">
          <path fill="currentColor"
            d="M215.8 85H264V3.6C255.7 2.5 227.1 0 193.8 0 124.3 0 76.7 42.4 76.7 120.3V192H0v91h76.7v229h94V283h73.6l11.7-91h-85.3v-62.7c0-26.3 7.3-44.3 45.1-44.3z">
          </path>
        </svg>
      </div>
      <!-- GOOGLE -->
      &nbsp;
      &nbsp;
      &nbsp;
      <div class="bg-google pt-4 pb-3 px-4 rounded-full cursor-pointer vx-col justify-center"
        @click="loginWithGoogle">
        <svg aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          class="text-white h-4 w-4 svg-inline--fa fa-google fa-w-16"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512">
          <path fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
          </path>
        </svg>
      </div>
    </div>

    <div class="w-full mt-6 vx-row justify-center">
      <span class="text-black">{{$t('notHaveAccount')}} ?</span>
      <router-link class="link-color" to="/user/register">{{$t('createAccount')}}</router-link>
    </div>
  </form>
</template>

<script>

import Vue from 'vue'
import VueTelInput from 'vue-tel-input'

// Firebase to log out any authenticated user at this point
import firebase from 'firebase/app'
import 'firebase/auth'


import { mapActions } from 'vuex'

Vue.use(VueTelInput)

export default {
  data: () => ({
    pseudo: {
      number: '',
      valid: true,
      country: undefined,
    },
    password: '',
    rememberMe: false,
    backgroundLoading:'primary',
    colorLoading:'#fff',
    hidden: true,
    loading: true,
    inputType: 'password'
  }),

  computed: {
    validateForm() {
      return !this.errors.any() && this.pseudo != '' && this.password != '' && this.loading;
    },
  },

  methods: {
    ...mapActions({
      auth: 'authentificated'
    }),

      //Afficher ou cacher le mot de passe
    displayOrHide(){
      let input = document.getElementById('password-field')

      if(input.type == 'password'){
        this.hidden = false
        document.getElementById('password-field').setAttribute('type', 'text')
      }
      else{
        this.hidden = true
        document.getElementById('password-field').setAttribute('type', 'password')
      }
    },

    loginJWT() {
      if (!this.checkLogin())return
      if(!this.pseudo.valid) {
          this.$vs.notify({
            position:'top-center',
            text: this.$t('invalidPhoneNumber'),
            color:'danger',
            icon:'close'
          })
          return
        }
      // Loading
      this.openLoadingContained()
      this.loading = false

      const payload = {
        rememberMe: this.rememberMe,
        userDetails: {
          phone: this.pseudo.number,
          password: this.password,
        }
      }

      this.$store.dispatch('authentificated/loginJWT', payload)
        .then(() => {
          this.$router.push({name: 'associations:list'})
        })
        .catch(error => {
          this.loading = true
          window.console.log(error)
          this.$vs.loading.close("#button-with-loading > .con-vs-loading")
          this.$vs.notify({
            position:'top-center',
            text: (error.hasOwnProperty('text')) ? error.text : error,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })

          if ( error.hasOwnProperty('errNo') ){
            this.$store.commit('authentificated/SET_PHONE',this.pseudo.number)
            this.$store.commit('authentificated/SET_USER_ID', error.user_id)
            setTimeout(() => this.$router.push({name:'user:verify-code'}), 1000 )
          }
        })
    },
    // Google login
    loginWithGoogle() {
      this.$store.dispatch('authentificated/socialLogin', { notify: this.$vs.notify, type: 'google' })
    },

    // Facebook login
    loginWithFacebook() {
      this.$store.dispatch('authentificated/socialLogin', { notify: this.$vs.notify, type: 'facebook' })
    },

    // Twitter login
    loginWithTwitter() {
      this.$store.dispatch('authentificated/loginWithTwitter', { notify: this.$vs.notify })
    },

    // Github login
    loginWithGithub() {
      this.$store.dispatch('authentificated/loginWithGithub', { notify: this.$vs.notify })
    },
    registerUser() {
      if (!this.checkLogin())
        return  this.$router.push('/user/register').catch(() => {})
    },
    onInput(formattedNumber, { number, valid, country }) {
      this.pseudo.number = number.e164;
      this.pseudo.valid = valid;
      this.pseudo.country = country && country.name;
    },
    openLoadingContained(){
      if(this.pseudo.valid){
          this.$vs.loading({
            background: this.backgroundLoading,
            color: this.colorLoading,
            container: "#button-with-loading",
            scale: 0.45
        });
      }
    },
    checkLogin() {
      // If user is already logged in notify
      if (this.$store.state.authentificated.isUserLoggedIn()) {

        // Close animation if passed as payload
        this.$vs.loading.close("#button-with-loading > .con-vs-loading")

        this.$vs.notify({
          position:'top-center',
          title: this.$t('loginTitleAttempt'),
          text: this.$t('loginErrorAlreadyLoggedin'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning'
        })

        return false
      }
      return true
    },
  },

  created() {
    // Firebase logout
    firebase.auth().signOut()
    .then(() => {
      // Clear caches
      localStorage.clear();
      sessionStorage.clear();

      // Set store to default store
      this.$store.commit('authentificated/LOG_OUT');
    })
    .catch((error) => window.console.error(error))
  }
}
</script>
<style lang="scss">
  .icon-eyes{
    position:relative;
    float:right;
    right: 7px;
    top:-34px;
    bottom:10px;
    padding-left: 7px;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
  }
  #page-login {
  .social-login-buttons {
    .bg-facebook { background-color: #1551b1 }
    .bg-twitter { background-color: #00aaff }
    .bg-google { background-color: 	#FF0000 }
    .bg-github { background-color: #333 }
  }
}
</style>
