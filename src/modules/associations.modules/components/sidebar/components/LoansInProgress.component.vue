<template>
<div class="pl-2 pr-4">
    <!-- Membre concerné -->
    <p class="vs-input--label">{{$t('members')+ ' '+'*'}}</p>
    <v-select :options="selectOptions" label="text" v-model="membre" class="w-full " @onchange="validateForms" />

    <!-- Montant Crédit-->
    <p class="vs-input--label mt-5">{{$t('creditAmount')+ ' '+'*'}}</p>
    <money v-model="montant_credit" v-bind="money" class="money-input pt-3 pb-3 w-full" @onchange="validateForms" />
    <!-- Intérêts -->
    <!-- <p class="vs-input--label mt-5">{{$t('interests')+ ' '+'*'}}</p>
        <money
            v-model="interet"
            v-bind="money"
            class="money-input pt-3 pb-3 w-full"
            @onchange="validateForms"
        /> -->
    <!-- Montant restant-->
    <!--<p class="vs-input--label mt-5">{{$t('remainingAmount')+ ' '+'*'}}</p>
        <money
            v-model="montant_restant"
            v-bind="money"
            class="money-input pt-3 pb-3 w-full"
            @onchange="validateForms"
        /> -->

    <!-- Date debut-->
    <p class="vs-input--label mt-5">{{$t('startDateCredit')+ ' '+'*'}}</p>
    <flat-pickr :config="MyConfig" v-model="date_debut" class="w-full" @onchange="validateForms" />
    
    <!-- Date debut remboursement-->
    <div >
        <!-- Echeance -->
        <p class="vs-input--label mt-5">{{$t('startDateRebursement')+ ' '+'*'}}</p>
        
        <v-select label="text" :options="selectAgsOptions" v-model="date_debut_remboursement" class="w-full" />
        
    </div>
    <!-- Date limite-->
    <!-- <p class="vs-input--label mt-5">{{$t('Deadlines')+ ' '+'*'}}</p>
        <flat-pickr
            :config="MyConfig"
            v-model="date_limite"
            class="w-full"
            @onchange="validateForms"/>

        <vs-checkbox v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
            {{$t('addAnother')}}
        </vs-checkbox>-->

    <!-- Allocation du versement -->
    <span class="flex justify-between">
        <p class="vs-input--label mt-6 mb-4 inline-block">{{$t('remainingSettlements')}}</p>
        <!-- <ul class="inline-block" style="color:#65B0F3;">
            <li color="#65B0F3"
                class="text-sm mt-6 inline-block mt-5 hover:italic cursor-pointer pl-2 pr-2"
                @click="addItem()">
                + {{$t('addALine')}}
            </li>
        </ul> -->
    </span>
    <div class="vx-row pb-32">
        <div class="vx-col w-full">
            <!-- <fieldset class="" style="border: 1px solid rgba(0, 0, 0, 0.2; border-radius: 5px">
                    <legend class="text-center">
                        <div class="vx-col w-full">
                            <ul class="inline-block" style="color:#65B0F3;">
                                <li color="#65B0F3"
                                    class="inline-block hover:italic cursor-pointer pl-2 pr-2"
                                    @click="addItem()">
                                    + {{$t('addALine')}}
                                </li>
                            </ul>
                        </div>
                    </legend> -->
            <div class="grid grid-cols-4 gap-3 -mb-3" v-for="(input,k) in inputs" :key="k">
                <div class="col-span-1">
                    <!-- MONTANT -->
                    <p class="vs-input--label">{{$t('Amount')+ ' '+'*'}}</p>
                    <money v-model="input.montant" class="money-input w-full pt-3 pb-3 mb-4" v-bind="money" />
                </div>
                <div class="col-span-1">
                    <!-- MONTANT interet-->
                    <p class="vs-input--label">{{$t('interests')+ ' '+'*'}}</p>
                    <money v-model="input.interet" class="money-input w-full pt-3 pb-3 mb-4" v-bind="money" />
                </div>
                <div class="col-span-2">
                <!-- Echeance -->
                <p class="vs-input--label">{{$t('numberOfDeadline')+ ' '+'*'}}</p>
                <vs-input type="number" v-model="input.date_limite" class="w-full" step="1" min="1" />
    
                </div>
            </div>
            <!-- </fieldset> -->
        </div>
        <div class="vx-col w-full">
            <ul class="inline-block" style="color:#65B0F3;">
                <li color="#65B0F3" class="text-sm inline-block hover:italic cursor-pointer" @click="addItem()">+ {{$t('addALine')}}</li>
            </ul>
        </div>
    </div>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'

// Function
// import i18n_date from '@/i18n_date.js'
import {
    EventBus
} from '@/services/EventBus.js'

