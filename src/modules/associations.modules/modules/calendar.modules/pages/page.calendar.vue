<template>
    <div>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div  class="pt-16">
          <div class="vx-row">
            <div class="vx-col w-1/3">
              <vx-card>
                <!-- Date du jour -->
                <div slot="no-body" class="p-3 text-white text-center"
                  style="background:#2b3d51; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem">
                  <p class="text-2xl">{{currentDay}}</p>
                  <p class="text-6xl">{{day}}</p>
                  <p class="mb-5">{{currentMonth+' '+year}}</p>
                </div>
                <p>
                  {{$t('forMoreDetailsOnAnEvent')}}
                </p>

                <vs-collapse accordion>
                  <vs-collapse-item>
                    <!-- Assemblées générales -->
                    <div slot="header">
                      {{$t('generalMeetings')}}
                    </div>
                    <a-timeline class="timeline-heigth" v-if="ags" >
                      <div :key="index" v-for="(ag, index) in ags">
                        <a-timeline-item>
                          <p>{{ag.date_ag | fullDateTime}}</p>
                          <p class="mt-1 link-color hover:italic" @click="toggle(index)">
                            {{$t('generalMeetings')}}
                          </p>
                          <p class="mt-1" v-if="ag.etat!='past'">
                            <span class="inline-block mr-1">
                              <feather-icon icon="MapPinIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" />
                            </span>
                            <span v-if="ag.lieu_ag == 'En ligne'" class="inline-block">
                                {{$t('online')}}
                            </span>
                            <span v-else-if="ag.lieu_ag == null && (ag.membres_id && ag.membre != 'not found')
                              || ag.lieu_ag == 'null' && ag.membre != 'not found' "
                              class="inline-block">
                                {{$t('atTheHomeOf') +' '+ag.membre}}
                            </span>
                              <span v-else-if="ag.lieu_ag == null && ag.membre == 'not found'
                              || ag.lieu_ag == 'null' && ag.membre == 'not found' "
                              class="inline-block">
                            </span>
                            <span v-else class="inline-block">
                                {{ag.lieu_ag}}
                            </span>
                          </p>
                          <p :id="index" class="mt-2 activity-e-time pr-1" style="display: none;">
                            {{$t('meetingOfAllMembersOfTheAssociation')}}
                          </p>
                        </a-timeline-item>
                      </div>
                    </a-timeline>
                  </vs-collapse-item>
                  <!-- Evénements -->
                  <vs-collapse-item>
                    <div slot="header">
                      {{$t('events')}}
                    </div>
                    <a-timeline class="timeline-heigth" v-if="Object.keys(eventsData).length > 0">
                      <div :key="index" v-for="(event, index) in eventsData">
                        <a-timeline-item>
                          <p>{{ event.Evenement.date_event | fullDateTime }}</p>
                          <p class="mt-1 link-color hover:italic" @click="toggle(index+'ev')">{{$t('event')}}</p>
                          <p class="mt-1">
                            <span class="inline-block mr-1">
                              <feather-icon icon="MapPinIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" />
                            </span>
                            <span class="inline-block">
                                {{event.Evenement.lieu_event}}
                            </span>
                          </p>
                          <p :id="index+'ev'" class="mt-2 activity-e-time" style="display: none;">{{event.Evenement.quoi}}</p>
                        </a-timeline-item>
                      </div>
                    </a-timeline>
                  </vs-collapse-item>
                </vs-collapse>
              </vx-card>
            </div>
            <div class="vx-col w-2/3">
              <!-- Calendrier -->
              <vx-card>
                <Calendar
                  :language="language"
                  :data-source="dataSource"
                  @mouse-on-day="mouseOnDay" @mouse-out-day="mouseOutDay"/>
              </vx-card>
            </div>
          </div>
         </div>
    </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import tippy from 'tippy.js';
import Calendar from 'v-year-calendar';
import 'v-year-calendar/locales/v-year-calendar.fr';
import Antd from 'ant-design-vue';

import * as moment from 'moment';
import localisation from  'moment/locale/fr';


moment.updateLocale('en', localisation)

// i18n
import i18n from '@/services/i18n/i18n'

//Importation des feuilles de style
import '@/assets/css/ant-upload.css';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';

// Fonctions
import functions from '../../../services/functions.js'
import { EventBus } from  '@/services/EventBus.js'

// Store Module
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"

