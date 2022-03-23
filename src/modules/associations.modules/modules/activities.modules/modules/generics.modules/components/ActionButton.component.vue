<template>
<div>
    <vs-dropdown vs-trigger-click class="ml-auto md:block cursor-pointer fixed z-50" style="right:35px">
        <vs-button icon="icon-settings" icon-pack="feather">{{$t('actions')}}</vs-button>

        <vs-dropdown-menu class="w-54">
            <!-- Tableau de bord -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/generic/details').catch(() => {})">
                    <!-- <feather-icon icon="HomeIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('Dashboard')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Echéances -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/generic/settlements').catch(() => {})">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('settlement')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Impayés -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/generic/debt').catch(() => {})">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('debt')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Transactions -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="redirectTransactions">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('transactions')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Notes -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/generic/notes').catch(() => {})">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('notes')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Ajouter un avoir -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="addNewData('AjoutAvoir')">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('addAssets')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Retrait d'argent  -->
            <vs-dropdown-item v-if="etat_activite != 'cloture'">
                <div class="flex items-center" @click="sendData('RetraitArgent')">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('saveExpense')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Decaissement -->
            <vs-dropdown-item v-if="etat_activite != 'cloture'">
                <div class="flex items-center" @click="$router.push('/association/administration/activities/generic/disbursement').catch(() => {})">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('memberDisbursement')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Demande de cotisation -->
            <vs-dropdown-item v-if="etat_activite != 'cloture'">
                <div @click="$router.push('/association/administration/activities/generic/ask-for-contribution').catch(() => {})" class="flex items-center">
                    <!-- <feather-icon icon="DollarSignIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('askForBond')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Activer -->
            <vs-divider class="my-1" />
            <vs-dropdown-item v-if="etat_activite != 'actif' && etat_activite != 'cloture'">
                <div class="flex items-center" @click=" activerActivite">
                    <!-- <feather-icon icon="ToggleRightIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('activate')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Mettre à jour -->
            <vs-dropdown-item v-if="etat_activite != 'actif' && etat_activite != 'cloture'">
                <div @click="redirectUpdate" class="flex items-center">
                    <!-- <feather-icon icon="EditIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('update')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Clôturer -->
            <vs-dropdown-item v-if="etat_activite != 'cloture'">
                <div @click="redirectClose" class="flex items-center">
                    <!-- <feather-icon icon="EditIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('cloturer')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Lister -->
            <vs-dropdown-item>
                <div @click="$router.push('/association/administration/activities/generic/all').catch(() => {})" class="flex items-center">
                    <!-- <feather-icon icon="ListIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('list')}}</span>
                </div>
            </vs-dropdown-item>

            <vs-divider class="my-1" />

            <!-- Toutes les activité -->
            <vs-dropdown-item>
                <div class="flex items-center mb-3" @click="$router.push('/association/administration/activities').catch(() => {})">
                    <!-- <feather-icon icon="ToggleRightIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('allActivities')}}</span>
                </div>
            </vs-dropdown-item>
        </vs-dropdown-menu>
    </vs-dropdown>
    <Data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" :etat="etat" :activity="activity"/>
</div>
</template>

