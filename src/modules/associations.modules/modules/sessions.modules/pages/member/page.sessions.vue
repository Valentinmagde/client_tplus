<template>
    <div>
        <div class="fixed top-0 z-20 w-full" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <div class="ml-5 mr-5">
                <vx-card v-if="ags.length == 0">
                <p>{{$t('noElementFound')}}</p>
                </vx-card>
            </div>
            <!-- La liste des differentes Assemmblée générale -->
            <div v-show="ags.length > 0" id="data-list-list-view" class="data-list-container">
                <vs-table ref="table" pagination :max-items="itemsPerPage" search :data="ags">
                    <div slot="header" class="flex flex-wrap-reverse items-center justify-between flex-grow">
                        <!-- ITEMS PER PAGE -->
                        <vs-dropdown vs-trigger-click class="mb-4 mr-4 cursor-pointer items-per-page-handler">
                            <div class="flex items-center justify-between p-4 font-medium border border-solid rounded-full cursor-pointer d-theme-border-grey-light d-theme-dark-bg">
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
                                <p class="font-medium truncate product-name">
                                    {{ ag.date_ag | dateTime }}
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
                                        <vs-icon icon-pack="streameline"
                                            icon="icon-harddrive-upload" style="font-size: 18px"
                                            class="text-grey" size="small">
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

                                <!-- Activer le boutton gérer la session de l'ag en cours -->
                                <span  v-if="ag.etat=='current'" style="cursor:pointer">
                                    <vx-tooltip :text="$t('manageSession')" position="bottom" class="inline-block" v-if="hasAccess">
                                        <feather-icon
                                            icon="SettingsIcon"
                                            svgClasses="w-5 h-5 hover:text-success stroke-current"
                                            @click="handleSeance(ag)"/>
                                    </vx-tooltip>
                                     <vx-tooltip v-else :text="$t('manageSession')" position="bottom" class="inline-block">
                                        <feather-icon  icon="SettingsIcon" svgClasses="w-5 h-5 text-grey stroke-current"/>
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
        </div>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'
//Functions
import functions from "../../../../services/functions"
import { EventBus } from  '@/services/EventBus.js'

//Store
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAg from "@/store/ags/moduleAg.js"

import mixins from '../../services/mixins/data'

import { getRapportAg, getAssociationMembres} from "../../services/api"
import { mapGetters } from 'vuex';

export default {
    mixins: [mixins],
    data(){
        return {
            ags: [],
            currentUTCDate: null,
            hasAccess:false,
            members:[],
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
        }
    },
    components: {
         vSelect,
         flatPickr
    },

    watch:{
        //eslint-disable-next-line
        ags: function(newVal, oldValue){

            let currentAg = newVal.filter(e => e.etat == 'current')

            getRapportAg({
                assId: this.currentAssociation.id,
                agId: currentAg[0].id
            }).
              then(e => {

              let user = this.extractMember(this.members)
              if (e.data.data.secretaire == user){

                  this.hasAccess = true
                  this.$store.commit('authentificated/ADD_USER_ROLES', "Secretaire")

                  }
              })
        }
    },
    computed: {
        ...mapGetters({
          activeUser: 'authentificated/getAuth',
          currentAssociation: 'association/getCurrentAssociation'
        }),

        membreData(){
            return this.$store.state.association.members
        },
        currentPage() {
            if(this.isMounted) {
                return this.$refs.table.currentx
            }
            return 0
        },
        queriedItems() {
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.ags.length
        },
    },
    methods: {

        activateCurrentAg(date_time){

            if (process.env.ACTIVATE_AG)
                return this.currentUTCDate == (new Date(date_time)).toUTCString()
            else
                return true

        },
        extractMember(members){
            var user = this.activeUser
            var id

            members.forEach(member => {
                member.users.forEach(author => {
                  if(user.id == author.id) {
                    id = member.id
                  }
                })
            })
            return id
        },

        /* Ouvrir le rapport */
        openReportFile(link){
            window.open(link, '_blank');
        },

        handleSeance(ag){
            this.activateCurrentAg()
            this.$store.commit('association/SET_AG', ag)

            EventBus.$emit('loader', true)

            this.$router.push(`/association/sessions/${ag.id}`)
            .catch(error => { window.console.error(error) })
        },
    },

    created(){
        var current_association = this.$store.getters['association/getCurrentAssociation']

        //Loader
        getAssociationMembres({id: current_association.id })
          .then(e => this.members = e.data.data)
        EventBus.$emit('loader', true)

        this.$store.commit('authentificated/REMOVE_ROLE', "Secretaire")

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
                        this.$store.commit('association/SET_AGS', this.ags)
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
