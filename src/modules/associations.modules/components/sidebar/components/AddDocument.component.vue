<template>
    <div>
        <p class="mt-2">{{$t('addDocumentSubtitle')}}</p>
        <!-- Nom du document -->
        <vs-input
            v-validate="'required'"
            data-vv-validate-on="blur"
            :label="$t('documentName')+ ' *'"
            name="titre"
            v-model="document.titre"
            class="w-full mt-5 v-validate" />
        <span class="text-danger text-sm">{{ errors.first('titre') }}</span>

        <!-- Description -->
        <p class="vs-input--label mt-5">{{$t('description')+ ' *'}}</p>
        <vs-textarea
        v-validate="'required'"
        data-vv-validate-on="blur"
        name="description"
        v-model="document.description"
        class="w-full mb-base" />

        <!-- Upload document -->
        <vx-card card-border class="mt-5">
            <div class="vx-row p-0">
                <div class="vx-col sm:w-1/2 w-full">
                    <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
                        <a-button :disabled="!isFormValid">
                            <a-icon type="upload" /> {{$t('selectFile')}}
                        </a-button>
                    </a-upload>
                </div>
                <div class="vx-col sm:w-1/2 w-full">
                    <a-button
                    type="primary"
                    @click="handleUpload"
                    :disabled="fileList.length === 0 "
                    :loading="uploading"
                    >
                    {{uploading ? 'Uploading' : 'Start Upload' }}
                    </a-button>
                </div>
            </div>
        </vx-card>
    </div>
</template>
<script>

export default {
    data(){
        return {
            fileList: [],
            uploading: false,
            loading: false,
            //Declaration des variables pour ajouter une document
            document: {
                titre: '',
                description: '',
                photo: '',
                imageUrl: ''
            },
        }
    },
    computed: {
        isFormValid() {
            return  this.document.titre != '' && this.document.description != ''
        }
    },
    methods: {
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;

            this.uploading = false;
        },
        beforeUpload(file) {

            const isLt2M = file.size / 1024 / 1024 <= 20;
            if (!isLt2M) {
            this.$vs.notify({
                position:'top-center',
                text: this.$t('uploadFileRestrictionSize'),
                color:'warning',
                icon:'close'
                })
            }
            else {
                this.fileList = [...this.fileList, file];

                window.console.log(this.fileList)
            }
            return isLt2M;
        },
        handleUpload() {
            const { fileList } = this;
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('file', file);
            });
            this.uploading = true;
            var user = this.$store.state.authentificated.user
            var association = this.$store.state.association.currentAssociation

            formData.append('intitule', this.document.titre);
            formData.append('description', this.document.description);
            formData.append('type', 'document');
            formData.append('user_id', user.id);

            let payload = {
                resourceUrl: "/api/association/"+association.id+"/document",
                commitAction: 'SET_DOCUMENT',
                data: formData
            }

            //Données pour recuperer la liste des documents de l'association
            let documentPayload = {
                resourceUrl: "/api/association/"+association.id+"/document",
                commitAction: 'SET_DOCUMENTS'
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.$emit('isSidebarActiveLocal', false)
                this.$store.dispatch("association/fetchAssociationDocuments", documentPayload)
                .catch(err => { window.console.error(err) })
                this.$emit('closeSidebar')
                this.document.titre = ''
                this.document.description = ''
                this.document.imageUrl = '',

                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('documentSuccessfullyCreated'),
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
        submit(){
            var user = this.$store.state.authentificated.user
            var association = this.$store.state.association.currentAssociation

            let formData = new FormData();
            formData.append('file', this.document.photo);
            formData.append('intitule', this.document.titre);
            formData.append('description', this.document.description);
            formData.append('type', 'document');
            formData.append('user_id', user.id);

            let payload = {
                resourceUrl: "/api/association/"+association.id+"/document",
                commitAction: 'SET_DOCUMENT',
                data: formData
            }

            //Données pour recuperer la liste des documents de l'association
            let documentPayload = {
                resourceUrl: "/api/association/"+association.id+"/document",
                commitAction: 'SET_DOCUMENTS'
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.$emit('isSidebarActiveLocal', false)
                this.$store.dispatch("association/fetchAssociationDocuments", documentPayload).catch(err => { window.console.error(err) })
                this.$emit('closeSidebar')
                this.document.titre = ''
                this.document.description = ''
                this.document.imageUrl = '',

                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('documentSuccessfullyCreated'),
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

    }
}
</script>
