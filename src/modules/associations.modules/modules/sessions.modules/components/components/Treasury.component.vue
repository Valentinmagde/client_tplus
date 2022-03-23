<template>
    <div>
        <div>
            <div class="ml-5 mr-5">
                <vx-card no-shadow class="mb-base">
                    <h5>{{$t('stateOfCash') | CAPITALIZE }}</h5>
                    <p class="mt-2 text-muted">{{$t('stateOfCashSubtitle')}}</p>
                </vx-card>
                <vx-card v-if="tresoreriesData.length == 0">
                    <p>{{$t('noElementFound')}}</p>
                </vx-card>
            </div>

            <!-- Total en caisse -->
             <div v-if="tresoreriesData.length > 0" class="flex wrap justify-end mb-5">
               <div class="text-center mr-12">
                <span>
                    <h2 class="font-bold" :class="{redtextclass: totalTresorerie < 0}">
                      {{ totalTresorerie | formatMoney(devise) }}
                    </h2>
                </span>
                <span>
                    {{$t('cashTotal')}}
                </span>
               </div>
            </div>

            <div class="vx-row">
              <div v-if="tresoreriesData.length > 0" class="vx-col w-full ml-4 mr-4 mb-base">
                <vx-card :title="$t('treasury')">
                  <!-- Download Actions -->
                  <div slot="no-body" class="mt-4">
                    <div class="vx-row justify-end flex pb-5 mr-5" style="margin-top: -2.3rem !important">
                        <vs-dropdown vs-trigger-click class="relative right-0 cursor-pointer self-end">
                            <small class="flex cursor-pointer">
                                <span>{{$t('exports')}}</span>
                                <feather-icon icon='ChevronDownIcon' svgClasses='h-4 w-4' class='ml-1' />
                            </small>
                            <vs-dropdown-menu class="w-32">
                                <vs-dropdown-item @click.native="exportPDF(tresoreriesData)">PDF</vs-dropdown-item>
                                <vs-dropdown-item @click.native="csvExport(tresoreriesData)">CSV</vs-dropdown-item>
                                <vs-dropdown-item @click.native="exportExel(tresoreriesData)">EXCEL</vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </div>

                    <vs-table  ref="table" :data="tresoreriesData">
                        <template slot="thead">
                            <vs-th style="width:33%" sort-key="heading">{{$t('heading')}}</vs-th>
                            <vs-th style="width:33%" sort-key="name">{{$t('name')}}</vs-th>
                            <vs-th  class="customer-align" sort-key="amount">{{$t('Amount')}}</vs-th>
                            <vs-th style="width: 25%" class="customer-align" sort-key="actions">{{$t('actions')}}</vs-th>
                        </template>

                        <template slot-scope="{data}">
                        <tbody>
                            <vs-tr :data="activite" :key="ind" v-for="(activite, ind) in data">
                                <vs-td>
                                    <p class="product-name font-medium truncate">{{activite.activite.type}}</p>
                                </vs-td>
                                <vs-td>
                                    <p class="product-name truncate">{{activite.activite.nom}}</p>
                                </vs-td>
                                <vs-td>
                                    <p class="text-right" :class="{redtextclass: activite.tresorerie < 0}">
                                      {{ (activite.tresorerie) | formatMoney(devise) }}
                                    </p>
                                </vs-td>

                                <vs-td class="text-right pr-8">
                                  <vx-tooltip :text="$t('withdrawMoney')" v-if="activite.activite.type=='caisse' || activite.activite.type=='Generique' || activite.activite.type=='Evenement'" position="bottom" class="inline-block ">
                                      <vs-icon 
                                          icon-pack="streameline" 
                                          icon="icon-cash-payment-bag" 
                                          style="font-size: 18px" 
                                          class="hover:text-primary" 
                                          size="small"
                                           @click.stop="sendData('RetraitArgent', activite.activite)"
                                         >
                                      </vs-icon>
                                  </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </tbody>
                        </template>
                    </vs-table>
                  </div>
                </vx-card>
              </div>
            </div>
        </div>

        <div class="flex flex-wrapper mt-6 ml-4">
            <vs-button type="border" class="mr-6" id="button-loading"
              @click.native="previous(5)">{{$t('previous')}}
            </vs-button>

            <vs-button class="mr-6" id="button-loading"
              @click.native="next(7)">{{$t('next')}}
            </vs-button>
        </div>
        <Data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" :activity="activite" :etat="etat" />
    </div>
</template>
<script>
import sidebar from '../../services/mixins/sidebar'
import dataProprety from '../../services/mixins/data'
import DataViewSidebar from '../../../../components/sidebar/DataViewSidebar.component'

//Fonctions
import functions from '../../services/functions.js'
import { EventBus } from  '@/services/EventBus.js'
//Store
// import moduleFinance from "@/store/finance/moduleFinance.js"

export default {
    props:{
      roles: {
        required: true
      }
    },
    mixins:[sidebar,dataProprety],
    data(){
        return {
          devise: '',
          itemsPerPage: 10,

          addNewDataSidebar: false,
          sidebarData: {},
          etat: '',
          activite: {},
        }
    },
    computed: {
      tresoreriesData(){
        return this.$store.state.association.tresoreries
      },
      totalTresorerie(){
          let data = this.tresoreriesData

          let sum = 0

          if(data.length){
              data.forEach(element => {
                  sum += element.tresorerie
              });
          }

          return sum
      },
      currentPage() {
        if(this.isMounted && this.$refs.table != undefined) {
            return this.$refs.table.currentx
        }
        return 1
      },
      queriedItems() {
        return this.$refs.table ? this.$refs.table.queriedResults.length : this.tresoreriesData.length
      },
    },

    components:{
      DataViewSidebar
    },
    methods: {
      sendData(etat, activite) {
          this.etat = etat
          this.activite = activite
          this.sidebarData = {}
          this.toggleDataSidebar(true)
      },
      //exporation du tableau en csv
      csvExport(arrData) {
        functions.csvExportTresorerie(arrData)
      },

      exportPDF(arrData){
        functions.exportPDFTresorerie(arrData)
      },

      //exporation du tableau en csv
      exportExel(arrData) {
        functions.exportExelTresorerie(arrData)
      },

      toggleDataSidebar(val = false) {
          this.addNewDataSidebar = val
      }
    },
    created(){
        EventBus.$emit('loader', true)
        var association_courante = this.$store.state.association.currentAssociation

        let payload = {
          resourceUrl:"api/association/"+association_courante.id+"/activites/tresorerie",
          commitAction: 'SET_TRESORERIES',
        }

        this.$store.dispatch("association/fetchFinances",payload)
        .then(()=>{
          EventBus.$emit('loader', false)
        })
        .catch((error)=>{
          EventBus.$emit('loader', false)
          window.console.log(error)
        })

        this.devise = association_courante.devise
    },
    mounted() {
        this.isMounted = true;
    }
}
</script>
<style lang="css">
  .customer-align .vs-table-text{
    text-align: right;
    margin-left: auto;
    display: block
  }
</style>
