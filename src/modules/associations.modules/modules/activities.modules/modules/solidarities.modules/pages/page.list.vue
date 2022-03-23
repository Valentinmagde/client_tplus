<template>
  <div id="data-list-list-view" class="data-list-container">

    <!-- Popup pour supprimer un membre -->
    <vs-popup classContent="popup-example"  :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
      <p>{{$t('deleteConfirm')}}</p>
      <vs-divider/>
      <div class="vx-row w-full justify-end">
          <vs-button
            color="warning"
            @click="popupActivo2=false"
            type="border">
            {{$t('cancel')}}
          </vs-button>&nbsp;&nbsp;

          <vs-button
            class="ml-3 vs-con-loading__container"
            color="danger" ref="loadableButton"
            id="button-with-loading" :disabled="!loader"
            @click.stop="deleteItem(activite_selectionne)">
            {{$t('delete')}}
          </vs-button>
      </div>
    </vs-popup>

    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <!-- <vx-card class="mb-5">
            <h4  class="mb-2"> {{ $t('listofgenericactivities') | CAPITALIZE }} </h4>
        </vx-card> -->
        <vx-card v-if="activitesData.length == 0">
          <p>{{$t('noElementFound')}}</p>
        </vx-card>
      </div>
      <!-- Tableau des activites -->
      <vs-table
        v-show="activitesData.length > 0"
        ref="table"
        :data="activitesData"
        pagination
        :max-items="itemsPerPage"
        search>
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
           <!--  <div class="flex flex-wrap-reverse items-center data-list-btn-container"> -->
              <!-- ADD NEW -->
              <!-- <div v-if="admin" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                @click="redirectCreation">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                  <span class="ml-2 text-base text-primary">{{$t('AddNew')}}</span>
              </div>
            </div> -->
          <!-- ITEMS PER PAGE -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ activitesData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : activitesData.length }} of {{ queriedItems }}</span>
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
          <vs-th>{{ $t('name') | CAPITALIZE }}</vs-th>
          <vs-th>{{ $t('description') | CAPITALIZE }}</vs-th>
          <vs-th>{{ $t('penaltyForFailure') | CAPITALIZE }} </vs-th>
          <vs-th>{{ $t('state') | CAPITALIZE }} </vs-th>
          <vs-th>{{ $t('actions') | CAPITALIZE }} </vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :key="ind" v-for="(tr, ind) in data"
            @click.native="redirectDetails(tr)" class="cursor-pointer">
            <vs-td >
              <p class="product-name font-medium truncate">
                {{ tr.nom }}
              </p>
            </vs-td>

            <vs-td>
              <p class="product-name">
                {{ tr.description }}
              </p>
            </vs-td>

            <vs-td >
              <p v-if="tr.type_penalite == 'POURCENTAGE'
                  && tr.taux_penalite != null" class="product-name">
                  {{ tr.taux_penalite + '%'}}
                </p>
                <p v-if="tr.type_penalite == 'FORFAITAIRE'
                    && tr.taux_penalite != null" class="product-name">
                  <span :class="{redtextclass: tr.taux_penalite < 0}">
                    {{ (tr.taux_penalite) | formatMoney(devise) }}
                  </span>
                </p>
            </vs-td>
            <vs-td>
              <p v-if="tr.etat=='init'"  class="product-price">
                <vs-chip>{{$t('creation')}}</vs-chip>
              </p>
              <p v-if="tr.etat=='actif'"  class="product-price">
                <vs-chip color="success">{{$t('activate')}}</vs-chip>
              </p>
              <p v-if="tr.etat=='inactif'"  class="product-price">
                <vs-chip color="danger">{{$t('desactivate')}}</vs-chip>
              </p>
              <p v-if="tr.etat == 'cloture'" class="product-price">
                  <vs-chip color="dark">{{$t('cloturer')}}</vs-chip>
              </p>
            </vs-td>
            <vs-td >
              <!--<vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block ">
                <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"  @click="redirectDetails(tr)"/>
              </vx-tooltip>-->
              <vx-tooltip v-if="admin" :text="$t('delete')" position="bottom" class="inline-block ml-2">
                  <feather-icon  icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    @click.stop="popupActivo2=true; activite_selectionne=tr.id"/>
                </vx-tooltip>
            </vs-td>
          </vs-tr>

        </template>

      </vs-table>
    </div>
  </div>
