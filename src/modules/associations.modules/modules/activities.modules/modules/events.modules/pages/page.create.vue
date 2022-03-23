<template>
  <div v-if="isReady">
      <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
      <div class="pt-16">
        <!-- Evenement -->
        <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" :value="selectedTab" class="tabs-shadow-none z-10" id="profile-tabs">
          <!-- Parametres -->
          <vs-tab :label="!isSmallerScreen ? $t('setting'): ''" icon-pack="streameline" icon="icon-calendar-check-1">
            <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
              <settings @selectedTab="selectedTab = $event" :activity="activity"/>
            </div>
          </vs-tab>
          <!-- Enregistrement des membres -->
          <vs-tab id="slectmembers" :label="!isSmallerScreen ? $t('registeredMembers'): ''"
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
          <!-- Echéance -->
          <vs-tab :label="!isSmallerScreen ? $t('settlement'): ''" icon-pack="streameline"
            icon="icon-calendar-cash-1">
              <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                <deadlines :activity="activity" @selectedTab="selectedTab = $event"/>
              </div>
          </vs-tab>

          <!-- Mise à jour de la caisse -->
          <vs-tab :label="!isSmallerScreen ? $t('checkoutAdjustment'): ''"
            icon-pack="streameline" icon="icon-saving-piggy-coins-alternate">
              <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                <checkout-adjustment :activity="activity" @selectedTab="selectedTab = $event"/>
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
import Deadlines from '../components/Deadlines.component.vue'
import CheckoutAdjustment from '../components/Checkout.component.vue'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

//Fonctions
import functions from "../../../../../services/functions"
import { EventBus } from '@/services/EventBus'
import checkActivityType from '../../../mixins/checkActivityType'

export default {
    mixins: [checkActivityType],
    data(){
      return {
          selected: [],
          member: {},
          members: [],
          update_compte: [],
          selectedTab: 0,

          isReady: false,
      }
    },
    components: {
        Settings,
        RegisterMembers,
        AccountStatement,
        Deadlines,
        CheckoutAdjustment
    },
    computed: {
      ags() {
        return this.$store.state.association.ags;
      },

      activity(){
        return this.$store.state.association.activite;
      },

      isSmallerScreen () {
        return this.$store.state.windowWidth < 768
      }
    },
    created(){
        EventBus.$emit('loader', true);

        var current_association = this.$store.state.association.currentAssociation

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
                    if(cycleActif.ag.length > 0) this.$store.commit('association/SET_AGS', cycleActif.ag)
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
                  this.isReady = true; EventBus.$emit('loader', false);
                })
                .catch((error) => {window.console.log(error); EventBus.$emit('loader', false);})
              }
              else
                this.isReady = true; EventBus.$emit('loader', false);
            })
            .catch((error)=> {
              window.console.error(error);
            })
          })
          .catch((error)=> {
            window.console.log(error.data.data);
          })

    },
    methods: {
      userDetail(member) {
          this.member = member
      },
    }
}
</script>

<style lang="scss">

  #profile-tabs {
    .vs-tabs--content {
      padding: 0;
    }
  }
</style>
