<template>
    <vx-card no-shadow :title="$t('creationOfACreditSavingsActivity')">
        <div class="ep-association">
            <!-- Nom de l'activité -->
            <vs-input
                :label="$t('nameOfActivity')"
                v-model="nom"
                class="w-full"
            />
            <!-- Description de l'activité -->
            <p class="vs-input--label mt-5">{{$t('activityDescription')}}</p>
            <vs-textarea
                v-model="description"
                class="w-full"
            />

             <!-- Taux penalite -->
            <div class="grid grid-cols-3 gap-4 mt-5">
                <div class="col-span-2">
                    <vs-input
                        :label="$t('penaltyForFailure')"
                        type = number
                        v-model="taux_penalite"
                        class="w-full"
                        step="1"
                        min="0"
                        @keydown="filterKey"
                    />
                </div>
                <!-- Type penalite -->
                <div class="col-span-1">
                    <p class="vs-input--label">{{$t('typeOfPenalty')}}</p>
                    <v-select
                        label="text"
                        :options="penalityTypeSelectOptions"
                        v-model="type_penalite"
                        :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        class="w-full mt-1"/>
                </div>
            </div>

            <!-- Montant maximum empruntable -->
            <p class="vs-input--label mt-5">{{$t('maximumBorrowableAmount')}}</p>
            <money
                id="montant_maximum"
                v-model="montant_maximum"
                class="w-full money-input p-3"
                v-bind="money"/>

            <!-- Durée de remboursement maximum -->
            <span class="flex">
                <p class="vs-input--label mt-5 inline-block">{{$t('maximumRepaymentPeriod')}}</p>
                <p class="vs-input--label mt-5 inline-block">
                    <vx-tooltip :text="$t('maximumNumberOfGeneralMeetings')" position="right" class="inline-block">
                        <feather-icon  icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current"  class="ml-1 mt-1"/>
                    </vx-tooltip>
                </p>
            </span>
            <vs-input
                    type="number"
                    v-model="duree_remboursement"
                    class="w-full"
                    step="1"
                    min="0"
                    @keydown="filterKey"/>

            <!-- Taux d'interêt par période -->
            <vs-input
                type="number"
                icon-pack="feather"
                icon="icon-percent"
                icon-after vs-icon-after="true"
                :label="$t('interestRatePerPeriod')"
                v-model="taux_interet"
                class="w-full mt-5"
                step="1"
                min="0"
                @keydown="filterKey"/>

            <!-- Méthode de calcul d'intérêt -->
            <p class="vs-input--label mt-5">{{$t('interestCalculationMethod')}}</p>
            <v-select
                    :options="calculMethodSelectOptions"
                    v-model="methode_calcul_interet"
                    label="text"
                    class="w-full"/>

             <!-- Remboursement-->
            <p class="vs-input--label mt-5">{{$t('refunds')}}</p>
            <v-select
                    :options="refundSelectOptions"
                    v-model="remboursement"
                    label="text"
                    class="w-full"/>

             <!-- Payement des intérêts-->
            <p class="vs-input--label mt-5">{{$t('interestPayment')}}</p>
            <v-select
                    :options="interestPaymentSelectOptions"
                    v-model="payement_interet"
                    label="text"
                    class="w-full"/>
        </div>
        <div class="flex flex-wrapper mt-6">
            <vs-button
                type="border"
                class="mr-6"
                @click.native="reset">
                {{$t('cancel')}}
            </vs-button>

            <vs-button
                class="ml-3 vs-con-loading__container"
                ref="loadableButton"
                id="button-with-loading"
                @click.native="createOrUpdateActivity"
                :disabled="!validateForm">
                {{$t('next')}}
            </vs-button>
        </div>
    </vx-card>
