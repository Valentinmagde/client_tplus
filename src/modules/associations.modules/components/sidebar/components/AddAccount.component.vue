<template>
     <div class="pb-32">
        <vx-card card-border>
            <p>
                {{$t('createAccountMsg')}}
            </p>
        </vx-card>
        <br>
        <p>{{$t('addAccountTitle')}}.</p>
        <!-- NAME -->
        <vs-input
            :label="$t('name')+' '+'*'"
            v-model="name"
            class="mt-5 w-full"
            name="item-name"
            data-vv-validate-on="blur"
            v-validate="'required'"
            @onchange="validateForms"/>
        <span class="text-danger text-sm" v-show="errors.has('item-name')">{{ errors.first('item-name') }}</span>
        <!-- ADRESSE -->
        <vs-input
            :label="$t('address')"
            v-model="adresse"
            class="mt-5 w-full"
            @onchange="validateForms"/>
        <!-- PHONE -->
        <p class="vs-input--label mt-5">{{$t('phone')}}</p>
        <vue-tel-input
            name="telephone"
            placeholder=""
            @input="onInput"
            validCharactersOnly
            class="select-large w-full telephone mb-base"
            id="phone"
        >
        </vue-tel-input>
        <vs-checkbox v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
            {{$t('addAnother')}}
        </vs-checkbox>
    </div>
</template>
<script>
export default {
    props: ['idLoader'],
    data(){
        return {
            name:'',
            adresse: '',
            telephone: {
                number: '',
                valid: false,
                country: undefined,
            },
            checkbox_create_another: false,

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,
        }
    },
    computed:{
        validateForms(){
            if(this.name != '' && this.loader) return this.$emit('disable',false)
            else return this.$emit('disable',true)
        },
    },
    methods:{
         onInput(formattedNumber, { number, valid, country }) {
            this.telephone.number = number.e164;
            this.telephone.valid = valid;
            this.telephone.country = country && country.name;
        },

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
        submit(){
            this.openLoadingContained()
            var association = this.$store.state.association.currentAssociation
            var user = this.$store.state.authentificated.user
            let payload = {
                resourceUrl: "/api/association/"+association.id+"/membre",
                commitAction: 'SET_ACCOUNT',
                data: {
                    firstName: this.name,
                    phone: this.telephone.number,
                    adresse: this.adresse,
                    created_by: user.id
                }
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                if(this.checkbox_create_another) {
                    this.name = ''
                    this.adresse = ''
                    this.telephone.number = ''
                    document.getElementById('phone').childNodes[2].value = ''
                }
                else this.$emit('isSidebarActiveLocal', false)
                //Données pour recuperer la liste des comptes
                let memberPayload = {
                    resourceUrl: "/api/association/"+association.id+"/membre",
                }
                this.$store.dispatch("association/fetchMembers", memberPayload).catch(err => { window.console.error(err) })
                this.name = ''
                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('accountSuccessfullyCreated'),
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
        }
    }
}
</script>
