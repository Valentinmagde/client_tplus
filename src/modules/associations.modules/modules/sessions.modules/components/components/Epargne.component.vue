<template>
<div id="data-list-list-view" class="data-list-container">
    <div class="ml-4 mr-4">
        <vx-card no-shadow class="mb-6 pb-6" :title="$t('creditParams')" />
    </div>

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
                            {{ (echeances.detail.montant_credit) | formatMoney(devise) }}
                        </p>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p :class="{redtextclass: echeances.detail.interet < 0}">
                            {{ (echeances.detail.interet) | formatMoney(devise) }}
                        </p>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p :class="{redtextclass: echeances.detail.montant_a_payer < 0}">
                            {{ (echeances.detail.montant_a_payer) | formatMoney(devise) }}
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
                            {{ (echeance.montant) | formatMoney(devise) }}
                        </p>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                        <p v-if="echeance.date_limite == 0" class="product-name">
                            {{$t('nextCycle')}}
                        </p>
                        <p v-else class="product-name">
                            {{ (echeance.date_limite) | dateTime }}
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

    <data-view @closeSidebar="toggleDataSidebar" :isSidebarActive="addNewDataSidebar" :data="emptyData">
        <h4 slot="title">{{ $t('creditParams')}}</h4>

        <template slot="component">
            <div>
                <!-- IMAGE WINDOW MODAL -->
                <div class="clearfix w-full pl-4">
                    <!-- COMPTE -->
                    <div class="vx-row ">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-5">
                                {{$t('account')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <p class="mt-5">{{multipleValue.username}}</p>
                        </div>
                    </div>

                    <!-- Date debut de la demande -->
                    <div class="vx-row ">
                        <div class="flex vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-5 inline-block">
                                {{$t('startDate')}}
                                <span>
                                    <ejs-tooltip ref="tooltip" :content="$t('requestForContribution')" position="bottom" class="mr-2 inline-block">
                                        <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
                                    </ejs-tooltip>
                                </span>:
                            </p>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <p class="mt-5">{{ (multipleValue.date_demande) | dateTime }}</p>
                        </div>
                    </div>

                    <!-- Montant -->
                    <div class="vx-row ">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-5 inline-block">
                                {{$t('Amount')}}
                                <span>
                                    <ejs-tooltip ref="tooltip" :content="$t('maximumBorrowingAmountConstraint')" position="bottom" class="mr-2 inline-block">
                                        <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
                                    </ejs-tooltip>
                                </span>:
                            </p>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <p class="mt-5">
                                <money v-model="multipleValue.montant" class="money-input mt-1 w-full" v-bind="money" />
                                <span class="text-danger text-sm" v-show="maximumAmount">{{$t('maximumBorrowingAmountConstraint')}}</span>
                            </p>
                        </div>
                    </div>

                    <!-- DATE DE RETRAIT -->
                    <div class="vx-row ">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-5 inline-block">
                                {{$t('Deadlines')}}
                                <span>
                                    <ejs-tooltip ref="tooltip" :content="$t('maximumNumberOfGeneralMeetings')" position="bottom" class="mr-2 inline-block">
                                        <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
                                    </ejs-tooltip>
                                </span>:
                            </p>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <p class="mt-5">
                                <vs-input type=number v-model="multipleValue.date_limite" class="w-full" step="1" min="0" @keydown="filterKey" />
                                <span class="text-danger text-sm" v-if="deadline">{{$t('valueMustBeLessThanMaximumReimbursement')}}</span>
                            </p>
                        </div>
                    </div>

                    <!-- Aperçu des échéances -->
                    <div class="vx-row justify-end">
                        <div class="vx-col sm:w-2/3 w-full">
                            <vs-button id="button-loading" class="mt-base pt-2 pb-2" color="#3EB2FB" :disabled="!formValidate" @click="apercuEcheance">
                                {{$t('previewSettlements')}}
                            </vs-button>
                        </div>
                    </div>
                </div>
            </div>

        </template>

        <vs-button ref="loadableButton" class="mr-6 vs-con-loading__container" id="button-with-loading-reject" type="border" color="danger" @click="() => {
              addNewDataSidebar=false;
              reject(objectToMap, 'button-with-loading-reject', 'danger')
            }">
            {{ $t('rejected')}}
        </vs-button>

        <vs-button ref="loadableButton" class="vs-con-loading__container" id="button-with-loading-validate" :disabled="!formValidate" @click="() => {
              addNewDataSidebar=false;
              accept(objectToMap, 'button-with-loading-validate', 'primary')}">
            {{ $t('Validate')}}
        </vs-button>

    </data-view>

    <div class="ml-4 mr-4">
        <vx-card v-if="!members.length" class="mb-base">
            <p>{{$t('noElementFound')}}</p>
        </vx-card>
    </div>

    <vs-table v-if="members.length" ref="table" pagination search :data="members" :max-items="itemsPerPage" class="mt-4 w-full">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

            <div class="flex flex-wrap-reverse items-center data-list-btn-container">

                <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                    <span class="mr-2">
                        {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ members.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : members.length }} of {{ queriedItems }}</span>
                    <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                </div>

            </div>
            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">

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
            <vs-th sort-key="firstName">{{$t('creditParams') | CAPITALIZE }}</vs-th>
            <vs-th sort-key="date_created">{{$t('members') | CAPITALIZE }} </vs-th>
            <vs-th sort-key="users"> {{$t('Amount') | CAPITALIZE }} </vs-th>
            <vs-th sort-key="users"> {{$t('state') | CAPITALIZE }} </vs-th>
            <!--<vs-th sort-key="order_status"> {{$t('mensualite') | CAPITALIZE }} </vs-th> -->
            <vs-th sort-key="order_status"> {{$t('actions') | CAPITALIZE }} </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].id">
                    <p class="product-name font-medium truncate"> {{ data[indextr].epargne }}</p>
                </vs-td>

                <vs-td :data="data[indextr].username">
                    <p class="product-name truncate"> {{ data[indextr].username }}</p>
                </vs-td>

                <vs-td :data="data[indextr].in">
                    <p class="product-name truncate" :class="{redtextclass: data[indextr].in < 0}">
                        {{ (data[indextr].in) | formatMoney(devise) }}
                    </p>

                </vs-td>

                <vs-td :data="data[indextr].state" class="text-left">
                    <!-- EN ATTENTE -->
                    <vx-tooltip v-if="data[indextr].state == 'EN_ATTENTE'" :text="$t('waiting')" position="bottom" class="inline-block text-left">
                        <vs-radio class="flex mb-1 items-center" color="warning" :vs-name="`${data[indextr].internalId}`">
                        </vs-radio>
                    </vx-tooltip>

                    <!-- EN COURS -->
                    <vx-tooltip v-if="data[indextr].state == 'EN_COURS'" :text="$t('inProgress')" position="bottom" class="inline-block text-left">
                        <vs-radio class="flex mb-1 items-center" color="#3383c8" :vs-name="`${data[indextr].internalId}`">
                        </vs-radio>
                    </vx-tooltip>

                    <!-- VALIDE -->
                    <vx-tooltip v-if="data[indextr].state == 'VALIDE'" :text="$t('cloturer')" position="bottom" class="inline-block">
                        <vs-radio class="flex mb-1 items-center" color="success" :vs-name="`${data[indextr].internalId}`">
                        </vs-radio>
                    </vx-tooltip>
                </vs-td>

                <vs-td :data="data[indextr]" class="whitespace-no-wrap">
                    <!-- Valider un credit -->
                    <vx-tooltip 
                        :text="$t('validate')" 
                        position="bottom" 
                        class="inline-block" 
                        v-if="data[indextr].state == 'EN_ATTENTE' && (roles.includes('Administrateur') || roles.includes('Financier'))">
                        <feather-icon @click.stop="() => {updateObjec(data[indextr]); addNewDataSidebar = true }" icon="CheckSquareIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" class="mr-2" />
                    </vx-tooltip>

                    <!-- clôturer un credit  -->
                    <!-- <vx-tooltip v-if="data[indextr].state == 'EN_COURS'" :text="$t('cloturer')" position="bottom" class="inline-block ml-2">
                        <vs-icon iconPack="streameline" icon="icon-login-lock"/>
                    </vx-tooltip> -->

                    <!-- Rejeter un credit -->
                    <vx-tooltip v-if="data[indextr].state == 'EN_ATTENTE'" :text="$t('reject')" position="bottom" class="inline-block">
                        <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"/>
                    </vx-tooltip>

                </vs-td>

            </vs-tr>
        </template>
    </vs-table>
    <div class="flex flex-wrapper mt-6 ml-4">
        <vs-button type="border" class="mr-6" id="button-loading" @click.native="previous(3)">{{$t('previous')}}</vs-button>
        <vs-button @click.native="next(5)">{{$t('next')}}</vs-button>
    </div>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

