<template>
    <div>
        <!-- Compte1 -->
        <p class="vs-input--label">{{$t('swapTower')+ ' '+'*'}}</p>
        <v-select
            :options="selectOptions"
            label="text"
            v-model="membre1"
            @change="validateForms"
            class="w-full "/>

        <!-- Compte2 -->
        <p class="vs-input--label mt-5">{{$t('with')+ ' '+'*'}}</p>
        <v-select
            :options="selectOptions"
            label="text"
            v-model="membre2"
            @change="validateForms"
            class="w-full "/>
    </div>
</template>
<script>

import vSelect from 'vue-select'
import * as moment from 'moment';
import localisation from  'moment/locale/fr';


moment.updateLocale('fr', localisation)

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"


export default {
    props:['activite','idLoader'],
    data(){
        return {
            loading: false,
            //Declaration des variables pour ajouter une nouvelle

            membre1: '',
            membre2: '',
            lots: [],

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,
        }
    },
    components:{
        vSelect,
    },
    computed: {
        lotsData(){
            var ags =this.$store.state.association.ags;
            let lots = this.$store.state.association.lots
            let beneficiaires = []

            /* window.console.log(this.lotsData) */
            lots.forEach((value)=>{
                if((ags.some(element => element.date_ag === value.date_bouffe &&
                    element.etat != 'past' && element.etat != 'cloture'))){
                    beneficiaires.push(value)
                }
            })

            return beneficiaires
        },

        selectOptions(){

            if(this.lotsData.length > 0) return this.lotsData.map(membre => (
                {
                    id: membre.id,
                    text: moment.unix(membre.date_bouffe).format('L')+'-'+membre.membre,
                    value: membre.id,
                    tontine: membre.tontines_id
                }))
        },

        validateForms(){
            if(this.membre1 != '' && this.membre2 != ''
            && this.loader) return this.$emit('disable',false)
            else return this.$emit('disable',true)
        },
    },
    mounted(){
        this.initialize()
    },
    methods: {
        /* Loader */
        openLoadingContained(){
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${this.idLoader}`,
                scale: 0.45
            });
        },

        initialize(){
            if(this.lotsData.length > 0){
                if(this.lotsData.length > 1){
                    this.membre1 = {
                        text: moment.unix(this.lotsData[0].date_bouffe).format('L')+'-'+this.lotsData[0].membre,
                        value: this.lotsData[0].id,
                        tontine: this.lotsData[0].tontines_id
                    }
                    this.membre2 = {
                        text: moment.unix(this.lotsData[1].date_bouffe).format('L')+'-'+this.lotsData[1].membre,
                        value: this.lotsData[1].id,
                        tontine: this.lotsData[1].tontines_id
                    }
                }
                else{
                    this.membre1 = {
                        text: moment.unix(this.lotsData[0].date_bouffe).format('L')+'-'+this.lotsData[0].membre,
                        value: this.lotsData[0].id,
                        tontine: this.lotsData[0].tontines_id
                    }
                    this.membre2 = {
                        text: moment.unix(this.lotsData[0].date_bouffe).format('L')+'-'+this.lotsData[0].membre,
                        value: this.lotsData[0].id,
                        tontine: this.lotsData[0].tontines_id
                    }
                }
            }
        },
        submit(){
            this.openLoadingContained()

            var association_courante = this.$store.state.association.currentAssociation

            let payload = {
                resourceUrl: "api/association/"+association_courante.id+"/tontine/"+this.membre1.tontine+"/permutation",
                commitAction: 'SET_TONTINES',
                data: {
                    compte1: this.membre1.value,
                    compte2: this.membre2.value,
                }
            }
            this.$store.dispatch("association/postRequest",payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$emit('isSidebarActiveLocal', false)
                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('swappingCompletedSuccessfully'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })

               let payload = {
                    resourceUrl: '/api/association/'+association_courante.id + '/activite/type/Tontine',
                    commitAction: 'SET_TONTINES'
                }
                this.$store.dispatch("association/fetchAssociationactivite",payload)
                .then((res)=>{
                    let activites = res.data.data
                    /* let activite_courantte_lots = [] */

                    activites.forEach(activite=>{
                        if(activite.Tontine.id == this.membre1.tontine){

                            /* activite_courantte_lots = activite.Tontine.lots */

                            // localStorage.removeItem('activite_parameter')
                            // localStorage.setItem('activite_parameter', JSON.stringify(activite))

                            let payload = {
                                resourceUrl: '/api/activite/'+activite.id+'/comptes/all',
                                commitAction: 'SET_ACCOUNTS'
                            }

                            this.$store.dispatch("association/fetchComptemembreActivite", payload)
                            .then(()=>{
                                let payload = {
                                    resourceUrl: '/api/association/'+association_courante.id+'/tontine/'+activite.Tontine.id+'/lots',
                                    commitAction: 'SET_LOTS'
                                }
                                this.$store.dispatch("association/fetchAssociationactivite", payload)
                                .catch((error)=>{window.console.error(error)})
                            })
                            .catch((error)=> { window.console.error(error);})
                        }
                    })
                })
                .catch((error)=> { window.console.error(error);})

                this.$emit('closeSidebar')

                })
                .catch(error => {
                    this.loader = true
                    this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                    this.uploading = false;
                    this.fileList = [];
                    this.$vs.notify({
                        position:'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },

    },
    created(){

        let association_courante = this.$store.state.association.currentAssociation

        let payload = {
            resourceUrl: '/api/association/'+association_courante.id+'/tontine/'+this.activite.Tontine.id+'/lots',
            commitAction: 'SET_LOTS'
        }
        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .catch((error)=>{window.console.error(error)})

        moment.updateLocale('fr', localisation)
    },
}
</script>
