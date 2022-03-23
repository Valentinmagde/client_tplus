<template>
    <div>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <div>
                <vx-card no-shadow class="mb-base">
                    <h5>{{$t('closingOfTheActivity') | CAPITALIZE }} {{ nom_activite }}</h5>
                    <p class="mt-2 text-muted">{{$t('closingOfTheActivitySubtitle')}}</p>
                </vx-card>

            </div>

            <!-- Situation financière de l'activité -->
             <div class="vx-row">
                <div class="vx-col w-full mb-base">
                    <vx-card no-shadow :title="$t('financialSituation')">
                         <div class="vx-row">
                            <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                                <!-- Avoir -->
                                <span class="flex items-center">
                                    <span class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid border-success"></span>
                                    <span class="inline-block font-semibold">{{ $t('assets') }}:</span>
                                    <span class="ml-5" :class="{redtextclass: avoir_activite < 0}">
                                        {{ (avoir_activite) | formatMoney(devise) }}
                                    </span>

                                    <!-- Espaceur vertical -->
                                    <span class="ml-5 items-center">
                                        <span class="font-semibold">|</span>
                                    </span>
                                </span>

                            </div>

                            <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                                <!-- Solde -->
                                <span class="flex items-center">
                                    <span class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid border-warning"></span>
                                    <span class="inline-block font-semibold">{{$t('balance')}}:</span>
                                    <span class="ml-5" :class="{redtextclass: solde_activite < 0}">
                                        {{ (solde_activite) | formatMoney(devise) }}
                                    </span>

                                    <!-- Espaceur vertical -->
                                    <span class="ml-5 items-center">
                                        <span class="font-semibold">|</span>
                                    </span>
                                </span>
                            </div>

                            <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                                <!-- Dettes -->
                                <span class="flex items-center">
                                    <span class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid border-danger"></span>
                                    <span class="inline-block font-semibold">{{$t('debt')}}:</span>
                                    <span class="ml-5" :class="{redtextclass: dette_activite < 0}">
                                        {{(dette_activite) | formatMoney(devise) }}
                                    </span>

                                    <!-- Espaceur vertical -->
                                    <span class="ml-5 items-center">
                                        <span class="font-semibold">|</span>
                                    </span>
                                </span>
                            </div>

                            <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                                <!-- Caisse penalite-->
                                <span class="flex items-center">
                                    <span class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid"></span>
                                    <span class="inline-block font-semibold">{{$t('penaltyCheckout')}}:</span>
                                    <span class="ml-5" :class="{redtextclass: caisse_penalite_activite < 0}">
                                        {{ (caisse_penalite_activite) | formatMoney(devise) }}
                                    </span>
                                    <!-- Espaceur vertical -->
                                    <span class="ml-5 items-center">
                                        <span class="font-semibold">|</span>
                                    </span>
                                </span>
                            </div>
                             <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                                <!-- Caisse interet-->
                                <span class="flex items-center">
                                    <span class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid"></span>
                                    <span class="inline-block font-semibold">{{$t('interestCheckout')}}:</span>
                                    <span class="ml-5" :class="{redtextclass: caisse_interet_activite < 0}">
                                        {{ (caisse_interet_activite) | formatMoney(devise) }}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </vx-card>
                </div>
            </div>

            <vx-card no-shadow class="mb-base">
                <div v-if="total_activite < 0 || total_activite > 0" class="vx-row">
                    <!-- Avenir de l'activité -->
                    <div class="vx-col w-full">
                        <h5 class="mb-5 font-normal">
                            {{$t('futureOfTheActivity')}}?
                        </h5>
                        <p v-if="type_activite=='Tontine'" class="mt-2 text-muted">
                            {{$t('ATontineCannotBeRenewedForTheNextCycle')}}
                        </p>

                        <ul class="centerx" v-if="type_activite!='Tontine'">
                            <li class="inline-block mr-12">
                                <vs-radio v-model="future" vs-value="archive">{{$t('archive')}}</vs-radio>
                            </li>
                            <li class="inline-block">
                                <vs-radio v-model="future" vs-value="carry">{{$t('carryOnToTheNextCycle')}}</vs-radio>
                            </li>
                        </ul>
                    </div>

                    <!-- Montant en caisse Penalite -->
                    <div class="vx-col w-full mt-8" v-if="caisse_penalite_activite > 0">
                        <h5 class="mb-5 font-normal">
                            {{$t('penaltyCheckout')}} ?
                        </h5>
                        <ul class="centerx">
                            <li class="inline-block mr-8">
                                <vs-radio v-model="amount_penalite_receive" vs-value="redistribuer_penalite">
                                    {{$t('redistributeToMembers')}}
                                </vs-radio>
                            </li>
                            <li class="inline-block mr-8">
                                <vs-radio v-model="amount_penalite_receive" vs-value="virer_penalite">
                                    {{$t('transferToTheAdministrationFund')}}
                                </vs-radio>
                            </li>
                            <li class="inline-block" v-if="type_activite=='Mutuelle'">
                                <vs-radio v-model="amount_penalite_receive" vs-value="mises_de_fond_penalite">
                                    {{$t('putInTheDownPayment')}}
                                </vs-radio>
                            </li>
                        </ul>
                    </div>

                    <!-- Montant en caisse Interet-->
                    <div class="vx-col w-full mt-8" v-if="caisse_interet_activite > 0">
                        <h5 class="mb-5 font-normal">
                            {{$t('interestCheckout')}} ?
                        </h5>
                        <ul class="centerx">
                            <li class="inline-block mr-8">
                                <vs-radio v-model="amount_interet_receive" vs-value="redistribuer_interet">
                                    {{$t('redistributeToMembers')}}
                                </vs-radio>
                            </li>
                            <li class="inline-block mr-8">
                                <vs-radio v-model="amount_interet_receive" vs-value="virer_interet">
                                    {{$t('transferToTheAdministrationFund')}}
                                </vs-radio>
                            </li>
                            <li class="inline-block" v-if="type_activite=='Mutuelle'">
                                <vs-radio v-model="amount_interet_receive" vs-value="mises_de_fond_interet">
                                    {{$t('putInTheDownPayment')}}
                                </vs-radio>
                            </li>
                        </ul>
                    </div>

                    <!-- Soldes des membres -->
                    <div v-if="future=='archive'  && solde_activite > 0" class="vx-col w-full mt-8">
                        <h5 class="mb-5 font-normal">
                            {{$t('membershipBalance')}} ?
                        </h5>
                        <ul class="centerx">
                            <li class="inline-block mr-6">
                                <vs-radio v-model="membership_balance" vs-value="reverser">
                                    {{$t('returnToMembers')}}
                                </vs-radio>
                            </li>
                            <!-- <li class="inline-block mr-6">
                                <vs-radio v-model="membership_balance" vs-value="virer_caisse">
                                    {{$t('transferToTheAdministrationFund')}}
                                </vs-radio>
                            </li> -->
                            <li class="inline-block">
                                <vs-radio v-model="membership_balance" vs-value="virer_solde_administration">
                                    {{$t('transferToTheBalanceOfTheMember')}}
                                </vs-radio>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="future=='archive' && (total_activite < 0 || total_activite > 0)" class="vx-row">
                    <!-- Dettes -->
                    <div  class="vx-col w-full mt-8" v-if="dette_activite > 0">
                        <h5 class="mb-5 font-normal">
                            {{$t('debt')}}?
                        </h5>
                        <ul class="centerx">
                            <li class="inline-block mr-8">
                                <vs-radio v-model="debt" vs-value="perte_profit">
                                    {{$t('passDebtsIntoProfitAndLoss')}}
                                </vs-radio>
                            </li>
                            <!-- <li v-if="future=='archive'">
                                <vs-radio v-model="debt" vs-value="reconduire">
                                    {{$t('keepThemIfTheActivityIsGoingToBeRenewed')}}
                                </vs-radio>
                            </li> -->
                            <li class="inline-block">
                                <vs-radio v-model="debt" vs-value="virer_dette_administration">
                                    {{$t('transferToTheDebtOfTheMember')}}
                                </vs-radio>
                            </li>
                        </ul>
                    </div>

                    <!-- Avoirs -->
                    <div class="vx-col w-full mt-8" v-if="avoir_activite > 0">
                        <h5 class="mb-5 font-normal">
                            {{$t('assets')}} ?
                        </h5>
                        <ul class="centerx">
                            <li class="inline-block mr-8">
                                <vs-radio v-model="asset" vs-value="payer">
                                    {{$t('pay')}}
                                </vs-radio>
                            </li>
                            <li class="inline-block">
                                <vs-radio v-model="asset" vs-value="virer_avoir_administration">
                                    {{$t('transferToTheMemberAssets')}}
                                </vs-radio>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-wrapper mt-6">
                    <vs-button
                        id="button-with-loading"
                        :disabled="!loader"
                        @click="closeActivity">
                        {{$t('cloturer')}}
                    </vs-button>
                </div>
            </vx-card>
        </div>
    </div>
