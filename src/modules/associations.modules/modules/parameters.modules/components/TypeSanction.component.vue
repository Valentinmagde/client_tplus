<template>
  <div id="data-list-list-view" class="data-list-container">
    <div class="ml-4 mr-4">
      <vx-card no-shadow class="mb-6 pb-6" :title="$t('sanctionType')"/>
    </div>
    <!-- Popup pour supprimer un type sanction -->
    <vs-popup classContent="popup-example"  :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
      <p>{{$t('deleteConfirm')}}</p>
      <vs-divider/>
      <div class="vx-row w-full justify-end">
          <vs-button  color="warning" @click="popupActivo2=false" type="border">{{$t('cancel')}}</vs-button>&nbsp;&nbsp;
          <vs-button class="ml-3" color="danger" @click.stop="deleteItem(type_selectionne)">{{$t('delete')}}</vs-button>
      </div>
    </vs-popup>

   <data-view
      @closeSidebar="toggleDataSidebar"
      :isSidebarActive="addNewDataSidebar"
      :data="emptyData">
      <h4 slot="title" v-if="!process">{{$t('sanctionAdminButton')}}</h4>
      <h4 slot="title" v-if="process">{{$t('modifyASanctionType')}}</h4>

       <template slot="component">
        <!-- Titre -->
        <vs-input
          class= "w-full"
          color="primary"
          :label="$t('title')+ ' '+'*'"
          v-model="name"
        />

        <!-- Montant -->
        <p class="vs-input--label mt-5">{{$t('Amount')+ ' '+'*'}}</p>
        <money
            v-model="montant"
            class="money-input w-full p-3"
            v-bind="money"
             />

        <!-- Description -->
        <p class="vs-input--label mt-5">{{$t('description')+ ' '+'*'}}</p>
        <vs-textarea
            v-model="descript"
            class="w-full"
        />

        <vs-checkbox v-if="!process" v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
            {{$t('addAnother')}}
        </vs-checkbox>
      </template>


      <vs-button class="mr-6" type="border" color="danger" @click="toggleDataSidebar">{{$t('cancel')}}</vs-button>

      <vs-button id="button-loading" v-if="!updateItem" :disabled="disabled" @click.prevent="save" >{{$t('create')}}</vs-button>
      <vs-button id="button-loading" v-if="updateItem" :disabled="disabled" @click.prevent="save" >{{$t('update')}}</vs-button>

   </data-view>

   <div class="ml-4 mr-4">
      <div v-if="sanctions.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ADD NEW -->
          <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary  border border-solid border-primary"
            @click="addNewDataSidebar =!addNewDataSidebar; reset()"
              >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{$t('sanctionAdminButton')}}</span>
          </div>
      </div>
      <vx-card v-if="!sanctions.length" class="mb-base">
          <p>{{$t('noElementFound')}}</p>
      </vx-card>
    </div>

    <vs-table v-if="sanctions.length" :data="this.sanctions" pagination :max-items="itemsPerPage" class="mt-5" search ref="table">

      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <div class="flex flex-wrap-reverse items-center data-list-btn-container">

            <!-- ACTION - DROPDOWN -->
            <!-- ADD NEW -->
            <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
              @click="addNewDataSidebar = !addNewDataSidebar; reset()" >
                <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                <span class="ml-2 text-base text-primary">{{$t('sanctionAdminButton')}}</span>
            </div>
          </div>

          <!-- ITEMS PER PAGE -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ sanctions.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : sanctions.length }} of {{ queriedItems }}</span>
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
        <vs-th>
          {{$t('title')}}
        </vs-th>
        <vs-th>
          {{$t('sanctionAdminTabAmount')}}
        </vs-th>
        <vs-th>
          {{$t('description')}}
        </vs-th>

        <vs-th>
          {{$t('Actions')}}
        </vs-th>

      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="data[indextr].nom">
            <strong>{{data[indextr].nom}}</strong>
          </vs-td>

          <vs-td :data="data[indextr].montant">
            {{data[indextr].montant | comma }}
          </vs-td>

          <vs-td :data="data[indextr]">
            {{data[indextr].description }}
          </vs-td>
          <vs-td class="whitespace-no-wrap" :data="data[indextr]">
              <!-- Mettre à jour un membre -->
              <vx-tooltip :text="$t('update')" position="bottom"  class="inline-block">
                <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                class="mr-2"
                @click="update(data[indextr]); process=true"/>
              </vx-tooltip>

              <!-- Supprimer un type sanction -->
              <vx-tooltip :text="$t('delete')" position="bottom" class="inline-block">
                <feather-icon
                  icon="TrashIcon"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  class="mr-2"
                  @click.stop="popupActivo2=true;
                  type_selectionne=tr.id;"
                  />
              </vx-tooltip>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>

