<template>
<div>
    <div class="ep-association">
        <!-- Membres -->
        <p class="vs-input--label">{{$t('members')+ ' *'}}</p>
        <v-select :options="selectMembersOptions" v-model="membre" label="text" class="w-full mb-5" @onchange="validateForms" />
        <!-- Type Assistance -->
        <p class="vs-input--label">{{$t('typesOfAssistance')+ ' *'}}</p>
        <v-select :options="selectTypeAssistanceOptions" v-model="type_assistance" label="text" class="w-full mb-5" @onchange="validateForms" />

        <!-- Nombre d'assistances cycle courant -->
        <vs-input :label="$t('numberOfCurrentCycleAssistance')" type="number" v-model="nb_assistance" class="w-full mt-5" step="1" min="0" @keydown="filterKey" @onchange="validateForms" />

        <!-- Nombre d'assistances globales -->
        <vs-input :label="$t('numberOfGlobalAssistances')" type="number" v-model="nb_assistance_globale" class="w-full mt-5" step="1" min="0" @keydown="filterKey" @onchange="validateForms" />

        <vs-checkbox v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
            {{$t('addAnother')}}
        </vs-checkbox>
    </div>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';

// Functions
import {
    EventBus
} from '@/services/EventBus.js'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

//Fonctions
import functions from "../../../services/functions.js"

import 'flatpickr/dist/flatpickr.css';

