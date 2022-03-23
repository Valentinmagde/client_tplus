<!-- =========================================================================================
  File Name: VerticalNavMenu.vue
  Description: Vertical NavMenu Component
  Component Name: VerticalNavMenu
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="parentx" id="site-bar-main">
    <!-- Popup pour quitter une association-->
    <vs-popup
      classContent="popup-example"
      :title="$t('confirmation')"
      :active.sync="popupActivo2"
    >
      <p>{{ $t("areYouSureYouWantToLeaveThisAssociation") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="warning" @click="popupActivo2 = false" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;

        <vs-button
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading"
          :disabled="!loader"
          @click.stop="quitterAssociation"
        >
          {{ $t("leave") }}
        </vs-button>
      </div>
    </vs-popup>

    <vs-sidebar
      class="v-nav-menu items-no-padding"
      v-model="isVerticalNavMenuActive"
      ref="verticalNavMenu"
      default-index="-1"
      :click-not-close="clickNotClose"
      :reduce-not-rebound="reduceNotRebound"
      :parent="parent"
      :hiddenBackground="clickNotClose"
      :reduce="reduce"
      v-hammer:swipe.left="onSwipeLeft"
    >
      <div @mouseenter="mouseEnter" @mouseleave="mouseLeave">
        <!-- Header -->
        <div
          class="header-sidebar flex items-end justify-between"
          slot="header"
        >
          <!-- Logo -->
          <div tag="div" class="vx-logo flex items-center">
            <div class="flex">
              <logo class="mr-3 fill-current text-primary" />
              <span
                class="vx-logo-text text-primary"
                v-show="isMouseEnter || !reduce"
                v-if="title"
              >
                {{ title }}
              </span>
            </div>
          </div>
          <!-- /Logo -->

          <!-- Menu Buttons -->
          <div class="flex mb-2">
            <!-- Close Button -->
            <template v-if="showCloseButton">
              <feather-icon
                icon="XIcon"
                class="m-0 cursor-pointer"
                @click="
                  $store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)
                "
              />
            </template>

            <!-- Toggle Buttons -->
            <template v-else-if="!showCloseButton && !verticalNavMenuItemsMin">
              <feather-icon
                id="btnVNavMenuMinToggler"
                class="mr-0 cursor-pointer"
                :icon="reduce ? 'CircleIcon' : 'DiscIcon'"
                svg-classes="stroke-current text-primary"
                @click="toggleReduce(!reduce)"
              />
            </template>
          </div>
          <!-- /Menu Toggle Buttons -->
        </div>
        <!-- /Header -->

        <!-- Header Shadow -->
        <div class="shadow-bottom" v-show="showShadowBottom" />
        <vs-divider class="-mt-1 mb-0" />
        <!-- Menu Items -->
        <VuePerfectScrollbar
          ref="verticalNavMenuPs"
          class="scroll-area-v-nav-menu pb-8"
          :settings="settings"
          @ps-scroll-y="psSectionScroll"
          :key="$vs.rtl"
        >
          <div class="mb-3">
            <div class="flex items-center justify-center flex-wrap">
              <!-- <img class="responsive block rounded-full" :src="associations.logo" alt="profile_pic" style="width:100px; height:100px;"> -->
              <div class="bloc-120c mt-2 mb-1">
                <div
                  v-if="currentAssociation.logo"
                  class="tpimg-circle text-center"
                  :style="{
                    backgroundImage: 'url(' + currentAssociation.logo + ')',
                  }"
                ></div>
                <div v-else class="tpimg-circle text-center"></div>
              </div>
            </div>
            <div
              class="flex items-center justify-center flex-wrap"
              style="margin-top: 10px; white-space: none !important"
            >
              <div class="text-center" style="width: 200px">
                <span class="text-xl font-semibold">{{
                  currentAssociation.nom
                }}</span>
                <p
                  class="text-sm font-light"
                  v-show="!reduce"
                  style="
                    line-height: 1rem;
                    white-space: wrap !important;
                    max-height: 4rem;
                    -webkit-box-orient: vertical;
                    display: block;
                    display: -webkit-box;
                    overflow: hidden !important;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 4;
                  "
                >
                  {{ currentAssociation.description }}
                </p>
              </div>
            </div>
          </div>
          <vs-divider />
          <template v-for="(item, index) in menuItemsUpdated">
            <!-- Group Header -->
            <span
              v-if="item.header && !verticalNavMenuItemsMin"
              class="navigation-header truncate"
              :key="`header-${index}`"
            >
              {{ $t(item.i18n) || item.header }}
            </span>
            <!-- /Group Header -->

            <template v-else-if="!item.header">
              <!-- Nav-Item -->
              <v-nav-menu-item
                v-if="!item.submenu"
                :key="`item-${index}`"
                :index="index"
                :to="item.slug !== 'external' ? item.url : null"
                :href="item.slug === 'external' ? item.url : null"
                :icon="item.icon"
                :target="item.target"
                :isDisabled="item.isDisabled"
                :slug="item.slug"
              >
                <span
                  v-show="
                    !verticalNavMenuItemsMin && item.i18n != 'leaveAssociation'
                  "
                  class="truncate"
                  >{{ $t(item.i18n) || item.name }}</span
                >
                <p
                  v-if="item.i18n == 'leaveAssociation'"
                  class="truncate cursor-pointer"
                  @click="popupActivo2 = true"
                >
                  {{ $t(item.i18n) || item.name }}
                </p>
                <vs-chip
                  class="ml-auto"
                  :color="item.tagColor"
                  v-if="item.tag && (isMouseEnter || !reduce)"
                  >{{ item.tag }}</vs-chip
                >
              </v-nav-menu-item>

              <!-- Nav-Group -->
              <template v-else>
                <v-nav-menu-group
                  :key="`group-${index}`"
                  :openHover="openGroupHover"
                  :group="item"
                  :groupIndex="index"
                  :open="isGroupActive(item)"
                />
              </template>
              <!-- /Nav-Group -->
            </template>
          </template>
        </VuePerfectScrollbar>
        <!-- /Menu Items -->
      </div>
    </vs-sidebar>

    <!-- Swipe Gesture -->
    <div
      v-if="!isVerticalNavMenuActive"
      class="v-nav-menu-swipe-area"
      v-hammer:swipe.right="onSwipeAreaSwipeRight"
    />
    <!-- /Swipe Gesture -->
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VNavMenuGroup from "./VerticalNavMenuGroup.vue";
import VNavMenuItem from "./VerticalNavMenuItem.vue";
// import Association from '@/views/pages/Association/Create/AssociationWith.vue'