</template>
<script>
import {Money} from 'v-money'
import vSelect from 'vue-select'
//Functions
import {penality_type} from '../../../services/data/penalityType.js'
import {calcul_method} from '../services/data/computationMethods'
import {refund} from '../services/data/refundingPolicies'
import {interest_payment} from '../services/data/interestPayment.js'

    export default {
        props: ['activity' ,'ags'],
        data(){
            return{
                selected: [],
                nom: '',
                description: '',
                taux_penalite: '',
                montant_maximum: 0,
                duree_remboursement: '',
                taux_interet: 0,
                money: {
                    decimal: ',',
                    thousands: '.',
                    precision: 2,
                    masked: false,
                    /* prefix: ' ' */
                },
                type_penalite : {
                    text: this.$t(penality_type[0].i18n),
                    value: penality_type[0].value
                },
                payement_interet : {
                    text: this.$t(interest_payment[0].i18n),
                    value: interest_payment[0].value
                },
                remboursement : {
                    text: this.$t(refund[0].i18n),
                    value: refund[0].value
                },
                methode_calcul_interet : {
                    text: this.$t(calcul_method[0].i18n),
                    value: calcul_method[0].value
                },

                devise: '',

                /* Loader */
                backgroundLoading:'primary',
                colorLoading:'#fff',
                loader: true
            }
        },
        components: {
            vSelect,
            Money
        },
        computed : {
            selectOptions(){
                if(this.ags != null) return this.ags.map(ag => (
                    {
                        id: ag.id,
                        text: this.$options.filters.dateTime(ag.date_ag),
                        value: ag.date_ag
                    })
                )
            },

            validateForm() {
                return !this.errors.any() && this.nom != '' && this.loader;
            },
            penalityTypeSelectOptions(){
                return penality_type.map(type => ({text: this.$t(type.i18n), value: type.value}))
            },

            calculMethodSelectOptions(){
                return calcul_method.map(type => ({text: this.$t(type.i18n), value: type.value}))
            },

            refundSelectOptions(){
                return refund.map(type => ({text: this.$t(type.i18n), value: type.value}))
            },

            interestPaymentSelectOptions(){
                return interest_payment.map(type => ({text: this.$t(type.i18n), value: type.value}))
            }
        },
        mounted(){
            var epargne_courante
            var activite_courante

            if(localStorage.getItem('activity_id') !== null){
                activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

                this.nom = activite_courante.nom
                this.description = activite_courante.description
                this.taux_penalite = activite_courante.taux_penalite
                this.type_penalite = penality_type.reduce((a, o) => o.value == activite_courante.type_penalite ? a.concat(this.$t(o.i18n)) : a, '')

                epargne_courante = this.activity !== '' ? this.activity.Mutuelle : this.$store.state.association.activite.Mutuelle;

                this.montant_maximum = epargne_courante.maximum_empruntable
                this.duree_remboursement =  epargne_courante.duree_pret,
                this.taux_interet = epargne_courante.taux_interet,
                this.methode_calcul_interet = {
                    text: calcul_method.reduce((a, o) => o.value == epargne_courante.methode_calcul_interet ? a.concat(this.$t(o.i18n)) : a, ''),
                    value: epargne_courante.methode_calcul_interet
                }
                this.remboursement = {
                    text: refund.reduce((a, o) => o.value == epargne_courante.remboursement ? a.concat(this.$t(o.i18n)) : a, ''),
                    value: epargne_courante.remboursement
                }

                this.payement_interet = {
                    text: interest_payment.reduce((a, o) => o.value == epargne_courante.paiement_interet ? a.concat(this.$t(o.i18n)) : a, ''),
                    value: epargne_courante.paiement_interet
                }
            }
        },
         methods: {
            filterKey(e){
                const key = e.key;

                // If is '.' key, stop it
                if (key === '.')
                    return e.preventDefault();

                // OPTIONAL
                // If is 'e' key, stop it
                if (key === 'e' || key === 'E')
                    return e.preventDefault();
            },

            // This can also prevent copy + paste invalid character
            filterInput(e){
                e.target.value = e.target.value.replace(/[^0-9]+/g, '');
            },
            reset(){
                this.nom = ''
                this.montant_part = ''
                this.montant_cagnote = ''
                this.type_tontine = ''
                this.taux_penalite = ''
                this.type_penalite=  ''
                this.allocation_of_lot=  ''
            },
            createOrUpdateActivity(){
                this.openLoadingContained()
                var association_courante = this.$store.state.association.currentAssociation
                var user = this.$store.state.authentificated.user;
                var urlResource
                var method
                var activite_courante

                if(localStorage.getItem('activity_id') !== null){
                    activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

                    urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id
                    method = "association/putRequest"
                }
                else{
                   urlResource = "/api/association/"+association_courante.id+"/activite"
                   method = "association/postRequest"
                }

                let epargne_courante = this.activity !== '' ? this.activity.Mutuelle : this.$store.state.association.activite.Mutuelle;

                let payload = {
                resourceUrl: urlResource,
                commitAction: 'SET_ACTIVITE',
                data: {
                        nom: this.nom,
                        description: this.description,
                        taux_penalite: this.taux_penalite,
                        type_penalite: this.type_penalite.value,
                        type: 'Mutuelle',
                        id: user.id
                    }
                }
                this.$store.dispatch(method, payload)
                .then((res) => {
                    let activite_courante = res.data.data
                    let association_courante = this.$store.state.association.currentAssociation
                    let urlResource
                    let method

                    if(localStorage.getItem('activity_id') !== null){
                        urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id+"/Mutuelle/"+ epargne_courante.id
                        method = "association/postRequest"
                    }
                    else{
                    urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id+"/Mutuelle"
                    method = "association/postRequest"
                    }
                    let payload = {
                        resourceUrl: urlResource,
                        commitAction: 'NO_COMMIT',
                        data: {
                            maximum_empruntable: this.montant_maximum,
                            duree_pret: this.duree_remboursement,
                            taux_interet: this.taux_interet,
                            methode_calcul_interet: this.methode_calcul_interet.value,
                            paiement_interet: this.payement_interet.value,
                            remboursement: this.remboursement.value,
                        }
                    }
                    this.$store.dispatch(method, payload)
                    .then((res) => {
                        let epargne_courante = res.data.data
                        activite_courante.Mutuelle = epargne_courante;
                        this.$store.commit('association/SET_ACTIVITE', activite_courante)
                        localStorage.setItem('activity_id', JSON.stringify(activite_courante.id))

                        this.$emit('selectedTab', 1)
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        this.loader = true
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
                })
                .catch(error => {
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.loader = true
                    this.$vs.notify({
                        position:'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })

            },

            /* Loading */
            openLoadingContained(){
                this.loader = false,
                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading",
                    scale: 0.45
                });
            },
        },
        created(){
            let association_courante = this.$store.state.association.currentAssociation;

            //Recupperation de la devise de l'association
            this.devise = association_courante.devise
            /* this.money.prefix = this.symboleDevise()+' ' */
        }
    }
</script>
