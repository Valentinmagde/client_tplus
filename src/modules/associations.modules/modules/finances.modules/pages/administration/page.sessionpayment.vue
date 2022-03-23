<template>
<div>
    <!-- ACTION - DROPDOWN -->
    <action-button v-if="admin" />
    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;" />
    <div class="pt-16">
        <vx-card class="mb-6">
            <h5>{{$t('sessionPayments') | CAPITALIZE }}</h5>
            <p class="mt-2 text-muted">{{$t('paymentInformation')}}</p>
        </vx-card>
        <vx-card>
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
                            class="mt-4 w-full " />
                    </div>
                </div>

                <!-- Montant -->
                <div class="vx-row hidden">
                    <div class="vx-col sm:w-1/3 w-full">
                        <p class="vx-row mt-4 justify-end">
                            {{$t('Amount')}} *:
                        </p>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <money v-model="montant" class="money-input mt-4 w-full" v-bind="money" />
                    </div>
                </div>

                <!-- Date de payment -->
                <div class="vx-row">
                    <div class="vx-col sm:w-1/3 w-full">
                        <p class="vx-row mt-4 justify-end">
                            {{$t('datePayment')}} *:
                        </p>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <flat-pickr class="select-large mt-4 w-full" v-model="date_versement">
                        </flat-pickr>
                    </div>
                </div>

                <!-- Méthode de payment -->
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
                            class="mt-4 w-full " />
                    </div>
                </div>

                <!-- Numéro de reçu -->
                <div class="vx-row" v-if="methode_payement.value != 'ESPECES' && methode_payement.value != 'WALLET'">
                    <div class="vx-col sm:w-1/3 w-full">
                        <p class="vx-row mt-4 justify-end">
                            {{$t('numReceivedSlip')}} *:
                        </p>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <vs-input v-model="num_recu" class="w-full mt-4 mb-4" />
                    </div>
                </div>

                <!-- Preuve de payement -->
                <div class="vx-row" v-if="methode_payement.value != 'ESPECES' && methode_payement.value != 'WALLET'">
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
                            :action="$store.getters['authentificated/uploadUrl']" 
                            :beforeUpload="beforeUpload" 
                            @change="handleChange">
                            <img 
                                class="ant-upload object-contain h-32 w-full" 
                                v-if="imageUrl" 
                                :src="imageUrl" 
                                alt="avatar" />
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
                        <vs-textarea name="presentation" v-model="commentaire" class="w-full mt-4 mb-4" />
                    </div>
                </div>

                <!-- Montant -->
                 <div class="vx-row mt-4 mb-4">
                    <div class="vx-col w-full">
                        <div class="flex wrap justify-end">
                            <div class="vx-col sm:w-1/2 w-full">
                                <div class="text-center">
                                    <span>
                                        <h2 class="font-bold text-lg" :class="{redtextclass: montant < 0}">
                                            {{ montant | formatMoney(devise) }}
                                        </h2>
                                    </span>
                                    <span>
                                        {{$t('totalAmount')}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>

                <!-- Allocation du versement -->
                <div class="vx-row">
                    <div class="vx-col sm:w-1/3 w-full">
                        <p class="vx-row mt-4 justify-end">
                            {{$t('paymentAllowance')}} *:
                        </p>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <div class="vx-row ajout-masse mt-4" v-for="(input,k) in inputs" :key="k">
                            <div class="vx-col sm:w-3/4 w-full activite">
                                <!-- Activite -->
                                <v-select 
                                    label="text" 
                                    :placeholder="$t('selectActivity')" 
                                    :options="selectOptionsActivities" 
                                    v-model="input.comptes_id" 
                                    class="w-full mb-2" 
                                    @input="changeToPay(input.comptes_id.montant_attendu, k)"/>
                                <span 
                                    class="text-danger text-sm" 
                                    v-show="errors.has('item-name'+k)">
                                    {{ errors.first('item-name'+k) }}
                                </span>
                            </div>
                            <div class="vx-col sm:w-1/4 w-full">
                                <!-- MONTANT -->
                                <money 
                                    v-model="input.montant" 
                                    class="money-input w-full pt-3 pb-2" 
                                    v-bind="money" 
                                    @input="updateAmount(input.montant, k)"/>

                                <span 
                                    class="cursor-pointer" 
                                    style="position:relative; float:right; right:-35px; top:-30px;bottom:0">
                                    <feather-icon 
                                        icon="MinusCircleIcon" 
                                        style="color:red;" 
                                        svgClass="h-1" 
                                        @click="remove(k, input.montant)" v-show="k || (!k && inputs.length > 1)">
                                    </feather-icon>
                                </span>
                            </div>
                        </div>
                        <div class="vx-col w-full">
                            <ul class="inline-block" style="color:#65B0F3;">
                                <li 
                                    color="#65B0F3" 
                                    class="inline-block hover:italic cursor-pointer mt-2 mb-2" 
                                    @click="addItem()">+ {{$t('addALine')}}</li>
                            </ul>
                            <vs-checkbox v-model="checkbox_create_another" class="mt-2  mb-5">
                                {{$t('addAnotherPayement')}}
                            </vs-checkbox>
                        </div>
                        <div class="vx-col w-full">
                            <vs-button 
                                class="mt-6 mr-4" 
                                type="border" 
                                @click.native="cancel">
                                {{$t('cancel')}}
                            </vs-button>
                            <vs-button 
                                class="mt-4" 
                                id="button-with-loading" 
                                @click="savePayment(compte)" 
                                :disabled="!validateForm">
                                {{buttonTitle}}
                            </vs-button>
                        </div>
                    </div>
                </div>
            </div>
        </vx-card>
    </div>
</div>
</template>

<script>
import ActionButton from '../../components/administration/ActionButton.component'
import {
    Money
} from 'v-money'
import Vue from 'vue'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    vsSelect
} from 'vuesax'
import VueTelInput from 'vue-tel-input'
import vSelect from 'vue-select'
import Antd from 'ant-design-vue';
import '@/assets/css/ant-upload.css';
import vueCountryRegionSelect from 'vue-country-region-select'

