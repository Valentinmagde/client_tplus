<template>
  <div v-if="isReady">
    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
    <div class="pt-16">
      <!-- Activité Générique -->
      <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" :value="selectedTab" class="tabs-shadow-none z-10" id="profile-tabs">
        <!-- Paramètres -->
        <vs-tab v-if="etat_tontine" :disabled="etat_tontine"
        :label="!isSmallerScreen ? $t('setting'): ''" icon-pack="streameline" icon="icon-money-bags">
          <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <settings @selectedTab="selectedTab = $event" @type_tontine="type_tontine = $event" :ags="ags" :activity="activity"/>
          </div>
        </vs-tab>

        <vs-tab v-else :label="!isSmallerScreen ? $t('setting'): ''" icon-pack="streameline" icon="icon-money-bags">
          <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <settings @selectedTab="selectedTab = $event" @type_tontine="type_tontine = $event" :ags="ags" :activity="activity"/>
          </div>
        </vs-tab>

        <!-- Enregistrement des membres -->
        <vs-tab id="slectmembers" :label="!isSmallerScreen ? $t('membershipRegistration'): ''"
        icon-pack="streameline" icon="icon-single-neutral-actions-add">
          <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <register-members :etat_tontine="etat_tontine"
              @selectedTab="selectedTab = $event" @disable="disable = $event" :activity="activity"/>
          </div>
        </vs-tab>

        <!-- Attribution des lots -->
        <vs-tab v-if="disable" :label="!isSmallerScreen ? $t('allocationOfLots'): ''" :disabled="disable"
          icon-pack="streameline" icon="icon-single-man-actions-money">
            <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
              <lots-allocation @selectedTab="selectedTab = $event" :ags="ags" :activity="activity"/>
            </div>
        </vs-tab>
        <vs-tab v-else :label="!isSmallerScreen ? $t('allocationOfLots'): ''" icon-pack="streameline"
        icon="icon-cash-payment-bag-1">
          <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <lots-allocation @selectedTab="selectedTab = $event" :ags="ags" :activity="activity"/>
          </div>
        </vs-tab>

        <!-- État des comptes -->
        <vs-tab v-if="etat_tontine" :disabled="etat_tontine" :label="!isSmallerScreen ? $t('statementOfAccounts'): ''"
          icon-pack="streameline" icon="icon-accounting-invoice">
          <div class="tab-general md:ml-0 md:mt-0 mt-4 ml-0">
            <account-statement @selectedTab="selectedTab = $event" :activity="activity"/>
          </div>
        </vs-tab>
        <vs-tab v-else :label="!isSmallerScreen ? $t('statementOfAccounts'): ''" icon-pack="streameline"
          icon="icon-accounting-invoice">
          <div class="tab-general md:ml-0 md:mt-0 mt-4 ml-0">
            <account-statement @selectedTab="selectedTab = $event" :activity="activity"/>
          </div>
        </vs-tab>

        <!-- Échéances -->
          <vs-tab v-if="etat_tontine" :disabled="etat_tontine" :label="!isSmallerScreen ? $t('checkoutAdjustment'): ''"
            icon-pack="streameline" icon="icon-saving-piggy-coins-alternate">
            <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
              <checkout @selectedTab="selectedTab = $event" :ags="ags" :activity="activity"/>
            </div>
          </vs-tab>
           <vs-tab v-else :label="!isSmallerScreen ? $t('checkoutAdjustment'): ''" icon-pack="streameline"
            icon="icon-saving-piggy-coins-alternate">
              <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
                <checkout @selectedTab="selectedTab = $event" :ags="ags" :activity="activity"/>
              </div>
          </vs-tab>

        </vs-tabs>
    </div>
  </div>
</template>

<script>
//Composants
import LotsAllocation from '../components/LotsAllocation.component.vue'
import Settings from '../components/Settings.component.vue'
import RegisterMembers from '../components/RegisterMembers.component.vue'
import AccountStatement from '../components/AccountStatement.component.vue'
import Checkout from '../components/Checkout.component.vue'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

//Fonctions
import functions from "../../../../../services/functions.js"
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
          // activity: "",
          // ags: null,
          type_tontine: null,
          disable: false,
          etat_tontine: false,
          selectedTab: 0,

          isReady: false
      }
    },
    components: {
        LotsAllocation,
        Settings,
        RegisterMembers,
        AccountStatement,
        Checkout
    },
    beforeMount(){
      if(localStorage.getItem('activity_id') !== null){
          var activite_courante = this.$store.state.association.activite

          var etat = activite_courante.etat
          if(etat == 'actif') {
            this.etat_tontine = true
            this.selectedTab = 1
          }
      }

    },
    computed: {
      activity() {
        return this.$store.state.association.activite !== '' ? this.$store.state.association.activite : ''
      },
      ags() {
        return this.$store.state.association.ags !== [] ? this.$store.state.association.ags : null
      },
      isSmallerScreen () {
        return this.$store.state.windowWidth < 768
      }
    },
    methods: {
      userDetail(member) {
          this.member = member
      },
    },

    created(){
        EventBus.$emit('loader', true);

        var current_association = this.$store.state.association.currentAssociation

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
                if(cycleActif.ag.length > 0) this.$store.commit('association/SET_AGS', cycleActif.ag);
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
          .catch((error) => {window.console.error(error); this.isReady = true})
          }
          else
            this.isReady = true; EventBus.$emit('loader', false);
        })
        .catch((error)=> {
          window.console.error(error);
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
