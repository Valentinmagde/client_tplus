<template>
<div v-if="loading">
    <vx-card no-shadow v-if="rapportExist" :title="$t('sessionOf')+' '+ date(date_seance)">
        <table class="w-full table-fixed border-collapse z-10 mb-base">
            <tr>
                <td>
                    {{$t('hote_')}}
                </td>
                <td>
                    {{rapportData.hote.text || rapportData.hote}}
                </td>
            </tr>
            <tr>
                <td>
                    {{$t('president')}}
                </td>
                <td>
                    {{rapportData.presidence.text}}
                </td>
            </tr>
            <tr>
                <td>
                    {{$t('secretaire_')}}
                </td>
                <td>
                    {{rapportData.secretaire.text}}
                </td>
            </tr>
            <tr>
                <td>
                    {{$t('location')}}
                </td>
                <td>
                    {{rapportData.lieu}}
                </td>
            </tr>
            <tr>
                <td>
                    {{$t('effectiveDate')}}
                </td>
                <td>
                    {{ (rapportData.date_effective) | dateTime }}
                </td>
            </tr>
            <tr v-if="rapportData.jitsi_room">
                <td>
                    {{$t('videoConferenceLink')}}
                </td>
                <td>
                    <p class="link-color hover:italic cursor-pointer" @click="openJitsiRoom(rapportData.jitsi_room)">{{rapportData.jitsi_room}}</p>
                </td>
            </tr>
        </table>

        <div class="flex flex-wrapper mt-6">
            <vs-button
                v-if="roles.includes('Administrateur') && $router.currentRoute.path.startsWith('/association/administration/sessions/')"
                class="mr-6" type="border" @click.stop="() => addNewDataSidebar = !addNewDataSidebar">
                {{$t('update')}}
            </vs-button>

            <vs-button @click.native="next">
                {{$t('next')}}
            </vs-button>
        </div>

    </vx-card>

    <vx-card no-shadow v-else-if="!rapportExist && roles.includes('Administrateur') && $router.currentRoute.path.startsWith('/association/administration/sessions/') " :title="$t('sessionOf')+' '+date(date_seance)">
        <div>

            <!-- Hote -->
            <p class="vs-input--label mt-4">{{$t('hote_')}}</p>
            <v-select label="text" :options="selectOptions" class="w-full select-list" v-model="multipleValue.hote" />

            <!-- President -->
            <p class="vs-input--label mt-5">{{$t('president')}}</p>
            <v-select label="text" :options="selectOptions" class="w-full select-list" v-model="multipleValue.presidence" />

            <!-- Secretaire -->
            <p class="vs-input--label mt-5">{{$t('secretaire_')}}</p>
            <v-select label="text" :options="selectOptions" class="w-full select-list" v-model="multipleValue.secretaire" />

            <!-- Lieu -->
            <vs-input :label="$t('lieu_')" v-model="multipleValue.lieu" class="w-full mt-5" />

            <!-- Date -->
            <p class="vs-input--label mt-5">{{$t('date')}}</p>
            <flat-pickr :config="MyConfig" v-model="multipleValue.date_effective" class="w-full" />

            <!-- Génération du lien de visioconférence-->
            <vs-checkbox v-model="checkbox_jitsi" class="mt-6" style="margin-left: -1px">
                {{$t('generateAVideoconferenceLink')}}
            </vs-checkbox>

            <div class="flex flex-wrapper mt-6">
                <vs-button class="mr-6" type="border" @click.native="cancel" :disabled="validateForm">
                    {{$t('cancel')}}
                </vs-button>

                <vs-button class="mr-6" @click.native="save" :disabled="validateForm">
                    {{$t('next')}}
                </vs-button>
            </div>
        </div>

    </vx-card>

    <!-- Modifier les parametres de la séance -->
    <data-view @closeSidebar="toggleDataSidebar" :isSidebarActive="addNewDataSidebar" :data="emptyData">
        <h4 slot="title">{{ $t('meetingSession') | CAPITALIZE }}</h4>

        <template slot="component">
            <!-- Hote -->
            <p class="vs-input--label mt-4">{{$t('hote_')}}</p>
            <v-select label="text" :options="selectOptions" class="w-full select-list" v-model="multipleValue.hote" />

            <!-- President -->
            <p class="vs-input--label mt-5">{{$t('president')}}</p>
            <v-select label="text" :options="selectOptions" class="w-full select-list" v-model="multipleValue.presidence" />
            <!-- Secretaire -->
            <p class="vs-input--label mt-5">{{$t('secretaire_')}}</p>
            <v-select label="text" :options="selectOptions" class="w-full select-list" v-model="multipleValue.secretaire" />

            <!-- Lieu -->
            <vs-input :label="$t('lieu_')" v-model="multipleValue.lieu" class="w-full mt-5" />

            <!-- Date -->
            <p class="vs-input--label mt-5">{{$t('date')}}</p>
            <flat-pickr :config="MyConfig" v-model="date_rapport" class="w-full" />

            <!-- Génération du lien de visioconférence-->
            <vs-checkbox v-model="checkbox_jitsi" :checked="multipleValue.jitsi_room" :disabled="multipleValue.jitsi_room" class="mt-6" style="margin-left: -1px">
                {{$t('generateAVideoconferenceLink')}}
            </vs-checkbox>

        </template>

        <vs-button class="mr-6" type="border" color="danger" @click.native="toggleDataSidebar">{{ $t('cancel')}}</vs-button>

        <vs-button id="button-with-loading-sav-sanction" :disabled="validateForm" @click.native="save">
            {{ $t('save')}}
        </vs-button>

    </data-view>
