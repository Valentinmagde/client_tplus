<template>
<div>
    <vx-card no-shadow :title="$t('tontineactivityCreation')">
        <div class="ep-association">
            <!-- Titre -->
            <vs-input :label="$t('nameOfTontine')+ ' *'" v-model="nom" class="w-full" />
            <!-- Description -->
            <vs-input :label="$t('tontineDescription')" v-model="description" class="w-full mt-5" />
            <!-- Taux penalite -->
            <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 mt-5">
                    <vs-input :label="$t('penaltyForFailure')" type=number v-model="taux_penalite" class="w-full" step="1" min="0" @keydown="filterKey" />
                </div>
                <!-- Type penalite -->
                <div class="col-span-1 mt-6">
                    <p class="vs-input--label">{{$t('typeOfPenalty')}}</p>
                    <v-select label="text" :options="penalityTypeSelectOptions" v-model="type_penalite" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full" />
                </div>
            </div>
            <!-- Type tontine -->
            <p class="vs-input--label mt-5">{{$t('tontineType')}}</p>
            <v-select label="text" :options="tontintTypeSelectOptions" v-model="type_tontine" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full" />

            <!-- Type de cotisation -->
            <div v-if="type_tontine.value == 'VARIABLE'">
                <p class="vs-input--label mt-5">{{$t('memberContributionShare')}} </p>
                <ul class="centerx mt-3 text-sm">
                    <li class="mr-8 inline-block">
                        <vs-radio v-model="radio" :vs-value="1">{{$t('singleAmount')}}</vs-radio>
                    </li>
                    <li class="inline-block">
                        <vs-radio v-model="radio" :vs-value="0">{{$t('variableAmount')}}</vs-radio>
                    </li>
                </ul>
            </div>

            <!-- Montant minimum -->
            <p v-if="type_tontine.value == 'VARIABLE' && radio==0" class="vs-input--label mt-5">{{$t('minimumAmount')}}</p>

            <!-- Montant part -->
            <p v-if="type_tontine.value == 'FIXE'" class="vs-input--label mt-5">{{$t('amountShare')+ ' *'}}</p>
            <money v-if="type_tontine.value == 'FIXE' || (type_tontine.value == 'VARIABLE' && radio==0)" id="montant_part" v-model="montant_part" class="w-full money-input p-3" v-bind="money" />

            <!-- Montant cagnote -->
            <p v-if="type_tontine.value == 'FIXE' " class="vs-input--label mt-5">{{$t('mainPrizeAmount')+ ' *'}}</p>
            <p v-else-if="(radio == 0 && montant_part > 0)" class="vs-input--label mt-5">{{$t('mainPrizeAmount')}} *</p>
            <money v-if="type_tontine.value == 'FIXE' || (radio == 0 && montant_part > 0)" id="montant_cagnote" v-model="montant_cagnote" class="w-full money-input p-3" v-bind="money" />

            <!-- Type d'allocation -->
            <p class="vs-input--label mt-5">{{$t('allocationOfLots')}}</p>
            <v-select label="text" :options="allocationLotsSelectOptions" v-model="allocation_of_lot" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full" />

            <!-- Taux maximum -->
            <vs-input v-if="allocation_of_lot.value == 'VENTE'" type="number" icon-pack="feather" icon="icon-percent" icon-after vs-icon-after="true" :label="$t('maximumRate')" v-model="taux_maximum" class="w-full mt-5" step="1" min="0" @keydown="filterKey" />

            <!-- Date du premier tour -->
            <p class="vs-input--label mt-5">{{$t('dateOfFirstRound')}} *</p>
            <v-select :options="selectOptions1" v-model="date_premier_tour" label="text" class="w-full" />

            <!-- Date du dernier tour -->
            <p v-if="type_tontine.value == 'VARIABLE' && radio==1" class="vs-input--label mt-5">{{$t('dateOfLastRound')}}</p>
            <v-select v-if="type_tontine.value == 'VARIABLE' && radio==1" :options="selectOptions2" v-model="date_dernier_tour" label="text" class="w-full" />

        </div>
        <div class="flex flex-wrapper mt-6">
            <vs-button type="border" class="mr-6" @click.native="reset">
                {{$t('cancel')}}
            </vs-button>

            <vs-button class="ml-3 vs-con-loading__container" ref="loadableButton" id="button-with-loading" @click.native="createOrUpdateActivity" :disabled="validateForm">
                {{$t('next')}}
            </vs-button>
        </div>
    </vx-card>
    <vx-card no-shadow class="empty-card"></vx-card>
