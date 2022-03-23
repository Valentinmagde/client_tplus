<template>
    <div>
        <p>{{$t('addAccountTitle')}}.</p>
        <!-- NAME -->
        <vs-input
            :label="$t('name')"
            v-model="dataName"
            class="mt-5 w-full"
            name="item-name"
            v-validate="'required'"
            @onchange="validateForms"/>
        <span class="text-danger text-sm" v-show="errors.has('item-name')">{{ errors.first('item-name')}}</span>

        <!-- PHONE -->
        <p class="vs-input--label mt-5">{{$t('phone')}}</p>
        <vue-tel-input
            name="telephone"
            placeholder=""
            @input="onInput"
            v-model="telephone.number"
            validCharactersOnly
            disabledFetchingCountry
            class="select-large w-full telephone"
            id="phone"
        >
        </vue-tel-input>

        <!-- COMMENT -->
        <p class="vs-input--label mt-5">{{$t('comment')}}</p>
        <vs-textarea
            v-model="comment"
            class="w-full"/>
    </div>
</template>
<script>
export default {
    props:['member', 'idLoader'],
    data(){
        return{
            telephone: {
                number: '',
                valid: false,
                country: undefined,
            },
            dataName: "",
            comment: '',
            phone: '',

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,
        }
    },
    computed:{
        validateForms(){
            if(this.dataName != '' && this.loader) return this.$emit('disable',false)
            else return this.$emit('disable',true)
        },
    },

    watch:{
        member: function(newValue){
            this.chargerDonneesMembre(newValue)
        }
    },

    mounted(){
        this.dataName = this.member.firstName ? this.member.firstName : ''
        this.telephone = {
                number: this.member.phone ? this.member.phone : '',
                valid: true,
                country: undefined,
                label: this.member.phone ? this.member.phone : ''
            }
    },

    methods:{
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

        chargerDonneesMembre(donnees){
            this.dataName = donnees.firstName ? donnees.firstName : ''
            this.telephone = {
                    number: donnees.phone ? donnees.phone : '',
                    valid: true,
                    country: undefined,
                    label: donnees.phone ? donnees.phone : ''
                }

        },
        //Inviter un utilisateur à joindre une association
        submit(){
            if(!this.telephone.valid) {
                this.$vs.notify({
                position:'top-center',
                text: this.$t('invalidPhoneNumber'),
                color:'danger',
                icon:'close'
                })
                return
            }
            this.openLoadingContained()
            var association = this.$store.state.association.currentAssociation
            // var membre = Object.entries(this.data)
            var user = this.$store.state.authentificated.user;
            var membre = this.member
            let payload = {
                resourceUrl: "/api/association/"+association.id+"/membre/"+membre.id+"/inviter",
                commitAction: 'SET_ACCOUNT',
                data: {
                    user_id: user.id,
                    phone: this.telephone.number,
                    admin_id: association.admin_id,
                    firstName: this.dataName,
                }
            }

            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$emit('isSidebarActiveLocal', false)
                this.comment = ''
                document.getElementById('phone').childNodes[2].value = ''
                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('invitationSentSuccessfully'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
                let payload = {
                    resourceUrl: '/api/association/' + association.id + '/membre',
                    commitAction: 'SET_MEMBERS'
                }

                this.$store.dispatch("association/fetchMembers",payload)
                .catch((err)=>{
                    window.console.error(err)
                })
            })
            .catch(error => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$vs.notify({
                position:'top-center',
                text: error,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
                })
            })
        },
        onInput(formattedNumber, { number, valid, country }) {
            this.telephone.number = number.e164;
            this.telephone.valid = valid;
            this.telephone.country = country && country.name;
        },
    }
}
</script>