</template>

<script>
//Fonctions
import redirections from '../../../services/redirections'
import { EventBus } from  '@/services/EventBus.js'
import checkIfAdmin from '../../../../../mixins/checkRole'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

export default {
  mixins: [checkIfAdmin],
  props : ['selectactivitie'],
  data() {
    return {
      member: {},
      members: [],
      active:false,
      addNewDataSidebar: false,
      sidebarData: {},
      etat: '',
      generic_selectionne: '',
      generic: {},
      popupActivo2:false,
      activite_selectionne: '',
      itemsPerPage: 10,
      isMounted: false,
      devise: '',

      /* Loading */
      backgroundLoading:'danger',
      colorLoading:'#fff',
      loader: true
    }
  },
  computed:{
    admin() {
      return this.isSuperAdministrator;
    },
    activitesData(){
      return this.$store.state.association.solidarites
    },
    currentPage() {
      if(this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.activitesData.length
    }
  },
  methods: {
    //Redirige vers la page de creation d'une tontine
    redirectCreation(){
      this.$store.commit('association/SET_ACTIVITE', '');
      return redirections.redirectSolidarity()
    },

    deleteItem(id) {
      this.openLoadingContained()
      var association_courante = this.$store.state.association.currentAssociation

      let payload = {
        resourceUrl: '/api/association/' + association_courante.id + '/activite/'+ id,
        commitAction: 'REMOVE_ACTIVITE',
        memberId: id
      }

      this.$store.dispatch("association/removeRecord", payload)
      .then(() => {
        this.loader = true
        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
        this.popupActivo2 = false
        this.$vs.notify({
              position:'top-center',

              text: this.$t('activityDeleteSuccessfully'),
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success'
        })
        let payload = {
          resourceUrl: '/api/association/'+association_courante.id + '/activite/type/Solidarite',
          commitAction: 'SET_SOLIDARITES'
        }
        this.$store.dispatch("association/fetchAssociationactivite",payload)
        .then(()=>{
          let payload = {
              resourceUrl:"api/association/"+association_courante.id+"/activite",
              commitAction: 'SET_ACTIVITES',
          }

          this.$store.dispatch("association/fetchAssociationactivite", payload)
          .catch((error)=>{window.console.error(error)})
        })
        .catch(err => { window.console.error(err) })
      })
      .catch(err => {
        this.loader = true
        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
        window.console.error(err)
      })
    },
    redirectDetails(tr){
      localStorage.setItem('activity_id', JSON.stringify(tr.id))

      this.$store.commit('association/SET_ACTIVITE', tr);

      if(this.admin)
        this.$router.push('/association/administration/activities/solidarity/details').catch(() => {})
      else
        this.$router.push('/association/my-activities/solidarity/details').catch(() => {})
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
   created(){
     EventBus.$emit('loader', true)

      var current_association = this.$store.state.association.currentAssociation

      let payload = {
        resourceUrl: '/api/association/'+current_association.id + '/activite/type/Solidarite',
        commitAction: 'SET_SOLIDARITES'
      }
      this.$store.dispatch("association/fetchAssociationactivite",payload)
      .then(()=>{
        EventBus.$emit('loader', false)
      })
      .catch((error)=> {
        EventBus.$emit('loader', false)
        window.console.error(error);
      })

      //Devise de l'association
      this.devise = current_association.devise
  },
  mounted() {
    this.isMounted = true;
  }
}
</script>


