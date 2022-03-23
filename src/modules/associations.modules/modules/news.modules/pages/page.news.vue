<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container ">

    <!-- ACTION - DROPDOWN -->
    <!-- <vs-dropdown vs-trigger-click class="ml-auto md:block cursor-pointer fixed z-20" style="right:35px">
      <vs-button icon="icon-settings" icon-pack="feather">{{$t('actions')}}</vs-button>

      <vs-dropdown-menu class="w-64">
        <vs-dropdown-item >
          <div @click="addNewData('AjoutNouvelle')" class="flex items-center">
            <feather-icon icon="PlusIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
            <span>{{$t('announceANew')}}</span>
          </div>
        </vs-dropdown-item>
      </vs-dropdown-menu>

    </vs-dropdown> -->

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

          <vs-button
            class="ml-3 vs-con-loading__container"
            color="danger" ref="loadableButton"
            id="button-with-loading" :disabled="!loader"
            @click.stop="deleteItem(nouvelle_selectionnee)">
              {{$t('delete')}}
            </vs-button>
      </div>
    </vs-popup>
    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData" :etat="etat"/>


    <div id="demo-basic-card" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="limit">
      <div id="demo-basic-card">
         <div>
          <div class="w-full fixed z-10 top-0" style="height:150px; background-color: #f8f8f8;"/>
          <div class="pt-20">
            <div class="flex flex-wrap-reverse items-center data-list-btn-container ml-5">
              <!-- ADD NEW -->
              <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                @click.stop="addNewData('AjoutNouvelle')">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                  <span class="ml-2 text-base text-primary">{{$t('new')}}</span>
              </div>
            </div>
            <div class="ml-5 mr-5"  v-if="NewsData.length === 0">
              <vx-card class="mb-base">
                <p class="leading-tight ml-3 mt-2 mx-auto">{{$t('noNewsAnnounced')}}</p>
              </vx-card>
            </div>

            <a-timeline  v-if="NewsData.length > 0" class="vx-col w-full lg:w-10/12 mb-base item-center justify-center mx-auto" mode="alternate" :reverse="true">
              <!-- Liste des nouvelles-->
              <div :key="index" v-for="(nouvelle, index) in NewsData">
                <a-timeline-item>
                  <vx-card class="vx-col w-full">
                    <!-- POST HEADER -->
                    <div class="flex flex-wrap pb-3">
                      <div class="con-img">
                        <vs-avatar v-if="nouvelle.author.users.length > 0" :src="nouvelle.author.users[0].photo_profil" class="m-0" size="40px" />
                        <vs-avatar v-else class="m-0" size="40px" />
                      </div>
                      <div class="text-left leading-tight hidden sm:block ml-3 mt-2">
                        <p class="font-semibold">{{nouvelle.author.firstName | capitalize}} {{nouvelle.author.lastName | capitalize}}</p>
                        <small>{{new Date(nouvelle.date_nouvelle*1000).toDateString()}}</small>
                      </div>
                    </div>

                    <!-- POST CONTENT -->
                    <img  v-if="nouvelle.photo" :src="nouvelle.photo" alt="content-img" class="mt-2 responsive rounded-lg">
                    <div class="text-left leading-tight hidden sm:block mb-3">
                        <p class="mt-2 mb-3 font-bold">{{ nouvelle.titre}}</p>
                        <blockquote>
                          <p>{{ nouvelle.description }}</p>
                        </blockquote>
                    </div>
                    <!-- POST ACTION DATA -->
                    <div class="flex mt-6 flex-wrap">

                        <!-- Like -->
                        <span class="flex mr-6">
                          <feather-icon class="cursor-pointer" icon="ThumbsUpIcon" svgClasses="text-success stroke-current h-6 w-6" @click="likeOrDislike(nouvelle.id, 'like')"/>
                          <span class="ml-2">{{nouvelle.like}}</span>
                        </span>

                        <!-- Commentaire -->
                        <span class="flex mr-6">
                          <feather-icon class="cursor-pointer" icon="MessageSquareIcon" svgClasses="text-primary stroke-current h-6 w-6" @click="toggle(nouvelle.id)"/>
                          <span class="ml-2">{{nouvelle.commentaires.length}}</span>
                        </span>

                        <!-- Dislike -->
                        <span class="flex mr-6">
                          <feather-icon class="cursor-pointer" icon="ThumbsDownIcon" svgClasses="text-danger stroke-current h-6 w-6" @click="likeOrDislike(nouvelle.id, 'dislike')"/>
                          <span class="ml-2">{{nouvelle.unlike}}</span>
                        </span>

                        <!-- Actions (Mise à jour et Suppression) -->
                        <span v-if="extractMember(membreData) == nouvelle.author.id || user.id == association_courante.admin_id"
                          class="flex flex-wrap rounded-full" style="position:absolute; right: 10px">

                          <!-- Mise à jour -->
                          <vx-tooltip :text="$t('update')" position="bottom">
                            <feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                              @click.stop="updateNew('ModifierNouvelle', nouvelle)"/>
                          </vx-tooltip>

                          <!-- Suppression -->
                          <vx-tooltip :text="$t('delete')" position="bottom">
                            <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"
                              @click.stop="popupActivo2=true; nouvelle_selectionnee=nouvelle.id"/>
                          </vx-tooltip>
                        </span>
                    </div>

                    <!-- Actions commentaires -->
                    <div :id="nouvelle.id+'1'" class="hidden">
                      <vs-divider/>
                      <!-- POST DATA -->
                      <div class="comments-container mt-4">
                          <!-- Liste des commentaires -->
                          <ul class="user-comments-list">
                              <li v-for="(commentedUser, commentIndex) in nouvelle.commentaires"
                                :key="commentIndex" class="commented-user flex items-center mb-4">
                                  <div class="mr-3">
                                    <vs-avatar class="m-0" v-if="commentedUser.author.users.length"
                                      :src="commentedUser.author.users[0].photo_profil" size="30px" />
                                    <vs-avatar class="m-0" v-else size="30px"/>
                                  </div>
                                  <div class="leading-tight">
                                      <p class="text-left font-medium">{{commentedUser.author.users[0].firstName }}</p>
                                      <span class="text-left text-xs">{{commentedUser.commentaire}}</span>
                                  </div>
                                  <!-- <div class="ml-auto">
                                      <div class="flex">
                                          <feather-icon icon="HeartIcon" svgClasses="h-4 w-4" class="mr-2 cursor-pointer"/>
                                          <feather-icon icon="MessageSquareIcon" svgClasses="h-4 w-4" class="cursor-pointer"/>
                                      </div>
                                  </div> -->
                              </li>
                          </ul>
                          <span class="flex justify-end" v-if="nouvelle.length > 2">
                              <a class="inline-flex items-center text-sm" href=""><span>{{ $t('Viewall') }} </span>
                                <feather-icon :icon="$vs.rtl ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svgClasses="h-4 w-4"/>
                              </a>
                          </span>
                        </div>
                        <!-- POST FIELD-->
                        <!-- Champs commentaire -->
                        <div class="post-comment">
                            <textarea :id="nouvelle.id" placeholder="Add Comment" class="vs-component vs-con-textarea mb-2 vs-textarea-primary mb-2 comment"></textarea>
                            <vs-button size="small" @click="postComment(nouvelle.id, 'comment')">{{ $t('Postcomment') }} </vs-button>
                        </div>
                    </div>
                  </vx-card>
                </a-timeline-item>
              </div>
            </a-timeline>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import DataViewSidebar from '../../../components/sidebar/DataViewSidebar.component'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import {categorie} from "../services/data/categories.js"
