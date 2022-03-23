<template>
<div>
    <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;" />
    <div class="pt-16">
        <vx-card class="mr-4 pb-base" no-shadow>
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
            <div class="flex flex-wrapper">
                <vs-button class="mt-8 vs-con-loading__container" ref="loadableButton" id="button-with-loading" @click.native="create">
                    {{$t('save')}}
                </vs-button>
            </div>
        </vx-card>
    </div>
</div>
</template>

<script>
import {
    Money
} from 'v-money'

import {
    mapGetters
} from 'vuex'
//Stores
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
  props: ['activity', 'ags'],
    data() {
        return {
            penalite: 0,
            interet: 0,
            nom_activite: '',
            type_processus: 'creation',
            type_tontine: null,
            activite_courante: null,
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },

            /* Loader */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true
        }
    },
    computed:{
        ...mapGetters({
            user: 'authentificated/getAuth',
            currentAssociation: 'association/getCurrentAssociation',
        }),
    },

    components: {
        Money,
    },
    methods: {
        //Redirige sur la liste des activités
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

        previous() {
            this.$emit('selectedTab', 3)
        },
        create() {

            if (this.activite_courante) {

                let payload = {
                    resourceUrl: "/api/association/" + this.currentAssociation.id + "/activite/" + this.activite_courante.id,
                    commitAction: 'SET_ACTIVITE',
                    data: {
                        nom: this.activite_courante.nom,
                        description: this.activite_courante.description,
                        taux_penalite: this.activite_courante.taux_penalite,
                        type_penalite: this.activite_courante.type_penalite,
                        type: this.activite_courante.type,
                        id: this.activite_courante.id,
                        penalite: this.penalite,
                        interet: this.interet                   }
                }

                this.$store.dispatch("association/putRequest", payload)
                .then(() => {
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.loader = true

                    let payload = {
                        resourceUrl: "/api/association/" + this.currentAssociation.id + "/activite/" + this.activite_courante.id,
                        commitAction: 'SET_ACTIVITE',
                    }

                    this.$store.dispatch("association/fetchAssociationactivite", payload)
                    .then((res)=>{
                        this.redirectActivities(res.data.data)
                    })
                    .catch((error) => {
                        window.console.error(error)
                    })
                })
                .catch((error) => {
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.loader = true
                    window.console.error(error)
                })

            }

        }
    },
    created() {
        let payload = {
            resourceUrl: "/api/association/" + this.currentAssociation.id + "/activite/" + this.$route.params.actId,
            commitAction: 'SET_ACTIVITE',
        }

        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .then((res)=>{
            this.activite_courante = res.data.data

            if(this.activite_courante){
                this.nom_activite = this.activite_courante.nom
                this.interet = this.activite_courante.interet,
                this.penalite = this.activite_courante.penalite
            }
        })
        .catch((error) => {
            window.console.error(error)
        })
    }
}
</script>
