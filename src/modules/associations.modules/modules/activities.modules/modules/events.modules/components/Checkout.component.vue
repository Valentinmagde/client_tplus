<template>
    <div>
        <vx-card class="mr-4 pb-base" no-shadow :title="$t('adjustingTheAmountAtCheckout')">
            <div class="vx-row">
                <div class="vx-col w-full">
                    <!-- <h5 class="mt-5">{{$t('fund')}}</h5> -->
                    <p class="mt-2 text-muted">{{$t('enterTheAmountCurrentlyAvailableForThisActivity')}}</p>
                    <p class="vs-input--label mt-5 mb-3"><b>{{$t('checkout_penalty')}}</b></p>
                    <money
                        v-model="penalite"
                        v-bind="money"
                        class="money-input w-full mb-5 pt-3 pb-3"
                    />
                </div>
                <div class="vx-col w-full">
                    <!-- <h5 class="mt-5">{{$t('fund')}}</h5> -->
                    <p class="vs-input--label mt-5 mb-3"><b>{{$t('checkout_interet')}}</b></p>
                    <money
                        v-model="interet"
                        v-bind="money"
                        class="money-input w-full mb-5 pt-3 pb-3"
                    />
                </div>
            </div>
            <div class="flex flex-wrapper">
                <vs-button
                    type="border"
                    class="mt-8 mr-6"
                    @click.native="previous">
                    {{$t('previous')}}
                </vs-button>

                <vs-button
                    class="mt-8 ml-3 vs-con-loading__container"
                    ref="loadableButton"
                    id="button-with-loading"
                    :disabled="!loader"
                    v-if="type_processus=='creation'"
                    @click.native="create">
                    {{$t('save')}}
                </vs-button>

                <vs-button
                    class="mt-8 ml-3 vs-con-loading__container"
                    ref="loadableButton"
                    id="button-with-loading"
                    :disabled="!loader"
                    v-if="type_processus=='modification'"
                    @click.native="create">
                    {{$t('update')}}
                </vs-button>
            </div>
        </vx-card>
    </div>
</template>
<script>
import {Money} from 'v-money'

//Stores
// import moduleActivite from "@/store/activite/moduleActivite.js"

    export default {
      props: ['activity'],
        data(){
            return {
                penalite: 0,
                interet: 0,
                type_processus: 'creation',
                money: {
                    decimal: ',',
                    thousands: '.',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },

                /* Loader */
                backgroundLoading:'primary',
                colorLoading:'#fff',
                loader: true
            }
        },
        components: {
            Money,
        },
        mounted(){
            if(localStorage.getItem('activity_id') !== null){
                var activite_courante =  this.activity !== '' ? this.activity : this.$store.state.association.activite;

                this.penalite = activite_courante.penalite ? activite_courante.penalite : this.penalite
                this.interet = activite_courante.interet ? activite_courante.interet : this.interet
            }
        },
        methods: {
            previous(){
                this.$emit('selectedTab',3)
            },
            create(){
                if(localStorage.getItem('activity_id') != null){
                    this.openLoadingContained()
                    /* var activite_courante = JSON.parse(localStorage.getItem('activite_creee')) */
                    var association_courante = this.$store.state.association.currentAssociation


                    let activite_courante =  this.activity !== '' ? this.activity : this.$store.state.association.activite;
                    let user = this.$store.state.authentificated.user

                    let payload = {
                      resourceUrl: "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id,
                      commitAction: 'SET_ACTIVITE',
                      data: {
                        nom: activite_courante.nom,
                        description: activite_courante.description,
                        taux_penalite: activite_courante.taux_penalite,
                        type_penalite: activite_courante.type_penalite.value,
                        type: activite_courante.type,
                        id: user.id,
                                penalite: this.penalite,
                                interet: this.interet
                      }
                    }

                        this.$store.dispatch("association/putRequest", payload)
                        .then(()=>{
                            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                            this.loader = true
                            
                            this.$router.push('/association/administration/activities/event/details')
                        })
                        .catch((error)=>{
                            this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                            this.loader = true
                            window.console.error(error)
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

        }
    }
</script>
