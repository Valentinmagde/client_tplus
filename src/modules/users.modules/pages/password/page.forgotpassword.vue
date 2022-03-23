
<template>
    <div class="h-screen flex w-full bg-img">
        <div class="vx-content vx-col sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/4 m-4 mx-auto self-center">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row">
                        <div class="vx-col sm:w-full md:w-full lg:w-full mx-auto self-center d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">{{ $t('restoreYourPassword') }}</h4>
                                    <p>{{ $t('pleaseEnterYourPhoneNumberAndWellSendYou') }}</p>
                                </div>

                                <vue-tel-input
                                    validate
                                    name="pseudo"
                                    :placeholder="$t('phone')"
                                    @input="onInput"
                                    validCharactersOnly
                                    class="select-large mt-6 w-full telephone"
                                >
                                </vue-tel-input>
                                <br>
                                <vs-button type="border" to="/user/login" class="px-4 w-full md:w-auto">{{ $t('back') }}</vs-button>
                                <vs-button class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0" @click="forgotPawd" :disabled="!validateForm">{{ $t('restore') }}</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import VueTelInput from 'vue-tel-input'
// import moduleUser from "@/store/user/moduleUser.js"

Vue.use(VueTelInput)

export default {
    data() {
        return {
            value1: '',
            pseudo: {
                number: '',
                valid: false,
                country: undefined,
            }
        }
    },
    computed: {
        validateForm() {
        return !this.errors.any() && this.pseudo.number != '';
        }
    },
    methods: {
        onInput(formattedNumber, { number, valid, country }) {
            this.pseudo.number = number.e164;
            this.pseudo.valid = valid;
            this.pseudo.country = country && country.name;
        },
        forgotPawd(){
            if(!this.pseudo.valid) {
              this.$vs.notify({
                position:'top-center',
                text: this.$t('invalidPhoneNumber'),
                color:'danger',
                icon:'close'
              })
              return
            }

            let playload = {
              resourceUrl:"/api/user/recoverpwd",
              commitAction: 'SET_USER',
              data: {
                  phone: this.pseudo.number
              }
            }

            this.$store.dispatch("authentificated/postRequest", playload)
            .then(() => {
                this.pseudo.number = ""
                this.$vs.notify({
                      position:'top-center',
                      text: this.$t('passwordSuccessfullyReset'),
                      iconPack: 'feather',
                      icon: 'icon-alert-circle',
                      color: 'success'

                })
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
        }
    },
    created() {
      localStorage.clear();
      sessionStorage.clear();
      this.$store.commit('authentificated/LOG_OUT');
    }
}
</script>
