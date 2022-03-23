<template>
    <div class="ep-association">
        <div class="vx-row">
            <div class="vx-col w-full">
                <!-- ACTIVITE -->
                <table class="w-full border-collapse">
                    <!-- Date de création -->
                    <tr>
                        <td>{{$t('creationDate')}}</td>
                        <td class="font-semibold">{{ activite.date_created | dateTime }}</td>
                    </tr>

                    <!-- Taux de penalité -->
                    <tr v-if="activite.type_penalite == 'POURCENTAGE'
                                && activite.taux_penalite != null">
                        <td>{{$t('Penaltyrate')}}</td>
                        <td>
                            <p class="product-price font-semibold">
                                {{activite.taux_penalite}}%
                            </p>
                        </td>
                    </tr>

                     <tr v-else-if="activite.type_penalite == 'FORFAITAIRE'
                                   && activite.taux_penalite != null">
                        <td>{{$t('Penaltyrate')}}</td>
                        <td>
                            <p class="product-price font-semibold" :class="{redtextclass: activite.taux_penalite < 0}">
                                {{ (activite.taux_penalite) | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>

                    <!-- Taux d'interet -->
                    <tr>
                        <td>{{$t('interestRate')}}</td>
                        <td class="font-semibold">{{activite.Mutuelle.taux_interet+' %'}}</td>
                    </tr>

                     <!-- Methode de calcul d'interet -->
                     <tr>
                        <td>{{$t('interestCalculationMethod')}}</td>
                        <td class="font-semibold">{{activite.Mutuelle.methode_calcul_interet}}</td>
                    </tr>

                    <!-- Durée de remboursement -->
                    <tr>
                        <td>{{$t('maximumRepaymentPeriod')}}</td>
                        <td class="font-semibold">{{activite.Mutuelle.duree_pret}} {{$t('generalMeetings')}}</td>
                    </tr>

                    <!-- Montant maximum enpruntable -->
                     <tr>
                        <td>{{$t('maximumBorrowableAmount')}}</td>
                        <td class="font-semibold" :class="{redtextclass: activite.Mutuelle.maximum_empruntable < 0}">
                        {{activite.Mutuelle.maximum_empruntable | formatMoney(devise)}}
                        </td>
                    </tr>

                     <!-- Remboursement -->
                     <tr>
                        <td>{{$t('refunds')}}</td>
                        <td class="font-semibold">{{activite.Mutuelle.remboursement | remboursement}}</td>
                    </tr>

                    <!-- Méthode de payement d'interet -->
                    <tr>
                        <td>{{$t('interestPayment')}}</td>
                        <td class="font-semibold">{{activite.Mutuelle.paiement_interet | methodePayement}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
//Fonctions
import {
  refund
} from '../../../services/data/refundingPolicies'

import {
  interest_payment
} from '../../../services/data/interestPayment'

import i18n from '@/services/i18n/i18n'
Vue.use(i18n);

export default {
    props: ['activite'],
    data(){
        return {
            devise: '',
        }
    },
    filters: {
        remboursement(remboursement) {
            return refund.reduce((a, o) => o.value == remboursement ? a.concat(i18n.t(o.i18n)) : a, '')
        },

        methodePayement(payement) {
            return interest_payment.reduce((a, o) => o.value == payement ? a.concat(i18n.t(o.i18n)) : a, '')
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
