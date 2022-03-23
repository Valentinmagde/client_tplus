<template>
    <!-- Membres Inscrits-->
    <vx-card v-if="isReady" no-shadow :title="$t('membershipregistration') + ' ' + (activity ? ': ' + activity.nom : '')">
      <div>
        <p class="mb-5">
          {{$t('membershipRegistrationActivity')}}
        </p>
        <div class="flex justify-start">
          <p class="inline-block mt-1">{{$t('assignTheSameNumber')}}</p>
          <p class="inline-block ml-2 mb-3">
            <vs-input
                  id="montant_part"
                  type="number"
                  :min="0"
                  v-model="assign"
                  class="w-full register"
                  @change="changeInputValue(); assignerNb()" />
          </p>
        </div>
        <ul class="centerx">
            <li class="vx-col w-1/2 mt-3 inline-block"
              v-for="member in checkedMembers" :key="member.id"
              @click="selectMember($event, member.id)">
              <div class="inline-block mr-3">
                <vs-input
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

      <div class="flex flex-wrapper mt-10">
        <vs-button
          type="border"
          class="mr-6"
          @click.native="previous">
          {{$t('previous')}}
        </vs-button>

        <vs-button
          id="button-with-loading"
          @click.native="inscrireMembres"
          :disabled="checkedMembers.length == 0 || !loader">
          {{$t('next')}}
        </vs-button>
      </div>
    </vx-card>
</template>
<script>
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

import { EventBus } from '@/services/EventBus.js'

export default {
    props: ['activity'],
    data() {
        return {
            checkedMembers: [],
            unCheckedMembers: [],
            assign: 0,
            etat_input: [],
            members: [],

            /* Loader */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,

            isReady: false,
        }
    },

    methods: {
      previous(){
        this.$emit('selectedTab',0)
      },
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
      inscrireMembres(){
        this.openLoadingContained()
        let activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;
        let data = []

        if(localStorage.getItem('activity_id') !== null) {
          let $inc = 0
          /* window.console.log('magde',this.members) */
          this.checkedMembers.forEach((value)=>{
            /*  window.console.log('magde',this.checkedMembers[$inc].nombre_nom) */
            if(value.nombre_nom != this.members[$inc].nombre_nom){
              data.push({
                activites_id: activite_courante.id,
                nombre_noms: value.nombre_nom,
                membres_id: value.id
              })
            }
            $inc ++
          })
        }
        else {
            this.checkedMembers.forEach((value)=>{
            data.push({
              activites_id: activite_courante.id,
              nombre_noms: value.nombre_nom,
              membres_id: value.id
            })
          })
        }

        if(data.length > 0){

          let payload = {
            resourceUrl:"api/activite/membres/register",
            commitAction: 'SET_ACCOUNT',
            data: data
          }

          this.$store.dispatch("association/postRequest", payload)
          .then(() => {
            // let membres_selectionnes = res.data.data
            // localStorage.setItem('comptes', JSON.stringify(membres_selectionnes))
            this.$emit('selectedTab', 2)
            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
            this.loader = true
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
        else{
          this.$emit('selectedTab', 2)
        }
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
      checkAll(event, data){ // pass true or false to check or uncheck all
          if(event.target.checked == true){
            var inputs = document.getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type == "checkbox") {
                    inputs[i].checked = true;
                    // This way it won't flip flop them and will set them all to the same value which is passed into the function
                }
            }
            data.forEach((value)=>{
              if(!this.checkedMembers.includes(value.id)) this.checkedMembers.push(value.id)
            })
            this.unCheckedMembers = []
          }else{
            inputs = document.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].type == "checkbox") {
                    inputs[i].checked = false;
                    // This way it won't flip flop them and will set them all to the same value which is passed into the function
                }
            }
            data.forEach((value)=>{
              if(!this.unCheckedMembers.includes(value.id)) this.unCheckedMembers.push(value.id)
            })
            this.checkedMembers = []
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
      EventBus.$emit('loader', true);

      let current_association = this.$store.state.association.currentAssociation

      let payload = {
        resourceUrl: '/api/association/' + current_association.id + '/membre',
        commitAction: 'SET_MEMBERS'
      }

      this.$store.dispatch("association/fetchMembers",payload)
      .then((res)=>{
        let membres = res.data.data

        if(localStorage.getItem('activity_id') !== null) {
          var activite = this.activity !== '' ? this.activity : this.$store.state.association.activite;
          let payload = {
              resourceUrl: '/api/activite/'+activite.id+'/comptes/all',
              commitAction: 'SET_ACCOUNTS'
          }

          this.$store.dispatch("association/fetchComptemembreActivite", payload)
          .then((res) => {
            this.checkedMembers = []
            this.members = []
            let membres_incris = res.data.data

            membres_incris.forEach(element => {
              this.checkedMembers.push(
                {
                  id: element.membres_id,
                  firstName: element.membre,
                  nombre_nom: element.nombre_noms,
                }
              )

              this.members.push(
                {
                  id: element.membres_id,
                  firstName: element.membre,
                  nombre_nom: element.nombre_noms,
                }
              )
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
          })
          .then(() => {EventBus.$emit('loader', false); this.isReady = true})
          .catch((error) => {window.console.error(error); this.isReady = true})
        }
        else{
          this.members = []
          this.checkedMembers = []

          membres.forEach((value)=>{
            if(value.etat != 'desactivate'){
              this.members.push(
                {
                  id: value.id,
                  lastName: value.lastName,
                  firstName: value.firstName,
                  nombre_nom: 0,
                }
              )

              this.checkedMembers.push(
                {
                  id: value.id,
                  lastName: value.lastName,
                  firstName: value.firstName,
                  nombre_nom: 0,
                }
              )
            }
          })

          this.isReady = true; EventBus.$emit('loader', false);
        }
      })
      .catch((error)=>{window.console.log(error); this.isReady = true})
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
