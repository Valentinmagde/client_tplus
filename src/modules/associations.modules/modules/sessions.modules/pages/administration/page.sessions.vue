<template>
    <div>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <div class="ml-5 mr-5">
                <vx-card v-if="ags.length == 0">
                <p>{{$t('noElementFound')}}</p>
                </vx-card>
            </div>
            <!-- La liste des differentes Assemmblée générale -->
            <div v-show="ags.length > 0" id="data-list-list-view" class="data-list-container">
                <vs-table ref="table" pagination :max-items="itemsPerPage" search :data="ags">
                    <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                        <!-- ITEMS PER PAGE -->
                        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ ags.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : ags.length }} of {{ queriedItems }}</span>
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
                        <vs-th sort-key="date">{{$t('date') | CAPITALIZE }}</vs-th>
                        <vs-th sort-key="host">{{$t('host') | CAPITALIZE }}</vs-th>
                        <vs-th sort-key="location">{{$t('location') | CAPITALIZE }}</vs-th>
                        <vs-th sort-key="state">{{$t('state') | CAPITALIZE }}</vs-th>
                        <vs-th>{{$t('actions') | CAPITALIZE }}</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="index" v-for="(ag, index) in data">
                            <vs-td>
                                <p class="product-name font-medium truncate">
                                    {{ (ag.date_ag) | dateTime }}
                                </p>
                            </vs-td>

                            <vs-td>
                                <p v-if="ag.etat=='past'" class="product-category"></p>
                                <p v-else class="product-category">{{ag.membre}}</p>
                            </vs-td>

                            <vs-td>
                                <p class="product-category" v-if="ag.etat!='past'">
                                    <span v-if="ag.lieu_ag == 'En ligne'" class="inline-block">
                                        {{$t('online')}}
                                    </span>
                                    <span v-else-if="ag.lieu_ag == null && (ag.membres_id && ag.membre != 'not found')
                                    || ag.lieu_ag == 'null' && ag.membre != 'not found' "
                                    class="inline-block">
                                        {{$t('atTheHomeOf') +' '+ag.membre}}
                                    </span>
                                    <span v-else-if="ag.lieu_ag == null && ag.membre == 'not found'
                                    || ag.lieu_ag == 'null' && ag.membre == 'not found' "
                                    class="inline-block">
                                    </span>
                                    <span v-else class="inline-block">
                                        {{ag.lieu_ag}}
                                    </span>
                                </p>
                            </vs-td>
                            <vs-td>
                                <!-- ag passée -->
                                <span v-if="ag.etat=='past'">
                                    <vs-chip>{{$t('past')}}</vs-chip>
                                </span>
                                <!-- ag clôturée -->
                                <p v-if="ag.etat == 'cloture'" class="product-price">
                                    <vs-chip color="#28C76F">{{$t('fenced')}}</vs-chip>
                                </p>
                                <!-- ag en cours -->
                                <span  v-if="ag.etat=='current'">
                                    <vs-chip color="#FF9F43">{{$t('Next')}}</vs-chip>
                                </span>
                                <!-- ag futur-->
                                <span v-if="ag.etat=='future'">
                                    <vs-chip color="#3383c8">{{$t('future')}}</vs-chip>
                                </span>
                            </vs-td>

                            <vs-td class="whitespace-no-wrap">

                                <!-- Afficher le boutton voir le rapport lorsque l'ag est passée -->
                                <span v-if="ag.etat=='past'">
                                    <vx-tooltip v-if="!ag.file" :text="$t('uploadReport')" position="bottom" class="inline-block">
                                        <input type="file" id="files" ref="files" accept=".pdf" v-on:change="uploadReport(ag,index)" style="display: none;"/>

                                        <vs-icon icon-pack="streameline"
                                            icon="icon-harddrive-upload" style="font-size: 18px"
                                            class="hover:text-primary" size="small" @click="addFiles(index)">
                                        </vs-icon>
                                    </vx-tooltip>

                                    <vx-tooltip v-if="ag.file" :text="$t('seeTheReport')" position="bottom" class="inline-block"
                                        @click.native="openReportFile(ag.file)">
                                        <vs-icon icon-pack="streameline"
                                            icon="icon-office-file-pdf-1" style="font-size: 18px"
                                            class="hover:text-primary" size="small">
                                        </vs-icon>
                                    </vx-tooltip>
                                </span>

                                <!-- Afficher le boutton voir le rapport lorsque l'ag est clôturée -->
                                <span v-if="ag.etat=='cloture'">
                                    <vx-tooltip :text="$t('seeTheReport')" position="bottom" class="inline-block"
                                        @click.native="openReportFile(ag.file)">
                                        <vs-icon icon-pack="streameline"
                                            icon="icon-office-file-pdf-1" style="font-size: 18px"
                                            class="hover:text-primary" size="small">
                                        </vs-icon>
                                    </vx-tooltip>
                                </span>

                                <!-- Afficher les actions lorsque l'ag ne pas encore clotutée -->
                                <span v-if="ag.etat=='current' || ag.etat=='future'">
                                    <!-- Repporter une ag -->
                                    <vx-tooltip :text="$t('reportCancel')" position="bottom"  class="inline-block"
                                        >
                                        <feather-icon icon="XCircleIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                                          @click="popupActivo1=true; lieu_ag=ag.membre; date_ag=ag.date_ag*1000;
                                        ag_selectionnee=ag.id; cycle_selectionnee=cycle_actif.cycle.id"/>
                                    </vx-tooltip>

                                    <!-- Changer l'hôte -->
                                    <vx-tooltip :text="$t('changeHost')" position="bottom"  class="inline-block ml-2"
                                        @click.native="popupActivo2=true; assigne.text= ag.membre; assigne.value= ag.membres_id;
                                        ag_selectionnee = ag.id; cycle_selectionnee=cycle_actif.cycle.id">
                                        <!-- <feather-icon icon="RotateCwIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"/> -->
                                        <vs-icon icon-pack="streameline" icon="icon-single-neutral-actions-home" style="font-size: 18px"
                                            class="hover:text-primary" size="small"></vs-icon>
                                    </vx-tooltip>

                                    <!-- Permuter les ags -->
                                    <vx-tooltip :text="$t('swapHost')" position="bottom"  class="inline-block ml-2 mr-2"
                                        @click.native="popupActivo3=true; permute.text= $t('GM')+' '+date(ag.date_ag) +' ['+ag.membre+']';
                                        permute.value= ag.id; ag_selectionnee = ag.id; cycle_selectionnee=cycle_actif.cycle.id">
                                        <!-- <feather-icon icon="ToggleRightIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"/> -->
                                        <vs-icon icon-pack="streameline" icon="icon-single-man-actions-up-down" style="font-size: 18px"
                                            class="hover:text-primary" size="small"></vs-icon>
                                    </vx-tooltip>
                                </span>

                                <!-- Activer le boutton gérer la session de l'ag en cours -->
                                <span  v-if="ag.etat=='current'" style="cursor:pointer">
                                    <vx-tooltip :text="$t('manageSession')" position="bottom" class="inline-block">
                                        <feather-icon
                                            icon="SettingsIcon"
                                            svgClasses="w-5 h-5 hover:text-success stroke-current"
                                            @click="handleSeance(ag)"/>
                                    </vx-tooltip>
                                </span>
                                <!-- Desactiver le boutton gérer la session de l'ag ne pas en cours -->
                                <span v-if="ag.etat=='future'">
                                    <vx-tooltip :text="$t('manageSession')" position="bottom" class="inline-block">
                                        <feather-icon  icon="SettingsIcon" svgClasses="w-5 h-5 text-grey stroke-current"/>
                                    </vx-tooltip>
                                </span>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <!-- Popup changer le lieu et la date d'une ag -->
            <vs-popup classContent="popup-example"  class="popup-position ags" :title="$t('reportCancel')" :active.sync="popupActivo1">
            <p class="mb-6">{{$t('changePlaceOrDate')}}</p>
            <div class="vx-row mb-4">
                <div class="vx-col w-1/4 vx-row justify-end">{{$t('place')}}:</div>
                <div class="vx-col w-3/4">
                    <vs-input
                        v-model="lieu_ag"
                        class="mb-2 w-full"/>
                </div>
            </div>
            <div class="vx-row">
                <div class="vx-col w-1/4 vx-row justify-end">{{$t('date')}}:</div>
                <div class="vx-col w-3/4">
                    <flat-pickr
                        :config="MyConfig"
                        v-model="date_ag"
                        class="mb-2 w-full"/>
                </div>
            </div>
            <vs-divider/>
            <div class="vx-row w-full justify-end">
                <vs-button
                    @click="popupActivo1=false"
                    type="border">
                    {{$t('cancel')}}
                </vs-button>&nbsp;&nbsp;

                <vs-button
                    class="ml-3 vs-con-loading__container"
                    ref="loadableButton"
                    id="button-with-loading-report"
                    :disabled="!loading"
                    @click.stop="report(ag_selectionnee, cycle_selectionnee, 'button-with-loading-report')">
                    {{$t('save')}}
                </vs-button>
            </div>
            </vs-popup>

        <!-- Popup changer d'hôte -->
        <vs-popup classContent="popup-example"  class="popup-position ags" :title="$t('changeHost')" :active.sync="popupActivo2">
        <p class="mb-4">{{$t('assignToMember')}}</p>
        <div class="vx-row">
            <div class="vx-col w-1/3 vx-row justify-end">{{$t('chooseHost')}}:</div>
            <div class="vx-col w-2/3">
                <v-select
                label="text"
                :options="selectOptions2"
                v-model="assigne"
                class="mb-2 w-full"/>
            </div>
        </div>
        <vs-divider class="mt-16"/>
        <div class="vx-row w-full justify-end">
            <vs-button
                @click="popupActivo2=false"
                type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button
                class="ml-3 vs-con-loading__container"
                ref="loadableButton"
                id="button-with-loading-change"
                :disabled="!loading"
                @click.stop="change(ag_selectionnee, cycle_selectionnee, 'button-with-loading-change')">
                {{$t('save')}}
            </vs-button>
        </div>
        </vs-popup>

        <!-- Popup pour permuter d'hôte -->
        <vs-popup classContent="popup-example"  class="popup-position ags" :title="$t('swapHost')" :active.sync="popupActivo3">
        <p class="mb-4">{{$t('swapHost')}}</p>
        <div class="vx-row">
            <div class="vx-col w-1/3 vx-row justify-end">{{$t('swapwith')}}:</div>
            <div class="vx-col w-2/3">
                <v-select
                label="text"
                :options="selectOptions3"
                v-model="permute"
                class="mb-2 w-full"/>
            </div>
        </div>
        <vs-divider class="mt-16"/>
        <div class="vx-row w-full justify-end">
            <vs-button
                @click="popupActivo3=false"
                type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button
                class="ml-3 vs-con-loading__container"
                ref="loadableButton"
                id="button-with-loading-swap"
                :disabled="!loading"
                @click.stop="swap(ag_selectionnee, cycle_selectionnee, 'button-with-loading-swap')">
                {{$t('save')}}
            </vs-button>
        </div>
        </vs-popup>
        </div>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'
