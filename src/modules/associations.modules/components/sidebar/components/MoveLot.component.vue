<template>
<div>
    <!-- Starting date -->
    <div>
        <p class="vs-input--label">{{ $t('fromDate') }} *</p>
        <v-select :options="agsOptions" label="text" v-model="from" :placeholder="$t('selectTheDateToMoveLotFrom')"></v-select>
    </div>

    <!-- Lot selection -->
    <div v-show="from">
        <p class="vs-input--label mt-5">{{ $t('beneficiaire') }} *</p>
        <v-select :options="lotsOptions" label="text" v-model="lot" @change="validateForms" class="w-full " />
    </div>

    <!-- Destination date -->
    <div v-show="from && lot">
        <p class="vs-input--label mt-5">{{ $t('towards') | Capitalize }} *</p>
        <v-select :options="nextAgsOptions" label="text" v-model="to" @change="validateForms" class="w-full " />
    </div>


</div>
</template>

<script>
import vSelect from 'vue-select'
import * as moment from 'moment';
import localisation from 'moment/locale/fr';

moment.updateLocale('fr', localisation)

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    props: ['activite', 'idLoader'],
    data() {
        return {
            loading: false,

            lot: null,
            from: null,
            to: null,

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,
        }
    },
    components: {
        vSelect,
    },
    computed: {
        ags(){
          return this.$store.state.association.ags
        },

        lotsData() {
            let lots = this.$store.state.association.lots
            let beneficiaires = []

            /* window.console.log(this.lotsData) */
            lots.forEach((value) => {
                if ((this.ags.some(element => element.date_ag === value.date_bouffe &&
                        element.etat != 'past' && element.etat != 'cloture'))) {
                    beneficiaires.push(value)
                }
            })

            return lots
        },

        // selectOptionsAg() {
        //     return this.selectOptionsProchaineAg()
        // },
        agsOptions() {
          return this.getAgsOptions();
        },

        lotsOptions() {
            return this.getLotsOptions()
        },

        nextAgsOptions() {
            return this.getNextAgs()
        },

        validateForms() {
            if (this.lot  && this.from  && this.to && this.loader) return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },
    },
    methods: {
        getAgsOptions() {
          if(this.lotsData.length > 0) {
            // let limit = this.lotsData.sort((lot1, lot2) => { return lot1.date_bouffe - lot2.date_bouffe })[0].date_bouffe
            let ags = this.ags
                      .filter((ag) => { return this.lotsData.findIndex((lot) => { return lot.date_bouffe == ag.date_ag}) > -1 })
                      .map((ag) => ({
                        id: ag.id,
                        text: this.$options.filters.dateTime(ag.date_ag),
                        value: ag.date_ag
                      }))

            return ags
          }
        },

        getLotsOptions() {
            if(this.from) {
                let selectedLots =  this.lotsData.filter((lot) => { return lot.date_bouffe == this.from.value })
                                                  .map((lot) => ({
                                                    id: lot.id,
                                                    text: moment.unix(lot.date_bouffe).format('L') + '-' + lot.membre,
                                                    value: lot.id,
                                                    tontine: lot.tontines_id,
                                                    date_bouffe: lot.date_bouffe
                                                  }))
                if(selectedLots.length > 0) {
                    this.lot = {
                        id: selectedLots[0].id,
                        text: selectedLots[0].text,
                        value: selectedLots[0].value,
                        tontine: selectedLots[0].tontine,
                        date_bouffe: selectedLots[0].date_bouffe
                    }
                }

                return selectedLots
            }
        },

        getNextAgs() {
            if(this.lot) {
                let optionsLots =  this.ags.filter((ag) => { return ag.date_ag > this.lot.date_bouffe && ag.etat != 'past' && ag.etat != 'cloture'})
                                    .map((ag) => ({
                                        id: ag.id,
                                        text: this.$options.filters.dateTime(ag.date_ag),
                                        value: ag.date_ag
                                    }))
                if(optionsLots.length > 0) {
                    this.to = {
                        id: optionsLots[0].id,
                        text: optionsLots[0].text,
                        value: optionsLots[0].value
                    }
                }

                return optionsLots
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
            this.openLoadingContained()

            var association_courante = this.$store.state.association.currentAssociation

            let payload = {
                resourceUrl: "api/association/" + association_courante.id + "/tontine/" + this.activite.Tontine.id + "/change/date/lot",
                commitAction: 'SET_TONTINES',
                data: {
                    lot: this.lot.id,
                    date: this.to.value
                }
            }
            this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                    this.$emit('isSidebarActiveLocal', false)
                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('notifContent'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })

                    let payload = {
                        resourceUrl: '/api/association/' + association_courante.id + '/activite/type/Tontine',
                        commitAction: 'SET_TONTINES'
                    }
                    this.$store.dispatch("association/fetchAssociationactivite", payload)
                        .then((res) => {
                            let activites = res.data.data
                            /* let activite_courantte_lots = [] */

                            activites.forEach(activite => {
                                if (activite.Tontine.id == this.lot.tontine) {

                                    /* activite_courantte_lots = activite.Tontine.lots */
                                    // localStorage.setItem('activite_parameter', JSON.stringify(activite))

                                    let payload = {
                                        resourceUrl: '/api/activite/' + activite.id + '/comptes/all',
                                        commitAction: 'SET_ACCOUNTS'
                                    }

                                    this.$store.dispatch("association/fetchComptemembreActivite", payload)
                                        .then(() => {
                                            let payload = {
                                                resourceUrl: '/api/association/' + association_courante.id + '/tontine/' + activite.Tontine.id + '/lots',
                                                commitAction: 'SET_LOTS'
                                            }
                                            this.$store.dispatch("association/fetchAssociationactivite", payload)
                                                .catch((error) => {
                                                    window.console.error(error)
                                                })
                                        })
                                        .catch((error) => {
                                            window.console.error(error);
                                        })
                                }
                            })
                        })
                        .catch((error) => {
                            window.console.error(error);
                        })

                    this.$emit('closeSidebar')

                })
                .catch(error => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                    this.uploading = false;
                    this.fileList = [];
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

        let payload = {
            resourceUrl: '/api/association/' + association_courante.id + '/tontine/' + this.activite.Tontine.id + '/lots',
            commitAction: 'SET_LOTS'
        }
        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .catch((error) => {
            window.console.error(error)
        })

        moment.updateLocale('fr', localisation);
    },
}
</script>
