<template>
   <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
        <div class="vx-col sm:w-3/5 md:w-1/2 lg:w-2/5 xl:w-1/4 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="vx-row no-gutter">
                        <!-- <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                            <img src="@/assets/images/pages/forgot-password.png" alt="login" class="mx-auto">
                        </div> -->
                        <div class="vx-col sm:w-full md:w-full lg:w-full mx-auto self-center d-theme-dark-bg">
                            <div class="p-8">
                                <div class="vx-card__title mb-8">
                                    <h4 class="mb-4">{{$t('accountActivation')}}</h4>
                                    <p>{{$t('accountActivationSubtitle')}}.</p>
                                </div>

                                <vs-input label-placeholder="Code" v-model="code" class="w-full mb-8"/>
                                <span :disabled="disabled" class="link-color hover:italic" style="cursor:pointer" @click="resendCode">{{$t('newCode')}}</span>
                                <vs-button class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0"
                                    id="button-with-loading" @click="verifierCode(); openLoadingContained()"
                                    :disabled="!validateForm">
                                    {{$t('check')}}
                                </vs-button>
                            </div>
                        </div>
                    </div>
                </div>
               <br>
            </vx-card>
        </div>
    </div>
</template>

<script>
import {HTTP} from '@/services/http'
import {mapGetters} from 'vuex'

export default {
    data() {
        return {
            code: '',
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loading: true,
            disabled: true,
        }
    },
    computed: {

        ...mapGetters({
          currentPhone: 'authentificated/getPhone',
        }),

        validateForm() {
            return !this.errors.any() && this.code != '' && this.loading;
        }
    },

    created() {
      if(!this.currentPhone) this.$router.push('/user/login');
    },

    methods: {
        resendCode() {
            this.disabled = true

            if (this.disabled)
                HTTP.post('api/user/activation/code/resend',
                    {
                        phone: this.currentPhone
                    })
                    .then(() => {
                        this.loading = true
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")

                        this.$vs.notify({
                          position:'top-center',
                          text: this.$t('notifContent'),
                          color:'success',
                          icon:'check'
                        })
                        this.disabled = false
                        return true;
                    })
                    .catch(error => {
                        this.loading = true
                        this.disabled = false
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        // handle authentication and validation errors here
                        this.$vs.notify({
                          position:'top-center',
                          text:error,
                          color:'danger',
                          icon:'close'
                        })
                    })
        },
        verifierCode() {
            HTTP.post('/api/user/activate',
                {
                    userID: this.$store.state.authentificated.user_id,
                    code_pin: this.code,
                })
                .then(response => {
                    this.code = ''

                    this.loading = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")

                    this.$emit('completed', response.data)
                    this.$vs.notify({
                      position:'top-center',
                      text: this.$t('yourAccountHasBeenActivated'),
                      color:'success',
                      icon:'check'
                    })
                })
                .then(() => {
                  setTimeout( () => this.$router.push('/user/login'), 1000);
                })
                .catch(error => {
                    this.loading = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    // handle authentication and validation errors here
                    this.$vs.notify({
                      position:'top-center',
                      text:error,
                      color:'danger',
                      icon:'close'
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
