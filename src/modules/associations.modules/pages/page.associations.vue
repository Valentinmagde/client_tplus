
<template>
  <div class="h-screen flex w-full vx-row no-gutter items-center justify-center">
    <div class="card-content mt-6 mb-6">
      <vx-card class="rounded-none">
        <div slot="no-body">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col w-full d-theme-dark-bg">
              <br>
              <div class="px-6 login-tabs-container">
                <br>
                <div class="vx-card__title mb-4">
                  <div class="vx-col">
                    <img src="@/assets/images/logo/logo.png" alt="login" class="mx-auto">
                  </div>
                  <br>
                  <h4 class="text-center mb-4">{{$t('welcomToTontinePlus')}}</h4>
                  <p class="pl-4 pr-4 titre-association"  v-if="error && hasBeenFetched">{{$t('welcomToTontinePlusSubtitle')}}</p>
                  <p class="vx-row mb-4 justify-center"  v-if="association && hasBeenFetched">{{$t('selectAnAssociation')}}</p>
                </div>
                <br/>

                <div v-if="error && hasBeenFetched">
                  <association-none></association-none>
                </div>

                <div v-if="association && hasBeenFetched">
                  <association-with :associations="association"></association-with>
                </div>

                <br/>

                <div class="flex justify-center flex-wrap _translate ">
                   <router-link class="link-color hover:text-primary" :to="{name: 'user:profile'}" type="gradient">{{$t('myProfile')}} &nbsp;|</router-link>
                    <span class="cursor-pointer link-color hover:text-primary" to="#" type="gradient" @click="logout"> &nbsp;{{$t('logout')}}&nbsp;|</span>
                    <span class="cursor-pointer link-color hover:text-primary" v-show="locale=='fr'" @click="updateLocale('en')">&nbsp;English&nbsp;</span>
                    <span class="cursor-pointer link-color hover:text-primary"  v-show="locale=='en'" @click="updateLocale('fr')">&nbsp;Français</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex'

  import * as typesAssociation from '../store/mutation-types';
  import * as typesUser from '@/modules/users.modules/store/mutation-types';

  import AssociationNone from "../components/AssociationNone.component.vue"
  import AssociationWith from "../components/AssociationWith.component.vue"

  import firebase from 'firebase/app'
  import 'firebase/auth'

export default {
  data() {
      return {
        locale: this.$i18n.locale,
        hasBeenFetched: false,
        now : '',
        interval: ''
      }
  },

  components: {
    AssociationNone,
    AssociationWith
  },

  computed: {
    ...mapGetters({
      associations:'association/getAllAssociations',
      auth: 'authentificated/getAuth'
    }),

    association() {
      return this.associations.length == 0 ? null : this.associations;
    },

    error() {
      return (this.association == null) ? 'no-data' : null;
    },

    i18n_locale_img() {
      return require(`@/assets/images/flags/${this.$i18n.locale}.png`)
    },

  },

  methods: {
    ...mapActions({
      fetch: `association/${typesAssociation.FETCH_USER_ASSOCIATION}`,
      logOff: `authentificated/${typesUser.LOG_OUT}`
    }),


    updateLocale(locale) {
      this.$i18n.locale = locale;
      this.locale = this.$i18n.locale
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

          var user = this.auth;

          this.$router.push({name: 'user:login'})
          .then(() =>  this.logOff({userId: user.id}))
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
    }
  },
  beforeDestroyed(){
    if(this.unsubscribe)
      this.unsubscribe()
  },
  async created() {
    this.fetch({
      userUUID:this.auth.id
    })
    .then(() => {
      this.hasBeenFetched = true;
    })
  }
}
</script>
<style lang="css">
  .card-content {
      width: 450px;
    }

  @media (max-width: 519px)
  {
    .card-content {
      width: 300px;
    }
  }
</style>
