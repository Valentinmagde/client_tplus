<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
    <vx-card class="profile-content">
      <div id="profile-page">
        <div class="profile-header">
          <div class="relative">
              <div class="cover-container rounded-t-lg couverture_p">
                  <img v-if="user_data.photo_couverture" :src="user_data.photo_couverture" alt="user-profile-cover" class="responsive block ">
                  <img v-else src="https://source.unsplash.com/collection/433526" alt="user-profile-cover" class="responsive block ">
              </div>
              <!-- Profil -->
              <div class="profile-img-contain">
                  <div>
                      <img v-if="user_data.photo_profil" class="rounded-full user-profile-img" :src="user_data.photo_profil" alt="user-profile-cover" id="photo_profil">
                      <img v-else class="rounded-full user-profile-img" src="@/assets/images/portrait/small/default.jpg" alt="user-profile-cover" id="photo_profil">

                      <!-- User name -->
                      <h4 class="mt-4 text-center">{{user_data.firstName}} {{user_data.lastName}}</h4>
                  </div>
              </div>
          </div>
        </div>

        <!-- Presentation -->
        <div v-if="user_data.presentation && user_data.presentation != 'null'" class="presentation"> {{user_data.presentation}}</div>
        <!-- COL AREA -->
        <div class="vx-row">
            <!-- COL 1 -->
          <div class="vx-col w-full lg:w-2/4" v-if="changePassword == false">
            <!-- ABOUT CARD -->
            <vx-card class="mt-base">
                <!-- Phone -->
                <div>
                  <div class="flex">
                    <div class="w-1/4">
                      <div class="bg-gray-40"><b><h5>{{$t('phone')}}</h5></b></div>
                    </div>
                    <div class="w-1/2">
                      <div class="bg-gray-500"><p>{{this.user_data.phone}}</p></div>
                    </div>
                    <!-- Editer profile -->
                    <div class="w-1/3 mb-2 hover:text-primary ml-2" style="display: flex; cursor: pointer;" @click="$router.push({ name: 'user:update-profile' }).catch(() => {})">
                      <vs-icon icon-pack="streameline"
                          icon="icon-single-neutral-actions-edit-1" style="font-size: 20px"
                          class="mr-1" size="small">
                      </vs-icon>
                      <div class="bg-gray-400">{{$t('Editmyprofile')}}</div>
                    </div>
                  </div>
                </div>
                <!-- Email -->
                <div>
                  <div class="flex">
                    <div class="w-1/4">
                      <div class="bg-gray-400"><b><h5>{{$t('email')}}</h5></b></div>
                    </div>
                    <div class="w-1/2">
                      <div class="bg-gray-500"><p>{{ user_data.email }}</p></div>
                    </div>

                    <!-- Changer mot de passe -->
                    <div class="w-1/3 mb-2 hover:text-primary mr-1" style="display: flex; cursor: pointer;"  @click="changePassword = true">
                      <vs-icon icon-pack="streameline"
                          icon="icon-login-key-2" style="font-size: 20px"
                          class="mr-2" size="small">
                      </vs-icon>
                      <div class="bg-gray-400" >{{$t('tochangethepassword')}}</div>
                    </div>
                  </div>
                </div>

                <!-- Adresse -->
                <div class="mb-2">
                  <div class="flex justify-between">
                    <div v-if="user_data.adresse && user_data.adresse != 'null'" class="w-1/4">
                      <div class="bg-gray-400"><b><h5>{{$t('address')}}</h5></b></div>
                    </div>
                    <div class="w-1/2">
                      <div v-if="user_data.adresse && user_data.adresse != 'null'" class="bg-gray-500">
                        <p>{{ user_data.adresse }}</p>
                      </div>
                    </div>

                    <div class="flex justify-end cursor-pointer w-1/3 hover:text-primary mr-8"  @click.stop="popupActivo3=true">
                      <vs-icon icon-pack="streameline"
                          icon="icon-single-neutral-actions-subtract" style="font-size: 20px"
                          class="mr-1" size="small">
                      </vs-icon>
                      <div class="bg-gray-400">{{$t('Deactivatemyaccount')}}</div>
                    </div>
                  </div>
                </div>

                <!-- Ville -->
                <div v-if="user_data.ville && user_data.ville != 'null'" class="mb-2">
                  <div class="flex">
                    <div class="w-1/4">
                      <div class="bg-gray-400"><b><h5>{{$t('city')}}</h5></b></div>
                    </div>
                    <div class="w-1/2">
                      <div class="bg-gray-500"><p>{{user_data.ville}}</p></div>
                    </div>
                    <div class="w-1/3">
                      <div class="bg-gray-400"></div>
                    </div>
                  </div>
                </div>

                <!-- Pays -->
                <div v-if="user_data.pays && user_data.pays != 'null'" class="mb-2">
                  <div class="flex">
                    <div class="w-1/4">
                      <div class="bg-gray-400"><b><h5>{{$t('country')}}</h5></b></div>
                    </div>
                    <div class="w-1/2">
                      <div class="bg-gray-500"><p>{{user_data.pays}}</p></div>
                    </div>
                    <div class="w-1/3">
                      <div class="bg-gray-400"></div>
                    </div>
                  </div>
                </div>

                <!-- Anniversaire -->
                <div v-if="user_data.pays && user_data.pays != 'null'" class="mb-2">
                  <div class="flex">
                    <div class="w-1/4">
                      <div class="bg-gray-400"><b><h5>{{$t('birthay')}}</h5></b></div>
                    </div>
                    <div class="w-1/2">
                      <div class="bg-gray-500"><p>{{ user_data.anniversaire | dateTime}}</p></div>
                    </div>
                    <div class="w-1/3">
                      <div class="bg-gray-400"></div>
                    </div>
                  </div>
                </div>

            </vx-card>
          </div>

            <div class=" vx-col w-full lg:w-2/4 items-center justify-center" v-if="changePassword == true">
              <vx-card class="mt-base">
                <div class="px-2">
                  <div class="flex -mx-2">
                      <div class="vx-col sm:w-1/3 w-full">
                        <span>{{$t('oldpassword')}}</span>
                      </div>
                      <div class="vx-col sm:w-2/3 w-full">
                        <vs-input
                            type="password"
                            v-model="oldPwd"
                            class="w-full mb-6"
                        />
                      </div>
                  </div>
                </div>
                <div class="px-2">
                  <div class="flex -mx-2">
                    <div class="vx-col sm:w-1/3 w-full">
                        <span>{{$t('NewPassword')}}</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full mb-6">
                      <vs-input
                          ref="newPwd"
                          type="password"
                          data-vv-validate-on="blur"
                          data-vv-as="newPwd"
                          v-validate="'required|min:6|max:10'"
                          name="newPwd"
                          v-model="newPwd"
                          class="w-full"/>
                          <span class="text-danger text-sm">{{ errors.first('newPwd') }}</span>
                    </div>
                  </div>
                </div>
                <div class="px-2">
                  <div class="flex -mx-2">
                    <div class="vx-col sm:w-1/3 w-full mb-6">
                      <span>{{$t('confirmpassword')}}</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full mb-6  ">
                      <vs-input
                          type="password"
                          v-validate="'min:6|max:10|confirmed:newPwd'"
                          data-vv-validate-on="blur"
                          data-vv-as="confirm"
                          name="confirm"
                          v-model="confirm"
                          class="w-full"/>
                          <span class="text-danger text-sm">{{ errors.first('confirm') }}</span>
                    </div>
                  </div>
                </div>
                <div class="px-2">
                  <div class="flex -mx-2">
                    <div class="vx-col sm:w-1/3 w-full">
                      <vs-button type="border" class="mr-3 mb-2" @click="reset(); annulerChangementMotdepass();" >{{$t('cancel')}}</vs-button>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full justify-end">
                      <vs-button class="w-full sm:w-auto " @click="resetPawd" :disabled="!validateForm">{{$t('Reset')}}</vs-button>
                    </div>
                  </div>
                </div>
              </vx-card>
            </div>
        </div>
        <div class="flex mt-base"  style="display: flex;">
          <vs-button v-show="!changePassword" @click="goBack" type="border" class="pl-4" style="margin-left:40px">
            <vs-icon icon-pack="streameline"
              icon="icon-move-back"
              class="mr-2" size="1rem" style="vertical-align: middle;">
            </vs-icon>
            {{$t('back')}}
          </vs-button>
        </div>
      </div>
    </vx-card>

    <vs-popup classContent="popup-example" class="popup-2"  :title="$t('Confirmation de désactivation de compte')" :active.sync="popupActivo3">
        <p>{{$t('Areyousureyouwanttodeactivateyouraccount')}}</p>
        <vs-divider/>
        <div class="vx-row w-full justify-end">
            <vs-button  color="warning" @click="popupActivo3=false" type="border">{{$t('cancel')}}</vs-button>&nbsp;&nbsp;
            <vs-button class="ml-3" @click="desactiverMonCompte" color="danger">{{$t('Deactivate')}}</vs-button>
        </div>
    </vs-popup>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import VueTelInput from 'vue-tel-input'
