<!-- =========================================================================================
    File Name: Register.vue
    Description: Register Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
        <div class="vx-content mt-6 mb-6">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row no-gutter">
                        <div class="vx-col sm:w-full md:w-full lg:w-full mx-auto self-center  d-theme-dark-bg">
                          <br>
                            <div class="px-8 register-tabs-container">
                                <div class="vx-card__title mb-4">
                                  <div class="vx-col">
                                    <img src="@/assets/images/logo/logo.png" alt="login" class="mx-auto">
                                  </div>
                                  <!-- <br>
                                  <h4 class="vx-row mb-4 justify-center">Tontine.Plus</h4> -->
                                </div>
                                <br>
                                <div class="vx-card__title mb-4">
                                    <h4 class="vx-row mb-4 justify-center">{{$t('createYourAccount')}}</h4>
                                    <!-- <p>Fill the below form to create a new account.</p> -->
                                </div>
                                <register-user></register-user>
                            </div>
                           <div class="flex justify-center flex-wrap  _translate">
                            <span class="cursor-pointer link-color" v-show="locale=='fr'" @click="updateLocale('en')">English</span>
                            <span class="cursor-pointer link-color" v-show="locale=='en'" @click="updateLocale('fr')">Français</span>
                          </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
import RegisterUser from '../components/register/RegisterUser.component.vue'

export default {
    data(){
      return{
        locale: this.$i18n.locale
      }
    },
    components: {
      RegisterUser,
    },
    computed: {
    i18n_locale_img() {
      return require(`@/assets/images/flags/${this.$i18n.locale}.png`)
    },
  },
  methods: {
    updateLocale(locale) {
      this.$i18n.locale = locale;
      this.locale = this.$i18n.locale;
    },
  }
}
</script>
