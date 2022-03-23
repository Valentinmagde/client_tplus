
<template>
<div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
    <div class="card-content mt-6 mb-6">
        <vx-card>
            <div slot="no-body" class="full-page-bg-color">
                <div class="vx-row no-gutter justify-center items-center">
                    <div class="vx-col sm:w-full md:w-full lg:w-full d-theme-dark-bg">
                        <br>
                        <div class="px-8 login-tabs-container">
                            <!-- <br> -->
                            <div class="vx-card__title mb-4">
                                <div class="">
                                    <img src="@/assets/images/logo/logo.png" alt="login" class="mx-auto">
                                </div>
                                <!-- <br>
                                <h4 class="vx-row mb-4 justify-center">Tontine.Plus</h4> -->
                            </div>
                            <br>
                            <div class="vx-card__title mb-4">
                                <h4 class="vx-row mb-4 justify-center">{{$t('Login')}}</h4>
                                <!-- <p>Fill the below form to create a new account.</p> -->
                            </div>
                            <login-jwt></login-jwt>
                            <div class="flex justify-center flex-wrap  _translate ">
                                <span class="cursor-pointer link-color" v-show="locale=='fr'" @click="updateLocale('en')">English</span>
                                <span class="cursor-pointer link-color" v-show="locale=='en'" @click="updateLocale('fr')">Français</span>
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

import LoginJwt from "../components/login/LoginJWT.component.vue"

export default {
  data: () => ({
    locale: null
  }),

  components: {
    LoginJwt,
  },

  computed: {
    i18nLangImage() {
      return require(`@/assets/images/flags/${this.$i18n.locale}.png`)
    },

    getCurrentLocaleData() {
        const locale = this.$i18n.locale;
        if (locale == "en")      return { flag: "us", lang: 'English'    }
        else if (locale == "pt") return { flag: "br", lang: 'Portuguese' }
        else if (locale == "fr") return { flag: "fr", lang: 'French'     }
        else if (locale == "de") return { flag: "de", lang: 'German'     }
    },

  },

  methods: {
    updateLocale(locale) {
      this.$i18n.locale = locale;
      this.locale = this.$i18n.locale;
    },
  },

  created() {
    this.locale = this.$i18n.locale;
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

