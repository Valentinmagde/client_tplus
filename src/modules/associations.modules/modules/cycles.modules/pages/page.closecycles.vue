<template>
    <div>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <div class="mb-base">
                <vx-card no-shadow class="mb-base">
                    <h5>{{`${$t('closingTheCycle')} - ` | CAPITALIZE }} {{ nom_cycle }}</h5>
                    <p class="mt-2 text-muted">{{$t('closingTheCycleSubtitle')}}.</p>
                </vx-card>

            </div>

            <!-- Liste des activités non clurés -->
            <div class="vx-row mb-base">
                <div v-show="activitesData.length > 0" class="vx-col w-full">
                    <vx-card :title="$t('listOfUnfinishedActivities')">
                        <div slot="no-body" class="mt-4">
                            <vs-table :data="activitesData" class="table-dark-inverted overflow-auto" style="max-height: 40rem">
                            <template slot="thead">
                                <vs-th>{{$t('Type') | CAPITALIZE }}</vs-th>
                                <vs-th>{{ $t('name') | CAPITALIZE }}</vs-th>
                                <vs-th>{{ $t('description') | CAPITALIZE }}</vs-th>
                                <vs-th>{{ $t('penaltyForFailure') | CAPITALIZE }} </vs-th>
                                <vs-th>{{ $t('state') | CAPITALIZE }} </vs-th>
                                <vs-th>{{ $t('actions') | CAPITALIZE }} </vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="ind" v-for="(tr, ind) in data">
                                    <vs-td>
                                        <p class="product-name">
                                        <!-- Caisse -->
                                        <span v-if="tr.type=='caisse'">
                                            <vx-tooltip :text="$t('generique')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-tool-box"></vs-icon>
                                            </vx-tooltip>
                                        </span>
                                        <!-- Generique -->
                                        <span v-if="tr.type=='Generique'">
                                            <vx-tooltip :text="$t('generique')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-tool-box"></vs-icon>
                                            </vx-tooltip>
                                        </span>
                                        <!-- Tontine -->
                                        <span v-if="tr.type=='Tontine'">
                                            <vx-tooltip :text="$t('tontine')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-money-bags"></vs-icon>
                                            </vx-tooltip>
                                        </span>
                                        <!-- Evenement -->
                                        <span v-if="tr.type=='Evenement'">
                                            <vx-tooltip :text="$t('events')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-calendar-check-1"></vs-icon>
                                            </vx-tooltip>
                                        </span>
                                        <!-- Mutuelle -->
                                        <span v-if="tr.type=='Mutuelle'">
                                            <vx-tooltip :text="$t('EpargneCredit')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-saving-piggy-coins"></vs-icon>
                                            </vx-tooltip>
                                        </span>
                                        <!-- Projet -->
                                        <span v-if="tr.type=='Projet'">
                                            <vx-tooltip :text="t('project')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-team-idea"></vs-icon>
                                            </vx-tooltip>
                                        </span>
                                        <!-- Solidarité -->
                                        <span v-if="tr.type=='Solidarite'">
                                            <vx-tooltip :text="$t('solidarity')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-multiple-actions-heart"></vs-icon>
                                            </vx-tooltip>
                                        </span>

                                        <!-- Main levee -->
                                        <span v-if="tr.type=='Main_levee'">
                                            <vx-tooltip :text="$t('handSUp')" position="bottom" class="inline-block">
                                            <vs-icon icon-pack="streameline" icon="icon-cash-payment-bills-1"></vs-icon>
                                            </vx-tooltip>
                                        </span>
                                        </p>
                                    </vs-td>
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
                                            {{ tr.taux_penalite | formatMoney(devise) }}
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
                                        <vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block ">
                                        <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"  @click="redirectActivities(tr)"/>
                                        </vx-tooltip>
                                    </vs-td>
                                </vs-tr>

                            </template>
                            </vs-table>
                        </div>
                    </vx-card>
                </div>
            </div>
        </div>

        <div class="flex flex-wrapper justify-end mt-6">
            <vs-button
                id="button-with-loading"
                :disabled="!loader"
                @click="closeCycle">
                {{$t('cloturer')}}
            </vs-button>
        </div>
    </div>
</template>
<script>
//Fonctions
/* import { EventBus } from  '@/services/EventBus.js' */

import {
    mapGetters
} from 'vuex'

import checkRole from '../../../mixins/checkRole'
//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    mixins: [checkRole],
    data(){
        return {
            cycle: null,
            nom_cycle: '',

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true
        }
    },
    computed: {
        admin() {
            return this.isSuperAdministrator;
        },
        ...mapGetters({
            user: 'authentificated/getAuth',
            currentAssociation: 'association/getCurrentAssociation',
            rolesData: 'association/getUserRoles',
        }),

        activitesData(){
            let data = this.$store.state.association.activites_all
            let activites = []

            if(data.length){
                data.forEach(activite=>{
                    if(activite.etat != 'cloture' && activite.type != 'caisse'){
                        activites.push(activite)
                    }
                })
            }
            return activites
        },
    },
    methods: {
        //Redirige sur la liste des activités
        redirectActivities(tr){
            let route, activity_type = tr.type

            switch (activity_type) {
                case "Generique":
                    route = '/association/administration/activities/generic/details'
                    break;
                case "caisse":
                    route = '/association/administration/activities/generic/details'
                    break;

                case "Tontine":
                    route = '/association/administration/activities/tontine/details'
                    break;

                case "Evenement":
                    route = '/association/administration/activities/event/details'
                    break;

                case "Mutuelle":
                    route = '/association/administration/activities/mutual/details'
                    break;

                case "Solidarite":
                    route = '/association/administration/activities/solidarity/details'
                    break;

                default:
                    break;
            }

            this.$router.push(route).catch(() => {})
        },
        // Clôture une activité
        closeCycle(){
            this.openLoadingContained()


            let payload = {
                resourceUrl: '/api/cycle/'+this.$route.params.cyId+'/cloturer',
                commitAction: 'SET_CYCLE',
            }
            this.$store.dispatch("association/fetchCycles", payload)
            .then(()=>{
                this.loader = true
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('notifContent'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })

                this.$router.push({name: 'association:administration:cycles'})
            })
            .catch((error)=>{
                this.loader = true
                this.$vs.loading.close("#button-with-loading > .con-vs-loading")

                this.$vs.notify({
                    position:'top-center',
                    text: error.response.data.data.errMsg,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
                window.console.error(error)
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

    created(){

        let payload = {
            resourceUrl: `/api/association/${this.currentAssociation.id}/cycle/${this.$route.params.cyId}`,
            commitAction: 'SET_CYCLE'
        }

        this.$store.dispatch("association/fetchCycles", payload)
        .then((res)=>{
            this.cycle = res.data.data

            let payload = {
                resourceUrl:"api/association/"+this.currentAssociation.id+"/activite/all",
                commitAction: 'SET_ALL_ACTIVITIES',
            }

            this.$store.dispatch("association/fetchAssociationactivite", payload)
            .then(()=>{
            })
            .catch((err)=>{
                window.console.error(err)
            })
        })
        .catch((err)=>{
            window.console.error(err)
        })
    }
}
</script>
<style>
    .vs-con-table .vs-con-tbody {
        width: 100%;
        overflow: auto;
        margin-top: -10px;
    }
</style>
