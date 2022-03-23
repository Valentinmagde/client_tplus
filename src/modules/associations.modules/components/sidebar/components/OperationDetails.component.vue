<template>
    <div class="ep-association">
        <!-- IMAGE WINDOW MODAL -->
        <div id="myModal" class="modal">
          <span class="close">&times;</span>
          <img class="modal-content" id="img01" style="object-fit: contain; -o-object-fit: contain">
          <div id="caption"></div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <h5 class="mb-4">{{$t('operation') | CAPITALIZE }}</h5>
                <!-- OPERATION -->
                <table class="w-full border-collapse">
                    <tr>
                        <td class="font-semibold">{{$t('account')}}</td>
                        <td>{{ operation.membre }}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('paymentDate')}}</td>
                        <td>
                            {{ operation.date_versement | dateTime }}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('Amount')}}</td>
                        <td>
                            <p class="product-name font-medium truncate"
                                :class="{redtextclass: operation.montant < 0}">
                                {{ operation.montant | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('paymentMethod')}}</td>
                        <td>{{operation.mode}}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('state')}}</td>
                        <td>
                            <p v-if="operation.etat == 'EN_ATTENTE'" class="product-price">
                                <vs-chip color="warning">{{$t('waiting')}}</vs-chip>
                            </p>
                            <p v-if="operation.etat == 'VALIDE'" class="product-price">
                                <vs-chip color="success">{{$t('validated')}}</vs-chip>
                            </p>
                            <p v-if="operation.etat == 'REJETE'" class="product-price">
                                <vs-chip color="danger">{{$t('rejected')}}</vs-chip>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('Type')}} :</td>
                        <td>
                            <p v-if="operation.debit_credit=='credit'" class="product-price">{{$t('payment')}}</p>
                            <p v-if="operation.debit_credit=='debit'" class="product-price">{{$t('withdrawal')}}</p>
                        </td>
                    </tr>

                    <tr v-if="operation.commentaire !== ''">
                        <td class="font-semibold">{{$t('comment')}} :</td>
                        <td>
                            <p class="product-price">{{operation.commentaire}}</p>
                        </td>
                    </tr>

                    <tr v-if="operation.debit_credit == 'credit' && operation.preuve">
                        <td class="font-semibold">{{$t('proofOfPayment')}} :</td>
                        <td>
                            <ul class="inline-block" style="color:#65B0F3;">
                                 <feather-icon icon="PaperclipIcon" svgClasses="w-4 h-4 hover:text-primary stroke-current"/>
                                <li color="#65B0F3" class="inline-block hover:italic cursor-pointer"
                                    @click="showPreview(operation.preuve)">
                                    {{$t('clickToSeeTheImage')}}
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
                <!-- TRANSACTION -->
                <h5 class="mt-5 mb-4">{{$t('transaction') | CAPITALIZE }}</h5>
                <table class="w-full border-collapse">
                    <thead>
                        <tr>
                            <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('activities') }} </th>
                            <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('Amount') }} </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :key="indextr" v-for="(transaction, indextr) in operation.transactions">
                            <td class="w-1/2 px-4 py-2 text-base">
                                <p>{{transaction.activite.nom}}</p>
                            </td>
                            <td class="w-1/2 px-4 py-2 text-base">
                                <span >
                                    <p class="product-name font-medium truncate"
                                        :class="{redtextclass: transaction.montant < 0}">
                                        {{ transaction.montant | formatMoney(devise) }}
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
<script>
import { mapGetters } from 'vuex'

export default {
    props: ['operation'],
    data(){
        return {
            devise: '',
        }
    },
    computed: {
      ...mapGetters({
        currentAssociation: 'association/getCurrentAssociation',
      }),
    },
    methods: {
        showPreview(src){
            // Get the modal
            let modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            let modalImg = document.getElementById("img01");

            modal.style.display = "flex";
            modalImg.src = src;

            // Get the <span> element that closes the modal
            let span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }
        },
    },
    created(){
        var association_courante = this.currentAssociation

        this.devise = association_courante.devise
    }
}
</script>
<style lang="scss">
    table {
        td {
            padding: 5px;
        }
    }
</style>
