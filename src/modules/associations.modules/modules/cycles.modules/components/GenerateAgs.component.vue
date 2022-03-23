<template>
<vx-card no-shadow :title="$t('creationOfNewCycle')">
    <table class="w-full table-fixed border-collapse z-10">
        <tr v-if="cycle_actif.ag!=null && cycle_actif.ag.length > 0 && !agsGenerate">
            <td>
                {{$t('startDate')}}
            </td>
            <td>
                {{date(cycle_actif.ag[0].date_ag)}}
            </td>
        </tr>
        <tr v-if="cycle_actif.ag!=null && cycle_actif.ag.length > 0 && !agsGenerate">
            <td>
                {{$t('endDate')}}
            </td>
            <td>
                {{date(cycle_actif.ag[cycle_actif.ag.length-1].date_ag)}}
            </td>
        </tr>
        <tr v-if="agsGenerate">
            <td>
                {{$t('startDate')}}
            </td>
            <td>
                {{date(agsGenerate[0].date_ag)}}
            </td>
        </tr>
        <tr v-if="agsGenerate">
            <td>
                {{$t('endDate')}}
            </td>
            <td>
                {{date( agsGenerate[agsGenerate.length-1].date_ag)}}
            </td>
        </tr>
        <tr>
            <td>
                {{$t('typeOfMeeting')}}
            </td>
            <td>
                {{afficheTypeAssemblee(cycle_actif.cycle.type_assemblee)}}
            </td>
        </tr>
        <tr v-if="agsGenerate">
            <td>
                {{$t('meetingTime')}}
            </td>
            <td>
                {{ dateTime(agsGenerate[0].date_ag)}}
            </td>
        </tr>
        <tr v-if="cycle_actif.cycle.type_assemblee =='fixe'">
            <td>
                {{$t('location')}}
            </td>
            <td>
                {{ cycle_actif.cycle.lieu_fixe_ag}}
            </td>
        </tr>
        <!-- <tr>
                    <td>
                        {{$t('amountContribution')}}
                    </td>
                    <td :class="{redtextclass: cycle_actif.cycle.participation_reception < 0}">
                        {{formatMoney(cycle_actif.cycle.participation_reception)}}
                    </td>
                </tr> -->
        <tr>
            <td>
                {{$t('latePenalty')}}
            </td>
            <td :class="{redtextclass: cycle_actif.cycle.sanction_retard < 0}">
                {{ (cycle_actif.cycle.sanction_retard) | formatMoney(devise) }}
            </td>
        </tr>
        <tr>
            <td>
                {{$t('abscencePenalty')}}
            </td>
            <td :class="{redtextclass: cycle_actif.cycle.sanction_abscence < 0}">
                {{ (cycle_actif.cycle.sanction_abscence) | formatMoney(devise) }}
            </td>
        </tr>
    </table>

    <p class="mt-8">
        <span v-if="agsGenerate">
            <!-- AGs ayant pour interval le mois -->
            <span v-if="cycle_actif.cycle.jour_semaine > 0 && cycle_actif.cycle.ordre_semaine != 0
                    && cycle_actif.cycle.jour_semaine < 8">
                {{$t('generalMeetingsAreHeld')}} {{$t('The') | small }}
                {{ordreJour(cycle_actif.cycle.ordre_semaine) | small }}
                {{jourAg(cycle_actif.cycle.jour_semaine) | small }} {{$t('of') | small }}
                {{$t(cycle_actif.cycle.frequence_seance) | small }},
                {{$t('from')}} {{date(agsGenerate[0].date_ag)}}{{$t('atTime')}}
                {{ dateTime(agsGenerate[0].date_ag)}} {{$t('until')}}
                {{date( agsGenerate[agsGenerate.length-1].date_ag)}}{{$t('atTime')}}
                {{ dateTime(agsGenerate[0].date_ag)}}
            </span>

            <!-- AGs ayant pour interval la semaine -->
            <span v-else-if="cycle_actif.cycle.jour_semaine > 0 && cycle_actif.cycle.jour_semaine < 8">
                {{$t('generalMeetingsAreHeld')}} {{$t('The') | small }}
                {{jourAg(cycle_actif.cycle.jour_semaine) | small }} {{$t('of') | small }}
                {{$t(cycle_actif.cycle.frequence_seance) | small }},
                {{$t('from')}} {{date(agsGenerate[0].date_ag)}}{{$t('atTime')}}
                {{ dateTime(agsGenerate[0].date_ag)}}
                {{$t('until')}} {{date( agsGenerate[agsGenerate.length-1].date_ag)}}{{$t('atTime')}}
                {{ dateTime(agsGenerate[0].date_ag)}}
            </span>

            <!-- AGs ayant pour interval le mois et se tenant le jour du mois-->
            <span v-else>
                {{$t('generalMeetingsAreHeld')}} {{$t('The') | small }}
                {{jourMois(cycle_actif.cycle.jour_mois)}} {{$t('of') | small }}
                {{$t(cycle_actif.cycle.frequence_seance) | small }},
                {{$t('from')}} {{date(agsGenerate[0].date_ag)}}{{$t('atTime')}}
                {{ dateTime(agsGenerate[0].date_ag)}} {{$t('until')}}
                {{date( agsGenerate[agsGenerate.length-1].date_ag)}}{{$t('atTime')}}
                {{ dateTime(agsGenerate[0].date_ag)}}
            </span>
        </span>
    </p>
    <div class="flex flex-wrapper mt-6">
        <vs-button class="ml-3 vs-con-loading__container" ref="loadableButton" id="button-with-loading" @click="generateAgs(cycle_actif.cycle.id)" :disabled="agsGenerate || !loader">
            {{$t('generateGeneralMeeting')}}
        </vs-button>
    </div>
