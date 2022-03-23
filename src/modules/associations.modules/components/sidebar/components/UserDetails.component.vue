<template>
     <div class="-mt-4 ep-association">
        <!-- PROFILE HEADER -->
        <div id="profile-page">
            <div class="profile-header">
                <div class="relative profile-header">
                    <div class="rounded-t-lg cover-container">
                        <img v-if="userData.photo_couverture" :src="userData.photo_couverture" alt="user-profile-cover" class="block responsive" style="height: 300px; object-fit: cover;">
                        <img v-else src="https://source.unsplash.com/collection/433526" alt="profile_pic" class="block responsive" style="height: 300px">
                    </div>
                    <div class="pointer-events-none profile-img-container">
                        <div>
                            <vs-avatar class="mt-4 user-profile-img" :src="userData.photo_profil" size="85px" />
                            <h6 class="relative" style="left: 7rem; top: -2rem">
                                <p>{{userData.firstName}} {{userData.lastName}}</p>
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-row mt-base">
                <!-- ABOUT CARD -->
                <vx-card :title="$t('about')" class="ml-4 mr-6 mt-base">
                    <!-- USER BIO -->
                    <div class="user-bio">
                        <p v-if="userData.presentation !== 'null'">{{userData.presentation}}</p>
                        <p v-else>{{$t('noPresentation')}}</p>
                    </div>
                    <!-- OTEHR DATA -->
                    <div class="mt-5">
                        <h6>{{$t('joined')}}:</h6>
                        <p v-if="userData.created_at !== 'undefined' || userData.created_at !== 'null'">{{ new Date(userData.created_at*1000).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric' })}}</p>
                        <p v-else>{{$t('anyDate')}}</p>
                    </div>

                    <div class="mt-5">
                        <h6>{{$t('lives')}}:</h6>
                        <p v-if="userData.ville !== 'null' && userData.pays !== 'null'">{{userData.ville}}, {{userData.pays}}</p>
                        <p v-if="userData.ville !== 'null' && userData.pays === 'null'">{{userData.ville}}</p>
                        <p v-if="userData.ville === 'null' && userData.pays !== 'null'">{{userData.pays}}</p>
                    </div>

                    <div class="mt-5">
                        <h6>Email:</h6>
                        <p>{{ userData.email }}</p>
                    </div>

                    <!-- <div class="flex mt-4 social-links">
                        <feather-icon svgClasses="h-7 w-7 cursor-pointer bg-primary p-1 text-white rounded" class="mr-2" icon="FacebookIcon"></feather-icon>
                        <feather-icon svgClasses="h-7 w-7 cursor-pointer bg-primary p-1 text-white rounded" class="mr-2" icon="TwitterIcon"></feather-icon>
                        <feather-icon svgClasses="h-7 w-7 cursor-pointer bg-primary p-1 text-white rounded" class="mr-2" icon="InstagramIcon"></feather-icon>
                    </div> -->
                </vx-card>

                <!-- Actions -->
                <vx-card title="Actions" class="mt-3 ml-4 mr-6 mb-base">
                    <table  class="-mt-2" style="background: #f8f8f8; border: 2px solid #f8f8f8;">
                        <tr class="flex items-center">
                        <td v-if="admin" class="whitespace-no-wrap">
                            <ejs-tooltip ref="tooltip" :content="$t('sendMail')" position="bottom" class="inline-block mt-1 mr-2 cursor-pointer">
                                <feather-icon icon="MailIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" />
                            </ejs-tooltip>

                            <!-- <ejs-tooltip
                                    ref="tooltip"
                                    :content="$t('disconnectUser')"
                                    position="bottom"
                                    class="inline-block mr-2"
                                    v-if="member.id == membre_id && userRoles.includes('Administrateur')">
                                        <feather-icon
                                            icon="UserXIcon"
                                            svgClasses="w-5 h-5 text-grey stroke-current"/>
                                </ejs-tooltip> -->

                            <ejs-tooltip ref="tooltip" :content="$t('disconnectUser')" position="bottom" class="inline-block mr-2 cursor-pointer" v-if="canLeave">
                                <feather-icon icon="UserXIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" @click.stop="popupActivo2=true" />
                            </ejs-tooltip>

                            <ejs-tooltip ref="tooltip" :content="$t('updateRole')" position="bottom" class="inline-block cursor-pointer">
                                <feather-icon icon="SettingsIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" @click="popupActivo4=true; utilisateur_selectionne=userData.id" />
                            </ejs-tooltip>

                        </td>

                        <!-- Quitter l'association côté membre-->
                        <td class="-ml-2" v-if="(member.id == membre_id && !admin && canLeave)">
                            <ejs-tooltip ref="tooltip" :content="$t('leaveAssociation')" position="bottom" class="inline-block cursor-pointer">
                                <!--<feather-icon icon="UserXIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" @click.stop="popupActivo3=true" />-->
                                <vs-button color="danger" class="px-4 py-2 mr-2" icon-pack="streameline" icon="icon-single-neutral-actions-remove" @click.stop="popupActivo3=true">
                                    {{$t('leaveAssociation')}}
                                </vs-button>
                            </ejs-tooltip>
                        </td>

                        <td class="ml-2 mr-2" v-if="(member.id == membre_id && !admin) && canLeave || admin">|</td>
                        <td class="mr-2 font-semibold">&nbsp;&nbsp;Roles:</td>

                        <td v-if="userData.roles.length > 0" class="inline-block">
                            <vs-chip :key="indextr" v-for="(userRole, indextr) in userData.roles" color="primary">{{userRole}}</vs-chip>
                        </td>
                        <td v-if="userData.roles.length==0" class="inline-block">
                            <vs-chip color="primary">{{$t('member')}}</vs-chip>
                        </td>
                    </tr>
                    </table>
                </vx-card>
            </div>
        </div>

        <!-- Roles -->
        <vs-popup classContent="popup-example" class="popup-position" :title="$t('roleUpdateTitle')+' : '+userData.lastName" :active.sync="popupActivo4">
            <ul class="centerx">
              <li :key="indextr" v-for="(role, indextr) in roles">
                <vs-checkbox @change="onChange(role.id, role.libelle, $event)"
                    :checked="userData.roles.includes(role.libelle)"
                    :disabled="activeUser.id == userData.id && role.libelle == 'Administrateur' && userRoles.includes('Administrateur')"
                    class="mb-3 ml-6">{{role.libelle}}</vs-checkbox>
              </li>
            </ul>
            <vs-divider/>
            <div class="justify-end w-full vx-row">
              <vs-button
                @click="popupActivo4=false"
                type="border">
                    {{$t('cancel')}}
                </vs-button>&nbsp;&nbsp;
              <vs-button
                class="ml-3 vs-con-loading__container"
                ref="loadableButton"
                id="button-loading"
                :disabled="!loader"
                @click="updateRole(utilisateur_selectionne)">
                {{$t('update')}}
              </vs-button>
            </div>
        </vs-popup>

        <!-- Popup pour deconecter un utilisateur d'une association-->
    <vs-popup classContent="popup-example" :title="$t('confirmation')" :active.sync="popupActivo2">
        <p>{{$t('doYouWantToDisconnectThisUserFromThisAssociation')}}</p>
        <vs-divider />
        <div class="justify-end w-full vx-row">
            <vs-button color="warning" @click="popupActivo2=false" type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button class="ml-3 vs-con-loading__container" color="danger" ref="loadableButton" id="button-with-loading" :disabled="!loader" @click.stop="disconnectUser">
                {{$t('Disconnect')}}
            </vs-button>
        </div>
    </vs-popup>

    <!-- Popup pour quitter une association-->
    <vs-popup classContent="popup-example" :title="$t('confirmation')" :active.sync="popupActivo3">
        <p>{{$t('areYouSureYouWantToLeaveThisAssociation')}}</p>
        <vs-divider />
        <div class="justify-end w-full vx-row">
            <vs-button color="warning" @click="popupActivo3=false" type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button class="ml-3 vs-con-loading__container" color="danger" ref="loadableButton" id="button-with-loading" :disabled="!loader" @click.stop="quitterAssociation">
                {{$t('leave')}}
            </vs-button>
        </div>
    </vs-popup>
    </div>
</template>

<script>
// Store Module
/* import moduleCycle from "@/store/cycle/moduleCycle.js"
import moduleActivite from "@/store/activite/moduleActivite.js"
import moduleFinance from "@/store/finance/moduleFinance.js" */
//import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
import {mapGetters} from 'vuex'
import checkIfAdmin from '../../../mixins/checkRole'

export default {
    props: ['userData', 'userRoles','roles', 'member'],
    mixins: [checkIfAdmin],
    data(){
        return {
            //Declaration des variables roles
            selected: false,
            canLeave: true,
            roleIdChecked: [],
            roleIdUnchecked: [],
            popupActivo4: false,
            popupActivo3: false,
            popupActivo2: false,
            membre_id: null,
            utilisateur_selectionne: null,

            /* Loading */
            backgroundLoading:'primary',
            colorLoading:'#fff',
            loader: true,
        }
    },
    computed: {
      ...mapGetters({
        association: 'association/getCurrentAssociation',
        activeUser: 'authentificated/getAuth',
      }),
      admin() {
        return this.isSuperAdministrator
      }

    },
    methods:{
        /* Loader */
        openLoadingContained(){
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-loading",
                scale: 0.45
            });
        },
        //Reccuperer l'id membre de l'utilisateur
        extractMember(members){
            var user = this.activeUser;
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

        onChange(id, libelle, $event){
            if($event.target.checked && !this.userData.roles.includes(libelle)) this.roleIdChecked.push(id)
            else if($event.target.checked && this.userData.roles.includes(libelle)){
                if(this.roleIdUnchecked.includes(id)){
                if(this.roleIdUnchecked.indexOf(id) == 0) this.roleIdUnchecked.shift()
                else this.roleIdUnchecked = this.roleIdUnchecked.splice(this.roleIdUnchecked.indexOf(id)-1,1)
                }
            }
            else if(this.userData.roles.includes(libelle)) this.roleIdUnchecked.push(id)
        },
        //Deconnecter un utilisateur du compte membre
        disconnectUser(){
            var association = this.association;
            var user = this.userData;
            var payload2 = {
                resourceUrl: "/api/association/" + association.id + "/membre/" + this.membre_id + "/disconnect",
                commitAction: 'SET_MEMBER_HAS',
                data: {
                    user_id: user.id,
                    admin_id: association.admin_id
                }
            }
            this.$store.dispatch("association/postRequest", payload2)
                .then(() => {
                    this.popupActivo2 = false

                    let memberPayload = {
                        resourceUrl: "/api/association/" + association.id + "/membre",
                    }
                    this.$store.dispatch("association/fetchMembers", memberPayload)
                        .then(() => {
                            this.$emit('isSidebarActiveLocal', false)

                            this.$vs.notify({
                                position: 'top-center',

                                text: this.$t('userSuccessfullyDisconnect'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'success'
                            })
                        })
                        .catch((error) => {
                            window.console.log(error)
                        })

                })
                .catch(error => {
                    this.uploading = false;
                    this.fileList = [];
                    this.$vs.notify({
                        position: 'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
        /* Quitter une association */
        quitterAssociation() {
            var association = this.association;
            var user = this.activeUser;

            var payload2 = {
                resourceUrl: "/api/association/" + association.id + "/membre/" + this.membre_id + "/disconnect",
                commitAction: 'SET_MEMBER_HAS',
                data: {
                    user_id: user.id,
                    admin_id: association.admin_id
                }
            }
            this.openLoadingContained()
            this.$store.dispatch("association/postRequest", payload2)
                .then(() => {
                    this.$emit('isSidebarActiveLocal', false)
                    this.popupActivo3 = false
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading> .con-vs-loading")

                    this.$router.push('/associations')
                    localStorage.removeItem('association_courante')
                })
                .catch(error => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading> .con-vs-loading")

                    this.uploading = false;
                    this.fileList = [];
                    this.$vs.notify({
                        position: 'top-center',
                        text: error,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        },
        updateRole(user_id){
            var association = this.association;

            //Assigner un role à un utilisateur
            if(this.roleIdChecked.length > 0) {
                this.openLoadingContained()

                var payload2 = {
                    resourceUrl:"/api/association/"+association.id+"/membre/"+this.member.id+"/user/"+user_id+"/assignrole",
                    commitAction: 'NO_COMMIT',
                    data: {
                        role_id: this.roleIdChecked,
                    }
                }
                this.$store.dispatch("association/postRequest", payload2)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close("#button-loading > .con-vs-loading")

                    if(this.roles.length > 0){
                        this.roles.forEach(role=>{
                            if(this.roleIdChecked.includes(role.id)){
                                this.userData.roles.push(role.libelle)
                            }
                        })
                    }
                    this.roleIdChecked = []
                    let rolePayload = {
                        resourceUrl: "/api/association/"+association.id+"/user/"+user_id+"/roles",
                        commitAction: 'FETCH_USER_ASSOCIATION_ROLES'
                    }
                    this.$store.dispatch("association/fetchUserRoles", rolePayload)
                    .then(()=>{
                        let payload = {
                            resourceUrl: '/api/association/'+association.id+ '/membre',
                            commitAction: 'SET_MEMBERS'
                        }

                        this.$store.dispatch("association/fetchMembers",payload)
                        .then(() => this.popupActivo4 = false)
                    })
                    .catch(err => { window.console.error(err) })
                    this.$vs.notify({
                        position:'top-center',
                        title: 'success',
                        text: this.$t('roleSuccessfullyAssigned'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                })
                .catch(error => {
                    this.loader = true
                    this.$vs.loading.close("#button-loading > .con-vs-loading")
                    this.uploading = false;
                    this.$vs.notify({
                    position:'top-center',
                    text: error,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                    })
                })
            }

            //Retirer un role d'un utilisateur
            if(this.roleIdUnchecked.length > 0){
                var payload3 = {
                    resourceUrl:"/api/association/"+association.id+"/membre/"+this.member.id+"/user/"+user_id+"/removerole",
                    commitAction: 'NO_COMMIT',
                    data: {
                        role_id: this.roleIdUnchecked,
                    }
                }
                this.$store.dispatch("association/postRequest", payload3)
                .then(() => {
                    if(this.roles.length > 0){
                        this.roles.forEach(role=>{
                            if(this.roleIdUnchecked.includes(role.id)){
                                 let index = this.userData.roles.indexOf(role.libelle)

                                /*window.console.log(index) */
                                this.userData.roles.splice(index, 1)
                            }
                        })
                    }
                    this.roleIdUnchecked = []
                    let rolePayload = {
                        resourceUrl: "/api/association/"+association.id+"/user/"+user_id+"/roles",
                        commitAction: 'FETCH_USER_ASSOCIATION_ROLES'
                    }
                    this.$store.dispatch("association/fetchUserRoles", rolePayload)
                    .then(()=>{
                        let payload = {
                            resourceUrl: '/api/association/'+association.id+ '/membre',
                            commitAction: 'SET_MEMBERS'
                        }

                        this.$store.dispatch("association/fetchMembers",payload)
                        .then(() =>{ this.popupActivo4 = false })
                    })
                    .catch(err => { window.console.error(err) })
                    this.$vs.notify({
                        position:'top-center',
                        title: 'success',
                        text: this.$t('roleSuccessfullyRemoved'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                })
                .catch(error => {
                    this.uploading = false;
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
    },

    created(){
        /*if(!moduleUserManagement.isRegistered) {
          this.$store.registerModule('userManagement', moduleUserManagement)
          moduleUserManagement.isRegistered = true
        }*/

        let association_courante = this.association;
        let payload = {
            resourceUrl: '/api/association/' + association_courante.id + '/membre',
            commitAction: 'SET_MEMBERS'
        }

        this.$store.dispatch("association/fetchMembers",payload)
        .then((res)=>{
            // Current member
            this.membre_id = this.extractMember(res.data.data);

            // Check if current user is administrator, if yes, we have to check if he is the lone or not.
            // If user is then lone administrator, he can not leave association.
            if(this.userRoles.includes("Administrateur")) {

              var members = this.$store.state.association.members;

              var checker = false;
              members.forEach((member) => {

                if(member.id != this.membre_id) {
                  member.users.forEach((bindedUser) => {

                    if(bindedUser.roles.includes("Administrateur")) {
                      checker = true;
                    }
                  });
                }


              });
              this.canLeave = this.userRoles.includes("Administrateur") && checker;
            }
        })
        .catch((error)=> { window.console.error(error);})
    },
}
</script>
