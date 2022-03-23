<template>
    <div class="ep-association">
        <div class="vx-row">
            <div class="vx-col w-full">
                <!-- ACTIVITE -->
                <table class="w-full border-collapse">
                    <!-- Date de création -->
                    <tr>
                        <td>{{$t('creationDate')}}</td>
                        <td class="font-semibold">{{ activite.date_created  | dateTime}}</td>
                    </tr>

                     <!-- Type de penalité -->
                    <tr v-if="activite.type_penalite == 'POURCENTAGE'
                                    && activite.taux_penalite != null">
                        <td>{{$t('Penaltyrate')}}</td>
                        <td class="font-semibold">
                            {{activite.taux_penalite}}%
                        </td>
                    </tr>

                    <tr v-else-if="activite.type_penalite == 'FORFAITAIRE'
                                            && activite.taux_penalite != null">
                        <td>{{$t('Penaltyrate')}}</td>
                        <td class="font-semibold" :class="{redtextclass: activite.taux_penalite < 0}">
                            {{ activite.taux_penalite | formatMoney(devise) }}
                        </td>
                    </tr>

                    <!-- Type tontine -->
                    <tr>
                        <td>{{$t('tontineType')}}</td>
                        <td class="font-semibold">
                            {{activite.Tontine.type}}
                        </td>
                    </tr>

                    <!-- Type cotisation -->
                     <tr v-if="activite.Tontine.part_cotisation">
                        <td>{{$t('memberContributionShare')}}</td>
                        <td v-if="activite.Tontine.part_cotisation==1" class="font-semibold">
                            {{$t('singleAmount')}}
                        </td>
                        <td v-if="activite.Tontine.part_cotisation==0" class="font-semibold">
                            {{$t('variableAmount')}}
                        </td>
                    </tr>

                    <!-- Montant part -->
                    <tr>
                        <td v-if="activite.Tontine.part_cotisation == 0
                                    && activite.Tontine.type == 'VARIABLE'">
                            {{$t('minimumAmount')}}
                        </td>
                        <td v-else>
                            {{$t('amountShare')}}
                        </td>
                        <td class="font-semibold" :class="{redtextclass: activite.Tontine.montant_part < 0}">
                            {{ activite.Tontine.montant_part | formatMoney(devise)}}
                        </td>
                    </tr>

                    <!-- Montant cagnote -->
                    <tr>
                        <td>
                            {{$t('amountOfPot')}}
                        </td>
                        <td class="font-semibold" :class="{redtextclass: activite.Tontine.montant_cagnote < 0}">
                            {{ activite.Tontine.montant_cagnote | formatMoney(devise)}}
                        </td>
                    </tr>

                    <!-- Attribution des lots -->
                    <tr>
                        <td>
                            {{$t('allocationOfLots')}}
                        </td>
                        <td class="font-semibold">
                            {{ activite.Tontine.attribution_cagnote | attributionLot}}
                        </td>
                    </tr>

                    <!-- Date premier tour -->
                    <tr>
                        <td>
                            {{$t('dateOfFirstRound')}}
                        </td>
                        <td class="font-semibold">
                            {{ activite.Tontine.date_debut | dateTime}}
                        </td>
                    </tr>
                    

                    <!-- Date dernier tour -->
                    <tr>
                        <td>{{$t('dateOfLastRound')}}</td>
                        <td class="font-semibold">
                            <p class="product-price">
                                {{tontineEndDate(activite.Tontine.date_debut, activite.Tontine.date_fin)}}
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'

import {
    allocation_lots
} from '../../../services/data/allocationOfLots.js'

import i18n from '@/services/i18n/i18n'
Vue.use(i18n);

export default {
    props: ['activite'],
    data(){
        return {
            devise: '',
        }
    },
    filters:{
        attributionLot(att) {
            return allocation_lots.reduce((a, o) => o.value == att ? a.concat(i18n.t(o.i18n)) : a, '')
        }
    },
    methods:{
        tontineEndDate(start_date, duration) {
            let ags = this.$store.state.association.ags
            
            if(this.activite.Tontine.type=='VARIABLE' && this.activite.Tontine.part_cotisation == 1)
                return this.$options.filters.dateTime(
                    this.activite.Tontine.date_fin
                )
            else if((this.activite.Tontine.type=='VARIABLE' 
                    && this.activite.Tontine.part_cotisation == 0
                    && this.activite.Tontine.date_fin))
                return this.$options.filters.dateTime(
                    ags[
                    ags.findIndex((ag) => ag.date_ag == start_date) + duration - 1
                    ]
                    .date_ag
                )
            else if(this.activite.Tontine.type == 'FIXE'){
                let duree = 0
                duree = parseInt(this.activite.Tontine.montant_cagnote / this.activite.Tontine.montant_part)

                return this.$options.filters.dateTime(
                    ags[
                    ags.findIndex((ag) => ag.date_ag == start_date) + duree - 1
                    ]
                    .date_ag
                )
            }
            else
                return this.$options.filters.dateTime(
                    ags[ags.length - 1].date_ag
                )
        },
    },
    created(){
        var association_courante = this.$store.state.association.currentAssociation
        this.devise = association_courante.devise
    }
}
</script>
<style lang="scss">
table {
        background: #f8f8f8;
        border: 2px solid #f8f8f8;

        .th-bg {
            background-color: #fff;
        }
        tr:nth-child(even) {
            background-color: #fff;
        }
        td {
            padding: 5px;
        }
    }
</style>
