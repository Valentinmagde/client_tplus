<template>
    <div>
        <vx-card no-shadow class="pb-base" :title="$t('generateTimelineOfTontine')+' - '+nom_activite">
            <div>
                <p>{{$t('generateDeadline')}}: </p>
                <ul class="centerx mt-3">
                    <li class="mr-8 inline-block">
                        <vs-radio  v-model="radio" vs-value="1" class="mb-4">{{$t('yes')}}</vs-radio>
                    </li>
                    <li class="inline-block">
                        <vs-radio v-model="radio" vs-value="0" class="mr-12">{{$t('no')}}</vs-radio>
                    </li>
                </ul>
            </div>
            <settlements :activity="activity" @formValidate="formValidate = $event" :idLoader="'button-with-loading'" v-if="radio=='1'" ref="form"/>
            <div class="flex flex-wrapper mt-8">
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
                    v-if="radio == '1'"
                    @click.native="submit"
                    :disabled="formValidate">
                    {{$t('generate')}}
                </vs-button>

                <vs-button
                    class="mt-8 ml-3 vs-con-loading__container"
                    ref="loadableButton"
                    id="button-with-loading"
                    v-if="radio == '0'"
                    @click.native="next"
                    :disabled="!loader">
                    {{$t('next')}}
                </vs-button>
            </div>
        </vx-card>
    </div>
</template>
<script>
    import Settlements from './Settlements.component.vue'

    //Store
    // import moduleActivite from "@/store/activite/moduleActivite.js"

    export default {
      props: ['activity'],
        data(){
            return {
                radio: 0,
                nom_activite: '',

                /* Loader */
                backgroundLoading:'primary',
                colorLoading:'#fff',
                loader: true,
                formValidate:false,

                isReady: false
            }
        },
        components: {
            Settlements
        },
        mounted(){
            if(localStorage.getItem('activity_id') !== null){
                var activite_courante =  this.activity !== '' ? this.activity : this.$store.state.association.activite;
                this.nom_activite= activite_courante.nom.toUpperCase()
            }
        },
        methods: {
            previous(){
                this.$emit('selectedTab',2)
            },

            next() {
                this.openLoadingContained()
                this.$emit('selectedTab',4)

                this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                this.loader = true
            },

            submit(){
                this.$refs.form.submit()

                this.$emit('selectedTab',4)
            },
            create(){
                if(localStorage.getItem('activity_id') != null){
                    /* var activite_courante = JSON.parse(localStorage.getItem('activite_creee')) */
                    var activite_courante =  this.activity !== '' ? this.activity : this.$store.state.association.activite;
                    var membres = []
                    let membres_incris = this.$store.state.association.accounts

                    this.membresIdChecked = []
                    membres_incris.forEach(element => {
                        membres.push(element.membres_id)
                    })
                    let payload = {
                        resourceUrl: 'api/activite/'+activite_courante.id+'/echeancier/some',
                        commitAction: 'SET_ECHEANCIERS',
                        data: {
                            membres: membres
                        }
                    }
                    this.$store.dispatch('association/postRequest', payload)
                    .then(() => {
                        localStorage.removeItem('evenement_creee')
                        localStorage.removeItem('activite_creee')
                        localStorage.removeItem('memre_inscris')
                        localStorage.removeItem('membres_selectionnes')
                        localStorage.removeItem('evenement_modif')

                        this.$router.push('/association/administration/activities/events/all')
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
        }
    }
</script>
