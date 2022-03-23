<template>
    <div>
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;" />
        <div class="pt-16">
            <!-- Membres Inscrits-->
            <vx-card
                v-if="activite_courante"
                no-shadow
                :title="$t('membershipregistration') +' '+nom_activite">
                <div v-if="activite_courante.type == 'Generique' ||
                    activite_courante.type == 'caisse'">
                    <p class="mb-5">
                    {{$t('membershipRegistrationActivity')}}
                    </p>
                    <ul class="centerx">
                        <li class="vx-col w-1/2 mt-3 inline-block"
                            v-for="member in checkedMembers" :key="member.id"
                            @click="selectMember($event, member.id)">

                            <div class="inline-block mr-3">
                                <vs-input
                                    :disabled="member.etat=='exist'"
                                    id="montant_part"
                                    type="number"
                                    :min="0"
                                    v-model="member.nombre_nom"
                                    class="w-full register"
                                    @change="changeInputValue" />
                            </div>
                            <div class="inline-block">
                                {{ member.firstName }} {{ member.lastName }}
                            </div>
                            <!--  <vs-checkbox :checked="checkedMembers.includes(member.id)"> {{ member.firstName }} {{ member.lastName }} </vs-checkbox> -->
                        </li>
                    </ul>
                </div>
                <div v-if="activite_courante.type == 'Evenement' ||
                        activite_courante.type == 'Solidarite' ||
                        activite_courante.type == 'Mutuelle'">
                    <ul class="centerx">
                        <li class="vx-col w-1/2 mt-3 inline-block"
                            v-for="member in association_members" :key="member.id"
                            @click="selectMember($event, member.id)">

                            <vs-checkbox
                                :checked="checkedMembers.includes(member.id)"
                                :disabled="members.includes(member.id)">
                                {{ member.firstName }} {{ member.lastName }}
                            </vs-checkbox>
                        </li>
                    </ul>
                </div>
            </vx-card>

            <div class="flex justify-end mt-10">
                <vs-button
                id="button-with-loading"
                @click="inscrireMembres"
                :disabled="checkedMembers.length == 0 || !loader">
                    {{$t('save')}}
                </vs-button>
            </div>
        </div>
    </div>
</template>
<script>

import {
    getActivity,
    getAssociationMembers,
    getActivityAccounts,
    registerMembers
} from '../services/api'

