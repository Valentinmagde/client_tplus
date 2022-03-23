<template>
    <div>
        <!-- ACTION - DROPDOWN -->
        <action-button v-if="admin"/>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <vx-card class="mb-6">
                <h5>{{$t('moveFunds') | CAPITALIZE }}</h5>
                <p class="mt-2 text-muted">{{$t('moveFundsSubtitle')}}</p>
            </vx-card>
            <vx-card>
                <div class=" clearfix mr-auto max-w-3xl">
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('source')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                        <v-select
                            label="text"
                            :options="selectOptionsActivities"
                            v-model="source"
                            class="mt-4 w-full "/>
                        </div>
                    </div>
                    <div class="vx-row">
                        <div class="vx-col sm:w-1/3 w-full">
                            <p class="vx-row mt-4 justify-end">
                                {{$t('destination')}} *:
                            </p>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                        <v-select
                            label="text"
                            :options="selectOptionsActivities"
                            v-model="destination"
                            class="mt-4 w-full "/>
                        </div>
                    </div>
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
                            <div>
                                <vs-button class="mt-6 mr-4" type="border" @click.native="cancel">{{$t('cancel')}}</vs-button>
                                <vs-button class="mt-4" id="button-with-loading"  @click="saveTransfer()" :disabled="!validateForm">{{$t('save')}}</vs-button>
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
import {Money} from 'v-money'
import Vue from 'vue'
import 'flatpickr/dist/flatpickr.css';
import {vsSelect} from 'vuesax'
import vSelect from 'vue-select'

//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleFinance from "@/store/finance/moduleFinance.js"

import checkIfAdmin from '../../../../mixins/checkRole'

Vue.use(vsSelect)
export default {

    mixins: [checkIfAdmin],


    data(){
        return {
            source: '',
            destination: '',
            montant: '',
            commentaire: '',
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true
        }
    },
    components: {
      'v-select': vSelect,
      Money,
      ActionButton
    },
    computed: {
        admin(){
          return this.hasRole('Financier');
        },
        validateForm() {
            return this.source != '' && this.montant != '' && this.destination !='' && this.loader
        },
        membreData(){
            return this.$store.state.association.members
        },
        memberActivities(){
            return this.$store.state.association.member_activities
        },
        selectOptionsActivities(){
            if(this.memberActivities != null)
                return this.memberActivities.map(activity => {

                        let libelle = activity.activite.nom
                        if(activity.activite.type != 'caisse' && activity.activite.type != 'Generique')
                            libelle = activity.activite.type +' - '+ activity.activite.nom

                        return {
                            id: activity.compte.id,
                            text: libelle+'('+activity.compte.solde+')',
                            value:activity.compte.id,
                            solde: activity.compte.solde
                        }
                    }
                )
        },
    },
    methods:{
        /*
        *@param members
        *@return id  //retourne l'id membre de l'utilisateur connecté
        */
        extractMember(members){
            var user = this.$store.state.authentificated.user
            var id

            members.forEach(member => {
                member.users.forEach(author => {
                    if(user.id == author.id) {
                    id = member.id
                    }
                })
            })
            return id
        },
        cancel(){
            this.source = ''
            this.montant = ''
            this.destination = ''
            this.commentaire = ''
        },
        //Recupperer les activités d'un membre
        getMemberActivities(){
            var association_courante = this.$store.state.association.currentAssociation
            var membre_id = this.extractMember(this.membreData)

            let payload = {
              resourceUrl:'/api/association/'+association_courante.id+'/membre/'+membre_id+'/activites',
              commitAction: 'SET_MEMBER_ACTIVITIES'
            }
            this.$store.dispatch("association/fetchMemberActivities", payload)
            .then((res)=>{
                var activites = res.data.data

                let libelle = activites[0].activite.nom
                if(activites[0].activite.type != 'caisse' && activites[0].activite.type != 'Generique')
                    libelle = activites[0].activite.type +' - '+ activites[0].activite.nom

                this.destination = this.source = {
                    text : libelle+'('+activites[0].compte.solde+')',
                    value: activites[0].compte.id,
                    solde: activites[0].compte.solde
                }
            })
            .catch((error)=>{window.console.error(error)})
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

        saveTransfer(){
            //Verifier si le montant de la source est inferieur au montant du virement
            if(this.source.solde < this.montant){
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('transfertWarning1'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                })
            }
            else if(this.source.value == this.destination.value){
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('transfertWarning2'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                })
            }else{
                this.openLoadingContained()
                var user = this.$store.state.association.currentAssociation
                let payload = {
                    resourceUrl:"/api/comptes/solde/transfert",
                    commitAction: 'SET_VIREMENTS',
                    data: {
                        montant: this.montant,
                        expediteur: this.source.value,
                        recepteur: this.destination.value,
                        libelle: this.commentaire,
                        created_by: user.id
                    }
                }
                this.$store.dispatch("association/postRequest", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.$vs.notify({
                        position:'top-center',

                        text: this.$t('transferCompletedSuccessfully'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    setTimeout( () => this.$router.push('/association/administration/finances/operations'), 1000)
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
    },
    created(){
      var current_association = this.$store.state.association.currentAssociation


        let payload = {
            resourceUrl: '/api/association/' + current_association.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers",payload)
        .then(()=>{this.getMemberActivities() })
        .catch((error)=>{window.console.error(error)})
    },
}
</script>
