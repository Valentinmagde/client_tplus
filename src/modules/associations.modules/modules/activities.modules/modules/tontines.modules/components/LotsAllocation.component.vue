
<template>
<div>
  <!-- Activity title -->
  <vx-card class="mr-4 mb-base" no-shadow :title="$t('allocationOfLotsTontine')+' '+ (activity.nom ? activity.nom : '')">
    <span class="mb-base">
      {{$t('allocationOfLotsTontineSubtitle')}}
    </span>
  </vx-card>

  <vx-card no-shadow class="-mt-2">
    <p v-if="!tontineType">
      {{$t('noElementFound')}}
    </p>
  </vx-card>
  <div class="flex flex-row justify-end mb-4">
    <vs-button class="vs-con-loading__container"
    id="teken"
    ref="teken"
    v-if="attributionType != 'ENCHERE'"
    :disabled="new Date(tontineStartingDate * 1000) < new Date()"
     @click="splashLoading('teken'); teken()">
      {{$t('drawingOfLot')}}
    </vs-button>
  </div>

  <div v-if="(tontineType == 'FIXE' && isReady)">
    <swiper class="swiper select-none" :options="swiperOption">
      <swiper-slide v-for="(item, index) in agsArrays" :key="index">
        <div class="ml-2 mr-2">
        <vx-card
        class="h-full"
        no-shadow
        :title="item.value|dateTime"
        :subtitle="item.limit == item.lots.length ? '' : $t('dragALotHere')">
          <draggable
          :animation="200"
          :list="item.lots"
          :empty-insert-threshold="50"
          :componentData="{ props: {tag: 'bucket' ,limit: item.limit} }"
          :move="onMove"
          group="lots">

            <transition-group type="transition" name="flip-first" class="flex flex-col justify-center beneficiary-chip">
              <vs-chip class="cursor-pointer" v-for="lot in item.lots" :key="lot.id">
                <vs-avatar />
                <span class="select-none">{{ lot.membre }}</span>
              </vs-chip>
            </transition-group>

          </draggable>
          <div slot="footer">
            <vs-row vs-justify="flex-end">
              <vs-chip :color="item.lots.length == item.limit ? '#28C76F' : null">
                {{ item.lots.length + ' / ' + item.limit}}
              </vs-chip>
            </vs-row>
          </div>
        </vx-card>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>

    <vs-row class="mt-4 select-none" vs-justify="center">
      <vs-col type="flex" vs-justify="center" vs-align="center">
        <vs-card>
          <div slot="header">
            <h3>
              {{ $t('tontineLots') }}
            </h3>
          </div>

          <draggable
          class="flex flex-row justify-center"
          :animation="200"
          :componentData="{ props: {tag: 'set'} }"
          :empty-insert-threshold="100"
          :move="onMove"
          :list="remainingLots"
          group="lots">

            <transition-group type="transition" name="flip-list">
              <vs-chip class="cursor-pointer" v-for="lot in remainingLots" :key="lot.id">
                <vs-avatar />
                <span class="select-none">{{ lot.membre }}</span>
              </vs-chip>
            </transition-group>

          </draggable>

          <div v-if="!remainingLots.length" class="flex justify-center">
            <span class="text-opacity-50">{{$t('dragALotHere')}}</span>
          </div>

          <vs-divider/>
          <div slot="footer">
            <vs-row vs-justify="flex-end">
              <span class="text-sm font-bold">
                {{$t('Remaining') | Capitalize }} {{ remainingLots.length }}/{{ numberOfLots }}
              </span>
            </vs-row>
          </div>
        </vs-card>
      </vs-col>
    </vs-row>
  </div>
  <div v-else-if="tontineType == 'VARIABLE' && activity.Tontine.part_cotisation == 1 && isReady">
    <swiper class="swiper select-none" :options="swiperOption">
      <swiper-slide v-for="(item, index) in agsArrays" :key="index">
        <div class="ml-2 mr-2" :class="{ inactiveCalendar: !calendarStatus[index] }">
          <vx-card
          class="h-full pb-2"
          no-shadow :disabled="true"
          :title="item.value|dateTime"
          :subtitle="!calendarAmounts[index]? '' : $t('dragALotHere')">
            <draggable
            :animation="200"
            :list="item.lots"
            :empty-insert-threshold="50"
            :componentData="{ props: {tag: 'bucket' ,limit: item.limit, amount: item.amount, lots: item.lots, index: index} }"
            :move="checkMove"
            @add="onAdd(item.lots, index)"
            @remove="onRemove(item.lots)"
            :key="componentKey"
            :options="{disabled : !calendarStatus[index]}"
            group="lots">
              <transition-group type="transition" name="flip-first" class="flex flex-col justify-center beneficiary-chip">
                <vs-chip 
                  :disabled="!calendarStatus[index]"
                  class="cursor-pointer beneficiary-chip"
                 
                  v-for="lot in item.lots" 
                  :key="lot.id"
                  @mouseover.native="initializeIndex(lot.montant, index)">
                  <vs-avatar />
                  <span class="select-none">{{ lot.membre}} ({{lot.montant | formatMoney(devise) }})</span>
                </vs-chip>
              </transition-group>
            </draggable>
            <div slot="footer">
              <vs-row vs-justify="center">
                <vs-chip :color="calendarAmounts[index] == 0 ? '#28C76F' : null">
                  {{ calendarAmounts[index] | formatMoney(devise)}}
                </vs-chip>
              </vs-row>

              <div class="my-2 -mx-4">
                <vs-button 
                  v-if="index != 0" 
                  type="border" 
                  :color="calendarStatus[index] ? '#28C76F' : '#f0f0f0'" 
                  icon-pack="feather" 
                  icon="icon-chevrons-left" 
                  class="float-left vuesax-app-is-ltr con-vs-chip py-0 px-2 font-bold hover: #28C76F" 
                  :class="{textColor: !calendarStatus[index]}"
                  :disabled="!calendarStatus[index]" style="color: #28C76F; font-family: Montserrat, Helvetica, Arial, sans-serif"
                  @click="prevCalendar(item.lots, index)">
                  {{ $t('previous')}}
                </vs-button>

                 <vs-button
                  v-if="index != calendarStatus.length - 1" 
                  :color="calendarStatus[index] ? '#28C76F' : '#f0f0f0'" 
                  icon-pack="feather" 
                  icon="icon-chevrons-right" 
                  icon-after 
                  :disabled="!calendarStatus[index]" 
                  class="float-right vuesax-app-is-ltr con-vs-chip py-0 px-2 font-bold" 
                  :class="{textColor: !calendarStatus[index]}"
                  style="color: #FFFFFFE6; font-family: Montserrat, Helvetica, Arial, sans-serif"
                  @click="nextCalendar(index)">
                  {{ $t('next')}}
                </vs-button>
              </div>
            </div>
          </vx-card>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>

    <vs-row class="mt-4 select-none" vs-justify="center">
      <vs-col type="flex" vs-justify="center" vs-align="center">
        <vs-card>
          <div slot="header">
            <h3>
              {{ $t('tontineLots') }}
            </h3>
          </div>

          <draggable
          class="flex flex-row justify-center"
          :animation="200"
          :componentData="{ props: {tag: 'set'} }"
          :empty-insert-threshold="100"
          :move="checkMove"
          :list="remainingLots"
          group="lots">

            <transition-group type="transition" name="flip-list">
              <vs-chip class="cursor-pointer" v-for="lot in remainingLots" :key="lot.id">
                <vs-avatar />
                <span class="select-none">{{ lot.membre}} ({{lot.montant | formatMoney(devise) }})</span>
              </vs-chip>
            </transition-group>

          </draggable>

          <div v-if="!remainingLots.length" class="flex justify-center">
            <span class="text-opacity-50">{{$t('dragALotHere')}}</span>
          </div>

          <vs-divider/>
          <div slot="footer">
            <vs-row vs-justify="flex-end">
              <span class="text-sm font-bold">
                {{$t('Remaining') | Capitalize }} {{ remainingLots.length }}/{{ numberOfLots }}
              </span>
            </vs-row>
          </div>
        </vs-card>
      </vs-col>
    </vs-row>
  </div>

  <div v-else-if="tontineType == 'VARIABLE' && activity.Tontine.part_cotisation == 0 && isReady">
    <swiper class="swiper select-none" :options="swiperOption">
      <swiper-slide v-for="(item, index) in agsArrays" :key="index">
        <div class="ml-2 mr-2">
        <vx-card
        class="h-full"
        no-shadow
        :title="item.value|dateTime"
        :titleColor="item.lot.member !== '' && item.lot.amount !== 0 ? '#28C76F' : 'no-color'"
        :subtitle="subtitleMessage(item)">
          <div class="flex flex-row justify-center">
            <select v-model="item.lot.member">
              <template v-for="(member, index) in membersInvolved">
                <option :key="index" :value="member.member">
                  {{ member.member }}
                </option>
              </template>
            </select>
          </div>
          <div class="flex flex-row justify-center mt-2">
            <money v-model="item.lot.amount" v-bind="moneyOptions" class="money-input w-full" />
          </div>
          <div slot="footer">
            <vs-row
            v-if="item.lot.member !== '' && agsArrays.filter((ag) => { return ag.lot.member === item.lot.member }).length > 1"
            vs-justify="flex-end">
              <span class="text-xs italic" style="color: #FF9F43">
                {{ $t('alreadyPicked') }}
              </span>
            </vs-row>
          </div>
        </vx-card>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>

  <div class="flex flex-wrapper mt-6">
    <vs-button 
      type="border" 
      class="mr-6" 
      :disabled="buttonIsLoading" 
      @click.native="previous">
      {{$t('previous')}}
    </vs-button>

    <vs-button 
      type="border" 
      class="mr-6" 
      :disabled="buttonIsLoading" 
      @click.native="reset()">
      {{$t('cancel')}}
    </vs-button>

    <vs-button 
      class="ml-3 vs-con-loading__container" 
      id="forward" 
      @click.native="splashLoading('forward'); assignLots()" 
      :disabled="disable && tontineType != 'VARIABLE' || buttonIsLoading && tontineType != 'VARIABLE'|| remainingLots.length > 0 && tontineType == 'VARIABLE'">
      {{$t('next')}}
    </vs-button>
  </div>