</div>
<div v-else>

</div>
</template>

<script>
import sidebar from '../../services/mixins/sidebar'
import vSelect from 'vue-select'

import {
    EventBus
} from '@/services/EventBus.js'

import flatPickr from 'vue-flatpickr-component';

import 'flatpickr/dist/flatpickr.css';

//import Rx from 'rxjs/Rx';

import data from '../../services/mixins/data';

import {
    createRapportAg,
    updateRapportAg,
    getAssociationMembres
} from '../../services/api'

import {
    mapGetters
} from 'vuex'

export default {
    props: ['assId', 'uuid', 'rapportId', 'allRapportParameters', 'roles', 'isCurrentAg', 'ag'],
    mixins: [data, sidebar],
    components: {
        flatPickr,
        vSelect,
    },

    watch: {
        /* eslint-disable no-unused-vars */
        allRapportParameters: function (newVal, oldValue) {
            this.formatData()
        }
    },
    methods: {
        openJitsiRoom(link) {
            window.open(link)
        },

        date(date_time) {
            return this.$options.filters.dateTime(date_time)
        },

        newFormatReport(data) {
            if (!(data.presidence instanceof Object)) {
                data.presidence_name = this.users.find(e => e.id == data.presidence).name
                data.secretaire_name = this.users.find(e => e.id == data.secretaire).name
            }
        },

        formatData() {
            const localData = this.getReport

            this.multipleValue = {
                hote: localData.hote,
                presidence: {
                    text: localData.presidence_name,
                    value: localData.presidence
                },
                secretaire: {
                    text: localData.secretaire_name,
                    value: localData.secretaire
                },
                lieu: localData.lieu,
                date_effective: localData.date_effective * 1000,
                jitsi_room: localData.jitsi_room
            }
            this.date_rapport = localData.date_effective * 1000
            this.donnees_rapport = {
                hote: localData.hote,
                presidence: {
                    text: localData.presidence_name,
                    value: localData.presidence
                },
                secretaire: {
                    text: localData.secretaire_name,
                    value: localData.secretaire
                },
                lieu: localData.lieu,
                date_effective: localData.date_effective,
                jitsi_room: localData.jitsi_room
            }
        },
        next() {
            this.$emit('selectedTab', 1)
        },

        updateRapporId(val) {

            this.$emit('update:parametre:rapport', {
                id: val.id,
                all: val
            })
        },

        cancel() {
            this.multipleValue = {
                hote: '',
                presidence: '',
                secretaire: '',
                lieu: '',
                date_effective: ''
            }
        },
        save() {
            let jitsi_room = null
            if (!this.rapportExist) {

                if (this.checkbox_jitsi)
                    jitsi_room = 'OK'
                /* display('functio to create') */
                createRapportAg({
                        assId: this.assId,
                        agId: this.uuid,
                        created_by: this.$store.state.authentificated.user.firstName,
                        hote: this.multipleValue.hote.text,
                        presidence: this.multipleValue.presidence.value,
                        secretaire: this.multipleValue.secretaire.value,
                        lieu: this.multipleValue.lieu,
                        date_effective: this.stam(this.multipleValue.date_effective),
                        jitsi_room: jitsi_room
                    })
                    .then(
                        val => {

                            let donnees = val.data.data

                            let newRapport = val.data.data
                            newRapport.hote = donnees.hote

                            const presidence_name = this.users.find(e => e.id == donnees.presidence)
                            const secretaire_name = this.users.find(e => e.id == donnees.secretaire)

                            newRapport.presidence_name = presidence_name.firstName
                            newRapport.secretaire_name = secretaire_name.firstName
                            newRapport.lieu = donnees.lieu
                            newRapport.date_effective = donnees.date_effective

                            this.$store.commit('association/SET_REPORT', newRapport);
                            this.$vs.notify({
                                position: 'top-center',
                                text: this.$t('notifContent'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'success'
                            })

                            this.updateRapporId(val.data.data)

                            this.rapportData = newRapport

                            return val.data.data
                        })
                    .then(() => {
                        this.$emit('selectedTab', 1)
                        this.addNewDataSidebar = false
                    })

                    .catch(() => {
                        this.addNewDataSidebar = false
                    })
            } else {

                if (this.checkbox_jitsi && !this.multipleValue.jitsi_room)
                    jitsi_room = 'OK'
                else
                    jitsi_room = this.multipleValue.jitsi_room

                updateRapportAg({
                        assId: this.assId,
                        agId: this.uuid,
                        rapportId: this.rapportId,
                        created_by: this.$store.state.authentificated.user.firstName,
                        hote: this.multipleValue.hote.text,
                        presidence: this.multipleValue.presidence.value,
                        secretaire: this.multipleValue.secretaire.value,
                        lieu: this.multipleValue.lieu,
                        date_effective: new Date(this.date_rapport).getTime() / 1000,
                        jitsi_room: jitsi_room
                    })
                    .then(
                        val => {
                            let donnees = val.data.data

                            let newRapport = val.data.data
                            newRapport.hote = donnees.hote
                            newRapport.presidence_name = this.users.find(e => e.id == donnees.presidence).firstName
                            newRapport.secretaire_name = this.users.find(e => e.id == donnees.secretaire).firstName
                            newRapport.lieu = donnees.lieu
                            newRapport.date_effective = donnees.date_effective
                            //this.stopLoding('button-with-loading-sav-rapport')
                            this.$store.commit('association/SET_REPORT', newRapport);
                            /* display('value return to server for update') */

                            this.rapportData = newRapport

                            this.$vs.notify({
                                position: 'top-center',
                                text: this.$t('notifContent'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'success'
                            })

                            this.$emit('selectedTab', 0)
                            return newRapport
                        })
                    .then(() => {
                        this.$emit('selectedTab', 0)
                        this.addNewDataSidebar = false
                    })

                    .catch(() => {
                        this.addNewDataSidebar = false
                    })
            }

        }
    },
    async created() {
        EventBus.$emit('loader', true)
        await getAssociationMembres({
                id: this.$store.state.association.currentAssociation.id
            })
            .then(e => {
                this.users = e.data.data
            })
            .then(() => {
                if (this.rapportId && this.getReport) {
                    this.rapportExist = true
                    this.formatData()
                } else {
                    this.rapportExist = false
                    if (this.ag)
                        this.multipleValue.hote = {
                            text: this.ag.membre,
                            value: this.ag.membres_id,
                            id: this.ag.membres_id
                        }
                }
            })
            .then(() => {
                EventBus.$emit('loader', false);
                this.loading = true
            })
            .catch(() => {
                EventBus.$emit('loader', false);
                this.loading = true
            })

        let ags = this.$store.state.association.ags

        let ag_courrante = ags.find(e => e.id == this.uuid)
        this.date_seance = ag_courrante.date_ag

        this.multipleValue.hote = {
            text: ag_courrante.membre,
            value: ag_courrante.membres_id
        }

    },
    computed: {
        ...mapGetters({
            getReport: 'association/getReport'
        }),

        rapportData: {
            get() {
                return this.donnees_rapport
            },

            set(newVal) {
                this.multipleValue = {
                    hote: newVal.hote,
                    presidence: {
                        text: newVal.presidence_name,
                        value: newVal.presidence
                    },
                    secretaire: {
                        text: newVal.secretaire_name,
                        value: newVal.secretaire
                    },
                    lieu: newVal.lieu,
                    date_effective: newVal.date_effective,
                    jitsi_room: newVal.jitsi_room

                }
                this.donnees_rapport = this.multipleValue
            }

        },
        selectOptions() {
            if (this.users != null)
                return this.users.map(user => ({
                    id: user.id,
                    text: user.firstName,
                    value: user.id
                }))
        },
        validateForm() {
            return (this.multipleValue.hote &&
                this.multipleValue.presidence &&
                this.multipleValue.secretaire &&
                this.multipleValue.lieu &&
                this.multipleValue.date_effective

            ) ? false : true
        }
    },

    mounted() {
        if (this.allRapportParameters &&
            Object.keys(this.allRapportParameters).length > 0 &&
            !this.allRapportParameters.todo)
            this.fetch = 'success'

        if (this.allRapportParameters && this.allRapportParameters.todo)
            this.fetch = 'error'
    },
    data: () => ({
        rapportExist: false,
        loading: false,
        comment: "",
        MyConfig: {
            altFormat: "F j, Y",
            dateFormat: "d M Y"
        },
        multipleValue: {
            hote: '',
            presidence: '',
            secretaire: '',
            lieu: '',
            date_effective: ''
        },
        fetch: null,
        donnees_rapport: null,
        date_seance: '',
        newRapport: null,
        users: [],
        date_rapport: '',
        checkbox_jitsi: false

    }),
}
</script>

<style lang="scss">
.select-list {
    .vs__dropdown-menu {
        max-height: 200px !important;
    }
}
</style>
