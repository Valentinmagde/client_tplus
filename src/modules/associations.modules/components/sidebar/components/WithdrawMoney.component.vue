<template>
<div>
    <!-- Montant-->
    <p class="vs-input--label">{{$t('Amount')+ ' '+'*'}}</p>
    <money v-model="montant" v-bind="money" class="money-input pt-3 pb-3 w-full" @onchange="validateForms" />

    <!-- Motif-->
    <p class="vs-input--label mt-5">{{$t('reason')+ ' '+'*'}}</p>
    <vs-textarea v-model="motif"/>

    <p class="vs-input--label mt-5">{{$t('dateOfWithdrawal')+ ' '+'*'}}</p>
    <flat-pickr :config="MyConfig" v-model="date_retrait" class="w-full" @onchange="validateForms" />

    <vs-checkbox v-model="checkbox_another" class="mt-6" style="margin-left: -1px">
        {{$t('makeAnotherDisbursement')}}
    </vs-checkbox>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'

import {mapGetters} from 'vuex'

export default {
    props: ['activite','idLoader'],
    data() {
        return {
            montant: 0,
            motif: '',
            date_retrait: new Date(),

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
            checkbox_another: false,

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
        ...mapGetters({
            association: 'association/getCurrentAssociation',
            activeUser: 'authentificated/getAuth',
        }),

        validateForms() {
            if (this.motif != '' && this.montant && this.date_retrait != '') return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },
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
                resourceUrl: 'api/association/' + this.association.id + '/retrait/activite/' + this.activite.id+ '/argent',
                commitAction: 'NO_COMMIT',
                data: {
                    montant: this.montant,
                    raison: this.motif,
                    date_retrait: new Date(this.date_retrait).getTime() / 1000
                }
            }

            this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)

                    if (!this.checkbox_another)
                        this.$emit('isSidebarActiveLocal', false)

                    this.montant = 0
                    this.motif = ''

                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('notifTitle'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })

                    let payload = {
                        resourceUrl: "api/association/" + this.association.id + "/activites/tresorerie",
                        commitAction: 'SET_TRESORERIES',
                    }
                    this.$store.dispatch("association/fetchFinances", payload)
                    .catch(error => {
                        this.loader = true
                        this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
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
        },
    }
}
</script>

<style lang="css">
.con-vs-popup {
    z-index: 52020 !important;
}
</style>