Vue.use(Antd)
export default {
  components: {Calendar},
  data () {
    return {
      ags: null,
      cycle_actif: null,
      day: '',
      month: '',
      year: '',
      activeClass: '',
      tooltip: null,
      heure_assemblee: null,

      all_events: []
    }
  },
  computed: {
    eventsData(){
      return this.all_events
    },
    dataSource(){
      return this.getDataSource()
    },
    language(){
      return i18n.locale
    },
    currentDay(){
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var jours = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      var currentDate = new Date()

      var day = currentDate.getDay()
      if(i18n.locale == 'fr'){
        return jours[day]
      }
      if(i18n.locale == 'en'){
        return days[day]
      }
    },
    currentMonth(){
      var currentDate = new Date()

      var date = this.getStringDate(currentDate.getTime()/1000);

      if(i18n.locale == 'fr'){
        let jour_mois_annee = []

        jour_mois_annee = date.split(' ')
        return jour_mois_annee[1]
      }
      if(i18n.locale == 'en'){
        let jour_mois_annee = []
        let jour_mois = []

        jour_mois_annee = date.split(',')
        jour_mois = jour_mois_annee[0].split(' ')
        return jour_mois[0]
      }
    }
  },
  methods: {

    getStringDate(value) {
      const locale = i18n.locale;
      const options = {month: "long", day: "numeric", year: "numeric", hour:'numeric', minute: 'numeric', };

      return new Date(value*1000).toLocaleString(locale, options);
    },
    toggle(item) {
      $( '#'+item ).toggle(300)
    },
    //Retourne les dates événements actives dans le calendrier
    getDataSource(){
      var activeDates = []

      if(this.ags){
        this.ags.forEach(ag => {
          let activedate = new Date(ag.date_ag*1000).toISOString()
          activeDates.push(
            {
              date:activedate,
              color: ag.etat == 'past' || ag.etat == 'cloture' ? '#ccc': '#F5BB00',
              title: this.$t('meetingOfAllMembersOfTheAssociation'),
              name: this.$t('generalMeetings'),
              state: ag.etat,
              location: ag.lieu_ag == 'En ligne' ? this.$t('online'): ag.lieu_ag == null && ag.membres_id ? this.$t('atTheHomeOf') +' '+ag.membre: ''
            }
          )
        })
      }

      if(Object.keys(this.eventsData).length > 0){
        this.eventsData.forEach(evenement => {
          let activedate = new Date(evenement.Evenement.date_event*1000).toISOString()
          activeDates.push(
            {
              date:activedate,
              color: '#64b0f2',
              title: evenement.Evenement.quoi,
              name: this.$t('event'),
              state: 'current',
              location: evenement.Evenement.lieu_event
            }
          )
        })
      }

      if (activeDates.length > 0) {
        return activeDates.map(r => ({
          startDate: new Date(r.date),
          endDate: new Date(r.date),
          color: r.color,
          title: r.title,
          name: r.name,
          state: r.state,
          location: r.location
        }));
      }

      return []
    },
    //Afficher le tooltip lorsque l'utilisateur glisse la sourie sur la date
    mouseOnDay: function(e) {
      if (e.events.length > 0) {
        var content = '';

        for (var i in e.events) {
          if(e.events[i].state != 'past'){
            content += '<div class="event-tooltip-content">'
              + '<div class="event-name" style="color:'+ e.events[i].color + '">'
              + e.events[i].name + '</div>'
              + '<div class="event-details mt-1 pb-3" style="border-bottom: 1px solid rgba(196,196,196,0.3)">'
              +'<i class="fas fa-map-marker mr-1"></i>' + e.events[i].location + '</div>'
              + '<div class="event-details mt-2 mb-base">' + e.events[i].title + '</div>'
              + '</div>';
          }
          else{
            content += '<div class="event-tooltip-content">'
              + '<div class="event-name" style="color:'+ e.events[i].color + '">'
              + e.events[i].name + '</div>'
              + '<div class="event-details mt-1">'
              + '<div class="event-details mt-2">' + e.events[i].title + '</div>'
              + '</div>';
          }
        }

        if (this.tooltip != null) {
          this.tooltip.destroy();
          this.tooltip = null;
        }

        this.tooltip = tippy(e.element, {
          placement: 'right',
          content: content,
          animateFill: true,
          animation: 'shift-away',
          arrow: true,
          allowHTML: true,
        });
        this.tooltip.show();
      }
    },
    mouseOutDay: function() {
      if (this.tooltip !== null) {
        this.tooltip.destroy();
        this.tooltip = null;
      }
    },
    toggleDate (dateInfo) {
      window.console.log(dateInfo)  // { date: '2010-10-23', selected: true }
    }
  },
  created(){
    EventBus.$emit('loader', true)

    var association_courante = this.$store.getters['association/getCurrentAssociation'];
    let payload = {
      resourceUrl: '/api/association/' + association_courante.id + '/cycle',
      commitAction: 'SET_CYCLES'
    }
    this.$store.dispatch("association/fetchCycles",payload)
    .then((res)=>{
      let donnees = res.data
      //Verifier s'il ya des cycles dans l'association
      if(donnees.data.length > 0) {
          //Nous voullons reccuperer les cycles cloturés et le cycle actif de l'association
          var cycle = donnees.data
          var cycleActif =  functions.afficherCycleActif(cycle)
          this.cycle_actif = cycleActif;
          //Assigner les ags du cycle actigf à la variable ags s'il en existe
          if(cycleActif.ag.length > 0) {
            this.heure_assemblee = cycleActif.cycle.heure_assemblee
            this.ags = cycleActif.ag
          }
      }
      let payload = {
        resourceUrl: '/api/association/'+association_courante.id + '/activite/type/Evenement',
        commitAction: 'SET_CALENDAR_EVENTS'
      }
      this.$store.dispatch("association/fetchAssociationactivite",payload)
      .then((res)=>{
        let data = res.data.data
         this.all_events = []
        /* window.console.log(data) */
        if(Object.keys(data).length > 0){
          data.forEach(event=>{
            if(event.etat != "cloture")
              this.all_events.push(event)
          })
        }
        EventBus.$emit('loader', false)
      })
      .catch((error)=>{
        EventBus.$emit('loader', false)
        window.console.error(error)
      })
    })
    .catch((error)=>{
      window.console.error(error)
    })

    var currentDate = new Date()

    this.day = currentDate.getDate()
    this.month = currentDate.getMonth()
    this.year = currentDate.getFullYear()
  }
}
</script>
<style lang="scss">
    .vue-calendar__container {
        .container__year[data-v-48911cf0] {
            border-bottom: 1px solid rgba(196,196,196,0.3);
        }
        .container__months[data-v-48911cf0] {
            background-color: #fff;
        }
    }
    .timeline-heigth {
      padding-top: 2px;
      height: 250px;
      overflow: auto;
    }
    .calendar .months-container .month-container {
        float: left;
        text-align: center;
        height: 230px !important;
        padding: 0;
    }
    .link-color {
      color:#3EB2FB;
    }
</style>
