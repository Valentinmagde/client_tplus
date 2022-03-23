<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container">
    <!-- ACTION - DROPDOWN -->
    <vs-dropdown
      v-if="admin"
      vs-trigger-click
      class="ml-auto md:block cursor-pointer fixed z-50"
      style="right: 35px"
    >
      <vs-button icon="icon-settings" icon-pack="feather">{{
        $t("actions")
      }}</vs-button>

      <vs-dropdown-menu class="w-48">
        <vs-dropdown-item>
          <div @click="addNewData('AjoutCompte')" class="flex items-center">
            <feather-icon
              icon="PlusIcon"
              class="inline-block mr-2"
              svgClasses="w-4 h-4"
            />
            <span>{{ $t("addAccount") }}</span>
          </div>
        </vs-dropdown-item>
        <!-- <vs-dropdown-item>
          <div @click="addNewData('AjoutCompteMasse')" class="flex items-center">
            <feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
            <span>{{$t('bulkAdd')}}</span>
          </div>
        </vs-dropdown-item> -->
        <vs-dropdown-item>
          <div @click="addNewData('Import')" class="flex items-center">
            <feather-icon
              icon="DownloadIcon"
              class="inline-block mr-2"
              svgClasses="w-4 h-4"
            />
            <span>{{ $t("import") }}</span>
          </div>
        </vs-dropdown-item>
        <vs-dropdown-item>
          <div @click="popupActivo3 = true" class="flex items-center">
            <feather-icon
              icon="TrashIcon"
              class="inline-block mr-2"
              svgClasses="w-4 h-4"
            />
            <span>{{ $t("deleteSelection") }}</span>
          </div>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>
    <!-- Popup pour supprimer plusieurs membres -->
    <vs-popup
      classContent="popup-example"
      class="popup-position"
      :title="$t('deleteConfirmTitle')"
      :active.sync="popupActivo3"
    >
      <p>{{ $t("deleteConfirms") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="warning" @click="popupActivo3 = false" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;

        <vs-button
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading-many"
          :disabled="!loader"
          @click.stop="deleteManyItems('button-with-loading-many')"
        >
          {{ $t("delete") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour supprimer un membre -->
    <vs-popup
      classContent="popup-example"
      :title="$t('deleteConfirmTitle')"
      :active.sync="popupActivo2"
    >
      <p>{{ $t("deleteConfirm") }}</p>
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
          @click.stop="deleteItem(membre_selectionne, 'button-with-loading')"
        >
          {{ $t("delete") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour desactiver ou activer un membre -->
    <vs-popup
      classContent="popup-example"
      :title="$t('activationOrDesactivationConfirmTitle')"
      :active.sync="popupActivo4"
    >
      <p>{{ $t("activationOrDesactivationConfirm") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button
          color="warning"
          @click="popupActivo4 = false"
          type="border"
          >{{ $t("cancel") }}</vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3"
          color="warning"
          @click.stop="activateOrDesactivate(membre_selectionne, action)"
          >{{ $t("submit") }}</vs-button
        >
      </div>
    </vs-popup>

    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
      :member="member"
      :roles="rolesData"
      :userRoles="userRoles"
    />

    <!-- Tableau de membres à affiché à l'administrateur -->
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <div
          v-if="usersData.length == 0 && admin"
          class="flex flex-wrap-reverse items-center data-list-btn-container"
        >
          <div
            class="
              btn-add-new
              p-3
              mb-4
              mr-4
              rounded-lg
              cursor-pointer
              flex
              items-center
              justify-center
              text-lg
              font-medium
              text-base text-primary
              border border-solid border-primary
            "
            @click.stop="addNewData('AjoutCompte')"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">{{
              $t("newMember")
            }}</span>
          </div>
        </div>
        <vx-card v-if="usersData.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>
      <vs-table
        v-show="admin && usersData.length > 0"
        ref="table"
        class="z-10"
        multiple
        v-model="selected"
        pagination
        :max-items="itemsPerPage"
        search
        :data="usersData"
      >
        <div
          slot="header"
          class="flex flex-wrap-reverse items-center flex-grow justify-between"
        >
          <div
            class="flex flex-wrap-reverse items-center data-list-btn-container"
          >
            <!-- ACTION - DROPDOWN -->
            <vs-dropdown
              vs-trigger-click
              class="dd-actions cursor-pointer mr-4 mb-4"
            >
              <div
                class="
                  p-4
                  shadow-drop
                  rounded-lg
                  d-theme-dark-bg
                  cursor-pointer
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-medium
                  w-32 w-full
                "
              >
                <span class="mr-2">{{ $t("exports") }}</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
              </div>

              <vs-dropdown-menu style="width: 10rem">
                <vs-dropdown-item>
                  <span
                    class="flex items-center"
                    @click.stop="exportPDF(usersData)"
                  >
                    <feather-icon
                      icon="FileIcon"
                      svgClasses="h-4 w-4"
                      class="mr-2"
                    />
                    <span>PDF</span>
                  </span>
                </vs-dropdown-item>

                <vs-dropdown-item>
                  <span
                    class="flex items-center"
                    @click.stop="csvExport(usersData)"
                  >
                    <feather-icon
                      icon="FileIcon"
                      svgClasses="h-4 w-4"
                      class="mr-2"
                    />
                    <span>CSV</span>
                  </span>
                </vs-dropdown-item>

                <vs-dropdown-item>
                  <span
                    class="flex items-center"
                    @click.stop="exportExel(usersData)"
                  >
                    <feather-icon
                      icon="FileIcon"
                      svgClasses="h-4 w-4"
                      class="mr-2"
                    />
                    <span>EXCEL</span>
                  </span>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>

            <!-- ADD NEW -->
            <div
              class="
                btn-add-new
                p-3
                mb-4
                mr-4
                rounded-lg
                cursor-pointer
                flex
                items-center
                justify-center
                text-lg
                font-medium
                text-base text-primary
                border border-solid border-primary
              "
              @click.stop="addNewData('AjoutCompte')"
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{
                $t("newMember")
              }}</span>
            </div>
          </div>

          <!-- ITEMS PER PAGE -->
          <vs-dropdown
            vs-trigger-click
            class="cursor-pointer mb-4 mr-4 items-per-page-handler"
          >
            <div
              class="
                p-4
                border border-solid
                d-theme-border-grey-light
                rounded-full
                d-theme-dark-bg
                cursor-pointer
                flex
                items-center
                justify-between
                font-medium
              "
            >
              <span class="mr-2"
                >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                  usersData.length - currentPage * itemsPerPage > 0
                    ? currentPage * itemsPerPage
                    : usersData.length
                }}
                of {{ queriedItems }}</span
              >
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>
              <vs-dropdown-item @click="itemsPerPage = 4">
                <span>4</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 10">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 15">
                <span>15</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 20">
                <span>20</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <template slot="thead">
          <vs-th sort-key="firstName">{{ $t("accounts") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="date_created">{{
            $t("creationDate") | CAPITALIZE
          }}</vs-th>
          <vs-th sort-key="users">{{ $t("User") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="order_status">{{ $t("state") | CAPITALIZE }}</vs-th>
          <vs-th>{{ $t("actions") | CAPITALIZE }}</vs-th>
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :key="ind" v-for="(membre, ind) in data">
              <vs-td>
                <p class="product-name font-medium truncate">
                  {{ membre.firstName }}
                </p>
              </vs-td>

              <vs-td>
                <p class="product-category">
                  {{ membre.date_created | dateTime }}
                </p>
              </vs-td>

              <vs-td>
                <ul class="users-liked user-list" style="margin-bottom: -5px">
                  <li :key="indextr" v-for="(user, indextr) in membre.users">
                    <vx-tooltip :text="user.firstName" position="bottom">
                      <vs-avatar
                        v-if="user.photo_profil"
                        :src="user.photo_profil"
                        size="35px"
                        class="border-2 border-white border-solid -m-1"
                        @click.stop="
                          userDetail(user, membre, rolesData, user.roles)
                        "
                      ></vs-avatar>
                      <vs-avatar
                        v-else
                        size="35px"
                        class="border-2 border-white border-solid -m-1"
                        @click.stop="
                          userDetail(user, membre, rolesData, user.roles)
                        "
                      ></vs-avatar>
                    </vx-tooltip>
                  </li>
                </ul>
              </vs-td>

              <vs-td>
                <p v-if="membre.etat == 'init'" class="product-price">
                  <vs-chip>{{ $t("creation") }}</vs-chip>
                </p>
                <p v-if="membre.etat == 'connect'" class="product-price">
                  <vs-chip color="warning" class="text-dark">{{
                    $t("connection")
                  }}</vs-chip>
                </p>
                <p v-if="membre.etat == 'disconnect'" class="product-price">
                  <vs-chip color="dark">{{ $t("disconnect") }}</vs-chip>
                </p>
                <p v-if="membre.etat == 'activate'" class="product-price">
                  <vs-chip color="success">{{ $t("activate") }}</vs-chip>
                </p>
                <p v-if="membre.etat == 'desactivate'" class="product-price">
                  <vs-chip>{{ $t("deactivate") }}</vs-chip>
                </p>
              </vs-td>

              <vs-td class="whitespace-no-wrap">
                <!-- Details d'un membre-->
                <vx-tooltip
                  :text="$t('detail')"
                  position="bottom"
                  class="inline-block"
                >
                  <feather-icon
                    icon="EyeIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    class="mr-2"
                    @click.stop="sendData('DetailCompte', membre)"
                  />
                </vx-tooltip>

                <!-- Invite un membre -->
                <vx-tooltip
                  :text="$t('invite')"
                  position="bottom"
                  class="inline-block"
                >
                  <feather-icon
                    icon="UserPlusIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    class="mr-2"
                    @click.stop="inviteData(membre)"
                  />
                </vx-tooltip>

                <!-- Mettre à jour un membre -->
                <vx-tooltip
                  :text="$t('update')"
                  position="bottom"
                  class="inline-block"
                >
                  <feather-icon
                    icon="EditIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    class="mr-2"
                    @click.stop="sendData('ModifierCompte', membre)"
                  />
                </vx-tooltip>

                <!-- Supprimer un membre -->
                <vx-tooltip
                  :text="$t('delete')"
                  position="bottom"
                  class="inline-block"
                >
                  <feather-icon
                    v-if="
                      membre_connecte &&
                      membre.id != membre_connecte.id &&
                      !(nb_admin == 1 && membre_admin(membre) == 1)
                    "
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    class="mr-2"
                    @click.stop="
                      popupActivo2 = true;
                      membre_selectionne = membre.id;
                    "
                  />
                </vx-tooltip>

                <!-- Desactiver un membre -->
                <vx-tooltip
                  :text="$t('desactivate')"
                  position="bottom"
                  class="inline-block"
                >
                  <vs-icon
                    v-if="
                      membre_connecte &&
                      membre.id != membre_connecte.id &&
                      !(nb_admin == 1 && membre_admin(membre) == 1) &&
                      membre.etat != 'desactivate'
                    "
                    icon-pack="streameline"
                    icon="icon-single-neutral-actions-block"
                    style="font-size: 18px"
                    class="hover:text-warning"
                    size="small"
                    @click.stop="
                      popupActivo4 = true;
                      membre_selectionne = membre.id;
                      action = 'desactivate';
                    "
                  >
                  </vs-icon>
                </vx-tooltip>

                <!-- Activer un membre -->
                <vx-tooltip
                  :text="$t('activate')"
                  position="bottom"
                  class="inline-block"
                >
                  <vs-icon
                    v-if="membre.etat == 'desactivate'"
                    icon-pack="streameline"
                    icon="icon-single-neutral-actions-sync"
                    style="font-size: 18px"
                    class="hover:text-primary"
                    size="small"
                    @click.stop="
                      popupActivo4 = true;
                      membre_selectionne = membre.id;
                      action = 'activate';
                    "
                  >
                  </vs-icon>
                </vx-tooltip>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>

      <!-- Tableau de membres à affiché aux membres de l'association -->
      <vs-table
        v-show="!admin && usersData.length != 0"
        ref="table"
        :data="usersData"
        pagination
        :max-items="itemsPerPage"
        search
      >
        <div
          slot="header"
          class="flex flex-wrap-reverse items-center flex-grow justify-between"
        >
          <div
            class="flex flex-wrap-reverse items-center data-list-btn-container"
          >
            <!-- ACTION - DROPDOWN -->
            <vs-dropdown
              vs-trigger-click
              class="dd-actions cursor-pointer mr-4 mb-4"
            >
              <div
                class="
                  p-4
                  shadow-drop
                  rounded-lg
                  d-theme-dark-bg
                  cursor-pointer
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-medium
                  w-32 w-full
                "
              >
                <span class="mr-2">{{ $t("exports") }}</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
              </div>

              <vs-dropdown-menu style="width: 10rem">
                <vs-dropdown-item>
                  <span
                    class="flex items-center"
                    @click.stop="exportPDF(usersData)"
                  >
                    <feather-icon
                      icon="FileIcon"
                      svgClasses="h-4 w-4"
                      class="mr-2"
                    />
                    <span>PDF</span>
                  </span>
                </vs-dropdown-item>

                <vs-dropdown-item>
                  <span
                    class="flex items-center"
                    @click.stop="csvExport(usersData)"
                  >
                    <feather-icon
                      icon="FileIcon"
                      svgClasses="h-4 w-4"
                      class="mr-2"
                    />
                    <span>CSV</span>
                  </span>
                </vs-dropdown-item>

                <vs-dropdown-item>
                  <span
                    class="flex items-center"
                    @click.stop="exportExel(usersData)"
                  >
                    <feather-icon
                      icon="FileIcon"
                      svgClasses="h-4 w-4"
                      class="mr-2"
                    />
                    <span>EXCEL</span>
                  </span>
                </vs-dropdown-item>
              </vs-dropdown-menu>
            </vs-dropdown>
          </div>

          <!-- ITEMS PER PAGE -->
          <vs-dropdown
            vs-trigger-click
            class="cursor-pointer mb-4 mr-4 items-per-page-handler"
          >
            <div
              class="
                p-4
                border border-solid
                d-theme-border-grey-light
                rounded-full
                d-theme-dark-bg
                cursor-pointer
                flex
                items-center
                justify-between
                font-medium
              "
            >
              <span class="mr-2"
                >{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                  usersData.length - currentPage * itemsPerPage > 0
                    ? currentPage * itemsPerPage
                    : usersData.length
                }}
                of {{ queriedItems }}</span
              >
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>
              <vs-dropdown-item @click="itemsPerPage = 4">
                <span>4</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 10">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 15">
                <span>15</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="itemsPerPage = 20">
                <span>20</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
        <template slot="thead">
          <vs-th sort-key="firstName">{{ $t("name") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="date_created">{{
            $t("creationDate") | CAPITALIZE
          }}</vs-th>
          <vs-th sort-key="users">{{ $t("User") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="order_status">{{ $t("state") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="action">{{ $t("actions") | CAPITALIZE }}</vs-th>
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p class="product-name font-medium truncate">
                  {{ tr.firstName }} {{ tr.lastName }}
                </p>
              </vs-td>

              <vs-td>
                <p class="product-name font-medium truncate">
                  {{ tr.date_created | dateTime }}
                </p>
              </vs-td>

              <vs-td>
                <ul class="users-liked user-list" style="margin-bottom: -5px">
                  <li :key="indextr" v-for="(user, indextr) in tr.users">
                    <vx-tooltip
                      v-if="user.lastName"
                      :text="user.lastName"
                      position="bottom"
                    >
                      <vs-avatar
                        v-if="user.photo_profil"
                        :src="user.photo_profil"
                        size="35px"
                        class="border-2 border-white border-solid -m-1"
                        @click.stop="
                          userDetail(user, tr, rolesData, user.roles)
                        "
                      ></vs-avatar>
                      <vs-avatar
                        v-else
                        size="35px"
                        class="border-2 border-white border-solid -m-1"
                        @click.stop="
                          userDetail(user, tr, rolesData, user.roles)
                        "
                      ></vs-avatar>
                    </vx-tooltip>
                    <vx-tooltip
                      v-else-if="user.firstName"
                      :text="user.firstName"
                      position="bottom"
                    >
                      <vs-avatar
                        v-if="user.photo_profil"
                        :src="user.photo_profil"
                        size="35px"
                        class="border-2 border-white border-solid -m-1"
                        @click.stop="
                          userDetail(user, tr, rolesData, user.roles)
                        "
                      ></vs-avatar>
                      <vs-avatar
                        v-else
                        size="35px"
                        class="border-2 border-white border-solid -m-1"
                        @click.stop="
                          userDetail(user, tr, rolesData, user.roles)
                        "
                      ></vs-avatar>
                    </vx-tooltip>
                  </li>
                </ul>
              </vs-td>
              <vs-td>
                <p v-if="tr.etat == 'init'" class="product-price">
                  <vs-chip>{{ $t("creation") }}</vs-chip>
                </p>
                <p v-if="tr.etat == 'connect'" class="product-price">
                  <vs-chip color="warning" class="text-dark">{{
                    $t("connection")
                  }}</vs-chip>
                </p>
                <p v-if="tr.etat == 'disconnect'" class="product-price">
                  <vs-chip color="dark">{{ $t("disconnect") }}</vs-chip>
                </p>
                <p v-if="tr.etat == 'activate'" class="product-price">
                  <vs-chip color="success">{{ $t("activate") }}</vs-chip>
                </p>
                <p v-if="tr.etat == 'desactivate'" class="product-price">
                  <vs-chip>{{ $t("deactivate") }}</vs-chip>
                </p>
              </vs-td>
              <vs-td class="whitespace-no-wrap">
                <vx-tooltip
                  :text="$t('activities')"
                  position="bottom"
                  class="inline-block"
                  @click.native="redirectMember(tr)"
                >
                  <icon name="tool-box"></icon>
                </vx-tooltip>
                <!-- <vx-tooltip :text="$t('email')" position="bottom"  class="inline-block">
                    <a style="color:#626262" v-bind:href=" 'mailto:'">
                      <icon name="email-action-unread" class="ml-2"></icon>
                    </a>
                  </vx-tooltip> -->
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
import functions from "../services/functions.js";
import DataViewSidebar from "../../../components/sidebar/DataViewSidebar.component.vue";

// Functions
import { EventBus } from "@/services/EventBus.js";

import { mapGetters } from "vuex";

import checkIfAdmin from "../../../mixins/checkRole";

// Store Module
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleRole from "@/store/role/moduleRole.js"

export default {
  mixins: [checkIfAdmin],

  components: {
    DataViewSidebar,
  },
  data() {
    return {
      selected: [],
      // usersData: [],
      itemsPerPage: 10,
      isMounted: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: "",
      membre_selectionne: "",
      action: "",
      member: {},
      role: {},
      userRoles: {},
      visibilite: "",
      popupActivo2: false,
      popupActivo3: false,
      popupActivo4: false,
      membre_connecte: null,

      /* Loading */
      backgroundLoading: "danger",
      colorLoading: "#fff",
      loader: true,
    };
  },

  computed: {
    ...mapGetters({
      activeUserInfo: "authentificated/getAuth",
      association: "association/getCurrentAssociation",
    }),
    // See the imported mixins file
    admin() {
      return this.isSuperAdministrator;
    },
    usersData() {
      let membres = this.$store.state.association.members;
      return membres.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
    },
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    rolesData() {
      return this.$store.state.association.roles;
    },
    userRolesData() {
      return this.$store.state.authentificated.roles;
    },
    nb_admin() {
      let cpt = 0;
      if (this.usersData != null) {
        this.usersData.forEach((membre) => {
          if (membre.users.length > 0) {
            membre.users.forEach((user) => {
              if (user.roles.includes("Administrateur")) {
                cpt++;
              }
            });
          }
        });
      }

      return cpt;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.usersData.length;
    },
  },
  methods: {
    addNewData(etat) {
      this.etat = etat;
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },
    sendData(etat, data) {
      this.etat = etat;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    inviteData(data) {
      this.etat = "Invitation";
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    //Afficher les infos d'un utilisateur
    userDetail(data, member, roles, userRole) {
      this.etat = "Detail";
      this.member = member;
      this.role = roles;
      this.userRoles = userRole;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    //Redirige vers les activités d'un membre
    redirectMember(member) {
      // To manage page reloading, store member ID in the local storage
      localStorage.setItem("member_id", member.id);
      this.$store.commit("association/SET_MEMBER", member);
      this.$router.push("/association/member/activities");
    },
    deleteManyItems(idLoader) {
      var association_courante = this.association;

      //Recuperer la liste des id selectionnés
      var id = new Array();
      var inc = 0;
      this.selected.forEach((value) => {
        id[inc] = value.id;
        inc++;
      });

      if (id.length == 0) {
        this.$vs.notify({
          position: "top-center",
          text: this.$t("noItemSelected"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });

        return false;
      }
      this.openLoadingContained(idLoader);
      let payload = {
        resourceUrl:
          "/api/association/" + association_courante.id + "/membres/delete",
        commitAction: "SET_ACCOUNT",
        data: {
          id: id,
        },
      };

      this.$store
        .dispatch("association/postRequest", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close(`#${idLoader}> .con-vs-loading`);
          this.popupActivo3 = false;
          this.selected = [];
          this.$vs.notify({
            position: "top-center",
            text: this.$t("accountSuccessfullyDeleted"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });

          let playload = {
            resourceUrl:
              "/api/association/" + association_courante.id + "/membre",
            commitAction: "SET_MEMBERS",
          };
          this.$store
            .dispatch("association/fetchMembers", playload)
            .catch((err) => {
              this.loader = true;
              this.$vs.loading.close(`#${idLoader}> .con-vs-loading`);
              window.console.error(err);
            });
        })
        .catch((err) => {
          this.loader = true;
          this.$vs.loading.close(`#${idLoader}> .con-vs-loading`);
          window.console.error(err);
        });
    },

    /* Supprimer un compte membre */
    deleteItem(id, idLoader) {
      this.openLoadingContained(idLoader);

      var association_courante = this.association;

      let payload = {
        resourceUrl:
          "/api/association/" + association_courante.id + "/membre/" + id,
        commitAction: "REMOVE_ACCOUNT",
        memberId: id,
      };

      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close(`#${idLoader}> .con-vs-loading`);
          this.popupActivo2 = false;
          this.$vs.notify({
            position: "top-center",
            text: this.$t("accountSuccessfullyDeleted"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          let payload = {
            resourceUrl:
              "/api/association/" + association_courante.id + "/membre",
            commitAction: "SET_MEMBERS",
          };
          this.$store
            .dispatch("association/fetchMembers", payload)
            .catch((err) => {
              window.console.error(err);
            });
        })
        .catch((err) => {
          this.loader = true;
          this.$vs.loading.close(`#${idLoader}> .con-vs-loading`);
          window.console.error(err);
        });
    },

    /* Activer ou desactiver un membre */
    activateOrDesactivate(id, action) {
      let association_courante = this.association;

      let payload = {
        resourceUrl:
          "/api/association/" +
          association_courante.id +
          "/membre/" +
          id +
          "/" +
          action,
        commitAction: "SET_MEMBER",
      };

      this.$store
        .dispatch("association/postRequest", payload)
        .then(() => {
          this.popupActivo4 = false;
          this.$vs.notify({
            position: "top-center",
            text: this.$t("operationCompletedSuccessfully"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          let payload = {
            resourceUrl:
              "/api/association/" + association_courante.id + "/membre",
            commitAction: "SET_MEMBERS",
          };
          this.$store
            .dispatch("association/fetchMembers", payload)
            .catch((err) => {
              window.console.error(err);
            });
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
    //exporation du tableau en csv
    csvExport(arrData) {
      let cur_ass = this.association;

      functions.csvExport(arrData, cur_ass);
    },

    exportPDF(arrData) {
      let current_ass = this.association;

      functions.exportPDF(arrData, current_ass);
    },

    //exporation du tableau en csv
    exportExel(arrData) {
      let curt_ass = this.association;
      functions.exportExel(arrData, curt_ass);
    },
    membre_admin(membre) {
      let cpt = 0;
      if (membre.users.length > 0) {
        membre.users.forEach((user) => {
          if (user.roles.includes("Administrateur")) {
            cpt++;
          }
        });
      }

      return cpt;
    },
    /*
     *@param members
     *@return id  //retourne l'id membre de l'utilisateur connecté
     */
    extractMember(members) {
      var user = this.activeUserInfo;
      var membre;

      members.forEach((member) => {
        member.users.forEach((author) => {
          if (user.id == author.id) {
            membre = member;
          }
        });
      });
      return membre;
    },

    openLoadingContained(id) {
      this.loader = false;
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: `#${id}`,
        scale: 0.45,
      });
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
  },
  created() {
    EventBus.$emit("loader", true);

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

    if(!moduleRole.isRegistered) {
      this.$store.registerModule('roles', moduleRole)
      moduleRole.isRegistered = true
    }*/
    var current_association = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl: "/api/association/" + current_association.id + "/membre",
      commitAction: "SET_MEMBERS",
    };

    this.$store
      .dispatch("association/fetchMembers", payload)
      .then((res) => {
        if (res.data.status == "OK") {
          this.membre_connecte = this.extractMember(res.data.data);

          //Listes des roles
          let payloadRoles = {
            resourceUrl: "/api/role/get",
            commitAction: "SET_ROLES",
          };

          this.$store
            .dispatch("association/fetchPossibleRoles", payloadRoles)
            .then(() => {
              EventBus.$emit("loader", false);
            })
            .catch((err) => {
              EventBus.$emit("loader", false);
              window.console.error(err);
            });

          //Listes des roles l'utilisateur connecté
          var user = this.activeUserInfo;
          let payloadUserRoles = {
            resourceUrl:
              "/api/association/" +
              current_association.id +
              "/user/" +
              user.id +
              "/roles",
            commitAction: "SET_USER_ROLES",
          };

          this.$store
            .dispatch("authentificated/fetchUserRoles", payloadUserRoles)
            .catch((err) => {
              window.console.error(err);
            });
        }
      })
      .catch((err) => {
        window.console.error(err);
      });

    /* Visibilité de l'association courante */
    this.visibilite = current_association.visibilite_financiere;
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>
