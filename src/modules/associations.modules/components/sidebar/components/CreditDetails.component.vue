<template>
    <div class="ep-association">
        <!-- Popup pour annuler un credit-->
        <vs-popup classContent="popup-example" :title="$t('cancelConfirmation')" :active.sync="popupActivo3">
            <p>{{$t('cancelConfirmationSubtitle')}}</p>
            <vs-divider />
            <div class="vx-row w-full justify-end">
                <vs-button color="#626262" @click="popupActivo3=false" type="border">
                    {{$t('cancel')}}
                </vs-button>&nbsp;&nbsp;
                <vs-button class="ml-3" color="#626262" @click.stop="cancelInteret()">
                    {{$t('save')}}
                </vs-button>
            </div>
        </vs-popup>
        <!-- IMAGE WINDOW MODAL -->
        <div id="myModal" class="modal">
          <span class="close">&times;</span>
          <img class="modal-content" id="img01" style="object-fit: contain; -o-object-fit: contain">
          <div id="caption"></div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <h5 class="mb-4">{{$t('Credit') | CAPITALIZE }}</h5>
                <!-- credit -->
                <table class="w-full border-collapse">
                    <tr>
                        <td class="font-semibold">{{$t('creditAmount')}}</td>
                        <td>{{ credit.detail.montant_credit | formatMoney(devise) }}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('interestRate')}}</td>
                        <td class="font-semibold">{{credit.mutuelle.taux_interet+' %'}}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('generalInterest')}}</td>
                        <td>
                            {{ credit.detail.montant_interet | formatMoney(devise) }}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('remainingAmount')}}</td>
                        <td>
                            <p class="product-name font-medium truncate"
                                :class="{redtextclass: credit.montant < 0}">
                                {{ credit.detail.montant_restant | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('startDate')}}</td>
                        <td>{{credit.detail.date_demande | dateTime}}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('Deadlines')}}</td>
                        <td>{{deadline(credit.detail.date_demande, credit.detail.date_limite)}}</td>
                    </tr>
                    <tr v-if="credit.activite.type_penalite == 'POURCENTAGE'
                                && credit.activite.taux_penalite != null">
                        <td class="font-semibold">{{$t('Penaltyrate')}}</td>
                        <td>
                            <p class="product-price font-semibold">
                                {{credit.activite.taux_penalite}}%
                            </p>
                        </td>
                    </tr>

                     <tr v-else-if="credit.activite.type_penalite == 'FORFAITAIRE'
                                   && credit.activite.taux_penalite != null">
                        <td class="font-semibold">{{$t('Penaltyrate')}}</td>
                        <td>
                            <p class="product-price font-semibold" :class="{redtextclass: credit.activite.taux_penalite < 0}">
                                {{ (credit.activite.taux_penalite) | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>
                </table>



                <!-- echeances -->
                <div class="vx-row flex flex-wrapper mt-5">
                    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-1/2 mb-5">
                        <div class="flex justify-right">
                            <h5 class="mt-5 mb-4">{{$t('deadlines') | CAPITALIZE }}</h5>
                        </div>
                    </div>
                    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-1/2 mb-5">
                        <div class="flex justify-end">
                             <vs-button @click="moreDetail()">
                                {{$t('moreDetails')}}
                            </vs-button>
                                <!--<ejs-tooltip v-if="admin" :content="" position="bottom" class="inline-block">
                                    <feather-icon icon="SearchIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2" @click="moreDetail()" />
                                </ejs-tooltip>-->
                        </div>
                    </div>
                </div>
                
                
                <table v-if="credit.echeances" class="w-full border-collapse">
                    <thead>
                        <tr>
                            <th class="w-1/5 px-4 py-2  th-bg">{{ $t('montantAttendu') }} </th>
                            <!-- <th class="w-1/5 px-4 py-2  th-bg">{{ $t('montantRealise') }} </th> -->
                            <th class="w-1/5 px-4 py-2  th-bg">{{ $t('Deadlines') }} </th>
                            <th class="w-1/5 px-4 py-2  th-bg">{{ $t('status') }} </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="2">
                                
                            </td>
                            <td class="w-1/2 px-4 py-2 text-base">
                                
                            </td>
                        </tr>
                        <tr :key="indextr" v-for="(echeance, indextr) in echeances">
                            <td class="w-1/2 px-4 py-2 text-base" >
                                <p :class="{redtextclass: echeance.montant < 0}">
                                    {{ (echeance.montant) | formatMoney(devise) }}
                                </p>
                            </td>
                            <!-- <td class="w-1/2 px-4 py-2 text-base" >
                                <p :class="{redtextclass: echeance.montant < 0}">
                                    {{ (echeance.montant_realise == -1) ? 0 :  echeance.montant_realise | formatMoney(devise) }}
                                </p>
                            </td> -->
                            <td class="w-1/2 px-4 py-2 text-base" >
                                <p v-if="echeance.date_limite == 0" class="product-name">
                                    {{$t('nextCycle')}}
                                </p>
                                <p v-if="echeance.date_limite != 0" class="product-name">
                                    <span v-if="!echeance.maj">{{ (echeance.date_limite) | dateTime }}</span>
                                    <span v-if="echeance.maj"><v-select label="text" :options="optionsAgs" v-model="echeance.date" class="w-full" /></span>
                                </p>
                            </td>
                            <td class="w-1/2 px-4 py-2 text-base">
               
                                <ejs-tooltip rel="tooltip" v-if="echeance.montant_realise >= 0 && echeance.montant_realise < echeance.montant" :content="$t('encours')" position="bottom" class="inline-block">
                                    <vs-radio
                                        class="flex mb-1 items-center"
                                        color="danger"
                                    />
                                </ejs-tooltip>

                                <ejs-tooltip rel="tooltip" v-else-if="echeance.montant_realise < 0 && echeance.etat == 'cloture'" :content="$t('cancelled')" position="bottom" class="inline-block">
                                    <vs-radio
                                        class="flex mb-1 items-center"
                                        color="warning"
                                    />
                                </ejs-tooltip>

                                <ejs-tooltip rel="tooltip" v-else :content="$t('cloturer')" position="bottom" class="inline-block">
                                    <vs-radio
                                        class="flex mb-1 items-center"
                                        color="success"
                                    />
                                </ejs-tooltip>
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

import checkIfAdmin from '../../../mixins/checkRole'
import vSelect from 'vue-select'
export default {
    mixins: [checkIfAdmin],
    props: ['credit'],
    data(){
        return {
            devise: '',
            date_debut_remboursement: '',
            ags: [],
            inputs: [{
                montant: 0,
                interet: 0,
                date_limite: 0,
            }],
            maj: false,
            echeances: [],
            optionsAgs: [],
            creditId: null,
            echId: null,
            popupActivo3: false
        }
    },
    components: {
        vSelect
    },
    computed: {
      ...mapGetters({
        currentAssociation: 'association/getCurrentAssociation'
      }),
      admin() {
          return this.isSuperAdministrator;
        },
        selectAgsOptions() {
            let prochaines_ags = []
            let tab = []
            if (this.ags != null)
                this.ags.forEach(element => {
                    if (element.etat != 'past' && element.etat != 'cloture')
                        prochaines_ags.push({
                            id: element.id,
                            text: this.$options.filters.dateTime(element.date_ag),
                            value: element.date_ag
                        })
                })

            if (prochaines_ags.length > 0) {
                tab = prochaines_ags
            }

            if(this.ags && this.ags.length){
                tab.push({
                    id: 0,
                    text: this.$t('nextCycle'),
                    value: 0
                })
            }

            return tab

        },
    },
    watch: {
        credit: function (newValue) {
            this.credit = newValue
            this.echeances = []
            this.initCredit()
        }
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
        deadline(start_date, number) {
            let ags = this.$store.state.association.ags
            let start = ags.find(e => e.date_ag == start_date)

            var index = ags.indexOf(start)

            if (index + number >= ags.length) {
                return this.$t('nextCycle')
            } else {
                return this.$options.filters.dateTime(ags[index + number].date_ag)
            }
        },
        majDateEcheance(echeance){
            /*const resultat = this.selectAgsOptions.find(element => element.value === echeance.date.value)
            let ind = this.selectAgsOptions.indexOf(resultat)
            this.optionsAgs = []
            for (let index = ind; index < this.selectAgsOptions.length; index++) {
                this.optionsAgs.push(this.selectAgsOptions[index]);
            }*/
            echeance.maj = true
        },
        initCredit(){
            this.credit.echeances.forEach(element => {
                
                this.echeances.push(
                    {
                        date: {
                            text: this.$options.filters.dateTime(element.date_limite),
                            value: element.date_limite
                        },
                        maj: false,
                        ...element
                    }
                )

            });

            this.optionsAgs = this.selectAgsOptions

        },
        getCredit(id){
            let payload = {
                resourceUrl: 'api/mutuelle/credit/' + id + '/detail',
                commitAction: 'SET_CREDIT'
            }

            this.$store.dispatch("association/fetchAssociationactivite", payload)
                .then((res) => {
                    this.credit = res.data.data
                    this.initCredit()
                })
                .catch((error) => {
                    this.$vs.notify({
                        position: 'top-center',
                        title: 'error',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
        annulerAllInteret(id){
            
                 let payload = {
                    resourceUrl: 'api/mutuelle/credit/' + id + '/annuler/interet',
                    commitAction: 'SET_CREDIT'
                }

                this.$store.dispatch("association/fetchAssociationactivite", payload)
                    .then(() => {
                        this.getCredit(id)
                    })
                    .catch((error) => {
                        this.$vs.notify({
                            position: 'top-center',
                            title: 'error',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            
        },
        annulerOneInteret(id, echId){
            
                 let payload = {
                    resourceUrl: 'api/mutuelle/credit/' + id + '/echeance/'+ echId +'/annuler/interet',
                    commitAction: 'SET_CREDIT'
                }

                this.$store.dispatch("association/fetchAssociationactivite", payload)
                    .then(() => {
                        this.getCredit(id)
                    })
                    .catch((error) => {
                        this.$vs.notify({
                            position: 'top-center',
                            title: 'error',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            
        },
        validerDateEcheance(echeance){
            
            if(echeance.date.value == echeance.date_limite){
                echeance.maj = false
            }else{
                 let payload = {
                    resourceUrl:"api/echeancier/"+ echeance.id +"/updatedate",
                    commitAction: 'SET_CREDIT',
                    data: {
                        date: echeance.date.value 
                    }
                }

                this.$store.dispatch("association/postRequest", payload)
                    .then(() => {
                        echeance.date_limite = echeance.date.value
                        echeance.maj = false;
                    })
                    .catch(error => {
                        
                        this.$vs.notify({
                            position:'top-center',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            }
        },
        cancelInteret(){
            if(this.echId == null){
                this.annulerAllInteret(this.creditId)
            }else{
                this.annulerOneInteret(this.creditId, this.echId)
            }

            this.popupActivo3 = false
        },
        moreDetail(){
            this.$emit("isSidebarActiveLocal", false);
            localStorage.setItem('creditId', this.credit.detail.id);
            if(this.admin)
                this.$router.push('/association/administration/activities/mutual/credit/details');
            else
                this.$router.push('/association/my-activities/mutual/credit/details');
        }
    },
    created(){
        var association_courante = this.currentAssociation

        this.devise = association_courante.devise

         this.ags = this.$store.state.association.ags

        if (this.ags.length > 0) {
            this.ags.forEach(ag => {
                if (ag.etat == 'current') {
                    this.inputs[0].date_limite = {
                        text: this.$options.filters.dateTime(ag.date_ag),
                        value: ag.date_ag
                    }
                }
            })

        }
        this.initCredit()
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
