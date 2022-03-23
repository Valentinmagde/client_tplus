<template>
<div>
    <!-- Création d'un cycle -->
    <vx-card no-shadow v-if="createNewCycleForms" :title="$t('creationOfNewCycle')">
        <div class="ep-association">
            <!-- Durée -->
            <span class="flex">
                <p class="vs-input--label inline-block">{{$t('cycleTime')+' *'}}</p>
                <p class="vs-input--label inline-block">
                    <vx-tooltip :text="$t('valueMostBeLessThanOrEqualTo18')" position="right" class="inline-block">
                        <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
                    </vx-tooltip>
                </p>
            </span>
            <vx-input-group class="w-full">
                <vs-input type="number" v-model="cycle.duree" size="medium" :min="1" :max="18" @keydown="filterKey" @input="checkCycleTime" />
                <template slot="append">
                    <div class="append-text bg-primary">
                        <span>{{$t('month')}}</span>
                    </div>
                </template>
            </vx-input-group>
            <!-- Frequence -->
            <p class="vs-input--label mt-5">{{$t('frequencyOfMeeting')+' *'}}</p>
            <v-select label="text" :options="selectOptionsFrequence" v-model="cycle.seance" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full" />
            <!-- Jour de la semaine -->
            <span v-if="cycle.seance.value === '1-WEEKLY' || cycle.seance.value === '2-WEEKLY'">
                <p class="vs-input--label mt-5">
                    {{$t('dayOfWeek')+' *'}}
                </p>
                <v-select label="text" :options="selectOptionsJourSemaine" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="cycle.semaine" class="w-full" id="s_semaine" />
            </span>
            <!-- Jours du mois -->
            <span v-if="cycle.seance.value !== '1-WEEKLY' && cycle.seance.value !== '2-WEEKLY'
                        && cycle.ordre.value === 'JM' && cycle.mois.value !== 'JS'">

                <p class="vs-input--label mt-5">{{$t('monthDay')+' *'}}</p>
                <v-select label="text" :options="selectOptionsJourMois" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="cycle.mois" id="jourmois" class=" w-full" />
            </span>

            <div class="vx-row" v-if="cycle.ordre.value !== 'JM' && cycle.seance.value === '1-MONTHLY'
                        || cycle.ordre.value !== 'JM' && cycle.seance.value === '2-MONTHLY'
                        || cycle.ordre.value !== 'JM' && cycle.seance.value === '3-MONTHLY'
                        || cycle.ordre.value !== 'JM' && cycle.seance.value === '4-MONTHLY'
                        || cycle.ordre.value !== 'JM' && cycle.seance.value === '5-MONTHLY'
                        || cycle.ordre.value !== 'JM' && cycle.seance.value === '6-MONTHLY'
                        || cycle.mois.value === 'JS'">

                <div class="vx-col sm:w-1/2 w-full">
                    <!-- Ordre de la semaine -->
                    <p class="vs-input--label mt-5">{{$t('orderOfWeek')+' *'}}{{initialize}}</p>
                    <v-select label="text" :options="selectOptionsOrdreSemaine" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="cycle.ordre" class="w-full" id="ordresemaine" @input="reinitialize" />
                </div>
                <div class="vx-col sm:w-1/2 w-full">
                    <!-- Jours de la semaine -->
                    <p class="vs-input--label mt-5">{{$t('dayOfWeek')+' *'}}</p>
                    <v-select label="text" :options="selectOptionsJourSemaine" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="cycle.semaine" class="w-full" id="m_semaine" />
                </div>
            </div>

            <!-- TYPE ASSEMBLEE -->
            <p class="vs-input--label mt-5">{{$t('typeOfMeeting')+' *'}}</p>
            <v-select label="text" v-model="cycle.type" :options="selectOptionsTypeAssemblee" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full" />

            <!-- LIEU AG -->
            <vs-input v-if="cycle.type.value=='fixe'" :label="$t('location')" v-model="cycle.lieu" class="w-full mt-5" />

            <!-- DATE PREMIERE RENCONTRE -->
            <p class="vs-input--label mt-5">{{$t('firstMeetingDate')+' *'}}</p>
            <flat-pickr v-model="cycle.date_premiere_assemblee" class="w-full" />

            <!-- HEURE RENCONTRE -->
            <p class="vs-input--label mt-5">{{$t('assemblyTime')+' *'}}</p>
            <flat-pickr :config="configdateTimePicker" v-model="cycle.heure_assemblee" class="w-full" />

            <!--PARTICIPATION RECEPTION  -->
            <!-- <p class="vs-input--label mt-5">{{$t('amountContribution')}}</p>
                <money
                    v-model="cycle.participation_reception"
                    class="w-full money-input"
                    v-bind="money"/> -->

            <!-- SANCTION RETARD -->
            <p class="vs-input--label mt-5">{{$t('latePenalty')}}</p>
            <money v-model="cycle.sanction_retard" class="w-full money-input" v-bind="money" />

            <!-- SANCTION ABSCENCE-->
            <p class="vs-input--label mt-5">{{$t('abscencePenalty')}}</p>
            <money v-model="cycle.sanction_abscence" class="w-full money-input" v-bind="money" />
        </div>
        <div class="flex flex-wrapper mt-6">
            <vs-button id="button-with-loading" @click="openLoadingContained();createACycle();" :disabled="!isFormValid">
                {{$t('creatNewCycle')}}
            </vs-button>
        </div>
    </vx-card>
    <!-- /Fin Création d'un cycle -->
