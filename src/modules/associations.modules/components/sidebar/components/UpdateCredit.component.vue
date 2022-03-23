<template>
<div>
    <!-- Popup pour supprimer une mise de fonds -->
    <vs-popup id="popup" classContent="popup-example" class="popup-position" :title="$t('previewSettlements')" :active.sync="popupActivo2">
        <p class="ml-4 mb-1 font-medium">{{$t('creditDetail')}}</p>
        <table v-if="echeances" class="w-full border-collapse">
            <thead>
                <tr>
                    <th class="w-1/2 px-4 py-2  th-bg">{{ $t('Capital') }} </th>
                    <th class="w-1/2 px-4 py-2  th-bg">{{ $t('generalInterest') }} </th>
                    <th class="w-1/2 px-4 py-2  th-bg">{{ $t('amountToBeReceived') }} </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p :class="{redtextclass: echeances.detail.montant_credit < 0}">
                            {{formatMoney(echeances.detail.montant_credit)}}
                        </p>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p :class="{redtextclass: echeances.detail.interet < 0}">
                            {{formatMoney(echeances.detail.interet)}}
                        </p>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p :class="{redtextclass: echeances.detail.montant_a_payer < 0}">
                            {{formatMoney(echeances.detail.montant_a_payer)}}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>

        <p class="ml-4 mt-5 mb-1 font-medium">{{$t('settlementsDetail')}}</p>
        <table v-if="echeances" class="w-full border-collapse">
            <thead>
                <tr>
                    <th class="w-1/2 px-4 py-2  th-bg">{{ $t('Amount') }} </th>
                    <th class="w-1/2 px-4 py-2  th-bg">{{ $t('Deadlines') }} </th>
                </tr>
            </thead>
            <tbody>
                <tr :key="indextr" v-for="(echeance, indextr) in echeances.echeances">
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p :class="{redtextclass: echeance.montant < 0}">
                            {{echeance.montant | formatMoney(devise)}}
                        </p>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p v-if="echeance.date_limite == 0" class="product-name">
                            {{$t('nextCycle')}}
                        </p>
                        <p v-else class="product-name">
                            {{echeance.date_limite | dateTime}}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>

        <vs-divider />
        <div class="vx-row w-full justify-end">
            <vs-button color="#626262" @click="popupActivo2=false" type="border">{{$t('cancel')}}</vs-button>&nbsp;&nbsp;
            <!-- <vs-button class="ml-3" color="danger" @click.stop="deleteItem(mise_selectionnee)">{{$t('delete')}}</vs-button> -->
        </div>
    </vs-popup>

    <!-- Membre concerné -->
    <p class="vs-input--label">{{$t('members')+ ' '+'*'}}</p>
    <v-select :options="selectOptions" label="text" v-model="membre" class="w-full " @onchange="validateForms" />

    <!-- Montant Crédit-->
    <!-- <p class="vs-input--label mt-5">{{$t('creditAmount')+ ' '+'*'}}</p> -->
    <span class="flex">
        <p class="vs-input--label mt-5 inline-block">{{$t('creditAmount')+ ' '+'*'}}</p>
        <p class="vs-input--label mt-5 inline-block">
            <ejs-tooltip ref="tooltip" :content="$t('maximumBorrowingAmountConstraint')" position="bottom" class="mr-2 inline-block">
                <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
            </ejs-tooltip>
        </p>
    </span>
    <money v-model="montant_credit" v-bind="money" class="money-input pt-3 pb-3 w-full" @onchange="validateForms" />
    <span class="text-danger text-sm" v-show="maximumAmount">{{$t('maximumBorrowingAmountConstraint')}}</span>

    <!-- Date debut-->
    <p class="vs-input--label mt-5">{{$t('startDate')+ ' '+'*'}}</p>
    <v-select :options="selectAgsOptions" label="text" v-model="date_debut" class="w-full " @onchange="validateForms" />

    <!-- Date limite-->
    <span class="flex">
        <p class="vs-input--label mt-5 inline-block">{{$t('Deadlines')}}</p>
        <p class="vs-input--label mt-5 inline-block">
            <ejs-tooltip ref="tooltip" :content="$t('maximumNumberOfGeneralMeetings')" position="bottom" class="mr-2 inline-block">
                <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
            </ejs-tooltip>
        </p>
    </span>
    <vs-input type=number v-model="date_limite" class="w-full" step="1" min="0" @keydown="filterKey" @onchange="validateForms" />
    <span class="text-danger text-sm" v-if="deadline">{{$t('valueMustBeLessThanMaximumReimbursement')}}</span>

    <!-- <vs-checkbox v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
            {{$t('addAnother')}}
        </vs-checkbox> -->
    <!-- Aperçu des échéances -->
    <vs-button id="button-loading" class="flex mt-5 pt-2 pb-2" color="#3EB2FB" :disabled="!formsValidate" @click=" apercuEcheance()">
        {{$t('previewSettlements')}}
    </vs-button>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'

import functions from "../../../services/functions.js"

