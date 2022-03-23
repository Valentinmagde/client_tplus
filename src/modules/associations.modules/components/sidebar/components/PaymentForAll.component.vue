<template>
<div>
    <vx-card card-border class="mb-5">
        <p>
            {{$t('saveTheSameAmountForAllAccounts')}}
        </p>
    </vx-card>
    <div>
        <ul class="centerx mt-5">
            <li class="mr-8 inline-block">
                <vs-radio v-model="radios" vs-value="1">{{$t('allMembers')}}</vs-radio>
            </li>
            <li class="inline-block">
                <vs-radio v-model="radios" vs-value="0" class="mr-12">{{$t('aMember')}}</vs-radio>
            </li>
        </ul>
    </div>
    <!-- Membre concerné -->
    <p v-if="radios==0" class="vs-input--label mt-3">{{$t('members')+ ' '+'*'}}</p>
    <v-select v-if="radios==0" :options="selectOptions" label="text" v-model="membre" class="w-full " @onchange="validateForms" />
    <!-- Montant -->
    <p class="vs-input--label mt-5">{{$t('Amount')+ ' '+'*'}}</p>
    <money v-model="montant" v-bind="money" class="money-input pt-3 pb-3 w-full" @onchange="validateForms" />

    <!-- Date -->
    <p class="vs-input--label mt-5">{{$t('datePayment')+ ' '+'*'}}</p>
    <flat-pickr :config="MyConfig" v-model="date_versement" class="w-full" />

    <vs-checkbox v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
        {{$t('addAnother')}}
    </vs-checkbox>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'

// Functions
import {
    EventBus
} from '@/services/EventBus.js'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    props: ['membres', 'idLoader', 'mutuelle', 'activite'],
    data() {
        return {
            membre: '',
            montant: 0,
            date_versement: '',
            radios: 0,

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
        flatPickr,
        vSelect
    },
    computed: {
        selectOptions() {
            if (this.membres != null) return this.membres.map(membre => ({
                id: membre.id,
                text: membre.membre,
                value: membre.membres_id
            }))
        },
        validateForms() {
            if (this.loader &&
                this.date_versement != '' &&
                this.montant != 0) return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },
        comptesData() {
            return this.$store.state.association.accounts
        },
    },
    mounted() {
        if (this.membres.length > 0) {
            this.membre = {
                text: this.membres[0].membre,
                value: this.membres[0].membres_id
            }
        }
    },
    methods: {
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
            this.openLoadingContained()
            if (this.radios == 1) {
                if (this.comptesData.length > 0) {
                    let epargne_courante = this.mutuelle;
                    let mises = []

                    this.comptesData.forEach(element => {
                        mises.push({
                            membres_id: element.membres_id,
                            montant: this.montant,
                            date_versement: new Date(this.date_versement).getTime() / 1000
                        })
                    });

                    let payload = {
                        resourceUrl: "/api/mutuelle/" + epargne_courante.id + "/misesdefonds",
                        commitAction: 'SET_MISES_FONDS',
                        data: {
                            mises: JSON.stringify(mises)
                        }
                    }

                    this.$store.dispatch("association/postRequest", payload)
                        .then(() => {
                            this.loader = true
                            this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)

                            if (!this.checkbox_create_another) {
                                this.$emit('isSidebarActiveLocal', false)
                            }
                            this.montant = 0
                            this.date_versement = ''

                            this.$vs.notify({
                                position: 'top-center',

                                text: this.$t('downPaymentSuccessfullyAdded'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'success'
                            })
                            EventBus.$emit('loader', true)
                            //Recupperer tous les mises de fonds de la mutuelle
                            let payload = {
                                resourceUrl: "/api/mutuelle/" + epargne_courante.id + "/misedefonds",
                                commitAction: 'SET_MISES_FONDS'
                            }
                            this.$store.dispatch("association/fetchAssociationactivite", payload)
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
            } else {
                let epargne_courante = this.mutuelle;
                let time_stamp = new Date(this.date_versement).getTime() / 1000

                let payload = {
                    resourceUrl: 'api/membre/' + this.membre.value + '/mutuelle/' + epargne_courante.id + '/misedefond',
                    commitAction: 'SET_MISE_FONDS',
                    data: {
                        montant: this.montant,
                        date_versement: time_stamp
                    }
                }

                this.$store.dispatch("association/postRequest", payload)
                    .then(() => {
                        this.loader = true
                        this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)

                        if (!this.checkbox_create_another) {
                            this.$emit('isSidebarActiveLocal', false)
                        }
                        this.montant = 0
                        this.date_versement = ''

                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('downPaymentSuccessfullyAdded'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })
                        let payload = {
                            resourceUrl: '/api/mutuelle/' + epargne_courante.id + '/misedefonds',
                            commitAction: 'SET_MISES_FONDS'
                        }
                        this.$store.dispatch("association/fetchAssociationactivite", payload)
                            .catch((error) => {
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
        if (localStorage.getItem('activity_id') !== null) {
            var activite_courante = this.activite

            let payload = {
                resourceUrl: '/api/activite/' + activite_courante.id + '/comptes/all',
                commitAction: 'SET_ACCOUNTS'
            }

            this.$store.dispatch("association/fetchComptemembreActivite", payload)
                .catch((error) => {
                    window.console.error(error)
                })
        }
    }
}
</script>
