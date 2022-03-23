<template>
<div>

    <!-- Comptes-->
    <p class="vs-input--label">{{$t('accounts')+ ' '+'*'}}</p>
    <v-select :options="selectOptions" label="text" v-model="compte" class="w-full " @onchange="validateForms" />

    <!-- Montant-->
    <p class="vs-input--label mt-5">{{$t('Amount')+ ' '+'*'}}</p>
    <money v-model="montant" v-bind="money" class="money-input pt-3 pb-3 w-full" @onchange="validateForms" />

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

//Store

export default {
    props: ['idLoader'],
    data() {
        return {
            montant: 0,
            compte: '',

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
            admin: false,
            devise: '',

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
        comptesData() {
            return this.$store.state.association.accounts
        },
        selectOptions() {
            let comptes = this.comptesData
            if (comptes != null) return comptes.map(compte => ({
                id: compte.id,
                text: compte.membre,
                value: compte.id
            }))
        },

        validateForms() {
            if (this.compte != '' && this.montant) return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },
    },
    mounted() {
        if (this.comptesData.length > 0) {
            this.compte = {
                text: this.comptesData[0].membre,
                value: this.comptesData[0].id
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
            let payload = {
                resourceUrl: 'api/compte/' + this.compte.value + '/ajouter/avoir',
                commitAction: 'NO_COMMIT',
                data: {
                    montant: this.montant
                }
            }

            this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)

                    if (!this.checkbox_create_another)
                        this.$emit('isSidebarActiveLocal', false)

                    this.montant = 0

                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('notifTitle'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    this.getAccounts()
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
        },

        getAccounts() {
            let activite = this.$store.state.association.activite
            let payload = {
                resourceUrl: '/api/activite/' + activite.id + '/comptes/all',
                commitAction: 'SET_ACCOUNTS'
            }

            this.$store.dispatch("association/fetchComptemembreActivite", payload)
                .then(() => {})
                .catch((error) => {
                    window.console.error(error)
                })
        },
    },
    created() {
        let association_courante = this.$store.state.association.currentAssociation

        this.getAccounts()
        this.devise = association_courante.devise

        this.echeances = null
    },
}
</script>

<style lang="css">
.con-vs-popup {
    z-index: 52020 !important;
}
</style>
