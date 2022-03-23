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
    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
    />

    <!-- Tableau des activités d'un membre -->
    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <!-- <div class="ml-5 mb-base pr-5">
          <vx-card>
              <h4  class="mb-2"> {{ $t('listOfAccounts') | CAPITALIZE }} </h4>
          </vx-card>
        </div> -->
        <vx-card v-if="usersData.length == 0">
          <p>{{$t('noElementFound')}}</p>
        </vx-card>
      </div>
      <vs-table v-show="usersData.length > 0" ref="table" pagination :max-items="itemsPerPage" search :data="usersData">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

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
          <vs-th sort-key="type">{{$t('Type') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="name">{{$t('name') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="date_created">{{$t('creationDate') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="balance" class="customer-align">{{$t('balance') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="penality" class="customer-align"> {{$t('debtPenalityLate') | CAPITALIZE }} </vs-th>
          <vs-th sort-key="debt" class="customer-align"> {{$t('debtBond') | CAPITALIZE }} </vs-th>
          <vs-th sort-key="state"> {{$t('state') | CAPITALIZE }} </vs-th>
          <vs-th>{{$t('actions') | CAPITALIZE }}</vs-th>
        </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :key="ind" v-for="(activity, ind) in data">
                <vs-td>
                  <p class="product-name font-medium truncate">{{activity.activite.type}}</p>
                </vs-td>

                <vs-td>
                  <p class="product-category">{{activity.activite.nom}}</p>
                </vs-td>

                <vs-td>
                  <p class="product-category">{{ activity.activite.date_created | dateTime }}</p>
                </vs-td>

                <vs-td>
                  <p class="product-category text-right" :class="{redtextclass: activity.compte.solde < 0}">
                    {{ activity.compte.solde | formatMoney(devise) }}
                  </p>
                </vs-td>

                <vs-td>
                    <p class="product-category text-right" :class="{redtextclass: activity.compte.dette_a < 0}">
                      {{ activity.compte.dette_a | formatMoney(devise) }}
                    </p>
                </vs-td>

                <vs-td>
                    <p class="product-category text-right" :class="{redtextclass: activity.compte.dette_c < 0}">
                      {{ activity.compte.dette_c | formatMoney(devise) }}
                    </p>
                </vs-td>

                <vs-td>
                    <p class="product-category">
                        <span v-if="activity.activite.etat == 'actif'">
                          <vs-chip color="success">{{$t('activated')}}</vs-chip>
                        </span>
                        <span v-if="activity.activite.etat == 'inactif'">
                          <vs-chip color="danger">{{$t('desactivated')}}</vs-chip>
                        </span>
                        <span v-if="activity.activite.etat == 'init'">
                          <vs-chip>{{$t('creation')}}</vs-chip>
                        </span>
                    </p>
                </vs-td>

                <vs-td class="whitespace-no-wrap">
                    <vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block ">
                      <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                        @click.stop="sendData('DetailActivite',activity)" />
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
import DataViewSidebar from '../../../components/sidebar/DataViewSidebar.component.vue'

// Functions
import { EventBus } from  '@/services/EventBus.js'
import { mapGetters } from 'vuex'

// Store Module
// import moduleMember from "@/store/member/moduleMember.js"

export default {
  components: {
    DataViewSidebar
  },
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
      visibilite: '',
      popupActivo2:false,
      popupActivo3:false,
      devise: ''
    }
  },

  computed: {
    ...mapGetters({
      currentAssociation: 'association/getCurrentAssociation',
      activeUserInfo: 'authentificated/getAuth',
      membre_selectionne: 'association/getMember'
    }),
    usersData() {
      return this.$store.state.association.member_activities
    },
    currentPage() {
      if(this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.usersData.length
    }
  },
  methods: {
    sendData(etat, data) {
      this.etat = etat
      this.sidebarData = data
      this.toggleDataSidebar(true)
    },
    toggleDataSidebar(val=false) {
      this.addNewDataSidebar = val
    }
  },
  created() {
    EventBus.$emit('loader', true)
    // if(!moduleMember.isRegistered) {
    //     this.$store.registerModule('member', moduleMember)
    //     moduleMember.isRegistered = true
    // }

    var current_association = this.currentAssociation
    var current_member_id = this.membre_selectionne ? this.membre_selectionne.id : JSON.parse(localStorage.getItem('member_id'));
    let payload = {
      resourceUrl: '/api/association/' + current_association.id + '/membre/'+current_member_id+'/activites',
      commitAction: 'SET_MEMBER_ACTIVITIES'
    }

    this.$store.dispatch("association/fetchMemberActivities",payload)
    .then(()=>{
      EventBus.$emit('loader', false)
    })
    .catch((err)=> {
      EventBus.$emit('loader', false)
      window.console.error(err)
    })

    /* Visibilité de l'association courante */
    this.visibilite = current_association.visibilite_financiere

    //Devise de l'association
    this.devise = current_association.devise

  },
  mounted() {
    this.isMounted = true;
  }
}
</script>
<style scoped>
  .customer-align .vs-table-text{
    text-align: right;
    display: block

  }
</style>
