<template>
    <div>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">
                    <div class="w-full">
                        <div class="p-8">
                            <div class="vx-card__title mb-8">
                                <p>{{$t('passwordResetSubtitle')}}</p>
                            </div>
                            <vs-input

                                type="password"
                                :label-placeholder="$t('oldpassword')"
                                v-model="oldPwd"
                                class="w-full mb-6"
                            />
                            <vs-input

                                ref="newPwd"
                                type="password"
                                data-vv-validate-on="blur"
                                data-vv-as="newPwd"
                                v-validate="'required|min:6|max:10'"
                                name="newPwd"
                                :label-placeholder="$t('NewPassword')"
                                v-model="newPwd"
                                class="w-full"/>
                                <span class="text-danger text-sm">{{ errors.first('newPwd') }}</span>

                            <vs-input

                                type="password"
                                v-validate="'min:6|max:10|confirmed:newPwd'"
                                data-vv-validate-on="blur"
                                data-vv-as="confirm"
                                name="confirm"
                                :label-placeholder="$t('confirmPassword')"
                                v-model="confirm"
                                class="w-full"/>
                                <span class="text-danger text-sm">{{ errors.first('confirm') }}</span>

                            <div class="mt-6">
                                <vs-button type="border" class="inline-block mr-4" @click="reset">{{$t('cancel')}}</vs-button>
                                <vs-button class="inline-block" @click="resetPawd" :disabled="!validateForm">{{$t('Reset')}}</vs-button>
                            </div>

                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
// import moduleUser from "@/store/user/moduleUser.js"
import {mapGetters} from 'vuex';

export default {
    data() {
        return {
            oldPwd: '',
            newPwd: '',
            confirm: '',
        }
    },
    created(){
        /*if(! moduleUser.isRegistered) {
            this.$store.registerModule('user',  moduleUser)
            moduleUser.isRegistered = true
        }*/
    },
     computed: {
       ...mapGetters({
         user: 'authentificated/getAuth',
       }),
        validateForm() {
            return !this.errors.any() && this.oldPwd != '' && this.newPwd != '' && this.confirm != '';
        }
    },
    methods: {
        reset(){
            this.oldPwd = ''
            this.newPwd = ''
            this.confirm = ''
        },
        resetPawd(){
            var user = this.user;

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
    }
}

</script>