</div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import 'swiper/dist/css/swiper.css'
  import draggable from 'vuedraggable'
  import { EventBus } from '@/services/EventBus'
  import { Money } from 'v-money'

  export default {
    props:['ags', 'activity'],
    components: {
      swiper,
      swiperSlide,
      draggable,
      Money,
    },

    data() {
      return {
        swiperOption: {
          slidesPerView: 3,
          slidesPerGroup: 2,
          spaceBetween: 20,
          freeMode: true,
          allowTouchMove: false,
          pagination: {
            el: '.swiper-pagination',
            type: 'progressbar',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          breakpoints: {
            576: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10
            },
            992: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              spaceBetween: 15
            },
          }
        },

        moneyOptions: {
          decimal: ',',
          thousands: '.',
          precision: 2,
          masked: false /* doesn't work with directive */
        },
        devise: '',
        remainingLots: [],
        membersInvolved: [],
        agsArrays: [],
        agsArraysAmounts: [],
        calendarAmounts: [],
        calendarCurrentAmounts : 0,
        calendarIndex: null,
        currentLotAmount: 0,
        calendarStatus: [],
        componentKey: 0,

        tontineType: null,
        tontineStartingDate: this.activity.Tontine.date_debut,
        attributionType: this.activity.Tontine.attribution_cagnote,

        buttonIsLoading: false,
        isReady: false,
      }
    },

    computed: {
      ...mapGetters({
          currentAssociation: 'association/getCurrentAssociation',
      }),

      numberOfLots() {
        return this.$store.state.association.lots.length
      },

      areBucketsFilled() {
        if(this.tontineType === 'VARIABLE' && this.activity.Tontine.part_cotisation == 0)
          return this.agsArrays.every((ag) => {
            return ag.lot.member !== '' && ag.lot.amount !== 0
                    && this.agsArrays.filter((anyone) => anyone.lot.member === ag.lot.member).length === 1
          })
        return this.agsArrays.findIndex((bucket) => { return bucket.lots.length !== bucket.limit }) < 0
      },

      disable() {
        return !this.areBucketsFilled
      },

      // checkUnicity(member) {
      //   return
      // }
    },

    methods: {
      onMove(event) {
        if(event.relatedContext.component.componentData.props.tag === 'bucket') // Dragging in a lot bucket
          if(event.relatedContext.list.findIndex((itemLot) => {itemLot.id === event.draggedContext.element.id}) > -1) // Dragging in the same bucket
            return true
          else  // Dragging in another bucket - Check performed
            return event.relatedContext.component.componentData.props.limit >= event.relatedContext.list.length + 1
        return true // Dragging in the lot set
      },

      checkMove(event) {
        if(event.relatedContext.component.componentData.props.tag === 'bucket'){// Dragging in a lot bucket
          let amounts = event.draggedContext.element.montant

          let lots = JSON.parse(JSON.stringify(event.relatedContext.list))
          
          if(lots.length > 0){
              lots.forEach(lot=>{
                amounts += lot.montant
              })
          }
          if(event.relatedContext.list.findIndex((itemLot) => {itemLot.id === event.draggedContext.element.id}) > -1) {// Dragging in the same bucket
            return true
          }
          else if(amounts > event.relatedContext.component.componentData.props.amount){
            return false
          }
        }

        return true // Dragging in the lot set
      },

      onAdd(lot, index){
        let amounts = 0
        let lots = JSON.parse(JSON.stringify(lot))

        lots.forEach(element=>{
          amounts += element.montant
        })

        this.calendarAmounts[index] = this.agsArrays[index].amount - amounts
        this.componentKey += 1
      },
      onRemove(lot){
        let lots = JSON.parse(JSON.stringify(lot))
        this.componentKey += 1

        if(lots.length==0)
          this.calendarAmounts[this.calendarIndex] = this.agsArrays[this.calendarIndex].amount
        else
          this.calendarAmounts[this.calendarIndex] = this.calendarAmounts[this.calendarIndex] + this.currentLotAmount
      },
      initializeIndex(lotAmount, index){
        this.calendarIndex = index
        this.currentLotAmount = lotAmount
      },

      nextCalendar(index){
        let amount =  this.calendarAmounts[index]

        this.calendarAmounts[index + 1] = this.calendarAmounts[index + 1] + amount
        this.agsArrays[index + 1].amount = this.agsArrays[index + 1].amount + amount

        this.agsArrays[index].amount = amount
        this.calendarAmounts[index] = 0
        this.calendarStatus[index] = false
        this.calendarStatus[index + 1] = true

        this.componentKey += 1
      },

      prevCalendar(lot, index){
        let currentAmount = 0
        let prevAmount = 0
        let currentLots = JSON.parse(JSON.stringify(lot))
        let prevLots = JSON.parse(JSON.stringify(this.agsArrays[index-1].lots))
        
        currentLots.forEach(element=>{
          this.remainingLots.push(element)
          currentAmount += element.montant
        })

        prevLots.forEach(element=>{
          prevAmount += element.montant
        })

        this.calendarAmounts[index-1] = (currentAmount + this.calendarAmounts[index]) - this.agsArraysAmounts[index]
        this.agsArrays[index-1].amount = prevAmount + this.calendarAmounts[index-1]


        this.agsArrays[index].lots = []
        this.calendarAmounts[index] = this.agsArraysAmounts[index]
        this.agsArrays[index].amount = this.agsArraysAmounts[index]
        this.calendarStatus[index] = false
        this.calendarStatus[index - 1] = true

        this.componentKey += 1
      },

      subtitleMessage(item) {
        return  item.lot ?
                item.lot.member === '' ? this.$t('chooseABeneficiary')
                : item.lot.amount === 0 ? this.$t('assignAnAmount')
                : ''
                : ''
      },

      splashLoading(DOMReference) {
        this.buttonIsLoading = true
        this.$vs.loading({
          background: 'primary',
          color: '#fff',
          container: `#${DOMReference}`,
          scale: 0.45
        });
      },

      unsplashLoading(DOMReference) {
        this.buttonIsLoading = false
        this.$vs.loading.close(
          `#${DOMReference} > .con-vs-loading`
        );
      },

      previous() {
        setTimeout(() =>{this.$emit('selectedTab', 1)}, 500)
      },

      reset() {
        this.agsArrays.forEach((array, index, agsArrays) => {
          this.remainingLots.push(...array.lots.values())
          agsArrays[index].lots = Array()
        })

        this.calendarStatus = []
        this.calendarAmounts = []
        let $inc = 0
        this.agsArraysAmounts.forEach(element=>{
          this.calendarAmounts.push(element)
          this.agsArrays[$inc].amount = element

          if($inc == 0){
            this.calendarStatus.push(true)
          }

          else{
            this.calendarStatus.push(false)
          }

          $inc++
        })
      },

      teken() {
        let association_id = this.$store.state.association.currentAssociation.id
        let tontine_id = this.activity.Tontine.id
        let payload = {}

        if(this.tontineType == 'VARIABLE' && this.activity.Tontine.part_cotisation == 1){
          payload = {
            resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/tontinevariable/unique/tirage',
            commitAction: 'SET_CALENDRIERS'
          }
        }
        else{
          payload = {
            resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/tirage',
            commitAction: 'SET_CALENDRIERS'
          }
        }
        
        this.$store.dispatch('association/fetchAssociationactivite', payload)
        .then((res) => {
          let calendar = res.data.data
          let lots = []
          let newAgsArray = this.agsArrays.map((ag) =>({
            value: ag.value,
            limit: ag.limit,
            lots: [],
            amount: ag.amount
          }))
          
          // Retrieve lots from calendar - Long live ES6 !!!
          let ind = 0
          calendar.forEach((item) => {
            if(item.cagnote){
              newAgsArray[ind].amount = item.cagnote

              ind ++
            }
            
            lots.push(...item.beneficiaires)
          })
          // Sorting lots by ag date to increase performance in lot attribution
          lots.sort((lot1, lot2) => (lot1.date_bouffe > lot2.date_bouffe) ? 1 : -1)
          
          // Put each lot in its bucket
          lots.forEach((lot) => {
              newAgsArray[newAgsArray.findIndex((ag) => { return ag.value === lot.date_bouffe })].lots.push(lot)
          })
          // Commit lots to store
          this.calendarAmounts = []
          this.agsArraysAmounts = []
          this.calendarStatus = []

          this.agsArrays = Array.from(newAgsArray)

          let $ind = 0
          let amount = 0
          this.agsArrays.forEach(ag=>{

              this.calendarAmounts.push(0)
              this.agsArraysAmounts.push(ag.amount)

              if($ind == this.agsArrays.length - 1){
                this.calendarStatus.push(true)

                ag.lots.forEach(lot=>{
                  amount += lot.montant
                })

                ag.amount = amount
              }

              else{
                this.calendarStatus.push(false)
              }

              $ind ++
          })
          this.$store.commit('association/SET_LOTS', lots)
          // No lots remaining
          this.remainingLots = []
          this.unsplashLoading('teken')
        })
        .catch((error) => window.console.error(error))
      },

      assignLots() {
        let association_id = this.$store.state.association.currentAssociation.id
        let tontine_id = this.activity.Tontine.id
        let data = []
        let payload = {}

        if(this.tontineType == 'FIXE' || (this.tontineType == 'VARIABLE' && this.activity.Tontine.part_cotisation == 1)) {
          let payloadData = []
          this.agsArrays.forEach((bucket) => {
            let bucketLots = bucket.lots.map((lot) => ({
              id: lot.id,
              montant: lot.montant,
              date_bouffe: bucket.value,
              created_by: lot.created_by,
              date_created: lot.date_created,
              updated_by: lot.updated_by,
              date_updated: lot.date_updated,
              tontines_id: lot.tontines_id,
              comptes_id: lot.comptes_id,
              echeanciers_id: lot.echeanciers_id,
              etat: lot.etat,
              membre: lot.membre
            }))
            payloadData.push(...bucketLots)
          })

          data = Array.from(payloadData);

          if(this.tontineType == 'FIXE'){
            payload = {
              resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/assignation',
              commitAction: 'SET_BENEFICIAIRES',
              data: {
                lots: data
              }
            }
          }
          else{
            payload = {
              resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/tontinevariable/unique/assignation',
              commitAction: 'SET_BENEFICIAIRES',
              data: {
                lots: data
              }
            }
          }
        }
        else {
          let payloadData = []
          this.agsArrays.forEach((bucket) => {
            let correspondingLot = this.$store.state.association.lots.find((lot) => lot.membre === bucket.lot.member)
            correspondingLot = {
              id: correspondingLot.id,
              montant: bucket.lot.amount,
              date_bouffe: bucket.value,
              created_by: correspondingLot.created_by,
              date_created: correspondingLot.date_created,
              updated_by: correspondingLot.updated_by,
              date_updated: correspondingLot.date_updated,
              tontines_id: correspondingLot.tontines_id,
              comptes_id: correspondingLot.comptes_id,
              echeanciers_id: correspondingLot.echeanciers_id,
              etat: correspondingLot.etat,
              membre: correspondingLot.membre,
            }
            payloadData.push(correspondingLot);
          })

          data = Array.from(payloadData);

          payload = {
            resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/assignation',
            commitAction: 'SET_BENEFICIAIRES',
            data: {
              lots: data
            }
          }
        }

        this.$store.dispatch('association/postRequest', payload)
        .then(() => {
          this.unsplashLoading('forward')
          this.$emit('selectedTab', 3)
        })
        .catch((error) => window.console.error(error))
      }
    },

    created() {
      if(localStorage.getItem('activity_id') !== null) {

        EventBus.$emit('loader', true)

        let association_id = this.$store.state.association.currentAssociation.id
        let tontine_id = this.activity.Tontine.id
        this.tontineType = this.activity.Tontine.type

        let payload = {
          resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/lots',
          commitAction: 'SET_LOTS'
        }
        this.$store.dispatch('association/fetchAssociationactivite', payload)
        .then((res1) => {
          let tontine_lots = res1.data.data
          // If the tontine is fixed allocated
          if(this.tontineType == 'FIXE') {
            let payload = {
              resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/calendrier',
              commitAction: 'SET_CALENDRIERS'
            }
            this.$store.dispatch('association/fetchAssociationactivite', payload)
            .then((res2) => {
              // Filter general assemblies upon the current tontines
              let calendar = res2.data.data
              let remainingLots = Array.from(tontine_lots)

              calendar.forEach((item) => {
                // Lots of the tontine calendar date
                let itemLots = tontine_lots.filter((lot) => {return item.date_bouffe === lot.date_bouffe})

                // Remove those lots from the remaining array
                remainingLots = remainingLots.filter((lot) => {
                  return itemLots.findIndex( (itemLot) => {
                    return itemLot.date_bouffe == lot.date_bouffe
                  }) < 0
                })

                // Add item to the corresponding bucket
                this.agsArrays.push({
                  value: item.date_bouffe,
                  lots: itemLots,
                  limit: item.bouffent
                })
              })
              // Set remaining lots
              this.remainingLots = remainingLots
              EventBus.$emit('loader', false)
              this.isReady = true
            })
            .catch((error) => {
              this.isReady = true
              EventBus.$emit('loader', false)
              this.$vs.notify({
                  position: 'top-center',
                  text: error,
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
              })
            })
          }

          else if(this.tontineType == 'VARIABLE' && this.activity.Tontine.part_cotisation == 1) {
            let payload = {
              resourceUrl: '/api/association/' + association_id + '/tontine/' + tontine_id + '/tontinevariable/unique/calendrier',
              commitAction: 'SET_CALENDRIERS'
            }
            this.$store.dispatch('association/fetchAssociationactivite', payload)
            .then((res2) => {
                // Filter general assemblies upon the current tontines
                let calendar = res2.data.data
                let remainingLots = Array.from(tontine_lots)

                calendar.forEach((item) => {
                  // Lots of the tontine calendar date
                  let itemLots = tontine_lots.filter((lot) => {return item.date_bouffe === lot.date_bouffe})

                  // Remove those lots from the remaining array
                  remainingLots = remainingLots.filter((lot) => {
                    return itemLots.findIndex( (itemLot) => {
                      return itemLot.date_bouffe == lot.date_bouffe
                    }) < 0
                  })

                  /* 0. */
                  // Add item to the corresponding bucket
                  this.agsArrays.push({
                    value: item.date_bouffe,
                    lots: itemLots,
                    limit: item.bouffent,
                    amount: item.cagnote
                  })

                  this.agsArraysAmounts = []
                  this.agsArrays.forEach(element=>{
                    this.agsArraysAmounts.push(element.amount)
                  })

                  this.calendarStatus = []
                  this.calendarAmounts = []
                  let $inc = 0

                  if(remainingLots.length){
                    this.agsArrays.forEach(element=>{
                      this.calendarAmounts.push(element.amount)

                      if($inc == 0){
                        this.calendarStatus.push(true)
                      }

                      else{
                        this.calendarStatus.push(false)
                      }
                      
                      $inc++
                    })
                  }
                  else{
                    let amount = 0

                    this.agsArrays.forEach(element => {
                      this.calendarAmounts.push(0)

                      if($inc == this.agsArrays.length - 1){
                        this.calendarStatus.push(true)
                      }

                      else{
                        this.calendarStatus.push(false)
                      }

                      if($inc == this.agsArrays.length - 1){
                        element.lots.forEach(lot=>{
                          amount += lot.montant
                        })
                        this.agsArrays[this.agsArrays.length - 1].amount = amount
                      }
                      $inc++
                    })
                  }
                })
                  
                // Set remaining lots
                this.remainingLots = remainingLots
                EventBus.$emit('loader', false)
                this.isReady = true
            })
            .catch((error) => {
              this.isReady = true
              EventBus.$emit('loader', false)
              this.$vs.notify({
                  position: 'top-center',
                  text: error,
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
              })
            })
          }

          // If tontine is variable allocated
          else if(this.tontineType == 'VARIABLE' && this.activity.Tontine.part_cotisation == 0) {
            this.membersInvolved = tontine_lots.map((lot) => ({
              member: lot.membre,
            }))
            this.agsArrays =
              this.ags.filter((ag) => { return ag.date_ag >= this.tontineStartingDate })
                      .sort((ag1, ag2) => ag1.date_ag - ag2.date_ag)
                      .slice(0, this.activity.Tontine.date_fin)
                      .map((ag) => {
                        let correspondingLot = tontine_lots.find((lot) => lot.date_bouffe === ag.date_ag)
                        let found = correspondingLot !== undefined
                        return {
                          value: ag.date_ag,
                          lot: {
                            member: found ? correspondingLot.membre : '',
                            amount: found ? correspondingLot.montant : 0
                          }
                      }})

            this.isReady = true; EventBus.$emit('loader', false)
          }

        })
        .catch((error) => window.console.error(error))

      }
      this.devise = this.currentAssociation.devise
    }
  }