</div>
</template>

<script>
import {
    tontine_type
} from '../services/data/tontineTypes.js'
import {
    penality_type
} from '../services/data/penalityTypes.js'
import {
    allocation_lots
} from '../services/data/allocationOfLots.js'
import vSelect from 'vue-select'
import {
    Money
} from 'v-money'

import { EventBus } from '@/services/EventBus'

export default {
    props: ['activity' ,'ags'],
    data() {
        return {
            radio: 0,
            /* type_tontine: '', */
            /* allocation_of_lot: '',
            type_penalite:  '', */
            date_premier_tour: '',
            date_dernier_tour: '',
            selected: [],
            nom: '',
            description: '',
            taux_penalite: '',
            taux_maximum: '',
            montant_part: 0,
            montant_cagnote: 0,
            type_tontine: {
                text: this.$t(tontine_type[0].i18n),
                value: tontine_type[0].value
            },
            allocation_of_lot: {
                text: this.$t(allocation_lots[1].i18n),
                value: allocation_lots[1].value
            },
            type_penalite: {
                text: this.$t(penality_type[0].i18n),
                value: penality_type[0].value
            },
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false,
                /* prefix: ' ' */
            },
            devise: '',

            /* Loader */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true
        }
    },
    components: {
        vSelect,
        Money
    },
    computed: {
        selectOptions1() {
            if (this.ags != null) return this.ags.map(ag => ({
                id: ag.id,
                text: this.$options.filters.dateTime(ag.date_ag),
                value: ag.date_ag
            }))
        },

        selectOptions2() {
            return this.selectOptions()
        },
        tontintTypeSelectOptions() {
            return tontine_type.map(type => ({
                text: this.$t(type.i18n),
                value: type.value
            }))
        },

        penalityTypeSelectOptions() {
            return penality_type.map(type => ({
                text: this.$t(type.i18n),
                value: type.value
            }))
        },

        allocationLotsSelectOptions() {
            return this.allocationLotsOptions()
        },

        validateForm() {
            return (this.nom == '' ||
                    this.type_penalite == '' ||
                    this.type_tontine == '' ||
                    this.allocation_of_lot == '' ||
                    this.date_premier_tour == ''
                ) ||
                (
                    this.type_tontine.value == 'VARIABLE' &&
                    this.radio == 0 &&
                    this.montant_part > 0 &&
                    this.montant_cagnote == 0
                )
        },

        /* initialize(){
            return this.init()
        } */
    },
    mounted() {
        EventBus.$emit('loader', true)

        var tontine_courante
        var activite_courante

        // if (localStorage.getItem('tontine_modif') !== null) {
        //     var activite_modif = JSON.parse(localStorage.getItem('tontine_modif'));

        //     if (localStorage.getItem('activite_creee') === null || localStorage.getItem('activite_creee') !== null &&
        //         JSON.parse(localStorage.getItem('activite_creee')).id !== activite_modif.id) {
        //         localStorage.setItem('activite_creee', JSON.stringify(activite_modif))
        //         localStorage.setItem('tontine_creee', JSON.stringify(activite_modif.Tontine))
        //     }
        // }

        if (localStorage.getItem('activity_id') !== null) {
            activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

            this.nom = activite_courante.nom
            this.description = activite_courante.description
            this.taux_penalite = activite_courante.taux_penalite
            this.type_penalite = penality_type.reduce((a, o) => o.value == activite_courante.type_penalite ? a.concat(this.$t(o.i18n)) : a, '')

            tontine_courante = activite_courante.Tontine
            this.taux_maximum = tontine_courante.taux_maximum
            this.montant_part = tontine_courante.montant_part
            this.montant_cagnote = tontine_courante.montant_cagnote
            this.type_tontine = {
                    text: tontine_type.reduce((a, o) => o.value == tontine_courante.type ? a.concat(this.$t(o.i18n)) : a, ''),
                    value: tontine_courante.type
                },
                this.allocation_of_lot = {
                    text: allocation_lots.reduce((a, o) => o.value == tontine_courante.attribution_cagnote ? a.concat(this.$t(o.i18n)) : a, ''),
                    value: tontine_courante.attribution_cagnote
                },
                this.date_premier_tour = {
                    text: this.$options.filters.dateTime(tontine_courante.date_debut),
                    value: tontine_courante.date_debut
                }

            this.date_dernier_tour = {
                text: this.$options.filters.dateTime(tontine_courante.date_fin),
                value: tontine_courante.date_fin
            }

            this.radio = tontine_courante.part_cotisation != null ? tontine_courante.part_cotisation : 1

            EventBus.$emit('loader', false)
        }
        else{
            if(this.type_tontine.value == 'FIXE' || (this.type_tontine.value == 'VARIABLE' && this.radio == 1)){
                this.allocation_of_lot = {
                    text: this.$t(allocation_lots[0].i18n),
                    value: allocation_lots[0].value
                }
            }
            
        }
        EventBus.$emit('loader', false)
    },
    methods: {
        selectOptions() {
            if (this.date_premier_tour != '') {
                let ags = this.$store.state.association.ags
                let _ags = ags.filter(e => e.date_ag > this.date_premier_tour.value)
                    .map(ag => ({
                        id: ag.id,
                        text: this.$options.filters.dateTime(ag.date_ag),
                        value: ag.date_ag
                    }))

                /* this.date_dernier_tour = ags[0] */
                return _ags

            }
            return []

        },

        allocationLotsOptions() {
            let attributions = []

            if (this.type_tontine.value == 'VARIABLE' && this.radio == 0) {
                this.allocation_of_lot = {
                    text: this.$t(allocation_lots[1].i18n),
                    value: allocation_lots[1].value
                }
                allocation_lots.forEach(element => {
                    if (element.value != 'TIRAGE') {
                        attributions.push(element)
                    }
                });

                return attributions.map(type => ({
                    text: this.$t(type.i18n),
                    value: type.value
                }))
            } 
            else{
                this.allocation_of_lot = {
                    text: this.$t(allocation_lots[0].i18n),
                    value: allocation_lots[0].value
                }

                return allocation_lots.map(type => ({
                    text: this.$t(type.i18n),
                    value: type.value
                }))
            }
        },
        //Initialisation des variables
        init() {
            if (this.type_tontine.value == 'VARIABLE') {
                this.type_tontine = {
                        text: this.$t(tontine_type[1].i18n),
                        value: tontine_type[1].value
                    },
                    this.allocation_of_lot = {
                        text: this.$t(allocation_lots[1].i18n),
                        value: allocation_lots[1].value
                    },
                    this.type_penalite = {
                        text: this.$t(penality_type[0].i18n),
                        value: penality_type[0].value
                    }
            } else {
                this.type_tontine = {
                        text: this.$t(tontine_type[0].i18n),
                        value: tontine_type[0].value
                    },
                    this.allocation_of_lot = {
                        text: this.$t(allocation_lots[0].i18n),
                        value: allocation_lots[0].value
                    },
                    this.type_penalite = {
                        text: this.$t(penality_type[0].i18n),
                        value: penality_type[0].value
                    }
            }
        },

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
        reset() {
            this.nom = ''
            this.montant_part = ''
            this.montant_cagnote = ''
            this.type_tontine = ''
            this.taux_penalite = ''
            this.type_penalite = ''
            this.allocation_of_lot = ''
        },

        //Duree
        deadline(start_date, end_date) {
            let ags = this.$store.state.association.ags

            let start = ags.find(e => e.date_ag == start_date)
            let end = ags.find(e => e.date_ag == end_date)

            var index1 = ags.indexOf(start)
            var index2 = ags.indexOf(end)

            return (index2 - index1) + 1
        },

        createOrUpdateActivity() {
            this.openLoadingContained()
            var association_courante =this.$store.state.association.currentAssociation
            var user = this.$store.state.authentificated.user
            var urlResource
            var method
            var activite_courante

            if (localStorage.getItem('activity_id') !== null) {
                activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

                urlResource = "/api/association/" + association_courante.id + "/activite/" + activite_courante.id
                method = "association/putRequest"
            } else {
                urlResource = "/api/association/" + association_courante.id + "/activite"
                method = "association/postRequest"
            }

            let payload = {
                resourceUrl: urlResource,
                commitAction: 'NO_COMMIT',
                data: {
                    nom: this.nom,
                    description: this.description,
                    taux_penalite: this.taux_penalite,
                    type_penalite: this.type_penalite.value,
                    type: 'Tontine',
                    id: user.id
                }
            }
            this.$store.dispatch(method, payload)
                .then((res) => {
                    var activite_courante = res.data.data
                    var association_courante = this.$store.state.association.currentAssociation
                    var urlResource
                    var method
                    var tontine_courante

                    if (localStorage.getItem('activity_id') !== null) {
                        tontine_courante = this.activity !== '' ? this.activity.Tontine : this.$store.state.association.activite.Tontine;

                        urlResource = "/api/association/" + association_courante.id + "/activite/" + activite_courante.id + "/Tontine/" + tontine_courante.id
                        method = "association/postRequest"
                    } else {
                        urlResource = "/api/association/" + association_courante.id + "/activite/" + activite_courante.id + "/Tontine"
                        method = "association/postRequest"
                    }
                    let payload = {
                        resourceUrl: urlResource,
                        commitAction: 'NO_COMMIT',
                        data: {
                            taux_maximum: this.taux_maximum,
                            montant_part: this.montant_part,
                            montant_cagnote: this.montant_cagnote,
                            type: this.type_tontine.value,
                            attribution_cagnote: this.allocation_of_lot.value,
                            date_debut: new Date(this.date_premier_tour.value).getTime(),
                            date_fin: this.date_dernier_tour ? new Date(this.date_dernier_tour.value).getTime() : null,
                            part_cotisation: this.radio,
                            duree: this.date_dernier_tour ? this.deadline(this.date_premier_tour.value, this.date_dernier_tour.value) : 0
                        }
                    }
                    this.$store.dispatch(method, payload)
                        .then((res) => {
                            var tontine_courante = res.data.data
                            activite_courante.Tontine = tontine_courante
                            this.$store.commit('association/SET_ACTIVITE', activite_courante)
                            localStorage.setItem('activity_id', JSON.stringify(activite_courante.id))

                            this.$emit('selectedTab', 1)
                            this.$emit('type_tontine', tontine_courante)
                            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                            this.loader = true
                        })
                        .catch(error => {
                            this.$vs.notify({
                                position: 'top-center',
                                text: error,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        })
                })
                .catch(error => {
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.loader = true
                    this.$vs.notify({
                        position: 'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })

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

        let association_courante = this.$store.state.association.currentAssociation

        //Recupperation de la devise de l'association
        this.devise = association_courante.devise
        /* this.money.prefix = this.symboleDevise()+' ' */
    }
}
</script>