import Logo from "../Logo.vue";
// stores
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleUser from "@/store/user/moduleUser.js"
import { mapGetters } from "vuex";

export default {
  name: "v-nav-menu",
  components: {
    VNavMenuGroup,
    VNavMenuItem,
    VuePerfectScrollbar,
    Logo,
  },
  props: {
    logo: {
      type: String,
    },
    openGroupHover: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: String,
    },
    reduceNotRebound: {
      type: Boolean,
      default: true,
    },
    navMenuItems: {
      type: Array,
      required: true,
    },
    navMenuItemsAdmin: {
      type: Array,
    },
    title: {
      type: String,
    },
    //user:               { type: String },
  },
  data: () => ({
    clickNotClose: false, // disable close navMenu on outside click
    isMouseEnter: false,
    reduce: false, // determines if navMenu is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    settings: {
      // perfectScrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true,
    },
    showShadowBottom: false,
    admin: "",
    //associations: '',
    activites: [],
    popupActivo2: false,
    membre_id: null,

    /* Loading */
    backgroundLoading: "danger",
    colorLoading: "#fff",
    loader: true,
  }),
  watch: {
    $route() {
      if (this.isVerticalNavMenuActive && this.showCloseButton)
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);
    },
    reduce(val) {
      const verticalNavMenuWidth = val
        ? "reduced"
        : this.$store.state.windowWidth < 1200
        ? "no-nav-menu"
        : "default";
      this.$store.dispatch("updateVerticalNavMenuWidth", verticalNavMenuWidth);

      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    },
    layoutType() {
      this.setVerticalNavMenuWidth();
    },
    reduceButton() {
      this.setVerticalNavMenuWidth();
    },
    windowWidth() {
      this.setVerticalNavMenuWidth();
    },
  },
  computed: {
    ...mapGetters({
      user: "authentificated/getAuth",
      currentAssociation: "association/getCurrentAssociation",
      rolesData: "association/getUserRoles",
      activitesData: "association/getActivities",
    }),

    isGroupActive() {
      return (item) => {
        const path = this.$route.fullPath;
        const routeParent = this.$route.meta
          ? this.$route.meta.parent
          : undefined;
        let open = false;

        let func = (item) => {
          if (item.submenu) {
            item.submenu.forEach((item) => {
              if (
                item.url &&
                (path === item.url || routeParent === item.slug)
              ) {
                open = true;
              } else if (item.submenu) {
                func(item);
              }
            });
          }
        };
        func(item);
        return open;
      };
    },

    isVerticalNavMenuActive: {
      get() {
        return this.$store.state.isVerticalNavMenuActive;
      },
      set(val) {
        this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", val);
      },
    },

    layoutType() {
      return this.$store.state.mainLayoutType;
    },
    reduceButton: {
      get() {
        return this.$store.state.reduceButton;
      },
      set(val) {
        this.$store.commit("TOGGLE_REDUCE_BUTTON", val);
      },
    },

    isVerticalNavMenuReduced() {
      return Boolean(this.reduce && this.reduceButton);
    },
    verticalNavMenuItemsMin() {
      return this.$store.state.verticalNavMenuItemsMin;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },

    menuItemsUpdated() {
      return this.menuItems();
    },
  },
  created() {
    /*if(!moduleAssociation.isRegistered) {
          this.$store.registerModule('association',  moduleAssociation)
          moduleAssociation.isRegistered = true
        }*/

    /*if(! moduleActivite.isRegistered) {
          this.$store.registerModule('activite',  moduleActivite)
          moduleActivite.isRegistered = true
        }*/

    /*if(! moduleUser.isRegistered) {
          this.$store.registerModule('user',  moduleUser)
          moduleUser.isRegistered = true
        }*/

    /*if (!this.$store.state.association.current_association){
          this.associations = JSON.parse(localStorage.getItem('association_courante'))
        }
        else
          this.associations = this.$store.state.association.current_association*/

    let payload = {
      resourceUrl:
        "api/association/" + this.currentAssociation.id + "/activite",
      commitAction: "SET_ACTIVITES",
    };

    this.$store
      .dispatch("association/fetchAssociationactivite", payload)
      .then(() => {
        let utilisateur = this.user;
        //Recupperer les roles de l'utilisateur
        let payload = {
          resourceUrl:
            "api/association/" +
            this.currentAssociation.id +
            "/user/" +
            utilisateur.id +
            "/roles",
          commitAction: "SET_USER_ROLES",
        };

        this.$store
          .dispatch("authentificated/fetchUserRoles", payload)
          .then(() => {
            let association_courante = this.currentAssociation;
            let payload = {
              resourceUrl:
                "/api/association/" + association_courante.id + "/membre",
              commitAction: "SET_MEMBERS",
            };
            this.$store
              .dispatch("association/fetchMembers", payload)
              .then((res) => {
                this.membre_id = this.extractMember(res.data.data);
              })
              .catch((error) => {
                window.console.error(error);
              });
          })
          .catch((error) => {
            window.console.error(error);
          });
      });
  },
  mounted() {
    this.setVerticalNavMenuWidth();
  },
  methods: {
    //Reccuperer l'id membre de l'utilisateur
    extractMember(members) {
      var user = this.user;
      var id;

      members.forEach((member) => {
        member.users.forEach((author) => {
          if (user.id == author.id) {
            id = member.id;
          }
        });
      });
      return id;
    },
    /* Quitter une association */
    quitterAssociation() {
      var association = this.currentAssociation;
      var user = this.user;

      var payload2 = {
        resourceUrl:
          "/api/association/" +
          association.id +
          "/membre/" +
          this.membre_id +
          "/disconnect",
        commitAction: "SET_MEMBER_HAS",
        data: {
          user_id: user.id,
          admin_id: association.admin_id,
        },
      };
      this.openLoadingContained();
      this.$store
        .dispatch("association/postRequest", payload2)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading> .con-vs-loading");

          this.$router.push({
            name: "associations:list",
          });
        })
        .catch((error) => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading> .con-vs-loading");

          this.uploading = false;
          this.fileList = [];
          this.$vs.notify({
            position: "top-center",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    openLoadingContained() {
      this.loader = false;
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: "#button-with-loading",
        scale: 0.45,
      });
    },
    menuItems() {
      this.$forceUpdate(); // Notice we have to use a $ here
      if (this.$route.path == "/association/home") {
        localStorage.setItem("route", this.$route.path);
      }

      if (this.$route.path == "/association/administration") {
        localStorage.setItem("route", this.$route.path);
      }

      this.$emit("currentDashboard", this.$route.path);

      let clone = [];
      let navMenu = [];
      if (localStorage.getItem("route") == "/association/administration") {
        clone = this.navMenuItemsAdmin.slice();
        navMenu = this.navMenuItemsAdmin;
      } else {
        for (let [index, item] of this.navMenuItems.entries()) {
          if (item.header && (index || 1)) {
            if (item.header === "Navigation") {
              item.items = [
                // {
                //   url: null,
                //   name: "quitter-association",
                //   slug: "",
                //   icon: "single-neutral-actions-remove",
                //   i18n: "leaveAssociation",
                // },
                {
                  url: "/associations",
                  name: "liste-association",
                  slug: "",
                  icon: "multiple-circle",
                  i18n: "myAssociations",
                },
              ];
            }
            /* window.console.log(index) */
          }
        }
        //Remettre le boutton de l'admin

        if (
          this.rolesData.includes("Contrôleur Financier") ||
          this.rolesData.includes("Financier") ||
          this.rolesData.includes("Administrateur") ||
          this.currentAssociation.visibilite_financiere == "OUVERT"
        ) {
          for (let [index, item] of this.navMenuItems.entries()) {
            if (item.header) {
              if (item.header === "Navigation") {
                index = item.items.findIndex((x) => x.name === "admin");

                if (index == -1) {
                  item.items.push({
                    url: "/association/administration",
                    name: "admin",
                    slug: "",
                    icon: "single-neutral-actions-key",
                    i18n: "administrator",
                  });
                  item.items.sort((a, b) => (a.name > b.name ? 1 : -1));
                }
              }
            }
          }
        }
        /* window.console.log(this.navMenuItems, this.rolesData) */
        clone = this.navMenuItems.slice();
        navMenu = this.navMenuItems;
      }

      for (let [index, item] of navMenu.entries()) {
        if (item.header && item.items.length && (index || 1)) {
          let i = clone.findIndex((ix) => ix.header === item.header);
          for (let [subIndex, subItem] of item.items.entries()) {
            clone.splice(i + 1 + subIndex, 0, subItem);
          }
        }
      }
      /* this.getActivite() */

      return clone;
    },

    getActivite() {
      let activities = this.activitesData;

      if (activities.length > 0) {
        // localStorage.setItem('get_activite', JSON.stringify(this.activites))
        let clone, navMenu;
        var role;

        if (localStorage.getItem("route") == "/association/administration") {
          clone = this.navMenuItemsAdmin.slice();
          navMenu = this.navMenuItemsAdmin;
          role = "admin";
        } else {
          clone = this.navMenuItems.slice();
          navMenu = this.navMenuItems;
          role = "editor";
        }

        /* window.console.log(navMenu) */
        for (let [index, item] of navMenu.entries()) {
          if (item.header && item.items.length && (index || 1)) {
            let i = clone.findIndex((ix) => ix.header === item.header);
            for (let [subIndex, subItem] of item.items.entries()) {
              if (subItem.name == "Activities") {
                let defaut_menu = [];
                //Retrait des activites inexistantes
                if (subItem.submenu) {
                  subItem.submenu.forEach((menu) => {
                    //window.console.log(menu.name)
                    if (
                      menu.name == "nouvelle-activite" ||
                      menu.name == "page-activities-all"
                    ) {
                      defaut_menu.push(menu);
                    }
                  });

                  subItem.submenu = defaut_menu;

                  Object.entries(activities).forEach((element) => {
                    let data = "";
                    let index;

                    switch (element[1].type) {
                      case "Generique":
                        data = {
                          url:
                            role == "admin"
                              ? "/association/administration/activities/generic/all"
                              : "/association/activities/generic/all",
                          name: "page-activities-generique",
                          slug: "page-activities-generique",
                          i18n: "generique",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "page-activities-generique"
                        );
                        // here you can check specific property for an object whether it exist in your array or not

                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;

                      case "Tontine":
                        data = {
                          url:
                            role == "admin"
                              ? "/association/administration/activities/tontines/all"
                              : "/association/activities/tontines/all",
                          name: "page-activities-tontine",
                          slug: "page-activities-tontine",
                          i18n: "tontine",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "page-activities-tontine"
                        );
                        // here you can check specific property for an object whether it exist in your array or not

                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;

                      case "Solidarite":
                        data = {
                          url:
                            role == "admin"
                              ? "/association/administration/activities/solidarities/all"
                              : "/association/activities/solidarity/all",
                          name: "page-activities-solidarity-list",
                          slug: "page-activities-solidarity-list",
                          i18n: "solidarity",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "page-activities-solidarity-list"
                        );
                        // here you can check specific property for an object whether it exist in your array or not

                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;

                      case "Mutuelle":
                        data = {
                          url:
                            role == "admin"
                              ? "/association/administration/activities/mutual/all"
                              : "/association/activities/mutual/all",
                          name: "page-activities-mutuelle",
                          slug: "page-activities-mutuelle",
                          i18n: "EpargneCredit",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "page-activities-mutuelle"
                        );
                        // here you can check specific property for an object whether it exist in your array or not

                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;

                      case "Assurence-mutelles":
                        data = {
                          url: null,
                          name: "Assurances-mutuelles",
                          slug: "epargne",
                          i18n: "mutualInsurance",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "Assurence"
                        );
                        // here you can check specific property for an object whether it exist in your array or not

                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;

                      case "Main levée":
                        data = {
                          url: null,
                          nname: "main-leve",
                          slug: "main",
                          i18n: "handRised",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "Main levée"
                        );
                        // here you can check specific property for an object whether it exist in your array or not
                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;
                      case "Projet":
                        data = {
                          url: null,
                          name: "Projet",
                          slug: "Projet",
                          i18n: "Projet",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "Projet"
                        );
                        // here you can check specific property for an object whether it exist in your array or not
                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;
                      case "Evenement":
                        data = {
                          url:
                            role == "admin"
                              ? "/association/administration/activities/events/all"
                              : "/association/activities/events/all",
                          name: "page-activities-event-list",
                          slug: "page-activities-event-list",
                          i18n: "events",
                        };
                        index = subItem.submenu.findIndex(
                          (x) => x.name == "page-activities-event-list"
                        );
                        // here you can check specific property for an object whether it exist in your array or not
                        if (index === -1) {
                          subItem.submenu.push(data);
                        }
                        break;
                      default:
                        break;
                    }
                  });
                }
              }
              clone.splice(i + 1 + subIndex, 0, subItem);
            }
          }
        }
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setVerticalNavMenuWidth();
    },
    onSwipeLeft() {
      if (this.isVerticalNavMenuActive && this.showCloseButton)
        this.isVerticalNavMenuActive = false;
    },
    onSwipeAreaSwipeRight() {
      if (!this.isVerticalNavMenuActive && this.showCloseButton)
        this.isVerticalNavMenuActive = true;
    },
    psSectionScroll() {
      this.showShadowBottom =
        this.$refs.verticalNavMenuPs.$el.scrollTop > 0 ? true : false;
    },
    mouseEnter() {
      if (this.reduce)
        this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", false);
      this.isMouseEnter = true;
    },
    mouseLeave() {
      if (this.reduce)
        this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", true);
      this.isMouseEnter = false;
    },
    setVerticalNavMenuWidth() {
      if (this.windowWidth > 1200) {
        if (this.layoutType === "vertical") {
          // Set reduce
          this.reduce = this.reduceButton ? true : false;

          // Open NavMenu
          this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", true);

          // Set Menu Items Only Icon Mode
          const verticalNavMenuItemsMin =
            this.reduceButton && !this.isMouseEnter ? true : false;
          this.$store.commit(
            "UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN",
            verticalNavMenuItemsMin
          );

          // Menu Action buttons
          this.clickNotClose = true;
          this.showCloseButton = false;

          const verticalNavMenuWidth = this.isVerticalNavMenuReduced
            ? "reduced"
            : "default";
          this.$store.dispatch(
            "updateVerticalNavMenuWidth",
            verticalNavMenuWidth
          );

          return;
        }
      }

      // Close NavMenu
      this.$store.commit("TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE", false);

      // Reduce button
      if (this.reduceButton) this.reduce = false;

      // Menu Action buttons
      this.showCloseButton = true;
      this.clickNotClose = false;

      // Update NavMenu Width
      this.$store.dispatch("updateVerticalNavMenuWidth", "no-nav-menu");

      // Remove Only Icon in Menu
      this.$store.commit("UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN", false);

      // if(this.layoutType === 'vertical' || (this.layoutType === 'horizontal' && this.windowWidth < 1200))
      // if (this.windowWidth < 1200) {

      //   // Close NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', false)

      //   // Reduce button
      //   if (this.reduceButton) this.reduce = false

      //   // Menu Action buttons
      //   this.showCloseButton = true
      //   this.clickNotClose   = false

      //   // Update NavMenu Width
      //   this.$store.dispatch('updateVerticalNavMenuWidth', 'no-nav-menu')

      //   // Remove Only Icon in Menu
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', false)

      // } else {

      //   // Set reduce
      //   this.reduce = this.reduceButton ? true : false

      //   // Open NavMenu
      //   this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true)

      //   // Set Menu Items Only Icon Mode
      //   const verticalNavMenuItemsMin = (this.reduceButton && !this.isMouseEnter) ? true : false
      //   this.$store.commit('UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN', verticalNavMenuItemsMin)

      //   // Menu Action buttons
      //   this.clickNotClose   = true
      //   this.showCloseButton = false

      //   const verticalNavMenuWidth   = this.isVerticalNavMenuReduced ? "reduced" : "default"
      //   this.$store.dispatch('updateVerticalNavMenuWidth', verticalNavMenuWidth)
      // }
    },
    toggleReduce(val) {
      this.reduceButton = val;
      this.setVerticalNavMenuWidth();
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/vuexy/components/verticalNavMenu.scss";

.con-vs-popup {
  z-index: 52020 !important;
}
</style>
