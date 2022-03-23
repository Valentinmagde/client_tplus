<template>
<div id="h-loader" class="vs-con-loading__container" ref="loadableButton">

    <div class="ep-association mx-3 mb-32 pb-32" v-if="inputs.length">
        <!-- Compte -->
        <p class="vs-input--label">{{$t('account')+'*'}}</p>
        <v-select 
            label="text" 
            :options="selectOptions" 
            v-model="compte" 
            @input="getMemberActivities" 
            class="w-full disabled" readOnly />

        <!-- Montant -->
        <!--<p class="vs-input--label mt-5">{{$t('Amount')+'*'}}</p>-->
        <money 
            v-model="montant" 
            class="money-input w-full hidden" 
            v-bind="money" 
            @input="watchChange" />

        <!-- Date de versement -->
        <p class="vs-input--label mt-5">{{$t('datePayment')+'*'}}</p>

        <flat-pickr class="select-large w-full" v-model="date_versement">
        </flat-pickr>

        <!-- Methode de payment -->
        <p class="vs-input--label mt-5">{{$t('paymentMethod')+'*'}}</p>

        <v-select 
            label="text" 
            :options="paymentModSelectOptions" 
            v-model="methode_payement" 
            class="w-full" 
            @input="watchChange" />

        <span v-if="methode_payement.value != 'ESPECES'">
            <!-- Numéro de bordereau -->
            <p class="vs-input--label mt-5">{{$t('numReceivedSlip')+'*'}}</p>
            <vs-input v-model="num_recu" class="w-full mb-4" @input="watchChange" />

            <!-- Preuve de payment -->
            <p class="vs-input--label mt-5">{{$t('proofOfPayment')+'*'}}</p>
            <a-upload 
                name="avatar" 
                v-model="preuve" 
                listType="picture-card" 
                class="h-32 avatar-uploader" 
                :showUploadList="false" 
                :action="$store.getters['user/uploadUrl']" 
                :beforeUpload="beforeUpload" 
                @change="handleChange" @input="watchChange">
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
        </span>

        <!-- Commentaire -->
        <p class="vs-input--label mt-5">{{$t('comment')}}</p>
        <vs-textarea name="presentation" v-model="commentaire" class="w-full mb-4" />

        <!-- Montant -->
        <div class="vx-row mt-8">
            <div class="vx-col w-full">
                <div class="flex wrap justify-end">
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

        <!-- Allocation de versement -->
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full">
                <p class="vx-row vs-input--label ml-1 mt-4">
                    {{$t('paymentAllowance')}} *:
                </p>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                <ul class="inline-block mt-4" style="color:#65B0F3;">
                    <li 
                        color="#65B0F3" 
                        class="inline-block hover:italic cursor-pointer mb-2 text-sm" 
                        @click="addItem()">+ {{$t('addALine')}}</li>
                </ul>
            </div>
        </div>
        <div class="vx-row activite" v-for="(input,k) in inputs" :key="k">
            <div class="vx-col sm:w-3/4 w-full -mr-4">
                <!-- Activite -->
                <v-select 
                    label="text" 
                    :placeholder="$t('selectActivity')" 
                    :options="selectOptionsActivities" 
                    v-model="input.comptes_id" 
                    class="w-full mb-2" 
                    @input="watchChange(); changeToPay(input.comptes_id.montant_attendu, k)" />
                <span 
                    class="text-danger text-sm" 
                    v-show="errors.has('item-name'+k)">
                    {{ errors.first('item-name'+k) }}
                </span>
            </div>
            <div class="vx-col sm:w-1/4 w-4/5">
                <!-- MONTANT -->
                <money 
                    v-model="input.montant" 
                    class="money-input w-full pt-3 pb-2" 
                    v-bind="money" 
                    @input="updateAmount(input.montant, k)"/>

                <span 
                    class="cursor-pointer" 
                    style="position:relative; float:right; right:-25px; top:-30px;bottom:0">
                    <feather-icon 
                        icon="MinusCircleIcon" 
                        style="color:red;" 
                        svgClass="h-1" 
                        @click.stop="remove(k, input.montant)" v-show="k || (!k && inputs.length > 1)">
                    </feather-icon>
                </span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
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

