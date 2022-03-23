<template>
    <div>
        <!-- ACTION - DROPDOWN -->
        <action-button/>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <vx-card class="mb-6">
                <h5>{{$t('saveAPayment').toUpperCase()}}</h5>
                <p class="mt-2 text-muted">{{$t('paymentInformation')}}</p>
            </vx-card>
            <vx-card class="mb-base">
                <div class=" clearfix mr-auto max-w-3xl">
                    <!-- Compte -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('account')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                        <v-select
                            label="text"
                            :options="selectOptions"
                            v-model="compte"
                            @input="getMemberActivities"
                            class="mt-4 w-full "/>
                        </div>
                    </div>

                    <!-- Montant -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('Amount')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <money
                            v-model="montant"
                            class="money-input mt-4 w-full"
                            v-bind="money"
                            />
                        </div>
                    </div>

                    <!-- Date de paiement -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('datePayment')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <flat-pickr
                            class="select-large mt-4 w-full"
                            v-model="date_versement">
                            </flat-pickr>
                        </div>
                    </div>

                    <!-- Méthode de payement -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('paymentMethod')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <v-select 
                            label="text"
                            :options="paymentModSelectOptions"
                            v-model="methode_payement"
                            class="mt-4 w-full "/>
                        </div>
                    </div>

                    <!-- Numéro de bordereau -->
                    <div class="vx-row" v-if="methode_payement.value != 'ESPECES'">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('numReceivedSlip')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-input
                            v-model="num_recu"
                            class="w-full mt-4 mb-4" 
                            />
                        </div>
                    </div>

                    <!-- Preuve de payement -->
                    <div class="vx-row" v-if="methode_payement.value != 'ESPECES'">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('proofOfPayment')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <a-upload
                            name="avatar"
                            listType="picture-card"
                            class="h-32 avatar-uploader"
                            :showUploadList="false"
                            :action="$store.getters['user/uploadUrl']"
                            :beforeUpload="beforeUpload"
                            @change="handleChange"
                            >
                            <img class="ant-upload object-contain h-32 w-full" v-if="imageUrl" :src="imageUrl" alt="avatar"/>
                            <div v-else>
                                <a-icon :type="loading ? 'loading' : 'plus'" />
                                <div class="ant-upload-text">{{$t('selectYourImg')}}</div>
                            </div>
                            </a-upload>
                        </div>
                    </div>

                    <!-- Commentaire -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('comment')}} :
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-textarea
                            name="presentation"
                            v-model="commentaire"
                            class="w-full mt-4 mb-4" 
                            />
                        </div>
                    </div>

                    <!-- Allocation du versement -->
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('paymentAllowance')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-base">
                            <div class="vx-row ajout-masse" v-for="(input,k) in inputs" :key="k">
                                <div class="vx-col sm:w-3/4 w-full activite">
                                    <!-- Activite -->
                                    <v-select 
                                        label="text"
                                        :placeholder="$t('selectActivity')"
                                        :options="selectOptionsActivities"
                                        v-model="input.comptes_id"
                                        class="w-full mb-2"/>
                                    <span class="text-danger text-sm" v-show="errors.has('item-name'+k)">{{ errors.first('item-name'+k) }}</span>
                                    </div>
                                    <div class="vx-col sm:w-1/4 w-full">
                                    <!-- MONTANT -->
                                    <money
                                        v-model="input.montant"
                                        class="money-input w-full pt-3 pb-2 mb-3"
                                        v-bind="money"
                                        />
                                    <span class="cursor-pointer" style="position:relative; float:right; right:-35px; top:-30px;bottom:0">
                                        <feather-icon icon="MinusCircleIcon" style="color:red;" svgClass="h-1" @click="remove(k)" v-show="k || (!k && inputs.length > 1)"></feather-icon>
                                    </span>
                                </div>
                            </div>
                            <div>
                                <ul class="inline-block" style="color:#65B0F3;"> 
                                    <li color="#65B0F3" class="inline-block hover:italic cursor-pointer mt-2 mb-2" @click="addItem1()">+ {{$t('addALine')}}</li>
                                </ul>
                            </div>
                            <div>
                                <vs-button class="mt-6 mr-4" type="border" @click.native="cancel">{{$t('cancel')}}</vs-button>
                                <vs-button class="mt-4" id="button-with-loading"  @click="editPayment" :disabled="!validateForm">{{$t('save')}}</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
import ActionButton from '../../components/member/ActionButton.component'
import {Money} from 'v-money'
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {vsSelect} from 'vuesax'
import VueTelInput from 'vue-tel-input'
import vSelect from 'vue-select'
import Antd from 'ant-design-vue';
import '@/assets/css/ant-upload.css';
import vueCountryRegionSelect from 'vue-country-region-select'

