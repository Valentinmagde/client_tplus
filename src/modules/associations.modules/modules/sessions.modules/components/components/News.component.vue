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
       <div class="ml-4 mr-4">
            <vx-card no-shadow class="mb-6 pb-6" :title="$t('newsOfMembersAndFamilies')"/>
        </div>
        <Data-view-sidebar
            :isSidebarActive="addNewDataSidebar"
            @closeSidebar="toggleDataSidebar"
            :data="sidebarData"
            :etat="etat"
        />

        <!-- Pop up pour la suppression d'une nouvelle -->
        <vs-popup classContent="popup-example"  :title="$t('deleteConfirmTitle')"
          :active.sync="popupActivo2">
          <p>{{$t('deleteConfirm')}}</p>
          <vs-divider/>
          <div class="vx-row w-full justify-end">
              <vs-button  color="warning"
                @click="popupActivo2=false" type="border">
                {{ $t('cancel') }}
              </vs-button>&nbsp;&nbsp;

              <vs-button class="ml-3" color="danger"
                @click.stop="deleteItem(nouvelle_selectionnee)">
                  {{$t('delete')}}
                </vs-button>
          </div>
        </vs-popup>
        <div class="ml-4 mr-4">
          <div v-if="NewsData.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
              <!-- ADD NEW -->
              <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                  @click.stop="addNewData('AjoutNouvelle')">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                  <span class="ml-2 text-base text-primary">{{$t('new')}}</span>
              </div>
          </div>
          <vx-card v-if="NewsData.length == 0" class="mb-base">
              <p>{{$t('noNewsAnnounced')}}</p>
          </vx-card>
        </div>

        <vs-table v-if="NewsData.length > 0"  ref="table" pagination search
          :data="NewsData"
          :max-items="itemsPerPage"
          class="table mt-4 w-full">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                    <!-- ADD NEW -->
                    <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                        @click.stop="addNewData('AjoutNouvelle')" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')" >
                        <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                        <span class="ml-2 text-base text-primary">{{$t('new')}}</span>
                    </div>
                </div>
                <!-- ITEMS PER PAGE -->
                <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                    <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                    <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ NewsData.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : NewsData.length }} of {{ queriedItems }}</span>
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
                <vs-th sort-key="firstName">{{$t('members') | CAPITALIZE }}</vs-th>
                <vs-th sort-key="title">{{$t('title') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="category"> {{$t('category') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="date_created"> {{$t('eventDate') | CAPITALIZE }} </vs-th>
                <vs-th sort-key="actions"> {{$t('actions') | CAPITALIZE }} </vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr v-for="nouvelle in data" :key="nouvelle.id">
                    <vs-td>
                        <p class="product-name font-medium truncate">
                          {{nouvelle.author.firstName}}
                        </p>
                    </vs-td>
                    <vs-td>
                        <p class="product-name truncate">
                          {{nouvelle.titre}}
                        </p>
                    </vs-td>
                    <vs-td>
                        <p class="product-name truncate">
                          {{afficheCategorie(nouvelle.categorie)}}
                        </p>
                    </vs-td>
                    <vs-td>
                        <p class="product-name truncate">
                          {{ (nouvelle.date_nouvelle) | dateTime }}
                        </p>
                    </vs-td>
                    <vs-td>
                        <!-- Detail -->
                        <vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block mr-2">
                          <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                          @click.stop="sendData('DetailNouvelle', nouvelle)"/>
                        </vx-tooltip>

                        <!-- Mise à jour -->
                        <vx-tooltip :text="$t('update')" position="bottom"  class="inline-block" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')" >
                          <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                          class="mr-2" @click.stop="updateNew('ModifierNouvelle', nouvelle)" />
                        </vx-tooltip>

                        <!-- Suppression d'une nouvelle -->
                        <vx-tooltip :text="$t('delete')" position="bottom" class="inline-block" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')" >
                          <feather-icon  icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current"
                          @click.stop="popupActivo2=true; nouvelle_selectionnee=nouvelle.id"/>
                        </vx-tooltip>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <div class="flex flex-wrapper mt-6 ml-4">
            <vs-button type="border" class="mr-6" id="button-loading"
              @click.native="previous">{{$t('previous')}}</vs-button>
            <vs-button @click.native="next">{{$t('next')}}</vs-button>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import DataViewSidebar from '../../../../components/sidebar/DataViewSidebar.component'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import infiniteScroll from 'vue-infinite-scroll'
import { EventBus } from  '@/services/EventBus.js'

import {categorie} from '../../../../services/data/news-categories'

// Store Module
// import moduleNouvelle from "@/store/nouvelle/moduleNouvelle.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"

Vue.use(infiniteScroll)
export default {
  props: ['roles'],
  components: {
    DataViewSidebar,
    VuePerfectScrollbar,
    // VxTimeline
  },
  data() {
    return {
      itemsPerPage: 10,
      isMounted: false,

      news: [],
      limit: 5,
      page: 1,
      nb_page: 1,
      busy: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: '',
      member: this.$store.state.authentificated.user,

      playerOptions: {},
      settings: { // perfectscrollbar settings
          maxScrollbarLength: 60,
          wheelSpeed: .60,
      },

      popupActivo2 : false,
      showSection: false, // Flag to show section
      post: [
        {
          commentbox: ''
        }
      ],
      id_membre : '',
      nouvelle_selectionnee: '',
      user : this.$store.state.authentificated.user,
      association_courante: this.$store.state.association.currentAssociation,
    }
  },
  computed: {
    NewsData(){
      let news = this.$store.state.association.news

      if(news.nouvelles)
          return news.nouvelles
      else
        return []
    },
    membreData(){
        return this.$store.state.association.members
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
        return this.$refs.table ? this.$refs.table.queriedResults.length : this.NewsData.length
    }
  },
  methods: {
    afficheCategorie(valeur){
        return categorie.reduce((a, o) => o.value == valeur ? this.$t(a.concat(o.i18n)) : a, '')
    },

    previous(){
      this.$emit('selectedTab',0)
    },

    next(){
      this.$emit('selectedTab',2)
    },
    //Infinite scroll
    loadMore() {
      var association_courante = this.$store.state.association.currentAssociation

      if(this.page <= this.nb_page) {
        let payload = {
              resourceUrl: '/api/association/' + association_courante.id + '/nouvelle/'+this.page,
              commitAction: 'SET_NEWS',
            }

            this.$store.dispatch("association/fetchNews",payload)
            .then((response) => {
              this.nb_page = Math.ceil(response.data.data.pages.nombre_total_page)
              /* var news_data = this.$store.state.nouvelle.nouvelles

              if(news_data.nouvelles != undefined) {
                news_data.nouvelles.forEach(nouvelle=>{
                  this.news.push(nouvelle)
                })
              } */

              this.page += 1
        })
        .catch(err => {
          window.console.error(err)
        })
      }
    },
    nouvelles(){
        var news_data = this.$store.state.association.nouvelles

        if(news_data.nouvelles != undefined) {
          news_data.nouvelles.forEach(nouvelle=>{
            if(this.news.some(nouv=> nouv.id === nouvelle.id)){
              const ItemIndex = this.news.findIndex((nouv) => nouv.id == nouvelle.id)
              this.news.splice(ItemIndex, 1)
            }

            this.news.push(nouvelle)
          })
        }
        let myArray = []

        if(this.news.length > 0){
          this.news.forEach(element => {
            myArray.push(element)
          })

          myArray.sort(function compare(a, b) {
            var dateA = new Date(a.date_nouvelle*1000);
            var dateB = new Date(b.date_nouvelle*1000);
            return dateA - dateB;
          })
        }
        return myArray
    },
    /*
      *@param members
      *@return id  //retourne l'id membre de l'utilisateur connecté
    */
    extractMember(members){
        var user = this.$store.state.authentificated.user
        var id

        members.forEach(member => {
            member.users.forEach(author => {
                if(user.id == author.id) {
                  id = member.id
                }
            })
        })
        return id
    },
    toggle(id) {
      let shadesEl = document.getElementById(id+'1')
      // Tedious toggle
      if (shadesEl.classList.contains('hidden')) {
        shadesEl.classList.remove('hidden');
      } else {
        shadesEl.classList.add('hidden');
      }
    },
    addNewData(etat) {
      this.etat = etat
      this.sidebarData = {}
      this.toggleDataSidebar(true)
    },

    updateNew(etat,data){
      this.etat = etat
      this.sidebarData = data
      this.toggleDataSidebar(true)
    },

    sendData(etat,data){
      this.etat = etat
      this.sidebarData = data
      this.toggleDataSidebar(true)
    },

    toggleDataSidebar(val=false) {
      this.addNewDataSidebar = val
    },

    //Liker ou disliker une nouvelle
    likeOrDislike(nouvId,action) {
      var membreId = this.extractMember(this.membreData)

      this.actions(nouvId, action, membreId)
    },
    //Poster un commentaire
    postComment(id,action){
      var user = this.$store.state.authentificated.user;
      let inputData = document.getElementById(id).value
      document.getElementById(id).value = ''

      var data = {
            user_id : user.id,
            commentaire : inputData
          }

      this.actionsComment(id,action, data)

    },
    //Commenter une nouvelle
    actionsComment(id, action, data){
        var association = this.$store.state.association.currentAssociation

      let payload = {
        resourceUrl: "/api/association/"+association.id+"/nouvelle/"+id+"/"+action,
        commitAction: 'SET_NEW',
        data: data
      }

      //Données pour recuperer la liste des nouvelles
      let nouvellePayload = {
          resourceUrl: "/api/association/"+association.id+"/nouvelle",
          commitAction: 'SET_NEWS'
      }

      this.$store.dispatch("association/postRequest", payload)
      .then(() => {
          this.$store.dispatch("association/fetchNews", nouvellePayload).catch(err => { window.console.error(err) })
        })
        .catch(error => {
          this.uploading = false;
          this.fileList = [];
          this.$vs.notify({
            position:'top-center',
            text: error,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        })
    },

    //Liker ou disliker une nouvelle
    actions(nouvId, action, membreId){
      var association = this.$store.state.association.currentAssociation

      let payload = {
        resourceUrl: "/api/association/"+association.id+"/nouvelle/"+nouvId+"/membre/"+membreId+"/"+action,
        commitAction: 'SET_NEW',
      }

      //Données pour recuperer la liste des nouvelles
      let nouvellePayload = {
          resourceUrl: "/api/association/"+association.id+"/nouvelle",
          commitAction: 'SET_NEWS'
      }
      this.$store.dispatch("nouvelle/fetchNews", payload)
      .then(() => {
          this.$store.dispatch("nouvelle/fetchNews", nouvellePayload).catch(err => { window.console.error(err) })
        })
        .catch(error => {
          this.uploading = false;
          this.fileList = [];
          this.$vs.notify({
            position:'top-center',
            text: error,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })
        })
    },
    deleteItem(id) {
      var association_courante = this.$store.state.association.currentAssociation

      let payload = {
        resourceUrl: '/api/association/' + association_courante.id + '/nouvelle/'+ id,
        commitAction: 'REMOVE_NEW',
        memberId: id
      }
      this.popupActivo2 = false
      this.$store.dispatch("association/removeRecord", payload)
        .then(() => {
          const ItemIndex = this.news.findIndex((nouv) => nouv.id == id)
          this.news.splice(ItemIndex, 1)
          this.$vs.notify({
              position:'top-center',

              text: this.$t('newSuccessfullyDeleted'),
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success'
          })
          let payload = {
            resourceUrl: '/api/association/' + association_courante.id + '/nouvelle',
            commitAction: 'SET_NEWS'
          }

          this.$store.dispatch("association/fetchNews",payload)
        })
        .catch(err => { window.console.error(err) })
    },
  },
  created() {
    //Loader
    EventBus.$emit('loader', true)

    var current_association = this.$store.state.association.currentAssociation

    let payload = {
      resourceUrl: '/api/association/' + current_association.id + '/membre',
      commitAction: 'SET_MEMBERS'
    }

    this.$store.dispatch("association/fetchMembers",payload)
    .then(() => {
        //Données pour recuperer la liste des nouvelles
      let nouvellePayload = {
          resourceUrl: "/api/association/"+current_association.id+"/nouvelle",
          commitAction: 'SET_NEWS'
      }

      this.$store.dispatch("association/fetchNews", nouvellePayload)
      .then(()=>{
         EventBus.$emit('loader', false)
      })
      .catch(error => {
        EventBus.$emit('loader', false)
        window.console.log(error)
      })
    })
    .catch(err => { window.console.error(err) })
  },
  mounted() {
    this.isMounted = true;
  }
}
</script>
<style>
    .text-center .vs-input--input.normal {
        text-align: center !important;
    }
    /* .vs-table--content {
        width: 100%;
        overflow: auto;
        margin-top: -13px;
    } */
    .allocate-btn {
        padding-top: 3px !important;
        padding-bottom: 3px !important;
    }
</style>
