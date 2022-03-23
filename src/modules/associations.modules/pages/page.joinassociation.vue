<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-content vx-col sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/4 m-4 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col sm:w-full md:w-full lg:w-full mx-auto self-center d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">{{$t('joinAssociation')}}</h4>
                                    <p>{{$t('pleaseEnterYourCode')}}</p>
                                </div>
                                <vs-input label-placeholder="Code pin" v-model="code" class="w-full mb-6" />

                                <div class="flex flex-wrap justify-between flex-col-reverse sm:flex-row">
                                    <vs-button type="border" to="/associations" class="w-full sm:w-auto mb-8 sm:mb-auto mt-3 sm:mt-auto">
                                      {{$t('back')}}
                                    </vs-button>
                                    <vs-button class="w-full sm:w-auto" id="button-with-loading" @click="join"
                                      :disabled="!validateForm">
                                      {{$t('join')}}
                                    </vs-button>
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
// import moduleAssociation from "@/store/association/moduleAssociation.js"
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
          code: '',
          backgroundLoading:'primary',
          colorLoading:'#fff',
          loading: true,
        }
    },

    computed: {
      ...mapGetters({
        auth: 'authentificated/getAuth',
      }),
      validateForm() {
        return this.code != '' && this.loading;
      }
    },

    created(){
      /*if(! moduleAssociation.isRegistered) {
        this.$store.registerModule('association',  moduleAssociation)
        moduleAssociation.isRegistered = true
      }*/
    },

    methods:{
      join(){
        let user = this.auth;
        let payload = {
          resourceUrl:"/api/association/rejoindre",
          commitAction: 'NO_COMMIT',
          data: {
            code: this.code,
            utilisateurs_id: user.id
          }
        }

        this.openLoadingContained()
        this.$store.dispatch("association/postRequest", payload)
        .then(() => {
            this.code = ''
            this.loading = true
            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
            this.$vs.notify({
                position:'top-center',
                text: this.$t('successfullyJoined'),
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'success'
              })
            setTimeout( () => this.$router.push('/associations'), 1000)
          })
        .catch(error => {
          this.code = ''
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

      openLoadingContained(){
        this.loading = false
        this.$vs.loading({
            background: this.backgroundLoading,
            color: this.colorLoading,
            container: "#button-with-loading",
            scale: 0.45
        });
      },
    }
}
</script>
