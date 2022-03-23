<template>
  <div v-if="isReady">
      <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
      <div class="pt-16">
        <!-- Activité Générique -->
        <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" v-model="selectedTab" class="tabs-shadow-none z-10" id="profile-tabs">

          <vs-tab :label="!isSmallerScreen ? $t('setting'): ''"
            icon-pack="streameline" icon="icon-tool-box">
            <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
              <settings :activity="activity" @selectedTab="selectedTab = $event"/>
            </div>
          </vs-tab>

          <!-- Inscription des membres -->
          <vs-tab v-if="caisse" :disabled="caisse" id="slectmembers"
            :label="!isSmallerScreen ? $t('registeredMembers'): ''" icon-pack="streameline"
            icon="icon-single-neutral-actions-add">
            <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
              <register-member :activity="activity" @selectedTab="selectedTab = $event"/>
            </div>
          </vs-tab>

          <vs-tab v-else id="slectmembers" :label="!isSmallerScreen ? $t('registeredMembers'): ''"
            icon-pack="streameline" icon="icon-single-neutral-actions-add">
            <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
              <register-members :activity="activity" @selectedTab="selectedTab = $event"/>
            </div>
          </vs-tab>

          <!-- État des comptes -->
          <vs-tab :label="!isSmallerScreen ? $t('statementOfAccounts'): ''" icon-pack="streameline"
            icon="icon-accounting-invoice">
              <div class="tab-general md:mt-0 mt-4 ml-0">
                <account-statement :activity="activity" @selectedTab="selectedTab = $event"/>
               </div>
          </vs-tab>

          <!-- Mise à jour de la caisse -->
          <vs-tab :label="!isSmallerScreen ? $t('checkoutAdjustment'): ''"
            icon-pack="streameline" icon="icon-saving-piggy-coins-alternate">
              <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                <check-out-adjustment :activity="activity" @selectedTab="selectedTab = $event"/>
               </div>
          </vs-tab>

        </vs-tabs>
      </div>
  </div>
</template>

<script>
//Composants
import Settings from '../components/Settings.component.vue'
import RegisterMembers from '../components/RegisterMembers.component.vue'
import AccountStatement from '../components/AccountStatement.component.vue'
import CheckOutAdjustment from '../components/Checkout.component.vue'

//Fonctions
import functions from "../../../../../services/functions.js"
import checkActivityType from '../../../mixins/checkActivityType'

import { EventBus } from '@/services/EventBus'

export default {
    mixins: [checkActivityType],
    data(){
      return {
          selected: [],
          member: {},
          members: [],
          update_compte: [],
          selectedTab: 0,
          ags: null,
          caisse: false,

          isReady: false
      }
    },
    components: {
        Settings,
        RegisterMembers,
        AccountStatement,
        CheckOutAdjustment,
    },
    computed: {
      activity() {
        return this.$store.state.association.activite !== '' ? this.$store.state.association.activite : '';
      },
      isSmallerScreen () {
        return this.$store.state.windowWidth < 768
      }
    },
    created(){
        // if(localStorage.getItem('activite_modif') !== null){
        //   let activite_modif = JSON.parse(localStorage.getItem('activite_modif'));

        //   if(activite_modif.type == 'caisse')
        //     this.caisse = true
        // }
        // if(localStorage.getItem('activity_create') !== null)
        //   this.activity = JSON.parse(localStorage.getItem('activite_create')).activite.nom

        // if(! moduleActivite.isRegistered) {
        //   this.$store.registerModule('activite',  moduleActivite)
        //   moduleActivite.isRegistered = true
        // }
        // if(!moduleMember.isRegistered) {
        //   this.$store.registerModule('member', moduleMember)
        //   moduleMember.isRegistered = true;
        // }

        // if(!moduleUserManagement.isRegistered) {
        //   this.$store.registerModule('userManagement', moduleUserManagement)
        //   moduleUserManagement.isRegistered = true
        // }

        // if(! moduleCompte.isRegistered) {
        //   this.$store.registerModule('compte',  moduleCompte)
        //   moduleCompte.isRegistered = true
        // }

        // if(!moduleCycle.isRegistered) {
        //     this.$store.registerModule('cycle', moduleCycle)
        //     moduleCycle.isRegistered = true
        // }

        EventBus.$emit('loader', true);

        var current_association = this.$store.state.association.currentAssociation

        let payload = {
          resourceUrl: '/api/association/' + current_association.id + '/membre',
          commitAction: 'SET_MEMBERS'
        }
        /* window.console.log(payload) */
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

                  //Assignation du cycle actif à notre variable utilisée dans le template
                  if(cycleActif != null){
                    //Assigner les ags du cycle actigf à la variable ags s'il en existe
                    if(cycleActif.ag.length > 0) this.ags = cycleActif.ag
                  }
                }

                let activityNeedsFetching = localStorage.getItem('activity_id') !== null;

                if(activityNeedsFetching) {
                  let activity_id = localStorage.getItem('activity_id');

                  let payload = {
                    resourceUrl:"api/association/"+current_association.id+"/activite/"+activity_id,
                    commitAction: 'SET_ACTIVITE',
                  }

                  this.$store.dispatch("association/fetchAssociationactivite", payload)
                  .then((res) => {
                    this.checkActivityType(res.data.data)
                    let activite = res.data.data

                    if(activite.type == "caisse"){
                       this.caisse = true
                    }
                    this.isReady = true; EventBus.$emit('loader', false);
                  })
                  .catch((error) => {window.console.log(error); EventBus.$emit('loader', false);})
                }
                else
                  this.isReady = true; EventBus.$emit('loader', false);
            })
            .catch((error)=> {
              window.console.error(error); this.isReady = true;
            })
          })
          .catch((error)=> {
            window.console.log(error.data.data); this.isReady = true;
          })

    },
}
</script>

<style lang="scss">
  #profile-tabs {
    .vs-tabs--content {
      padding: 0;
    }
  }
</style>
