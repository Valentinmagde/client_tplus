<template>
<!-- Membres Inscrits-->
<vx-card v-if="isReady" no-shadow class="mt-2" :title="$t('membershipRegistrationTontine') +' '+nom_tontine">
    <p v-if="!type_tontine" class="mb-5">
        {{$t('pleaseFillInTheActivityParametersFirst')}}
    </p>
    <!-- Part Variable -->
    <div v-if="type_tontine=='VARIABLE' && part_cotisation == 0">
        <p @click="checkAll($event, usersData)">
            <vs-checkbox :checked="checkedMembers.length == usersData.length" class="mb-3">{{$t('selectAll')}}</vs-checkbox>
        </p>
        <ul class="centerx">
            <li class="vx-col w-1/2 mt-3 inline-block" v-for="member in usersData" :key="member.id" @click="selectMember($event, member.id)">
                <vs-checkbox :checked="checkedMembers.includes(member.id)">
                    {{ member.firstName }} {{ member.lastName }}
                </vs-checkbox>
            </li>
        </ul>
    </div>
    <!-- Part Variable cotisation à la discrétion du membre-->
    <div v-if="type_tontine=='VARIABLE' && part_cotisation == 1">
        <p class="mb-5">
            {{$t('membershipRegistrationTontineAmount')}}
        </p>
        <div class="flex justify-start">
            <p class="inline-block mt-1">{{$t('assignTheSameAmount')}}</p>
            <p class="inline-block ml-2 mb-3">
                <money v-model="montant" class="w-full align-center money-input" v-bind="money" />
            </p>
        </div>
        <ul class="centerx">
            <li class="vx-col w-1/2 mt-3 inline-block" v-for="member in members" :key="member.id" @click="selectMember($event, member.id)">
                <div class="inline-block mr-3">
                    <money v-model="member.montant_cotisation" class="w-full align-center money-input" v-bind="money" />
                </div>
                <div class="inline-block">
                    {{ member.firstName }} {{ member.lastName }}
                </div>
                <!--  <vs-checkbox :checked="checkedMembers.includes(member.id)"> {{ member.firstName }} {{ member.lastName }} </vs-checkbox> -->
            </li>
        </ul>
    </div>

    <!-- Part Fixe-->
    <div v-if="type_tontine=='FIXE'">
        <p class="mb-5">
            {{$t('membershipRegistrationTontineSubtitle')}}
        </p>
        <div class="flex justify-start">
            <p class="inline-block mt-1">{{$t('assignTheSameNumber')}}</p>
            <p class="inline-block ml-2 mb-3">
                <vs-input id="montant_part" type="number" :min="0" v-model="assign" class="w-full register" @change="changeInputValue(); assignerNb()" />
            </p>
        </div>
        <ul class="centerx">
            <li class="vx-col w-1/2 mt-3 inline-block" v-for="member in members" :key="member.id" @click="selectMember($event, member.id)">
                <div class="inline-block mr-3">
                    <vs-input id="montant_part" type="number" :min="0" v-model="member.nombre_nom" class="w-full register" @change="changeInputValue" />
                </div>
                <div class="inline-block">
                    {{ member.firstName }} {{ member.lastName }}
                </div>
                <!--  <vs-checkbox :checked="checkedMembers.includes(member.id)"> {{ member.firstName }} {{ member.lastName }} </vs-checkbox> -->
            </li>
        </ul>
    </div>
    <div class="flex flex-wrapper mt-10">
        <vs-button v-if="!etat_tontine" type="border" class="mr-6" @click.native="previous">
            {{$t('previous')}}
        </vs-button>

        <vs-button class="ml-3 vs-con-loading__container" ref="loadableButton" id="button-with-loading" @click.native="inscrireMembres" :disabled="!validateForm || !type_tontine">
            {{$t('next')}}
        </vs-button>
    </div>
</vx-card>
</template>

<script>
import {
    Money
} from 'v-money'
//Store
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
import { EventBus } from '@/services/EventBus.js'

