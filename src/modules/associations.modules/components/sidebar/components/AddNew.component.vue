<template>
    <div>
        <!-- Titre -->
        <vs-input
            v-validate="'required'"
            data-vv-validate-on="blur"
            :label="$t('title')+ '*'"
            name="titre"
            v-model="nouvelle.titre"
            class="w-full"
            @onchange="validateForms"/>
        <span class="text-danger text-sm">{{ errors.first('titre') }}{{inializeUpdate}}</span>

        <!-- Categorie -->
        <p class="vs-input--label mt-5">{{$t('category')+ ' '+'*'}}</p>
        <v-select
            label="text"
            :options="selectNewOptions"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            v-model="nouvelle.categorie"
            class="w-full v-validate"/>

        <!-- Membre concerné -->
        <p class="vs-input--label mt-5">{{$t('members')+ ' '+'*'}}</p>
        <v-select
        :options="selectOptions"
        label="text"
        v-model="nouvelle.membre_id"
        class="w-full "/>

        <!-- Date nouvelle -->
        <p class="vs-input--label mt-5">{{$t('date')+ ' '+'*'}}</p>
        <flat-pickr
        :config="MyConfig"
        v-model="nouvelle.date_nouvelle"
        class="w-full v-validate"
        @onchange="validateForms"/>

        <!-- Description -->
        <p class="vs-input--label mt-5">{{$t('description')+ '*'}}</p>
        <vs-textarea
            v-validate="'required'"
            data-vv-validate-on="blur"
            name="description"
            v-model="nouvelle.description"
            class="w-full"/>

        <!-- Photo nouvelle -->
        <a-upload
        name="avatar"
        listType="picture-card"
        class="avatar-uploader "
        :showUploadList="false"
        :action="$store.getters['authentificated/uploadUrl']"
        :beforeUpload="newPhotoUpload"
        @change="handleChange"
        >
        <img class="ant-upload object-contain h-48 w-full" v-if="nouvelle.imageUrl" :src="nouvelle.imageUrl" alt="avatar" />
        <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">{{$t('selectYourImg')}}</div>
        </div>

        </a-upload>
    </div>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
//Importation des constantes pour ajouter une nouvelle
import {categorie} from '../../../services/data/news-categories'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';

//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleUser from "@/store/user/moduleUser.js"