import vueCountryRegionSelect from 'vue-country-region-select'

// Store Module
// import moduleUser from "@/store/user/moduleUser.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

Vue.use(VueTelInput)
Vue.use(vueCountryRegionSelect)

export default {

 data() {
    return {
      photo: [],
      textarea: '',
      counterDanger: false,
      prenom:       '',
      nom:          '',
      adresse:      '',
      email:        '',
      telephone:    {
                      number: '',
                      valid: false,
                      country: undefined,
                      label:''
                    },
      pays:         '',
      ville:        '',
      societe:      '',
      presentation: '',
      anniversaire: '',
      photo_couverture: '',
      photo_profil: '',



      oldPwd: '',
      newPwd: '',
      confirm: '',

      value1: '',
      value2: '',
      popupActive2: false,
      popupActive3: false,
      popupActivo3 : false,
      changePassword: false,


      isNavOpen: false,
      userPoll: '',
      user_info: {
        profile_img: require("@/assets/images/profile/user-uploads/user-13.jpg"),
        cover_img: require("@/assets/images/profile/user-uploads/cover.jpg"),
      },
      wasSidebarOpen: null,
      formData: null
    }
  },
  computed: {
    ...mapGetters({
      user_data: 'authentificated/getAuth'
    }),

    mediaType() {
      return (media) => {
        if (media.img) {
          const ext = media.img.split('.').pop();
          if (this.mediaExtensions.img.includes(ext)) return 'image'
        } else if (media.sources && media.poster) {
          // other validations
          return 'video'
        }
      }
    },
    playerOptions() {
      return (media) => {
        return {
          height: '360',
          fluid: true,
          autoplay: false,
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: media.sources,
          poster: media.poster,
        }
      }
    },

    validateForm() {
      return !this.errors.any() && this.oldPwd != '' && this.newPwd != '' && this.confirm != '';
    }
  },
  methods: {
    desactiverMonCompte(){
      var user = this.user_data

      let payload = {
        resourceUrl:"/api/user/desactivate/"+user.id,
        commitAction: 'SET_USER',
      }
      this.$store.dispatch("authentificated/fetchUser", payload)
      .then(() => {
         this.popupActivo3 = false;
         this.$vs.notify({
          position:'top-center',

          text: this.$t('userSuccessfullyDeactivate'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'success'
        })
        setTimeout( () => this.$router.push('/user/register'), 1000);
      })
      .catch(error => {
        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
        this.$vs.notify({
          position:'top-center',
          text: error,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      })
    },

    reset(){
            this.oldPwd = ''
            this.newPwd = ''
            this.confirm = ''
        },
         resetPawd(){
            var user = this.user_data;

            let playload = {
              resourceUrl:"/api/user/changepwd",
              commitAction: 'SET_USER',
              data: {
                userID : user.id,
                oldpwd : this.oldPwd,
                newpwd : this.newPwd
              }
            }
            this.$store.dispatch("authentificated/postRequest", playload)
            .then(() => {
                this.reset()
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('passwordSuccessfullyReset'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
                 this.changePassword = false
                 setTimeout( () => this.$router.push('/user/login'), 1000)


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
        },
        annulerChangementMotdepass(){
            this.changePassword = false
        },
        goBack(){
          window.history.back();
        },


    /*onInput(formattedNumber, { number, valid, country }) {
        this.telephone.number = number.e164;
        this.telephone.valid = valid;
        this.telephone.country = country && country.name;
      },
    loadContent() {
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: "#button-load-more-posts",
        scale: 0.45
      })
      setTimeout(() => {
        this.$vs.loading.close("#button-load-more-posts > .con-vs-loading")
      }, 3000);
    },*/


    /*successUpload(){
      this.$vs.notify({color:'success',title:'Upload Success',text:'Lorem ipsum dolor sit amet, consectetur'})
    }*/

  },
    created() {
    /*if(!moduleUser.isRegistered) {
        this.$store.registerModule('user', moduleUser)
        moduleUser.isRegistered = true
    }
    if(!moduleUserManagement.isRegistered) {
      this.$store.registerModule('userManagement', moduleUserManagement)
      moduleUserManagement.isRegistered = true
    }

    /* this.$store.dispatch("nouvelle/fetchNews",payload)
    .catch(err => { window.console.error(err) }) */

    //Verifier si l'utilisateur est sur la page admin
    var path = localStorage.getItem('route')
    if(path == '/association/administration') this.admin = true
  },
  mounted() {
    // load user data here
    // this.user_data = this.$store.state.AppActiveUser;
    this.wasSidebarOpen = this.$store.state.reduceButton;
    this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
    this.formData = new FormData()
  },
  beforeDestroy() {
    if (!this.wasSidebarOpen) this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
  }

}


// // Variable pour la recupération des données de l'utilisateur dans le local storage
// var data_user = JSON.parse(localStorage.getItem('user'));

</script>


<style lang="scss" scoped>
@import "@/assets/scss/vuexy/pages/profile.scss";

</style>

<style scoped>
  .profile-content{
    width: 63rem;
    border: 1px solid #626262;
    border-radius: 3px !important;
    margin-top: 1.5rem;
  }

  .profile-img-contain {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: -5.6rem;
    left: 4%;
    width: 80%;
    justify-content: space-between;
  }

  #photo_profil {
    width: 170px;
    height: 170px;
    background: rgb(195, 195, 195);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 10px 3px;
  }

  .couverture_p img{
    max-height: 230px;
    border-radius: 3px 3px 0 0 ;
  }

  .ajout_couverture {
    position: absolute;
    top : 25px;
    right: 16px;
    max-width: 840px;
    max-height: 300px;

  }

  /* .photo_profil img{
    width: 125px;
    border-radius: 100%;
  } */
  .ajout_photo_profile{
    position: absolute;
    bottom: 5px;
    left: 82px;
    z-index: 1000;

  }
.popup{
  height: 720px;
}


.btn-file {
  border-radius:50%
}
.btn-file input[type=file] {
  position: absolute;
  top: 25px;
  min-width: 20%;
  min-height: 21%;
  /* font-size: 100px; */
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  display: block;
  z-index: 1111;

  left: 53%;
}

.btn-file_photo_profil{
  border-radius:50%
}

.btn-file_photo_profil input[type=file]{
  position: absolute;
  top: 70px;
  min-width: 20%;
  min-height: 21%;
  margin-left: 28px;
  /* font-size: 100px; */
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  display: block;
  z-index: 1111;
}
.selectCountry {
  height: 38px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  font-size: .85rem;
  color: rgba(0,0,0,.7);
}

.phone_pays{
  height:38px;
  border-radius:5px;
}

.vx-row > .vx-col {
  padding: 4rem;
  padding-bottom: 0;
  padding-top: 3rem;
}

.mt-base {
  padding: 2rem;
  margin-top: 3.2rem !important;
}
.presentation{
  margin-left: 35%;
  margin-top: 20px;
}
.iconeretour{
  height: 18px;
  vertical-align:middle;
  margin-left:-20px;
  margin-right: 25px;
}





</style>
