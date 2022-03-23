<template>
    <vx-card no-shadow :title="$t('creationOfASolidarityActivity')">
        <div class="ep-association">
            <!-- Nom  -->
            <vs-input
                :label="$t('nameOfActivity')+ '*'"
                v-model="nom"
                class="w-full"
            />
            <!-- Description -->
            <p class="vs-input--label mt-5">{{$t('activityDescription')}}</p>
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

            <!-- Montant de fonds -->
            <p class="vs-input--label mt-5">{{$t('fundAmount')}}</p>
                <money
                    v-model="montant"
                    class="w-full money-input p-3"
                    v-bind="money"/>

            <!-- Délais pour la mise à niveau -->
            <span class="flex">
                <p class="vs-input--label mt-5 inline-block">{{$t('upgradeDeadlines')}}</p>
                <p class="vs-input--label mt-5 inline-block">
                    <vx-tooltip :text="$t('maximumNumberOfGeneralMeetingsPayUpgradeDeadlines')" position="right" class="inline-block">
                        <feather-icon  icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current"  class="ml-1 mt-1"/>
                    </vx-tooltip>
                </p>
            </span>
            <vs-input
                type="number"
                v-model="delais"
                class="w-full"
                step="1"
                min="0"
                @keydown="filterKey"/>
        </div>
        <div class="flex flex-wrapper mt-6">
            <vs-button
                type="border"
                class="mr-6"
                @click.native="reset">
                {{$t('cancel')}}
            </vs-button>

            <vs-button
                class="ml-3 vs-con-loading__container"
                ref="loadableButton"
                id="button-with-loading"
                @click.native="createOrUpdateActivity"
                :disabled="!validateForm">
                {{$t('next')}}
            </vs-button>
        </div>
    </vx-card>
</template>
<script>
import {Money} from 'v-money'
import vSelect from 'vue-select'
import {penality_type} from '../../../services/data/penalityType.js'

    export default {
      props: ['activity'],
        data(){
            return{
                selected: [],
                nom: '',
                description: '',
                taux_penalite: '',
                type_penalite : {
                    text: this.$t(penality_type[0].i18n),
                    value: penality_type[0].value
                },
                montant: 0,
                delais: 0,
                duree: '',
                money: {
                    decimal: ',',
                    thousands: '.',
                    precision: 2,
                    masked: false,
                    /* prefix: ' ' */
                },

                /* Loader */
                backgroundLoading:'primary',
                colorLoading:'#fff',
                loader: true
            }
        },
        components: {
            vSelect,
            Money
        },
        computed : {
            validateForm() {
                return !this.errors.any() && this.nom != '' && this.loader;
            },
            penalityTypeSelectOptions(){
                return penality_type.map(type => ({text: this.$t(type.i18n), value: type.value}))
            }
        },
        mounted(){
            var solidarite_courante
            var activite_courante

            if(localStorage.getItem('activity_id') !== null){
                activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite

                this.nom = activite_courante.nom
                this.description = activite_courante.description
                this.taux_penalite = activite_courante.taux_penalite
                this.type_penalite = {
                    text: penality_type.reduce((a, o) => o.value == activite_courante.type_penalite ? a.concat(this.$t(o.i18n)) : a, ''),
                    value : activite_courante.type_penalite,
                }

                solidarite_courante = activite_courante.Solidarite

                this.montant = solidarite_courante.montant_fond_solidarite
                this.delais =  solidarite_courante.delai_mise_a_niveau
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

            // This can also prevent copy + paste invalid character
            filterInput(e){
            e.target.value = e.target.value.replace(/[^0-9]+/g, '');
            },
            reset(){
                this.nom = ''
                this. description = ''
                this.taux_penalilte = ''
                this.type_penalite = ''
            },
            createOrUpdateActivity(){
                this.openLoadingContained()
                var association_courante = this.$store.state.association.currentAssociation
                var user = this.$store.state.authentificated.user
                var urlResource
                var method
                var activite_courante

                if(localStorage.getItem('activity_id') !== null){
                    activite_courante = this.activity !== '' ? this.activity : this.$store.state.association.activite

                    urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id
                    method = "association/putRequest"
                }
                else{
                   urlResource = "/api/association/"+association_courante.id+"/activite"
                   method = "association/postRequest"
                }

                var solidarite_courante = this.activity !== '' ? this.activity.Solidarite : this.$store.state.association.activite.Solidarite

                let payload = {
                resourceUrl: urlResource,
                commitAction: 'SET_ACTIVITE',
                data: {
                        nom: this.nom,
                        description: this.description,
                        taux_penalite: this.taux_penalite,
                        type_penalite: this.type_penalite.value,
                        type: 'Solidarite',
                        id: user.id
                    }
                }
                this.$store.dispatch(method, payload)
                .then((res) => {
                    var activite_courante = res.data.data
                    var association_courante = this.$store.state.association.currentAssociation
                    var urlResource
                    var method

                    if(localStorage.getItem('activity_id') !== null){
                        urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id+"/Solidarite/"+ solidarite_courante.id
                        method = "association/postRequest"
                    }
                    else{
                    urlResource = "/api/association/"+association_courante.id+"/activite/"+ activite_courante.id+"/Solidarite"
                    method = "association/postRequest"
                    }
                    let payload = {
                        resourceUrl: urlResource,
                        commitAction: 'NO_COMMIT',
                        data: {
                            montant_fond_solidarite: this.montant,
                            delai_mise_a_niveau: this.delais
                        }
                    }
                    this.$store.dispatch(method, payload)
                    .then((res) => {
                        let solidarite_courante = res.data.data
                        activite_courante.Solidarite = solidarite_courante;
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