</script>

<style lang="scss">
  .vx-card .vx-card__collapsible-content .vx-card__body {
    padding: 1rem .5rem;
  }
  
  select {
        padding-right: 1.875em;
        cursor: pointer;
        /* height: 40px; */
        padding-bottom: 8px;
        border-radius: 4px;
        /*  appearance: none; */
        position: relative;
        background-color: #fff;
        /* font-size: 100%; */
        padding: .5em .5em;
        border: 1px solid #d2d2d2;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: Montserrat, Helvetica, Arial, sans-serif;
        color: #626262;
    }

.swiper {
  // height: 300px;
  width: 100%;

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  background-color: white;
  transition: all 0.7s;
}

.vx-card__title {
  text-align: center;
  flex: auto;
  justify-content: center;
  h4 {
    font-size: 1rem!important;
  }

}

.vx-card__body {
  text-align: center;
  flex: auto;
  justify-content: center;
}

.swiper-button-next, .swiper-button-prev {
  top: 18%!important
}
}
</style>
<style scoped>
  .swiper-button-next,
    .swiper-button-prev {
        margin-top: 25px;
        margin-left: -5px;
        margin-right: -5px;
        position: absolute;
        top: 50%;
        width: 27px;
        height: 20px;
        z-index: 10;
        border-radius: 50%;
        background-color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.04);
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 8px 0 rgba(0, 0, 0, 0.20);
    }
    .swiper-button-next:hover,
    .swiper-button-prev:hover {
        background-color: rgba(0, 0, 0, 0.02) !important;
    }
    [dir] .swiper-button-next,
    [dir] .swiper-button-prev {
        padding: 17px;
        background-size: 30% 30%;
    }

    .inactiveCalendar {
      opacity: 0.6 !important;
      pointer-events: none
    }

    .textColor{
      color: rgba(0, 0, 0, 0.7) !important;
    }

    .beneficiary-chip .con-vs-chip{
      display:  -webkit-box !important;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      font-size: .7rem;
      -webkit-box-pack: start !important;
    }

</style>
