<!-- =========================================================================================
  File Name: cycle.vue
  Description: cycle page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div>
     <!-- ACTION - DROPDOWN -->
    <vs-dropdown v-if="admin" vs-trigger-click class="ml-auto md:block cursor-pointer fixed z-50" style="right:35px">
        <vs-button  v-if="admin" icon="icon-settings" icon-pack="feather">{{$t('actions')}}</vs-button>

        <vs-dropdown-menu class="w-48">
            <vs-dropdown-item>
            <div @click="$router.push('/association/administration/cycles/list').catch(() => {})" class="flex items-center">
                <feather-icon icon="ListIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                <span>{{$t('list')}}</span>
            </div>
            </vs-dropdown-item>
            <vs-dropdown-item v-if="cycle_actif">
              <div @click="$router.push(`/association/administration/cycles/close/${cycle_actif.cycle.id}`).catch(() => {})" class="flex items-center">
                  <!-- <feather-icon icon="ListIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
                  <vs-icon class="inline-block text-lg mr-2" iconPack="streameline" icon="icon-login-lock"/>
                  <span>{{$t('cloturer')}}</span>
              </div>
            </vs-dropdown-item>
        </vs-dropdown-menu>

    </vs-dropdown>
    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
    <!-- left -->
    <div class="pt-16">
      <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none z-10"
        :value="selectedTab" id="profile-tabs">

        <vs-tab :label="!isSmallerScreen ? $t('setting'): ''" icon-pack="streameline" icon="icon-calendar-refresh">
          <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <vx-card class="mt-0" no-shadow v-if="error && createNewCycle" :title="$t('cycleSettings')">
              <p>
                {{$t('cycleContent')}}
              </p>
              <div class="flex flex-wrapper mt-6">
                <vs-button @click="showCycleForm($event)">{{$t('creatNewCycle')}}</vs-button>
              </div>
            </vx-card>
          </div>

          <!-- Creation d'un cycle -->
          <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <create-cycle v-if="createNewCycleForm && !cycle_actif" :cycle_actif="cycle_actif"
              @cycle_actif="cycle_actif = $event"/>
            <!-- Fin Creation d'un cycle -->
          </div>

          <!-- Generation des ags -->
          <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <generate-ag v-if="cycle_actif && generateGeneralMeeting" :ags="ags" :cycle_actif="cycle_actif"
              @ags="ags = $event" @cycle_actif="cycle_actif = $event" @selectedTab="selectedTab = $event"
            />
          </div>
          <!-- Fin Generation des ags -->
        </vs-tab>
        <vs-tab :label="!isSmallerScreen ? $t('generalMeetings'): ''" icon-pack="streameline" icon="icon-multiple-actions-home">
          <!-- Assemmblée générale -->
          <div id="setting" class="tab-general md:mt-0 mt-4 ml-0">
            <ag-list :ags="ags" :cycle_actif="cycle_actif"></ag-list>
          </div>
        </vs-tab>
        <!-- <vs-tab :label="$t('registration')" icon-pack="streameline" icon="icon-single-man-actions-money">
          <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <register :ags="ags" :cycle_actif="cycle_actif"></register>
          </div>
        </vs-tab> -->
        <vs-tab :label="!isSmallerScreen ? $t('archives'): ''" icon-pack="streameline" icon="icon-folder-clock">
          <div id="setting" class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
            <archives :cycle_clotures="cycle_clotures"></archives>
          </div>
        </vs-tab>
      </vs-tabs>
    </div>
  </div>
</template>

<script>
//Composants
import AgList from '../components/AgList.component.vue'
import Archives from '../components/Archives.component.vue'
import CreateCycle from '../components/CreateCycle.component.vue'
import GenerateAg from '../components/GenerateAgs.component.vue'
// import Register from './register'


// Store Module
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleAg from "@/store/ags/moduleAg.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"

//Fonctions
import functions from "../services/functions.js"
import { EventBus } from  '@/services/EventBus.js'

import checkIfAdmin from '../../../mixins/checkRole'

//Importation des fichiers css
import 'flatpickr/dist/flatpickr.css';

export default {
  mixins: [checkIfAdmin],

  components: {
    AgList,
    Archives,
    CreateCycle,
    GenerateAg,
    // Register
  },
  data() {
    return {
      cycle_clotures: null,
      cycle_actif: null,
      ags: null,
      error: null,
      current_association: null,
      star: '*',
      disable: false,
      generateGeneralMeeting: true,
      createNewCycle: true,
      createNewCycleForm: false,
      selectedTab: 0,
    }
  },
  computed: {
    isSmallerScreen () {
      return this.$store.state.windowWidth < 768
    }
  },
  methods: {
    admin() {
      return this.isSuperAdmin();
    },

    showCycleForm(event) {
      event.preventDefault();
      setTimeout(() => {
        this.createNewCycle = false;
        this.createNewCycleForm = true
      }, 500);
    },
  },
  created() {
    EventBus.$emit('loader', true)
    // if(!moduleAg.isRegistered) {
    //     this.$store.registerModule('ag', moduleAg)
    //     moduleAg.isRegistered = true
    // }
    // if(!moduleCycle.isRegistered) {
    //     this.$store.registerModule('cycle', moduleCycle)
    //     moduleCycle.isRegistered = true
    // }
    // if(!moduleUserManagement.isRegistered) {
    //   this.$store.registerModule('userManagement', moduleUserManagement)
    //   moduleUserManagement.isRegistered = true
    // }
    // if(!moduleAssociation.isRegistered) {
    //   this.$store.registerModule('association', moduleAssociation)
    //   moduleAssociation.isRegistered = true
    // }
    this.current_association = this.$store.state.association.currentAssociation

    // this.$store.commit('SET_CURRENT_ASSOCIATION', JSON.parse(localStorage.getItem('association_courante')))
    // window.console.log(this.associations)

    let payload = {
      resourceUrl: '/api/association/' + this.current_association.id + '/cycle',
      commitAction: 'SET_CYCLES'
    }
    this.error = this.cycle_actif = null
    this.$store.dispatch("association/fetchCycles",payload)
    .then((res)=>{
      EventBus.$emit('loader', false)
      let donnees = res.data
      //Verifier s'il ya des cycles dans l'association
      if(donnees.data.length > 0) {
          //Nous voullons reccuperer les cycles cloturés et le cycle actif de l'association
          var cycle = donnees.data
          var cycleClotures = functions.afficherCycleClotures(cycle)
          var cycleActif =  functions.afficherCycleActif(cycle)

          //Assignation des cycles cloturés à notre variable utilisée dans le template
          if(cycleClotures.length > 0) this.cycle_clotures = cycleClotures
          //Assignation du cycle actigf à notre variable utilisée dans le template
          if(cycleActif != null){
            this.cycle_actif = cycleActif
            //Assigner les ags du cycle actigf à la variable ags s'il en existe
            if(cycleActif.ag.length > 0) this.ags = cycleActif.ag
          }
          else{
            this.error = "no-data"
          }
      }
      else{
        this.error = "no-data"
      }
    })
    .catch((error)=>{
      EventBus.$emit('loader', false)
      window.console.log(error)
      this.error = "no-data"
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