//Functions
import {payment_mod} from '../../services/data/paymentMod.js'
import { mapGetters } from 'vuex'


Vue.use(Antd);
Vue.use(vueCountryRegionSelect)
Vue.use(VueTelInput)
Vue.use(vsSelect)

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default {
    data(){
        return {
            compte: '',
            montant: '',
            date_versement: '',
            methode_payement: '',
            num_recu: '',
            preuve: '',
            commentaire: '',
            imageUrl: '',
            logo:'',
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },

            operation: null,
            membres: [],
            inputs: [],
            loading: false,
            transactions: [],

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true
        }
    },
    components: {
      flatPickr,
      'v-select': vSelect,
      Money,
      ActionButton
    },
    computed: {
        ...mapGetters({
          currentAssociation: 'association/getCurrentAssociation',
          activeUser: 'authentificated/getAuth',
        }),
        validateForm() {
            return this.inputs[this.inputs.length - 1] && (this.compte != '' && this.montant != '' &&
                    this.date_versement != '' && this.loader &&
                    this.inputs[this.inputs.length - 1].comptes_id != '' &&
                    this.inputs[this.inputs.length - 1].montant != '' &&
                    this.methode_payement.value == 'ESPECES') ||
                (this.compte != '' && this.montant != '' &&
                    this.date_versement != '' && this.num_recu != '' &&
                    this.inputs[this.inputs.length - 1].comptes_id != '' &&
                    this.inputs[this.inputs.length - 1].montant != '' &&
                    this.loader && this.imageUrl != '' &&
                    this.methode_payement.value != 'ESPECES')
        },

        /* membreData(){
            return this.$store.state.association.members
        }, */
        memberActivities(){
            return this.$store.state.association.member_activities
        },
        selectOptions(){
            if(this.membres.length) return this.membres.map(membre => ({id: membre.id, text: membre.firstName, value: membre.id}))
        },
        selectOptionsActivities(){
            return this.selectOptionActivities()
        },
        paymentModSelectOptions(){
            return payment_mod.map(type => ({text: this.$t(type.i18n), value: type.value}))
        },
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
                            value:activity.compte.id,
                            montant_attendu: activity.a_payer
                        }
                    }
                )
            }
                
        },
        //Ajouter un block transaction
        addItem1() {
            var compte = this.memberActivities[0]
            /* window.console.log(compte) */
            let libelle = compte.activite.nom
            if(compte.activite.type != 'caisse' && compte.activite.type != 'Generique')
                libelle = compte.activite.type +' - '+ compte.activite.nom

            this.inputs.push(
                { 
                    comptes_id: {
                        id: compte.compte.id, 
                        text: libelle+'('+compte.a_payer+')', 
                        value: compte.compte.id,
                        montant_attendu: compte.a_payer,
                    }, 
                    montant: 0.00,
                    debit_credit: 'credit'
                }
            );
        },
        //Ajouter un block transaction
        addItem2(compte, montant, debit_credit) {

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
            /* this.inputs.push(
                { 
                    comptes_id: {
                        id: compte.compte.id, 
                        text: compte.activite.nom+'('+'dette:'+compte.compte.dette+','+' solde:'+compte.compte.solde+')', 
                        value: compte.compte.id
                    }, 
                    montant: montant, 
                    debit_credit: debit_credit
                }
            ); */
        },
        remove(index) {
            this.inputs.splice(index, 1);
        },
        cancel(){
            //Initialisation des variables
            this.methode_payement = {
                text: payment_mod.reduce((a, o) => o.value == this.operation.operation.mode ? a.concat(this.$t(o.i18n)) : a, ''),
                value: this.operation.operation.mode
            }
            this.compte = {
                text: this.operation.operation.membre,
                value:  this.operation.operation.membre_id
            }
            this.montant = this.operation.operation.montant
            this.date_versement = this.operation.operation.date_realisation*1000,
            this.num_recu = this.operation.operation.num_recu,
            this.imageUrl = this.operation.operation.preuve,
            this.commentaire = this.operation.operation.commentaire
            

            var activites = this.memberActivities
            /* window.console.log(activites) */
            //Lister les transactions dans des champs input
            this.inputs = []
            this.operation.transactions.forEach(element =>{
                activites.forEach((activite)=>{
                    if(activite.compte.id == element.comptes_id)
                        this.addItem2(activite, element.montant, element.debit_credit)
                })
            })
        },
        //Recupperer les activités d'un membre
        getMemberActivities(){
            var membre_id = this.compte.value

            let payload = {
              resourceUrl:'/api/association/'+this.currentAssociation.id+'/membre/'+membre_id+'/activites',
              commitAction: 'SET_MEMBER_ACTIVITIES'
            }
            this.$store.dispatch("association/fetchMemberActivities", payload)
        },
        editPayment(){
            var transactions = []
            var cpt = 0
            //Verifier si le montant de la transaction est inferieur ou égal au montant de la transaction
            this.inputs.forEach(element=>{
                cpt += element.montant
            })
            if(cpt > this.montant){
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('paymentWarning1'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                })
            }else{
                this.openLoadingContained()
                var user = this.activeUser
                //Conversion de la date en Date UTC
                var dateUtc = new Date(this.date_versement).getTime()/1000
                var formData = new FormData();
                var operation = {
                        date_realisation: dateUtc,
                        montant: this.montant,
                        debit_credit: 'credit',
                        num_recu: this.num_recu,
                        commentaire: this.commentaire,
                        mode: this.methode_payement.value,
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

                formData.append('preuve', this.logo);
                formData.append('operation', JSON.stringify(operation));
                formData.append('transactions', JSON.stringify(transactions));

                let payload = {
                    resourceUrl:'/api/membre/' +this.operation.operation.membre_id + '/operation/'+this.operation.operation.id,
                    commitAction: 'SET_OPERATION',
                    data: formData
                } 

                this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading") 
                    this.$vs.notify({
                        position:'top-center',
                        
                        text: this.$t('operationSuccessfullyModify'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    setTimeout( () => this.$router.push('/association/finances'), 1000)
                })
                .catch(error => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading") 
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
         onInput(formattedNumber, { number, valid, country }) {
            this.telephone.number = number.e164;
            this.telephone.valid = valid;
            this.telephone.country = country && country.name;
          },
        homme(){
            this.$router.push('/associations')
        },
        thumbUrl (file) {
          return file.myThumbUrlProperty
        },
        onFileChange (file) {
          // Handle files like:
          this.fileUploaded = file
        },
        updateLocale(locale) {
          this.$i18n.locale = locale;
          this.locale = this.$i18n.locale;
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
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl => {
                    this.imageUrl = imageUrl;
                    this.loading = false;
                    this.logo = info.file.originFileObj;

                });
            }
        },
        beforeUpload(file) {
            let isValid = false
            const extensions = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
            for (var i = 0; i < extensions.length; i++) {
                if (extensions[i] === file.type) isValid = true
            }
            if (!isValid) {
                this.$vs.notify({
                    position: 'top-center',
                    text: this.$t('uploadImageRestrictionExtension'),
                    color: 'warning',
                    icon: 'close'
                })
            }
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
                this.$vs.notify({
                    position: 'top-center',
                    text: this.$t('uploadImageRestrictionSize'),
                    color: 'warning',
                    icon: 'close'
                })
            }
            return isValid && isLt2M;
        },
    },
    created(){
        let payload = {
            resourceUrl: '/api/association/' + this.currentAssociation.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers",payload)
        .then((res)=>{
            this.membres = res.data.data
            let playload = {
                resourceUrl: '/api/operation/' + this.$route.params.opId,
                commitAction: 'NO_COMMIT'
            }
            this.$store.dispatch("association/fetchMembers",playload)
            .then((res)=>{
                this.operation = res.data.data

                //Lister les activités du compte membre
                let payload = {
                    resourceUrl:'/api/association/'+this.currentAssociation.id+'/membre/'+this.operation.operation.membre_id+'/activites',
                    commitAction: 'SET_MEMBER_ACTIVITIES'
                }
                this.$store.dispatch("association/fetchMemberActivities", payload)
                .then(()=>{
                    //Initialisation des variables
                    this.methode_payement = {
                        text: payment_mod.reduce((a, o) => o.value == this.operation.operation.mode ? a.concat(this.$t(o.i18n)) : a, ''),
                        value: this.operation.operation.mode
                    }
                    this.compte = {
                        text: this.operation.operation.membre,
                        value: this.operation.operation.membre_id
                    }
                    this.montant = this.operation.operation.montant
                    this.date_versement = this.operation.operation.date_realisation*1000,
                    this.num_recu = this.operation.operation.num_recu,
                    this.imageUrl = this.operation.operation.preuve,
                    this.commentaire = this.operation.operation.commentaire
                

                    var activites = this.memberActivities
                    /* window.console.log(this.operation.transactions) */
                    //Lister les transactions dans des champs input
                    this.operation.transactions.forEach(element =>{
                        activites.forEach((activite)=>{
                            if(activite.compte.id == element.comptes_id){
                                this.addItem2(activite, element.montant, element.debit_credit)
                                /* window.console.log(activites) */
                            }
                        })
                    })
                })
                .catch((error)=>{
                    window.console.error(error)
                })
            })
            .catch((error)=>{
                window.console.error(error)
            })
        })
        .catch((error)=>{window.console.error(error)})
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