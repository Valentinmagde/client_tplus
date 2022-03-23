<template>
    <div>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;" />
        <vx-card v-if="comptesData.length == 0">
          <p>{{$t('noElementFound')}}</p>
        </vx-card>
        <div v-else class="pt-16">
            <div id="data-list-list-view" class="data-list-container">

                <Data-view-sidebar
                    :isSidebarActive="addNewDataSidebar"
                    @closeSidebar="toggleDataSidebar"
                    :data="sidebarData"
                    :etat="etat"
                    :activity="activite"
                    />

                <vs-table ref="table" pagination :max-items="itemsPerPage" :data="comptesData" search class="mt-4">
                    <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                            <!-- ADD NEW -->
                            <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary" @click="addNewData('AllouerSomme')">
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
                        <vs-th sort-key="interests"> {{$t('interests') | CAPITALIZE }} </vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <tbody>
                            <vs-tr :data="member" v-for="member in data" :key="member.id" @click="selectMember(event, member.id)">
                                <vs-td>
                                    <p class="product-name font-medium truncate">
                                        {{ member.membre }}
                                    </p>
                                </vs-td>
                                <vs-td>
                                    <money v-model="member.solde" v-bind="money" class="money-input text-center w-full" />
                                </vs-td>
                                <vs-td>
                                    <money v-model="member.dette_ap" v-bind="money" class="money-input text-center w-full" />
                                </vs-td>
                                <vs-td>
                                    <money v-model="member.dette_ai" v-bind="money" class="money-input text-center w-full" />
                                </vs-td>
                                <vs-td>
                                    <money v-model="member.dette_c" v-bind="money" class="money-input text-center w-full" />
                                </vs-td>
                                <vs-td>
                                    <money v-model="member.avoir" v-bind="money" class="money-input text-center w-full" />
                                </vs-td>
                                <vs-td>
                                    <money v-model="member.interet" v-bind="money" class="money-input text-center w-full" />
                                </vs-td>
                            </vs-tr>
                        </tbody>
                    </template>
                </vs-table>
                <div class="flex flex-wrapper justify-end mt-6 mr-6">
                    <vs-button class="ml-3 vs-con-loading__container" ref="loadableButton" id="button-with-loading" @click="updateCompte">
                        {{$t('update')}}
                    </vs-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Money
} from 'v-money'
import DataViewSidebar from '../../../components/sidebar/DataViewSidebar.component'

// Store
// import moduleCompte from "@/store/compte/moduleCompte.js"

export default {
    data() {
        return {
            selected: [],
            update_compte: [],
            type_tontine: '',
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
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true
        }
    },
    components: {
        Money,
        DataViewSidebar
    },
    computed: {
        comptesData() {
            let comptes = this.$store.state.association.accounts

            var data = []
            comptes.forEach((value) => {
                data.push({
                        id: value.membres_id,
                        membre: value.membre,
                        id_compte: value.id,
                        solde: value.solde ? value.solde : 0.00,
                        dette_ai: value.dette_ai ? value.dette_ai : 0.00,
                        dette_ap: value.dette_ap ? value.dette_ap : 0.00,
                        dette_c: value.dette_c ? value.dette_c : 0.00,
                        avoir: value.avoir ? value.avoir : 0.00,
                        interet: value.interet ? value.interet : 0.00
                    }

                )
            })

            return data
        },
        currentPage() {
            if (this.isMounted) {
                if (this.$refs.table != undefined)
                    return this.$refs.table.currentx
                else return 1
            }
            return 0
        },
        queriedItems() {
            return this.$refs.table ? this.$refs.table.queriedResults.length : this.comptesData.length
        }
    },
    mounted() {
        this.isMounted = true;
    },
    methods: {
        addNewData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.activite = this.$store.state.association.activite
            this.toggleDataSidebar(true)
        },

        //Redirige sur la liste des activités
        redirectActivities(tr){
            let route, activity_type = tr.type

            switch (activity_type) {
                case "Generique":
                    route = 'association:administration:activities:generic:details'
                    break;
                case "caisse":
                    route = 'association:administration:activities:generic:details'
                    break;

                case "Tontine":
                    route = 'association:administration:activities:tontine:details'
                    break;

                case "Evenement":
                    route = 'association:administration:activities:event:details'
                    break;

                case "Mutuelle":
                    route = 'association:administration:activities:mutual:details'
                    break;

                case "Solidarite":
                    route = 'association:administration:activities:solidarity:details'
                    break;

                default:
                    break;
            }

            this.$router.push({name: route}).catch(() => {})
        },

        updateCompte() {
            this.openLoadingContained()

            if(localStorage.getItem('activity_id')){
                let activite_courante = this.$store.state.association.activite
                this.comptesData.forEach((value) => {
                    this.update_compte.push({
                        activites_id: activite_courante.id,
                        id: value.id_compte,
                        membres_id: value.id,
                        solde: value.solde,
                        dette_ai: value.dette_ai,
                        dette_ap: value.dette_ap,
                        dette_c: value.dette_c,
                        avoir: value.avoir,
                        interet: value.interet
                    })
                })
                let payload = {
                    resourceUrl: "/api/activite/membres/update",
                    commitAction: 'SET_ACCOUNT',
                    data: this.update_compte
                }
                this.$store.dispatch("association/postRequest", payload)
                    .then(() => {
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        this.loader = true
                        this.selected = []
                        this.update_compte = []

                        this.redirectActivities(activite_courante)
                    })
                    .catch(error => {
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        this.loader = true
                        this.update_compte = []
                        this.$vs.notify({
                            position: 'top-center',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            }

        },

        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
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
        if (localStorage.getItem('activity_id') != null) {

          let activity_id =  localStorage.getItem('activity_id');
          let association_id =  this.$store.state.association.currentAssociation.id

          let payload = {
              resourceUrl:"api/association/"+association_id+"/activite/"+activity_id,
              commitAction: 'SET_ACTIVITE',
          }

          this.$store.dispatch("association/fetchAssociationactivite", payload)
          .then((res) => {
            let activity_id = res.data.data.id
            let payload = {
                resourceUrl: '/api/activite/' + activity_id + '/comptes/all',
                commitAction: 'SET_ACCOUNTS'
            }
            this.$store.dispatch("association/fetchComptemembreActivite", payload)
            .then(() => {
            })
            .catch((err)=>{
                window.console.error(err)
            })
          })
        }
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