</div>
</template>

<script>
import GenerateAg from './GenerateAgs.component.vue'
//Importation des constantes pour ajouter un cycles
import {
    jour_semaine
} from "../services/data/weekDays"
import {
    ordre_semaine
} from "../services/data/weekOrder"
import {
    jour_mois
} from "../services/data/monthDays"
import {
    type_assemblee
} from "../services/data/assemblyTypes"
import {
    frequence_seance
} from "../services/data/sessionFrequency"

import vSelect from 'vue-select'
import VueTimepicker from 'vuejs-timepicker'
import flatPickr from 'vue-flatpickr-component';
import {
    Money
} from 'v-money'

export default {
    props: ['cycle_actif'],
    components: {
        flatPickr,
        vSelect,
        VueTimepicker,
        Money,
        GenerateAg,
    },
    data() {
        return {
            star: '*',
            cycle: {
                lieu: '',
                duree: '',
                seance: '',
                ordre: {
                    text: this.$t("first"),
                    value: "1"
                },
                semaine: {
                    text: this.$t("monday"),
                    value: "1",
                },
                mois: {
                    text: "01",
                    value: "1"
                },
                type: '',
                frequence_seance: frequence_seance,
                type_assemblee: type_assemblee,
                date_premiere_assemblee: '',
                heure_assemblee: '0',
                participation_reception: 0,
                sanction_retard: 0,
                sanction_abscence: 0,
                frais_inscription: '',
                date_lim_frais_insc: '',
                jour_semaine: jour_semaine,
                jour_mois: jour_mois,
                ordre_semaine: ordre_semaine
            },

            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false
            },
            backgroundLoading: 'primary',
            colorLoading: '#fff',

            configdateTimePicker: {
                time_24hr: true,
                enableTime: true,
                enableSeconds: false,
                noCalendar: true
            },
            createNewCycleForms: true,
            cycle_cree: this.cycleData,
            disable: true
        }
    },
    computed: {
        selectOptionsFrequence() {
            return frequence_seance.map(frequence => ({
                text: this.$t(frequence.i18n),
                value: frequence.value
            }))
        },
        selectOptionsTypeAssemblee() {
            return type_assemblee.map(type => ({
                text: this.$t(type.i18n),
                value: type.value
            }))
        },
        selectOptionsOrdreSemaine() {
            return ordre_semaine.map(ordre => ({
                text: this.$t(ordre.i18n),
                value: ordre.value
            }))
        },
        selectOptionsJourSemaine() {
            return jour_semaine.map(jour => ({
                text: this.$t(jour.i18n),
                value: jour.value
            }))
        },
        selectOptionsJourMois() {
            return jour_mois.map(jour => ({
                text: this.$t(jour.i18n),
                value: jour.value
            }))
        },
        isFormValid() {
            return !this.errors.any() && this.cycle.duree && this.cycle.seance && this.cycle.type &&
                this.cycle.date_premiere_assemblee && this.disable
        },
        cycleData() {
            return this.$store.state.association.cycle
        },
        initialize() {
            return this.reinitialize()
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
        //Verifie si la duree du cycle est superieur à 18
        checkCycleTime() {
            if (parseInt(this.cycle.duree) > 18) {
                this.cycle.duree = ''
            }
        },
        //Reinitialiser les variables
        reinitialize() {
            if (this.cycle.ordre.value == 'JM' && this.cycle.mois.value == 'JS') {
                this.cycle.ordre = {
                        text: this.$t("first"),
                        value: "1"
                    },
                    this.cycle.mois = {
                        text: "01",
                        value: "1"
                    }
            }
        },
        //Créer un cycle
        createACycle() {
            var current_association = this.$store.state.association.currentAssociation

            var s_semaine = document.getElementById('s_semaine');
            var m_semaine = document.getElementById('m_semaine');
            var jourmois = document.getElementById('jourmois');
            var ordresemaine = document.getElementById('ordresemaine');

            var date_string = new Date(this.cycle.date_premiere_assemblee).toDateString()

            var date_assemblee = new Date(date_string + ' ' + this.cycle.heure_assemblee + ' GMT' + current_association.fuseau_horaire)

            var date_assemblee_utc = date_assemblee.getTime() / 1000

            if (m_semaine != null || s_semaine != null) s_semaine = this.cycle.semaine.value
            else if (m_semaine == null && this.cycle.mois.value == "-1" ||
                s_semaine == null && this.cycle.mois.value == "-1")
                s_semaine = 8
            else s_semaine = 0

            if (jourmois == null || this.cycle.mois.value == "-1") jourmois = 0
            else jourmois = this.cycle.mois.value

            if (ordresemaine == null && this.cycle.mois.value != "-1") ordresemaine = 0
            else if (ordresemaine == null && this.cycle.mois.value == "-1") ordresemaine = "-1"
            else ordresemaine = this.cycle.ordre.value

            let payload = {
                resourceUrl: "/api/association/" + current_association.id + "/cycle",
                commitAction: 'SET_CYCLE',
                data: {
                    duree_cycle: this.cycle.duree,
                    frequence_seance: this.cycle.seance.value,
                    type_assemblee: this.cycle.type.value,
                    date_premiere_assemblee: date_assemblee_utc,
                    heure_assemblee: this.cycle.heure_assemblee,
                    participation_reception: this.cycle.participation_reception,
                    sanction_retard: this.cycle.sanction_retard,
                    sanction_abscence: this.cycle.sanction_abscence,
                    jour_semaine: s_semaine,
                    jour_mois: jourmois,
                    ordre_semaine: ordresemaine,
                    lieu_fixe_ag: this.cycle.lieu
                }
            }

            this.$store.dispatch("association/postRequest", payload)
                .then((res) => {
                    if (res.data.status == 'OK') {
                        //Données pour recuperer la liste des cycles
                        let cyclePayload = {
                            resourceUrl: "/api/association/" + current_association.id + "/cycle",
                            commitAction: 'SET_CYCLES'
                        }
                        //Lire la liste des cycles
                        this.$store.dispatch("association/fetchCycles", cyclePayload)
                            .then((res) => {
                                var cycles = res.data.data
                                this.cycle_cree = cycles[cycles.length - 1]

                                this.$emit('cycle_actif', this.cycle_cree)
                            })
                        /* .catch(err => { window.console.error(err) }) */
                        this.disable = true
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        this.createNewCycleForms = false
                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('cycleSuccessfullyCreated'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })
                    }
                })
                .catch(error => {
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.disable = true
                    this.$vs.notify({
                        position: 'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
        openLoadingContained() {
            this.disable = false,
                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading",
                    scale: 0.45
                });
        },
    }
}
</script>
