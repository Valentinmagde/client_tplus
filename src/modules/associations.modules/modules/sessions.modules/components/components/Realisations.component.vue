<template>
<div id="data-list-list-view" class="data-list-container">

    <!-- Detail Operation-->
    <data-view 
        @closeSidebar="toggleDataSidebar" 
        :isSidebarActive="addNewDataSidebar" 
        :data="emptyData">
        <h4 slot="title">{{ $t('detailOfTransaction') }}</h4>

        <template slot="component" scroll>

            <div class="ep-association pb-12">
                <!-- IMAGE WINDOW MODAL -->
                <div id="myModal" class="modal">
                    <span class="close">&times;</span>
                    <img class="modal-content" id="img01">
                    <div id="caption"></div>
                </div>
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <!-- OPERATION -->
                        <table class="w-full border-collapse">
                            <tr>
                                <td>{{$t('account')}}</td>
                                <td>{{ objectToMap.username}}</td>
                            </tr>
                            <tr>
                                <td>{{$t('montantAttendu')}}</td>
                                <td :class="{redtextclass: objectToMap.in < 0}">
                                    {{ (objectToMap.in) | formatMoney(devise) }}
                                </td>
                            </tr>

                            <tr>
                                <td>{{$t('montantRealise')}}</td>
                                <td :class="{redtextclass: objectToMap.out < 0}">
                                    {{ (objectToMap.out) | formatMoney(devise) }}
                                </td>
                            </tr>
                        </table>

                        <!-- TRANSACTION -->
                        <h5 class="mt-5 mb-4" v-if="objectToMap.transactions && objectToMap.transactions.length">
                            {{$t('transactions')}}
                        </h5>
                        <table class="w-full border-collapse" v-if="objectToMap.transactions && objectToMap.transactions.length">
                            <thead>
                                <tr>
                                    <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('activities') }} </th>
                                    <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('Amount') }} </th>
                                    <th class="w-1/2 px-4 py-2 text-base th-bg">Date </th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr :key="indextr" v-for="(transaction, indextr) in objectToMap.transactions">
                                    <td class="w-1/2 px-4 py-2 text-base">
                                        <p>{{transaction.activite.nom}}</p>
                                    </td>
                                    <td class="w-1/2 px-4 py-2 text-base">
                                        <span>
                                            <p class="product-name font-medium truncate">
                                                {{transaction.montant}}/{{transaction.montant_attendu}}
                                            </p>
                                        </span>
                                    </td>
                                    <td class="w-1/2 px-4 py-2 text-base">
                                        <span>
                                            <p class="product-name font-medium truncate">
                                                {{ (transaction.date_created) | dateTime }}
                                            </p>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>

        <vs-button 
            class="mr-6" 
            type="border" 
            color="success" 
            @click="() => { addNewDataSidebar=false; resetObjectToMap()}">{{ $t('close')}}</vs-button>

    </data-view>

    <!-- FORMULAIRE DE VERSEMENT-->
    <data-view 
        v-if="membre_id"
        :key="render" 
        @closeSidebar="toggleDataSidebarDetail" 
        :isSidebarActive="addNewDataSidebarDetail" 
        :data="emptyData">
        <h4 slot="title">{{$t('sessionPayments') | CAPITALIZE }}</h4>

        <template 
            slot="component" 
            id="components-loading">
            <div class="pb-16">
                <versement-seance 
                    :update="render" 
                    :fnIsValide="fnIsValide" 
                    @child:validate="(fn) => fnValidate = fn" 
                    @child:isvalide="(fn) => fnIsValide = fn" 
                    @request:status="requestStatus" 
                    @rendering="(val) => render=val" 
                    :toggleDataSidebarDetail="toggleDataSidebarDetail" 
                    :current_member="membre_id" 
                    :startLoading="startLoading" 
                    :stopLoading="stopLoading" 
                    :process="processRequest" 
                    @process="() => processRequest =false" />
            </div>
        </template>

        <div class="flex justify-end">
            <vs-button 
                class="mr-6" 
                type="border" 
                color="danger" 
                :disabled="processRequest" 
                @click="() => {
                    addNewDataSidebarDetail=false
                    processRequest = false;
                }"
            >
                {{ $t('close')}}
            </vs-button>

            <vs-button 
                ref="loadableButton" 
                class="vs-con-loading__container mr-6" 
                id="button-with-loading-close" 
                @click="() => {
                    canBeClose = true;
                    processRequest = true;
                    loaderButtonId = 'button-with-loading-close';
                    validitateOperation()
                }" 
                :disabled="!fnIsValide || processRequest">
                {{$t('saveAndClose')}}
            </vs-button>

            <vs-button 
                ref="loadableButton" 
                class="vs-con-loading__container" 
                id="button-with-loading-continue" 
                @click="() => {
                    processRequest = true;
                    loaderButtonId = 'button-with-loading-continue';
                    validitateOperation()
                }" 
                :disabled="!fnIsValide || processRequest">
                {{$t('saveAndContinue')}}
            </vs-button>

        </div>

    </data-view>

    <div class="ml-4 mr-4">
        <vx-card no-shadow class="mb-6 pb-6" :title="$t('financeParams') | CAPITALIZE " />
    </div>

    <div class="ml-4 mr-4">
        <div v-if="members.length == 0" class="flex flex-wrap-reverse items-center data-list-btn-container">
            <!-- ADD NEW -->

        </div>
        <vx-card v-if="!members.length" class="mb-base">
            <p>{{$t('noElementFound')}}</p>
        </vx-card>
    </div>

    <vs-table v-if="members.length" ref="table" pagination search :data="members" :max-items="itemsPerPage" class="mt-4 w-full">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
            <!-- ITEMS PER PAGE -->
            <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                    <span class="mr-2">
                        {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ members.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : members.length }} of {{ queriedItems }}
                    </span>
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
            <vs-th sort-key="username">{{$t('members') | CAPITALIZE }}</vs-th>
            <vs-th sort-key="in">{{$t('montantAttendu') | CAPITALIZE }} </vs-th>
            <vs-th sort-key="out"> {{$t('montantRealise') | CAPITALIZE }} </vs-th>
            <vs-th sort-key="status"> {{$t('status') | CAPITALIZE }} </vs-th>
            <vs-th sort-key="order_status"> {{'actions' | CAPITALIZE }} </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].username">
                    {{data[indextr].username}}
                </vs-td>

                <vs-td :data="data[indextr].out" :class="{redtextclass: data[indextr].in < 0}">
                    {{ (data[indextr].in) | formatMoney(devise) }}
                </vs-td>

                <vs-td :data="data[indextr].in" :class="{redtextclass: data[indextr].out < 0}">
                    {{ (data[indextr].out) | formatMoney(devise) }}
                </vs-td>

                <vs-td :data="data[indextr]">
                    <vx-tooltip v-if="data[indextr].out == 0" :text="$t('encours')" position="bottom" class="inline-block">
                        <vs-radio 
                            class="flex mb-1 items-center" 
                            color="danger" 
                            :checked="true"
                        />
                    </vx-tooltip>

                    <vx-tooltip v-else-if="(data[indextr].in > 0)" :text="$t('encours')" position="bottom" class="inline-block">
                        <vs-radio 
                            class="flex mb-1 items-center"
                            color="warning"
                        />
                    </vx-tooltip>

                    <vx-tooltip v-else :text="$t('cloturer')" position="bottom" class="inline-block">
                        <vs-radio 
                            class="flex mb-1 items-center" 
                            color="success" 
                        />
                    </vx-tooltip>
                </vs-td>
                <vs-td :data="data[indextr]">
                    <!-- Detail -->
                    <vx-tooltip 
                        :text="$t('detail')" 
                        position="bottom" 
                        class="inline-block mr-1" 
                        style="cursor:pointer">
                        <feather-icon 
                            icon="EyeIcon" 
                            @click.stop="() => {addNewDataSidebar=true; objectToMap=data[indextr]}" 
                            svgClasses="w-5 h-5 hover:text-primary stroke-current" />
                    </vx-tooltip>

                    <!-- Versement en seance -->
                    <vx-tooltip 
                        v-if="!(!data[indextr].in &&  data[indextr].out) && (roles.includes('Administrateur') || roles.includes('Financier'))" 
                        :text="$t('sessionPayments')" 
                        position="bottom" 
                        class="inline-block" 
                        style="cursor:pointer">
                        <vs-icon 
                            icon-pack="streameline" 
                            icon="icon-cash-payment-coin-1" 
                            style="font-size: 18px" 
                            class="hover:text-primary" 
                            size="small" 
                            @click.stop="()=>{membre_id=data[indextr]; currentIndex=indextr; dataArray = data; toggleDataSidebarDetail(true); }">
                        </vs-icon>
                    </vx-tooltip>

                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <div class="flex flex-wrapper mt-6 ml-4">
        <vs-button type="border" class="mr-6" id="button-loading" @click.native="previous(1)">{{$t('previous')}}</vs-button>
        <vs-button @click.native="next(3)">{{$t('next')}}</vs-button>
    </div>
