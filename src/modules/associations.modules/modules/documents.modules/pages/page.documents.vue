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

    <!-- ACTION - DROPDOWN -->
    <vs-dropdown vs-trigger-click v-if="admin"
      class="ml-auto md:block cursor-pointer fixed z-50" style="right:35px">
      <vs-button  icon="icon-settings" icon-pack="feather">{{$t('actions')}}</vs-button>

      <vs-dropdown-menu class="w-64">
        <vs-dropdown-item >
          <div @click.stop="addNewData('AjoutDocument')" class="flex items-center">
            <feather-icon icon="PlusIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
            <span>{{$t('addDocument')}}</span>
          </div>
        </vs-dropdown-item>
      </vs-dropdown-menu>

    </vs-dropdown>
    <Data-view-sidebar :isSidebarActive="addNewDataSidebar" @closeSidebar="toggleDataSidebar" :data="sidebarData" :etat="etat"/>

    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <div v-if="documentsData.length == 0 && admin" class="flex flex-wrap-reverse items-center data-list-btn-container">
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click.stop="addNewData('AjoutDocument')">
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{$t('newDocument')}}</span>
          </div>
        </div>
        <vx-card v-if="documentsData.length == 0">
          <p>{{$t('noElementFound')}}</p>
        </vx-card>
      </div>
      <vs-table v-show="documentsData.length > 0" ref="table" v-model="selected" pagination :max-items="itemsPerPage" search :data="documentsData">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
             <!-- ADD NEW -->
              <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                @click="addNewData('AjoutDocument')" v-if="admin">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                  <span class="ml-2 text-base text-primary">{{$t('newDocument')}}</span>
              </div>
            <!-- ITEMS PER PAGE -->
            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
              <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ documentsData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : documentsData.length }} of {{ queriedItems }}</span>
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
          <vs-th sort-key="firstName">{{$t('Type') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="firstName">{{$t('name') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="date_created">{{$t('date') | CAPITALIZE }}</vs-th>
          <vs-th sort-key="firstName">{{$t('description') | CAPITALIZE }}</vs-th>
          <vs-th>{{$t('actions') | CAPITALIZE }}</vs-th>
        </template>

          <template slot-scope="{data}">
            <tbody>
              <vs-tr :data="document" :key="ind" v-for="(document, ind) in data">
                <vs-td>
                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] == 'csv' ||
                    document.path.split('.')[document.path.split('.').length-1] == 'xls' ||
                    document.path.split('.')[document.path.split('.').length-1] == 'ods'"
                    name="office-file-xls-1" :size="25"/>

                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] == 'docx' ||
                    document.path.split('.')[document.path.split('.').length-1] == 'odt'"
                    name="office-file-doc-1" :size="25"/>

                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] == 'pdf'"
                    name="office-file-pdf-1" :size="25"/>

                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] == 'png'"
                    name="image-file-png" :size="25"/>

                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] == 'gif'"
                    name="image-file-gif" :size="25"/>

                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] == 'jpg' ||
                    document.path.split('.')[document.path.split('.').length-1] == 'jpeg'"
                    name="image-file-jpg" :size="25"/>

                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] == 'zip' ||
                    document.path.split('.')[document.path.split('.').length-1] == 'rar'"
                    name="file-zip" :size="25"/>

                  <icon v-if="document.path.split('.')[document.path.split('.').length-1] !== 'csv' && document.path.split('.')[document.path.split('.').length-1] !== 'xls'
                      && document.path.split('.')[document.path.split('.').length-1] !== 'docx' && document.path.split('.')[document.path.split('.').length-1] !== 'pdf'
                      && document.path.split('.')[document.path.split('.').length-1] !== 'png' && document.path.split('.')[document.path.split('.').length-1] !== 'gif'
                      && document.path.split('.')[document.path.split('.').length-1] !== 'jpg' && document.path.split('.')[document.path.split('.').length-1] !== 'jpeg'
                      && document.path.split('.')[document.path.split('.').length-1] !== 'zip' && document.path.split('.')[document.path.split('.').length-1] !== 'rar'
                      && document.path.split('.')[document.path.split('.').length-1] !== 'odt' && document.path.split('.')[document.path.split('.').length-1] !== 'ods'"
                    name="common-file-empty" :size="25"/>
                </vs-td>

                <vs-td>
                  <p class="product-name font-medium truncate">{{document.intitule}}</p>
                </vs-td>

                <vs-td>
                  <p class="product-category">{{ new Date(document.create_at*1000).toDateString()}}</p>
                </vs-td>

                <vs-td>
                  {{document.description}}
                </vs-td>
                <vs-td class="whitespace-no-wrap">
                    <!-- Telecharger un document -->
                    <vx-tooltip :text="$t('download')" position="bottom"  class="inline-block">
                      <vs-icon icon-pack="streameline"
                        @click="download(document.id, document.path.split('.')[document.path.split('.').length-1], document.intitule)"
                        icon="icon-harddrive-download" style="font-size: 18px"
                        class="hover:text-primary" size="small">
                      </vs-icon>
                    </vx-tooltip>

                    <!-- Supprimer un document -->
                    <vx-tooltip :text="$t('delete')" position="bottom" class="inline-block">
                      <feather-icon  v-if="admin" icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"
                        @click.stop="popupActivo2=true; membre_selectionne=document.id"/>
                    </vx-tooltip>
                </vs-td>
              </vs-tr>
            </tbody>
          </template>
      </vs-table>
    </div>

     <!-- Popup pour supprimer un membre -->
    <vs-popup classContent="popup-example"  :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
      <p>{{$t('deleteConfirm')}}</p>
      <vs-divider/>
      <div class="vx-row w-full justify-end">
          <vs-button  color="warning" @click="popupActivo2=false" type="border">{{$t('cancel')}}</vs-button>&nbsp;&nbsp;
          <vs-button  class="ml-3" color="danger" @click.stop="deleteItem(membre_selectionne)">{{$t('delete')}}</vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import DataViewSidebar from '../../../components/sidebar/DataViewSidebar.component'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

