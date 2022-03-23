<template>
    <div v-if="isReady">
        <div class="w-full fixed z-20 top-0" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16">
            <div class="vx-row">
                <div class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center" @click="redirectTontine">
                        <icon name="money-bags" class="associationicon" ></icon>
                        <span class="caption"> {{$t('tontine')}} </span>
                    </vx-card>
                </div>

                <div v-if="activites" class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex justify-center" style="background-color: #f7f7f7">
                        <icon name="multiple-actions-heart" class="associationicon" ></icon>
                        <span class="caption">{{$t('solidarity')}}</span>
                    </vx-card>
                </div>

                <div v-if="error=='no element'" class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center" @click="redirectSolidarity">
                        <icon name="multiple-actions-heart" class="associationicon" ></icon>
                        <span class="caption">{{$t('solidarity')}}</span>
                    </vx-card>
                </div>

                <div class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center"  @click="redirectMutuelle">
                        <icon name="saving-piggy-coins" class="associationicon"  ></icon>
                        <span class="caption">{{$t('EpargneCredit')}}</span>
                    </vx-card>
                </div>

                <!-- <div class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center">
                        <icon name="multiple-home" class="associationicon"  ></icon>
                        <span class="caption">{{$t('insurance')}} </span>
                    </vx-card>
                </div>

                <div class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center">
                        <icon name="cash-payment-bills-1" class="associationicon" ></icon>
                        <span class="caption">{{$t('handSUp') }} </span>
                    </vx-card>
                </div>

                <div class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center">
                        <icon name="team-idea" class="associationicon" ></icon>
                        <span class="caption">{{$t('project')}}</span>
                    </vx-card>
                </div> -->

                <div class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center" @click="redirectEvent">
                        <icon name="calendar-check-1"  class="associationicon" ></icon>
                        <span class="caption">{{$t('events')}}</span>
                    </vx-card>
                </div>

                <div class="vx-col w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-base">
                    <vx-card class="flex cursor-pointer justify-center" @click="redirectGeneric">
                        <icon name="tool-box" class="associationicon" ></icon>
                        <span  class="caption">{{$t('generique')}} </span>
                    </vx-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//Fonctions
import redirections from '../services/redirections.js'
import { EventBus } from  '@/services/EventBus.js'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    data(){
        return {
            activites: null,
            error: null,
            isReady: false,
        }
    },
    methods: {
        //Rediriger vers la page de création d'une tontine
        redirectTontine(){
            this.$store.commit('association/SET_ACTIVITE', '');
            return redirections.redirectTontine()
        },

        //Rediriger vers la page de création d'un événement
        redirectEvent(){
            this.$store.commit('association/SET_ACTIVITE', '');
            return redirections.redirectEvent()
        },

        //Rediriger vers la page de création d'une activité générique
        redirectGeneric(){
            this.$store.commit('association/SET_ACTIVITE', '');
            return redirections.redirectGeneric()
        },

        //Rediriger vers la page de création d'une activité générique
        redirectSolidarity(){
            this.$store.commit('association/SET_ACTIVITE', '');
            return redirections.redirectSolidarity()
        },

        //Rediriger vers la page de création d'une mutuelle
        redirectMutuelle(){
            this.$store.commit('association/SET_ACTIVITE', '');
            return redirections.redirectMutuelle()
        }
    },

    created(){
        EventBus.$emit('loader', true)
        // if(! moduleActivite.isRegistered) {
        //     this.$store.registerModule('activite',  moduleActivite)
        //     moduleActivite.isRegistered = true
        // }

        let association_courante = this.$store.state.association.currentAssociation;
        let payload = {
            resourceUrl:"api/association/"+association_courante.id+"/activite",
            commitAction: 'SET_ACTIVITES',
        }

        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .then((res)=>{
            EventBus.$emit('loader', false)
            let activites = res.data.data

            if(activites.length > 0 ){
                activites.forEach(element => {
                    if(element.type == 'Solidarite'){
                        this.activites = element
                    }
                });
            }

            if(this.activites == null){
                this.error = 'no element'
            }

            this.isReady = true;
        })
        .catch((error)=>{
            EventBus.$emit('loader', false); this.isReady = true;
            window.console.error(error)
        })
    },
}
</script>
<style lang="scss">
    .chat-card-log {
        height: 400px;

        .chat-sent-msg {
            background-color: #f2f4f7 !important;
        }
    }
    .associationicon{
        display: flex;
        width : 125px ;
        height : 75px;
        align-items: center;
        justify-content: center;
    }
    div.item {
        vertical-align: top;
        margin : 10px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
    }
    .caption {
        display: block;
        margin-top: 10px;
        text-align: center;
    }
</style>

