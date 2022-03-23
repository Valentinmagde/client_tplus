<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
    <vx-card class="profile-content">
      <div id="profile-page">
        <div class="profile-header">
          <div class="relative">
              <div class="cover-container rounded-t-lg couverture_p">
                  <img v-if="user_data.photo_couverture" :src="user_data.photo_couverture" alt="user-profile-cover" id="photo_couverture" class="responsive block ">
                  <img v-else src="https://source.unsplash.com/collection/433526" alt="user-profile-cover" id="photo_couverture" class="responsive block ">
                  <span class="btn-file">
                      <vs-button class ="ajout_couverture" icon-pack="feather" radius icon="icon-edit-2"></vs-button>
                      <input type="file" @change="selectedFile($event, 'photo_couverture')" name="couverture">
                  </span>
              </div>
              <!-- Profil -->
              <div class="profile-img-contain">
                  <div>
                      <img v-if="user_data.photo_profil" class="rounded-full user-profile-img" :src="user_data.photo_profil" alt="user-profile-cover" id="photo_profil">
                      <img v-else class="rounded-full" src="@/assets/images/portrait/small/default.jpg" alt="user-profile-cover" id="photo_profil">
                      <span class ="btn-file_photo_profil cursor-pointer">
                          <vs-button
                            class ="ajout_photo_profile"
                            icon-pack="feather" radius icon="icon-edit-2"/>

                          <input type="file" @change="selectedFile($event, 'photo_profil')" name="profil">
                      </span>
                  </div>
              </div>
          </div>
        </div>

        <!-- PROFILE HEADER -->
        <!-- <div class="profile-header">
            <div class="relative">
                <div class="couverture_p cover-container rounded-t-lg">
                    <img v-if="user_data.photo_couverture" :src="user_data.photo_couverture" alt="user-profile-cover" id="photo_couverture" class="responsive block">
                    <img v-else src="@/assets/images/profile/user-uploads/cover.jpg" alt="user-profile-cover" id="photo_couverture" class="responsive block">
                    <span class="btn-file">
                        <vs-button class ="ajout_couverture" icon-pack="feather" radius icon="icon-edit-2"></vs-button>
                        <input type="file" @change="selectedFile($event, 'photo_couverture')" name="couverture">
                    </span>
                </div> -->
                <!-- Profil -->
               <!--  <div class="profile-img-container">
                    <div>
                      <img v-if="user_data.photo_profil" class="rounded-full user-profile-img" :src="user_data.photo_profil" alt="user-profile-cover" id="photo_profil">
                      <img v-else class="rounded-full" src="@/assets/images/portrait/small/default.jpg" alt="user-profile-cover" id="photo_profil">
                      <span class ="btn-file_photo_profil">
                          <vs-button class ="ajout_photo_profile" icon-pack="feather" radius icon="icon-edit-2">
                          </vs-button>
                          <input type="file"  @change="selectedFile($event, 'photo_profil')" name="profil">
                      </span>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- COL AREA -->
        <div class="vx-row">
            <!-- COL 1 -->
            <div class="vx-col w-full lg:w-2/4" style="margin-top: 3rem; padding-left:4em;padding-right:4em">
                <!-- ABOUT CARD -->
                <vx-card class="mt-base" >
                    <div style="margin-top: 1rem">
                        <div class="vx-row mb-4">
                             <div class="vx-col sm:w-1/2 w-full">
                                <vs-input class="inputx w-full" :label="$t('lastName')" v-model="nom" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                              <vs-input class="inputx  w-full" :label="$t('firstName')" v-model="prenom" />
                            </div>
                        </div>

                        <div class="vx-row mb-4">
                            <div class="vx-col sm:w-1/2 w-full">
                                <label for="" class="vs-input--label">{{$t('phone')}}</label>
                                <vue-tel-input class="inputx w-full phone_pays" v-model="telephone.number"
                                    :required="true"
                                    validate
                                    name="pseudo"
                                   :placeholder="$t('phone')"
                                    @input="onInput"
                                    validCharactersOnly
                                >
                                </vue-tel-input>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <vs-input
                                  class="inputx w-full"
                                  type ="email"
                                  v-validate="'required|email'"
                                  data-vv-validate-on="blur"
                                  name="email"
                                  :label="$t('email')"
                                  v-model="email" />
                                <span class="text-danger text-sm">{{ errors.first('email') }}</span>
                            </div>
                        </div>

                        <div class="vx-row mb-4">
                            <div class="vx-col sm:w-1/2 w-full">
                                <vs-input class="inputx  w-full" :label="$t('address')" v-model="adresse" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <vs-input class="inputx  w-full" :label="$t('city')" v-model="ville" />
                            </div>
                        </div>

                        <div class="vx-row mb-4">
                            <div class="vx-col sm:w-1/2 w-full">
                                <label for="" class="vs-input--label">{{$t('country')}}</label>
                                <country-select class="inputx w-full phone_pays"
                                :usei18n="false"
                                v-model="pays"
                                :country= "pays"
                                topCountry="US"
                                :placeholder="$t('headOfficeCountry')"
                                />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                              <p class="vs-input--label">{{$t('birthday')}}</p>
                              <flat-pickr
                                :config="MyConfig"
                                v-model="anniversaire"
                                class="w-full"/>
                                <!-- <vs-input class="inputx mb-4 w-full" :label ="$t('birthday')" v-model="anniversaire" />  -->
                            </div>
                        </div>
                            <div style="margin-left: 7px; margin-right: 7px;">
                                <label for="" class="vs-input--label">{{$t('presentation')}}</label>
                                <vs-textarea  v-model="presentation" />
                            </div>
                    </div>
                </vx-card>

                <div class="flex mt-5 mb-4">
                  <!-- <icon name="keyboard-arrow-previous" ></icon> -->
                  <vs-button @click="goBack" type="border" class="mr-6">
                    <vs-icon icon-pack="streameline"
                    icon="icon-move-back"
                    class="mr-2" size="1rem" style="vertical-align: middle;">
                    </vs-icon> {{$t('cancel')}}
                  </vs-button>
                  <vs-button id="button-with-loading" @click="updateUser" :disabled="!validateForm">
                    {{$t('save')}}
                  </vs-button>
                </div>
            </div>
        </div>
      </div>
    </vx-card>
  </div>