export default {
    data() {
        return {
            checkedMembers: [],
            unCheckedMembers: [],
            assign: 0,
            etat_input: [],
            members: [],
            association_members: [],
            activite_courante: null,
            nom_activite: '',
            /* Loader */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true
        }
    },

    methods: {
      //Attribuer le même nombre de noom à tous les membres
      assignerNb(){
        let $inc = 0
        this.checkedMembers.forEach(()=>{
          this.checkedMembers[$inc].nombre_nom = this.assign

          $inc++
        })
      },

      //Controller l'événement sur le nombre de part
      changeInputValue(){
        this.etat_input.push(1)
      },

      redirectActivities(tr){
            let route, activity_type = tr.type

            switch (activity_type) {
                case "Generique":
                    route = 'association:administration:activities:generic:details'
                    break;
                case "caisse":
                    route = 'association:administration:activities:generic:details'
                    break;

                case "Tontine":
                    route = 'association:administration:activities:tontine:details'
                    break;

                case "Evenement":
                    route = 'association:administration:activities:event:details'
                    break;

                case "Mutuelle":
                    route = 'association:administration:activities:mutual:details'
                    break;

                case "Solidarite":
                    route = 'association:administration:activities:solidarity:details'
                    break;

                default:
                    break;
            }

            this.$router.push({name: route}).catch(() => {})
      },

      inscrireMembres(){
        this.openLoadingContained()

        let data = []

        let $inc = 0

        if(this.activite_courante && (this.activite_courante.type == 'Generique'
            || this.activite_courante.type == 'caisse')){
            this.checkedMembers.forEach((value)=>{
                if(value.nombre_nom != this.members[$inc].nombre_nom){
                    data.push({
                        activites_id: this.activite_courante.id,
                        nombre_noms: value.nombre_nom,
                        membres_id: value.id
                    })
                }
                $inc ++
            })
        }
        else if(this.activite_courante && (this.activite_courante.type == 'Evenement' ||
                this.activite_courante.type == 'Solidarite' || this.activite_courante.type == 'Mutuelle')){
            this.checkedMembers.forEach((value)=>{
                if(!this.members.includes(value)){
                    data.push({
                        activites_id: this.activite_courante.id,
                        nombre_noms: 1,
                        membres_id: value
                    })
                }
                $inc ++
            })
        }


        if(data.length > 0){

          registerMembers({
              data: data
          })
          .then(() => {
            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
            this.loader = true

            this.redirectActivities(this.activite_courante)
          })
          .catch(error => {
            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
            this.loader = true
            this.$vs.notify({
              position:'top-center',
              text: error,
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger'
            })
          })
        }
        else
            this.redirectActivities(this.activite_courante)
      },

      selectMember(event, id){
          // pass true or false to check or uncheck all
        if(event.target.checked == true){
          if(!this.checkedMembers.includes(id)) this.checkedMembers.push(id);
          if(this.unCheckedMembers.includes(id)){
              let index = this.unCheckedMembers.indexOf(id)

              this.unCheckedMembers.splice(index, 1)
          }
        }else{
            if(!this.unCheckedMembers.includes(id)) this.unCheckedMembers.push(id)
            this.checkedMembers = this.checkedMembers.filter(function(value){
              return value != id
            })
        }
      },

      /* Loading */
      openLoadingContained(){
          this.loader = false,
          this.$vs.loading({
              background: this.backgroundLoading,
              color: this.colorLoading,
              container: "#button-with-loading",
              scale: 0.45
          });
      },
    },

    created(){
        let current_association = this.$store.state.association.currentAssociation

        getActivity({
            assId: current_association.id,
            actId: this.$route.params.actId
        })
        .then((response)=>{
            this.activite_courante = response.data.data
            this.nom_activite = this.activite_courante.nom
            getAssociationMembers({
                assId: current_association.id
            })
            .then((members)=>{
                let membres = members.data.data
                this.association_members = []
                if(membres.length > 0){
                    membres.forEach(membre=>{
                        if(membre.etat != 'desactivate'){
                            this.association_members.push(membre)
                        }
                    })
                }
                getActivityAccounts({
                    actId: this.$route.params.actId
                })
                .then((accounts) => {
                    this.checkedMembers = []
                    this.members = []

                    let membres_incris = accounts.data.data

                    if(this.activite_courante.type == 'Generique'
                        || this.activite_courante.type == 'caisse'){
                        membres_incris.forEach(element => {
                            this.checkedMembers.push(
                                {
                                    id: element.membres_id,
                                    firstName: element.membre,
                                    nombre_nom: element.nombre_noms,
                                    etat: 'exist'
                                }
                            )

                            this.members.push(
                            {
                                id: element.membres_id,
                                firstName: element.membre,
                                nombre_nom: element.nombre_noms,
                            })
                        })

                        //Ajout des membres de l'association ne faisant pas parti de l'activité'
                        membres.forEach((value)=>{
                            if(!(this.checkedMembers.some(element => element.firstName.trim() === value.firstName.trim()))){
                                if(value.etat != 'desactivate'){
                                    this.checkedMembers.push(
                                        {
                                            id: value.id,
                                            firstName: value.firstName,
                                            nombre_nom: 0,
                                            etat: 'not_exist'
                                        }
                                    )

                                    this.members.push(
                                    {
                                        id: value.membres_id,
                                        firstName: value.membre,
                                        nombre_nom: value.nombre_noms,
                                    })
                                }
                            }
                        })
                    }
                    else{
                        this.checkedMembers = []
                        this.members = []
                        membres_incris.forEach(element => {
                            this.checkedMembers.push(element.membres_id)
                            this.members.push(element.membres_id)
                        })
                    }
                })
                .catch((error) => {
                    window.console.error(error)
                })
            })
            .catch((error)=>{window.console.log(error)})
        })
        .catch((err)=>{
            window.console.error(err)
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
</style>
