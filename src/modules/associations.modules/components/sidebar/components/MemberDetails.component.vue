<template>
<div class="ep-association">
    <div class="vx-row">
        <div class="vx-col w-full">
            <vx-card title="Account Information" class="mb-base">
                <table class="w-full border-collapse">
                    <tr>
                        <td class="font-semibold">{{$t('name')}} :</td>
                        <td>{{ member.firstName }}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('email')}} :</td>
                        <td v-if="member.adresse">{{ member.adresse }}</td>
                        <td v-else-if="member.users.length > 0">{{ member.users[0].email }}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('phone')}} :</td>
                        <td v-if="member.phone">{{ member.phone }}</td>
                        <td v-else-if="member.users.length > 0">{{ member.users[0].phone }}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('creationDate')}} :</td>
                        <td>{{ new Date(member.date_created*1000).toDateString()}}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('User')}} :</td>
                        <td>
                            <span :key="indextr" v-for="(user, indextr) in member.users">
                                {{user.lastName +' '+ user.firstName}},
                            </span>
                        </td>
                    </tr>
                    <tr v-if="member.code">
                        <td class="font-semibold">{{$t('Code')}} :</td>
                        <td>{{ member.code }}</td>
                    </tr>
                </table>
            </vx-card>

            <!-- Actions -->
            <vx-card title="Actions" class="mb-base mt-3 mr-6">

                <div class="flex">
                     <!-- Sanctionner un membre -->

                    <vs-button class="px-4 py-2 mb-3 mr-2 mt-1" icon-pack="streameline" icon="icon-single-neutral-actions-warning" @click.stop="popupActivo4=true">{{$t('sanction')}}</vs-button>


                <!-- Voir l'historique de cotisation -->

                    <vs-button class="px-4 py-2 mb-3 mr-2 mt-1" icon-pack="streameline" icon="icon-office-business-card" @click.stop="popupActive1=true">{{$t('ContributionHistory')}}</vs-button>


                <!-- Voir la situation financière -->

                    <vs-button class="px-4 py-2 mb-3 mr-2 mt-1" icon-pack="streameline" icon="icon-saving-money-tree" @click.stop="popupActive2=true; financialSituation()">{{$t('financialSituation')}}</vs-button>
                </div>


            </vx-card>

            <!-- Sanctionner -->
            <vs-popup classContent="popup-example" class="popup-position" :title="$t('sanctionTitle')" :active.sync="popupActivo4">
                <!-- Membre -->
                <p class="vs-input--label">{{$t('members')}}</p>
                <vs-input class="w-full mb-5" v-model="member.firstName" />

                <!-- Type de sanction -->
                <p class="vs-input--label">{{$t('sanctionType')}}</p>
                <v-select label="text" :options="selectSanctionOptions" class="w-full mb-5" v-model="sanction" @input="changeMoney(sanction)" />

                <!-- Montant -->
                <p class="vs-input--label">{{$t('Amount')}}</p>
                <money v-model="montant" class="money-input w-full p-3 mb-5" :desabled="moneyisDesable" readOnly />

                <!-- Motif -->
                <p class="vs-input--label">{{$t('reason')}}</p>
                <vs-textarea v-model="motif" class="w-full" />
                <vs-divider />
                <div class="vx-row w-full justify-end">
                    <vs-button @click="popupActivo4=false" type="border">
                        {{$t('cancel')}}
                    </vs-button>&nbsp;&nbsp;
                    <vs-button class="ml-3 vs-con-loading__container" ref="loadableButton" id="button-loading" :disabled="!loader" @click="save">
                        {{$t('sanction')}}
                    </vs-button>
                </div>
            </vs-popup>

            <!-- Historique de cotisation -->
            <vs-popup class="pop_up" :title="$t('contributionHistory')" :active.sync="popupActive1">
                <div id="data-list-list-view" class="data-list-container">
                    <div class="pt-4">
                        <div class="ml-5 mr-5">
                            <vx-card class="mb-base">
                                <h5>{{$t('listOfOtransactions') | CAPITALIZE }}</h5>
                                <p class="mt-2 text-muted">{{$t('listOfOtransactionsSubtitle')}}.</p>
                            </vx-card>
                            <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                            </div>
                            <vx-card v-if="operationsData.length == 0">
                                <p>{{$t('noElementFound')}}</p>
                            </vx-card>
                        </div>
                        <vs-table v-if="operationsData.length > 0" ref="table" pagination :max-items="itemsPerPage" search :data="operationsData">
                            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                                <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                                    <vs-button @click="redirectDetailOperation">{{$t('moreDetails')}}</vs-button>
                                    <!-- ACTION - DROPDOWN -->
                                    <!-- <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4 mb-4">

                                        <div class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full">
                                        <span class="mr-2">{{$t('exports')}}</span>
                                        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                                        </div>

                                        <vs-dropdown-menu style="width: 10rem">

                                        <vs-dropdown-item>
                                            <span class="flex items-center" @click="exportPDF(operationsData)">
                                            <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2" />
                                            <span>PDF</span>
                                            </span>
                                        </vs-dropdown-item>

                                        <vs-dropdown-item>
                                            <span class="flex items-center" @click="csvExport(operationsData)">
                                            <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2" />
                                            <span>CSV</span>
                                            </span>
                                        </vs-dropdown-item>

                                        <vs-dropdown-item>
                                            <span class="flex items-center" @click="exportExel(operationsData)">
                                            <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2" />
                                            <span>EXCEL</span>
                                            </span>
                                        </vs-dropdown-item>

                                        </vs-dropdown-menu>
                                    </vs-dropdown> -->

                                </div>
                                <!-- ITEMS PER PAGE -->
                                <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-full
                                        d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                        <span class="mr-2">
                                            {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                                            {{ operationsData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : operationsData.length }}
                                            of {{ queriedItems }}
                                        </span>
                                        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                                    </div>
                                    <vs-dropdown-menu>

                                        <vs-dropdown-item @click="itemsPerPage=4">
                                            <span>4</span>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item @click="itemsPerPage=10">
                                            <span>10</span>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item @click="itemsPerPage=15">
                                            <span>15</span>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item @click="itemsPerPage=20">
                                            <span>20</span>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </div>

                            <template slot="thead">
                                <!-- <vs-th sort-key="firstName">{{$t('members') | CAPITALIZE }}</vs-th> -->
                                <vs-th sort-key="payment_date">{{$t('paymentDate') | CAPITALIZE }}</vs-th>
                                <vs-th sort-key="amount">{{$t('Amount') | CAPITALIZE }}</vs-th>
                                <!-- <vs-th sort-key="creation_date">{{$t('creationDate') | CAPITALIZE }}</vs-th>-->
                                <vs-th sort-key="type">{{$t('Type') | CAPITALIZE }}</vs-th>
                                <vs-th sort-key="method">{{$t('paymentMethod') | CAPITALIZE }}</vs-th>
                                <vs-th sort-key="method">{{$t('state') | CAPITALIZE }}</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <tbody>
                                    <vs-tr :data="operation" :key="ind" v-for="(operation, ind) in data">
                                        <!-- <vs-td>
                                            <p class="product-name font-medium truncate">{{operation.membre}}</p>
                                        </vs-td> -->
                                        <vs-td>
                                            <p class="product-name font-medium">{{ operation.date_versement | dateTime }}</p>
                                        </vs-td>
                                        <vs-td>
                                            <p class="product-name" :class="{redtextclass: operation.montant < 0}">
                                                {{ (operation.montant) | formatMoney(devise) }}
                                            </p>
                                        </vs-td>
                                        <vs-td>
                                            <p v-if="operation.debit_credit=='credit'" class="product-price">{{$t('payment')}}</p>
                                            <p v-if="operation.debit_credit=='debit'" class="product-price">{{$t('withdrawal')}}</p>
                                        </vs-td>
                                        <vs-td>
                                            <p class="product-price">{{operation.mode}}</p>
                                        </vs-td>
                                        <vs-td>
                                            <p v-if="operation.etat == 'EN_ATTENTE'" class="product-price">
                                                <vs-chip color="warning">{{$t('waiting')}}</vs-chip>
                                            </p>
                                            <p v-if="operation.etat == 'VALIDE'" class="product-price">
                                                <vs-chip color="success">{{$t('validated')}}</vs-chip>
                                            </p>
                                            <p v-if="operation.etat == 'REJETE'" class="product-price">
                                                <vs-chip color="danger">{{$t('rejected')}}</vs-chip>
                                            </p>
                                        </vs-td>
                                    </vs-tr>
                                </tbody>
                            </template>
                        </vs-table>
                    </div>
                </div>
            </vs-popup>

            <!-- Situation financière -->
            <vs-popup class="pop_up" :title="$t('financialSituation')" :active.sync="popupActive2">
                <div class="pt-4">
                    <div>
                        <vx-card class="mb-base">
                            <h5>{{$t('overallFinancialSituation') | CAPITALIZE }} - {{ member.firstName }}</h5>
                            <p class="mt-2 text-muted">{{$t('financialSituationOfAMember')}}</p>
                        </vx-card>

                        <div class="vx-row flex flex-wrapper justify-end mt-5">
                            <!-- Total solde -->
                            <div class="vx-col vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
                                <span class="flex justify-center">
                                    <h2 class="font-bold text-size" :class="{redtextclass: solde < 0}">
                                        {{ (solde) | formatMoney(devise) }}
                                    </h2>
                                </span>
                                <span class="flex justify-center">
                                    {{$t('totalBalance')}}
                                </span>
                            </div>

                            <!-- Total dette -->
                            <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
                                <span class="flex justify-center">
                                    <h2 class="font-bold text-size" :class="{redtextclass: dette < 0}">
                                        {{ (dette) | formatMoney(devise) }}
                                    </h2>
                                </span>
                                <span class="flex justify-center">
                                    {{$t('totalDebts')}}
                                </span>
                            </div>

                            <!-- Total avoir -->
                            <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
                                <span class="flex justify-center">
                                    <h2 class="font-bold text-size" :class="{redtextclass: avoir < 0}">
                                        {{ (avoir) | formatMoney(devise) }}
                                    </h2>
                                </span>
                                <span class="flex justify-center">
                                    {{$t('totalAssets')}}
                                </span>
                            </div>
                        </div>

                        <vx-card v-if="comptesData.length == 0">
                            <p>{{$t('noElementFound')}}</p>
                        </vx-card>
                    </div>

                    <div class="vx-row">
                        <div v-if="comptesData.length > 0" class="vx-col w-full">
                            <vx-card class="pt-3">
                                <div slot="no-body" class="mt-4">
                                    <vs-table :data="comptesData" class="table-dark-inverted overflow-auto" style="max-height: 35rem">
                                        <template slot="thead">
                                            <vs-th>{{$t('Type') | CAPITALIZE }}</vs-th>
                                            <vs-th>{{$t('name') | CAPITALIZE }}</vs-th>
                                            <vs-th class="customer-align">{{$t('balance') | CAPITALIZE }}</vs-th>
                                            <vs-th class="customer-align">{{$t('debt') | CAPITALIZE }}</vs-th>
                                            <vs-th class="customer-align">{{$t('assets') | CAPITALIZE }}</vs-th>
                                        </template>
                                        <template slot-scope="{data}">
                                            <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="cursor-pointer" @click.native="redirectDetail(tr)">
                                                <vs-td>
                                                    <p class="product-name">
                                                        <!-- Caisse -->
                                                        <span v-if="tr.type_activite=='caisse'">
                                                            <vx-tooltip :text="$t('generique')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-tool-box"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>
                                                        <!-- Generique -->
                                                        <span v-if="tr.type_activite=='Generique'">
                                                            <vx-tooltip :text="$t('generique')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-tool-box"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>
                                                        <!-- Tontine -->
                                                        <span v-if="tr.type_activite=='Tontine'">
                                                            <vx-tooltip :text="$t('tontine')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-money-bags"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>
                                                        <!-- Evenement -->
                                                        <span v-if="tr.type_activite=='Evenement'">
                                                            <vx-tooltip :text="$t('events')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-calendar-check-1"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>
                                                        <!-- Mutuelle -->
                                                        <span v-if="tr.type_activite=='Mutuelle'">
                                                            <vx-tooltip :text="$t('EpargneCredit')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-saving-piggy-coins"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>
                                                        <!-- Projet -->
                                                        <span v-if="tr.type_activite=='Projet'">
                                                            <vx-tooltip :text="t('project')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-team-idea"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>
                                                        <!-- Solidarité -->
                                                        <span v-if="tr.type_activite=='Solidarite'">
                                                            <vx-tooltip :text="$t('solidarity')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-multiple-actions-heart"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>

                                                        <!-- Main levee -->
                                                        <span v-if="tr.type_activite=='Main_levee'">
                                                            <vx-tooltip :text="$t('handSUp')" position="bottom" class="inline-block">
                                                                <vs-icon icon-pack="streameline" icon="icon-cash-payment-bills-1"></vs-icon>
                                                            </vx-tooltip>
                                                        </span>
                                                    </p>
                                                </vs-td>
                                                <vs-td>
                                                    <p class="product-name">{{tr.nom_activite}}</p>
                                                </vs-td>
                                                <vs-td class="text-right" v-if="tr.statistique.data">
                                                    <span :class="{redtextclass: tr.statistique.data.solde < 0}">
                                                        {{ (tr.statistique.data.solde) | formatMoney(devise) }}
                                                    </span>
                                                </vs-td>
                                                <vs-td class="text-right" v-if="tr.statistique.data">
                                                    <span :class="{redtextclass: (tr.statistique.data.dettes_acquitements + tr.statistique.data.dettes_cotisations) < 0}">
                                                        {{ (tr.statistique.data.dettes_acquitements + tr.statistique.data.dettes_cotisations) | formatMoney(devise) }}
                                                    </span>
                                                </vs-td>
                                                <vs-td class="text-right" v-if="tr.statistique.data">
                                                    <span :class="{redtextclass: tr.statistique.data.avoirs < 0}">
                                                        {{ (tr.statistique.data.avoirs) | formatMoney(devise) }}
                                                    </span>
                                                </vs-td>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </div>
                            </vx-card>
                        </div>
                    </div>
                </div>
            </vs-popup>
        </div>
    </div>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import vSelect from 'vue-select'

import functions from '../../../services/functions.js'
import {
    payment_mod
} from '../../../services/data/paymentMod.js'

import {
    createSanction,
    getTypeSanction
} from "../../../services/api"

// Store Module
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleFinance from "@/store/finance/moduleFinance.js"

export default {
    props: ['member'],
    data() {
        return {
            popupActivo4: false,
            popupActive1: false,
            popupActive2: false,
            moneyisDesable: true,

            compte: '',
            sanction: '',
            montant: 0,
            motif: '',
            typeSanctions: [],
            devise: '',
            itemsPerPage: 10,
            isMounted: false,

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,
        }
    },
    computed: {
        operationsData() {
            var data = []
            data = this.$store.state.association.operations
            let transactions = []
            if (data.length > 0) {
                data.forEach(element => {
                    if (element.operations.length > 0) {
                        element.operations.forEach(operation => {

                            // Afficher la liste des operations du membre connecté uniquement lorsque
                            // la visibilité financière de l'association est restreinte
                            if (this.member.id == operation.membre_id && operation.debit_credit == 'credit') {
                                if (operation.transactions.length > 0) {
                                    transactions.push({
                                        id: operation.id,
                                        membre: element.membre,
                                        membre_id: operation.membre_id,
                                        date_versement: operation.date_realisation,
                                        montant: operation.montant,
                                        debit_credit: operation.debit_credit,
                                        num_recu: operation.num_recu,
                                        etat: operation.etat,
                                        date_creation: operation.transactions[0].date_created,
                                        mode: payment_mod.reduce((a, o) => o.value == operation.mode ? a.concat(this.$t(o.i18n)) : a, ''),
                                        mod: operation.mode,
                                        preuve: operation.preuve,
                                        commentaire: operation.commentaire,
                                        transactions: operation.transactions,
                                    })
                                }
                            }
                        })
                    }
                });
            }
            return transactions
        },

        selectSanctionOptions() {
            let sanctions = []
            if (this.typeSanctions != null) {
                this.typeSanctions.forEach(sanction => {
                    if (sanction.nom != 'Retard' && sanction.nom != 'Absence')
                        sanctions.push({
                            id: sanction.id,
                            text: sanction.nom,
                            value: sanction.id,
                            montant: sanction.montant,
                            motif: sanction.description
                        })
                })
            }
            return sanctions
        },

        comptesData() {
            if (this.$store.state.association.user_accounts != null)
                return this.$store.state.association.user_accounts
            else
                return []
        },

        solde() {
            let data = this.comptesData
            var cpt = 0

            if (data.length > 0) {
                data.forEach(element => {
                    cpt += element.statistique.data.solde
                });
            }

            return cpt

        },

        dette() {
            let data = this.comptesData
            var cpt = 0

            if (data.length > 0) {
                data.forEach(element => {
                    cpt += element.statistique.data.dettes_acquitements + element.statistique.data.dettes_cotisations
                });
            }

            return cpt

        },

        avoir() {
            let data = this.comptesData
            var cpt = 0

            if (data.length > 0) {
                data.forEach(element => {
                    cpt += element.statistique.data.avoirs
                });
            }

            return cpt

        },

        currentPage() {
            if (this.isMounted) {
                if (this.$refs.table != undefined)
                    return this.$refs.table.currentx
                else return 1
            }
            return 0
        },
        queriedItems() {
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.operationsData.length
        },
    },

    components: {
        Money,
        vSelect
    },

    methods: {
        /* Situation financière */
        financialSituation() {
            //Les differents comptes de l'utilisateur
            let payload = {
                resourceUrl: '/api/member/' + this.member.id + '/comptes',
                commitAction: 'SET_USER_ACCOUNTS'
            }

            this.$store.dispatch("association/fetchMemberActivities", payload)
                .then(() => {})
                .catch((error) => {
                    window.console.error(error);
                })
        },

        changeMoney(sanction) {
            this.montant = sanction.montant
            this.motif = sanction.motif
        },

        /* Retourne les ags courantes */
        currentGms() {
            let ags = this.$store.state.association.ags
            return functions.prochaineAg(ags)
        },
        /* Enregistrer une sanction */
        save() {
            let association_courante = this.$store.state.association.currentAssociation
            let ag_courante = this.currentGms()

            this.openLoadingContained()
            createSanction({
                    assId: association_courante.id,
                    userId: this.member.id,
                    ags_id: ag_courante.id,
                    montant: this.montant,
                    commentaire: this.motif,
                    type: this.sanction.text
                })
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close("#button-loading > .con-vs-loading")
                    this.montant = 0
                    this.sanction = ''
                    this.motif = ''
                    this.popupActivo4 = false

                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('notifContent'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                })
                .catch(error => {
                    this.loader = true
                    this.$vs.loading.close("#button-loading > .con-vs-loading")

                    this.$vs.notify({
                        position: 'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                    //this.stopLoding('button-with-loading-sav-sanction')
                })
        },

        //Redirige vers la pages d'accueil côté administrateur
        redirectDetail(tr) {
            let association_courante = this.$store.state.association.currentAssociation
            let payload = {
                resourceUrl: "api/association/" + association_courante.id + "/activite/" + tr.activites_id,
                commitAction: 'SET_ACTIVITE',
            }

            this.$store.dispatch("activite/fetchAssociationactivite", payload)
                .then((res) => {
                    let activite = res.data.data

                    let route, activity_type = activite.type

                    switch (activity_type) {
                        case "Generique":
                            route = '/apps/activities/detailsGenericActivitie'
                            break;
                        case "caisse":
                            route = '/apps/activities/detailsGenericActivitie'
                            break;

                        case "Tontine":
                            route = '/apps/activities/detailsTontineActivitie'
                            break;

                        case "Evenement":
                            route = '/apps/activities/event/detail'
                            break;

                        case "Mutuelle":
                            route = '/apps/activities/detailsMutualActivitie'
                            break;
                        case "Solidarite":
                            route = '/apps/activities/solidarity/detail'
                            break;

                        default:
                            break;
                    }
                    localStorage.setItem('activite_parameter', JSON.stringify(activite))

                    this.$emit('isSidebarActiveLocal', false)
                    this.$router.push(route).catch(() => {})

                })
                .catch((error) => {
                    window.console.log.error(error)
                })
        },

        redirectDetailOperation() {
            this.$emit('isSidebarActiveLocal', false)
            this.$router.push('/association/administration/finances/history').catch(() => {})
        },


        /* Loading */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-loading",
                scale: 0.45
            });
        },

        //exporation du tableau en csv
        csvExport(arrData) {
            functions.csvExport(arrData)
        },

        exportPDF(arrData) {
            functions.exportPDF(arrData)
        },

        //exporation du tableau en csv
        exportExel(arrData) {
            functions.exportExel(arrData)
        },

    },

    created() {
        // if (!moduleFinance.isRegistered) {
        //     this.$store.registerModule('finance', moduleFinance)
        //     moduleFinance.isRegistered = true
        // }

        // if (!moduleMember.isRegistered) {
        //     this.$store.registerModule('member', moduleMember)
        //     moduleMember.isRegistered = true
        // }

        let association_courante = this.$store.state.association.currentAssociation
        getTypeSanction({
                assId: association_courante.id
            })
            .then((e) => {
                this.typeSanctions = e.data.data

                let payload = {
                    resourceUrl: '/api/association/' + association_courante.id + '/operations',
                    commitAction: 'SET_OPERATIONS'
                }

                this.$store.dispatch("association/fetchFinances", payload)
                    .then(() => {})
                    .catch((error) => {
                        window.console.error(error)
                    })
            })
            .catch(e => window.console.log(e))

        //Devise de l'association
        this.devise = association_courante.devise
    },

    mounted() {
        this.isMounted = true;
    }
}
</script>

<style lang="scss">
table {
    td {
        padding: 5px;
    }
}

.pop_up .vs-popup {
    width: 900px !important;
}
</style>
