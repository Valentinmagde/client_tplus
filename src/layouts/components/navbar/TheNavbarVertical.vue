<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<div class="relative" :class="{'nav-bg': isAdminDashboard}">

    <div class="vx-navbar-wrapper" :class="classObj">

        <vs-navbar class="vx-navbar navbar-custom navbar-skelton" :color="navbarColorLocal" :class="textColor">

            <!-- SM - OPEN SIDEBAR BUTTON -->
            <feather-icon class="p-2 cursor-pointer sm:inline-flex xl:hidden" icon="MenuIcon" @click.stop="showSidebar" />

            <!-- <bookmarks :navbarColor="navbarColor" v-if="windowWidth >= 992" /> -->
            <close-session v-if="(windowWidth >= 992) && isPast" />

            <vs-spacer />

            <!--Administrateur-->
             <vx-tooltip :text="$t('administrator')" position="bottom" class="inline-block">
                <vs-icon v-if="fetchAdminButton" class="p-2 mr-3 cursor-pointer hover:text-blue" iconPack="streameline" icon="icon-single-neutral-actions-key" @click.stop="$router.push({name: 'association:administration'})" />
             </vx-tooltip>

            <!--Membre-->
            <vx-tooltip :text="$t('myAccount')" position="bottom" class="inline-block">
                <vs-icon v-if="isAdminDashboard" class="p-2 mr-3 cursor-pointer hover:text-blue" iconPack="streameline" icon="icon-single-man" @click.stop="$router.push({name: 'association:home'})" />
            </vx-tooltip>

            <!--Mes association-->
            <vx-tooltip :text="$t('myAssociations')" position="bottom" class="inline-block">
                <vs-icon class="p-2 mr-5 cursor-pointer hover:text-blue" iconPack="streameline" icon="icon-multiple-circle" @click.stop="$router.push({name: 'associations:list'})" />
            </vx-tooltip>
            <i18n class="mr-5" />

            <!-- <search-bar class="mr-4 "/>

       <cart-drop-down />
       <notification-drop-down />

        -->

            <profile-drop-down />

        </vs-navbar>
    </div>
</div>
</template>

<script>
/* import Bookmarks            from "./components/Bookmarks.vue" */
import CloseSession from "./components/CloseSessionAlert.vue"
import I18n from "./components/I18n.vue"
import ProfileDropDown from "./components/ProfileDropDown.vue"

import {
    mapGetters
} from 'vuex'

export default {
    name: "the-navbar-vertical",
    props: {
        navbarColor: {
            type: String,
            default: "#fff",
        },
    },
    data() {
        return {
            ag_courante: null
        }
    },
    components: {
        /* Bookmarks, */
        I18n,
        ProfileDropDown,
        CloseSession
    },
    computed: {
        ...mapGetters({
            user: 'authentificated/getAuth',
            currentAssociation: 'association/getCurrentAssociation',
            rolesData: 'association/getUserRoles',
        }),
        navbarColorLocal() {
            return this.$store.state.theme === "dark" && this.navbarColor === "#fff" ? "#10163a" : this.navbarColor
        },
        verticalNavMenuWidth() {
            return this.$store.state.verticalNavMenuWidth
        },
        textColor() {
            return {
                'text-white': (this.navbarColor != '#10163a' && this.$store.state.theme === 'dark') || (this.navbarColor != '#fff' && this.$store.state.theme !== 'dark')
            }
        },
        windowWidth() {
            return this.$store.state.windowWidth
        },

        // NAVBAR STYLE
        classObj() {
            if (this.verticalNavMenuWidth == "default") return "navbar-default"
            else if (this.verticalNavMenuWidth == "reduced") return "navbar-reduced"
            else if (this.verticalNavMenuWidth) return "navbar-full"
        },

        isPast() {
            let ag_courante = (this.$store.state.association.ags) ? this.$store.state.association.ags.find(e => e.etat == "current") : null;
            if (ag_courante) {
                if (!this.$store.state.association.currentAssociationAg) {
                    this.$store.commit("association/SET_CURRENT_AG", ag_courante)
                }
                if (new Date(ag_courante.date_ag * 1000) < new Date())
                    return true
                else
                    return false
            }
            return false
        },

        fetchAdminButton() {
            if ((this.rolesData.includes("Contrôleur Financier") ||
                    this.rolesData.includes('Financier') ||
                    this.rolesData.includes('Administrateur')) &&
                !this.isAdminDashboard) {
                return true
            } else
                return false
        },

        isAdminDashboard() {
            var path = localStorage.getItem('route')
            if (path == '/association/administration')
                return true
            else
                return false
        },

    },
    methods: {
        showSidebar() {
            this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true);
        }
    }
}
</script>

<style lang="scss">
.nav-bg {
    .vx-navbar-wrapper .vx-navbar {
        background: orange !important;
        color: #fff !important;
    }
}
</style>