</vx-card>
</template>

<script>
import {
    frequence_seance
} from "../services/data/sessionFrequency"
import {
    type_assemblee
} from "../services/data/assemblyTypes"

import i18n from '@/services/i18n/i18n'

import * as moment from 'moment';
import localisation from 'moment/locale/fr';

moment.updateLocale('fr', localisation)

export default {
    props: ['ags', 'cycle_actif'],
    data() {
        return {
            agsGenerate: this.ags,
            devise: '',

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true
        }
    },
    computed: {
        afficheFrequenche() {
            const filtered = frequence_seance.reduce((a, o) => o.value == this.cycle_actif.frequence_seance ? a.concat(o.text) : a, '')
            return filtered.toLowerCase()
        },
    },
    mounted() {
        /* window.console.log('test', this.cycle_actif) */
        this.$emit('cycle_actif', this.cycle_actif)
    },
    methods: {
        afficheTypeAssemblee(type) {
            const filtered = type_assemblee.reduce((a, o) => o.value == type ? this.$t(a.concat(o.i18n)) : a, '')
            return filtered
        },

        //Afficher la date au format Short Date en fonction de la langue, par exemple (23 mars 2020)
        date(date_time) {
            return moment.unix(date_time).format('L')
        },

        //Afficher la date au format Short Date en fonction de la langue, par exemple (23 mars 2020)
        dateTime(date_time) {
            const locale = i18n.locale;
            const options = {
                hour: 'numeric',
                minute: 'numeric'
            };

            let date

            if (locale == 'en') date = new Date(date_time * 1000).toLocaleString('en', options)
            if (locale == 'fr') date = new Date(date_time * 1000).toLocaleString('fr', options)

            return date
        },

        //Retourne l'ordre des jours des ags
        ordreJour(ordre) {
            var ordre_semaine = ['First', 'Second', 'Third', 'Fourth', 'Last']

            /* window.console.log(ordre)
             */
            if (ordre == -1)
                return this.$t(ordre_semaine[4])
            else
                return this.$t(ordre_semaine[ordre - 1])
        },

        //Retourne le jours des ags
        jourAg(jour) {
            var semaine = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

            return this.$t(semaine[jour - 1])
        },
        jourMois(jour) {
            /* window.console.log(jour) */
            if (jour == 1)
                return this.$t('FirstDay').toLowerCase()
            else if (jour == 0)
                return this.$t('LastDay').toLowerCase()
            else
                return jour
        },
        /* Loading */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            });
        },

        //Génération des ags
        generateAgs(cycleId) {
            this.openLoadingContained()

            var current_association = this.$store.state.association.currentAssociation
            let AgPayload = {
                resourceUrl: "/api/association/" + current_association.id + "/cycle/" + cycleId + "/ags",
                commitAction: 'SET_AGS'
            }
            this.$store.dispatch("association/postRequest", AgPayload)
                .then((res) => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    if (res.data.status == 'OK') {
                        // To overwrite the ags value in the parent component when re-renders.
                        /* this.$emit('ags', this.agsGenerate) */

                        //Données pour recuperer la liste des cycles
                        let cyclePayload = {
                            resourceUrl: "/api/association/" + current_association.id + "/cycle",
                            commitAction: 'SET_CYCLES'
                        }
                        //Lire la liste des cycles
                        this.$store.dispatch("association/fetchCycles", cyclePayload)
                            .then((response) => {
                                var cycles = response.data.data
                                this.cycle_cree = cycles[cycles.length - 1]

                                // To overwrite the cycle value in the parent component when re-renders.
                                this.$emit('cycle_actif', this.cycle_cree)

                                // To overwrite the ags value in the parent component when re-renders.
                                this.$emit('ags', this.cycle_cree.ag)
                                this.$emit('selectedTab', 1)
                            })
                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('generalMeetingsSuccessfullyGenerated'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })
                    }
                })
                .catch((error) => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.$vs.notify({
                        position: 'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
    },
    created() {
        let association_courante = this.$store.state.association.currentAssociation

        this.devise = association_courante.devise
    }
}
</script>

<style lang="scss">
table {
    background: #f8f8f8;
    border: 2px solid #f8f8f8;

    .th-bg {
        background-color: #fff;
    }

    tr:nth-child(even) {
        background-color: #fff;
    }

    td {
        padding: 5px;
    }
}

.product-name {
    max-width: 13rem;
}
</style>
