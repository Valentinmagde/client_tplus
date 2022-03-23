<template>
  <div class="flex items-center the-navbar__user-meta" v-if="activeUserInfo">

    <div class="hidden leading-tight text-right sm:block">
      <p class="font-semibold">{{ activeUserInfo.firstName | capitalize }} {{ activeUserInfo.lastName | capitalize }}</p>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer" >

      <div class="ml-3 con-img">
        <img v-if="activeUserInfo.photo_profil" key="onlineImg" :src="activeUserInfo.photo_profil" alt="user-img" width="40" height="40" class="block rounded-full shadow-md cursor-pointer" />
        <img v-else src="@/assets/images/portrait/small/default.jpg" alt="user-img" width="40" height="40" class="block rounded-full shadow-md cursor-pointer" />
      </div>

      <vs-dropdown-menu v-if="afficher_menu" class="vx-navbar-dropdown">
        <ul style="min-width: 16.5rem">

          <li
            class="flex px-4 py-2 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/user/profile').catch(() => {})">
            <vs-icon icon-pack="streameline" size="small" icon="icon-single-neutral-actions-edit-1" style="font-size: 15px">
            </vs-icon>
            <span class="ml-2">{{$t('Profile')}}</span>
          </li>

          <!-- <li
            class="flex hidden px-4 py-2 cursor-pointer hover:bg-primary hover:text-white md:block"
            @click="$router.push('/apps/email').catch(() => {})">
            <feather-icon icon="MailIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">{{$t('inbox')}}</span>
          </li>
          <li
            class="flex px-4 py-2 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/apps/chat').catch(() => {})">
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">{{$t('Chat')}}</span>
          </li> -->
          <li
            class="flex px-3 py-2 cursor-pointer hover:bg-primary hover:text-white"
            @click="$router.push('/association/user-settings/reset-password').catch(() => {})">
            <vs-icon icon-pack="streameline" size="small" icon="icon-login-key-2" style="font-size: 15px">
            </vs-icon>
            <span class="ml-2">{{$t('ChangePassword')}}</span>
          </li>

          <vs-divider class="m-1" />

          <li
            class="flex px-4 py-2 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout">
            <vs-icon icon-pack="streameline" size="small" icon="icon-logout-1" style="font-size: 15px">
            </vs-icon>
            <span class="ml-2">{{$t('logout')}}</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      afficher_menu: true
    }
  },
  computed: {
    ...mapGetters({
      activeUserInfo: 'authentificated/getAuth'
    }),
  },
  created(){
    /*if(! moduleUser.isRegistered) {
      this.$store.registerModule('user',  moduleUser)
      moduleUser.isRegistered = true
    }*/
  },
  methods: {
    changeStatus(){
      this.afficher_menu = false
      setTimeout(()=>{
        this.afficher_menu = true
      },1)
    },
    logout(){

        // if user is logged in via firebase
        if(this.$store.state.authentificated.isUserLoggedIn()){
          const firebaseCurrentUser = firebase.auth().currentUser

          if (firebaseCurrentUser) {
              firebase.auth().signOut().then(() => {
                  this.$router.push({name: 'user:login'})
              })
          }
        }
        // If JWT login
        else{
          let payload = {
            userId: this.activeUserInfo.id
          }
          this.$router.push({name: 'user:login'})
          .then(()=> {
            this.$store.dispatch('authentificated/LOG_OUT', payload)
          })
          .then(() => {
            localStorage.clear();
            sessionStorage.clear();
            this.$store.commit('association/RESET');
          })
          .catch(error => {
            this.$vs.notify({
              position:'top-center',
              text: error,
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger'
            })
          })
        }
    },
  }
}
</script>
