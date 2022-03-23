<template>
    <div>
        <!-- ACTION BUTTON -->
        <action-button v-if="admin" :activity="activity"/>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <vx-card class="mr-4" no-shadow :title="$t('decaissementParams').toUpperCase()+' - '+nom_activite">
                <div class="ep-association">
                    <!-- Montant -->
                    <p class="vs-input--label">{{$t('Amount')+ ' *'}}</p>
                    <money
                        v-model="montant"
                        v-bind="money"
                        class="money-input p-3 w-full mb-5"
                    />

                    <!-- Description -->
                    <vs-input
                        :label="$t('description')"
                        v-model="description"
                        class="w-full mb-5"
                    />

                    <!-- Date de decaissement -->
                    <p class="vs-input--label">{{$t('disbursementDate')+ ' *'}}</p>
                    <v-select
                        :options="selectOptionsProchainesAgs"
                        v-model="date_decaissement"
                        label="text"
                        class="w-full mb-5"/>
                    <!-- Membres -->
                    <p class="vs-input--label">{{$t('beneficiaire')+ ' *'}}</p>
                    <v-select
                        :options="selectOptionsMembers"
                        v-model="beneficiaire"
                        label="text"
                        class="w-full mb-5"/>

                </div>
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
import {Money} from 'v-money'
import vSelect from 'vue-select'
import ActionButton from '../components/ActionButton.component.vue'
import checkIfAdmin from '../../../../../mixins/checkRole'
import checkActivityType from '../../../mixins/checkActivityType'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

//Fonctions
import functions from "../../../../../services/functions"
/* import {deadline_frequence} from './deadlineFrequence.js' */

    export default {
        mixins: [checkIfAdmin, checkActivityType],
        data(){
            return{
                selected: [],
                montant: '',
                description: '',
                beneficiaire: '',
                frequence: '',
                date_decaissement: '',
                membres: [],
                nom_activite: '',
                ags: null,

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
        computed : {
            admin() {
              return this.isSuperAdministrator;
            },
            activity() {
              return this.$store.state.association.activite
            },
            selectOptions(){
                if(this.ags != null) return this.ags.map(ag => ({id: ag.id, text: this.$options.filters.dateTime(ag.date_ag), value: ag.date_ag}))
            },
            selectOptionsProchainesAgs(){
                var prochaines_ags = []

                if(this.ags != null) {
                    this.ags.forEach(element => {
                        if(element.etat != 'past' && element.etat != 'cloture'){
                            prochaines_ags.push(element)
                        }
                    });
                }
                if(prochaines_ags.length > 0 ) return prochaines_ags.map(ag => ({id: ag.id, text: this.$t('GM')+' '+this.$options.filters.dateTime(ag.date_ag)+ ' ['+ag.membre+']', value: ag.date_ag}))
            },
            selectOptionsMembers(){
                if(this.membres.length > 0 )
                    return this.membres.map(membre => ({text: membre.membre, value: membre.membres_id}))
            },
            validateForm() {
                return this.montant != '' && this.date_decaissement !=''  && this.radios !=''
            },
        },
        mounted(){

        },
        methods: {
            filterKey(e){
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
            filterInput(e){
            e.target.value = e.target.value.replace(/[^0-9]+/g, '');
            },
            getAccounts(id){
                let payload = {
                    resourceUrl: '/api/activite/'+id+'/comptes/all',
                    commitAction: 'SET_ACCOUNTS'
                }

                this.$store.dispatch("association/fetchComptemembreActivite", payload)
                .then((res) => {
                    this.membres = res.data.data
                })
            },
            onChange(id, libelle, $event){
                if($event.target.checked && !this.membresIdChecked.includes(id)) {
                    this.membresIdChecked.push(id)
                    this.selected.push(libelle)
                }
                else if(!$event.target.checked && this.membresIdChecked.includes(id)) {
                    var index = this.membresIdChecked.indexOf(id)
                    delete this.membresIdChecked[index]
                    delete this.selected[index]
                }

            },
            create(){
                var activite_courante = this.$store.state.association.activite

                let payload = {
                  resourceUrl: "/api/activite/"+ activite_courante.id+"/echeancier/some",
                  commitAction: 'SET_ACTIVITE',
                  data: {
                    echeancier: {
                      montant: this.montant,
                      description: this.description,
                      date_limite: this.date_decaissement.value,
                      debit_credit: 'decaissement',
                      libelle: this.$t('decaissementParams') + ' - ' + this.nom_activite + ' - '+ this.description
                    },
                    membres: [this.beneficiaire.value]
                  }
                }

                this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                  this.$vs.notify({
                    position:'top-center',

                    text: this.$t('notifContent'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                  })
                  this.$router.push('/association/administration/activities/generic/details')
                })
                .catch(error => {
                  this.$vs.notify({
                    position:'top-center',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                  })
                })
              }
        },
        created(){
            let current_association = this.$store.state.association.currentAssociation
            let activity_id = localStorage.getItem('activity_id')
            let payload = {
              resourceUrl:"api/association/"+current_association.id+"/activite/"+activity_id,
              commitAction: 'SET_ACTIVITE',
            }

            this.$store.dispatch("association/fetchAssociationactivite", payload)
            .then((res) => {
              this.checkActivityType(res.data.data)
              this.nom_activite = res.data.data.nom.toUpperCase()

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
                  .then(() => {
                    this.getAccounts(activity_id)
                  })
                  .catch((error)=> {
                  window.console.error(error);
                  })
              })
              .catch((error)=> {window.console.error(error)})

          },
        )}
    }
</script>
<style lang="css">
    .select-member-btn {
        padding-top: 3px !important;
        padding-bottom: 3px !important;
    }
</style>
