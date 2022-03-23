<template>
     <div>
        <vx-card card-border>
            <p>
                {{$t('allocateTheSameAmountToAllMembers')}}
            </p>
        </vx-card>
        <!-- SOLDE -->
        <p class="vs-input--label mt-5">{{$t('balance')}}</p>
        <money
            v-model="solde"
            v-bind="money"
            class="money-input pt-3 pb-3 w-full"
            @onchange="validateForms"
        />

        <!-- DETTE ACQUITEMENT  Penalite-->
        <p class="vs-input--label mt-5">{{$t('debtPenalityLate')}}</p>
        <money
            v-model="dette_ap"
            v-bind="money"
                class="money-input pt-3 pb-3 w-full"
        />

        <!-- DETTE ACQUITEMENT Interet-->
        <p class="vs-input--label mt-5">{{$t('debtInterest')}}</p>
        <money
            v-model="dette_ai"
            v-bind="money"
                class="money-input pt-3 pb-3 w-full"
        />

        <!-- DETTE COTISATION -->
        <p class="vs-input--label mt-5">{{$t('debtBond')}}</p>
        <money
            v-model="dette_c"
            v-bind="money"
                class="money-input pt-3 pb-3 w-full"
        />

        <!-- AVOIR -->
        <p class="vs-input--label mt-5">{{$t('assets')}}</p>
        <money
            v-model="avoir"
            v-bind="money"
                class="money-input pt-3 pb-3 w-full"
        />

        <!-- Interet -->
        <p class="vs-input--label mt-5">{{$t('intrests')}}</p>
        <money
            v-model="interet"
            v-bind="money"
                class="money-input pt-3 pb-3 w-full"
        />
     </div>
</template>
<script>
import {Money} from 'v-money'

export default {
    props: ['activite','idLoader'],
    data(){
        return {
            solde: 0,
            dette_ap: 0,
            dette_ai: 0,
            dette_c: 0,
            avoir: 0,
            interet: 0,

            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,
        }
    },
    components: {
        Money,
    },
    computed:{
        validateForms(){
            if(!this.loader) return this.$emit('disable',true)
            else return this.$emit('disable',false)
        },
        comptesData(){
            return this.$store.state.association.accounts
        },
    },
    methods: {
        /* Loader */
        openLoadingContained(){
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${this.idLoader}`,
                scale: 0.45
            });
        },

        submit(){
            this.openLoadingContained()
            let update_compte = []
            this.comptesData.forEach((value)=>{

                update_compte.push(
                        {
                        activites_id: this.activite.id,
                        id: value.id,
                        membres_id: value.membres_id,
                        solde: this.solde,
                        dette_ap: this.dette_ap,
                        dette_ai: this.dette_ai,
                        dette_c: this.dette_c,
                        avoir: this.avoir,
                        interet: this.interet
                    }
                )
            })
            let payload = {
                resourceUrl:"/api/activite/membres/update",
                commitAction: 'SET_ACCOUNT',
                data: update_compte
            }

            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.solde = ''
                this.dette_a = ''
                this.dette_c = ''
                this.avoir = ''

                this.$emit('isSidebarActiveLocal', false)

                let payload = {
                    resourceUrl: '/api/activite/'+this.activite.id+'/comptes/all',
                    commitAction: 'SET_ACCOUNTS'
                }
                this.$store.dispatch("association/fetchComptemembreActivite", payload)
                .catch((error)=>{window.console.error(error)})
            })
            .catch(error => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$vs.notify({
                position:'top-center',
                text: error,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
                })
            })
        },
    },
    created(){
        if(this.activite && this.activite !== ''){
            let payload = {
                resourceUrl: '/api/activite/'+this.activite.id+'/comptes/all',
                commitAction: 'SET_ACCOUNTS'
            }

            this.inputs = []
            this.$store.dispatch("association/fetchComptemembreActivite", payload)
        }
    },
}
</script>
