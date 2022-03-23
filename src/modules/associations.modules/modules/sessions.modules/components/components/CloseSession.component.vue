<template>
<div>
    <div>
        <div class="ml-5 mr-5">
            <vx-card no-shadow class="mb-base pb-base" :title="$t('closeSession')">
            </vx-card>
            <!--  <vx-card no-shadow class="mb-base">
                    <p>{{$t('noElementFound')}}</p>
                </vx-card> -->
        </div>
    </div>

    <!-- FORMULAIRE DE VALIDATIION D'UNE OPERATION-->
    <data-view v-if="formIsActiveted" @closeSidebar="toggleDataSidebar" :isSidebarActive="addNewDataSidebar" :data="emptyData">
        <h4 slot="title">{{$t('paymentsPendingValidation')}}</h4>

        <template slot="component">
            <operation-tag @child:validate="(fn) => fnValidate = fn" @child:reject="(fn) => fnReject = fn" :toggleDataSidebar="toggleDataSidebar" />
        </template>

        <vs-button class="mr-6" type="border" color="danger" @click="rejectOperation">{{ $t('reject')}}</vs-button>
        <vs-button id="button-with-loading-sav-sanction" @click="validitateOperation">{{ $t('Validate')}}</vs-button>
    </data-view>

    <!-- Versement en séance-->
    <data-view v-if="membre_id" @closeSidebar="toggleDataSidebarDetail" :isSidebarActive="addNewDataSidebarDetail" :data="emptyData">
        <h4 slot="title">{{$t('sessionPayments') | CAPITALIZE }}</h4>

        <template slot="component">
            <versement-seance @child:validate="(fn) => fnValidate = fn" @request:status="requestStatus" :toggleDataSidebarDetail="toggleDataSidebarDetail" :current_member="membre_id" />
        </template>

        <vs-button class="mr-6" type="border" color="danger" @click="addNewDataSidebarDetail=false">{{ $t('close')}}</vs-button>

        <vs-button id="button-with-loading-sav-sanction" @click="effectuerVersement">{{ $t('Validate')}}</vs-button>
    </data-view>

    <!-- Detail operation -->
    <data-view @closeSidebar="toggleDataSidebar" :isSidebarActive="addNewDataSidebar" :data="emptyData">
        <h4 slot="title">{{ $t('detailOfTransaction') }}</h4>

        <template slot="component" scroll>

            <div class="ep-association pb-12">
                <!-- IMAGE WINDOW MODAL -->
                <div id="myModal" class="modal">
                    <span class="close">&times;</span>
                    <img class="modal-content" id="img01">
                    <div id="caption"></div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <!-- OPERATION -->
                        <table class="w-full border-collapse">
                            <tr>
                                <td>{{$t('account')}}</td>
                                <td>{{ objectToMap.username}}</td>
                            </tr>
                            <tr>
                                <td>{{$t('montantAttendu')}}</td>
                                <td :class="{redtextclass: objectToMap.in < 0}">
                                    {{ (objectToMap.in) | formatMoney(devise) }}
                                </td>
                            </tr>

                            <tr>
                                <td>{{$t('montantRealise')}}</td>
                                <td :class="{redtextclass: objectToMap.out < 0}">
                                    {{ (objectToMap.out) | formatMoney(devise) }}
                                </td>
                            </tr>
                        </table>

                        <!-- TRANSACTION -->
                        <h5 class="mt-5 mb-4" v-if="objectToMap.transactions && objectToMap.transactions.length">{{$t('transactions')}}</h5>
                        <table class="w-full border-collapse" v-if="objectToMap.transactions && objectToMap.transactions.length">
                            <thead>
                                <tr>
                                    <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('activities') }} </th>
                                    <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('Amount') }} </th>
                                    <th class="w-1/2 px-4 py-2 text-base th-bg">Date </th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr :key="indextr" v-for="(transaction, indextr) in objectToMap.transactions">
                                    <td class="w-1/2 px-4 py-2 text-base">
                                        <p>{{transaction.activite.nom}}</p>
                                    </td>
                                    <td class="w-1/2 px-4 py-2 text-base">
                                        <span>
                                            <p class="product-name font-medium truncate">{{transaction.montant}}/{{transaction.montant_attendu}}</p>
                                        </span>
                                    </td>
                                    <td class="w-1/2 px-4 py-2 text-base">
                                        <span>
                                            <p class="product-name font-medium truncate">{{ (transaction.date_created) | dateTime }}</p>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>

        <vs-button class="mr-6" type="border" color="success" @click="() => { addNewDataSidebar=false}">{{ $t('close')}}</vs-button>

    </data-view>

    <div class="flex ml-5">
        <vs-button type="border" class="mr-6" id="button-loading" @click.native="previous(6)">{{$t('previous')}}
        </vs-button>

        <vs-button class="ml-3 vs-con-loading__container" ref="loadableButton" id="button-with-loading" @click.native="cloturerAg" :disabled="!loader">
            {{$t('closeSession')}}
        </vs-button>
    </div>
</div>
</template>

<script>
import {
    payment_mod
} from '../../services/data/paymentMod.js'
import sidebar from '../../services/mixins/sidebar'
import dataProprety from '../../services/mixins/data'
import OperationTag from './ValidateOperation.component'
import VersementSeance from './SessionPayment.component'