import {
    EventBus
} from '@/services/EventBus.js'

import sidebar from '../../services/mixins/sidebar'
import dataProprety from '../../services/mixins/data'


import {
    getCreditEnAttenteApi,
    postRejetCreditEnAttenteApi,
    postApprouveCreditEnAttenteApi,
    postUpdateCredit
} from '../../services/api'

const display = (e) => window.console.log(e)

export default {
    props: {
        roles: {
            required: true
        }
    },
    mixins: [sidebar, dataProprety],
    created() {
        //Loader
        EventBus.$emit('loader', true)
        this.devise = this.$store.state.association.currentAssociation.devise
        getCreditEnAttenteApi({
                assId: this.$store.state.association.currentAssociation.id,

            })
            .then(e => e.data.data)
            .then(e => e.map(e => ({
                creditId: e.id,
                membreId: e.membres_id,
                username: e.membre,
                epargne: e.activity_name,
                out: e.montant_restant,
                in: e.montant_credit,
                mutuelleId: e.mutuelles_id,
                activiteId: e.mutuelles_activites_id,
                state: e.etat,
                montant_restant: e.montant_restant,
                date_limite: e.date_limite,
                date_demande: e.date_demande,
                duree_pret: e.mutuelle.duree_pret,
                maximum_empruntable: e.mutuelle.maximum_empruntable,

                internalId: this.currentId++
            })))
            .then(e => {
                /* window.console.log(e) */
                this.members = [];
                e.forEach(element => {
                    if (element.state != 'ANNULE' &&
                        element.state != 'cloture' &&
                        element.state != 'REJETE') {
                        this.members.push(element)
                    }
                })
                //Loader
                EventBus.$emit('loader', false)
            })
            .catch(() =>
                //Loader
                EventBus.$emit('loader', false))

        this.devise = this.$store.state.association.currentAssociation.devise
    },

    computed: {
        //Date limite
        deadline() {
            if (parseInt(this.multipleValue.date_limite) > parseInt(this.multipleValue.duree_pret)) {
                return true
            } else return false
        },
        //Montant maximum
        maximumAmount() {
            if (parseInt(this.multipleValue.montant) > parseInt(this.multipleValue.maximum_empruntable)) {
                return true
            } else return false
        },

        validateForms() {
            return this.maximumAmount && this.deadline
        },

        formValidate() {
            return this.multipleValue.montant != '' &&
                this.multipleValue.date_limite != '' &&
                !this.maximumAmount &&
                !this.deadline
        }
    },
    methods: {
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
        openLoadingContained(id, background) {
            this.loader = false
            this.$vs.loading({
                background: background,
                color: this.colorLoading,
                container: `#${id}`,
                scale: 0.45
            });
        },

        /* Aperçu */
        apercuEcheance() {
            let payload = {
                resourceUrl: 'api/mutuelle/' + this.multipleValue.mutuelle_id + '/credit/preview/echeance',
                commitAction: 'SET_CREDIT',
                data: {
                    mutuelles_activites_id: this.multipleValue.activites_id,
                    membres_id: this.multipleValue.membre_id,
                    montant_credit: this.multipleValue.montant,
                    montant_restant: this.multipleValue.montant,
                    date_demande: this.multipleValue.date_demande,
                    date_limite: this.multipleValue.date_limite
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

        updateObjec(data) {
            this.objectToMap = data
            this.multipleValue = {
                username: data.username,
                montant: data.in,
                date_demande: data.date_demande,
                date_limite: data.date_limite,
                mensualite: data.out,
                mutuelle_id: data.mutuelleId,
                activites_id: data.activiteId,
                membre_id: data.membreId,
                duree_pret: data.duree_pret,
                maximum_empruntable: data.maximum_empruntable
            }
        },

        accept(id, idLoder, background) {
            /* display('accept')
            window.console.log(this.objectToMap) */

            this.openLoadingContained(idLoder, background)
            /* Mettre à jour un credit */
            postUpdateCredit({
                    activites_id: id.activiteId,
                    mutuelle_id: id.mutuelleId,
                    credit_id: id.creditId,
                    data: {
                        membres_id: id.membreId,
                        mutuelles_id: id.mutuelleId,
                        mutuelles_activites_id: id.activiteId,
                        date_demande: this.objectToMap.date_demande,
                        etat: "EN_ATTENTE",
                        echeance: null,
                        montant_credit: this.multipleValue.montant,
                        montant_restant: this.multipleValue.montant,
                        date_limite: this.multipleValue.date_limite,
                        membre: id.username,
                        activity_name: id.epargne
                    }
                })
                .then(() => {
                    postApprouveCreditEnAttenteApi({
                            creditId: id.creditId
                        })
                        .then(e => {
                            this.loader = true
                            this.$vs.loading.close(`#${idLoder} > .con-vs-loading`)
                            this.$vs.notify({
                                position: 'top-center',

                                text: this.$t('notifContent'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'success'
                            })
                            id.state = 'VALIDE'
                            id.in = this.multipleValue.montant
                            this.resetObjectToMap()
                            display(e)
                            this.addNewDataSidebar = false
                        }).catch(e => {
                            this.loader = true
                            this.$vs.loading.close(`#${idLoder} > .con-vs-loading`)
                            display(e);
                            this.addNewDataSidebar = false
                        })
                })
                .catch(e => {
                    this.loader = true
                    this.$vs.loading.close(`#${idLoder} > .con-vs-loading`)
                    display(e);
                    this.addNewDataSidebar = false;
                    this.resetObjectToMap()
                })
        },
        reject(id, idLoder, background) {
            this.openLoadingContained(idLoder, background)
            display(id)
            postRejetCreditEnAttenteApi({
                    activiteId: id.activiteId,
                    creditId: id.creditId
                })
                .then(e => {
                    this.loader = true
                    this.$vs.loading.close(`#${idLoder} > .con-vs-loading`)
                    display(e)
                    this.members = this.members.filter(e => e.internalId != id.internalId)
                    this.$vs.notify({
                        position: 'top-center',
                        title: 'warning',
                        text: this.$t('notifContent'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'warning'
                    })
                    this.resetObjectToMap()
                })
                .catch(e => {
                    this.loader = true
                    this.$vs.loading.close(`#${idLoder} > .con-vs-loading`)
                    display(e);
                    this.resetObjectToMap()
                })

        },
        openPopup(item) {
            this.objectToMap = item
        },
        resetObjectToMap() {
            this.objectToMap = ''
            this.multipleValue = {
                montant: 0,
                date_limite: '',
                date_demande: '',
                mensualite: 0,
                username: ''
            }
        },
        toggleDataSidebarDetails() {
            this.addNewDataSidebarDetails = !this.addNewDataSidebarDetails
        }
    },
    components: {
        flatPickr,
        Money,
    },
    data: () => ({
        itemsPerPage: 10,
        popupReject: false,
        popupApprouve: false,
        objectToMap: '',
        addNewDataSidebarDetails: false,
        currentId: 1,
        money: {
            decimal: ',',
            thousands: '.',
            precision: 2,
            masked: false /* doesn't work with directive */
        },
        multipleValue: {
            montant: 0,
            date_limite: '',
            date_demande: '',
            mensualite: 0,
            username: ''
        },
        devise: '',
        members: [],
        echeances: null,
        popupActivo2: false,

        /* Loading */
        backgroundLoading: 'primary',
        backgroundLoadingReject: 'danger',
        colorLoading: '#fff',
        loader: true,
    }),
    filters: {
        pattern: function (num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        }
    },

}
</script>

<style>
.text-center .vs-input--input.normal {
    text-align: center !important;
}

/* .vs-table--content {
        width: 100%;
        overflow: auto;
        margin-top: -13px;
    } */
.allocate-btn {
    padding-top: 3px !important;
    padding-bottom: 3px !important;
}

.disabled {
    pointer-events: none;
    color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: #eef1f6;
    border-color: #d1dbe5;
}
</style>