export default {
    props:['nouvelles', 'idLoader'],
    data(){
        return {
            loading: false,
            //Declaration des variables pour ajouter une nouvelle
            nouvelle: {
                titre: '',
                categorie: '',
                categories: categorie,
                date_nouvelle: '',
                description: '',
                photo: '',
                imageUrl: '',
                membre_id : '',
            },
            MyConfig: {
                altFormat: "F j, Y",
                dateFormat:"d M Y"
            },

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,
        }
    },
    components:{
        vSelect,
        flatPickr
    },
    computed: {
        inializeUpdate(){
            if(Object.keys(this.nouvelles).length !== 0) return this.initialize()
        },
        membreData(){
            return this.$store.state.association.members
        },
        selectNewOptions(){
            return categorie.map(categori => ({text: this.$t(categori.i18n), value: categori.value}))
        },

        selectOptions(){
            if(this.membreData != null) return this.membreData.map(membre => ({id: membre.id, text: membre.firstName, value: membre.id}))
        },
        isFormValid() {
            return  this.nouvelle.titre && this.nouvelle.categorie && this.nouvelle.date_nouvelle && this.nouvelle.description
        },
        validateForms(){
            if(this.nouvelle.titre!= '' && this.nouvelle.categorie
                && this.nouvelle.date_nouvelle && this.nouvelle.membre_id
                && this.loader) return this.$emit('disable',false)
            else return this.$emit('disable',true)
        },
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
            if(Object.keys(this.nouvelles).length !== 0){
                this.nouvelle.titre = this.nouvelles.titre
                this.nouvelle.date_nouvelle = this.nouvelles.date_nouvelle*1000
                this.nouvelle.description = this.nouvelles.description
                this.nouvelle.photo = this.nouvelles.photo
                this.nouvelle.imageUrl = this.nouvelles.photo
                this.nouvelle.membre_id = {
                    text: this.nouvelles.author ? this.nouvelles.author.firstName: '',
                    value: this.nouvelles.membres_id
                }
                this.nouvelle.categorie = {
                    text: categorie.reduce((a, o) => o.value == this.nouvelles.categorie ? this.$t(a.concat(o.i18n)) : a, ''),
                    value: this.nouvelles.categorie
                }
            }
        },
        submit(){
            this.openLoadingContained()
            var url_resource
            var association = this.$store.state.association.currentAssociation;

            let formData = new FormData();
            //Conversion de la date en Date UTC
            var d = new Date(this.nouvelle.date_nouvelle)
            var date_nouvelle_Utc
            var msg = ''

            date_nouvelle_Utc = d.getTime()/1000

            formData.append('file', this.nouvelle.photo);
            formData.append('titre', this.nouvelle.titre);
            formData.append('description', this.nouvelle.description);
            formData.append('categorie', this.nouvelle.categorie.value);
            formData.append('date_nouvelle', date_nouvelle_Utc);
            formData.append('membres_id', this.nouvelle.membre_id.value);

            if(Object.keys(this.nouvelles).length !== 0) {
                msg = this.$t('updateCompletedSuccessfully')
                url_resource = "/api/association/"+association.id+"/nouvelle/"+this.nouvelles.id
            }

            else {
                msg = this.$t('newSuccessfullyCreated')
                url_resource = "/api/association/"+association.id+"/nouvelle"
            }

            let payload = {
                resourceUrl: url_resource,
                commitAction: 'SET_NEW',
                data: formData
            }

            //Données pour recuperer la liste des nouvelles
            let nouvellePayload = {
                resourceUrl: "/api/association/"+association.id+"/nouvelle",
                commitAction: 'SET_NEWS'
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$emit('isSidebarActiveLocal', false)

                this.$store.dispatch("association/fetchNews", nouvellePayload)
                .catch(err => { window.console.error(err) })

                this.$emit('closeSidebar')
                this.nouvelle.titre = ''
                this.nouvelle.categorie = ''
                this.nouvelle.date_nouvelle = ''
                this.nouvelle.description = ''
                this.nouvelle.imageUrl = '',
                this.nouvelle.membre_id = '',

                this.$vs.notify({
                    position:'top-center',
                    title: 'success',
                    text: msg,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
                this.uploading = false;
                this.fileList = [];
                })
                .catch(error => {
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
            .catch((error)=>{
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                window.console.error(error)
            })
        },
        updateCurrImg(input) {
            if (input.target.files && input.target.files[0]) {
                var reader = new FileReader()
                reader.onload = e => {
                this.dataImg = e.target.result
                }
                reader.readAsDataURL(input.target.files[0])
            }
        },
        newPhotoUpload(file) {
            let isValid = false
            const extensions = ['image/jpg','image/jpeg','image/png','image/gif'];
            for(var i = 0; i<extensions.length; i++){
            if(extensions[i] === file.type) isValid = true
            }
            if (!isValid) {
            this.$vs.notify({
                position:'top-center',
                text: this.$t('uploadImageRestrictionExtension'),
                color:'warning',
                icon:'close'
                })
            }
            const isLt2M = file.size / 1024 / 1024 < 20;
            if (!isLt2M) {
            this.$vs.notify({
                position:'top-center',
                text: this.$t('uploadImageRestrictionSize'),
                color:'warning',
                icon:'close'
                })
            }
            return isValid && isLt2M;
        },
        handleChange(info) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                // Get this url from response in real world.
                getBase64(info.file.originFileObj, imageUrl => {
                    this.nouvelle.imageUrl = imageUrl;
                    this.loading = false;
                    this.nouvelle.photo = info.file.originFileObj;
                    window.console.log(this.nouvelle.photo)
                });
            }
        },
    },
    created(){
        /*if(!moduleMember.isRegistered) {
            this.$store.registerModule('member', moduleMember)
            moduleMember.isRegistered = true
        }
        if(!moduleUserManagement.isRegistered) {
        this.$store.registerModule('userManagement', moduleUserManagement)
        moduleUserManagement.isRegistered = true
        }
        if(!moduleAssociation.isRegistered) {
        this.$store.registerModule('association', moduleAssociation)
        moduleAssociation.isRegistered = true
        }

        if(! moduleUser.isRegistered) {
            this.$store.registerModule('user',  moduleUser)
            moduleUser.isRegistered = true
        }*/

        var current_association = this.$store.getters['association/getCurrentAssociation']


        let payload = {
            resourceUrl: '/api/association/' + current_association.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers",payload)
    },
}
</script>
