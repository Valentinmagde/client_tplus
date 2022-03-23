<template>
    <div id="data-list-list-view" class="data-list-container">
        <div class="ml-4 mr-4">
            <vx-card no-shadow class="mb-6 pb-6" :title="$t('recordingCreditsInProgress') | CAPITALIZE "/>

            <div v-if="creditsData.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
                <!-- ADD NEW -->
                <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                    @click.stop="addNewData('EmpruntEnCours')">
                    <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
                    <span class="ml-2 text-base text-primary">{{$t('saveCredit')}}</span>
                </div>
            </div>
            <vx-card no-shadow v-if="creditsData.length == 0" class="mb-base">
                <p>{{$t('noElementFound')}}</p>
            </vx-card>
        </div>

        <!-- Popup pour supprimer un credit-->
        <vs-popup classContent="popup-example"  :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
        <p>{{$t('deleteConfirm')}}</p>
        <vs-divider/>
        <div class="vx-row w-full justify-end">
            <vs-button
                color="warning"
                @click="popupActivo2=false"
                type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button
                class="ml-3 vs-con-loading__container"
                color="danger" ref="loadableButton"
                id="button-with-loading"
                :disabled="!loader"
                @click.stop="deleteItem(credit_selectionne)">
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
            :activity="activite"
            :mutual="mutuelle"
        />
        <vs-table v-if="creditsData.length > 0" ref="table" pagination search :data="creditsData" :max-items="itemsPerPage" class="table mt-4 w-full">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                    <!-- ADD NEW -->
                    <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                        @click.stop="addNewData('EmpruntEnCours')">
                        <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
                        <span class="ml-2 text-base text-primary">{{$t('saveCredit')}}</span>
                    </div>
                </div>
                <!-- ITEMS PER PAGE -->
                <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                    <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ creditsData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : creditsData.length }} of {{ queriedItems }}</span>
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
                <vs-th sort-key="members">{{$t('members') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="credit_amount">{{$t('creditAmount') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="remaining_amount">{{$t('remainingAmount') | CAPITALIZE }}</vs-th>
                <!-- <vs-th sort-key="settlement">{{$t('Deadlines') | CAPITALIZE }} </vs-th> -->
                <vs-th sort-key="action"> {{$t('actions') | CAPITALIZE }} </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr v-for="(tr, index) in data" :key="index">
                    <vs-td>
                        <p class="product-name font-medium truncate">{{tr.membre}}</p>
                    </vs-td>
                    <vs-td>
                        <p :class="{redtextclass: tr.montant_credit < 0}">
                            {{ (tr.montant_credit) | formatMoney(devise) }}
                        </p>
                    </vs-td>
                    <vs-td>
                        <p :class="{redtextclass: tr.montant_restant < 0}">
                            {{ (tr.montant_restant) | formatMoney(devise) }}
                        </p>
                    </vs-td>
                    <!-- <vs-td>
                        <p> {{date(deadline(tr.date_demande, tr.date_limite))}} </p>
                    </vs-td> -->

                    <vs-td>
                        <vx-tooltip :text="$t('delete')" position="bottom" class="inline-block">
                            <feather-icon  icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"  class="ml-2" @click.stop="popupActivo2=true; credit_selectionne=tr.id"/>
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
            credit_selectionne: '',

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            etat: '',
            membres: [],
            membre_inscris: [],
            activite: null,
            mutuelle: null,

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
        creditsData(){
            let credits = this.$store.state.association.credits
            let data = []

            if(credits.length > 0){
                credits.forEach(element=>{
                    if(element.etat != 'REJETE'){
                        data.push(element)
                    }
                })
            }
            return data
        },

        comptesData(){
            let comptes = this.$store.state.association.accounts

            var data = []
            comptes.forEach((value)=>{
                data.push(
                    {
                        id: value.membres_id,
                        membre: value.membre,
                        id_compte: value.id,
                        solde: value.solde ? value.solde: 0.00,
                        dette_a: value.dette_a ? value.dette_a: 0.00,
                        dette_c: value.dette_c ? value.dette_c: 0.00,
                        avoir: value.avoir ? value.avoir : 0.00
                    }

                )
            })

            return data
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
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.creditsData.length
        }
    },
    methods: {
        previous(){
          this.$emit('selectedTab', 2)
        },

        next(){
          this.$emit('selectedTab', 4)
        },

        //Date limite
        deadline(start_date, number){
            let ags = this.$store.state.association.ags
            let start = ags.find(e=> e.date_ag == start_date)

            var index = ags.indexOf(start)

            window.console.log(index)

            if(index + number >= ags.length){
                return ags[ags.length-1].date_ag
            }
            else{
                return ags[index+number].date_ag
            }
        },

        addNewData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.membres = this.membre_inscris
            this.activite = this.activity
            this.mutuelle =  this.activity.Mutuelle
            this.toggleDataSidebar(true)
        },
        //Suppression d'un credit
        deleteItem(id) {
            this.openLoadingContained()
            let activite_courante =  this.activity !== '' ? this.activity : this.$store.state.association.activite;

            let payload = {
                resourceUrl: 'api/activite/'+activite_courante.id+'/credit/'+id+'/delete/pending',
                commitAction: 'NO_COMMIT'
            }

            this.$store.dispatch("association/removeRecord", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.popupActivo2 = false
                this.$vs.notify({
                        position:'top-center',

                        text: this.$t('creditSuccessfullyDeleted'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                })
                /* Page loader */
                EventBus.$emit('loader', true)
                let epargne_courant = this.activity !== '' ? this.activity.Mutuelle : this.$store.state.association.activite.Mutuelle;
                //Recupperer tous les credits de l'activité
                let payload = {
                    resourceUrl: 'api/mutuelle/'+epargne_courant.id+'/credits',
                    commitAction: 'SET_CREDITS'
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
        if(localStorage.getItem('activity_id') !== null){

            var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

            let payload = {
                resourceUrl: '/api/activite/'+activite_courante.id+'/comptes/all',
                commitAction: 'SET_ACCOUNTS'
            }

            this.$store.dispatch("association/fetchComptemembreActivite", payload)
            .then((res) => {
                this.membre_inscris = res.data.data
                /* this.memberCompte = res.data.data */

                let epargne_courant = this.activity !== '' ? this.activity.Mutuelle : this.$store.state.association.activite.Mutuelle;
                //Recupperer tous les credits de l'activité
                let payload = {
                  resourceUrl: 'api/mutuelle/'+epargne_courant.id+'/credits',
                  commitAction: 'SET_CREDITS'
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
                EventBus.$emit('loader', false)
                window.console.error(error)
            })

            let association_courante = this.$store.state.association.currentAssociation

            //Recupperation de la devise de l'association
            this.devise = association_courante.devise
        }
        else{
            EventBus.$emit('loader', false)
        }
    },
    mounted(){
        if(localStorage.getItem('activite_creee') !== null){
            var activite_courante = JSON.parse(localStorage.getItem('activite_creee'))

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
