<template>
    <div>

        <div id="myModal" class="modal">
          <span class="close">&times;</span>
          <img class="modal-content" id="img01">
          <div id="caption"></div>
        </div>
        <div class="w-full fixed z-20 top-0"/>
        <div>
            <vx-card no-shadow>
                <div class="clearfix w-full">
                    <div class="vx-row ">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row">
                                {{$t('account')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <p>{{operationsData.membre}}</p>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4">
                                {{$t('Amount')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <p class="mt-4" :class="{redtextclass: operationsData.montant < 0}">
                                {{ (operationsData.montant) | formatMoney(devise) }}
                            </p>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4">
                                {{$t('datePayment')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <p class="mt-4">{{ (operationsData.date_versement) | dateTime }}</p>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4">
                                {{$t('paymentMethod')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <p class="mt-4">{{operationsData.mode}}</p>
                        </div>
                    </div>
                    <div class="vx-row" v-if = "operationsData.num_recu">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4">
                                {{$t('numReceivedSlip')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <p class="mt-4">{{operationsData.num_recu}}</p>
                        </div>
                    </div>
                    <div class="vx-row" v-if = "operationsData.preuve">

                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4">
                                {{$t('proofOfPayment')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                             <ul class="mt-4 inline-block" style="color:#65B0F3;">
                                 <feather-icon icon="PaperclipIcon" svgClasses="w-4 h-4 hover:text-primary stroke-current"/>
                                <li color="#65B0F3" class="inline-block hover:italic cursor-pointer mb-2" @click="showPreview(operationsData.preuve)">{{$t('clickToSeeTheImage')}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="vx-row mb-4">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4">
                                {{$t('comment')}}:
                            </p>
                        </div>
                        <div class="vx-col sm:w-2/3 w-full">
                            <vs-textarea
                                name="presentation"
                                v-model="commentaire"
                                class="w-full mt-4 mb-4"
                            />
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col flex justify-between">
                            <div>
                                <p class="vx-row mt-4">
                                    {{$t('paymentAllowance')}}:
                                </p>
                            </div>
                            <div class="ml-6">
                                <ul class="inline-block mt-4" style="color:#65B0F3;">
                                    <li color="#65B0F3" class="inline-block hover:italic cursor-pointer mb-2" @click="addItem2()">+ {{$t('addALine')}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="vx-row mb-0" v-for="(input,k) in inputs" :key="k">
                        <div class="vx-col pl-0 sm:w-3/4 w-full activite">
                            <!-- Activite -->
                            <v-select
                                label="text"
                                :placeholder="$t('selectActivity')"
                                :options="selectOptionsActivities"
                                v-model="input.comptes_id"
                                class="pl-0 w-full mb-2"/>
                            <span class="text-danger text-sm" v-show="errors.has('item-name'+k)">{{ errors.first('item-name'+k) }}</span>
                            </div>
                            <div class="vx-col sm:w-1/4 w-full">
                            <!-- MONTANT -->
                            <money
                                v-model="input.montant"
                                class="money-input w-full pt-3 pb-2 mb-2"
                                v-bind="money"
                                />
                            <span class="cursor-pointer" style="position:relative; float:right; right:-35px; top:-30px;bottom:0">
                                <feather-icon icon="MinusCircleIcon" style="color:red;" svgClass="h-1" @click="remove(k)" v-show="k || (!k && inputs.length > 1)"></feather-icon>
                            </span>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
// import ActionButton from './actionButton.vue'
import {Money} from 'v-money'
import Vue from 'vue'
import {vsSelect} from 'vuesax'
import vSelect from 'vue-select'

//Functions
//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleFinance from "@/store/finance/moduleFinance.js"

Vue.use(vsSelect)
export default {
    props: ['toggleDataSidebar', 'idLoaderValidate', 'idLoaderReject', 'update'],
    data(){
        return {
            commentaire: '',
            inputs: [],
            loading: false,
            transactions: [],
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            devise: '',

            /* Loading */
            backgroundLoading:'primary',
            backgroundLoadingReject:'danger',
            colorLoading:'#fff',
            loader: true,
        }
    },
    components: {
      'v-select': vSelect,
      Money,
      // ActionButton
    },
    computed: {
        memberActivities(){
            return this.$store.state.association.member_activities
        },
        selectOptionsActivities(){
            return this.selectOptionActivities()
        },
        operationsData(){
            return this.update
        }
    },
    methods:{
        //Retourne les activités du membre inscrit
        selectOptionActivities(){
            if(this.memberActivities != null){

                return this.memberActivities.map(activity => {
                        let libelle = activity.activite.nom
                        if(activity.activite.type != 'caisse' && activity.activite.type != 'Generique')
                            libelle = activity.activite.type +' - '+ activity.activite.nom

                        return {
                            id: activity.compte.id,
                            text: libelle +'('+activity.a_payer+')',
                            value:activity.compte.id
                        }
                    }
                )
            }

        },
        showPreview(src){
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            var modalImg = document.getElementById("img01");

            modal.style.display = "flex";
            modalImg.src = src;

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }
        },
        //Ajout un block de transaction
        addItem1(compte, montant, debit_credit) {
            let libelle = compte.activite.nom
            if(compte.activite.type != 'caisse' && compte.activite.type != 'Generique')
                libelle = compte.activite.type +' - '+ compte.activite.nom

            this.inputs.push(
                {
                    comptes_id: {
                        id: compte.compte.id,
                        text: libelle +'('+compte.a_payer+')',
                        value: compte.compte.id,
                        montant_attendu: compte.a_payer,
                    },
                    montant: montant,
                    debit_credit: debit_credit
                }
            );
        },
        //Ajout un block de transaction
        addItem2() {
           var compte = this.memberActivities[0]
            let libelle = compte.activite.nom
            if(compte.activite.type != 'caisse' && compte.activite.type != 'Generique')
                libelle = compte.activite.type +' - '+ compte.activite.nom

            this.inputs.push(
                {
                    comptes_id: {
                        id: compte.compte.id,
                        text: libelle +'('+compte.a_payer+')',
                        value: compte.compte.id,
                        montant_attendu: compte.a_payer,
                    },
                    montant: 0.00,
                    debit_credit: 'credit'
                }
            );
        },
        remove(index) {
            this.inputs.splice(index, 1);
        },
        cancel(){
            let operations = this.$store.state.association.operations


            /* window.console.log(operations) */
            if(operations.transactions.length > 0) {
                this.inputs = []
                operations.transactions.forEach(element=>{
                   this.memberActivities.forEach((activite)=>{
                        if(activite.compte.id == element.comptes_id)
                            this.addItem1(activite, element.montant, element.debit_credit)
                    })
                })
            }
            this.commentaire = operations.commentaire
        },
        //Recupperer les activités d'un membre
        getMemberActivities(membre_id){
            var association_courante = this.$store.state.association.currentAssociation

            let payload = {
              resourceUrl:'/api/association/'+association_courante.id+'/membre/'+membre_id+'/activites',
              commitAction: 'SET_MEMBER_ACTIVITIES'
            }
            this.$store.dispatch("association/fetchMemberActivities", payload)
        },

        openLoadingContainedValidate(){
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${this.idLoaderValidate}`,
                scale: 0.45
            });
        },

        openLoadingContainedReject(){
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoadingReject,
                color: this.colorLoading,
                container: `#${this.idLoaderReject}`,
                scale: 0.45
            });
        },

        //Rejeter une operation
        reject(){
            let association_courante = this.$store.state.association.currentAssociation
            //Verifier que le champ commentaire ne pas vide
            if(this.commentaire == ''){
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('pleaseAddAComment'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                })
            }
            else{
                this.openLoadingContainedReject()
                let payload = {
                    resourceUrl: '/api/membre/'+this.operationsData.membre_id+'/operation/' + this.operationsData.id + '/transaction/rejeter',
                    commitAction: 'SET_REJECTED_OPERATIONS'
                }
                this.$store.dispatch("association/fetchFinances",payload)
                .then(()=> {
                    this.commentaire = ''
                    this.popupActivo2 = false,
                    this.$vs.notify({
                        position:'top-center',
                        text: this.$t('operationSuccessfullyRejected'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })

                    this.toggleDataSidebar()
                    /* Afficher la liste des ioperations */
                    let payload = {
                        resourceUrl: '/api/association/' + association_courante.id + '/operations',
                        commitAction: 'SET_OPERATIONS'
                    }

                    this.$store.dispatch("association/fetchFinances",payload)
                    .then(()=>{
                        this.$vs.loading.close(`#${this.idLoaderReject} > .con-vs-loading`)
                    })
                    .catch((error)=>{
                        this.$vs.loading.close(`#${this.idLoaderReject} > .con-vs-loading`)
                        window.console.error(error)
                    })
                    //setTimeout( () => this.$router.push('/apps/finances/operation'), 1000)
                })
                .catch((error)=>{
                    this.$vs.loading.close(`#${this.idLoaderReject} > .con-vs-loading`)
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

        updateDataView(){
            let operations = this.$store.state.association.operation

            var association_courante = this.$store.state.association.currentAssociation

            let payload = {
                resourceUrl:'/api/association/'+association_courante.id+'/membre/'+operations.membre_id+'/activites',
                commitAction: 'SET_MEMBER_ACTIVITIES'
            }
            this.inputs = []
            this.$store.dispatch("association/fetchMemberActivities", payload)
            .then((res)=>{
                var activities = res.data.data
                this.commentaire = operations.commentaire

                operations.transactions.forEach(element =>{
                    activities.forEach((activite)=>{
                        if(activite.compte.id == element.comptes_id)
                            this.addItem1(activite, element.montant, element.debit_credit)
                    })
                })
            })
            //Recupperation de la devise de l'association
            this.devise = association_courante.devise

        },
        //Valider une operation
        validatePayment(){
            var cpt = 0
            let association_courante = this.$store.state.association.currentAssociation
            //Verifier si le montant de la transaction est inferieur ou égal au montant de l'operation


            this.inputs.forEach(element=>{
                cpt += element.montant
            })

            if(cpt > this.operationsData.montant){
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('validateAPaymentWarning'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                })
            }else{
                this.openLoadingContainedValidate()

                var formData = new FormData();
                var user = this.$store.state.authentificated.user
                var transactions = []

                formData.append('operation[montant]', this.operationsData.montant)
                //formattage de l'objet operation
                var operation = {
                        member_id: this.operationsData.membres_id,
                        date_realisation: this.operationsData.date_versement,
                        montant: this.operationsData.montant,
                        debit_credit: 'credit',
                        num_recu: this.operationsData.num_recu,
                        commentaire: this.operationsData.commentaire,
                        mode: this.operationsData.mod,
                        enregistre_par: user.id
                    }
                this.inputs.forEach(element =>{
                    transactions.push(
                        {
                            comptes_id: element.comptes_id.id,
                            montant: element.montant,
                            debit_credit:  element.debit_credit,
                            montant_attendu: element.comptes_id.montant_attendu
                        }
                    )
                })

                formData.append('operation', JSON.stringify(operation));
                formData.append('transactions', JSON.stringify(transactions));

                let payload = {
                    resourceUrl:'/api/membre/'+this.operationsData.membre_id+'/operation/' +this.operationsData.id + '/transaction/validate',
                    commitAction: 'SET_OPERATION',
                    data: formData
                }

                this.$store.dispatch("association/fetchFinances", payload)
                .then(() => {
                    this.commentaire = ''
                    this.$vs.notify({
                        position:'top-center',

                        text: this.$t('validateAPaymentSuccess'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    this.toggleDataSidebar()

                    /* Afficher la liste des ioperations */
                    let payload = {
                        resourceUrl: '/api/association/' + association_courante.id + '/operations',
                        commitAction: 'SET_OPERATIONS'
                    }

                    this.$store.dispatch("association/fetchFinances",payload)
                    .then(()=>{
                        this.$vs.loading.close(`#${this.idLoaderValidate} > .con-vs-loading`)
                    })
                    .catch((error)=>{
                        this.$vs.loading.close(`#${this.idLoaderValidate} > .con-vs-loading`)
                        window.console.error(error)
                    })
                    //setTimeout( () => this.$router.push('/apps/finances/operation'), 1000)
                })
                .catch(error => {
                    this.$vs.loading.close(`#${this.idLoaderValidate} > .con-vs-loading`)
                    window.console.log(error)
                    /* this.$vs.notify({
                        position:'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    }) */
                })
            }
        },
    },

    watch:{
        /* eslint-disable no-unused-vars */
        update: function(newValue, OldValue){
            this.updateDataView()
        }
    },
    created(){
        // if(!moduleFinance.isRegistered) {
        //     this.$store.registerModule('finance', moduleFinance)
        //     moduleFinance.isRegistered = true
        // }
        // if(!moduleMember.isRegistered) {
        //     this.$store.registerModule('member', moduleMember)
        //     moduleMember.isRegistered = true
        // }
        // if(!moduleAssociation.isRegistered) {
        //     this.$store.registerModule('association', moduleAssociation)
        //     moduleAssociation.isRegistered = true
        // }

        this.updateDataView()

        this.$emit('child:reject',this.reject)
        this.$emit('child:validate',this.validatePayment)
    },
}
</script>
<style lang="scss">
    .selectCountry {
        height: 38px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        font-size: .85rem;
        color: rgba(0,0,0,.7);
    }
    .ajout-masse {
        min-height: auto !important;
        padding: 0;
    }
    [dir] .ant-upload.ant-upload-select-picture-card > .ant-upload {
        height: 8rem !important;
    }

    .activite{
        .vs__dropdown-menu  {
            max-height: 180px !important;
        }
    }
</style>