// import helpers from '../seance/SeanceComponents/mixins/dataSide'
import DataView from '../../../components/sidebar/DataViewSidebar.component'
import { EventBus } from '@/services/EventBus.js'
import { Money } from 'v-money'


import { getTypeSanction, createTypeSanction, updateTypeSanction, deleteSanctionType } from "../services/api"


// import datas from "../seance/SeanceComponents/mixins/data"


const fluck = (request) => request.data.data

const display = (error) => window.console.log(error)


export default {

	// mixins: [helpers, datas],
  data: () => ({
    show: false,
    montant: '',
    comment: '',

    itemsPerPage: 10,
    isMounted: false,

    updateItem: false,
    process: false,
    descript:'',
    name: '',
    input: {
      motif: '',
      montant: ''
    },
    money: {
      decimal: ',',
      thousands: '.',
      precision: 2,
      masked: false /* doesn't work with directive */
    },
    checkbox_create_another: false,
    popupActivo2: false,
    type_selectionne: '',

    sanctions: [],
    users: [],
    sancId: null,

    addNewDataSidebar: false,
		emptyData: {}
  }),
  components: {
    Money,
    DataView,
  },
  computed: {
    disabled(){
      return (this.montant && this.name && this.descript) ? false : true
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
        return this.$refs.table ? this.$refs.table.queriedResults.length : this.sanctions.length
    }
  },
  filters: {
    comma :function(x) {
    return  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  methods: {
    toggleDataSidebar() {
      this.addNewDataSidebar = !this.addNewDataSidebar
    },
    reset(){
      this.name = ''
      this.montant = ''
      this.descript = ''
    },

    deleteItem(id){
      deleteSanctionType({
        assId: this.$store.state.association.currentAssociation.id,
        sancId:id
      })
      .then(()=>{
        this.popupActivo2=false
        this.sanctions = this.sanctions.filter(a => a.id != id)
        this.$vs.notify({
            position:'top-center',
            text: this.$t('notifContent'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'success'
        })
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
    update(val){
      this.updateItem = true
      this.sancId = val.id
      this.name = val.nom
      this.montant = val.montant
      this.descript = val.description
      this.addNewDataSidebar = true
    },
    save(){
      if (!this.updateItem )
      {
        createTypeSanction({
          assId: this.$store.state.association.currentAssociation.id,
          name: this.name ,
          montant: this.montant,
          descript: this.descript,
        })
        .then(e => {
          display(e)
          this.process = false
          this.sanctions = [ {id:e.data.data.id, nom:this.name, montant:this.montant, description:this.descript}, ...this.sanctions]
          this.reset()

          this.$vs.notify({
              position:'top-center',
              text: this.$t('notifContent'),
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success'
          })

          if(!this.checkbox_create_another)
            this.addNewDataSidebar = false
        })
        .catch(e => display(e))
      }
      else {
        updateTypeSanction({
          assId: this.$store.state.association.currentAssociation.id,
          sancId: this.sancId,
          name: this.name ,
          montant: this.montant,
          descript: this.descript,
        })
        .then(() => {
          this.process = false
          this.reset()

          this.$vs.notify({
              position:'top-center',
              text: this.$t('notifContent'),
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success'
          })

          if(!this.checkbox_create_another)
            this.addNewDataSidebar = false

          getTypeSanction({assId: this.$store.state.association.currentAssociation.id})
          .then(e => {
            this.sanctions = e.data.data

          })
          .catch(e => display(e))
        })
        .catch(e => display(e))
      }

      this.updateItem = false
    },
  },
  created(){
    EventBus.$emit('loader', true)
    getTypeSanction({assId: this.$store.state.association.currentAssociation.id})
      .then(e => {
        this.sanctions = fluck(e)
        EventBus.$emit('loader', false)
      })
      .catch(e => display(e))
  },
  mounted(){
    this.isMounted = true
  }

}
</script>