<script>
import DataViewSidebar from '../../../../../components/sidebar/DataViewSidebar.component'
//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    props: ['activity'],

    data() {
        return {
            etat_activite: '',
            // Data Sidebar
            addNewDataSidebar: false,
            sidebarData: {},
            etat: '',
        }
    },
    components: {
        DataViewSidebar
    },
    methods: {
        addNewData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.toggleDataSidebar(true)
        },

        sendData(etat) {
            this.etat = etat
            this.sidebarData = {}
            this.toggleDataSidebar(true)
        },

        //Redirige vers la pages des transactions
        redirectTransactions() {
          let payload = {
            resourceUrl: '/api/activite/' + this.activity.id + '/comptes/all',
            commitAction: 'SET_ACCOUNTS'
          }

          this.$store.dispatch("association/fetchComptemembreActivite", payload)
          .then((res) => {
            let comptes = res.data.data

            if (comptes.length > 0) {
                let transactions = []

                comptes.forEach(element => {
                    if (element.transactions.length > 0) {
                        element.transactions.forEach(transaction => {
                            transactions.push({
                                comptes_id: transaction.comptes_id,
                                created_by: transaction.created_by,
                                date_created: transaction.date_created,
                                debit_credit: transaction.debit_credit,
                                etat: transaction.etat,
                                id: transaction.id,
                                libelle: transaction.libelle,
                                montant: transaction.montant,
                                montant_attendu: transaction.montant_attendu,
                                operations_id: transaction.operations_id,
                                membre: element.membre,
                                membres_id: element.membres_id,

                            })
                        })
                    }

                })

                this.$store.commit('association/SET_TRANSACTIONS', transactions)
                // Remove member_id to trigger the printing of all transactions
                this.$store.commit('association/SET_ACCOUNT', '')
                this.$store.commit('association/SET_MEMBER', null)
                localStorage.removeItem('member_id')
            }
            this.$router.push('/association/administration/activities/generic/member-transactions')

          })
        },
        //Activer l'activite
        activerActivite() {
            var association_courante = this.$store.state.association.currentAssociation
            var activite_courante = this.activity

            let payload = {
                resourceUrl: 'api/association/' + association_courante.id + '/activite/' + activite_courante.id + '/state/actif',
                commitAction: 'SET_ACTIVITES'
            }
            this.$store.dispatch('association/fetchAssociationactivite', payload)
                .then(() => {
                    activite_courante.etat = 'actif'
                    this.$store.commit('association/SET_ACTIVITE', activite_courante)

                    // localStorage.setItem('activite_parameter', JSON.stringify(activite_courante))
                    this.etat_activite = activite_courante.etat
                    this.$vs.notify({
                        position: 'top-center',

                        text: this.$t('activityActivatedSuccessfully'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                })
                .catch((error) => {
                    this.$vs.notify({
                        position: 'top-center',
                        title: 'error',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },

        //Desactiver l'activite
        desactiverActivite() {
            var association_courante = this.$store.state.association.currentAssociation
            var activite_courante = this.activity

            let payload = {
                resourceUrl: 'api/association/' + association_courante.id + '/activite/' + activite_courante.id + '/state/inactif',
                commitAction: 'SET_ACTIVITES'
            }
            this.$store.dispatch('association/fetchAssociationactivite', payload)
                .then(() => {
                    activite_courante.etat = 'inactif'
                    this.$store.commit('association/SET_ACTIVITE', activite_courante)

                    // localStorage.setItem('activite_parameter', JSON.stringify(activite_courante))
                    this.etat_activite = activite_courante.etat
                    this.$vs.notify({
                        position: 'top-center',

                        text: this.$t('notifContent'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                })
                .catch((error) => {
                    this.$vs.notify({
                        position: 'top-center',
                        title: 'error',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
        //Redirection vers la page de modification de l'activité'
        redirectUpdate() {
            localStorage.setItem('activity_id', JSON.stringify(this.activity.id))
            this.$router.push({
                name: 'association:administration:activity:generic:edit',
            })
        },

        //Redirection vers la page de clôture de l'activité'
        redirectClose() {
            var activite_cloture = this.activity

            localStorage.setItem('activity_id', JSON.stringify(activite_cloture.id))
            this.$router.push(`/association/administration/activities/${activite_cloture.id}/closure`)
        },

        toggleDataSidebar(val = false) {
            this.addNewDataSidebar = val
        }
    },
    created() {
        // if (!moduleActivite.isRegistered) {
        //     this.$store.registerModule('activite', moduleActivite)
        //     moduleActivite.isRegistered = true
        // }

        let activite_courante = this.$store.state.association.currentAssociation

        this.etat_activite = activite_courante.etat
    }
}
</script>
