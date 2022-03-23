<template>
    <vx-card no-shadow :title="$t('eventCreation')">
        <div class="ep-association">
            <!-- Nom de l'activité -->
            <vs-input
                :label="$t('title')"
                v-model="titre"
                class="w-full"
            />
            <!-- Description de l'activité -->
            <p class="vs-input--label mt-5">{{$t('description')}}</p>
            <vs-textarea
                v-model="description"
                class="w-full"
            />
            <!-- Taux penalite -->
            <div class="grid grid-cols-3 gap-4 mt-5">
                <div class="col-span-2">
                    <vs-input
                        :label="$t('penaltyForFailure')"
                        type = number
                        v-model="taux_penalite"
                        class="w-full"
                        step="1"
                        min="0"
                        @keydown="filterKey"
                    />
                </div>
                <!-- Type penalite -->
                <div class="col-span-1">
                    <p class="vs-input--label">{{$t('typeOfPenalty')}}</p>
                    <v-select
                        label="text"
                        :options="penalityTypeSelectOptions"
                        v-model="type_penalite"
                        :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        class="w-full mt-1"/>
                </div>
            </div>
            <!-- Date de l'evenement -->
            <p class="vs-input--label mt-5">{{$t('date')}}</p>
            <flat-pickr
                :config="MyConfig"
                v-model="date"
                class="w-full"/>

            <!-- Lieu de l'evenement -->
            <vs-input
                :label="$t('location')"
                v-model="lieu"
                class="w-full mt-5"
            />

            <!-- L'heure de l'événement -->
            <p class="vs-input--label mt-5">{{$t('hour')+' *'}}</p>
            <flat-pickr :config="configdateTimePicker" v-model="heure" class="w-full" />

        </div>
        <div class="flex flex-wrapper mt-6">
            <vs-button
                type="border"
                class="mr-6"
                @click="reset">
                {{$t('cancel')}}
            </vs-button>

            <vs-button
                class="ml-3 vs-con-loading__container"
                ref="loadableButton"
                id="button-with-loading"
                @click="createOrUpdate"
                :disabled="!validateForm">
                {{$t('next')}}
            </vs-button>
        </div>
    </vx-card>
</template>
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {penality_type} from '../../../services/data/penalityType.js'

    export default {
      props: ['activity'],
        data(){
            return{
                selected: [],
                titre: '',
                description: '',
                taux_penalite: '',
                heure: '0',
                type_penalite : {
                    text: this.$t(penality_type[0].i18n),
                    value: penality_type[0].value
                },
                date: '',
                lieu: '',
                MyConfig: {
                    altFormat: "F j, Y",
                    dateFormat:"d M Y"
                },

                configdateTimePicker: {
                    time_24hr: true,
                    enableTime: true,
                    enableSeconds: false,
                    noCalendar: true
                },

                /* Loader */
                backgroundLoading:'primary',
                colorLoading:'#fff',
                loader: true
            }
        },
        components: {
            vSelect,
            flatPickr
        },
        computed : {
            validateForm() {
                return !this.errors.any() && this.titre != ''
                        && this.date != '' && this.lieu != ''
                        && this.loader
            },
            penalityTypeSelectOptions(){
                return penality_type.map(type => ({text: this.$t(type.i18n), value: type.value}))
            }
        },
        mounted(){
            var evenement_courante
            var activite_courante

            if(localStorage.getItem('activity_id') !== null){
                activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite

                this.titre = activite_courante.nom
                this.description = activite_courante.description
                this.taux_penalite = activite_courante.taux_penalite
                this.type_penalite = {
                  text: penality_type.reduce((a, o) => o.value == activite_courante.type_penalite ? a.concat(this.$t(o.i18n)) : a, ''),
                  value : activite_courante.type_penalite,
                }

                evenement_courante = activite_courante.Evenement

                this.date =  evenement_courante.date_event*1000
                this.lieu = evenement_courante.lieu_event
                this.heure = new Date( evenement_courante.date_event*1000).toLocaleString('fr', {hour:'numeric', minute: 'numeric'} )
            }
        },
        methods: {
            filterKey(e){
                const key = e.key;

                // If is '.' key, stop it
                if (key === '.')
                    return e.preventDefault();

                // OPTIONAL
                // If is 'e' key, stop it
                if (key === 'e' || key === 'E')
                    return e.preventDefault();
            },

            reset(){
                this.titre = ''
                this.description = ''
                this.taux_penalilte = ''
                this.type_penalilte = ''
                this.date = ''
                this.lieu = ''
            },
            createOrUpdate(){
                this.openLoadingContained()
                var association_courante = this.$store.state.association.currentAssociation
                var user = this.$store.state.authentificated.user
                var urlResource
                var method

                if(localStorage.getItem('activity_id') !== null){
                    var activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite

                    urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id
                    method = "association/putRequest"
                }else{
                   urlResource = "/api/association/"+association_courante.id+"/activite"
                   method = "association/postRequest"
                }

                var evenement_courante = this.activity !== '' ? this.activity.Evenement : this.$store.state.association.activite.Evenement

                let payload = {
                resourceUrl: urlResource,
                commitAction: 'SET_ACTIVITE',
                data: {
                        nom: this.titre,
                        description: this.description,
                        taux_penalite: this.taux_penalite,
                        type_penalite: this.type_penalite.value,
                        type: 'Evenement',
                        id: user.id
                    }
                }
                this.$store.dispatch(method, payload)
                .then((res) => {
                    var activite_courante = res.data.data
                    

                    if(localStorage.getItem('activity_id') !== null){

                        urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id+"/Evenement/"+ evenement_courante.id
                        method = "association/postRequest"
                    }
                    else{
                        urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id+"/Evenement"
                        method = "association/postRequest"
                    }

                    let date_string = new Date(this.date).toDateString()
                    let date_evenement = new Date(date_string + ' ' + this.heure + ' GMT' + association_courante.fuseau_horaire)

                    let payload = {
                        resourceUrl: urlResource,
                        commitAction: 'NO_COMMIT',
                        data: {
                            quoi: this.titre,
                            commentaire: this.description,
                            date_event: date_evenement.getTime() / 1000,
                            lieu_event: this.lieu,
                        }
                    }
                    this.$store.dispatch(method, payload)
                    .then((res) => {
                        var evenement_courant = res.data.data
                        activite_courante.Evenement = evenement_courant;
                        this.$store.commit('association/SET_ACTIVITE', activite_courante)
                        localStorage.setItem('activity_id', JSON.stringify(activite_courante.id))

                        this.$emit('selectedTab', 1)
                        this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                        this.loader = true
                    })
                    .catch(error => {
                        this.$vs.notify({
                            position:'top-center',
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
                        position:'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })

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
        }
    }
</script>
