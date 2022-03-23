<template>
    <div>
        <vx-card card-border>
        <p>
            {{$t('toRegisterMembersUsingAFile')}}
            <br><br>
            <vs-button color="warning" @click="csvExport(membres)">{{$t('generateFile')}}</vs-button>
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
                    {{uploading ? 'Uploading' : 'Start Upload' }}
                    </a-button>
                </div>
            </div>
    </vx-card>
    </div>
</template>
<script>
import functions from '../../../services/functions'

// Functions
import { EventBus } from  '@/services/EventBus.js'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleMember from "@/store/member/moduleMember.js"

export default {
    props: ['membres', 'mutuelle'],
    data(){
        return{
            fileList: [],
            uploading: false,
        }
    },
    methods:{
        //exporation du tableau en csv
        csvExport(arrData) {
            functions.csvMutualPaymentsExport(arrData)
        },
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
                formData.append('file', file);
            });
            this.uploading = true;

            var epargne_courante = this.mutuelle

            //Données pour créer un compte
            let payload = {
                resourceUrl: "/api/mutuelle/"+epargne_courante.id+"/misesdefonds/csv",
                commitAction: 'SET_ACCOUNTS',
                data: formData
            }
            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.$emit('isSidebarActiveLocal', false)
                this.$vs.notify({
                    position:'top-center',

                    text: this.$t('downPaymentSuccessfullyAdded'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })

                EventBus.$emit('loader', true)
                //Données pour recuperer les mises de fonds d'une mutuelle
                //Recupperer tous les mises de fonds de la mutuelle
                let payload = {
                    resourceUrl: "/api/mutuelle/"+epargne_courante.id+"/misedefonds",
                    commitAction: 'SET_MISES_FONDS'
                }
                this.$store.dispatch("association/fetchAssociationactivite", payload)
                .then(()=>{
                    EventBus.$emit('loader', false)
                })
                .catch((error)=>{
                    EventBus.$emit('loader', false)
                    window.console.error(error)
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
        }
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
