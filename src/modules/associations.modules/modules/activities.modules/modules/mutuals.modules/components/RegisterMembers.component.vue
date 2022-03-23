<template>
    <!-- Membres Inscrits-->
    <vx-card no-shadow class="mt-2" :title="$t('membershipregistration') +' : '+activity.nom">
        <p @click="checkAll($event, usersData)">
        <vs-checkbox :checked="checkedMembers.length == usersData.length" class="mb-3">{{$t('selectAll')}}</vs-checkbox>
        </p>
        <div class="vx-row">
        <div class="vx-col w-full">

          <ul class="centerx">
              <li class="vx-col w-1/2 mt-3 inline-block" v-for="member in usersData" :key="member.id" @click="selectMember($event, member.id)">
                <vs-checkbox :checked="checkedMembers.includes(member.id)">
                  {{ member.firstName }} {{ member.lastName }}
                </vs-checkbox>
              </li>
          </ul>
          <div class="flex flex-wrapper mt-10">
            <vs-button
              type="border"
              class="mr-6"
              @click.native="previous">
              {{$t('previous')}}
            </vs-button>

            <vs-button
              class="ml-3 vs-con-loading__container"
              ref="loadableButton"
              id="button-with-loading"
              @click.native="inscrireMembres"
              :disabled="checkedMembers.length == 0 || !loader">
              {{$t('next')}}
            </vs-button>
          </div>
        </div>
        </div>
    </vx-card>
</template>
<script>
import { EventBus } from '@/services/EventBus'
export default {
    props: ['activity'],
    data() {
        return {
            checkedMembers: [],
            unCheckedMembers: [],

            /* Loader */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true
        }
    },
    computed: {
        usersData() {
            let membres = this.$store.state.association.members
            let data = []

            if(membres.length > 0){
              membres.forEach(membre=>{
                if(membre.etat != 'desactivate'){
                  data.push(membre)
                }
              })
            }
            return data
        },
        compteMemberData() {
          return this.$store.state.association.accounts
        },
    },
    /* mounted(){
      this.checkedMembers = []
      this.compteMemberData.forEach((value)=>{
          this.checkedMembers.push(
            value.membres_id,
          )
        })
    }, */
    methods: {
        previous(){
          this.$emit('selectedTab',0)
        },
        inscrireMembres(){
            this.openLoadingContained()
            var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite;

            let data = []
            this.checkedMembers.forEach((value)=>{
              let object = {
                activites_id: activite_courante.id,
                membres_id: value,
                nombre_noms: 1
              }

              data.push(object)
            })
             let payload = {
              resourceUrl:"api/activite/membres/register",
              commitAction: 'SET_ACCOUNT',
              data: data
            }

            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
              let accounts = []

              if(accounts.length > 0){
                let comptes = []

                accounts.forEach((value)=>{
                  if(this.unCheckedMembers.some(id => id === value.membres_id)){
                    comptes.push(value.id)
                  }
                })

                //Retrait des comptes non selectionés
                if(comptes.length > 0){
                  let payload = {
                    resourceUrl:"api/activite/membres/comptes/delete",
                    commitAction: 'REMOVE_ACCOUNT',
                    data: {
                      comptes : comptes
                    }
                  }
                  this.$store.dispatch("association/postRequest", payload)
                }
              }

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
        },
        selectMember(event, id){
           // pass true or false to check or uncheck all
          if(event.target.checked == true){
            this.checkedMembers.push(id);

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
      .then(()=>{
        if(localStorage.getItem('activity_id') !== null) {
          var activite = this.activity !== '' ? this.activity : this.$store.state.association.activite;
          let payload = {
              resourceUrl: '/api/activite/'+activite.id+'/comptes/all',
              commitAction: 'SET_ACCOUNTS'
          }

          this.$store.dispatch("association/fetchComptemembreActivite", payload)
          .then((res) => {
              this.checkedMembers = []
              let membres_incris = res.data.data
              membres_incris.forEach(element => {
                this.checkedMembers.push(element.membres_id)
              })
          })
          .catch((error) => {window.console.error(error)})
        }
      })
      .then(() => {EventBus.$emit('loader', false); this.isReady = true})
      .catch((error) => {window.console.error(error); this.isReady = true})
    }
}
</script>
