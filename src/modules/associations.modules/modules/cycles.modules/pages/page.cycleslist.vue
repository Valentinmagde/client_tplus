<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container">
    <!-- Popup pour supprimer un cycle -->
    <vs-popup classContent="popup-example"  :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
      <p>{{$t('deleteConfirm')}}</p>
      <vs-divider/>
      <div class="vx-row w-full justify-end">
          <vs-button
            color="warning"
            @click="popupActivo2=false"
            type="border">
          {{$t('cancel')}}
          </vs-button>

          <vs-button
            class="ml-3 vs-con-loading__container"
            color="danger" ref="loadableButton"
            id="button-with-loading" :disabled="!loader"
            @click.stop="deleteItem(cycle_selectionne)">
            {{$t('delete')}}
            </vs-button>
      </div>
    </vs-popup>

    <!-- IF ADMIN -->
    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
    <div class="pt-16">
     <!--  <vx-card class="mb-5">
          <h4  class="mb-2"> {{ $t('listOfCycles') | CAPITALIZE }} </h4>
      </vx-card> -->
      <div v-if="usersData.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
        <!-- ADD NEW -->
        <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
          @click="$router.push('/association/administration/cycles').catch(() => {})">
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">{{$t('creatNewCycle')}}</span>
        </div>
      </div>

      <vx-card v-if="usersData.length == 0">
          <p>{{$t('noElementFound')}}</p>
      </vx-card>

      <!-- Tableau des cycles -->
      <vs-table  v-show="usersData.length > 0 && admin" ref="table" pagination :max-items="itemsPerPage" search :data="usersData">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <!-- <div class="flex flex-wrap-reverse items-center data-list-btn-container"> -->
            <!-- ADD NEW -->
            <!-- <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                @click="$router.push('/apps/cycle').catch(() => {})">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                  <span class="ml-2 text-base text-primary">{{$t('creatNewCycle')}}</span>
              </div>
            </div> -->
            <!-- ITEMS PER PAGE -->
            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
              <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ usersData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : usersData.length }} of {{ queriedItems }}</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
              </div>
              <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
              <vs-dropdown-menu>

                <vs-dropdown-item @click="itemsPerPage=4">
                  <span>4</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="itemsPerPage=10">
                  <span>10</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="itemsPerPage=15">
                  <span>15</span>
                </vs-dropdown-item>
                <vs-dropdown-item @click="itemsPerPage=20">
                  <span>20</span>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </div>

        <template slot="thead">
          <vs-th sort-key="firstName">{{$t('time') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="date_created">{{$t('startDate') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="type_meeting">{{$t('typeOfMeeting') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="frequence">{{$t('frequencyOfMeeting') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="order_status">{{$t('state') | CAPITALIZE }}</vs-th>
          <vs-th>{{$t('actions') | CAPITALIZE }}</vs-th>
        </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="cycle" :key="ind" v-for="(cycle, ind) in data">
                <vs-td v-if="cycle.cycle">
                  <p class="product-name font-medium truncate">{{cycle.cycle.duree_cycle+ ' '+$t('month')}}</p>
                </vs-td>

                <vs-td v-if="cycle.cycle">
                  <p class="product-category">{{ (cycle.cycle.date_premiere_assemblee) | dateTime }}</p>
                </vs-td>

                <vs-td v-if="cycle.cycle">
                <p class="product-category">{{ cycle.cycle.type_assemblee}}</p>
                </vs-td>

                <vs-td v-if="cycle.cycle">
                  <p class="product-category">{{ fetchTextPropertyFrequence(cycle.cycle.frequence_seance)}}</p>
                </vs-td>

                <vs-td v-if="cycle.cycle">
                  <p v-if="cycle.cycle.etat=='create'"  class="product-price">
                    <vs-chip>{{$t('creation')}}</vs-chip>
                  </p>
                  <p v-if="cycle.cycle.etat=='actif'"  class="product-price">
                    <vs-chip color="success">{{$t('activate')}}</vs-chip>
                  </p>
                  <p v-if="cycle.cycle.etat=='inactif'"  class="product-price">
                    <vs-chip>{{$t('deactivate')}}</vs-chip>
                  </p>
                  <p v-if="cycle.cycle.etat=='cloture'"  class="product-price">
                    <vs-chip>{{$t('fenced')}}</vs-chip>
                  </p>
                </vs-td>

                <vs-td class="whitespace-no-wrap" v-if="cycle.cycle">
                  <!-- Activer ou desactiver un cycle -->
                  <vx-tooltip v-if="cycle.cycle.etat!='cloture' && cycle.cycle.etat=='actif'" :text="$t('activate')+' '+$t('or')+ ' '+$t('desactivate') "
                    position="bottom" class="inline-block mr-2">
                      <feather-icon  icon="ToggleRightIcon" svgClasses="w-5 h-5 hover:text-success text-success stroke-current"
                      @click.stop="activerOudesactiverCycle(cycle.cycle.id, 'desactivate')"/>
                  </vx-tooltip>

                  <!-- Activer ou desactiver un cycle -->
                  <vx-tooltip v-if="cycle.cycle.etat!='cloture' && cycle.cycle.etat !='actif'" :text="$t('activate')+' '+$t('or')+ ' '+$t('desactivate')" position="bottom"
                    class="inline-block mr-2">
                      <feather-icon  icon="ToggleLeftIcon" svgClasses="w-5 h-5 hover:text-grey text-grey stroke-current"
                        @click.stop="activerOudesactiverCycle(cycle.cycle.id, 'activate')"/>
                  </vx-tooltip>

                  <!-- Supprimer un cycle -->
                  <vx-tooltip v-if="cycle.cycle.etat=='create' || cycle.cycle.etat=='inactif'" :text="$t('delete')" position="bottom" class="inline-block">
                    <feather-icon  icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" @click.stop="popupActivo2=true; cycle_selectionne=cycle.cycle.id"/>
                  </vx-tooltip>
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
// import i18n_date from '@/i18n_date.js'
import functions from '../services/functions.js'
import {frequence_seance} from '../services/data/sessionFrequency'
import checkIfAdmin from '../../../mixins/checkRole'
// Store Module
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
  mixins: [checkIfAdmin],
  data() {
    return {
      selected: [],
      // usersData: [],
      itemsPerPage: 10,
      isMounted: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: '',
      cycle_selectionne: '',
      member: {},
      role: {},
      userRoles: {},
      popupActivo2:false,
      popupActivo3:false,
      devise: '',

      /* Loading */
      backgroundLoading:'danger',
      colorLoading:'#fff',
      loader: true
    }
  },

  computed: {
    activeUserInfo() {
      return this.$store.state.authentificated.user
    },
    admin() {
      return this.isSuperAdministrator
    },
    currentPage() {
      if(this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    usersData() {
      return this.$store.state.association.cycles
    },
    queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.usersData.length
    }
  },
  methods: {
    //Retourne la valeur de proprieté "text" de l'objet frequence_seance
    fetchTextPropertyFrequence(value){
        return frequence_seance.reduce((a, o) => o.value == value ? a.concat(this.$t(o.i18n)) : a, '')
    },
    //activer ou desactiver un cycle
     activerOudesactiverCycle(cycle_id,action){
        var association_courante = this.$store.state.association.currentAssociation

        let payload = {
            resourceUrl: '/api/cycle/'+cycle_id+'/'+action,
            commitAction: 'SET_CYCLES'
        }

        this.$store.dispatch("association/fetchCycles", payload)
        .then(() => {
            let payload = {
              resourceUrl: '/api/association/' + association_courante.id + '/cycle',
              commitAction: 'SET_CYCLES'
            }

            this.$store.dispatch("association/fetchCycles",payload)
            .then( {})
            .catch((err)=> {
              window.console.error(err)
            })
        })
        .catch((error) => {
            window.console.error(error)
        })
    },

    deleteItem(id) {
      this.openLoadingContained()
      var association_courante = this.$store.state.association.currentAssociation

      let payload = {
        resourceUrl: '/api/association/' + association_courante.id + '/cycle/'+ id,
        commitAction: 'REMOVE_CYCLE',
        memberId: id
      }

      this.$store.dispatch("association/removeRecord", payload)
        .then(() => {
          this.loader = true
          this.$vs.loading.close("#button-with-loading > .con-vs-loading")
          this.popupActivo2 = false
          this.$vs.notify({
              position:'top-center',

              text: this.$t('cycleDeleteSuccessfully'),
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success'
          })

          let payload = {
            resourceUrl:"api/association/"+association_courante.id+"/activite",
            commitAction: 'SET_ACTIVITES',
          }

          this.$store.dispatch("association/fetchAssociationactivite", payload)
          .catch((error)=>{window.console.log.error(error)})
      })
      .catch(err => {
        this.loader = true
        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
        window.console.error(err)
      })
    },
    //exporation du tableau en csv
    csvExport(arrData) {
      functions.csvExport(arrData)
    },

    exportPDF(arrData){
      functions.exportPDF(arrData)
    },

    //exporation du tableau en csv
    exportExel(arrData) {
       functions.exportExel(arrData)
    },

    /* Loading */
    openLoadingContained(){
        this.loader = false
        this.$vs.loading({
            background: this.backgroundLoading,
            color: this.colorLoading,
            container: "#button-with-loading",
            scale: 0.45
        });
    },
  },
  created() {
    // if(!moduleCycle.isRegistered) {
    //     this.$store.registerModule('cycle', moduleCycle)
    //     moduleCycle.isRegistered = true
    // }
    // if(!moduleUserManagement.isRegistered) {
    //   this.$store.registerModule('userManagement', moduleUserManagement)
    //   moduleUserManagement.isRegistered = true
    // }

    // if(! moduleActivite.isRegistered) {
    //   this.$store.registerModule('activite',  moduleActivite)
    //   moduleActivite.isRegistered = true
    // }

    // if(!moduleAssociation.isRegistered) {
    //   this.$store.registerModule('association', moduleAssociation)
    //   moduleAssociation.isRegistered = true
    // }
    var current_association = this.$store.state.association.currentAssociation


    let payload = {
      resourceUrl: '/api/association/' + current_association.id + '/cycle',
      commitAction: 'SET_CYCLES'
    }

    this.$store.dispatch("association/fetchCycles",payload)
    .then( {})
    .catch((err)=> {
      window.console.error(err)
    })

    this.devise = current_association.devise
  },
  mounted() {
    this.isMounted = true;
  }
}
</script>
<style >
  v-text-field--box .v-input__slot, .v-text-field--outline .v-input__slot{
    min-height: 56px !important;
    display: flex!important;
  align-items: center!important
  }
</style>