export default {
    props: ['credit', 'preview', 'mutuelle', 'idLoader'],
    data() {
        return {
            ags: null,
            montant_credit: 0,
            interet: 0,
            montant_restant: 0,
            echeance: 0,
            date_debut: '',
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
            admin: false,
            echeances: null,
            devise: '',
            popupActivo2: false,

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
        selectOptions() {
            if (this.membres != null) return this.membres.map(membre => ({
                id: membre.id,
                text: membre.membre,
                value: membre.membres_id
            }))
        },

        selectAgsOptions() {
            let prochaines_ags = []
            if (this.ags != null){
                this.ags.forEach(element => {
                    if (element.etat != 'past' && element.etat != 'cloture')
                        prochaines_ags.push({
                            id: element.id,
                            text: this.$options.filters.dateTime(element.date_ag),
                            value: element.date_ag
                        })
                })

                prochaines_ags.push({
                    id: 0,
                    text: this.$t('nextCycle'),
                    value: 0
                })
            }
            
            return prochaines_ags
        },

        validateForms() {
            if (this.membre != '' && this.montant_credit != 0 &&
                this.date_debut != '' && this.date_limite != '' &&
                this.loader && !this.maximumAmount &&
                !this.deadline) return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },

        //Date limite
        deadline() {
            if (parseInt(this.date_limite) > parseInt(this.mutuelle.duree_pret)) {
                return true
            } else return false
        },

        //Montant maximum
        maximumAmount() {
            if (parseInt(this.montant_credit) > parseInt(this.mutuelle.maximum_empruntable)) {
                return true
            } else return false
        },

        formsValidate() {
            return this.membre != '' && this.montant_credit != 0 &&
                this.date_debut != '' && this.date_limite != '' &&
                this.loader && !this.maximumAmount &&
                !this.deadline
        },
    },

    watch: {
        credit: function (newVal, oldVal) {
            window.console.log('oldVal, newVal')
            if (newVal) {
                window.console.log(oldVal, newVal)
                this.membre = {
                    text: newVal.membre,
                    value: newVal.membres_id
                }

                this.montant_credit = newVal.montant_credit
                this.date_debut = {
                    text: this.$options.filters.dateTime(newVal.date_demande),
                    value: newVal.date_demande
                }
                this.date_limite = newVal.date_limite
            }
        }
    },
    mounted() {
        if (this.credit) {
            this.membre = {
                text: this.credit.membre,
                value: this.credit.membres_id
            }

            this.montant_credit = this.credit.montant_credit
            this.date_debut = {
                text: this.$options.filters.dateTime(this.credit.date_demande),
                value: this.credit.date_demande
            }
            this.date_limite = this.credit.date_limite
        }
    },
    methods: {
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

        filterKey(e) {
            const key = e.key;

            // If is '.' key, stop it
            if (key === '.')
                return e.preventDefault();

            // OPTIONAL
            // If is 'e' key, stop it
            if (key === 'e' || key === 'E')
                return e.preventDefault();
        },

        /* Aperçu */
        apercuEcheance() {
            let payload = {
                resourceUrl: 'api/mutuelle/' + this.credit.mutuelles_id + '/credit/preview/echeance',
                commitAction: 'SET_CREDIT',
                data: {
                    mutuelles_activites_id: this.credit.mutuelles_activites_id,
                    membres_id: this.membre.value,
                    montant_credit: this.montant_credit,
                    montant_interet: this.interet,
                    montant_restant: this.montant_credit,
                    date_demande: this.date_debut.value,
                    date_limite: this.date_limite,
                }
            }

            this.$store.dispatch("association/postRequest", payload)
                .then((res) => {
                    this.echeances = res.data.data
                    this.popupActivo2 = true
                })
                .catch((error) => {
                    window.console.log(error)
                })
        },

        submit() {
            /* this.openLoadingContained() */
            let payload = {
                resourceUrl: 'api/activite/' + this.credit.mutuelles_activites_id + '/mutuelle/' + this.credit.mutuelles_id + '/credit/' + this.credit.id + '/update',
                commitAction: 'SET_CREDIT',
                data: {
                    membres_id: this.credit.membres_id,
                    mutuelles_id: this.credit.mutuelles_id,
                    mutuelles_activites_id: this.credit.mutuelles_activites_id,
                    date_demande: this.credit.date_demande,
                    etat: "EN_ATTENTE",
                    echeance: null,
                    montant_credit: this.montant_credit,
                    date_limite: this.date_limite,
                    membre: this.credit.membre
                }
            }

            this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                    this.$emit('isSidebarActiveLocal', false)

                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('operationSuccess'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })

                    //Recupperer tous les credits de l'activité
                    let payload = {
                        resourceUrl: 'api/mutuelle/' + this.credit.mutuelles_id + '/credits',
                        commitAction: 'SET_CREDITS'
                    }
                    this.$store.dispatch("association/fetchAssociationactivite", payload)
                        .catch((error) => {
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

            this.echeances = null
        },
    },
    created() {

        let association_courante = this.$store.state.association.currentAssociation
        let payload = {
            resourceUrl: '/api/association/' + association_courante.id + '/cycle',
            commitAction: 'SET_CYCLES'
        }
        this.$store.dispatch("association/fetchCycles", payload)
            .then((res) => {
                let donnees = res.data
                //Verifier s'il ya des cycles dans l'association
                if (donnees.data.length > 0) {
                    //Nous voullons reccuperer les cycles cloturés et le cycle actif de l'association
                    var cycle = donnees.data
                    var cycleActif = functions.afficherCycleActif(cycle)

                    //Assignation du cycle actigf à notre variable utilisée dans le template
                    if (cycleActif != null) {
                        //Assigner les ags du cycle actigf à la variable ags s'il en existe
                        if (cycleActif.ag.length > 0) this.ags = cycleActif.ag
                    }
                }
            })
            .catch((error) => {
                window.console.error(error);
            })

        this.devise = association_courante.devise

        //Verifier si l'utilisateur est sur la page admin
        var path = localStorage.getItem('route')
        if (path == '/home/admin') this.admin = true

        this.echeances = null
        this.preview = false
    },
}
</script>
