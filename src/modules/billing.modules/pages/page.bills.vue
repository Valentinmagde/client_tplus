<template>
<div class="pt-16 mt-5">
    <div class="fixed top-0 z-20 w-full" style="height:150px; background-color: #f8f8f8;" />
    <vx-card no-shadow class="mb-base">
        <p class="mb-3 font-bold">
            {{$t('currentSubscription')}}
        </p>
        <span>
            {{$t('currentSubscriptionSubtitle')}}
        </span>
        <div class="mt-10 mb-10 border-collapse vx-row">
            <div class="w-full vx-col sm:w-1/2 md:w-1/4 lg:w-1/4">
                <p class="justify-center mt-4 ml-10 vx-row">
                    <feather-icon
                    :icon="(association_courante.souscription ? 'Check' : 'Minus') + 'CircleIcon'"
                    :style="'color:' + (association_courante.souscription ? 'green' : 'red')"
                    svgClass="h-1">
                    </feather-icon>
                </p>
                <span class="justify-center mt-4 ml-10 vx-row">
                    {{ association_courante.souscription ? 'Active' : $t('expired')}}
                </span>
            </div>
            <div v-if="!date_fin_periode_grace" class="w-full boder border-blue vx-col xs:w-full sm:w-1/2 md:w-1/4 lg:w-1/4 ">
                <h2 v-if="date_debut" class="justify-center mt-4 font-bold vx-row text-size">
                    {{date_debut | dateTime}}
                </h2>
                <h2 v-else class="justify-center mt-4 font-bold vx-row text-size">
                    {{$t('unknownDate')}}
                </h2>
                <span class="justify-center mt-4 vx-row">
                    {{$t('startAg')}}
                </span>
            </div>
            <div v-if="!date_fin_periode_grace" class="w-full vx-col xs:w-full sm:w-1/2 md:w-1/4 lg:w-1/4">
                <h2 v-if="date_debut" class="justify-center mt-4 font-bold vx-row text-size">
                    {{date_expiration | dateTime}}
                </h2>
                <h2 v-else class="justify-center mt-4 font-bold vx-row text-size">
                    {{$t('unknownDate')}}
                </h2>
                <span class="justify-center mt-4 vx-row">
                    {{$t('expirationAg')}}
                </span>
            </div>
            <div v-if="date_fin_periode_grace" class="w-full vx-col xs:w-full sm:w-1/2 md:w-1/4 lg:w-1/4">
                <h2 class="justify-center mt-4 font-bold vx-row text-size">
                    {{$t('gracePeriod')}}
                </h2>
                <span class="justify-center mt-4 vx-row">
                    {{$t('threeAgs')}}
                </span>
            </div>
            <div v-if="date_fin_periode_grace" class="w-full vx-col xs:w-full sm:w-1/2 md:w-1/4 lg:w-1/4">
                <h2 class="justify-center mt-4 font-bold vx-row text-size">
                    {{date_fin_periode_grace | dateTime}}
                </h2>
                <span class="justify-center mt-4 vx-row">
                    {{$t('expirationAg')}}
                </span>
            </div>
        </div>
    </vx-card>

    <div>
        <vx-card no-shadow v-if="invoicesData.length == 0">
            <p>{{$t('noInvoice')}}</p>
        </vx-card>
    </div>

    <vx-card v-if="invoicesData.length" :title="$t('yourInvoices')">
        <div slot="no-body" class="mt-4">
            <vs-table :data="invoicesData">
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th>{{$t('creationDate')}}</vs-th>
                    <vs-th>{{$t('dueDate')}}</vs-th>
                    <vs-th>{{$t('totalAmount')}}</vs-th>
                    <vs-th>{{$t('state')}}</vs-th>
                    <vs-th> {{$t('actions')}}</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :key="index" v-for="(invoice, index) in data">
                        <vs-td>{{invoice.id}}</vs-td>
                        <vs-td>{{invoice.create_at | dateTime}}</vs-td>
                        <vs-td>{{invoice.delais_paiement | dateTime}}</vs-td>
                        <vs-td>{{invoice.montant| formatMoney(association_courante.devise)}}</vs-td>
                        <vs-td>
                            <vs-chip v-if="invoice.statut == 'EN_ATTENTE'" color="danger">{{$t('owing')}}</vs-chip>
                            <vs-chip v-if="invoice.statut == 'PAYE'" color="success">{{$t('paid')}}</vs-chip>
                            <vs-chip v-if="invoice.statut == 'pending'" color="warning">{{$t('pending')}}</vs-chip>
                        </vs-td>
                        <vs-td>
                            <vx-tooltip :text="$t('detail')" position="bottom" class="inline-block ">
                                <feather-icon icon="InfoIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" @click="redirectDetail(invoice)" />
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vx-card>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'

import { EventBus } from '@/services/EventBus'

export default {
    data() {
        return {
            /* Paramètres de la souscriptions */
            date_debut: null,
            date_expiration: null,
            date_fin_periode_grace: null,
        }
    },
    computed: {
        ...mapGetters({
            association_courante: 'association/getCurrentAssociation',
            ags: 'association/getAgs',
            invoices: 'billing/getAssociationBills',
            activeUser: 'authentificated/getAuth'
        }),
        invoicesData() {
            let data = []

            if (this.invoices.length) {
                this.invoices.forEach(element => {
                    element.forEach(invoice => {
                        data.push({
                            code_promo: invoice.code_promo,
                            create_at: invoice.create_at,
                            cycles_id: invoice.cycles_id,
                            date_paye: invoice.date_paye,
                            delais_paiement: invoice.delais_paiement,
                            id: invoice.id,
                            mode_paiement: invoice.mode_paiement,
                            montant: invoice.montant,
                            reduction: invoice.reduction,
                            statut: invoice.statut,
                            update_at: invoice.update_at
                        })
                    })
                });
            }

            return data
        },
    },
    methods: {
        redirectDetail(invoice) {
          localStorage.setItem('invoice_id', invoice.id)
          this.$router.push(`/association/administration/bill/details`)
        },
    },
    created() {
        EventBus.$emit('loader', true)

        let payload = {
          credentials: { assId: this.association_courante.id },
          commitAction: 'SET_ASSOCIATION_BILLS'
        }

        this.$store.dispatch('association/FETCH_USER_ASSOCIATION', { userUUID: this.activeUser.id })
        .then(() => {
          this.$store.dispatch('billing/getInvoices', payload)
          .then(() => {
            EventBus.$emit('loader', false)
            if(this.ags)
            if (this.ags.length) {
                this.date_debut = this.ags[0].date_ag
                this.date_expiration = this.ags[this.ags.length - 1].date_ag

                // How many ags have been closed ? it helps us to konw wether we are under grace or not
                let numberOfClosedAgs = this.ags.filter((ag) => ag.etat === 'cloture').length

                if(numberOfClosedAgs < 3)
                  if (this.ags.length >= 3)
                      this.date_fin_periode_grace = this.ags[2].date_ag
                  else
                      this.date_fin_periode_grace = this.ags[this.ags.length - 1].date_ag
            }
          })
          .catch((err) => {
            window.console.error(err)
          })
        })
        .catch(error => window.console.error(error))
    }
}
</script>
