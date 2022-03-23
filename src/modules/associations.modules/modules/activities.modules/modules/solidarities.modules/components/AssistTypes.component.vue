<template>
    <div id="data-list-list-view" class="data-list-container">
        <div class="ml-4 mr-4">
            <vx-card no-shadow class="mb-6 pb-6" :title="$t('recordingOfAssistanceTypes')"/>

            <div v-if="typesAssistancesData.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
                <!-- ADD NEW -->
                <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                    @click.stop="addNewData('AjoutTypeAssistance')">
                    <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
                    <span class="ml-2 text-base text-primary">{{$t('newType')}}</span>
                </div>
            </div>
            <vx-card v-if="typesAssistancesData.length == 0" class="mb-base">
                <p>{{$t('noElementFound')}}</p>
            </vx-card>
        </div>

        <!-- Popup pour supprimer un membre -->
        <vs-popup classContent="popup-example"  :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
        <p>{{$t('deleteConfirm')}}</p>
        <vs-divider/>
        <div class="vx-row w-full justify-end">
            <vs-button
                color="warning"
                @click.native="popupActivo2=false"
                type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button
                class="ml-3 vs-con-loading__container"
                color="danger" ref="loadableButton"
                id="button-with-loading"
                :disabled="!loader"
                @click.stop="deleteItem(type_assistance_selectionne)">
                {{$t('delete')}}
            </vs-button>
        </div>
        </vs-popup>

        <Data-view-sidebar
            :isSidebarActive="addNewDataSidebar"
            @closeSidebar="toggleDataSidebar"
            :data="sidebarData"
            :etat="etat"
            :members="membres"
        />

        <vs-table v-if="typesAssistancesData.length > 0" ref="table" pagination search :data="typesAssistancesData" :max-items="itemsPerPage" class="table mt-4 w-full">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                    <!-- ADD NEW -->
                    <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                        @click.stop="addNewData('AjoutTypeAssistance')">
                        <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
                        <span class="ml-2 text-base text-primary">{{$t('newType')}}</span>
                    </div>
                </div>
                <!-- ITEMS PER PAGE -->
                <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                    <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ typesAssistancesData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : typesAssistancesData.length }} of {{ queriedItems }}</span>
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
                <vs-th sort-key="name">{{$t('name') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="type">{{$t('type') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="description">{{$t('description') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="amount">{{$t('Amount') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="max">{{$t('maximumAssistance') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="max_cycle"> {{$t('maximumAssistancePerCycle') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="action"> {{$t('actions') | CAPITALIZE }} </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr v-for="(tr, index) in data" :key="index">
                    <vs-td>
                        <p class="product-name font-medium truncate">{{tr.nom}}</p>
                    </vs-td>
                    <vs-td>
                        <p class="product-name truncate">{{afficheTypeAssistance(tr.type)}}</p>
                    </vs-td>
                    <vs-td>
                        <p> {{tr.description}}</p>
                    </vs-td>
                    <vs-td>
                        <p :class="{redtextclass: tr.montant < 0}">
                            {{ tr.montant | formatMoney(devise) }}
                        </p>
                    </vs-td>
                    <vs-td>
                        <p> {{tr.max}} </p>
                    </vs-td>

                    <vs-td>
                        <p> {{tr.max_cycle}} </p>
                    </vs-td>

                    <vs-td>
                        <vx-tooltip :text="$t('delete')" position="bottom" class="inline-block">
                            <feather-icon  icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                            class="ml-2" @click.stop="popupActivo2=true; type_assistance_selectionne=tr.id"/>
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
import {Money} from 'v-money'
import vSelect from 'vue-select'
import DataViewSidebar from '../../../../../components/sidebar/DataViewSidebar.component.vue'
import { categorie } from "../../../../../services/data/news-categories.js"

// Functions
import { EventBus } from  '@/services/EventBus.js'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    props: ['activity'],
    data(){
        return{
            selected: [],
            update_compte: [],
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            nom_activite: '',
            itemsPerPage: 10,
            isMounted: false,
            popupActivo2:false,
            type_assistance_selectionne: '',

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            etat: '',
            membres: [],
            membre_inscris: [],
            devise: '',

            /* Loading */
            backgroundLoading:'danger',
            colorLoading:'#fff',
            loader: true
        }
    },
    components:{
        Money,
        vSelect,
        DataViewSidebar
    },
    computed: {
        typesAssistancesData(){
            return this.$store.state.association.types_assistances
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
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.typesAssistancesData.length
        }
    },
    methods: {
        //Affiche le type de l'assistant dans la langue en cours
        afficheTypeAssistance(type){
            const filtered = categorie.reduce((a, o) => o.value == type ? this.$t(a.concat(o.i18n)): a,'')

            if(filtered == '')
                return type
            else
                return filtered
        },

        previous(){
          this.$emit('selectedTab', 1)
        },
        next(){
          this.$emit('selectedTab', 3)
        },
        addNewData(etat) {

            this.etat = etat
            this.sidebarData = {}
            this.membres = this.membre_inscris
            this.toggleDataSidebar(true)
        },
        //Suppression d'un credit
        deleteItem(id) {
            this.openLoadingContained()
            let payload = {
                resourceUrl: 'api/assistance/type/'+id+'/delete',
                commitAction: 'NO_COMMIT'
            }

            this.$store.dispatch("association/removeRecord", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.popupActivo2 = false
                this.$vs.notify({
                        position:'top-center',

                        text: this.$t('itemSuccessfullyDeleted'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                })

                let association_courante = this.$store.state.association.currentAssociation

                /* Page loader */
                EventBus.$emit('loader', true)
                let payload = {
                    resourceUrl: "/api/association/"+association_courante.id+"/types/assistances",
                    commitAction: 'SET_TYPES_ASSISTANCES'
                }
                this.$store.dispatch("association/fetchAssociationactivite", payload)
                .then(()=>{
                    EventBus.$emit('loader', false)
                })
                .catch((error)=>{
                    EventBus.$emit('loader', false)
                    window.console.error(error)
                })
            })
            .catch((error)=>{
                this.loader = true
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.$vs.notify({
                    position:'top-center',
                    title: 'error',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
        },
        toggleDataSidebar(val=false) {
            this.addNewDataSidebar = val
        },

        /* Loading */
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

        let association_courante = this.$store.state.association.currentAssociation

        let payload = {
            resourceUrl: "/api/association/"+association_courante.id+"/types/assistances",
            commitAction: 'SET_TYPES_ASSISTANCES'
        }
        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .then(()=>{
            EventBus.$emit('loader', false)
        })
        .catch((error)=>{
            EventBus.$emit('loader', false)
            window.console.error(error)
        })

        //Recupperation de la devise de l'association
        this.devise = association_courante.devise
    },
    mounted(){
        if(localStorage.getItem('activity_id') !== null){
            var activite_courante = this.activity;

            this.nom_activite = activite_courante.nom.toUpperCase()
        }
        this.isMounted = true;
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
</style>
