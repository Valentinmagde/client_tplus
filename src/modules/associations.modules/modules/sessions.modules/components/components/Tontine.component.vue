<template>
<div>
    <div class="ml-4 mr-4">
        <vx-card no-shadow class="mb-6 pb-6" :title="$t('attributionsLotsTontine') | CAPITALIZE " />
    </div>

    <div class="ml-4 mr-4">
        <div 
            v-if="members.length == 0" 
            class="flex flex-wrap-reverse items-center data-list-btn-container">
            <!-- ADD NEW -->

        </div>
        <vx-card no-shadow v-if="!members.length" class="mb-base">
            <p>{{$t('noElementFound')}}</p>
        </vx-card>
    </div>

    <!--dialgue de suppression du lot secondaire-->
    <vs-popup 
        classContent="popup-example" 
        :title="$t('deleteConfirmTitle')" 
        :active.sync="popupActivo2">
        <p>{{$t('deleteConfirm')}}</p>
        <vs-divider />
        <div class="vx-row w-full justify-end">
            <vs-button color="warning" @click="popupActivo2=false" type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;
            <vs-button 
                class="ml-3 vs-con-loading__container" 
                color="danger" 
                ref="loadableButton" 
                id="button-with-loading" 
                :disabled="!loader" 
                @click.stop="deleteLot">
                {{$t('delete')}}
            </vs-button>
        </div>
    </vs-popup>

    <!--desallouer du lot principal-->
    <vs-popup 
        classContent="popup-example" 
        :title="$t('deleteConfirmTitle')" 
        :active.sync="popupActivo21">
        <p>{{$t('deleteConfirm')}}</p>
        <vs-divider />
        <div class="vx-row w-full justify-end">
            <vs-button 
                color="warning" 
                @click="() => { 
                    objectToMap = null; 
                    popupActivo21=false
                }" 
                type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;
            <vs-button 
                class="ml-3 vs-con-loading__container" 
                color="danger" 
                ref="loadableButton" 
                id="button-with-loading" 
                :disabled="!loader" 
                @click.stop="deallocate">
                {{$t('deallocate')}}
            </vs-button>
        </div>
    </vs-popup>

    <!-- FORMULAIRE TONTINE VARIABLE-->
    <data-view 
        @closeSidebar="toggleDataSidebar" 
        :isSidebarActive="addNewDataSidebar" 
        :data="emptyData">
        <h4 slot="title">{{ $t('attributionsLotsTontine')}}</h4>

        <template 
            v-if="lazyDataForTontines.length" 
            slot="component">
            <!-- Membres -->
            <p class="vs-input--label mt-5">{{$t('members')+ ' '+'*'}}</p>
            <v-select 
                label="text" 
                :options="formatDataUser(lazyDataForTontinesUsers)" 
                v-model="multipleValue.member" 
                class="w-full" />

            <!-- Montant -->
            <p class="vs-input--label mt-5">{{$t('Amount')+ ' '+'*'}}</p>
            <money v-model="multipleValue.montant" class="money-input w-full p-3" v-bind="money" />

        </template>

        <vs-button class="mr-6" type="border" color="danger" @click="canceling">
            {{ $t('cancel')}}
        </vs-button>

        <vs-button 
            ref="loadableButton" 
            class="vs-con-loading__container" 
            id="button-with-loading-variable" 
            :disabled="multipleValue.member == '' || multipleValue.montant == '' " 
            @click="createNewLot('button-with-loading-variable')">
            {{ $t('allocate')}}
        </vs-button>

    </data-view>

    <!-- FORMULAIRE D'ASSIGNATION DE LOT secondaire -->
    <data-view 
        @closeSidebar="toggleDataSidebarforSecondAssing" 
        :isSidebarActive="addNewDataSidebarforSecondAssing" 
        :data="emptyData">
        <h4 slot="title">{{ $t('attributionLotPSecondaire')}}</h4>

        <template slot="component">
            <!-- Membre -->
            <p class="vs-input--label mt-5">{{$t('members')+ ' '+'*'}}</p>
            <v-select 
                label="text" 
                :options="formatDataUser(lazyDataForTontinesUsers,true)" 
                v-model="multipleValue.member" 
                class="w-full" />

            <!-- Montant -->
            <p class="vs-input--label mt-5">{{$t('Amount')+ ' '+'*'}}</p>
            <money 
                v-model="multipleValue.cagnote" 
                @input='notGreaterThanCagnoteVariable' 
                class="money-input w-full p-3" v-bind="money" />

            <!-- Montant Enchère-->
            <p class="vs-input--label mt-5">{{$t('montantEnchere')+ ' '+'*'}}</p>
            <money 
                v-model="multipleValue.montant_enchere" 
                @input='notGreaterThanCagnoteVariable' 
                class="money-input w-full p-3" 
                v-bind="money" />

            <!-- Interet -->
            <p class="vs-input--label mt-5">{{$t('interests')+ ' '+'*'}}</p>
            <money 
                v-model="multipleValue.moneyLot" 
                class="money-input w-full p-3" 
                v-bind="money" />

            <!-- DATE DE RETRAIT -->
            <p class="mt-4">
                {{$t('refundDate')}} *:
            </p>
            <v-select 
                label="text" 
                :options="selectAgsOptions" 
                v-model="multipleValue.date_retrait" 
                class="w-full" />
        </template>

        <vs-button 
            class="mr-6" 
            type="border" 
            color="danger" 
            @click="() => { 
                addNewDataSidebarforSecondAssing=false; 
                resetObjectToMap()
            }">
            {{ $t('cancel')}}
        </vs-button>

        <vs-button 
            ref="loadableButton" 
            class="vs-con-loading__container" id="button-with-loading-secondaire" 
            :disabled="!(multipleValue.member && multipleValue.montant_cagnote && multipleValue.date_retrait)" 
            @click="() => {
                addNewDataSidebarforSecondAssing=false;
                saveLotSecondaire('button-with-loading-secondaire');
            }">
            {{ $t('save')}}
        </vs-button>

    </data-view>

    <!-- FORMULAIRE D'ASSIGNATION DE LOT -->
    <data-view 
        @closeSidebar="toggleDataSidebarforAssingFirstLot" 
        :isSidebarActive="addNewDataSidebarforAssingFirstLot" 
        :data="emptyData">
        <h4 slot="title">{{ $t('attributionLotPrincipal')}}</h4>

        <template 
        v-if="objectToMap"
        slot="component">
            <!-- Membre -->
            <p class="vs-input--label mt-5">{{$t('members')+ ' '+'*'}}</p>
            <v-select 
                label="text" 
                :options="formatDataUser(lazyDataForTontinesUsers)" 
                v-model="multipleValue.member" 
                class="w-full" />

            <!-- Montant -->
            <p class="vs-input--label mt-5">{{$t('Amount')+ ' '+'*'}}</p>
            <money 
                v-model="multipleValue.montant_cagnote" 
                :class="{ 
                    disabled: objectToMap.type == 'FIXE' , 'money-input': true ,'w-full':true, 'p-3':true 
                }" 
                @input='notGreaterThanCagnote' 
                v-bind="money" />

            <!-- Montant Enchère-->
            <p class="vs-input--label mt-5">{{$t('montantEnchere')+ ' '+'*'}}</p>
            <money 
                v-model="multipleValue.montant_enchere" 
                @input='notGreaterThanCagnote' 
                class="money-input w-full p-3" 
                v-bind="money" />
        </template>

        <vs-button 
            class="mr-6" 
            type="border" 
            color="danger" 
            @click="() => { 
                addNewDataSidebarforAssingFirstLot=false; 
                resetObjectToMap()
            }">
            {{ $t('cancel')}}
        </vs-button>

        <vs-button 
            ref="loadableButton" 
            class="vs-con-loading__container" 
            id="button-with-loading-principal" 
            :disabled="!(multipleValue.member &&  multipleValue.montant_cagnote)" 
            @click="() => {
                addNewDataSidebarforAssingFirstLot=false;
                saveLotPrincipal('button-with-loading-principal')
            }">
            {{ $t('save')}}
        </vs-button>

    </data-view>

    <!-- Tableau des bénéficiaires -->
    <div v-if="displayBeneficiaires.length" class="vx-col ml-4 mr-4">
        <vx-card :title="$t('beneficiaire') | Capitalize">
            <div slot="no-body" class="mt-4">
                <vs-table :data="members" class="table-dark-inverted overflow-auto" style="max-height: 21rem">
                    <template slot="thead">
                        <vs-th sort-key="date_created">{{$t('beneficiaire') | CAPITALIZE }} </vs-th>
                        <vs-th sort-key="firstName">{{ 'Tontine' | CAPITALIZE }}</vs-th>
                        <vs-th> {{$t('allocatedAmount') | CAPITALIZE }} </vs-th>
                        <vs-th> {{$t('receivedAmount') | CAPITALIZE }} </vs-th>
                        <vs-th>{{$t('status') | CAPITALIZE }}</vs-th>
                        <vs-th sort-key="firstName">{{ $t('actions') | CAPITALIZE }}</vs-th>
                    </template>
                    <template slot-scope="{data}" class="w-full">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in displayBeneficiaires" class="cursor-pointer">

                            <vs-td>
                                <span>{{ tr.username }}</span>
                            </vs-td>
                            <vs-td>
                                <p class="product-name truncate">{{tr.tontine}}</p>
                            </vs-td>

                            <vs-td>
                                <span :class="{redtextclass: tr.montant < 0}">
                                    {{ ( tr.montant) | formatMoney(devise) }}
                                </span>
                            </vs-td>
                            <vs-td>
                                <span :class="{redtextclass: tr.montant_recu < 0}">
                                    {{ ( tr.montant_recu) | formatMoney(devise) }}
                                </span>
                            </vs-td>
                            <vs-td>
                                <vx-tooltip 
                                    v-if="tr.montant == tr.montant_recu" :text="$t('cloturer')" 
                                    position="bottom" 
                                    class="inline-block">
                                    <vs-radio 
                                        class="flex mb-1 items-center" 
                                        color="success" 
                                        :vs-name="`${indextr}`">
                                    </vs-radio>
                                </vx-tooltip>
                                <vx-tooltip v-else :text="$t('encours')" position="bottom" class="inline-block">
                                    <vs-radio class="flex mb-1 items-center" color="warning" :vs-name="`${indextr}`">
                                    </vs-radio>
                                </vx-tooltip>
                            </vs-td>

                            <vs-td class="whitespace-no-wrap" :data="data[indextr]">

                                <vx-tooltip 
                                    :text="$t('deallocate')" 
                                    position="bottom" 
                                    class="inline-block" 
                                    v-if="(tr.type == 'principal' && tr.montant_recu == 0 ) && (roles.includes('Administrateur') || roles.includes('Financier')) 
                                        && !(tr.type_tontine == 'FIXE' && tr.attribution_cagnote == 'TIRAGE')" 
                                    @click.native="() => {
                                        objectToMap = tr;
                                        popupActivo21 = true
                                    }"
                                >
                                    <feather-icon 
                                        icon="TrashIcon" 
                                        svgClasses="w-5 h-5 hover:text-danger stroke-current" />
                                </vx-tooltip>

                                <vx-tooltip 
                                    :text="$t('delete')" 
                                    position="bottom" 
                                    class="inline-block" v-if="(tr.type != 'principal' && tr.montant_recu == 0) && (roles.includes('Administrateur') || roles.includes('Financier'))
                                        && !(tr.type_tontine == 'FIXE' && tr.attribution_cagnote == 'TIRAGE')" 
                                    @click.native="() => {
                                        compte = tr;
                                        popupActivo2 = true
                                    }"
                                >
                                    <feather-icon 
                                        icon="TrashIcon" 
                                        svgClasses="w-5 h-5 hover:text-danger stroke-current" />
                                </vx-tooltip>

                                <vx-tooltip 
                                    @click.native="() => canBeDelete()" :text="$t('cannotProcess')" 
                                        position="bottom" 
                                        class="inline-block text-gray-100" 
                                        v-if="(tr.type != 'principal' && tr.montant_recu != 0 ) && (roles.includes('Administrateur') || roles.includes('Financier'))
                                        && !(tr.type_tontine == 'FIXE' && tr.attribution_cagnote == 'TIRAGE')">
                                    <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 stroke-current" />
                                </vx-tooltip>

                                <ejs-tooltip v-if="!(roles.includes('Administrateur') || roles.includes('Financier'))" 
                                    ref="tooltip" :content="$t('noAccess')" 
                                    position="bottom" 
                                    class="mr-2 inline-block">
                                    <feather-icon 
                                        icon="HelpCircleIcon" 
                                        svgClasses="w-4 h-4 hover:text-success stroke-current" 
                                        class="ml-1 mt-1" />
                                </ejs-tooltip>

                            </vs-td>

                        </vs-tr>
                    </template>
                </vs-table>
            </div>

        </vx-card>
    </div>

    <!-- Tableau d'attribution des lots tontine -->
    <div v-if="showTontine(members).length" class="vx-col mt-10 ml-4 mr-4">
        <vx-card :title="$t('attributionsLotsTontine') | Capitalize" class="mb-base">
            <div slot="no-body" class="mt-4">
                <vs-table :data="showTontine(members)" 
                    class="table-dark-inverted overflow-auto" 
                    style="max-height: 21rem">
                    <template slot="thead">
                        <vs-th sort-key="firstName">{{ 'Tontine' | CAPITALIZE }}</vs-th>
                        <vs-th> {{$t('amountOfPot') | CAPITALIZE }} </vs-th>
                        <vs-th> {{$t('receivedAmount') | CAPITALIZE }} </vs-th>
                        <vs-th sort-key="order_status">{{$t('actions') | CAPITALIZE }}</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="cursor-pointer">
                            <vs-td>
                                <p class="product-name truncate">{{tr.name}}</p>
                            </vs-td>

                            <vs-td>
                                <span :class="{redtextclass: tr.cagnote < 0}">
                                    {{ (tr.cagnote) | formatMoney(devise) }}
                                </span>
                            </vs-td>

                            <vs-td>
                                <span :class="{redtextclass: tr.montant_verse < 0}">
                                    {{ (tr.montant_verse) | formatMoney(devise) }}
                                </span>
                            </vs-td>

                            <!-- Actions tontines fixe -->
                            <vs-td 
                                class="whitespace-no-wrap" 
                                :data="data[indextr]" v-if="data[indextr].type == 'FIXE'  && (roles.includes('Administrateur') || roles.includes('Financier'))">
                                <!-- Attribuer lot principal -->
                                <template v-if="data[indextr].canAssignMainLot ">
                                    <vx-tooltip 
                                        :text="$t('attributionLotPrincipal')" 
                                        position="top" 
                                        class="inline-block mr-2" v-if="displayWhen(data[indextr])">
                                        <vs-icon 
                                            icon-pack="streameline" 
                                            @click.stop="() => { 
                                                udpateMapData(data[indextr]); 
                                                changeDataWhenSeclectTontineInForm({id:data[indextr].idTontine}); 
                                                addNewDataSidebarforAssingFirstLot = true; 
                                            }" 
                                            icon="icon-monetization-user-bag" 
                                            style="font-size: 18px" 
                                            class="hover:text-primary" 
                                            size="small">
                                        </vs-icon>
                                    </vx-tooltip>
                                </template>

                                <!-- Attribuer lot secondaire -->
                                <vx-tooltip 
                                    :text="$t('attributionLotPSecondaire')" 
                                    position="bottom" 
                                    class="inline-block ">
                                    <vs-icon 
                                        icon-pack="streameline" 
                                        @click.stop="() => { 
                                            udpateMapData(data[indextr]); 
                                            changeDataWhenSeclectTontineInForm({id:data[indextr].idTontine}); 
                                            addNewDataSidebarforSecondAssing = true 
                                        }" 
                                        icon="icon-cash-user-man-message" 
                                        style="font-size: 18px" 
                                        class="hover:text-primary" 
                                        size="small">
                                    </vs-icon>
                                </vx-tooltip>
                            </vs-td>

                            <!-- Actions tontines variables -->
                            <vs-td 
                                class="whitespace-no-wrap" 
                                :data="data[indextr]" 
                                v-else-if="roles.includes('Administrateur') || roles.includes('Financier')">
                                <vx-tooltip 
                                    :text="$t('assignLot')" 
                                    position="bottom" 
                                    class="inline-block ">
                                    <vs-icon 
                                        icon-pack="streameline" 
                                        @click.stop="() => { 
                                            udpateMapData(data[indextr]); 
                                            changeDataWhenSeclectTontineInForm({id:data[indextr].idTontine}); 
                                            addNewDataSidebar = true 
                                        }" 
                                        icon="icon-cash-payment-bag-1" 
                                        style="font-size: 18px" 
                                        class="hover:text-primary" 
                                        size="small">
                                    </vs-icon>
                                </vx-tooltip>
                            </vs-td>

                            <vs-td v-if="!(roles.includes('Administrateur') || roles.includes('Financier'))">
                                <ejs-tooltip 
                                    ref="tooltip" 
                                    :content="$t('noAccess')" 
                                    position="bottom" 
                                    class="mr-2 inline-block">
                                    <feather-icon 
                                        icon="HelpCircleIcon" 
                                        svgClasses="w-4 h-4 hover:text-success stroke-current" 
                                        class="ml-1" />
                                </ejs-tooltip>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>

        </vx-card>
    </div>

    <div class="flex flex-wrapper mt-6 ml-4">
        <vs-button 
            type="border" 
            class="mr-6" 
            id="button-loading" 
            @click.native="previous(2)">
            {{$t('previous')}}
        </vs-button>
        <vs-button @click.native="next(4)">{{$t('next')}}</vs-button>
    </div>
