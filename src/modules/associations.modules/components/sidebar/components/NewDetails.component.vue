<template>
    <div>
        <!-- IMAGE WINDOW MODAL -->
        <div id="myModal" class="modal">
          <span class="close">&times;</span>
          <img class="modal-content" id="img01">
          <div id="caption"></div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full">
                <table class="w-full border-collapse">
                    <!-- Membre conserné-->
                    <tr>
                        <td class="product-name truncate">{{$t('member')}}</td>
                        <td>{{ nouvelles.author.firstName }}</td>
                    </tr>

                    <!-- Titre de la nouvelle  -->
                    <tr>
                        <td class="product-name truncate">{{$t('title')}}</td>
                        <td>{{ nouvelles.titre }}</td>
                    </tr>

                    <!-- Categorie -->
                    <tr>
                        <td class="product-name truncate">{{$t('category')}}</td>
                        <td>{{ afficheCategorie(nouvelles.categorie) }}</td>
                    </tr>

                    <!-- Date de création -->
                    <tr>
                        <td class="product-name truncate">{{$t('createdDate')}}</td>
                        <td>
                            {{ (nouvelles.date_nouvelle) | dateTime }}
                        </td>
                    </tr>

                    <!-- Description -->
                    <tr>
                        <td class="product-name truncate">{{$t('description')}}</td>
                        <td>
                            {{nouvelles.description}}
                        </td>
                    </tr>

                    <!-- Like -->
                    <tr>
                        <td class="product-name truncate">{{$t('Like')}}</td>
                        <td>
                            <p class="product-name truncate">
                                {{nouvelles.like}}
                            </p>
                        </td>
                    </tr>

                    <!-- Unlike -->
                    <tr>
                        <td class="product-name truncate">{{$t('Dislike')}}</td>
                        <td>
                            <p class="product-name truncate">
                                {{nouvelles.unlike}}
                            </p>
                        </td>
                    </tr>

                    <!-- Photo -->
                    <tr>
                        <td class="product-name truncate">{{$t('Image')}} :</td>
                        <td>
                            <ul class="inline-block" style="color:#65B0F3;">
                                 <feather-icon icon="PaperclipIcon" svgClasses="w-4 h-4 hover:text-primary stroke-current"/>
                                <li color="#65B0F3" class="inline-block hover:italic cursor-pointer"
                                    @click="showPreview(nouvelles.photo)">
                                    {{$t('clickToSeeTheImage')}}
                                </li>
                            </ul>
                        </td>
                    </tr>
                </table>
                <!-- Commentaire -->
                <vs-collapse>
                <vs-collapse-item icon-pack="feather" icon-arrow="icon-chevrons-down">
                    <div slot="header" class="pl-0">
                      <p class="text-base">{{$t('comment')}}</p>
                    </div>
                    <div class="timeline-heigth w-full">
                        <a-timeline  v-if="nouvelles.commentaires.length > 0">
                        <div :key="index" v-for="(comment, index) in nouvelles.commentaires">
                            <a-timeline-item>

                                <ul class="user-comments-list">
                                    <li class="commented-user flex items-center mb-4">
                                        <div class="mr-3">
                                            <vs-avatar class="m-0" v-if="comment.author.users.length"
                                            :src="comment.author.users[0].photo_profil" size="30px" />
                                            <vs-avatar class="m-0" v-else size="30px"/>
                                        </div>
                                        <div class="leading-tight">
                                            <p class="text-left font-medium">{{comment.author.users[0].firstName }}</p>
                                            <span class="text-left text-xs">{{ (comment.created_at) | dateTime }}</span>
                                        </div>
                                    </li>
                                </ul>
                            <p class="mt-1 link-color hover:italic"
                                @click="toggle(index+'ev')">
                                {{$t('comment')}}
                            </p>
                            <p :id="index+'ev'" class="mt-2 activity-e-time" style="display: none;">
                                {{comment.commentaire}}
                                </p>
                            </a-timeline-item>
                        </div>
                        </a-timeline>
                    </div>
                </vs-collapse-item>
                </vs-collapse>
            </div>
        </div>
    </div>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
//Importation des constantes pour ajouter une nouvelle
import {categorie} from "../../../services/data/news-categories"
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import $ from 'jquery'

//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleUser from "@/store/user/moduleUser.js"


export default {
    props:['nouvelles'],
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
            }
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
            if(this.nouvelle.titre!= '' && this.nouvelle.categorie && this.nouvelle.date_nouvelle && this.nouvelle.membre_id) return this.$emit('disable',false)
            else return this.$emit('disable',true)
        },
    },
    methods: {
        toggle(item) {
            $( '#'+item ).toggle(300)
        },

        afficheCategorie(valeur){
            return categorie.reduce((a, o) => o.value == valeur ? this.$t(a.concat(o.i18n)) : a, '')
        },

        showPreview(src){
            // Get the modal
            var modal = document.getElementById("myModal");

            // Get the image and insert it inside the modal - use its "alt" text as a caption
            var modalImg = document.getElementById("img01");

            modal.style.display = "flex";
            modalImg.src = src;

            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
            modal.style.display = "none";
            }
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
            var url_resource
            var association = this.$store.state.association.currentAssociation

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
                this.$emit('isSidebarActiveLocal', false)

                this.$store.dispatch("nouvelle/fetchNews", nouvellePayload)
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
        var current_association = this.$store.state.association.currentAssociation


        let payload = {
            resourceUrl: '/api/association/' + current_association.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers",payload)
    },
}
</script>
<style lang="scss">
    .link-color {
      color:#3EB2FB;
    }
    .vs-collapse{
        padding: 0 !important;
    }

    .vs-collapse-item--header {
        padding-left: .37rem !important;
    }

    .timeline-heigth {
      padding-top: 20px;
      height: 250px;
      overflow: auto;
    }
</style>
