<template>
    <div id="data-list-list-view" class="data-list-container">
        <!-- Popup pour supprimer une note -->
        <vs-popup classContent="popup-example" :title="$t('deleteConfirmTitle')" :active.sync="popupActivo1">
         <p>{{$t('deleteConfirm')}}</p>
          <vs-divider/>
          <div class="vx-row w-full justify-end">
              <vs-button
                color="warning"
                @click="popupActivo1=false"
                type="border">
                {{$t('cancel')}}
              </vs-button>&nbsp;&nbsp;

              <vs-button
                class="ml-3 vs-con-loading__container"
                color="danger" ref="loadableButton"
                id="button-with-loading" :disabled="!loader"
                @click.stop="deleteItem(note_selectionnee)">
                {{$t('delete')}}
              </vs-button>

          </div>
        </vs-popup>

        <!-- Détails note -->
        <vs-popup classContent="popup-example" :title="$t('note')" :active.sync="popupActivo2">
            <!-- Note -->
            <p class="text-justify">{{note}}</p>
            <vs-divider />
            <div class="vx-row w-full justify-end">
                <vs-button
                    color="#909396" 
                    class="ml-3 vs-con-loading__container" 
                    ref="loadableButton" 
                    id="button-loading" 
                    :disabled="!loader" 
                    @click="popupActivo2=false">
                    {{$t('close')}}
                </vs-button>
            </div>
        </vs-popup>

        <Data-view-sidebar
            :isSidebarActive="addNewDataSidebar"
            @closeSidebar="toggleDataSidebar"
            :data="sidebarData"
            :etat="etat"
            :activity="activite"
        />

        <action-button v-if="admin && activity != ''" :activity="activity"/>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <div v-if="notesData.length == 0" class="flex flex-wrap-reverse items-center ml-4 mr-4 data-list-btn-container">
                <!-- ADD NEW -->
                <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                    @click.stop="sendData('AjouterNote')">
                    <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                    <span class="ml-2 text-base text-primary">{{$t('addANote')}}</span>
                </div>
            </div>
            <div class="ml-4 mr-4">
                <vx-card no-shadow v-if="notesData.length == 0" class="mb-base">
                    <p>{{$t('noElementFound')}}</p>
                </vx-card>
            </div>
           
            <vs-table v-if="notesData.length > 0" ref="table" pagination search :data="notesData" :max-items="itemsPerPage" class="table mt-4 w-full">
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <!-- ADD NEW -->
                        <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                            @click.stop="sendData('AjouterNote')">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">{{$t('addANote')}}</span>
                        </div>
                    </div>
                    <!-- ITEMS PER PAGE -->
                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                        <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ notesData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : notesData.length }} of {{ queriedItems }}</span>
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
                    <vs-th sort-key="membre">{{$t('members') | CAPITALIZE }}</vs-th>
                    <vs-th sort-key="created_at">{{$t('date') | CAPITALIZE }}</vs-th>
                    <vs-th sort-key="note">{{$t('notes') | CAPITALIZE }}</vs-th>
                    <vs-th sort-key="actions"> {{$t('actions') | CAPITALIZE }} </vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr 
                        v-for="(tr, index) in data" 
                        :key="index">
                        <vs-td>
                            <p class="">{{tr.membre}}</p>
                        </vs-td>

                         <vs-td>
                            <p class="">{{tr.create_at | dateTime}}</p>
                        </vs-td>

                        <vs-td
                            @click.native="()=>{note = tr.note; popupActivo2 = true}">
                            <p class="ellipsis cursor-pointer">{{tr.note}}</p>
                        </vs-td>

                        <vs-td class="w-32">
                            <vx-tooltip :text="$t('update')" position="bottom"  class="inline-block mr-2">
                                <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                                class="ml-2" @click.stop="addNewData('ModifierNote', tr)" />
                            </vx-tooltip>

                            <vx-tooltip :text="$t('delete')" position="bottom"  class="inline-block">
                                <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                                class="ml-2" @click="()=>{note_selectionnee = tr.id; popupActivo1 = true}" />
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
</template>
<script>
import {Money} from 'v-money'
import vSelect from 'vue-select'
import DataViewSidebar from '../../../../../components/sidebar/DataViewSidebar.component'
import ActionButton from '../components/ActionButton.component'
// Functions
import { EventBus } from  '@/services/EventBus.js'
import checkIfAdmin from '../../../../../mixins/checkRole'
import checkActivityType from '../../../mixins/checkActivityType'
import { mapGetters } from 'vuex'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"

export default {
    mixins: [checkIfAdmin, checkActivityType],
    data(){
        return{
            note: '',
            note_selectionnee: '',
            selected: [],
            popupActivo1: false,
            popupActivo2: false,
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

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            etat: '',
            devise: '',
            activite: {},

            /* Loading */
            backgroundLoading:'danger',
            colorLoading:'#fff',
            loader: true
        }
    },
    components:{
        Money,
        vSelect,
        DataViewSidebar,
        ActionButton
    },
    computed: {
        ...mapGetters({
          activity: 'association/getActivity'
        }),
        admin() {
          return this.isSuperAdministrator
        },
        notesData(){
          return this.$store.state.association.notes
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
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.notesData.length
        }
    },
    methods: {
        sendData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.activite = this.activity
            this.toggleDataSidebar(true)
        },
        addNewData(etat, data) {
            this.etat = etat
            this.sidebarData = data
            this.activite = this.activity
            this.toggleDataSidebar(true)
        },
        toggleDataSidebar(val=false) {
            this.addNewDataSidebar = val
        },

        //Supprimer une transaction
      deleteItem(note_id){
        this.openLoadingContained()

        let payload = {
          resourceUrl: '/api/note/'+note_id+'/delete',
          commitAction: 'REMOVE_NOTE'
        }
        this.$store.dispatch("association/removeRecord",payload)
        .then(()=> {
          this.loader = true
          this.$vs.loading.close("#button-with-loading > .con-vs-loading")
          this.popupActivo1 = false,
          this.$vs.notify({
            position:'top-center',
            text: this.$t('operationDelete'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'success'
          })
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
        })
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
        this.devise = this.$store.state.association.currentAssociation.devise
        let current_association_id = this.$store.state.association.currentAssociation.id
        let current_activity_id = localStorage.getItem('activity_id')

        let payload = {
          resourceUrl:"api/association/"+current_association_id+"/activite/"+current_activity_id,
          commitAction: 'SET_ACTIVITE',
        }
        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .then(()=>{
            let payload = {
                resourceUrl:'api/note/activites/'+current_activity_id+'/all',
                commitAction: 'SET_NOTES',
            }
            this.$store.dispatch("association/fetchAssociationactivite", payload)
            .then(() => {
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
    },
    mounted(){
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
