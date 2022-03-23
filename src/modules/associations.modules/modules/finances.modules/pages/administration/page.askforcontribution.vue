<template>
<div>
    <!-- ACTION BUTTON -->
    <action-button v-if="admin"/>
    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;" />
    <div class="pt-16">
        <vx-card class="mr-4" no-shadow :title="$t('requestForContribution') | CAPITALIZE">
            <div class="ep-association">
                
                <p class="vs-input--label">{{$t('activity')+ ' *'}}</p>
                <v-select
                    label="text"
                    :options="selectOptionsActivities"
                    v-model="activite"
                    @input="getAccounts"
                    class=" w-full "/>
                <!-- Montant -->
                <p class="vs-input--label mt-4">{{$t('Amount')+ ' *'}}</p>
                <money v-model="montant" v-bind="money" class="money-input p-3 w-full mb-5" />

                <!-- Description -->
                <vs-input :label="$t('description')" v-model="description" class="w-full mb-5" />
                <!-- Fréquence des écheances -->
                <p class="vs-input--label">{{$t('frequency')+ ' *'}}</p>
                <v-select :options="selectOptionsFrequence" v-model="frequence" label="text" class="w-full mb-5" />
                <span v-if="frequence.value=='AG1AG2'">
                    <!-- Date Debut -->
                    <p class="vs-input--label">{{$t('startDate')+ ' ('+$t('GM')+'1)'}}</p>
                    <v-select :options="selectOptionsProchainesAgs" v-model="date_debut_versement" label="text" class="w-full mb-5" />
                    <!-- Date fin -->
                    <p class="vs-input--label">{{$t('endDate')+ ' ('+$t('GM')+'2) *'}}</p>
                </span>
                <span v-else>
                    <p class="vs-input--label">{{$t('paymentDeadlines')+ ' *'}}</p>
                </span>
                <v-select :options="selectOptionsProchainesAgs" v-model="date_limite_versement" label="text" class="w-full mb-5" />
                <!-- Membres -->
                <p class="mt-5">{{$t('createScheduleFor')+ ' * '}}: </p>
                <ul class="centerx mt-4">
                    <li>
                        <vs-radio v-model="radios" vs-value="1" class="mb-4">{{$t('allMembers')}}</vs-radio>
                    </li>
                    <li>
                        <div class="flex flex-wrapper mb-5">
                            <vs-radio v-model="radios" vs-value="0" class="mr-12">{{$t('selectedMembers')}}</vs-radio>
                            <vs-button type="border" class="select-member-btn" @click="popupActivo=true" :disabled="radios!=='0'">{{$t('selectMembres')}}</vs-button>
                        </div>
                        <div v-if="selected.length > 0" class="flex flex-wrapper mb-5">
                            <span :key="index" v-for="(member, index) in selected">
                                <vs-chip v-if="member">{{member}}</vs-chip>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
            <!-- Membres -->
            <vs-popup classContent="popup-example" class="popup-position" :title="$t('selectedMembers')" :active.sync="popupActivo">
                <ul class="centerx">
                    <li :key="indextr" v-for="(membre, indextr) in membres">
                        <vs-checkbox @change="onChange(membre.membres_id, membre.membre, $event)" :checked="membresIdChecked.includes(membre.membres_id)" class="ml-6 mb-3">{{membre.membre}}</vs-checkbox>
                    </li>
                </ul>
                <vs-divider />
                <div class="vx-row w-full justify-end">
                    <vs-button @click="popupActivo=false" type="border">{{$t('cancel')}}</vs-button>&nbsp;&nbsp;
                    <vs-button @click="popupActivo=false" class="ml-3">{{$t('Ok')}}</vs-button>
                </div>
            </vs-popup>

            <div class="flex flex-wrapper mt-5">
                <!-- <vs-button type="border" class="mr-6" id="button-loading" @click="previous">{{$t('previous')}}</vs-button> -->
                <vs-button @click="create" :disabled="!validateForm">{{$t('create')}}</vs-button>
            </div>
        </vx-card>
        <vx-card no-shadow class="empty-card"></vx-card>
    </div>
</div>
</template>

<script>
import { Money } from 'v-money'
import vSelect from 'vue-select'
import ActionButton from '../../components/administration/ActionButton.component'
//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

//Fonctions
import functions from "../../../../services/functions.js"
import { deadline_frequence } from '../../services/data/deadlineFrequency.js'
import checkRole from '../../../../mixins/checkRole'
import { EventBus } from '@/services/EventBus'