</div>
</template>

<script>
//Fonctions
import sidebar from '../../services/mixins/sidebar'
import dataProprety from '../../services/mixins/data'
import {
    EventBus
} from '@/services/EventBus.js'

import {
    getAllFinantialAction
} from '../../services/api'

import VersementSeance from './SessionPayment.component'

import {
    mapGetters
} from 'vuex'

export default {
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
        ...mapGetters({
            current_association: 'association/getCurrentAssociation'
        }),
    },
    components: {
        VersementSeance
    },
    methods: {
        loadingComponent() {
            this.$vs.loading({
                background: "transparent",
                color: "primary",
                container: `#components-loading`,
                scale: 0.45
            })
        },

        firstElement() {
            return this.currentPage * this.itemsPerPage - (this.itemsPerPage - 1)
        },

        lastElement() {
            return this.members.length - this.currentPage * this.itemsPerPage > 0 ? this.currentPage * this.itemsPerPage : this.members.length
        },

        processIndex() {

            let nextButton = document.querySelector('button.vs-pagination--buttons.btn-next-pagination.vs-pagination--button-next')
            nextButton.click()
        },

        gotoNext() {

            //window.console.log(this.currentIndex,'begin gotoNext')
            this.currentIndex++
            //window.console.log(this.currentIndex,'init gotoNext')

            let Elementfound = false
            let innerLoop = (this.currentIndex) ? this.firstElement() - 1 + this.currentIndex : this.firstElement() - 1 + this.currentIndex
            let stopLoop = this.members.length

            
            //let checkPage = false

            //window.console.log(innerLoop,'innerLoop')

            while ((innerLoop <= stopLoop - 1) && Elementfound == false) {

                /*window.console.log(innerLoop,'innerLoop')
                window.console.log(this.lastElement(),"this.lastElement()")*/


                if (innerLoop == this.lastElement()) {
                    innerLoop = this.lastElement()
                    this.currentIndex = 0
                    this.processIndex()
                    //checkPage = true
                }
                
                if (this.members[innerLoop].in == 0 || (this.realisations.length && this.realisations.some(element => element.username === this.members[innerLoop].username))) {
                    innerLoop++

                    continue;
                } else {
                    Elementfound = true
                    
                    break;
                }
            }

            if (!Elementfound || innerLoop > stopLoop) {
                this.addNewDataSidebarDetail = false
                return true
            }

            //window.console.log('now checkPage =',checkPage)

            this.membre_id = this.members[innerLoop]
            this.realisations.push(this.members[innerLoop])

        },

        startLoading() {
            this.startLoding(this.loaderButtonId)
        },
        stopLoading() {
            this.stopLoding(this.loaderButtonId)
        },
        requestStatus(val) {

            this.processRequest = false
            if (this.canBeClose) {
                this.canBeClose = false;
                this.toggleDataSidebarDetail()
            }
            EventBus.$emit('loader', true)

            if (val.status)
                getAllFinantialAction({
                    assId: this.current_association.id,
                    agId: this.uuid
                })
                .then(e => {
                    this.members = e.data.data.map(e => ({
                            id: this.internalId++,
                            username: e.membre,
                            membre_id: e.membres_id,
                            in: e.montant_attendu,
                            out: e.montant_realise,
                            transactions: e.transactions
                        }))
                        .filter(e => !(e.in == 0 && e.out == 0))

                    /* Recharger les données de la trésorei */
                    let payload = {
                        resourceUrl:"api/association/"+this.current_association.id+"/activites/tresorerie",
                        commitAction: 'SET_TRESORERIES',
                    }

                    this.$store.dispatch("association/fetchFinances",payload)
                    .then(()=>{
                        //Loader
                        EventBus.$emit('loader', false)
                    })
                    .catch((error)=>{
                        //Loader
                        EventBus.$emit('loader', false)
                        window.console.log(error)
                    })

                })
                .then(() => this.gotoNext())
                .catch(() => //Loader
                    EventBus.$emit('loader', false))

            else {
                this.$vs.notify({
                    position: 'top-center',
                    text: val.msg,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
                EventBus.$emit('loader', false)
            }

        },
        validitateOperation() {
            /* EventBus.$emit('loader', true) */
            this.fnValidate(this.membre_id.membre_id)
        },
        toggleDataSidebarDetail(val=false) {
            this.addNewDataSidebarDetail = val
        },

        resetObjectToMap() {
            this.objectToMap = ''
        },

        showPreview(src) {
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            var modalImg = document.getElementById("img01");

            modal.style.display = "flex";
            modalImg.src = src;

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                modal.style.display = "none";
            }
        },
    },

    created() {
        //Loader

        EventBus.$emit('loader', true)
        this.devise = this.$store.state.association.currentAssociation.devise
        //this.association = this.Association()
        getAllFinantialAction({
                assId: this.$store.state.association.currentAssociation.id,
                agId: this.uuid
            })
            .then(e => e.data.data)
            .then(e => {
                const newData = e.map(e => ({
                        id: this.internalId++,
                        username: e.membre,
                        membre_id: e.membres_id,
                        in: e.montant_attendu,
                        out: e.montant_realise,
                        transactions: e.transactions
                    }))
                    .filter(e => !(e.in == 0 && e.out == 0))
                this.members = newData
                //Loader
                EventBus.$emit('loader', false)
            })
            .catch(() => //Loader
                EventBus.$emit('loader', false)
            )
    },
    data: () => ({
        itemsPerPage: 10,
        internalId: 1,
        objectToMap: '',
        association: '',
        members: [],
        addNewDataSidebarDetail: false,
        fnValidate: '',
        membre_id: null,
        fnIsValide: false,
        render: 0,
        currentIndex: null,
        dataArray: null,
        canBeClose: false,
        loaderButtonId: null,
        processRequest: false,
        theLast: null,
        realisations: [],

    }),
    filters: {
        pattern: function (num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        },
    },

}
</script>

<style>
.text-center .vs-input--input.normal {
    text-align: center !important;
}

.allocate-btn {
    padding-top: 3px !important;
    padding-bottom: 3px !important;
}
</style>