// Functions
import { EventBus } from  '@/services/EventBus.js'

import {mapGetters} from 'vuex'

import checkIfAdmin from '../../../mixins/checkRole'
// Store Module
// import moduleDocument from "@/store/document/moduleDocument.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"

export default {

  mixins: [checkIfAdmin],

  components: {
    DataViewSidebar,
    VuePerfectScrollbar,
  },

  data() {
    return {
      selected: [],
      // usersData: [],
      itemsPerPage: 10,
      isMounted: false,
      documents: [],

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: '',
      // member: JSON.parse(localStorage.getItem('user')),

      playerOptions: {},
      settings: { // perfectscrollbar settings
          maxScrollbarLength: 60,
          wheelSpeed: .60,
      },

      popupActivo2 : false,
      membre_selectionne: '',
      showSection: false, // Flag to show section
      post: [
        {
          commentbox: ''
        }
      ],
    }
  },
  computed: {
    ...mapGetters({
      member: 'authentificated/getAuth',
      association_courante: 'association/getCurrentAssociation'
    }),
    admin() {
      return this.isSuperAdministrator;
    },
    documentsData() {
      return this.$store.state.association.documents
    },
    currentPage() {
      if(this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    },
    queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.documentsData.length
    }
  },
  methods: {
    download(id, extension, intitule){
      var association_courante = this.association_courante;

      let payload = {
        resourceUrl: '/api/association/' + association_courante.id + '/document/'+ id+"/download",
        commitAction: 'SET_DOCUMENT',
      }

      this.$store.dispatch("association/fetchAssociationDocumentById", payload)
        .then((res) => {
          var fileUrl = window.URL.createObjectURL(new Blob([res.data]))
          var fileLink = document.createElement('a')

          fileLink.href = fileUrl
          fileLink.setAttribute('download', intitule+'.'+extension)
          document.body.appendChild(fileLink)

          fileLink.click()
          /* this.$vs.notify({
              position:'top-center',
              title: 'success',
              text: "The New was deleted successfully.",
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success'
          }) */
        })
        .catch(err => { window.console.error(err) })
    },
    addNewData(data) {
      this.etat = data
      this.sidebarData = {}
      this.toggleDataSidebar(true)
    },
    toggleDataSidebar(val=false) {
      this.addNewDataSidebar = val
    },
    deleteItem(id) {
      var association_courante = this.association_courante;

      let payload = {
        resourceUrl: '/api/association/' + association_courante.id + '/document/'+ id,
        commitAction: 'REMOVE_DOCUMENT',
        memberId: id
      }
      this.popupActivo2 = false
      this.$store.dispatch("association/removeRecord", payload)
        .then(() => {
           this.$vs.notify({
                position:'top-center',
                title: 'success',
                text: this.$t('documentSuccessfullyDeleted'),
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'success'
           })
          let payload = {
            resourceUrl: '/api/association/' + association_courante.id + '/document',
            commitAction: 'SET_DOCUMENTS'
          }

          this.$store.dispatch("association/fetchAssociationDocuments",payload)
        })
        .catch(err => { window.console.error(err) })
    },
  },
  created() {
    EventBus.$emit('loader', true)
    /*if(!moduleDocument.isRegistered) {
        this.$store.registerModule('document', moduleDocument)
        moduleDocument.isRegistered = true
    }
    if(!moduleUserManagement.isRegistered) {
      this.$store.registerModule('userManagement', moduleUserManagement)
      moduleUserManagement.isRegistered = true
    }
    if(!moduleAssociation.isRegistered) {
      this.$store.registerModule('association', moduleAssociation)
      moduleAssociation.isRegistered = true
    }*/
    var current_association= this.association_courante;

    let payload = {
      resourceUrl: '/api/association/' + current_association.id + '/document',
      commitAction: 'SET_DOCUMENTS'
    }
    this.$store.dispatch("association/fetchAssociationDocuments",payload)
    .then(()=>{
      EventBus.$emit('loader', false)
    })
    .catch(err => {
      EventBus.$emit('loader', false)
      window.console.error(err)
    })
  },
  mounted() {
    this.isMounted = true;
  }
}
</script>
<style lang="scss">
  .file-type {
    width: 30px;
    height: 35px;
  }
</style>