import infiniteScroll from 'vue-infinite-scroll'

// Functions
import { EventBus } from  '@/services/EventBus.js'

// Store Module
// import moduleNouvelle from "@/store/nouvelle/moduleNouvelle.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
import {mapGetters} from 'vuex'

Vue.use(infiniteScroll)
export default {
  components: {
    DataViewSidebar,
    VuePerfectScrollbar,
  },
  data() {
    return {
      news: [],
      limit: 5,
      page: 1,
      nb_page: 1,
      busy: false,

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
      showSection: false, // Flag to show section
      post: [
        {
          commentbox: ''
        }
      ],

      id_membre : '',
      nouvelle_selectionnee: '',
      // user : JSON.parse(localStorage.getItem('user')),
      // association_courante: JSON.parse(localStorage.getItem('association_courante')),

      /* Loading */
        backgroundLoading:'danger',
        colorLoading:'#fff',
        loader: true
    }
  },
  computed: {
    ...mapGetters({
      member: 'authentificated/getAuth',
      user: 'authentificated/getAuth',
      association_courante: 'association/getCurrentAssociation'
    }),
    NewsData(){
        return this.nouvelles()
    },
    membreData(){
        return this.$store.state.association.members
    },
  },
  methods: {
    //Affiche le type de l'assistant dans la langue en cours
    afficheCategorie(type){
        return categorie.reduce((a, o) => o.value == type ? this.$t(a.concat(o.i18n)): a,'')
    },
    //Infinite scroll
    loadMore() {
      var association_courante = this.association_courante;
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
        var news_data = this.$store.state.association.news

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
        var user = this.user
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
      var user = this.user;
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
        var association = this.association_courante;

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
      var association = this.association_courante;

      let payload = {
        resourceUrl: "/api/association/"+association.id+"/nouvelle/"+nouvId+"/membre/"+membreId+"/"+action,
        commitAction: 'SET_NEW',
      }

      //Données pour recuperer la liste des nouvelles
      let nouvellePayload = {
          resourceUrl: "/api/association/"+association.id+"/nouvelle",
          commitAction: 'SET_NEWS'
      }
      this.$store.dispatch("association/fetchNews", payload)
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
    deleteItem(id) {
      this.openLoadingContained()
      var association_courante = this.association_courante

      let payload = {
        resourceUrl: '/api/association/' + association_courante.id + '/nouvelle/'+ id,
        commitAction: 'REMOVE_NEW',
        memberId: id
      }
      this.popupActivo2 = false
      this.$store.dispatch("association/removeRecord", payload)
        .then(() => {
          this.loader = true
          this.$vs.loading.close("#button-with-loading > .con-vs-loading")
          const ItemIndex = this.news.findIndex((nouv) => nouv.id == id)
          this.news.splice(ItemIndex, 1)
          this.$vs.notify({
              position:'top-center',
              title: 'success',
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
        .catch(err => {
          this.loader = true
          this.$vs.loading.close("#button-with-loading > .con-vs-loading")
          window.console.error(err)
        })
    },

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
    EventBus.$emit('loader', true)
    /*if(!moduleNouvelle.isRegistered) {
        this.$store.registerModule('nouvelle', moduleNouvelle)
        moduleNouvelle.isRegistered = true
    }
    if(!moduleUserManagement.isRegistered) {
      this.$store.registerModule('userManagement', moduleUserManagement)
      moduleUserManagement.isRegistered = true
    }
    if(!moduleAssociation.isRegistered) {
      this.$store.registerModule('association', moduleAssociation)
      moduleAssociation.isRegistered = true
    }*/
    var current_association = this.association_courante;

    let payload = {
      resourceUrl: '/api/association/' + current_association.id + '/membre',
      commitAction: 'SET_MEMBERS'
    }

    this.$store.dispatch("association/fetchMembers",payload)
    .then(() => {
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
#demo-basic-card {
    .overlay-card {
        .vx-card__collapsible-content {
            max-height: 485px;
        }
    }

    .chat-card-log {
        height: 360px;

        .chat-sent-msg {
            background-color: #f2f4f7 !important;
        }
    }

    .card-video {
        .video-js {
            height: 370px;
        }
    }
    .top-position {
      float: left !important;
    }

    .comment {
      height: 90px;
      padding: 10px;
      color: #626262
    }
    .hauteur {
      max-height: 70vh;
    }
}

blockquote {
    margin: 0;
}


blockquote p {
    padding: 15px;
    border-radius: 5px;
    border-left: 5px solid #eee;
}


blockquote p::before {
    content: '\201C';
}


blockquote p::after {
    content: '\201D';
}

</style>


