
<template>
    <div id="data-list-list-view" class="data-list-container">
        <!-- IMAGE WINDOW MODAL -->
        <div id="myModal" class="modal">
          <span class="close">&times;</span>
          <img class="modal-content" id="img01">
          <div id="caption"></div>
        </div>

        <!-- FORMULAIRE DE VALIDATIION D'UNE OPERATION-->
        <data-view  
          @closeSidebar="toggleDataSidebar"
          :isSidebarActive="addNewDataSidebar"
          :data="emptyData">
          <h4 slot="title">{{$t('paymentsPendingValidation')}}</h4>

          <template
            v-if="formIsActiveted && (roles.includes('Administrateur') || roles.includes('Financier'))"
            slot="component">
              <operation-tag
                @child:validate = "(fn) => fnValidate = fn"
                @child:reject = "(fn) => fnReject = fn"
                :update= "updateDataView"
                :toggleDataSidebar="toggleDataSidebar"
                :idLoaderValidate ="'button-with-loading-validate'"
                :idLoaderReject ="'button-with-loading-reject'"
              />
          </template>

          <vs-button
            ref="loadableButton"
            class="mr-6 vs-con-loading__container"
            id="button-with-loading-reject"
            type="border"
            color="danger"
            @click="rejectOperation">
            {{ $t('reject')}}
          </vs-button>

          <vs-button
            ref="loadableButton"
            class="mr-6 vs-con-loading__container"
            id="button-with-loading-validate"
            @click="validitateOperation" >
            {{ $t('Validate')}}
          </vs-button>

       </data-view>

        <!-- Popup pour supprimer une opération -->
        <vs-popup 
          classContent="popup-example" 
          :title="$t('rejectionConfirmation')" 
          :active.sync="popupActivo2">
         <p>{{$t('rejectionConfirmationSubtitle')}}</p>
          <vs-divider/>
          <div class="vx-row w-full justify-end">
              <vs-button  
                color="warning" 
                @click="popupActivo2=false" 
                type="border">
                {{$t('cancel')}}
              </vs-button>&nbsp;&nbsp;
              <vs-button 
                class="ml-3" 
                color="danger" 
                @click.stop="reject(operation_selectionne)">
                {{$t('reject')}}
              </vs-button>
          </div>
        </vs-popup>

        <div class="mr-5">
            <vx-card 
              no-shadow 
              class="mb-base pb-base" 
              :title="$t('paymentsPendingValidation')">
            </vx-card>
            <vx-card no-shadow v-if="operationsData.length == 0">
                <p>{{$t('noElementFound')}}</p>
            </vx-card>
        </div>
        <vs-table 
          class="mt-4 w-full" 
          id="operation-tab" 
          v-if="operationsData.length > 0 " 
          ref="table" 
          pagination 
          :max-items="itemsPerPage" 
          search 
          :data="operationsData">
          <div 
            slot="header" 
            class="flex flex-wrap-reverse items-center flex-grow justify-between">

              <!-- ITEMS PER PAGE -->
              <vs-dropdown 
                vs-trigger-click 
                class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                  <div 
                    class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                  <span 
                    class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ operationsData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : operationsData.length }} of {{ queriedItems }}</span>
                  <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                  </div>
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
                <vs-th sort-key="firstName">{{$t('accounts') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="payment_date">{{$t('paymentDate') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="amount">{{$t('Amount') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="creation_date">{{$t('creationDate') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="method">{{$t('paymentMethod') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="method">{{$t('state') | CAPITALIZE }}</vs-th>
                <vs-th>{{$t('actions') | CAPITALIZE }}</vs-th>
            </template>

            <template slot-scope="{data}">
            <tbody>
                <vs-tr :data="operation" :key="ind" v-for="(operation, ind) in data">
                    <vs-td>
                        <p class="product-name font-medium truncate">{{operation.membre}}</p>
                    </vs-td>
                    <vs-td>
                        <p class="product-name">{{ (operation.date_versement) | dateTime }}</p>
                    </vs-td>
                    <vs-td>
                        <p class="product-name" :class="{redtextclass: operation.montant < 0}">
                          {{ (operation.montant) | formatMoney(devise) }}
                        </p>
                    </vs-td>
                    <vs-td>
                        <p class="product-name">{{ (operation.date_creation) | dateTime }}</p>
                    </vs-td>
                    <vs-td>
                        <p class="product-category">{{operation.mode}}</p>
                    </vs-td>
                    <vs-td>
                        <p v-if="operation.etat == 'EN_ATTENTE'" class="product-category">
                            <vs-chip color="warning">{{$t('waiting')}}</vs-chip>
                        </p>
                        <p v-if="operation.etat == 'VALIDE'" class="product-category">
                            <vs-chip color="success">{{$t('validated')}}</vs-chip>
                        </p>
                        <p v-if="operation.etat == 'REJETE'" class="product-category">
                            <vs-chip color="danger">{{$t('rejected')}}</vs-chip>
                        </p>
                    </vs-td>
                    <vs-td class="whitespace-no-wrap">
                        <!-- VALIDER UNE OPERATION -->
                        <vx-tooltip 
                          :text="$t('Validate')" 
                          v-if="operation.etat == 'EN_ATTENTE' && (roles.includes('Administrateur') || roles.includes('Financier'))" 
                          position="bottom"  
                          class="inline-block ml-2">
                            <feather-icon 
                              icon="CheckSquareIcon" 
                              svgClasses="w-5 h-5 hover:text-primary stroke-current"
                            @click.stop="redirectValidate(operation); formIsActiveted=true ; updateDataView=operation ; addNewDataSidebar=true"/>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </tbody>
            </template>
        </vs-table>
        <div class="flex flex-wrapper mt-6 ml-4">
            <vs-button type="border" class="mr-6" id="button-loading"
              @click.native="previous(0)">{{$t('previous')}}</vs-button>

            <vs-button @click.native="next(2)">{{$t('next')}}</vs-button>
        </div>
    </div>
</template>
<script>

//Fonctions
import {payment_mod} from '../../services/data/paymentMod.js'
import functions from '../../services/functions.js'

import { EventBus } from  '@/services/EventBus.js'

//Store
// import moduleFinance from "@/store/finance/moduleFinance.js"

import dataProprety from '../../services/mixins/data'
import sidebar from '../../services/mixins/sidebar'

import OperationTag from './ValidateOperation.component'

export default {
    mixins:[dataProprety,sidebar],
    props: ['roles'],
    components:{
       OperationTag
    },
    data(){
        return {
            admin: false,
            itemsPerPage: 10,
            isMounted: false,
            popupActivo2:false,
            operation_selectionne: '',
            devise: '',
            fnReject:'',
            fnValidate: '',
            formIsActiveted: false,
            updateDataView: false
        }
    },
    computed: {
        operationsData(){
          var data = []
          data = this.$store.state.association.operations
          let transactions = []
          if(data.length > 0){
            data.forEach(element => {
              if(element.operations.length > 0){
                element.operations.forEach(operation => {
                  if(operation.etat == "EN_ATTENTE" && operation.debit_credit == 'credit'){
                    transactions.push(
                      {
                        id: operation.id,
                        membre: element.membre,
                        membre_id: operation.membre_id,
                        date_versement: operation.date_realisation,
                        montant: operation.montant,
                        num_recu: operation.num_recu,
                        etat: operation.etat,
                        date_creation: operation.date_realisation,
                        mode: payment_mod.reduce((a, o) => o.value == operation.mode ? a.concat(this.$t(o.i18n)) : a, ''),
                        mod: operation.mode,
                        preuve: operation.preuve,
                        commentaire: operation.commentaire,
                        transactions: operation.transactions,
                      }
                    )
                  }
                })
              }
            });
          }
          return transactions
        },
        currentPage() {
            if(this.isMounted) {
                if(this.$refs.table != undefined)
                    return this.$refs.table.currentx
                else return 1
            }
            return 0
        },
        queriedItems() {
          return this.$refs.table ? this.$refs.table.queriedResults.length : this.operationsData.length
        },
    },
    methods: {
      /* Valider une operation */
      validitateOperation(){
        this.fnValidate()
        /* this.toggleDataSidebar() */
      },

      /* Rejeter une operation */
      rejectOperation(){
        this.fnReject()
        /* this.toggleDataSidebar() */
      },
      //Rediriger vers la page de validation
      redirectValidate(operation){
        this.$store.commit('association/SET_OPERATION', operation)
      },
      //Rejeter une operation
      reject(operation){
         let payload = {
          resourceUrl: '/api/membre/'+operation.membres_id+'/operation/' + operation.id + '/transaction/rejeter',
          commitAction: 'SET_REJECTED_OPERATIONS'
        }
        this.$store.dispatch("association/fetchFinances",payload)
        .then(()=> {
          this.popupActivo2 = false,
          this.$vs.notify({
            position:'top-center',
            text: this.$t('operationSuccessfullyRejected'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'success'
          })
          //Lister toutes les operations de l'association
          var current_association = this.$store.state.association.currentAssociation
          let payload = {
            resourceUrl: '/api/association/' + current_association.id + '/operations',
            commitAction: 'SET_OPERATIONS'
          }
          this.$store.dispatch("association/fetchFinances",payload)
        })
        .catch((error)=>{
          this.$vs.notify({
              position:'top-center',
              text: error,
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger'
          })
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
      showPreview(src){
        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var modalImg = document.getElementById("img01");

        modal.style.display = "flex";
        modalImg.src = src;

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }
      },
    },
    created(){

        EventBus.$emit('loader', true);

        var current_association = this.$store.state.association.currentAssociation

        // if(!moduleFinance.isRegistered) {
        //     this.$store.registerModule('finance', moduleFinance)
        //     moduleFinance.isRegistered = true
        // }

        let payload = {
          resourceUrl: '/api/association/' + current_association.id + '/operations',
          commitAction: 'SET_OPERATIONS'
        }

        this.$store.dispatch("association/fetchFinances",payload)
          .then(() => EventBus.$emit('loader', false))
          .catch(() => EventBus.$emit('loader', false))
        this.devise = current_association.devise
    },
    mounted() {
        this.isMounted = true;
    }
}
</script>
<style lang="scss">
    #operation-tab .vs-table {
      padding-left: 0 !important;
    }
</style>