import checkIfAdmin from '../../../mixins/checkRole'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    mixins: [checkIfAdmin],
    props: ['membres', 'activite', 'mutuelle', 'idLoader'],
    data() {
        return {
            montant_credit: 0,
            interet: 0,
            montant_restant: 0,
            echeance: 0,
            date_debut: new Date(),
            date_debut_remboursement: '',
            date_limite: '',
            /* paiement_restant: 0, */
            membre: '',

            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            MyConfig: {
                altFormat: "F j, Y",
                dateFormat: "d M Y"
            },
            checkbox_create_another: false,
            inputs: [{
                montant: 0,
                interet: 0,
                date_limite: 0,
            }],

            ags: [],

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,
        }
    },
    components: {
        Money,
        flatPickr,
        vSelect
    },
    computed: {
        admin() {
          return this.isSuperAdministrator;
        },
        selectOptions() {
            if (this.membres != null) return this.membres.map(membre => ({
                id: membre.id,
                text: membre.membre,
                value: membre.membres_id
            }))
        },

        selectAgsOptions() {
            let prochaines_ags = []
            let tab = []
            if (this.ags != null)
                this.ags.forEach(element => {
                    if (element.etat != 'past' && element.etat != 'cloture')
                        prochaines_ags.push({
                            id: element.id,
                            text: this.$options.filters.dateTime(element.date_ag),
                            value: element.date_ag
                        })
                })

            if (prochaines_ags.length > 0) {
                tab = prochaines_ags
            }

            if(this.ags && this.ags.length){
                tab.push({
                    id: 0,
                    text: this.$t('nextCycle'),
                    value: 0
                })
            }

            return tab

        },

        validateForms() {
            /* if(this.membre != '' && this.montant_credit != 0 && this.interet != 0 && this.montant_restant != 0 &&
            this.date_debut != '' && this.date_limite != '') return this.$emit('disable',false)
            else */
            if (this.loader &&
                this.montant_credit != 0) return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },
    },
    mounted() {
        if (this.membres.length > 0) {
            this.membre = {
                text: this.membres[0].membre,
                value: this.membres[0].membres_id
            }
        }

        if (!this.admin && this.membres.length > 0) {
            this.membre = {
                text: this.membres[0].firstName,
                value: this.membres[0].id
            }
        }
    },
    methods: {
        /* Ajouter un bloc */
        addItem() {
            this.inputs.push({
                montant: 0,
                interet: 0,
                date_limite: 0,
            });
        },

        /* Enlever un bloc */
        remove(index) {
            this.inputs.splice(index, 1);
        },

        /* Loader */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${this.idLoader}`,
                scale: 0.45
            });
        },
        submit() {
            this.openLoadingContained()
            let echeances = []
            let montant_restant = 0
            let interet = 0

            let ags = this.selectAgsOptions

            let ind = ags.indexOf(this.date_debut_remboursement);

            this.inputs.forEach(element => {
                montant_restant += element.montant * element.date_limite
                interet += element.interet * element.date_limite

                for (let index = 0; index < element.date_limite; index++) {
                    echeances.push({
                        montant: element.montant,
                        interet: element.interet,
                        date_limite: ags[ind].value
                    })

                    if(ind < ags.length - 1) ind ++
                    else   ind = ags.length - 1
                    
                }
    
            })

            if(montant_restant > this.montant_credit){
                
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$vs.notify({
                    position: 'top-center',
                    text: this.$t('creditMontantRestant'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })

                return
            }

            let payload = {
                resourceUrl: 'api/activite/' + this.activite.id + '/mutuelle/' + this.mutuelle.id + '/credit/pending',
                commitAction: 'SET_CREDIT',
                data: {
                    credit: {
                        membres_id: this.membre.value,
                        montant_credit: this.montant_credit,
                        montant_interet: interet,
                        montant_restant: montant_restant,
                        date_demande: new Date(this.date_debut).getTime() / 1000,
                        date_limite: this.inputs.length
                    },
                    echeances: echeances

                }
            }

           
            this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                    if (!this.checkbox_create_another) {
                        this.$emit('isSidebarActiveLocal', false)
                    }

                    this.montant_credit = 0
                    this.date_debut = ''

                    this.inputs = [{
                        montant: 0,
                        interet: 0,
                        date_limite: 0,
                    }]

                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('creditSuccessfullyCreated'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })

                    /* Page loader */
                    EventBus.$emit('loader', true)

                    //Recupperer tous les credits de l'activité
                    let payload = {
                        resourceUrl: 'api/mutuelle/' + this.mutuelle.id + '/credits',
                        commitAction: 'SET_CREDITS'
                    }
                    this.$store.dispatch("association/fetchAssociationactivite", payload)
                        .then(() => {
                            /* Page loader */
                            EventBus.$emit('loader', false)
                        })
                        .catch((error) => {
                            /* Page loader */
                            EventBus.$emit('loader', false)
                            window.console.error(error)
                        })
                })
                .catch(error => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                    this.$vs.notify({
                        position: 'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
    },
    created() {
        this.ags = this.$store.state.association.ags

        if (this.ags.length > 0) {
            this.ags.forEach(ag => {
                if (ag.etat == 'current') {
                    this.inputs[0].date_limite = {
                        text: this.$options.filters.dateTime(ag.date_ag),
                        value: ag.date_ag
                    }
                }
            })

        }
    },
}
</script>