</div>
</template>

<script>
 //Fonctions

 import sidebar from '../../services/mixins/sidebar'
 import dataProprety from '../../services/mixins/data'
 import vSelect from 'vue-select'
 import {
     Money
 } from 'v-money'
 import {
     EventBus
 } from '@/services/EventBus.js'

 import flatPickr from 'vue-flatpickr-component';
 import 'flatpickr/dist/flatpickr.css';

 import {
     getAllActivity,
     postAssignLotTontitne,
     deleteLotSecondaire,
     postAssignLotPrincipal,
     postDesasignerLotPrincipal
 } from '../../services/api'

 const display = (er) => window.console.log(er)

 const moveTontineWithAttributDiffEncher = (tab) => tab.filter(e =>
     (e.Tontine.type == "VARIABLE" || (e.Tontine.type == "FIXE" && e.Tontine.attribution_cagnote == "ENCHERE"))
 )

 const moveTontineWithVariable = (tab) => tab.filter(e => e.Tontine.type == "VARIABLE")

 export default {
     components: {
         flatPickr,
         Money,
         'v-select': vSelect,
     },
     mixins: [sidebar, dataProprety],
     props: {
         uuid: {
             required: true
         },
         roles: {
             required: true
         }
     },
     computed: {
         displayBeneficiaires() {
             let renderTab = []
             this.members.filter(e => e.beneficiaires.length)
                 .map(e => e.beneficiaires.map(t => renderTab.push({
                     username: t.membre,
                     lot: t,
                     membres_id: t.membres_id,
                     montant: t.montant,
                     montant_recu: t.montant_recu,
                     tontine: e.name,
                     lotId: t.id,
                     tontine_id: e.idTontine,
                     attribution_cagnote: e.attribution_cagnote,
                     type: t.type,
                     type_tontine: e.type
                 })))
             return renderTab.filter(e => e.montant != 0)
         },
         selectAgsOptions() {
             let prochaines_ags = []
             let ags = this.$store.state.association.ags
             if (ags != null)
                 ags.forEach(element => {
                     if (element.etat != 'past' && element.etat != 'cloture')
                         prochaines_ags.push(element)
                 })

             if (prochaines_ags.length > 0)
                 return prochaines_ags.map(ag => ({
                     id: ag.id,
                     text: this.$options.filters.dateTime(ag.date_ag),
                     value: ag.date_ag
                 }))
         },
         desabled() {
             return (this.multipleValue.tontine.id && this.montant != 0 && this.multipleValue.member.id) ? false : true
         },
         isValide() {
             return (this.multipleValue.tontine != '' && this.montant != '' && this.multipleValue.member != '') ? false : true
         }
     },
     created() {
         this.devise = this.$store.state.association.currentAssociation.devise
         this.fetch()
     },
     methods: {
         deleteLot() {
             this.popupActivo2 = false
             deleteLotSecondaire({
                     tontId: this.compte.tontine_id,
                     lotId: this.compte.lotId
                 })
                 .then(() => this.fetch())
                 /* eslint-disable no-unused-vars */
                 .catch((err) => window.console.log(err))
         },

         deallocate() {
             this.popupActivo21 = false

             const lot = this.objectToMap.lot

             postDesasignerLotPrincipal({
                     lot,
                     assId: this.$store.state.association.currentAssociation.id,
                     idTontine: this.objectToMap.tontine_id
                 })
                 .then(() => {
                     this.fetch();
                     this.compte = null
                 })
                 /* eslint-disable no-unused-vars */
                 .catch((err) => window.console.log(err))
         },
         openLoadingContained(id) {
             this.loader = false
             this.$vs.loading({
                 background: this.backgroundLoading,
                 color: this.colorLoading,
                 container: `#${id}`,
                 scale: 0.45
             });
         },

         notGreaterThanCagnote() {

             if (this.multipleValue.montant_cagnote > this.objectToMap.montant_cagnote)
                 this.multipleValue.montant_cagnote = this.objectToMap.montant_cagnote
         },

         notGreaterThanCagnoteVariable() {

             if (this.multipleValue.cagnote > this.objectToMap.cagnote)
                 this.multipleValue.cagnote = this.objectToMap.cagnote
         },

         showTontine(tab) {
             return tab.filter(e =>
                 (e.type == "VARIABLE" || (e.type == "FIXE" && e.attribution_cagnote == "ENCHERE"))
             )
         },
         activityToShow(e) {
             return (e.type == "VARIABLE" || (e.type == "FIXE" && e.attribution_cagnote == "ENCHERE")) ? true : false
         },

         udpateMapData(data) {
             this.objectToMap = data
             this.multipleValue = {
                 member: '',
                 tontine: '',
                 money: '',
                 montant_cagnote: data.montant_cagnote,
                 cagnote: 0,
                 montant_verse: data.montant_verse,
                 date_retrait: '',
                 moneyLot: ''
             }
         },

         disabledAssign(item) {
             const newObject = item.Tontine.beneficiere.filter(e => e.type == 'principal')

             return (item.Tontine.calendrier && (newObject.length == item.Tontine.calendrier)) ? false : true
         },

         displayWhen(data) {
             return ((data.type == 'FIXE' && data.attribution_cagnote == 'ENCHERE') || data.type == 'VARIABLE')
         },

         canBeDelete() {
             this.$vs.notify({
                 position: 'top-center',
                 text: this.$t('cannotProcess'),
                 iconPack: 'feather',
                 icon: 'icon-alert-circle',
                 color: 'danger'
             })
         },
         fetch() {
             //Loader
             EventBus.$emit('loader', true)
             getAllActivity({
                     assId: this.$store.state.association.currentAssociation.id,
                     agId: this.uuid
                 })
                 .then(e => {
                     this.lazyDataForTontines = e.data.data
                     this.lazyDataForTontinesUsers = []
                     return e.data.data
                 })
                 .then(e => e.map(item => ({
                     name: item.nom,
                     etat: item.etat,
                     type: item.Tontine.type,
                     attribution_cagnote: item.Tontine.attribution_cagnote,
                     id: item.id,
                     activites_id: item.Tontine.activites_id,
                     cagnote: item.Tontine.cagnote,
                     montant_cagnote: item.Tontine.montant_cagnote,
                     canAssignMainLot: this.disabledAssign(item),
                     montant_verse: item.Tontine.beneficiere.reduce((acc, val) => acc + val.montant_recu, 0),
                     idTontine: item.Tontine.id,
                     beneficiaires: (item.Tontine.beneficiere) ? [...item.Tontine.beneficiere] : [],
                     lots: [...item.Tontine.lots],
                     calendrier: item.Tontine.calendrier
                 })))
                 .then(e => {
                     let render = [];
                     e.map(e => {
                         render.push([...e.beneficiaires]);
                     })
                     this.receivers = render
                     return e
                 })
                 .then(e => {

                     EventBus.$emit('loader', false)
                     return e
                 })
                 .then(e => this.members = e)
                 .catch(() => EventBus.$emit('loader', false))
         },

         // Création d'un lot
         createNewLot(id) {
             this.openLoadingContained(id)

             this.addNewDataSidebar = false
             let ag_courante = (this.$store.state.association.ags) ? this.$store.state.association.ags.find(e => e.etat == "current") : null;
             const foundMember = this.lazyDataForTontinesUsers.find(e => e.membres_id == this.multipleValue.member.id)

             const dataToSave = {
                 comptes_id: foundMember.comptes_id,
                 date_bouffe: ag_courante ? ag_courante.date_ag: null,
                 membre: this.multipleValue.member.text,
                 membres_id: this.multipleValue.member.id,
                 montant: this.multipleValue.montant,
                 tontines_id: foundMember.tontines_id,
                 montant_recu: 0
             }

             postAssignLotTontitne({
                     assId: this.$store.state.association.currentAssociation.id,
                     tontine: {
                         idTontine: foundMember.tontines_id,
                         user: dataToSave,
                     },
                     typeof: 'variable',
                     enchere: 0
                 })
                 .then(() => {
                     this.loader = true
                     this.$vs.loading.close(`#${id} > .con-vs-loading`)
                     this.resetObjectToMap()
                     this.fetch()
                     this.$vs.notify({
                         position: 'top-center',
                         text: this.$t('notifContent'),
                         iconPack: 'feather',
                         icon: 'icon-alert-circle',
                         color: 'success'
                     })
                 })
                 /* eslint-disable no-unused-vars */
                 .catch(e => {
                     this.loader = true
                     this.$vs.loading.close(`#${id} > .con-vs-loading`)
                 })
         },

         /* eslint-disable no-unused-vars */
         saveLotPrincipal(id) {
             let ag_courante = (this.$store.state.association.ags) ? this.$store.state.association.ags.find(e => e.etat == "current") : null;
             const lot = this.objectToMap.lots.find(e => e.id == this.multipleValue.member.lots_id)
             
             lot.date_bouffe = ag_courante ? ag_courante.date_ag: null

             postAssignLotPrincipal({
                     lot: lot,
                     enchere: this.multipleValue.montant_enchere,
                     assId: this.$store.state.association.currentAssociation.id,
                     tontine: this.objectToMap
                 })
                 .then(() => {
                     this.loader = true
                     this.$vs.loading.close(`#${id} > .con-vs-loading`)
                     this.resetObjectToMap()
                     this.fetch()
                     this.$vs.notify({
                         position: 'top-center',
                         text: this.$t('notifContent'),
                         iconPack: 'feather',
                         icon: 'icon-alert-circle',
                         color: 'success'
                     })

                 })
                 .catch(e => {
                     this.loader = true
                     this.$vs.loading.close(`#${id} > .con-vs-loading`)
                     display(e)
                     this.$vs.notify({
                         position: 'top-center',
                         text: this.$t('noCash'),
                         iconPack: 'feather',
                         icon: 'icon-alert-circle',
                         color: 'danger'
                     })
                 })
             /*this.openLoadingContained(id)
      const foundMember = this.lazyDataForTontinesUsers.find(e => e.membres_id == this.multipleValue.member.id )

      const dataToSave= {
        comptes_id: foundMember.comptes_id,
        date_bouffe: this.AgEncour().date_ag,
        membre: this.multipleValue.member.text,
        membres_id: this.multipleValue.member.id,
        montant: this.multipleValue.montant_cagnote,
        tontines_id: this.objectToMap.idTontine,
        montant_recu: 0
       }

      postAssignLotTontitne({
          assId:this.$store.state.association.currentAssociation.id,
          tontine: {
            idTontine: this.objectToMap.idTontine,
            user: dataToSave,
          },
          enchere: this.multipleValue.montant_enchere,
          typeof: 'principal',
       })
      .then(() => {
        this.loader = true
        this.$vs.loading.close(`#${id} > .con-vs-loading`)
        this.resetObjectToMap()
        this.fetch()
        this.$vs.notify({
            position:'top-center',
            text: this.$t('notifContent'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'success'
        })


      })
      .catch(e => {
        this.loader = true
        this.$vs.loading.close(`#${id} > .con-vs-loading`)
        display(e)
        this.$vs.notify({
            position:'top-center',
            text: this.$t('noCash'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
        })
      }) */
         },
         saveLotSecondaire(id) {
             this.openLoadingContained(id)
             const foundMember = this.lazyDataForTontinesUsers.find(e => e.membres_id == this.multipleValue.member.id)

             const dataToSave = {
                 comptes_id: foundMember.comptes_id,
                 date_bouffe: this.$store.state.association.currentAssociationAg.date_ag,
                 membre: this.multipleValue.member.text,
                 membres_id: this.multipleValue.member.id,
                 montant: this.multipleValue.cagnote,
                 tontines_id: this.objectToMap.idTontine,
                 montant_recu: 0
             }

             postAssignLotTontitne({
                     assId: this.$store.state.association.currentAssociation.id,
                     tontine: {
                         idTontine: this.objectToMap.idTontine,
                         user: dataToSave,
                     },
                     enchere: this.multipleValue.montant_enchere,
                     interet: this.multipleValue.moneyLot,
                     typeof: 'secondaire',
                     remboursement: this.multipleValue.date_retrait.value
                 })
                 .then(() => {
                     this.loader = true
                     this.$vs.loading.close(`#${id} > .con-vs-loading`)
                     this.resetObjectToMap()
                     this.fetch()
                     this.$vs.notify({
                         position: 'top-center',
                         text: this.$t('notifContent'),
                         iconPack: 'feather',
                         icon: 'icon-alert-circle',
                         color: 'success'
                     })

                 })
                 .catch(e => {
                     this.loader = true
                     this.$vs.loading.close(`#${id} > .con-vs-loading`)
                     display(e)
                     this.$vs.notify({
                         position: 'top-center',
                         text: this.$t('noCash'),
                         iconPack: 'feather',
                         icon: 'icon-alert-circle',
                         color: 'danger'
                     })
                 })

         },

         canceling() {
             this.toggleDataSidebar()
             this.resetObjectToMap()
             this.multipleValue.tontine = '';
             this.multipleValue.montant = 0;
             this.multipleValue.montant_cagnote
             this.multipleValue.member = ''
             this.multipleValue.montant_verse = 0

         },

         allocate() {
             postAssignLotTontitne({
                     assId: this.$store.state.association.currentAssociation.id,
                     tontine: this.objectToMap
                 })
                 .then(e => {
                     display(e);
                     const newData = this.members.map(e => {
                         if (e.internalId == this.objectToMap.internalId)
                             return Object.assign({}, e, {
                                 user: {
                                     etat: 'ok'
                                 }
                             })
                         else
                             return e
                     })
                     this.members = newData
                 })
                 .catch(e => display(e))

             this.montant = 0
             this.resetObjectToMap()
             this.addNewDataSidebarforSecondAssing = false

         },

         changeDataWhenSeclectTontineInForm(event = null) {

             let current = this.members.find(e => e.idTontine == event.id)
             let temp = ['no']
             let render = []

             current.lots.filter(e => e.etat == 'init').map(e => {
                 if (!temp.includes(e.membre)) {
                     temp.push(e.membre)
                     render.push(e)
                 }

             })

             this.lazyDataForTontinesUsers = render

         },
         formatDataTontine(tab, variable = true) {

             if (variable)
                 return (tab && tab.length) ? moveTontineWithVariable(tab)
                     .map(e => ({
                         id: e.Tontine.id,
                         text: e.nom,
                         type: e.Tontine.type,
                         value: e.Tontine.id
                     })) : []

             else
                 return (tab && tab.length) ? moveTontineWithAttributDiffEncher(tab)
                     .map(e => ({
                         id: e.Tontine.id,
                         text: e.nom,
                         type: e.Tontine.type,
                         value: e.Tontine.id
                     })) : []
         },
         //eslint-disable-next-line no-unused-vars
         formatDataUser(tab, remove = false) {
             const render = tab.map(e => ({
                 id: e.membres_id,
                 text: e.membre,
                 value: e.membres_id,
                 comptes_id: e.comptes_id,
                 lots_id: e.id
             }))

             return render;

         },

         accept(id) {

             this.$vs.notify({
                 position: 'top-center',

                 text: this.$t('newSuccessfullyDeleted'),
                 iconPack: 'feather',
                 icon: 'icon-alert-circle',
                 color: 'success'
             })
             id.state = true
             this.resetObjectToMap()
         },
         reject(id) {
             display('reject' + id)
             id.state = false
             this.$vs.notify({
                 position: 'top-center',
                 title: 'warning',
                 text: this.$t('newSuccessfullyDeleted'),
                 iconPack: 'feather',
                 icon: 'icon-alert-circle',
                 color: 'warning'
             })
             this.resetObjectToMap()
         },
         save() {

         },
         resetObjectToMap() {
             this.objectToMap = ''
             this.multipleValue = {
                 member: '',
                 tontine: '',
                 montant_cagnote: '',
                 cagnote: '',
                 money: '',
                 date_retrait: '',
                 montant_verse: '',
                 moneyLot: ''
             }
         },
         toggleDataSidebarforSecondAssing() {
             this.addNewDataSidebarforSecondAssing = !this.addNewDataSidebarforSecondAssing
         },
         toggleDataSidebarforAssingFirstLot() {
             this.addNewDataSidebarforAssingFirstLot = !this.addNewDataSidebarforAssingFirstLot
         },

         openPopup(item) {
             this.objectToMap = item
         },
     },
     data: () => ({
         itemsPerPage: 10,
         popupActivo21: false,
         currentId: 1,
         descriptionItems: [4, 10, 15, 20],
         devise: '',
         objectToMap: '',
         addNewDataSidebarforSecondAssing: false,
         addNewDataSidebarforAssingFirstLot: false,
         lazyDataForTontines: [],
         lazyDataForTontinesUsers: [],
         receivers: [],
         multipleValue: {
             member: '',
             tontine: '',
             montant_cagnote: '',
             montant_enchere: 0,
             money: '',
             date_retrait: '',
             moneyLot: ''
         },
         money: {
             decimal: ',',
             thousands: '.',
             precision: 2,
             masked: false /* doesn't work with directive */
         },
         tontines: [],
         members: [],

         /* Loading */
         backgroundLoading: 'primary',
         colorLoading: '#fff',
         loader: true,
         popupActivo2: false

     }),
     filters: {
         pattern: function (num) {
             return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
         }
     },

 }
</script>

<style lang="scss">
.vuesax-app-is-ltr .vs-collapse-item--icon-header {
    right: 1rem !important;
}

.text-center .vs-input--input.normal {
    text-align: center !important;
}

.allocate-btn {
    padding-top: 3px !important;
    padding-bottom: 3px !important;
}

.disabled {
    pointer-events: none;
    color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: transparent;
    border-color: #d1dbe5;
}

/*! rtl:begin:ignore */
#dashboard-analytics {
    .greet-user {
        position: relative;

        .decore-left {
            position: absolute;
            left: 0;
            top: 0;
        }

        .decore-right {
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    @media(max-width: 576px) {

        .decore-left,
        .decore-right {
            width: 140px;
        }
    }
}

.statistic-card h2 {
    /*  h2{ */
    margin-top: .5rem !important;
    margin-bottom: 1.25rem !important;
    /* } */
}

.product-name {
    max-width: 13rem;
}

/*! rtl:end:ignore */
.disabled {
    pointer-events: none;
    color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: #eef1f6;
    border-color: #d1dbe5;
}
</style>
