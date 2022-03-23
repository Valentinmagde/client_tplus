<template>
    <div>
        <p>{{$t('addAccountTitle')}}.</p>
        <!-- FIRSTNAME -->
        <vs-input
            :label="$t('name')"
            v-model="modifMembre.prenom"
            class="mt-5 w-full"
            name="item-name"
            data-vv-validate-on="blur"
            v-validate="'required'"
            @change="validateForms"/>
        <span class="text-danger text-sm" v-show="errors.has('item-name')">{{ errors.first('item-name') }}</span>
        <!-- PHONE -->
        <p class="vs-input--label mt-5">{{$t('phone')}}</p>
        <vue-tel-input
            name="telephone"
            placeholder=""
            @input="onInput"
            validCharactersOnly
            disabledFetchingCountry
            v-model="telephone.number"
            class="select-large w-full telephone"
            @change="validateForms"
        >
        </vue-tel-input>
        <!-- Address -->
        <vs-input
            :label="$t('address')"
            v-model="modifMembre.email"
            class=" mt-5 w-full"
            @change="validateForms"/>
    </div>
</template>

<script>
export default {
    props:['member', 'idLoader'],
    data(){
        return {
            telephone: {
                number: '',
                valid: false,
                country: undefined
            },
            //Modifier un compte memebre
            modifMembre:{
                nom: '',
                prenom: '',
                email: '',
                phone: '',

                /* Loading */
                backgroundLoading:'primary',
                colorLoading:'#fff',
                loader: true,
            },
        }
    },
    computed:{
        validateForms(){
            if(!this.loader) return this.$emit('disable',false)
            else return this.$emit('disable',true)
        },
    },

    watch:{
        member: function(newValue){
            this.chargerDonneesMembre(newValue)
        }
    },

    mounted(){
        this.modifMembre.nom = this.member.lastName ? this.member.lastName : ''
        this.modifMembre.prenom = this.member.firstName ? this.member.firstName : ''
        this.modifMembre.email = this.member.adresse ? this.member.adresse : ''
        this.modifMembre.phone = this.member.phone ? this.member.phone : ''
        this.telephone.number = this.member.phone ? this.member.phone : 
                               this.member.users.length > 0 ?  this.member.users.find(usr => usr.phone !== null).phone : ''
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

        onInput(formattedNumber, { number, valid, country }) {
            this.telephone.number = number.e164;
            this.telephone.valid = valid;
            this.telephone.country = country && country.name;

            window.console.log(number.e164)
        },

        chargerDonneesMembre(donnees){
            this.modifMembre.nom = donnees.lastName ? donnees.lastName : ''
            this.modifMembre.prenom = donnees.firstName ? donnees.firstName : ''
            this.modifMembre.email = donnees.adresse ? donnees.adresse : ''
            this.modifMembre.phone = donnees.phone ? donnees.phone : ''
            this.telephone.number = this.member.phone ? this.member.phone : ''
        },
        submit(){
            this.openLoadingContained()
            var association = this.$store.state.association.currentAssociation
            var user = this.$store.state.authentificated.user
            /* let number =  this.modifMembre.phone.split(' ').filter(s => s).join('') */
            /* window.console.log(number, typeof(this.modifMembre.phone)) */
            let payload = {
                resourceUrl: "/api/association/"+association.id+"/membre",
                commitAction: 'SET_ACCOUNTS',
                data: {
                    id: this.member.id,
                    lastName: this.modifMembre.nom,
                    firstName: this.modifMembre.prenom,
                    phone: this.telephone.number,
                    adresse: this.modifMembre.email,
                    created_by: user.id
                }
            }
            //Données pour recuperer la liste des comptes
            let memberPayload = {
                resourceUrl: "/api/association/"+association.id+"/membre",
            }

            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$emit('isSidebarActiveLocal', false)
                this.$store.dispatch("association/fetchMembers", memberPayload).catch(err => { window.console.error(err) })
                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('updateCompletedSuccessfully'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
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
}
</script>