//Fonctions
import functions from '../../services/functions.js'
import {
    EventBus
} from '@/services/EventBus.js'
import {
    clotureAg,
    getAllFinantialAction,
    genererRapportAg
} from "../../services/api"

//Store
// import moduleFinance from "@/store/finance/moduleFinance.js"

export default {
    props: ['uuid', 'assId', 'roles', 'isCurrentAg'],
    mixins: [sidebar, dataProprety],
    data() {
        return {
            devise: '',
            itemsPerPage: 10,

            formIsActiveted: false,
            membre_id: null,
            members: [],
            objectToMap: '',

            /* Loader */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true
        }
    },
    components: {
        OperationTag,
        VersementSeance
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
                            if (operation.etat == "EN_ATTENTE" && operation.debit_credit == 'credit') {
                                transactions.push({
                                    id: operation.id,
                                    membre: element.membre,
                                    membre_id: operation.membre_id,
                                    date_versement: operation.date_realisation,
                                    montant: operation.montant,
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
                        })
                    }
                });
            }
            return transactions
        },
        currentPage() {
            if (this.isMounted && this.$refs.table != undefined) {
                return this.$refs.table.currentx
            }
            return 1
        },
        queriedItems() {
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.tresoreriesData.length
        },
    },
    methods: {
        //exporation du tableau en csv
        csvExport(arrData) {
            functions.csvExportTresorerie(arrData)
        },

        exportPDF(arrData) {
            functions.exportPDFTresorerie(arrData)
        },

        //exporation du tableau en csv
        exportExel(arrData) {
            functions.exportExelTresorerie(arrData)
        },

        //Rediriger vers la page de validation
        redirectValidate(operation) {
          this.$store.commit('association/SET_OPERATION', operation)
        },

        /* Valider une operation */
        validitateOperation() {
            this.fnValidate()
        },

        effectuerVersement() {
            this.fnValidate(this.membre_id.membre_id)
        },

        /* Rejeter une operation */
        rejectOperation() {
            this.fnReject()
        },

        process() {
            this.startLoding('id-button')
        },
        //loturer une ag
        cloturerAg() {

            EventBus.$emit('loader', true)
            this.openLoadingContained()

            genererRapportAg({
                    assId: this.assId,
                    agId: this.uuid,
                })
                .then(() => {
                    clotureAg({
                            agId: this.uuid,
                        })
                        .then(() => {
                            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                            this.loader = true

                            this.$vs.notify({
                                position: 'top-center',
                                text: this.$t('notifContent'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'success'
                            })
                        })
                        .then(() => EventBus.$emit('loader', false))
                        .then(() => this.$router.push('/association/administration/sessions'))
                        .catch((error) => {
                            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                            this.loader = true
                            EventBus.$emit('loader', false)
                            window.console.error(error)
                        })
                })
                .catch((error) => {
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.loader = true
                    window.console.error(error)
                    EventBus.$emit('loader', false)
                })
        },

        requestStatus(val) {
            if (val.status)
                getAllFinantialAction({
                    assId: this.$store.state.association.currentAssociation.id,
                    agId: this.uuid
                })
                .then(e => e.data.data)
                .then(e => {
                    const newData = e.map(e => ({
                            id: this.internalId++,
                            username: e.membre,
                            membre_id: e.membres_id,
                            in: e.montant_attendu,
                            out: e.montant_realise,
                            transactions: e.transactions
                        }))
                        .filter(e => e.in > e.out)

                    this.$vs.notify({
                        position: 'top-center',

                        text: this.$t('operationSuccess'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    this.members = newData
                    //Loader
                    EventBus.$emit('loader', false)
                })
                .catch(() => //Loader
                    EventBus.$emit('loader', false))

            else {
                this.$vs.notify({
                    position: 'top-center',
                    text: val.msg,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })

                //Loader
                EventBus.$emit('loader', false)
            }

        },

        toggleDataSidebarDetail() {
            this.addNewDataSidebarDetail = !this.addNewDataSidebarDetail
        },

        /* Loading */
        openLoadingContained() {
            this.loader = false,
                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading",
                    scale: 0.45
                });
        },
    },
    created() {
        EventBus.$emit('loader', true)
        var association_courante = this.$store.state.association.currentAssociation

        let payload = {
            resourceUrl: '/api/association/' + association_courante.id + '/operations',
            commitAction: 'SET_OPERATIONS'
        }

        this.$store.dispatch("association/fetchFinances", payload)
            .then(() => {
                EventBus.$emit('loader', false)
            })
            .catch((error) => {
                EventBus.$emit('loader', false)
                window.console.log(error)
            })

        //Liste des réalisations financières
        getAllFinantialAction({
                assId: this.$store.state.association.currentAssociation.id,
                agId: this.uuid
            })
            .then(e => e.data.data)
            .then(e => {
                const newData = e.map(e => ({
                        id: this.internalId++,
                        username: e.membre,
                        membre_id: e.membres_id,
                        in: e.montant_attendu,
                        out: e.montant_realise,
                        transactions: e.transactions
                    }))
                    .filter(e => e.in > e.out)
                this.members = newData
                //Loader
                EventBus.$emit('loader', false)
            })
            .catch(() => //Loader
                EventBus.$emit('loader', false)
            )

        this.devise = association_courante.devise
    },
    mounted() {
        this.isMounted = true;
    }
}
</script>