//Functions
import {
    payment_mod
} from '../../services/data/paymentMod.js'

import checkIfAdmin from '../../../../mixins/checkRole'

//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleFinance from "@/store/finance/moduleFinance.js"
// import moduleUser from "@/store/user/moduleUser.js"

Vue.use(Antd);
Vue.use(vueCountryRegionSelect)
Vue.use(VueTelInput)
Vue.use(vsSelect)

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

import {
    EventBus
} from '@/services/EventBus.js'

const sum = (accumulator, currentValue) => accumulator + currentValue.a_payer;

export default {

    mixins: [checkIfAdmin],

    data() {
        return {
            devise: '',
            compte: '',
            montant: '',
            date_versement: new Date(),
            methode_payement: '',
            num_recu: '',
            preuve: '',
            commentaire: '',
            imageUrl: '',
            logo: '',
            checkbox_create_another: true,
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            inputs: [{
                comptes_id: '',
                montant: '',
                debit_credit: 'credit',
            }],
            loading: false,
            transactions: [],

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
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
        admin() {
            return this.hasRole('Financier');
        },
        buttonTitle() {
            return (this.checkbox_create_another) ? this.$t('saveAndContinue') : this.$t('save')
        },
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
        membreData() {
            return this.$store.state.association.members
        },
        memberActivities() {
            return this.$store.state.association.member_activities
        },
        selectOptions() {
            if (this.membreData != null) return this.membreData.map((membre, index) => ({
                id: membre.id,
                text: membre.firstName,
                value: membre.id,
                index
            }))
        },
        selectOptionsActivities() {
            return this.selectOptionActivities()
        },
        paymentModSelectOptions() {
            return payment_mod.map(type => ({
                text: this.$t(type.i18n),
                value: type.value
            }))
        },
    },
    mounted() {
        this.methode_payement = {
            text: this.$t(payment_mod[0].i18n),
            value: payment_mod[0].value
        }
    },
    methods: {
        //Retourne les activités du membre inscrit
        selectOptionActivities() {
            if (this.memberActivities != null) {

                return this.memberActivities.map(activity => {
                    let libelle = activity.activite.nom
                    if (activity.activite.type != 'caisse' && activity.activite.type != 'Generique')
                        libelle = activity.activite.type + ' - ' + activity.activite.nom

                    return {
                        id: activity.compte.id,
                        text: libelle + '(' + activity.a_payer + ')',
                        value: activity.compte.id,
                        montant_attendu: activity.a_payer
                    }
                })
            }

        },

        changeToPay(montant, index){
            let amount = 0
            this.inputs.forEach(element=>{
                amount += element.comptes_id.montant_attendu
            })
            
            this.inputs[index].montant = this.inputs[index].comptes_id.montant_attendu
            this.montant = amount
        },

        updateAmount(montant, index) {
            this.inputs[index].montant = montant

            let amount = 0
            this.inputs.forEach(element=>{
                amount += element.montant
            })
            this.montant = amount
        },

        addItem() {
            var compte = this.memberActivities[0]
            this.inputs.push({
                comptes_id: {
                    id: compte.compte.id,
                    text: compte.activite.nom + '(' + compte.a_payer + ')',
                    value: compte.compte.id,
                    montant_attendu: compte.a_payer,
                },
                montant: compte.a_payer,
                debit_credit: 'credit'
            });

            this.montant += compte.a_payer
        },
        remove(index, amount) {
            this.inputs.splice(index, 1);

            this.montant -= amount
        },
        cancel() {
            this.compte = ''
            this.montant = ''
            this.date_versement = ''
            this.methode_payement = ''
            this.num_recu = ''
            this.logo = ''
            this.commentaire = ''
        },
        //Recupperer les activités d'un membre
        getMemberActivities() {
            this.montant = 0
            this.inputs = []
            EventBus.$emit('loader', true)
            var association_courante = this.$store.state.association.currentAssociation
            var membre_id = this.membreData[this.compte.index].id

            let payload = {
                resourceUrl: '/api/association/' + association_courante.id + '/membre/' + membre_id + '/activites',
                commitAction: 'SET_MEMBER_ACTIVITIES'
            }
            this.$store.dispatch("association/fetchMemberActivities", payload)
                .then(e => e.data.data)
                .then((e) => {
                    this.montant = e.reduce(sum, 0)
                    return e
                })
                .then((activites) => {
                    var account = activites

                    account.sort((a, b) => b.a_payer - a.a_payer).filter(e => e.a_payer != 0)
                        .map(compte => {

                            let libelle = compte.activite.nom
                            if (compte.activite.type != 'caisse' && compte.activite.type != 'Generique')
                                libelle = compte.activite.type + ' - ' + compte.activite.nom
                            this.inputs.push({
                                comptes_id: {
                                    id: compte.compte.id,
                                    text: libelle + '(' + compte.a_payer + ')',
                                    value: compte.compte.id,
                                    montant_attendu: compte.a_payer,
                                },
                                montant: compte.a_payer,
                                debit_credit: 'credit'
                            })

                        })
                    return account
                })
                .then((account) => {
                    let libelle = account[0].activite.nom
                    if (account[0].activite.type != 'caisse' && account[0].activite.type != 'Generique')
                        libelle = account[0].activite.type + ' - ' + account[0].activite.nom

                    if (!this.inputs.length)
                        this.inputs.push({
                            comptes_id: {
                                id: account[0].compte.id,
                                text: libelle + '(' + account[0].a_payer + ')',
                                value: account[0].compte.id,
                                montant_attendu: account[0].a_payer,
                            },
                            montant: 0,
                            debit_credit: 'credit'
                        })
                    EventBus.$emit('loader', false)
                })
                .catch((error) => {
                    window.console.log(error)
                    EventBus.$emit('loader', false)
                })
        },
        /*
         *@param members
         *@return id  //retourne l'id membre de l'utilisateur connecté
         */
        extractMember(members) {
            var user = this.$store.state.authentificated.user
            var membre

            members.forEach(member => {
                member.users.forEach(author => {
                    if (user.id == author.id) {
                        membre = member
                    }
                })
            })
            return membre
        },
        goToNext(member) {
            if (member.index < this.membreData.length - 1) {
                this.compte = {
                    text: this.membreData[member.index + 1].firstName,
                    value: this.membreData[member.index + 1],
                    index: member.index + 1
                }
                this.methode_payement = {
                    text: this.$t(payment_mod[0].i18n),
                    value: payment_mod[0].value
                }
                this.num_recu = '',
                this.preuve = '',
                this.commentaire = '',
                this.imageUrl = '',
                this.logo = ''
                this.getMemberActivities()
            } else {
                this.checkbox_create_another = false
            }
        },
        //Enregistrer un versement
        savePayment(membre) {
            var cpt = 0
            //Verifier si le montant de la transaction est different du montant de la transaction
            this.inputs.forEach(element => {
                cpt += element.montant
            })
            if (cpt > this.montant || cpt < this.montant) {
                this.$vs.notify({
                    position: 'top-center',
                    text: this.$t('paymentWarning1'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                })
            } else {
                this.openLoadingContained()
                var user = this.$store.state.authentificated.user
                //Conversion de la date en Date UTC
                var dateUtc = new Date(this.date_versement).getTime() / 1000
                var formData = new FormData();
                var transactions = []

                //formattage de l'objet operation
                var operation = {
                    date_realisation: dateUtc,
                    montant: this.montant,
                    debit_credit: 'credit',
                    num_recu: this.num_recu,
                    commentaire: this.commentaire,
                    mode: this.methode_payement.value,
                    enregistre_par: user.id
                }
                this.inputs.forEach(element => {
                    transactions.push({
                        comptes_id: element.comptes_id.id,
                        montant: element.montant,
                        debit_credit: element.debit_credit,
                        montant_attendu: element.comptes_id.montant_attendu
                    })
                })

                formData.append('preuve', this.logo);
                formData.append('operation', JSON.stringify(operation));
                formData.append('transactions', JSON.stringify(transactions));

                const membre_id = (membre.value instanceof Object) ? membre.value.id : membre.value

                let payload = {
                    resourceUrl: "/api/membre/" + membre_id + "/operation/en/seance",
                    commitAction: 'SET_OPERATIONS',
                    data: formData
                }

                this.$store.dispatch("association/postRequest", payload)
                    .then(() => {
                        this.loader = true
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('operationSuccess'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })

                    })
                    .then(() => {
                        if (this.checkbox_create_another && (membre.index <= this.membreData.length))
                            this.goToNext(membre)

                        return true;
                    })
                    .then(() => {
                        if (!this.checkbox_create_another)
                            this.$router.push('/association/administration/finances/operations')
                    })
                    .catch(error => {
                        this.loader = true
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        this.$vs.notify({
                            position: 'top-center',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            }
        },
        successUpload() {
            this.$vs.notify({
                color: 'success',
                title: 'Upload Success',
                text: 'Lorem ipsum dolor sit amet, consectetur'
            })
        },
        onInput(formattedNumber, {
            number,
            valid,
            country
        }) {
            this.telephone.number = number.e164;
            this.telephone.valid = valid;
            this.telephone.country = country && country.name;
        },
        homme() {
            this.$router.push('/associations')
        },
        thumbUrl(file) {
            return file.myThumbUrlProperty
        },
        onFileChange(file) {
            // Handle files like:
            this.fileUploaded = file
        },
        updateLocale(locale) {
            this.$i18n.locale = locale;
            this.locale = this.$i18n.locale;
        },
        openLoadingContained() {
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
                    window.console.log(this.logo)
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
    created() {
        EventBus.$emit('loader', true)
        this.inputs = []

        var current_association = this.$store.state.association.currentAssociation
        this.devise = current_association.devise

        let payload = {
            resourceUrl: '/api/association/' + current_association.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers", payload)
            .then((res) => {
                //Recupperer le membre connecté
                this.membre_actuel = this.extractMember(res.data.data)

                this.compte = {
                    text: this.membre_actuel.firstName,
                    value: this.membre_actuel.id,
                    index: 0
                }

                //Recupperer la liste des activités auxquelles le membre connecté est inscrit
                let payload = {
                    resourceUrl: '/api/association/' + current_association.id + '/membre/' + this.membre_actuel.id + '/activites',
                    commitAction: 'SET_MEMBER_ACTIVITIES'
                }

                this.$store.dispatch("association/fetchMemberActivities", payload)
                    .then(e => e.data.data)
                    .then((e) => {
                        this.montant = e.reduce(sum, 0)
                        return e
                    })
                    .then((activites) => {
                        var account = activites

                        account.sort((a, b) => b.a_payer - a.a_payer).filter(e => e.a_payer != 0)
                            .map(compte => {

                                let libelle = compte.activite.nom
                                if (compte.activite.type != 'caisse' && compte.activite.type != 'Generique')
                                    libelle = compte.activite.type + ' - ' + compte.activite.nom
                                this.inputs.push({
                                    comptes_id: {
                                        id: compte.compte.id,
                                        text: libelle + '(' + compte.a_payer + ')',
                                        value: compte.compte.id,
                                        montant_attendu: compte.a_payer,
                                    },
                                    montant: compte.a_payer,
                                    debit_credit: 'credit'
                                })

                            })
                        return account
                    })
                    .then((account) => {
                        let libelle = account[0].activite.nom
                        if (account[0].activite.type != 'caisse' && account[0].activite.type != 'Generique')
                            libelle = account[0].activite.type + ' - ' + account[0].activite.nom

                        if (!this.inputs.length)
                            this.inputs.push({
                                comptes_id: {
                                    id: account[0].compte.id,
                                    text: libelle + '(' + account[0].a_payer + ')',
                                    value: account[0].compte.id,
                                    montant_attendu: account[0].a_payer,
                                },
                                montant: 0,
                                debit_credit: 'credit'
                            })
                        EventBus.$emit('loader', false)
                    })
                    .catch((error) => {
                        EventBus.$emit('loader', false)
                        window.console.log(error)
                    })
            })
            .catch((error) => {
                EventBus.$emit('loader', false)
                window.console.error(error)
            })
    },
}
</script>

<style lang="scss">
.selectCountry {
    height: 38px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    font-size: .85rem;
    color: rgba(0, 0, 0, .7);
}

.ajout-masse {
    min-height: auto !important;
    padding: 0;
}

[dir] .ant-upload.ant-upload-select-picture-card>.ant-upload {
    height: 8rem !important;
}

.activite {
    .vs__dropdown-menu {
        max-height: 180px !important;
    }
}
</style>