export default {
    props: ['current_member', 'toggleDataSidebarDetail', 'startLoading', 'stopLoading', 'process'],
    data() {
        return {
            devise: '',
            admin: false,
            compte: '',
            montant: '',
            date_versement: new Date(),
            methode_payement: '',
            num_recu: '',
            preuve: '',
            commentaire: '',
            imageUrl: '',
            newMembreProps: '',
            logo: '',
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            inputs: [],
            loading: false,
            transactions: [],
            membre_actuel: null,
            membres: [],

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,
            currentButtonClicked: null,
        }
    },
    watch: {
        //eslint-disable-next-line no-unused-vars
        inputs: function (newValue, oldValue) {

            const empty = newValue.length
            if (empty) {
                //window.console.log('new feature in inputs in yes', newValue.length)
                this.$vs.loading.close(this.$refs.loadableButton)

            } else {
                //window.console.log('new feature in inputs in false', newValue.length)
                this.$vs.loading({
                    backgroundLoading: 'primary',
                    colorLoading: '#fff',
                    container: this.$refs.loadableButton,
                    scale: 0.6
                })
            }
        },
        //eslint-disable-next-line no-unused-vars
        current_member: function (newValue, oldValue) {

            this.inputs = []
            this.$vs.loading({
                backgroundLoading: 'primary',
                colorLoading: '#fff',
                container: this.$refs.loadableButton,
                scale: 0.6
            })
            //window.console.log('put full loader')
            this.montant = newValue.in
            this.compte = {
                text: newValue.username,
                value: newValue.membre_id
            }

            this.date_versement = new Date()
            var current_association = this.$store.state.association.currentAssociation

            let payload = {
                resourceUrl: '/api/association/' + current_association.id + '/membre/' + newValue.membre_id + '/activites',
                commitAction: 'SET_MEMBER_ACTIVITIES'
            }

            this.$store.dispatch("association/fetchMemberActivities", payload)
                .then((response) => {
                    let activites = response.data.data
                    return activites
                })
                .then((activites) => {
                    var account = activites

                    let current_montant = newValue.in

                    account.sort((a, b) => b.a_payer - a.a_payer).filter(e => e.a_payer != 0)
                        .map(compte => {

                            if (compte.a_payer == current_montant) {
                                this.inputs.push({
                                    comptes_id: {
                                        id: compte.compte.id,
                                        text: compte.activite.nom + '(' + compte.a_payer + ')',
                                        value: compte.compte.id,
                                        montant_attendu: compte.a_payer,
                                    },
                                    montant: current_montant,
                                    debit_credit: 'credit'
                                })
                                current_montant = 0
                            } else {
                                if (compte.a_payer < current_montant && current_montant != 0) {
                                    this.inputs.push({
                                        comptes_id: {
                                            id: compte.compte.id,
                                            text: compte.activite.nom + '(' + compte.a_payer + ')',
                                            value: compte.compte.id,
                                            montant_attendu: compte.a_payer,
                                        },
                                        montant: compte.a_payer,
                                        debit_credit: 'credit'
                                    })
                                    current_montant = current_montant - compte.a_payer
                                } else {
                                    if (compte.a_payer > current_montant && current_montant != 0) {
                                        this.inputs.push({
                                            comptes_id: {
                                                id: compte.compte.id,
                                                text: compte.activite.nom + '(' + compte.a_payer + ')',
                                                value: compte.compte.id,
                                                montant_attendu: compte.a_payer,
                                            },
                                            montant: current_montant,
                                            debit_credit: 'credit'
                                        })
                                        current_montant = 0
                                    }
                                }
                            }
                        })

                }).then(() => {
                    this.montant = this.inputs.reduce((montant, e) => montant + e.montant, 0);
                    this.$vs.loading.close(this.$refs.loadableButton)
                })
                .catch((err) => {
                    this.$vs.loading.close(this.$refs.loadableButton)
                    window.console.log(err)
                })
        }
    },
    components: {
        flatPickr,
        'v-select': vSelect,
        Money,
        // ActionButton
    },
    computed: {
        validateForm() {
            return this.compte != '' && this.montant != '' && this.date_versement != '' && this.num_recu != '' &&
                this.inputs[this.inputs.length - 1].comptes_id != '' && this.inputs[this.inputs.length - 1].montant != '' &&
                this.loader || this.compte != '' && this.montant != '' && this.date_versement != '' && this.num_recu != '' &&
                this.inputs[this.inputs.length - 1].comptes_id != '' && this.inputs[this.inputs.length - 1].montant != '' &&
                this.loader && this.imageUrl != '' && this.methode_payement.value != 'ESPACE' &&
                this.methode_payement
        },
        currentAssociation() {
            return this.$store.state.association.currentAssociation
        },
        membreData() {
            return this.$store.state.association.members
        },
        memberActivities() {
            return this.$store.state.association.member_activities
        },
        selectOptions() {
            if (this.membreData != null) return this.membreData.map(membre => ({
                id: membre.id,
                text: membre.firstName,
                value: membre.id
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
        this.$vs.loading({
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            container: this.$refs.loadableButton,
            scale: 0.45
        })

    },
    methods: {
        checkActivity(newValue) {

            this.compte = {
                text: newValue.username,
                value: newValue.membre_id
            }

            var current_association = this.$store.state.association.currentAssociation

            let payload = {
                resourceUrl: '/api/association/' + current_association.id + '/membre/' + newValue.membre_id + '/activites',
                commitAction: 'SET_MEMBER_ACTIVITIES'
            }

            this.$store.dispatch("association/fetchMemberActivities", payload)
                .then((response) => {
                    let activites = response.data.data
                    return activites
                })
                .then((activites) => {
                    var account = activites

                    let current_montant = newValue.in

                    account.sort((a, b) => b.a_payer - a.a_payer).filter(e => e.a_payer != 0)
                        .map(compte => {

                            if (compte.a_payer == current_montant) {
                                this.inputs.push({
                                    comptes_id: {
                                        id: compte.compte.id,
                                        text: compte.activite.nom + '(' + compte.a_payer + ')',
                                        value: compte.compte.id,
                                        montant_attendu: compte.a_payer,
                                    },
                                    montant: current_montant,
                                    debit_credit: 'credit'
                                })
                                current_montant = 0
                            } else {
                                if (compte.a_payer < current_montant && current_montant != 0) {
                                    this.inputs.push({
                                        comptes_id: {
                                            id: compte.compte.id,
                                            text: compte.activite.nom + '(' + compte.a_payer + ')',
                                            value: compte.compte.id,
                                            montant_attendu: compte.a_payer,
                                        },
                                        montant: compte.a_payer,
                                        debit_credit: 'credit'
                                    })
                                    current_montant = current_montant - compte.a_payer
                                } else {
                                    if (compte.a_payer > current_montant && current_montant != 0) {
                                        this.inputs.push({
                                            comptes_id: {
                                                id: compte.compte.id,
                                                text: compte.activite.nom + '(' + compte.a_payer + ')',
                                                value: compte.compte.id,
                                                montant_attendu: compte.a_payer,
                                            },
                                            montant: current_montant,
                                            debit_credit: 'credit'
                                        })
                                        current_montant = 0
                                    }
                                }
                            }
                        })

                })
                .catch((err) => window.console.log(err))
        },
        watchChange() {
            let checkValue = (this.compte != '' && this.montant != '' &&
                    this.date_versement != '' &&
                    this.inputs[this.inputs.length - 1].comptes_id != '' &&
                    this.inputs[this.inputs.length - 1].montant != '' &&
                    this.loader &&
                    this.methode_payement.value == 'ESPECES') ||
                (this.compte != '' && this.montant != '' && this.date_versement != '' &&
                    this.num_recu != '' && this.inputs[this.inputs.length - 1].comptes_id != '' &&
                    this.inputs[this.inputs.length - 1].montant != '' &&
                    this.loader && this.imageUrl != '' &&
                    this.methode_payement.value != 'ESPECES' &&
                    this.methode_payement &&
                    this.loader)

            this.$emit('child:isvalide', checkValue)
        },

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
            this.methode_payement = {
                text: this.$t(payment_mod[0].i18n),
                value: payment_mod[0].value
            }
            this.num_recu = ''
            this.logo = ''
            this.commentaire = ''
        },
        //Recupperer les activités d'un membre
        getMemberActivities() {
            var association_courante = this.$store.state.association.currentAssociation
            var membre_id = this.compte.value

            let payload = {
                resourceUrl: '/api/association/' + association_courante.id + '/membre/' + membre_id + '/activites',
                commitAction: 'SET_MEMBER_ACTIVITIES'
            }
            this.$store.dispatch("association/fetchMemberActivities", payload)
                .catch((err) => {
                    window.console.error(err)
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
        //Enregistrer un versement
        savePayment(membre_id) {
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

                this.$emit('process')

            } else {

                this.startLoading()
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

                let payload = {
                    resourceUrl: "/api/membre/" + membre_id + "/operation/en/seance",
                    commitAction: 'SET_OPERATIONS',
                    data: formData
                }
                this.$store.dispatch("association/postRequest", payload)
                    .then(() => {
                        this.montant = '',
                        this.date_versement = '',
                        this.num_recu = '',
                        this.commentaire = '',
                        this.imageUrl = '',
                        this.methode_payement = {
                            text: this.$t(payment_mod[0].i18n),
                            value: payment_mod[0].value
                        }
                        this.preuve = '',
                        this.logo = ''

                        this.inputs = [{
                            comptes_id: '',
                            montant: '',
                            debit_credit: 'credit',
                        }]
                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('operationSuccess'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })

                        this.cancel()
                    })
                    .then(() => {
                        this.$emit('request:status', {
                            status: true,
                        })
                    })
                    .then(() => this.stopLoading())
                    .catch(error => {
                        this.montant = '',
                            this.date_versement = '',
                            this.num_recu = '',
                            this.commentaire = '',
                            this.imageUrl = '',

                            this.inputs = [{
                                comptes_id: '',
                                montant: '',
                                debit_credit: 'credit',
                            }]

                        this.$vs.notify({
                            position: 'top-center',
                            text: error,
                            color: 'danger',
                            icon: 'close'
                        })
                        this.cancel()
                        this.toggleDataSidebarDetail()
                        this.$emit('request:status', {
                            status: false,
                            msg: error
                        })

                        this.stopLoading()
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
    created() {

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
                //this.newMembreProps = current_member
                this.membres = res.data.data

                this.compte = {
                    text: this.current_member.username,
                    value: this.current_member.membre_id
                }

                this.montant = this.current_member.in
                //Recupperer la liste des activités auxquelles le membre connecté est inscrit
                let payload = {
                    resourceUrl: '/api/association/' + current_association.id + '/membre/' + this.current_member.membre_id + '/activites',
                    commitAction: 'SET_MEMBER_ACTIVITIES'
                }
                this.$store.dispatch("association/fetchMemberActivities", payload)
                    .then((response) => {
                        let activites = response.data.data
                        return activites
                    })
                    .then((activites) => {
                        var account = activites

                        let current_montant = this.current_member.in

                        account.sort((a, b) => b.a_payer - a.a_payer).filter(e => e.a_payer != 0)
                            .map(compte => {

                                if (compte.a_payer == current_montant) {
                                    this.inputs.push({
                                        comptes_id: {
                                            id: compte.compte.id,
                                            text: compte.activite.nom + '(' + compte.a_payer + ')',
                                            value: compte.compte.id,
                                            montant_attendu: compte.a_payer,
                                        },
                                        montant: current_montant,
                                        debit_credit: 'credit'
                                    })
                                    current_montant = 0
                                } else {
                                    if (compte.a_payer < current_montant && current_montant != 0) {
                                        this.inputs.push({
                                            comptes_id: {
                                                id: compte.compte.id,
                                                text: compte.activite.nom + '(' + compte.a_payer + ')',
                                                value: compte.compte.id,
                                                montant_attendu: compte.a_payer,
                                            },
                                            montant: compte.a_payer,
                                            debit_credit: 'credit'
                                        })
                                        current_montant = current_montant - compte.a_payer
                                    } else {
                                        if (compte.a_payer > current_montant && current_montant != 0) {
                                            this.inputs.push({
                                                comptes_id: {
                                                    id: compte.compte.id,
                                                    text: compte.activite.nom + '(' + compte.a_payer + ')',
                                                    value: compte.compte.id,
                                                    montant_attendu: compte.a_payer,
                                                },
                                                montant: current_montant,
                                                debit_credit: 'credit'
                                            })
                                            current_montant = 0
                                        }
                                    }
                                }
                            })

                    })
                    .then(() => this.montant = this.inputs.reduce((montant, e) => montant + e.montant, 0))
                    .catch((err) => window.console.log(err))
            })
            .catch((error) => {
                window.console.error(error)
            })
        this.$emit('child:validate', this.savePayment)

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

.disabled {
    pointer-events: none;
    color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: #eef1f6;
    border-color: #d1dbe5;
}
</style>
