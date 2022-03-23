<template>
    <div>
        <vx-card card-border>
        <p>
            {{$t('createAccountCsvMsg')}}
            <br><br>
            {{$t('example')}}:
            <table id="exampleTable">
            <thead>
                <tr>
                <th>{{$t('Nom')}}</th>
                <th>{{$t('Email')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>Tontine</td>
                <td>tontineplus@gmail.com</td>
                </tr>
            </tbody>
        </table>
        </p>
        </vx-card>
        <br>
        <vx-card card-border>
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full">
                    <a-upload :fileList="fileList" accept=".csv" :remove="handleRemove" :beforeUpload="beforeUpload">
                    <a-button> <a-icon type="upload" /> {{$t('selectFile')}} </a-button>
                    </a-upload>
                </div>
                <div class="vx-col sm:w-1/2 w-full">
                    <a-button
                        type="primary"
                        @click="handleUpload"
                        :disabled="fileList.length === 0"
                        :loading="uploading"
                    >
                    {{uploading ? 'Uploading' : 'Start Upload'}}
                    </a-button>
                </div>
            </div>
    </vx-card>
    </div>
</template>
<script>

export default {
    data(){
        return{
            fileList: [],
            uploading: false,
        }
    },
    methods:{
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },
        beforeUpload(file) {
            this.fileList = [...this.fileList, file];

            return false;
        },
        handleUpload() {
            const { fileList } = this;
            const formData = new FormData();
            fileList.forEach(file => {
            formData.append('files', file);
            });
            this.uploading = true;
            var association = this.$store.state.association.currentAssociation
            var user = this.$store.state.authentificated.user
            var today = new Date();
            var date_created =  today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()

            /* form_data.append('files', fileList) */
            formData.append('date_created', date_created)
            formData.append('created_by', user.id)
            //Données pour créer un compte
            let payload = {
                resourceUrl: "/api/association/"+association.id+"/membres/csv",
                commitAction: 'SET_ACCOUNTS',
                data: formData
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.$emit('isSidebarActiveLocal', false)
                //Données pour recuperer la liste des comptes
                let memberPayload = {
                    resourceUrl: "/api/association/"+association.id+"/membre",
                }
                this.$store.dispatch("association/fetchMembers", memberPayload).catch(err => { window.console.error(err) })

                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('accountSuccessfullyCreated'),
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
<style lang="scss">
#exampleTable {
  border: 1px solid rgb(230,230,230);
  border-radius: 3px;
}

#exampleTable {
  th, td {
    border: 1px solid rgb(230,230,230);
    min-width: 100%;
    padding: 10px 20px;
  }
}
</style>
