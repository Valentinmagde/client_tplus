<template>
  <div id="data-list-list-view" class="data-list-container">
    <div class="ml-4 mr-4">
        <vx-card no-shadow class="mb-6 pb-6" :title="$t('sanctionTitle')"/>
    </div>


   <data-view
      @closeSidebar="toggleDataSidebar"
      :isSidebarActive="addNewDataSidebar"
      :data="emptyData">
      <h4 slot="title">{{ $t('sanctionAdminButtonAdd')}}</h4>

       <template slot="component">

        <!-- Membre -->
        <p class="vs-input--label">{{$t('members')}}</p>
        <v-select
          label="text"
          :options="selectOptions"
          class= "w-full mb-5"
          v-model="compte"
        />

        <!-- Type de sanction -->
        <p class="vs-input--label">{{$t('sanctionType')}}</p>
        <v-select
          label="text"
          :options="selectSanctionOptions"
          class= "w-full mb-5"
          v-model="sanction"
          @input="changeMoney(sanction)"
        />
        <!-- Montant -->
        <p class="vs-input--label">{{$t('Amount')}}</p>
        <money
            v-model="input.montant"
            class="money-input w-full p-3 mb-5"
            :desabled="moneyisDesable"
            readOnly
           />

        <!-- Motif -->
        <p class="vs-input--label">{{$t('reason')}}</p>
        <vs-textarea
          v-model="comment"
          class="w-full" />

        <vs-checkbox v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
            {{$t('addAnother')}}
        </vs-checkbox>

        <div  class="w-full">
          <div v-if="isHidden" class="flex flex-row">
              <div class="activite">
                  <!-- Activite -->
                  <vs-input
                      label-placeholder="Motif"
                        v-model="input.motif"

                      class=""/>

                  </div>
                  <div class="activite">
                  <!-- MONTANT -->
                  <money
                      v-model="input.newMoney"
                      class="money-input"
                      :readonly="true"
                      />
                  <span class="cursor-pointer" >
                    <feather-icon @click="() => show = false" icon="CircleIcon" style="color:red;" svgClass="h-1" ></feather-icon>
                  </span>
              </div>
          </div>
        </div>

      </template>


        <vs-button class="mr-6" type="border" color="danger" @click="toggleDataSidebar">{{ $t('cancel')}}</vs-button>

       <vs-button id="button-with-loading-sav-sanction" :disabled="disable" @click.prevent="save" >{{ $t('create')}}</vs-button>

   </data-view>

     <!-- Popup pour supprimer une sanction -->
    <vs-popup classContent="popup-example" :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
      <p>{{$t('deleteConfirms')}}</p>
      <vs-divider/>
      <div class="vx-row w-full justify-end">
          <vs-button  color="warning" @click="popupActivo2=false" type="border">{{$t('cancel')}}</vs-button>&nbsp;&nbsp;
          <vs-button class="ml-3" color="danger" @click.stop="deleteItem(sanction_selectionne)">{{$t('delete')}}</vs-button>
      </div>
    </vs-popup>
    <div class="ml-4 mr-4">
      <div v-if="sanctions.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ADD NEW -->
          <div class="btn-add-new p-3 mb-4  rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click.stop="() => addNewDataSidebar = !addNewDataSidebar" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{ $t('Sanction')}}</span>
          </div>
      </div>
      <vx-card no-shadow v-if="sanctions.length == 0" class="mb-base">
          <p>{{$t('noElementFound')}}</p>
      </vx-card>
    </div>

    <vs-table v-if="sanctions.length > 0"
      :data="this.sanctions"
      pagination
      :max-items="itemsPerPage"
      search ref="table" class="mt-4">

      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between ml-0 rm">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ACTION - DROPDOWN -->

          <!-- ADD NEW -->
          <div class="btn-add-new p-3 mb-4  rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary" @click.stop="() => addNewDataSidebar = !addNewDataSidebar" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')" >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{ $t('Sanction')}}</span>
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
        <vs-th sort-key="members">{{$t('members') | CAPITALIZE }}</vs-th>
        <vs-th sort-key="sanctions">{{ $t('sanctionType') | CAPITALIZE }}</vs-th>
        <vs-th sort-key="amount">{{ $t('Amount') | CAPITALIZE }}</vs-th>
        <vs-th sort-key="motif">{{ $t('reason') | CAPITALIZE }}</vs-th>
        <vs-th sort-key="actions">{{ $t('actions') | CAPITALIZE }}</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr  :key="indextr" v-for="(tr, indextr) in data" >
          <vs-td :data="data[indextr].membre">
            {{data[indextr].membre}}
          </vs-td>

          <vs-td :data="data[indextr].type">
            {{data[indextr].type}}
          </vs-td>

          <vs-td :data="data[indextr].montant" :class="{redtextclass: data[indextr].montant < 0}">
            {{ (data[indextr].montant) | formatMoney(devise) }}
          </vs-td>

          <vs-td :data="data[indextr].commentaire">
            {{data[indextr].commentaire}}
          </vs-td>

          <vs-td>
              <!-- Suppression d'une saction -->
              <vx-tooltip :text="$t('delete')" position="bottom" class="inline-block" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')" >
                <feather-icon  icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click.stop="popupActivo2=true; sanction_selectionne=data[indextr].id"/>
              </vx-tooltip>
          </vs-td>
        </vs-tr>
      </template>

    </vs-table>

    <div class="flex flex-wrapper mt-6 ml-4">
        <vs-button type="border" class="mr-6" id="button-loading"
          @click.native="previous">{{$t('previous')}}</vs-button>

    </div>
  </div>