//Functions
import functions from "../../services/functions.js"
import { EventBus } from  '@/services/EventBus.js'

//Store
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAg from "@/store/ags/moduleAg.js"

import {postUploadFile} from '../../services/api'

import mixins from '../../services/mixins/data'
import 'flatpickr/dist/flatpickr.css';

export default {
    mixins: [mixins],
    data(){
        return {
            popupActivo1:false,
            popupActivo2:false,
            popupActivo3:false,

            ags: [],
            cycle_actif: null,
            ag_selectionnee: null,
            cycle_selectionnee: null,
            assigne: {
                text:'',
                value: null
            },
            permute: {
                text:'',
                value: null
            },
            lieu_ag: '',
            date_ag: '',
            MyConfig: {
                altFormat: "F j, Y",
                dateFormat:"d M Y"
            },
            // usersData: [],
            itemsPerPage: 10,
            isMounted: false,
            currentUTCDate: null,

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loading: true
        }
    },
    components: {
         vSelect,
         flatPickr
    },
    computed: {
        membreData(){
            return this.$store.state.association.members
        },
        selectOptions2(){
            if(this.membreData != null) return this.membreData.map(membre => ({id: membre.id, text: membre.firstName, value: membre.id}))
        },
        selectOptions3(){
            var prochaines_ags = []

            if(this.ags != null) {
                this.ags.forEach(element => {
                    if(element.etat != 'past' && element.etat != 'cloture'){
                        prochaines_ags.push(element)
                    }
                });
            }
            if(prochaines_ags.length > 0 ) return prochaines_ags.map(ag => ({id: ag.id, text: this.$t('GM')+' '+ this.$options.filters.dateTime(ag.date_ag) + ' ['+ag.membre+']', value: ag.id}))
        },
        currentPage() {
            if(this.isMounted) {
                return this.$refs.table.currentx
            }
            return 0
        },
        queriedItems() {
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.ags.length
        }
    },
    methods: {
        activateCurrentAg(date_time){

            if (process.env.ACTIVATE_AG)
                return this.currentUTCDate == (new Date(date_time)).toUTCString()
            else
                return true

        },
        //Reporter une ag
        report(ag_id, cycle_id, idLoader){
            var current_association = this.$store.state.association.currentAssociation
            var date = new Date(this.date_ag).getTime()/1000
            let payload = {
                resourceUrl: '/api/association/' + current_association.id + '/cycle/'+ cycle_id +'/ag/'+ag_id,
                commitAction: 'SET_AGS',
                data: {
                    lieu_ag: this.lieu_ag,
                    date_ag: date
                }
            }

            this.openLoadingContained(idLoader)
            this.$store.dispatch("association/postRequest",payload)
            .then(()=>{
                this.loading = true
                this.$vs.loading.close(`#${idLoader}> .con-vs-loading`)
                this.popupActivo1 = false
                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('generalMeetingSuccessfullyPostponed'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
                //Lire le cycle
                let payload = {
                    resourceUrl: '/api/cycle/' + cycle_id+'/ags',
                    commitAction: 'SET_AGS'
                }

                this.$store.dispatch("association/fetchAgsByCycle",payload)
                .then((response)=>{
                    this.ags = response.data.data
                })
            })
            .catch((error)=>{
                this.loading = true
                this.$vs.loading.close(`#${idLoader}> .con-vs-loading`)
                this.$vs.notify({
                    position:'top-center',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
        },
        //Changer l'hôte d'une ag
        change(ag_id, cycle_id, idLoader){
            let payload = {
                resourceUrl: '/api/ag/'+ ag_id + '/assign/'+this.assigne.value,
                commitAction: 'SET_AGS'
            }

            this.openLoadingContained(idLoader)
            this.$store.dispatch("association/fetchAgsByCycle",payload)
            .then(()=>{
                this.loading = true
                this.$vs.loading.close(`#${idLoader}> .con-vs-loading`)
                this.popupActivo2 = false
                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('hostSuccessfullyChanged'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
                //Lire le cycle
                let payload = {
                    resourceUrl: '/api/cycle/' + cycle_id+'/ags',
                    commitAction: 'SET_AGS'
                }

                this.$store.dispatch("association/fetchAgsByCycle",payload)
                .then((response)=>{
                    this.ags = response.data.data
                })
            })
            .catch((error)=>{
                this.loading = true
                this.$vs.loading.close(`#${idLoader}> .con-vs-loading`)
                this.$vs.notify({
                    position:'top-center',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
        },
        //Permuter une ag
        swap(ag1_id, cycle_id, idLoader){
            let payload = {
                resourceUrl: '/api/ags/permutation',
                commitAction: 'SET_AGS',
                data:{
                    ag1: ag1_id,
                    ag2: this.permute.id
                }
            }

            this.openLoadingContained(idLoader)
            this.$store.dispatch("association/postRequest",payload)
            .then(()=>{
                this.loading = true
                this.$vs.loading.close(`#${idLoader}> .con-vs-loading`)
                this.popupActivo3 = false
                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('hostsSuccessfullySwapped'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
                //Lire le cycle
                let payload = {
                    resourceUrl: '/api/cycle/' + cycle_id+'/ags',
                    commitAction: 'SET_AGS'
                }

                this.$store.dispatch("association/fetchAgsByCycle",payload)
                .then((response)=>{
                    this.ags = response.data.data
                })
            })
            .catch((error)=>{
                this.loading = true
                this.$vs.loading.close(`#${idLoader}> .con-vs-loading`)
                this.$vs.notify({
                    position:'top-center',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
        },

        /* Ouvrir le rapport */
        openReportFile(link){
            window.open(link, '_blank');
        },

        handleSeance(ag){
            this.$store.commit('association/SET_AG', ag)
            // localStorage.setItem('seance_courante', JSON.stringify(ag))
            EventBus.$emit('loader', true)
            this.$router.push(`/association/administration/sessions/${ag.id}`)
            .catch(error => window.console.log(error))

        },
        uploadReport(ag, index){
            const fileToUpload = this.$refs.files[index].files[0]

            if ( fileToUpload.type != "application/pdf"){
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('filePDFError'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
                return false
            }
            if( fileToUpload.size >= 2249528){
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('fileError'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
                return false
            }

            EventBus.$emit('loader', true)
            postUploadFile({
                file:fileToUpload,
                assId: this.$store.state.association.currentAssociation.id,
                agId: ag.id
            })
            //eslint-disable-next-line no-unused-vars
            .then( () => {
               this.$vs.notify({
                position:'top-center',
                text: this.$t('notifContent'),
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'success'
               })
               this.fetchAllPage()
             })
            //eslint-disable-next-line no-unused-vars
            .catch(e => {
                EventBus.$emit('loader', false)
            })

        },
        addFiles(index){
            this.$refs.files[index].click();
        },
        fetchAllPage(){
            EventBus.$emit('loader', true)

            // if(!moduleCycle.isRegistered) {
            //     this.$store.registerModule('cycle', moduleCycle)
            //     moduleCycle.isRegistered = true
            // }
            // if(!moduleAg.isRegistered) {
            //     this.$store.registerModule('ag', moduleAg)
            //     moduleAg.isRegistered = true
            // }
            // if(!moduleUserManagement.isRegistered) {
            //     this.$store.registerModule('userManagement', moduleUserManagement)
            //     moduleUserManagement.isRegistered = true
            // }

            var current_association = this.$store.state.association.currentAssociation

            let payload = {
                resourceUrl: '/api/association/' + current_association.id + '/cycle',
                commitAction: 'SET_CYCLES'
            }
            this.$store.dispatch("association/fetchCycles",payload)
            .then((res)=>{
                //Loader
                EventBus.$emit('loader', false)

                let donnees = res.data
                //Verifier s'il ya des cycles dans l'association
                if(donnees.data.length > 0) {
                    //Nous voullons reccuperer les cycles cloturés et le cycle actif de l'association
                    var cycle = donnees.data
                    var cycleClotures = functions.afficherCycleClotures(cycle)
                    var cycleActif =  functions.afficherCycleActif(cycle)

                    //Assignation des cycles cloturés à notre variable utilisée dans le template
                    if(cycleClotures.length > 0) this.cycle_clotures = cycleClotures
                    //Assignation du cycle actigf à notre variable utilisée dans le template
                    if(cycleActif != null){
                        this.cycle_actif = cycleActif
                        /* window.console.log(cycleActif) */
                        //Assigner les ags du cycle actigf à la variable ags s'il en existe
                        if(cycleActif.ag.length > 0) {
                            this.ags = cycleActif.ag
                            this.$store.commit('association/SET_AGS', cycleActif.ag)
                        }
                    }
                }
            })
            .catch((error)=>{
                //Loader
                EventBus.$emit('loader', false)
                window.console.log(error)
            })
        },

        openLoadingContained(id){
            this.loading = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${id}`,
                scale: 0.45
            });
        },

    },
    created(){
        //Loader
        this.fetchAllPage()
    },
    mounted() {
        this.isMounted = true;
    }

}
</script>
<style lang="scss">
.ags{
    .vs__dropdown-menu  {
        height: 130px !important;
    }
}
/* .vs-table--content {
    width: 100%;
    overflow: auto;
    margin-top: -13px;
} */
</style>