export default {
    props: ['activity' ,'etat_tontine'],
    data() {
        return {
            etat_input: [],
            nom_tontine: '',
            type_tontine: null,
            part_cotisation: 0,
            checkedMembers: [],
            unCheckedMembers: [],
            members: [],
            nb_nom: 1,
            assign: 0,
            attribution_cagnote: '',
            date_debut: '',
            montant: 0,
            cmpt: 0,

            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false,
                /* prefix: ' ' */
            },

            /* Loader */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,

            isReady: false
        }
    },
    components: {
        Money
    },
    computed: {
        usersData() {
            let membres = this.$store.state.association.members
            let data = []

            if (membres.length > 0) {
                membres.forEach(membre => {
                    if (membre.etat != 'desactivate') {
                        data.push(membre)
                    }
                })
            }
            return data
        },
        validateForm() {
            return this.checkedMembers.length > 0 || this.nb_nom > 0 || this.loader
        }
    },

    watch: {
        montant: function (newValue) {
            this.assignerAmount(newValue)
        }
    },
    mounted() {
        // if (localStorage.getItem('tontine_modif') !== null) {
        //     var activite_modif = JSON.parse(localStorage.getItem('tontine_modif'));
        //     if (activite_modif.etat == 'actif') {
        //         localStorage.setItem('activite_creee', JSON.stringify(activite_modif))
        //         localStorage.setItem('tontine_creee', JSON.stringify(activite_modif.Tontine))
        //     }
        // }
        if (localStorage.getItem('activity_id') !== null) {
            var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;
            this.nom_tontine = activite_courante.nom.toUpperCase()

        // if (localStorage.getItem('tontine_creee') !== null) {
            var tontine_courante = activite_courante.Tontine

            this.type_tontine = tontine_courante.type
            this.part_cotisation = tontine_courante.part_cotisation
            this.attribution_cagnote = tontine_courante.attribution_cagnote
            this.date_debut = tontine_courante.date_debut

            if ((tontine_courante.attribution_cagnote == "ENCHERE" &&
                    new Date(tontine_courante.date_debut * 1000) > new Date()) ||
                tontine_courante.type == "VARIABLE" && tontine_courante.part_cotisation == 0)
                this.$emit('disable', true)
            else this.$emit('disable', false)
        }

    },
    methods: {
        //Attribuer le même nombre de noom à tous les membres
        assignerNb() {
            let $inc = 0
            this.members.forEach(() => {
                this.members[$inc].nombre_nom = this.assign

                $inc++
            })
        },

        assignerAmount(montant) {
            let $inc = 0
            this.members.forEach(() => {
                this.members[$inc].montant_cotisation = montant

                $inc++
            })

        },
        //Controller l'événement sur le nombre de part
        changeInputValue() {
            this.etat_input.push(1)
        },
        //Exraction de noms des membres inscris et le nombre de part à partir des lots
        extracMember(lots) {
            var membres = []
            var membres_tries = []

            if (lots.length > 0) {
                //Extraire les noms et les id des membres dans les differents lots
                lots.forEach(element => {
                    membres.push({
                        nom: element.membre,
                        id: element.membres_id,
                        montant: element.montant
                    }, )
                })

                //Compter les noms en double dans le tableau membre et
                //les stokés dans le tableau membres_tries avec leurs occurrences
                for (let i = 0; i < membres.length - 1; i++) {
                    let $inc = 1
                    for (let index = i + 1; index < membres.length; index++) {
                        if (membres[i].nom == membres[index].nom) {
                            $inc++
                        }
                    }
                    /* window.console.log(membres[i].nom) */
                    if (!(membres_tries.some(element => element.nom === membres[i].nom))) {
                        membres_tries.push({
                            nom: membres[i].nom,
                            part: $inc,
                            membres_id: membres[i].id,
                            montant_cotisation: membres[i].montant
                        });
                    }
                }

                let $index = 1
                /* window.console.log(membres[membres.length-1].nom) */
                for (let j = 0; j < membres.length - 1; j++) {
                    if (membres[membres.length - 1].nom == membres[j].nom) {
                        $index++
                        /* window.console.log(membres[j].nom) */
                    }
                }
                if ($index == 1) {
                    membres_tries.push({
                        nom: membres[membres.length - 1].nom,
                        part: $index,
                        membres_id: membres[membres.length - 1].id,
                        montant_cotisation: membres[membres.length - 1].montant
                    });
                }
            }
            return membres_tries
        },
        previous() {
            this.$emit('selectedTab', 0)
        },
        inscrireMembres() {
            /*  window.console.log('magde',this.members) */
            if (JSON.parse(localStorage.getItem('activity_id')) !== null) {
                this.openLoadingContained()
                var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

                let data = []
                if (this.type_tontine == 'VARIABLE') { //Vérifier si la tontine est de type variable
                     if (this.part_cotisation == 1) {
                        if (localStorage.getItem('activity_id') !== null) { //Vérifier si c'est la modification de la tontine
                            let $cpt = 0
                            let isDifferent =  false

                            this.members.forEach((value) => {
                                if (value.montant_cotisation != this.checkedMembers[$cpt].montant_cotisation) {
                                    isDifferent = true
                                }
                                $cpt++
                            })

                            if(isDifferent){
                                this.members.forEach((value) => {
                                    if (value.montant_cotisation > 0) {
                                        data.push({
                                            activites_id: activite_courante.id,
                                            nombre_noms: 1,
                                            membres_id: value.id,
                                            montant_part: value.montant_cotisation
                                        })
                                    }
                                })
                            }
                        }
                        
                        else{
                            this.members.forEach((value) => {
                                if(value.montant_cotisation > 0){
                                    data.push({
                                        activites_id: activite_courante.id,
                                        nombre_noms: 1,
                                        membres_id: value.id,
                                        montant_part: value.montant_cotisation
                                    })
                                }
                            })
                        }
                    }
                    if (this.part_cotisation == 0) {
                        this.checkedMembers.forEach((value) => { //Tableau des membres selectionnés
                            /* window.console.log('magde',value) */
                            let object = {
                                activites_id: activite_courante.id,
                                membres_id: value,
                                nombre_noms: 1
                            }

                            data.push(object) //Data à envoyer en bd
                        })
                    }

                }

                if (this.type_tontine == 'FIXE') { //Vérifier si la tontine est de type fixe
                    if (localStorage.getItem('activity_id') !== null) { //Vérifier si c'est la modification de la tontine
                        var $inc = 0
                        /* window.console.log('magde',this.members) */
                        this.members.forEach((value) => {
                            /*  window.console.log('magde',this.checkedMembers[$inc].nombre_nom) */
                            if (value.nombre_nom != this.checkedMembers[$inc].nombre_nom) {
                                data.push({
                                    activites_id: activite_courante.id,
                                    nombre_noms: value.nombre_nom,
                                    membres_id: value.id,
                                    montant: 0
                                })
                            }

                            $inc++
                        })
                    } else {
                        this.members.forEach((value) => {
                            data.push({
                                activites_id: activite_courante.id,
                                nombre_noms: value.nombre_nom,
                                membres_id: value.id,
                                montant: 0
                            })
                        })
                    }
                }
                //Enregistrement des comptes membres dans une activite
                if (localStorage.getItem('activity_id') !== null && (this.etat_input.length == 0 && this.type_tontine == 'FIXE') ||
                    data.length == 0) { // Passer à la page suivante sans mettre à jours les lots et le calendrier
                    this.$emit('selectedTab', 2)
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.loader = true
                } else if (data.length > 0) {
                    let payload = {}

                    if (this.type_tontine == 'VARIABLE' && this.part_cotisation == 1) {
                        window.console.log(data)
                        let association_courante = this.$store.state.association.currentAssociation
                        let tontine_courante = this.$store.state.association.activite.Tontine
                        payload = {
                            resourceUrl: "api/association/" + association_courante.id + "/tontine/" + tontine_courante.id + "/tontinevariable/unique/echeanciers",
                            commitAction: 'SET_ACCOUNTS',
                            data: data
                        }
                    } else {
                        payload = {
                            resourceUrl: "api/activite/membres/register",
                            commitAction: 'SET_ACCOUNTS',
                            data: data
                        }
                    }

                    this.$store.dispatch("association/postRequest", payload)
                        .then(() => {
                            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                            this.loader = true
                            var membres_inscris = []
                            data = []

                            let payload = {
                                resourceUrl: '/api/activite/' + activite_courante.id + '/comptes/all',
                                commitAction: 'SET_ACCOUNTS'
                            }

                            this.$store.dispatch("association/fetchComptemembreActivite", payload)
                                .then((res) => {
                                    var comptes = res.data.data

                                    if (this.type_tontine == 'VARIABLE' && this.part_cotisation == 0) {
                                        // let membres_selectionnes = this.checkedMembers

                                        // localStorage.setItem('membres_selectionnes', JSON.stringify(membres_selectionnes))
                                        this.unCheckedMembers.forEach((value) => {
                                            /* window.console.log(value) */
                                            let object = {
                                                activites_id: activite_courante.id,
                                                membres_id: value,
                                                nombre_noms: 0
                                            }

                                            data.push(object)
                                        })

                                        //Retrait des comptes non selectionés
                                        if (data.length > 0) {
                                            let payload = {
                                                resourceUrl: "api/activite/membres/register",
                                                commitAction: 'SET_ACCOUNTS',
                                                data: data
                                            }
                                            this.$store.dispatch("association/postRequest", payload)
                                        }
                                    }

                                    comptes.forEach(element => {
                                        membres_inscris.push({
                                            activites_id: element.activites_id,
                                            nombre_noms: element.nombre_noms,
                                            membres_id: element.membres_id,
                                            id: element.id
                                        })
                                    });

                                    // localStorage.setItem('comptes', JSON.stringify(res.data.data))

                                    if ((this.attribution_cagnote == "ENCHERE" 
                                        && new Date(this.date_debut * 1000) > new Date()) 
                                        || (this.type_tontine == 'VARIABLE' && this.part_cotisation == 0)
                                    )
                                        this.$emit('selectedTab', 3)
                                    else this.$emit('selectedTab', 2)
                                })
                                .catch(error => {
                                    this.$vs.notify({
                                        position: 'top-center',
                                        text: error,
                                        iconPack: 'feather',
                                        icon: 'icon-alert-circle',
                                        color: 'danger'
                                    })
                                })
                        })
                        .catch(error => {
                            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                            this.loader = true
                            this.$vs.notify({
                                position: 'top-center',
                                text: error,
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        })
                }
            }
        },
        selectMember(event, id) {
            // pass true or false to check or uncheck all
            if (event.target.checked == true) {
                this.checkedMembers.push(id);
            } else {
                this.unCheckedMembers.push(id)
                this.checkedMembers = this.checkedMembers.filter(function (value) {
                    return value != id
                })
            }
        },
        checkAll(event, data) { // pass true or false to check or uncheck all
            this.checkedMembers = []
            this.unCheckedMembers = []
            if (event.target.checked == true) {
                var inputs = document.getElementsByTagName("input");
                for (var i = 0; i < inputs.length; i++) {
                    if (inputs[i].type == "checkbox") {
                        inputs[i].checked = true;
                        // This way it won't flip flop them and will set them all to the same value which is passed into the function
                    }
                }
                data.forEach((value) => {
                    if (!this.checkedMembers.includes(value.id)) this.checkedMembers.push(value.id)
                })
                this.unCheckedMembers = []
            } else {
                inputs = document.getElementsByTagName("input");
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].type == "checkbox") {
                        inputs[i].checked = false;
                        // This way it won't flip flop them and will set them all to the same value which is passed into the function
                    }
                }
                data.forEach((value) => {
                    if (!this.unCheckedMembers.includes(value.id)) this.unCheckedMembers.push(value.id)
                })
                this.checkedMembers = []
            }
        },

        /* Loading */
        openLoadingContained() {
            this.loader = false,
                this.$vs.loading({
                    background: this.backgroundLoading,
                    color: this.colorLoading,
                    container: "#button-with-loading",
                    scale: 0.45
                });
        },
    },
    created() {
      EventBus.$emit('loader', true)
        var current_association = this.$store.state.association.currentAssociation

        let payload = {
            resourceUrl: '/api/association/' + current_association.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers", payload)
            .then((res) => {
                var comptes = []
                var membres = res.data.data
                // let tontine_en_cours = this.activity !== '' ? this.activity.Tontine : this.$store.state.association.activite.Tontine;

                //Tontine fixe
                /* window.console.log(tontine_en_cours) */

                if (localStorage.getItem('activity_id') !== null) {
                    //Tontine en cours de modification
                    let activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;
                    var tontine_courante = this.activity !== '' ? this.activity.Tontine : this.$store.state.association.activite.Tontine;


                    if (tontine_courante.type === 'VARIABLE' && tontine_courante.part_cotisation == 0) {
                      let payload = {
                        resourceUrl: '/api/association/'+current_association.id+'/tontine/'+tontine_courante.id+'/lots',
                        commitAction: 'SET_LOTS'
                      }
                      this.$store.dispatch("association/fetchAssociationactivite", payload)
                      .then((res) => {
                        var lots = res.data.data
                        this.checkedMembers = []
                        lots.forEach(element => {
                            membres.forEach(membre => {
                                if (element.membre.trim() === membre.firstName.trim())
                                    if (!this.checkedMembers.includes(membre.id))
                                        this.checkedMembers.push(membre.id)
                            })
                        })
                        EventBus.$emit('loader', false); this.isReady = true
                      })

                    } 
                    else {
                        let payload = {
                            resourceUrl: '/api/activite/' + activite_courante.id + '/comptes/all',
                            commitAction: 'SET_ACCOUNTS'
                        }

                        this.$store.dispatch("association/fetchComptemembreActivite", payload)
                        .then((res) => {
                          /* window.console.log(lots) */
                          comptes = res.data.data
                          this.members = []

                          comptes.forEach((value) => {
                              if(!value.deleted_at){
                                this.members.push({
                                    id: value.membres_id,
                                    firstName: value.membre,
                                    nombre_nom: value.nombre_noms,
                                    montant_cotisation: value.montant_cotisation
                                })

                                this.checkedMembers.push({
                                    id: value.id,
                                    firstName: value.firstName,
                                    nombre_nom: value.nombre_noms,
                                    montant_cotisation: value.montant_cotisation
                                })
                              }
                            
                          })

                        //Ajout des membres de l'association ne faisant pas parti de la tontine
                        membres.forEach((value) => {
                          if (!(this.members.some(element => element.firstName.trim() === value.firstName.trim()))) {
                            if (value.etat != 'desactivate') {
                              this.members.push({
                                id: value.id,
                                firstName: value.firstName,
                                nombre_nom: 0,
                                montant_cotisation: 0
                              })
                              this.checkedMembers.push({
                                id: value.id,
                                firstName: value.firstName,
                                nombre_nom: 0,
                                 montant_cotisation: 0
                              })
                            }
                          }
                        })
                        EventBus.$emit('loader', false); this.isReady = true
                      })
                      .catch((error) => {
                        window.console.error(error)
                      })
                    }

            }
            else
              EventBus.$emit('loader', false); this.isReady = true

          })
          .catch((error) => {
            window.console.error(error)
          })
    }
}
</script>

<style>
.register .vs-input--input {
    text-align: center;
    border-radius: 20px;
    width: 80px;
    height: 30px;
}

.align-center {
    width: 120px !important;
    height: 28px;
    border-radius: 10px;
    text-align: center !important;
}
</style>