</template>

<script>
import Vue from 'vue'
import VueTelInput from 'vue-tel-input'
import vueCountryRegionSelect from 'vue-country-region-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

// Store Module
// import moduleUser from "@/store/user/moduleUser.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
import { mapGetters } from 'vuex';

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
      adresse:      '',

      value1: '',
      value2: '',
      popupActive2: false,
      popupActive3: false,

      isNavOpen: false,
      userPoll: '',
      user_info: {
        profile_img: require("@/assets/images/profile/user-uploads/user-13.jpg"),
        cover_img: require("@/assets/images/profile/user-uploads/cover.jpg"),
      },
      MyConfig: {
          altFormat: "F j, Y",
          dateFormat:"d M Y"
      },
      backgroundLoading:'primary',
      colorLoading:'#fff',
      loading: true,
    }
  },
  computed:{
    ...mapGetters({
      user_data: 'authentificated/getAuth'
    }),
    validateForm(){
      return !this.errors.any() && this.email != '' && this.loading
    }
  },
  methods: {
    updateUser(){
      if(!this.telephone.valid) {
        this.$vs.notify({
          position:'top-center',
          text: this.$t('invalidPhoneNumber'),
          color:'danger',
          icon:'close'
        })
        return
      }
      var user = this.user_data

      //window.console.log(user)
      this.openLoadingContained()

      this.formData.append('firstName', this.prenom);
      this.formData.append('lastName', this.nom);
      this.formData.append('phone', this.telephone.number);
      this.formData.append('presentation', this.presentation);
      this.formData.append('email', this.email);
      this.formData.append('pays', this.pays);
      this.formData.append('ville', this.ville);
      this.formData.append('adresse', this.adresse);
      this.formData.append('anniversaire', new Date(this.anniversaire).getTime()/1000);
      this.formData.append('id', user.id);

      let payload = {
        resourceUrl:"/api/user",
        commitAction: 'SET_USER',
        data: this.formData
      }
      this.$store.dispatch("authentificated/postRequest", payload)
      .then(() => {
        this.popupActive2 = false;
        this.loading = true

        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
        this.$vs.notify({
          position:'top-center',
          title: 'success',
          text: this.$t('updateCompletedSuccessfully'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'success'
        })
        // this.$store.dispatch('UPDATE_USER_INFO', user.data)
        })
      .then(() => window.history.back())
      .catch(error => {
        this.loading = true
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
    resetField(){
      var user = this.user_data
      var photo_couverture = document.getElementById('photo_couverture');
      var photo_profil = document.getElementById('photo_profil');

      photo_couverture.src = user.photo_couverture
      photo_profil.src = user.photo_profil


      this.prenom = user.firstName,
      this.nom = user.lastName,
      this.email = user.email;
      this.telephone.number = user.phone.number
      this.pays = user.pays,
      this.ville = user.ville,
      this.societe = user.societe,
      this.presentation = user.presentation,
      this.adresse = user.adresse,

       this.popupActive2 = false;

    },

    selectedFile(event, id) {
      var input = event.target
       var reader = new FileReader();
        reader.onload = function(){
          var dataURL = reader.result;
          var output = document.getElementById(id);
          output.src = dataURL;
          window.console.log(this.photo)
        };
      this.formData.append(id, input.files[0])
      // if(id == "photo_couverture") this.forminput.files[0])
      // else this.photo.push(input.files[0])
      reader.readAsDataURL(input.files[0]);

      },

    onInput(formattedNumber, { number, valid, country }) {
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
    },
     goBack(){
          window.history.back();
        },


    successUpload(){
      this.$vs.notify({color:'success',title:'Upload Success',text:'Lorem ipsum dolor sit amet, consectetur'})
    },

    openLoadingContained(){
        this.loading = false
        this.$vs.loading({
            background: this.backgroundLoading,
            color: this.colorLoading,
            container: "#button-with-loading",
            scale: 0.45
      });
    },

  },
  components: {
   flatPickr
  },
    created() {
    /*if(!moduleUser.isRegistered) {
        this.$store.registerModule('user', moduleUser)
        moduleUser.isRegistered = true
    }
    if(!moduleUserManagement.isRegistered) {
      this.$store.registerModule('userManagement', moduleUserManagement)
      moduleUserManagement.isRegistered = true
    }*/

    /* this.$store.dispatch("nouvelle/fetchNews",payload)
    .catch(err => { window.console.error(err) }) */

    //Verifier si l'utilisateur est sur la page admin
    var path = localStorage.getItem('route')
    if(path == '/association/administration') this.admin = true
  },
  mounted() {
    this.prenom = this.user_data.firstName != 'null'? this.user_data.firstName: '',
    this.nom =    this.user_data.lastName != 'null'? this.user_data.lastName: '',
    this.adresse = this.user_data.adresse != 'null'? this.user_data.adresse: '',
    this.email =     this.user_data.email != 'null'? this.user_data.email: '',
    this.telephone =    {
                      number: this.user_data.phone,
                      valid: true,
                      country: undefined,
                      label:this.user_data.telephone
                    },
    this.pays =        this.user_data.pays != 'null'? this.user_data.pays: '',
    this.ville =       this.user_data.ville != 'null'? this.user_data.ville: '',
    this.societe =      this.user_data.societe != 'null'? this.user_data.societe: '',
    this.anniversaire = this.user_data.anniversaire? this.user_data.anniversaire*1000: new Date(),
    this.presentation = this.user_data.presentation != 'null'? this.user_data.presentation: '',
    this.photo_couverture = this.user_data.photo_couverture,
    this.photo_profil = this.user_data.photo_profil,
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
</script>



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
    bottom: -4.6rem;
    left: 4%;
    width: 80%;
    justify-content: space-between;
  }

  #photo_profil {
    width: 170px;
    height: 170px;
    background: rgb(195, 195, 195);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 10px 3px;
    border: 0.3rem solid #fff;
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

  /* #photo_profil {
    border-radius: 50%;
    width: 100px;
    border: 0.3rem solid #fff;
    margin-left : 30px;
    margin-top: 15px;
  } */
  .ajout_photo_profile{

    position: absolute;
    bottom: 0px;
    left: 130px;
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
  top: 20px;
  min-width: 20%;
  min-height: 21%;
  /* font-size: 100px; */
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  display: block;
  z-index: 1111;

  left: 68%;
}

.btn-file_photo_profil{
  border-radius:50%
}

.btn-file_photo_profil input[type=file]{
  position: absolute;
  top: 100px;
  min-width: 20%;
  min-height: 21%;
  margin-left: 130px;
  left: 0%;
  /* font-size: 100px; */
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  display: block;
  z-index: 1111;
  margin-top: 20px;
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
  padding: 1.5rem;
  padding-bottom: 0;
  padding-top: 0;
}
.mt-base {
  padding: 0.5rem;
}
.presentation{
  margin-left: 35%;
  margin-top: -70px;
  margin-right: 5%;
}

.-mx-2 {
  margin-left: -0.5rem !important;
  margin-right: -0.5rem !important;
  padding: 1rem;
}
.iconeretour{
  height: 18px;
   vertical-align:middle;
  margin-left:-20px;
  margin-right: 25px;
}

</style>
