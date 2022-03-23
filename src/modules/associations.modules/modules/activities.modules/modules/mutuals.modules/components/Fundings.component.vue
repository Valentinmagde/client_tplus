<template>
    <div id="data-list-list-view" class="data-list-container">
        <div class="ml-4 mr-4">
            <vx-card no-shadow class="mb-6 pb-6" :title="$t('recordedDownPayments') | CAPITALIZE "/>
        </div>
        <Data-view-sidebar
            :isSidebarActive="addNewDataSidebar"
            @closeSidebar="toggleDataSidebar"
            :data="sidebarData"
            :members="membres"
            :etat="etat"
            :mutual="mutuelle"
            :activity="activite"
        />
        <div v-if="regroupeMises.length == 0" class="flex flex-wrap-reverse items-center ml-4 mr-4 data-list-btn-container">
            <!-- ADD NEW -->
            <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                @click.stop="sendData('MisePourTous')">
                <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                <span class="ml-2 text-base text-primary">{{$t('newBet')}}</span>
            </div>

            <!-- ADD NEW -->
            <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                @click.stop="sendData('ImporterFonds')">
                <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
                <span class="ml-2 text-base text-primary">{{$t('importFromFile')}}</span>
            </div>
        </div>
        <div class="ml-4 mr-4">
            <vx-card no-shadow v-if="regroupeMises.length == 0" class="mb-base">
                <p>{{$t('noElementFound')}}</p>
            </vx-card>
        </div>

        <vs-table v-if="regroupeMises.length > 0" ref="table" pagination search :data="regroupeMises" :max-items="itemsPerPage" class="table mt-4 w-full">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                    <!-- ADD NEW -->
                    <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                        @click.stop="sendData('MisePourTous')">
                        <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                        <span class="ml-2 text-base text-primary">{{$t('newBet')}}</span>
                    </div>

                    <!-- ADD NEW -->
                    <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                        @click="sendData('ImporterFonds')">
                        <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
                        <span class="ml-2 text-base text-primary">{{$t('importFromFile')}}</span>
                    </div>
                </div>
                <!-- ITEMS PER PAGE -->
                <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                    <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ regroupeMises.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : regroupeMises.length }} of {{ queriedItems }}</span>
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
                <vs-th sort-key="firstName">{{$t('members') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="registration">{{$t('registrationDate') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="down-payment"> {{$t('downPayment') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="actions"> {{$t('actions') | CAPITALIZE }} </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="data" v-for="(tr, index) in data" :key="index">
                    <vs-td>
                        <p class="product-name font-medium truncate">{{tr.membre}}</p>
                    </vs-td>
                    <vs-td>
                        <p> {{ (tr.date_versement) | dateTime }}</p>
                    </vs-td>
                    <vs-td>
                        <p :class="{redtextclass: tr.montant < 0}">
                            {{ (tr.montant) | formatMoney(devise) }}
                        </p>
                    </vs-td>

                    <vs-td>
                        <vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block ">
                            <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                            @click="addNewData('DetailFonds', tr)"/>
                        </vx-tooltip>
                       <!--  <vx-tooltip :text="$t('downPayment')" position="bottom"  class="inline-block ">
                            <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                            class="ml-2" @click="addNewData('MiseMembre', tr)" />
                        </vx-tooltip> -->
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

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            etat: '',
            membres: [],
            membre_inscris: [],
            devise: '',
            mutuelle: {},
            activite: {}
        }
    },
    components:{
        Money,
        vSelect,
        DataViewSidebar
    },
    computed: {
        misesData(){
            return this.$store.state.association.mises_fonds
        },
        regroupeMises(){
            //Exraction de noms des membres inscris et le nombre de part à partir des lots
            let mises = this.misesData ? JSON.parse (JSON.stringify (this.misesData)): []
            var mises_tries = []

            if(mises.length > 0){
                //Compter les noms en double dans le tableau membre et
                //les stokés dans le tableau membres_tries avec leurs occurrences
                for (let i = 0; i < mises.length-1; i++) {
                    let som = mises[i].montant
                    for (let index = i+1; index < mises.length; index++) {
                        if(mises[i].membres_id == mises[index].membres_id){
                            som += mises[index].montant
                        }
                    }
                    /* window.console.log(som) */
                    if(!(mises_tries.some(element => element.membres_id === mises[i].membres_id))){
                        mises[i].montant = som
                        mises_tries.push(
                            mises[i]
                        );
                    }
                }

                let $index = 1
                /* window.console.log(membres[membres.length-1].nom) */
                for(let j = 0; j < mises.length-1; j++){
                    if(mises[mises.length-1].membres_id == mises[j].membres_id){
                    $index++
                    /* window.console.log(membres[j].nom) */
                    }
                }
                if($index == 1){
                    mises_tries.push(
                        mises[mises.length-1]
                    );
                }
            }
            return mises_tries.sort((a, b) => (a.membres_id > b.membres_id) ? 1 : -1)
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
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.regroupeMises.length
        }
    },
    methods: {
        previous(){
          this.$emit('selectedTab', 1)
        },

        next(){
          this.$emit('selectedTab', 3)
        },
        sendData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.membres = this.membre_inscris
            this.mutuelle = this.activity.Mutuelle
            this.activite = this.activity
            this.toggleDataSidebar(true)
        },
        addNewData(etat, data) {
            this.etat = etat
            this.sidebarData = data
            this.membres = this.membre_inscris
            this.mutuelle = this.activity.Mutuelle
            this.toggleDataSidebar(true)
        },
        toggleDataSidebar(val=false) {
            this.addNewDataSidebar = val
        }
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
                //Recupperer tous les mises de fonds de la mutuelle
                let epargne_courante = this.activity.Mutuelle;
                let payload = {
                    resourceUrl: "/api/mutuelle/"+epargne_courante.id+"/misedefonds",
                    commitAction: 'SET_MISES_FONDS'
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
        }
        else{
            EventBus.$emit('loader', false)
        }
        let association_courante = this.$store.state.association.currentAssociation;
        //Recupperer la devise de la sociation
        this.devise = association_courante.devise
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
