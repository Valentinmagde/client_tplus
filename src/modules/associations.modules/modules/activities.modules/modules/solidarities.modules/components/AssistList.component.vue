<template>
<div v-if="isReady" id="data-list-list-view" class="data-list-container">
    <!-- Popup pour supprimer un membre -->
    <vs-popup classContent="popup-example" :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
        <p>{{$t('deleteConfirm')}}</p>
        <vs-divider />
        <div class="vx-row w-full justify-end">
            <vs-button color="warning" @click="popupActivo2=false" type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button class="ml-3 vs-con-loading__container" color="danger" ref="loadableButton" id="button-with-loading" :disabled="!loader" @click.stop="deleteItem(assistance_selectionne)">
                {{$t('delete')}}
            </vs-button>
        </div>
    </vs-popup>

    <Data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" :etat="etat" />
    <div class="ml-5 mr-5">
        <vx-card no-shadow class="mb-6 pb-6" :title="$t('recordingOfPastAssistance')" />
        <div v-if="assistancesData.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
            <!-- ADD NEW -->
            <div v-if="admin" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary" 
                @click.stop="addNewData('AjoutTypeAssistancePassee')">
                <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                <span class="ml-2 text-base text-primary">{{$t('newAssistance')}}</span>
            </div>
        </div>

        <vx-card no-shadow v-if="assistancesData.length == 0">
            <p>{{$t('noElementFound')}}</p>
        </vx-card>
    </div>
    <!-- Tableau des assistances passées -->
    <vs-table v-show="assistancesData.length > 0" ref="table" :data="assistancesData" pagination :max-items="itemsPerPage" search>
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
            <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                <!-- ADD NEW -->
                <div v-if="admin" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary" 
                    @click.stop="addNewData('AjoutTypeAssistancePassee')">
                    <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                    <span class="ml-2 text-base text-primary">{{$t('newAssistance')}}</span>
                </div>
            </div>
            <!-- ITEMS PER PAGE -->
            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                    <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ assistancesData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : assistancesData.length }} of {{ queriedItems }}</span>
                    <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                </div>
                <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
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
            <vs-th>{{ $t('name') | CAPITALIZE }}</vs-th>
            <vs-th>{{ $t('Amount') | CAPITALIZE }}</vs-th>
            <!-- <vs-th>{{ $t('eventDate') | CAPITALIZE }} </vs-th> -->
            <vs-th>{{ $t('state') | CAPITALIZE }} </vs-th>
            <vs-th>{{ $t('actions') | CAPITALIZE }} </vs-th>
        </template>

        <template slot-scope="{data}">
            <vs-tr :key="ind" v-for="(tr, ind) in data">
                <vs-td>
                    <p class="product-name font-medium truncate">
                        {{ tr.membre}}
                    </p>
                </vs-td>

                <vs-td>
                    <p class="product-name" :class="{redtextclass: tr.montant_alloue < 0}">
                        {{ (tr.montant_alloue) | formatMoney(devise) }}
                    </p>
                </vs-td>

                <vs-td>
                    <p v-if="tr.etat=='init'" class="product-price">
                        <vs-chip>{{$t('creation')}}</vs-chip>
                    </p>
                    <p v-if="tr.etat=='actif'" class="product-price">
                        <vs-chip color="success">{{$t('activate')}}</vs-chip>
                    </p>
                    <p v-if="tr.etat=='inactif'" class="product-price">
                        <vs-chip color="danger">{{$t('desactivate')}}</vs-chip>
                    </p>
                    <p v-if="tr.etat=='past'" class="product-price">
                        <vs-chip color="#626262">{{$t('past')}}</vs-chip>
                    </p>
                </vs-td>
                <vs-td>
                    <vx-tooltip v-if="admin" :text="$t('delete')" position="bottom" class="inline-block ml-2">
                        <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" @click.stop="popupActivo2=true; assistance_selectionne=tr.id" />
                    </vx-tooltip>
                </vs-td>
            </vs-tr>

        </template>

    </vs-table>

    <div class="flex flex-wrapper mt-6 ml-4">
        <vs-button type="border" class="mr-6" id="button-loading" @click.native="previous">{{$t('previous')}}</vs-button>
        <vs-button @click.native="next">{{$t('next')}}</vs-button>
    </div>
