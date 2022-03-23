<template>
    <div id="data-list-list-view" class="data-list-container">
        <div class="ml-5 mr-5">
            <vx-card no-shadow class="mb-6 pb-6" :title="$t('statementOfAccounts')+' - '+$t('EpargneCredit')" />

            <vx-card no-shadow v-if="!comptesData.length" class="mb-base">
                <p>{{$t('noElementFound')}}</p>
            </vx-card>
        </div>

        <Data-view-sidebar
            :isSidebarActive="addNewDataSidebar"
            @closeSidebar="toggleDataSidebar"
            :data="sidebarData"
            :etat="etat"
            :activity="activite"
        />

        <vs-table v-if="comptesData.length" ref="table" pagination :max-items="itemsPerPage" :data="comptesData" search class="mt-4">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                    <!-- ADD NEW -->
                    <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                        @click.stop="addNewData('AllouerSomme')">
                        <!-- <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" /> -->
                        <span class="ml-2 text-base text-primary">{{$t('allocateSum')}}</span>
                    </div>
                </div>

                <!-- ITEMS PER PAGE -->
                <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                        <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ comptesData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : comptesData.length }} of {{ queriedItems }}</span>
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
                <vs-th sort-key="balance">{{$t('balance') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="debtPenalityLate"> {{$t('debtPenalityLate') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="debtInterest"> {{$t('debtInterest') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="debtBond"> {{$t('debtBond') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="assets"> {{$t('assets') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="interest"> {{$t('interests') | CAPITALIZE }} </vs-th>
            </template>

            <template slot-scope="{data}">
                <tbody>
                    <vs-tr  :data="member"  v-for="member in data" :key="member.id" @click="selectMember(event, member.id)">
                        <vs-td>
                            <p class="product-name font-medium truncate">{{ member.membre }}</p>
                        </vs-td>
                        <vs-td>
                            <money
                                v-model="member.solde"
                                v-bind="money"
                                class="money-input text-center w-full"
                            />
                        </vs-td>
                        <vs-td>
                            <money
                                v-model="member.dette_ap"
                                v-bind="money"
                                class="money-input text-center w-full"
                            />
                        </vs-td>
                        <vs-td>
                            <money
                                v-model="member.dette_ai"
                                v-bind="money"
                                class="money-input text-center w-full"
                            />
                        </vs-td>
                        <vs-td>
                            <money
                                v-model="member.dette_c"
                                v-bind="money"
                                class="money-input text-center w-full"
                            />
                        </vs-td>
                        <vs-td>
                            <money
                                v-model="member.avoir"
                                v-bind="money"
                                class="money-input text-center w-full"
                            />
                        </vs-td>
                        <vs-td>
                            <money
                                v-model="member.interet"
                                v-bind="money"
                                class="money-input text-center w-full"
                            />
                        </vs-td>
                    </vs-tr>
                </tbody>
            </template>
        </vs-table>
        <div class="flex flex-wrapper mt-6 ml-4">
            <vs-button
                type="border"
                class="mr-6"
                @click.native="previous">
                {{$t('previous')}}
            </vs-button>

            <vs-button
                class="ml-3 vs-con-loading__container"
                ref="loadableButton"
                id="button-with-loading"
                :disabled="!loader"
                @click.native="updateCompte">
                {{$t('next')}}
            </vs-button>
        </div>
    </div>
</template>
<script>
import {Money} from 'v-money'
import DataViewSidebar from '../../../../../components/sidebar/DataViewSidebar.component.vue'
import { EventBus }from '@/services/EventBus.js'

export default {
    props: ['activity'],
    data(){
        return{
            selected: [],
            update_compte: [],
            nom_tontine: '',
            attribution_cagnote: '',
            date_debut: '',
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            itemsPerPage: 10,
            isMounted: false,

            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            etat: '',
            activite: null,

            /* Loader */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,

            isReady: false,
        }
    },
    components: {
        Money,
        DataViewSidebar
    },
    computed: {
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
                        dette_ap: value.dette_ap ? value.dette_ap: 0.00,
                        dette_ai: value.dette_ai ? value.dette_ai: 0.00,
                        dette_c: value.dette_c ? value.dette_c: 0.00,
                        avoir: value.avoir ? value.avoir : 0.00,
                        interet: value.interet ? value.interet : 0.00,
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
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.comptesData.length
        }
    },
    mounted(){
        if(localStorage.getItem('activity_id') !== null){
            var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

            this.nom_tontine = activite_courante.nom.toUpperCase()

            var mutuelle_courante = activite_courante.Mutuelle

            this.attribution_cagnote = mutuelle_courante.attribution_cagnote
            this.date_debut = mutuelle_courante.date_debut
        }

        this.isMounted = true;
    },
    methods: {
        addNewData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.activite = this.activity !== '' ? this.activity : this.$store.state.association.activite;
            this.toggleDataSidebar(true)
        },

        previous(){
          if(this.attribution_cagnote == "ENCHERE" && new Date(this.date_debut*1000) > new Date()) this.$emit('selectedTab', 1)
          else this.$emit('selectedTab', 3)
        },
        updateCompte(){
            this.openLoadingContained()
            let activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;
            this.comptesData.forEach((value)=>{
                this.update_compte.push(
                {
                    activites_id: activite_courante.id,
                    id: value.id_compte,
                    membres_id: value.id,
                    solde: value.solde,
                    dette_ap: value.dette_ap,
                    dette_ai: value.dette_ai,
                    dette_c: value.dette_c,
                    avoir: value.avoir,
                    interet: value.interet,
                })
            })
            let payload = {
              resourceUrl:"/api/activite/membres/update",
              commitAction: 'SET_ACCOUNT',
              data: this.update_compte
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.selected = []
                this.update_compte = []

                this.$emit('selectedTab', 5)
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.loader = true
              })
            .catch(error => {
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.loader = true
                this.update_compte = []
                this.$vs.notify({
                    position:'top-center',
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
            this.loader = false,
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            });
        },
    },
    created(){
        EventBus.$emit('loader', true);
        if(localStorage.getItem('activity_id') != null){
            var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

            let payload = {
            resourceUrl: '/api/activite/'+activite_courante.id+'/comptes/all',
            commitAction: 'SET_ACCOUNTS'
            }

            this.$store.dispatch("association/fetchComptemembreActivite", payload)
            .then(() => {
                this.isReady = true; EventBus.$emit('loader', false)
            })
            .catch((error) => {
              window.console.error(error); this.isReady = true;
            })
        }
        else
          EventBus.$emit('loader', false); this.isReady = true;
    }
}
</script>
<style lang="scss">
    .text-center {
        .vs-input--input {
            .normal {
                text-align: center !important;
            }
        }
    }
    /* .vs-table--content {
        width: 100%;
        overflow: auto;
        margin-top: -13px;
    } */
</style>
