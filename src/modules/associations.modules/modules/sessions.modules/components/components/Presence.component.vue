<template>
  <div id="data-list-list-view" class="data-list-container">
    <!-- Popup pour modifier la présence d'un membre -->
    <vs-popup 
      classContent="popup-example" 
      class="popup-position select-member" 
      :title="$t('editPresence')+' - '+ membre_selectionne.name" 
      :active.sync="popupActivo1">
        <!-- Presence -->
        <p class="vs-input--label mt-2">{{$t('presenceTitle')}}</p>
        <v-select
          label="text"
          :options="selectPresenceOptions"
          class= "w-full mb-5"
          v-model="presences"
        />

        <vs-divider class="mt-8 mb-8"/>
        <div class="vx-row w-full justify-end">
            <vs-button 
              @click="popupActivo1=false" type="border"
              class="mr-3 mb-3">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;
            <vs-button 
              class="vs-con-loading__container mb-3" 
              ref="loadableButton" 
              id="button-loading"
              @click.prevent="createPresence(membre_selectionne.id)">
                {{$t('save')}}
            </vs-button>
        </div>
    </vs-popup>

    <!-- Data view sidebar -->
    <data-view
        @closeSidebar="toggleDataSidebar"
        :isSidebarActive="addNewDataSidebar"
        :data="emptyData">
        <h4 slot="title">{{ $t('editPresence') | CAPITALIZE }}</h4>

        <template slot="component">

          <!-- Membre -->
          <p class="vs-input--label">{{$t('members')}}</p>
          <v-select
            v-if="!modif"
            label="text"
            :options="selectOptions"
            class= "w-full mb-5"
            v-model="compte"
          />
          <v-select
            v-if="modif"
            label="text"
            class= "w-full mb-5"
            v-model="compte"
          />

          <!-- Presence -->
          <p class="vs-input--label">{{$t('presenceTitle')}}</p>
          <v-select
            label="text"
            :options="selectPresenceOptions"
            class= "w-full mb-5"
            v-model="presences"
          />

          <!-- Motif -->
          <p v-if="presences.value == 'excuse'" class="vs-input--label">{{$t('reason')}}</p>
          <vs-textarea
            v-if="presences.value == 'excuse'"
            v-model="raison"
            class="w-full" />
        </template>


        <vs-button class="mr-6" type="border" color="danger"
          @click="toggleDataSidebar">{{ $t('cancel')}}</vs-button>

        <vs-button id="button-with-loading-sav-sanction"
          :disabled="disable">
          {{ $t('save')}}
        </vs-button>

    </data-view>
    <div class="ml-4">
        <vx-card no-shadow class="mb-6 pb-6" :title="$t('presenceTitle')"/>
    </div>

    <!-- Presences-->
    <vx-card no-shadow class="ml-4">
      <div class="flex flex-wrap-reverse items-center data-list-btn-container">
        <!-- ADD NEW -->
        <!-- <div class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
          @click="reInitialize" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')" >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">{{ $t('editPresence')}}</span>
        </div> -->
      </div>
      <ul class="centerx">
          <li class="vx-col sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/3 w-full mt-3 inline-block cursor-pointer"
            v-for="member in owners" :key="member.id"
            @click="()=>{
              changePresence(member.status)
              popupActivo1=true; 
              membre_selectionne=member}">
              <!-- Present -->
              <span
                class="flex flex-wrap"
                v-if="member.status == 'present'" >
                <vx-tooltip :text="$t('present')" position="bottom"  class="inline-block ">
                  <feather-icon
                    icon="CircleIcon"
                    svg-classes="w-5 h-5 stroke-current text-success bg-success rounded-full"
                    class="mr-1"/>
                </vx-tooltip>
                  <p class="product-name truncate">
                    {{ member.name }}
                  </p>
              </span>

              <!-- Absent -->
              <span
                class="flex flex-wrap"
                v-if="member.status == 'absent'" >
                <vx-tooltip :text="$t('absent')" position="bottom"  class="inline-block ">
                <feather-icon
                  icon="CircleIcon"
                  svg-classes="w-5 h-5 stroke-current text-danger bg-danger rounded-full"
                  class="mr-1"/>
                 </vx-tooltip>
                <p class="product-name truncate">
                  {{ member.name }}
                </p>
              </span>

              <!-- Retard -->
              <span
                class="flex flex-wrap"
                v-if="member.status == 'retard'" >
                <vx-tooltip :text="$t('late')" position="bottom"  class="inline-block ">
                <feather-icon
                  icon="CircleIcon"
                  svg-classes="w-5 h-5 stroke-current text-warning bg-warning rounded-full"
                  class="mr-1"/>
                </vx-tooltip>
                <p class="product-name truncate">
                  {{ member.name }}
                </p>
              </span>

              <!-- Excuse -->
              <span
                class="flex flex-wrap "
                v-if="member.status == 'excuse'" >
                <vx-tooltip :text="$t('excuse')" position="bottom"  class="inline-block ">
                <feather-icon
                  style="background: #3383c8; color: #3383c8; border-radius: 9999px;
                          width: 1.25rem !important; height: 1.25rem !important;"
                  icon="CircleIcon"
                  svg-classes="w-5 h-5 stroke-current"
                  class="mr-1"/>
                </vx-tooltip>
                <p class="product-name truncate">
                  {{ member.name }}
                </p>
              </span>
          </li>
      </ul>
    </vx-card>

    <div class="flex flex-wrapper mt-6 ml-4">
        <vs-button type="border" class="mr-6" id="button-loading" @click.native="previous">{{$t('previous')}}</vs-button>
        <vs-button  @click.native="next">{{$t('next')}}</vs-button>
    </div>
  </div>