</div>
</template>

<script>
import DataViewSidebar from '../../../../../components/sidebar/DataViewSidebar.component.vue'

//Fonctions
import ActionButton from '../components/ActionButton.component'

import {
    EventBus
} from '@/services/EventBus.js'

import checkIfAdmin  from '../../../../../mixins/checkRole'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

export default {
    mixins: [checkIfAdmin],
    props: ['activity','selectactivitie'],
    data() {
        return {
            member: {},
            members: [],
            active: false,
            addNewDataSidebar: false,
            sidebarData: {},
            etat: '',
            generic_selectionne: '',
            generic: {},
            popupActivo2: false,
            assistance_selectionne: '',
            itemsPerPage: 10,
            isMounted: false,
            devise: '',

            /* Loading */
            backgroundLoading: 'danger',
            colorLoading: '#fff',
            loader: true,

            isReady: false,
        }
    },
    components: {
        ActionButton,
        DataViewSidebar
    },
    computed: {
        admin() {
          return this.isSuperAdministrator;
        },
        assistancesData() {
            return this.$store.state.association.assistances
        },
        currentPage() {
            if(this.isMounted) {
                if(this.$refs.table != undefined)
                    return this.$refs.table.currentx
                else return 1
            }
            return 0
        },
        queriedItems() {
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.assistancesData.length
        }
    },
    methods: {
        previous() {
            this.$emit('selectedTab', 2)
        },
        next() {
            this.$emit('selectedTab', 4)
        },

        addNewData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.toggleDataSidebar(true)
        },

        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        },

        deleteItem(id) {
            this.openLoadingContained()
            let payload = {
                resourceUrl: '/api/assistance/' + id + '/delete',
                commitAction: 'NO_COMMIT',
                memberId: id
            }

            this.$store.dispatch("association/removeRecord", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.popupActivo2 = false
                    this.$vs.notify({
                        position: 'top-center',

                        text: this.$t('assistanceSuccessfullyRemoved'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    /* Page loader */
                    EventBus.$emit('loader', true)
                    let activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite
                    let payload = {
                        resourceUrl: 'api/activite/' + activite_courante.id + '/assistances',
                        commitAction: 'SET_ASSISTANCES'
                    }
                    this.$store.dispatch("association/fetchAssociationactivite", payload)
                        .then(() => {
                            /* Page loader */
                            EventBus.$emit('loader', false)
                            let association_courante = this.$store.state.association.currentAssociation
                            let payload = {
                                resourceUrl: "api/association/" + association_courante.id + "/activite",
                                commitAction: 'SET_ACTIVITES',
                            }

                            this.$store.dispatch("association/fetchAssociationactivite", payload)
                                .catch((error) => {
                                    window.console.error(error)
                                })
                        })
                        .catch(err => {
                            /* Page loader */
                            EventBus.$emit('loader', false)
                            window.console.error(err)
                        })
                })
                .catch(err => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    window.console.error(err)
                })
        },

        /* Loading */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            });
        },
    },
    created() {
        EventBus.$emit('loader', true);
        var current_association = this.$store.state.association.currentAssociation

        if (localStorage.getItem('activity_id') !== null) {
            var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite

            let payload = {
                resourceUrl: 'api/activite/' + activite_courante.id + '/assistances',
                commitAction: 'SET_ASSISTANCES'
            }
            this.$store.dispatch('association/fetchAssociationactivite', payload)
                .then(() => {
                    this.isReady = true; EventBus.$emit('loader', false);
                })
                .catch((error) => {
                    window.console.error(error); this.isReady = true;
                })
        }
        else {
          this.isReady = true;
          EventBus.$emit('loader', false);
        }

        //Devise de l'association
        this.devise = current_association.devise
    },
    mounted() {
        this.isMounted = true;
    }
}
</script>