</template>
<script>
//Fonctions
import { EventBus } from  '@/services/EventBus.js'

//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    data(){
        return {
            future: 'archive',
            amount_penalite_receive: 'redistribuer_penalite',
            amount_interet_receive: 'redistribuer_interet',
            membership_balance: 'reverser',
            debt: 'perte_profit',
            asset: 'payer',
            interest: 'redistribution',

            nom_activite: '',
            type_activite: '',

            solde_activite: 0,
            dette_activite: 0,
            avoir_activite: 0,
            caisse_penalite_activite: 0,
            caisse_interet_activite: 0,
            total_activite: 0,

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true
        }
    },
    computed: {
    },
    methods: {
        //Redirige sur la liste des activités
        redirectActivities(tr){
            let route, activity_type = tr.type

            switch (activity_type) {
                case "Generique":
                    route = '/association/administration/activities/generic/all'
                    break;
                case "caisse":
                    route = '/association/administration/activities/generic/all'
                    break;

                case "Tontine":
                    route = '/association/administration/activities/tontines/all'
                    break;

                case "Evenement":
                    route = '/association/administration/activities/events/all'
                    break;

                case "Mutuelle":
                    route = '/association/administration/activities/mutuals/all'
                    break;

                case "Solidarite":
                    route = '/association/administration/activities/solidarities/all'
                    break;

                default:
                    break;
            }

            this.$router.push(route).catch(() => {})
        },

        // Clôture une activité
        closeActivity(){
            this.openLoadingContained()

            let association_courante = this.$store.state.association.currentAssociation
            let activite_cloture = this.$store.state.association.activite


            /* Paramètres */
            let params = {}
            if(this.total_activite == 0){
                this.caisse_penalite_activite > 0 ?  params.penalite = this.amount_penalite_receive : 1
                this.caisse_interet_activite > 0 ?  params.interet = this.amount_interet_receive : 1
                params.cloturer = true
                // params = {
                //     interet: this.amount_interet_receive,
                //     penalite: this.amount_penalite_receive,
                //     cloturer: true
                // }
            }
            else if(this.future == 'archive'){
                this.caisse_penalite_activite > 0 ?  params.penalite = this.amount_penalite_receive : 1
                this.caisse_interet_activite > 0 ?  params.interet = this.amount_interet_receive : 1
                this.solde_activite > 0 ?  params.solde = this.membership_balance : 1
                this.dette_activite > 0 ?  params.dette = this.debt : 1
                this.avoir_activite > 0 ?  params.avoir = this.asset : 1
                params.cloturer = true
                // params = {
                //     interet: this.amount_interet_receive,
                //     penalite: this.amount_penalite_receive,
                //     solde: this.membership_balance,
                //     dette: this.debt,
                //     avoir: this.asset,
                //     cloturer: true
                // }
            }
            else{
                this.caisse_penalite_activite > 0 ?  params.penalite = this.amount_penalite_receive : 1
                this.caisse_interet_activite > 0 ?  params.interet = this.amount_interet_receive : 1
                params.cloturer = false
                // params = {
                //     interet: this.amount_interet_receive,
                //     penalite: this.amount_penalite_receive,
                //     cloturer: false
                // }
            }


            let payload = {
                resourceUrl: '/api/association/'+association_courante.id+'/cloturer/activite/'+ activite_cloture.id,
                commitAction: 'SET_ACTIVITE',
                data: params
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(()=>{
                this.loader = true
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('notifContent'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })

                /* this.redirectActivities(activite_cloture) */
                this.$router.push("/association/administration/activities").catch(() => {})
            })
            .catch((error)=>{
                this.loader = true
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")

                this.$vs.notify({
                    position:'top-center',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
                window.console.error(error)
            })
        },

        getAccounts(){

          let activite = this.$store.state.association.activite

          let payload = {
            resourceUrl: '/api/activite/'+this.$route.params.activity_id+'/comptes/all',
            commitAction: 'SET_ACCOUNTS'
          }

          this.$store.dispatch("association/fetchComptemembreActivite", payload)
          .then((res) => {
            EventBus.$emit('loader', false)
            let comptes = res.data.data

            comptes.forEach(element=>{
              this.solde_activite += element.statistiques.solde
              this.dette_activite += element.statistiques.dettes_cotisations + element.statistiques.dettes_acquitements
              this.avoir_activite += element.statistiques.avoirs
            })

            this.total_activite = this.solde_activite + this.dette_activite + this.avoir_activite + activite.interet + activite.penalite
          })
          .catch((error)=>{
            EventBus.$emit('loader', false)
            window.console.error(error)
          })
        },

        openLoadingContained(){
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            });
        },
    },
    created(){
        EventBus.$emit('loader', true)
        var current_association = this.$store.state.association.currentAssociation
        let payload = {
          resourceUrl:"api/association/"+current_association.id+"/activite/"+this.$route.params.activity_id,
          commitAction: 'SET_ACTIVITE',
        }

        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .then((res) => {
          this.nom_activite = ' - ' + res.data.data.nom.toUpperCase()
          this.caisse_interet_activite = res.data.data.interet
          this.caisse_penalite_activite = res.data.data.penalite
          this.type_activite = res.data.data.type
          this.getAccounts()
        })

        /* Devise de l'association courante */
        this.devise = current_association.devise

        /* Visibilité de l'association courante */
        this.visibilite = current_association.visibilite_financiere
    },
}
</script>
<style>
    .vs-con-table .vs-con-tbody {
        width: 100%;
        overflow: auto;
        margin-top: -10px;
    }
</style>