</template>

<script>

import helpers from '../../services/mixins/sidebar'
import { Money } from 'v-money'
import vSelect from 'vue-select'
import { EventBus } from  '@/services/EventBus.js'

import { getAllSactionsAg, createSanction, getTypeSanction, deleteSanction } from "../../services/api"

const fluck = (request) => request.data.data
const display = (error) => window.console.log(error)

const findByname = (params) => {
  const render = params.data.find( e => e.membres_id == params.id)
  return render
}

const hydrate = (data , user) => {

  return data.map(e => {
    const membre = findByname({data:user, name: e.id})

    return Object.assign({}, e,
    {montant: e.montant }, { name: membre.name}

    )}
  )}

export default {
	props: ['users','uuid','assId', 'roles'],
	mixins: [helpers],
  data: () => ({
    isHidden: false,
    moneyisDesable: true,

    itemsPerPage: 10,
    isMounted: false,

    montant: '',
    sanction:'',
    comment: '',
    compte: '',
    input: {
      motif: '',
      montant: '',
      newMoney: ''
    },
    sanctions: [],
    typeSanctions: [],
    popupActivo2:false,
    sanction_selectionne: null,
    checkbox_create_another: false,

    devise: ''
  }),
  filters: {
    comma :function(x) {
    return  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  computed: {
    selectOptions(){
        if(this.users != null)
            return this.users.map(user => ({id: user.id, text: user.name, value: user.id}))
    },

    selectSanctionOptions(){
      let sanctions = []
      if(this.typeSanctions != null){
          this.typeSanctions.forEach(sanction => {
            if(sanction.nom !='Retard' && sanction.nom !='Absence')
              sanctions.push({
                id: sanction.id,
                text: sanction.nom,
                value: sanction.id,
                montant: sanction.montant,
                motif: sanction.description
              })
            }
          )
      }
      return sanctions
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
    },

    disable(){
      return (this.compte && this.input.montant && this.comment) ? false : true
    }
  },
  components: {
    Money,
    vSelect
  },
  created(){
    //Loader
    EventBus.$emit('loader', true)

    getAllSactionsAg({agId:this.uuid})
      .then(e => {
        this.sanctions = hydrate(fluck(e), this.users)
        display(this.sanctions)

        //Loader
        EventBus.$emit('loader', false)
      })
      .catch(e => {
        //Loader
        EventBus.$emit('loader', false)
        display(e)
      })

    getTypeSanction({assId:this.assId})
      .then(e => this.typeSanctions = e.data.data)
      .catch(e => display(e))

    var current_association = this.$store.state.association.currentAssociation
    this.devise = current_association.devise
  },
  methods: {
    //Read only
    /* readOnly(){
        document.getElementById('money').readOnly = true;
    }, */
    previous(){
      this.$emit('selectedTab',1)
    },

    next(){
      this.$emit('selectedTab',4)
    },

    changeMoney(sanction){
      this.input.montant = sanction.montant
      this.comment = sanction.motif
    },
    reset(){
      this.input.motif = ""
      this.input.montant = ""
      this.isHidden= !this.isHidden
    },
    save(){
      /* this.startLoding('button-with-loading-sav-sanction') */
      createSanction({
        assId:this.assId,
        userId:this.compte.value,
        ags_id: this.uuid,
        montant: this.input.montant,
        commentaire: this.comment,
        type: this.sanction.text
      })
      .then(e => {
        /* this.stopLoding('button-with-loading-sav-sanction') */
        this.toggleDataSidebar()
        display(e.data.data)
        const render = this.users.find( m => m.id == e.data.data.membres_id)
        const newEntry  = {
          id: e.data.data.id,
          type: e.data.data.type,
          membre: render.name,
          montant: e.data.data.montant,
          commentaire: e.data.data.commentaire
        }
        this.sanctions = [ newEntry, ... this.sanctions]
        if(!this.checkbox_create_another)
          this.addNewDataSidebar = false

        this.compte = ''
        this.input.montant = 0
        this.sanction = ''
        this.comment = ''

        this.$vs.notify({
            position:'top-center',
            text: this.$t('notifContent'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'success'
        })

        this.input.motif = ""
        this.comment = ""
        display(e.data)
      })
      .catch(e => {
        display(e)
        //this.stopLoding('button-with-loading-sav-sanction')
      })
    },

    deleteItem(id){
      deleteSanction({
        assId:this.assId,
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
    addItem(){
      this.input.motif = ""
      this.input.montant = ""
      this.isHidden= !this.isHidden
    }
  },
  mounted() {
    this.isMounted = true;
  }

}
</script>