export default {
    mixins: [checkRole],
    data() {
        return {
            selected: [],
            montant: '',
            description: '',
            frequence: '',
            date_debut_versement: '',
            date_limite_versement: '',
            radios: '',
            popupActivo: false,
            membres: [],
            membresIdChecked: [],
            ags: null,
            activite: '',

            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },

        }
    },
    components: {
        Money,
        vSelect,
        ActionButton,
    },
    computed: {
        admin() {
          return this.isSuperAdministrator
        },

        activities() {
          return this.$store.state.association.activites
        },

        selectOptions() {
            if (this.ags != null) return this.ags.map(ag => ({
                id: ag.id,
                text: this.$options.filters.dateTime(ag.date_ag),
                value: ag.date_ag
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
                text: this.$t('GM') + ' ' + this.$options.filters.dateTime(ag.date_ag) + ' [' + ag.membre + ']',
                value: ag.date_ag
            }))
        },

        selectOptionsActivities(){
            if(this.activities != null)
                return this.activities.map(activity => {
                        return {
                            id: activity.id,
                            text: activity.nom,
                        }
                    }
                )
        },

        selectOptionsFrequence() {
            return deadline_frequence.map(frequence => ({
                text: this.$t(frequence.i18n),
                value: frequence.value
            }))
        },
        validateForm() {
            return this.montant != '' && this.date_limite_versement != '' && this.frequence != '' && this.radios != '' && this.activite != ''
        },
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

        resetForm(){
            this.montant = '' 
            this.date_limite_versement = '' 
            this.frequence = '' 
            this.radios = '' 
            this.activite = ''
            this.selected = []
        },

        getAccounts() {
            var activite = this.activite
            let payload = {
                resourceUrl: '/api/activite/' + activite.id + '/comptes/all',
                commitAction: 'SET_ACCOUNTS'
            }

            this.$store.dispatch("association/fetchComptemembreActivite", payload)
                .then((res) => {
                    this.membres = res.data.data
                    EventBus.$emit('loader', false);
                })
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
        create() {
            let activite_courante = this.activite
            let urlResource, method, data

            if (this.frequence.value == 'UNEFOIS') {
                if (this.radios == '1') {
                    urlResource = "/api/activite/" + activite_courante.id + "/echeancier"
                    method = "association/postRequest"
                    data = {
                        montant: this.montant,
                        description: this.description,
                        date_limite: this.date_limite_versement.value,
                        debit_credit: 'cotisation',
                        libelle: this.$t('Contribution') + ' - ' + this.activite.text + ' - ' + this.description,
                    }
                } else {
                    urlResource = "/api/activite/" + activite_courante.id + "/echeancier/some"
                    method = "association/postRequest"
                    data = {
                        echeancier: {
                            montant: this.montant,
                            description: this.description,
                            date_limite: this.date_limite_versement.value,
                            debit_credit: 'cotisation',
                            libelle: this.$t('Contribution') + ' - ' + this.activite.text  + ' - ' + this.description,
                        },
                        membres: this.membresIdChecked
                    }
                }
                let payload = {
                    resourceUrl: urlResource,
                    commitAction: 'NO_COMMIT',
                    data: data
                }
                this.$store.dispatch(method, payload)
                    .then(() => {
                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('updateCompletedSuccessfully'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })

                        this.resetForm()
                        /* this.$router.push('/association/administration/activities/generic/details') */
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
            } 
            else {
                let echeances = []
                /* Listes des écheances */
                this.ags.forEach(element => {
                    window.console.log(element.date_ag, this.date_debut_versement.value)
                    if (element.date_ag >= this.date_debut_versement.value && element.date_ag <= this.date_limite_versement.value) {
                        echeances.push({
                            montant: this.montant,
                            description: this.description,
                            date_limite: element.date_ag,
                            debit_credit: 'cotisation',
                            libelle: this.$t('Contribution') + ' - ' + this.activite.text  + ' - ' + this.description,
                        })
                    }
                })

                if (this.radios == '1') {
                    urlResource = "/api/activite/" + activite_courante.id + "/echeanciers/somes/all/members"
                    method = "association/postRequest"
                    data = echeances
                } else {
                    urlResource = "/api/activite/" + activite_courante.id + "/echeanciers/somes/some/members"
                    method = "association/postRequest"
                    data = {
                        echeanciers: echeances,
                        membres: this.membresIdChecked
                    }
                }
                let payload = {
                    resourceUrl: urlResource,
                    commitAction: 'NO_COMMIT',
                    data: data
                }
                this.$store.dispatch(method, payload)
                    .then(() => {
                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('updateCompletedSuccessfully'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })

                        this.resetForm()
                        /* this.$router.push('/association/administration/activities/generic/details') */
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
            }
        },
    },
    created(){
            EventBus.$emit('loader', true)
            let current_association = this.$store.state.association.currentAssociation

            let payload = {
              resourceUrl:"api/association/"+current_association.id+"/activite",
              commitAction: 'SET_ACTIVITES',
            }
            this.$store.dispatch("association/fetchAssociationactivite", payload)
            .then(() => {
                let payload = {
                  resourceUrl: '/api/association/' + current_association.id + '/membre',
                  commitAction: 'SET_MEMBERS'
                  }
              this.$store.dispatch("association/fetchMembers",payload)
              .then(() => {
                  let payload = {
                  resourceUrl: '/api/association/' + current_association.id + '/cycle',
                  commitAction: 'SET_CYCLES'
                  }
                  this.$store.dispatch("association/fetchCycles",payload)
                  .then((res)=>{
                      let donnees = res.data
                      //Verifier s'il ya des cycles dans l'association
                      if(donnees.data.length > 0) {
                      //Nous voullons reccuperer les cycles cloturés et le cycle actif de l'association
                      var cycle = donnees.data
                      var cycleActif =  functions.afficherCycleActif(cycle)

                      //Assignation du cycle actigf à notre variable utilisée dans le template
                      if(cycleActif != null){
                          //Assigner les ags du cycle actigf à la variable ags s'il en existe
                          if(cycleActif.ag.length > 0) this.ags = cycleActif.ag
                      }
                  }
                  })
                  .catch((error)=> {
                  window.console.error(error);
                  })
              })
              .catch((error)=> {window.console.error(error);})

              this.getAccounts()
            })
            .catch((error)=> {window.console.error(error);})
        },
}
</script>