</template>

<script>
import { EventBus } from  '@/services/EventBus.js'
import { Attendance } from '../../services/data/attendance.js'
import vSelect from 'vue-select'

import data from '../../services/mixins/data'

import sidebar from '../../services/mixins/sidebar'

import {createPresenceMembre, getAllPresence } from '../../services/api'

const findByname = (params) => {
  const render = params.data.find( e => e.membres_id === params.id)
  return render
}

const hydrate = (data , user=false) => {

  return data.map(e => {
    let membre = null

    if(user)
     membre = findByname({data:user, id: e.id})
    return Object.assign({}, e,
    {
      status: (membre) ? membre.status : 'present',
      raison: (membre) ? (membre.raison != null && membre.raison != '' ? membre.raison : '- - -')
                                                                : '- - -'
    })}
  )}

export default {
	props: ['users', 'uuid', 'vs_length', 'roles'],
	mixins: [data, sidebar],
  data: () => ({
    owners: [],
    steam:'',
    compte:'',
    presences:'',
    raison: '',
    modif: false,
    popupActivo1: false,
    membre_selectionne: '',
    itemsPerPage: 10,
    isMounted: false,

    /* Loading */
    backgroundLoading: 'primary',
    colorLoading: '#fff',
    loader: true,
  }),
  components:{
    vSelect
  },
  computed:{
    selectOptions(){
        if(this.owners != null)
            return this.owners.map(owner => ({id: owner.id, text: owner.name, value: owner.id}))
    },

    selectPresenceOptions(){
        return Attendance.map(pr => ({text: this.$t(pr.i18n), value: pr.value}))
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
        return this.$refs.table ? this.$refs.table.queriedResults.length : this.owners.length
    },

    disable(){
      return (this.compte && this.presences) ? false : true
    }
  },
  methods: {
    initialize(data){
      /* his.owners = [data] */
      this.compte = {text: data.name, value: data.id}
      this.presences = {
        text: Attendance.reduce((a, o) => o.value == data.status ? this.$t(a.concat(o.i18n)) : a, ''),
        value: data.status}
      this.raison = data.raison != '- - -'? data.raison: ''
      this.addNewDataSidebar = !this.addNewDataSidebar
    },

    reInitialize(){
      this.compte = ''
      this.presences = ''
      this.raison = ''
      this.addNewDataSidebar = !this.addNewDataSidebar
    },

    previous(){
      this.$emit('selectedTab',2)
    },

    next(){
      this.$emit('selectedTab',3)
    },

    changePresence(pr){
      this.presences = {
        text: Attendance.reduce((a, o) => o.value == pr ? this.$t(a.concat(o.i18n)) : a, ''),
        value: pr
      }
    }, 
    createPresence(membre_id){
      this.openLoadingContained()
      createPresenceMembre(
      {
        users: this.owners,
        assId:this.$store.state.association.currentAssociation.id,
        agId: this.uuid,
        membre_id: membre_id,
        status: this.presences.value,
        raison: this.presences.value == 'present' ? '- - -':this.raison
      })
      .then(() => {
          this.motif = false
          this.popupActivo1 = false
          this.loader = true
          this.$vs.loading.close("#button-loading > .con-vs-loading")
          /* this.addNewDataSidebar = !this.addNewDataSidebar */
          this.$vs.notify({
              position:'top-center',
              text: this.$t('notifContent'),
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success'
          })

          getAllPresence({assId:this.$store.state.association.currentAssociation.id, agId:this.uuid})
          .then(e => {
            if( e.data.data.length == 0)
              this.owners = hydrate(this.users)
            else
              this.owners = hydrate(this.users, e.data.data)
          })
          .catch(e => window.console.log(e))
            },
            err => window.console.log(err)
      )
      .catch((e) => {
        this.loader = true
        this.$vs.loading.close("#button-loading > .con-vs-loading")
        window.console.log(e)
      })
    },

    openLoadingContained() {
        this.loader = false
        this.$vs.loading({
            background: this.backgroundLoading,
            color: this.colorLoading,
            container: "#button-loading",
            scale: 0.45
        });
    },
  },
	created(){
    //Loader
    EventBus.$emit('loader', true)
    /* window.console.log('create presence component') */

    getAllPresence({assId:this.$store.state.association.currentAssociation.id, agId:this.uuid})
      .then(e => {
        if( e.data.data.length == 0)
          this.owners = hydrate(this.users)
        else
          this.owners = hydrate(this.users, e.data.data)

        //Loader
        EventBus.$emit('loader', false)
      })
      .catch(e => {
        EventBus.$emit('loader', false)
        window.console.log(e)
      })
  },
  destroy(){
    this.stream.unsubscribe()
  },

  mounted() {
    this.isMounted = true;

    this.presences = {
      text: this.$t(Attendance[0].i18n), 
      value: Attendance[0].value
    }
  }
}
</script>
<style lang="scss">
  .product-name {
    max-width: 15rem;
  }
</style>
