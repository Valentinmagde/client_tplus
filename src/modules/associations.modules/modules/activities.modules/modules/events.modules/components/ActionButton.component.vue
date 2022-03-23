<template>
<div>
    <vs-dropdown vs-trigger-click class="ml-auto md:block cursor-pointer fixed z-50" style="right:35px">
        <vs-button icon="icon-settings" icon-pack="feather">{{$t('actions')}}</vs-button>

        <vs-dropdown-menu class="w-54">
            <!-- Tableau de bord -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/event/details').catch(() => {})">
                    <!-- <feather-icon icon="HomeIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('Dashboard')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Echéances -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/event/settlements').catch(() => {})">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('settlement')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Impayés -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/event/debt').catch(() => {})">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('debt')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Voir les details d'une transaction -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="redirectTransactions">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('transactions')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Notes -->
            <vs-dropdown-item>
                <div class="flex items-center" @click="$router.push('/association/administration/activities/event/notes').catch(() => {})">
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

            <!-- Planifier un decaissement -->
            <vs-dropdown-item v-if="etat_activite != 'cloture'">
                <div class="flex items-center" @click="$router.push('/association/administration/activities/event/disbursement').catch(() => {})">
                    <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('decaissementParams')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Demande de cotisation -->
            <vs-dropdown-item v-if="etat_activite != 'cloture'">
                <div @click="$router.push('/association/administration/activities/event/ask-for-contribution').catch(() => {})" class="flex items-center">
                    <!-- <feather-icon icon="DollarSignIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('askForBond')}}</span>
                </div>
            </vs-dropdown-item>

            <vs-divider class="my-1" />

            <!-- Activer l'activité -->
            <vs-dropdown-item v-if="etat_activite != 'actif' && etat_activite != 'cloture'">
                <div class="flex items-center" @click=" activerActivite">
                    <!-- <feather-icon icon="ToggleRightIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('activate')}}</span>
                </div>
            </vs-dropdown-item>

            <!-- Mettre à jour l'activité -->
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

            <!-- Afficher la liste des activités -->
            <vs-dropdown-item>
                <div @click="$router.push('/association/administration/activities/events/all').catch(() => {})" class="flex items-center">
                    <!-- <feather-icon icon="ListIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                    <span>{{$t('list')}}</span>
                </div>
            </vs-dropdown-item>

            <vs-divider class="my-1" />

            <!-- Afficher toutes les activités -->
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
            this.$router.push('/association/administration/activities/event/member-transactions')

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

        //Redirection vers la page de modification de la tontine
        redirectUpdate() {
            localStorage.setItem('activity_id', JSON.stringify(this.activity.id))
            this.$router.push({
                name: 'association:administration:activity:event:edit',
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

        this.etat_activite = this.$store.state.association.activite.etat
    }
}
</script>
