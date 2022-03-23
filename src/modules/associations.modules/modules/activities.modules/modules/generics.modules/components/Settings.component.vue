<template>
<vx-card no-shadow :title="$t('genericactivityCreation')">
    <div v-if="caisse=='error'" class="ep-association">
        <!-- Nom -->
        <vs-input :label="$t('nameOfActivity')+' *'" v-model="nom" class="w-full" />

        <!-- Description -->
        <p class="vs-input--label mt-5">{{$t('activityDescription')}}</p>
        <vs-textarea v-model="description" class="w-full" />

        <!-- Taux penalite -->
        <div class="grid grid-cols-3 gap-4 mt-5">
            <div class="col-span-2">
                <vs-input :label="$t('penaltyForFailure')" type=number v-model="taux_penalite" class="w-full" step="1" min="0" @keydown="filterKey" />
            </div>
            <!-- Type penalite -->
            <div class="col-span-1">
                <p class="vs-input--label">{{$t('typeOfPenalty')}}</p>
                <v-select label="text" :options="penalityTypeSelectOptions" v-model="type_penalite" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full mt-1" />
            </div>
        </div>
        <!-- <p class="vs-input--label mt-5">{{$t('disbursementMethod')+ ' *'}}</p>
        <v-select label="text" :options="paymentMethodSelectOptions" v-model="methode_decaissement" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full mt-1" /> -->
    </div>

    <div v-if="caisse=='success'" class="ep-association">
        <!-- Nom -->
        <vs-input :label="$t('nameOfActivity')+' *'" v-model="nom" class="w-full" readonly />
        <!-- Description -->
        <p class="vs-input--label mt-5">{{$t('activityDescription')}}</p>
        <vs-textarea v-model="description" class="w-full" readonly />
        <!-- Taux penalite -->
        <div class="grid grid-cols-3 gap-4 mt-5">
            <div class="col-span-2">
                <vs-input :label="$t('penaltyForFailure')" type=number v-model="taux_penalite" class="w-full" step="1" min="0" @keydown="filterKey" />
            </div>
            <!-- Type penalite -->
            <div class="col-span-1">
                <p class="vs-input--label">{{$t('typeOfPenalty')}}</p>
                <v-select label="text" :options="penalityTypeSelectOptions" v-model="type_penalite" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="w-full mt-1" />
            </div>
        </div>
        <!--  <p class="vs-input--label mt-5">{{$t('disbursementMethod')+ ' *'}}</p>
            <v-select
                v-bind:class="{ disabled: true }"
                label="text"
                :options="paymentMethodSelectOptions"
                v-model="methode_decaissement"
                :dir="$vs.rtl ? 'rtl' : 'ltr'"
                class="w-full mt-1"
                readonly/> -->
    </div>
    <div class="flex flex-wrapper mt-6">
        <vs-button type="border" class="mr-6" @click="reset">
            {{$t('cancel')}}
        </vs-button>

        <vs-button id="button-with-loading" @click.native="createOrUpdate" :disabled="!validateForm">
            {{$t('next')}}
        </vs-button>
    </div>
</vx-card>
</template>

<script>
import vSelect from 'vue-select'
import {
    penality_type
} from '../../../services/data/penalityType.js'
// import {
//     payment_method
// } from './paymentMethod.js'
import {
    EventBus
} from '@/services/EventBus.js'

export default {
    props: ['activity'],
    data() {
        return {
            selected: [],
            nom: '',
            description: '',
            taux_penalite: 0,
            type_penalite: {
                text: this.$t(penality_type[0].i18n),
                value: penality_type[0].value
            },
            // methode_decaissement: {
            //     text: this.$t(payment_method[0].i18n),
            //     value: payment_method[0].value
            // },
            caisse: false,

            /* Loader */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true
        }
    },
    components: {
        vSelect,
    },
    computed: {
        validateForm() {
            return !this.errors.any() && this.nom != '' &&
                // this.methode_decaissement != '' &&
                this.loader
        },
        penalityTypeSelectOptions() {
            return penality_type.map(type => ({
                text: this.$t(type.i18n),
                value: type.value
            }))
        },
        // paymentMethodSelectOptions() {
        //     return payment_method.map(type => ({
        //         text: this.$t(type.i18n),
        //         value: type.value
        //     }))
        // }
    },
    mounted() {
        EventBus.$emit('loader', true)

        // if (localStorage.getItem('activite_modif') !== null) {
        //     var activite_modif = JSON.parse(localStorage.getItem('activite_modif'));

        //     if (localStorage.getItem('activite_creee') === null || localStorage.getItem('activite_creee') !== null &&
        //         JSON.parse(localStorage.getItem('activite_creee')).id !== activite_modif.id) {
        //         localStorage.setItem('activite_creee', JSON.stringify(activite_modif))
        //     }

        //     if (activite_modif.type == 'caisse') {
        //         EventBus.$emit('loader', false)
        //         this.caisse = 'success'
        //     } else {
        //         EventBus.$emit('loader', false)
        //         this.caisse = 'error'
        //     }
        // }

        if (localStorage.getItem('activity_id') !== null) {
            let current_activity = this.activity !== '' ? this.activity : this.$store.state.association.activite;
            this.nom = current_activity.nom
            this.description = current_activity.description
            this.taux_penalite = current_activity.taux_penalite
            this.type_penalite = {
                text: penality_type.reduce((a, o) => o.value == current_activity.type_penalite ? a.concat(this.$t(o.i18n)) : a, ''),
                value: current_activity.type_penalite,
            }

            // this.methode_decaissement = {
            //     text: payment_method.reduce((a, o) => o.value == activite_courante.methode_decaissement ? a.concat(this.$t(o.i18n)) : a, ''),
            //     value: activite_courante.methode_decaissement,
            // }

            if (current_activity.type == 'caisse') {
                EventBus.$emit('loader', false)
                this.caisse = 'success'
            } else {
                EventBus.$emit('loader', false)
                this.caisse = 'error'
            }
        } else {
            EventBus.$emit('loader', false)
            this.caisse = 'error'
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
        reset() {
            this.nom = ''
            this.description = ''
            this.taux_penalilte = ''
            this.type_penalite = ''
        },
        createOrUpdate() {
            this.openLoadingContained()
            var association_courante = this.$store.state.association.currentAssociation
            var user = this.$store.state.authentificated.user
            var urlResource
            var method
            let type = 'Generique'

            if (localStorage.getItem('activity_id') !== null) {
                var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

                urlResource = "/api/association/" + association_courante.id + "/activite/" + activite_courante.id
                method = "association/putRequest"

                if (activite_courante.type == 'caisse')
                    type = 'caisse'
            } else {
                urlResource = "/api/association/" + association_courante.id + "/activite"
                method = "association/postRequest"
            }

            let payload = {
                resourceUrl: urlResource,
                commitAction: 'SET_ACTIVITE',
                data: {
                    nom: this.nom,
                    description: this.description,
                    taux_penalite: this.taux_penalite,
                    type_penalite: this.type_penalite.value,
                    type: type,
                    id: user.id
                }
            }
            this.$store.dispatch(method, payload)
                .then((res) => {
                    var activite_courante = res.data.data

                    localStorage.setItem('activity_id', JSON.stringify(activite_courante.id))

                    if (activite_courante.type == 'caisse')
                        this.$emit('selectedTab', 2)
                    else
                        this.$emit('selectedTab', 1)

                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.loader = true

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
    }
}
</script>

<style lang="css">
.disabled {
    pointer-events: none;
    color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: #eef1f6;
    border-color: #d1dbe5;
}
</style>
