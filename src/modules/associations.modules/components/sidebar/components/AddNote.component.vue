<template>
<div> 
    <!-- Note -->
    <p class="vs-input--label">{{$t('note')+ ' '+'*'}}</p>
    <vs-textarea
        v-model="note"
        @onchange="validateForms"
        rows="5"
        class="w-full"
    />
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: ['activite', 'idLoader'],
    data() {
        return {
            note: '',
            membre_id: '',
            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,
        }
    },
    components: {},
    computed: {
        ...mapGetters({
            user: 'authentificated/getAuth',
            currentAssociation: 'association/getCurrentAssociation'
        }),

        validateForms() {
            if (this.loader &&
                this.note != '') return this.$emit('disable', false)
            else return this.$emit('disable', true)
        }
    },
    mounted() {},
    methods: {
        /* Loader */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${this.idLoader}`,
                scale: 0.45
            });
        },

        //Reccuperer l'id membre de l'utilisateur
        extractMember(members){
            var user = this.user;
            var id

            members.forEach(member => {
                member.users.forEach(author => {
                  if(user.id == author.id) {
                    id = member.id
                  }
                })
            })
            return id
        },

        submit() {
            this.openLoadingContained()
            let payload = {
                resourceUrl: "api/note/store",
                commitAction: 'SET_NOTES',
                data: {
                    note: this.note,
                    membres_id: this.membre_id,
                    activites_id: this.activite.id
                }
            }

            this.$store.dispatch("association/postRequest", payload)
            .then(() => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.note = ''
                this.$vs.notify({
                    position: 'top-center',
                    text: this.$t('notifContent'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })

                this.$emit('isSidebarActiveLocal', false)

                let payload = {
                    resourceUrl:'api/note/activites/'+this.activite.id+'/all',
                    commitAction: 'SET_NOTES',
                }
                this.$store.dispatch("association/fetchAssociationactivite", payload)
                .then(() => {
                })
                .catch((error)=>{
                    window.console.error(error)
                })
            })
            .catch(error => {
                this.loader = true
                this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                this.$vs.notify({
                    position: 'top-center',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
        },
    },
    created() {
        let payload = {
            resourceUrl: '/api/association/' + this.currentAssociation.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers",payload)
        .then((res)=>{
            // Current member
            this.membre_id = this.extractMember(res.data.data);
        })
        .catch((error)=> { window.console.error(error);})
    }
}
</script>