export default {
    props: ['idLoader'],
    data() {
        return {
            selected: [],
            montant: '',
            description: '',
            membre: '',
            type_assistance: '',
            date_evenement: '',
            nb_assistance: 0,
            nb_assistance_globale: 0,
            date_limite_versement: '',
            radios: '',
            popupActivo: false,
            membres: [],
            membresIdChecked: [],
            nom_activite: '',
            ags: null,
            admin: false,

            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            MyConfig: {
                altFormat: "F j, Y",
                dateFormat: "d M Y"
            },
            checkbox_create_another: false,

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,
        }
    },
    components: {
        Money,
        vSelect,
        flatPickr,
    },
    computed: {
        typesAssistancesData() {
            return this.$store.state.association.types_assistances
        },
        comptesData() {
            return this.$store.state.association.accounts
        },
        selectMembersOptions() {
            if (this.comptesData != null) return this.comptesData.map(compte => ({
                id: compte.id,
                text: compte.membre,
                value: compte.membres_id
            }))
        },

        selectTypeAssistanceOptions() {
            if (this.typesAssistancesData != null) return this.typesAssistancesData.map(type => ({
                id: type.id,
                text: type.nom,
                montant: type.montant,
                value: type.id
            }))
        },

        selectOptionsProchainesAgs() {
            var prochaines_ags = []

            if (this.ags != null) {
                this.ags.forEach(element => {
                    if (element.etat != 'past' && element.etat != 'cloture') {
                        prochaines_ags.push(element)
                    }
                });
            }
            if (prochaines_ags.length > 0) return prochaines_ags.map(ag => ({
                id: ag.id,
                text: this.$options.filters.dateTime(ag.date_ag),
                value: ag.date_ag
            }))
        },

        validateForms() {
            if (this.membre != '' && this.type_assistance != '' &&
                this.loader && this.nb_assistance > 0 && this.nb_assistance_globale > 0) return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },
    },
    mounted() {
        if (localStorage.getItem('activity_id') != null) {
            var activite_courante = this.$store.state.association.activite

            this.nom_activite = activite_courante.nom.toUpperCase()
        }

        this.type_assistance = {
            id: this.typesAssistancesData[0].id,
            text: this.typesAssistancesData[0].nom,
            montant: this.typesAssistancesData[0].montant,
            value: this.typesAssistancesData[0].id
        }
    },
    methods: {
        filterKey(e) {
            const key = e.key;

            // If is '.' key, stop it
            if (key === '.')
                return e.preventDefault();

            // OPTIONAL
            // If is 'e' key, stop it
            if (key === 'e' || key === 'E')
                return e.preventDefault();
        },

        // This can also prevent copy + paste invalid character
        filterInput(e) {
            e.target.value = e.target.value.replace(/[^0-9]+/g, '');
        },
        onChange(id, libelle, $event) {
            if ($event.target.checked && !this.membresIdChecked.includes(id)) {
                this.membresIdChecked.push(id)
                this.selected.push(libelle)
            } else if (!$event.target.checked && this.membresIdChecked.includes(id)) {
                var index = this.membresIdChecked.indexOf(id)
                delete this.membresIdChecked[index]
                delete this.selected[index]
            }

        },

        /* Loader */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${this.idLoader}`,
                scale: 0.45
            });
        },
        submit() {
            if (localStorage.getItem('activity_id') !== null) {
                this.openLoadingContained()
                var activite_courante = this.$store.state.association.activite
                let solidarite_courante = activite_courante.Solidarite
                let ags = this.$store.state.association.ags

                let assistances = []

                // Assistances par cycle
                for (let i = 0; i < this.nb_assistance; i++) {
                    assistances.push({
                        date_evenement: new Date().getTime() / 1000,
                        type: this.type_assistance.value,
                        solidarites_id: solidarite_courante.id,
                        montant_alloue: this.type_assistance.montant
                    })
                }

                // Assistances globales
                for (let i = 0; i < this.nb_assistance_globale; i++) {
                    assistances.push({
                        date_evenement: (ags[0].date_ag) - (3600 * 24),
                        type: this.type_assistance.value,
                        solidarites_id: solidarite_courante.id,
                        montant_alloue: this.type_assistance.montant
                    })
                }

                let payload = {
                    resourceUrl: 'api/activite/' + activite_courante.id + '/membre/' + this.membre.value + '/assistances/past',
                    commitAction: 'SET_ASSISTANCES',
                    data: {
                        assistances: assistances
                    }
                }
                this.$store.dispatch('association/postRequest', payload)
                    .then(() => {
                        this.loader = true
                        this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('assistanceSuccessfullyCreated'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })
                        if (!this.checkbox_create_another) {
                            this.$emit('isSidebarActiveLocal', false)
                        }
                        this.nb_assistance = ''

                        /* Page loader */
                        EventBus.$emit('loader', true)

                        let payload = {
                            resourceUrl: 'api/activite/' + activite_courante.id + '/assistances',
                            commitAction: 'SET_ASSISTANCES'
                        }
                        this.$store.dispatch('association/fetchAssociationactivite', payload)
                            .then(() => {
                                EventBus.$emit('loader', false)
                            })
                            .catch((error) => {
                                EventBus.$emit('loader', false)
                                window.console.error(error)
                            })
                    })
                    .catch(error => {
                        this.loader = true
                        this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
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
    },
    created() {
        var current_association = this.$store.state.association.currentAssociation

        if (localStorage.getItem('activity_id') !== null) {
            let activite_courante = this.$store.state.association.activite

            let payload = {
                resourceUrl: '/api/activite/' + activite_courante.id + '/comptes/all',
                commitAction: 'SET_ACCOUNTS'
            }

            this.$store.dispatch("association/fetchComptemembreActivite", payload)
                .then((res) => {
                    let comptes = res.data.data

                    if (comptes.length > 0) {
                        this.membre = {
                            text: comptes[0].membre,
                            value: comptes[0].membres_id
                        }
                    }
                    let payload = {
                        resourceUrl: '/api/association/' + current_association.id + '/cycle',
                        commitAction: 'SET_CYCLES'
                    }
                    this.$store.dispatch("association/fetchCycles", payload)
                        .then((res) => {
                            let donnees = res.data
                            //Verifier s'il ya des cycles dans l'association
                            if (donnees.data.length > 0) {
                                //Nous voullons reccuperer les cycles cloturés et le cycle actif de l'association
                                var cycle = donnees.data
                                var cycleActif = functions.afficherCycleActif(cycle)

                                //Assignation du cycle actigf à notre variable utilisée dans le template
                                if (cycleActif != null) {
                                    //Assigner les ags du cycle actigf à la variable ags s'il en existe
                                    if (cycleActif.ag.length > 0) this.$store.commit('association/SET_AGS', cycleActif.ag)
                                }
                            }

                            let association_courante = this.$store.state.association.currentAssociation

                            let payload = {
                                resourceUrl: "/api/association/" + association_courante.id + "/types/assistances",
                                commitAction: 'SET_TYPES_ASSISTANCES'
                            }
                            this.$store.dispatch("association/fetchAssociationactivite", payload)
                                .catch((error) => {
                                    window.console.error(error)
                                })

                        })
                        .catch((error) => {
                            window.console.error(error);
                        })
                })
                .catch((error) => {
                    window.console.error(error);
                })
        }
    },
}
</script>

<style lang="css">
.select-member-btn {
    padding-top: 3px !important;
    padding-bottom: 3px !important;
}
</style>
