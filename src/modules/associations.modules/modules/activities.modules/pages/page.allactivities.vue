<template>
  <div>
    <!-- Admin -->
    <div v-if="admin" id="data-list-list-view" class="data-list-container">
      <!-- Popup pour supprimer un membre -->
      <vs-popup
        classContent="popup-example"
        :title="$t('deleteConfirmTitle')"
        :active.sync="popupActivo2"
      >
        <p>{{ $t("deleteConfirm") }}</p>
        <vs-divider />
        <div class="vx-row w-full justify-end">
          <vs-button
            color="warning"
            @click="popupActivo2 = false"
            type="border"
          >
            {{ $t("cancel") }} </vs-button
          >&nbsp;&nbsp;
          <vs-button
            class="ml-3 vs-con-loading__container"
            color="danger"
            ref="loadableButton"
            id="button-with-loading"
            :disabled="!loader"
            @click.stop="deleteItem(activite_selectionne)"
            >{{ $t("delete") }}</vs-button
          >
        </div>
      </vs-popup>

      <div
        class="w-full fixed z-20 top-0"
        style="height: 150px; background-color: #f8f8f8"
      />
      <div class="pt-16">
        <div class="ml-5 mr-5" v-if="activitesData.length == 0">
          <div
            class="flex flex-wrap-reverse items-center data-list-btn-container"
          >
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
              @click="
                $router
                  .push('/association/administration/activity/create')
                  .catch(() => {})
              "
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{
                $t("newActivities")
              }}</span>
            </div>
          </div>

          <vx-card>
            <p>{{ $t("noElementFound") }}</p>
          </vx-card>
        </div>
        <!-- Tableau des activites -->
        <vs-table
          v-show="activitesData.length > 0"
          ref="table"
          :data="activitesData"
          pagination
          :max-items="itemsPerPage"
          search
        >
          <div
            slot="header"
            class="
              flex flex-wrap-reverse
              items-center
              flex-grow
              justify-between
            "
          >
            <div
              class="
                flex flex-wrap-reverse
                items-center
                data-list-btn-container
              "
            >
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
                @click="
                  $router
                    .push('/association/administration/activity/create')
                    .catch(() => {})
                "
              >
                <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                <span class="ml-2 text-base text-primary">{{
                  $t("newActivities")
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
                    activitesData.length - currentPage * itemsPerPage > 0
                      ? currentPage * itemsPerPage
                      : activitesData.length
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
            <vs-th>{{ $t("Type") | CAPITALIZE }}</vs-th>
            <vs-th>{{ $t("name") | CAPITALIZE }}</vs-th>
            <vs-th>{{ $t("description") | CAPITALIZE }}</vs-th>
            <vs-th>{{ $t("penaltyForFailure") | CAPITALIZE }} </vs-th>
            <vs-th>{{ $t("state") | CAPITALIZE }} </vs-th>
            <vs-th>{{ $t("actions") | CAPITALIZE }} </vs-th>
          </template>

          <template slot-scope="{ data }">
            <vs-tr
              :key="ind"
              v-for="(tr, ind) in data"
              @click.native="redirectDetails(tr)"
              class="cursor-pointer"
            >
              <vs-td>
                <p class="product-name">
                  <span class="hidden">{{ tr.type }}</span>
                  <!-- Caisse -->
                  <span v-if="tr.type == 'caisse'">
                    <vx-tooltip
                      :text="$t('generique')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-tool-box"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>
                  <!-- Generique -->
                  <span v-if="tr.type == 'Generique'">
                    <vx-tooltip
                      :text="$t('generique')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-tool-box"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>
                  <!-- Tontine -->
                  <span v-if="tr.type == 'Tontine'">
                    <vx-tooltip
                      :text="$t('tontine')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-money-bags"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>
                  <!-- Evenement -->
                  <span v-if="tr.type == 'Evenement'">
                    <vx-tooltip
                      :text="$t('events')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-calendar-check-1"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>
                  <!-- Mutuelle -->
                  <span v-if="tr.type == 'Mutuelle'">
                    <vx-tooltip
                      :text="$t('EpargneCredit')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-saving-piggy-coins"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>
                  <!-- Projet -->
                  <span v-if="tr.type == 'Projet'">
                    <vx-tooltip
                      :text="t('project')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-team-idea"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>
                  <!-- Solidarité -->
                  <span v-if="tr.type == 'Solidarite'">
                    <vx-tooltip
                      :text="$t('solidarity')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-multiple-actions-heart"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>

                  <!-- Main levee -->
                  <span v-if="tr.type == 'Main_levee'">
                    <vx-tooltip
                      :text="$t('handSUp')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        icon="icon-cash-payment-bills-1"
                      ></vs-icon>
                    </vx-tooltip>
                  </span>
                </p>
              </vs-td>
              <vs-td>
                <p class="product-name font-medium truncate">
                  {{ tr.nom }}
                </p>
              </vs-td>

              <vs-td>
                <p class="product-name truncate">
                  {{ tr.description | truncate }}
                </p>
              </vs-td>

              <vs-td>
                <p
                  v-if="
                    tr.type_penalite == 'POURCENTag.fileAGE' &&
                    tr.taux_penalite != null
                  "
                  class="product-name"
                >
                  {{ tr.taux_penalite + "%" }}
                </p>
                <p
                  v-if="
                    tr.type_penalite == 'FORFAITAIRE' &&
                    tr.taux_penalite != null
                  "
                  class="product-name"
                >
                  <span :class="{ redtextclass: tr.taux_penalite < 0 }">
                    {{ tr.taux_penalite | formatMoney(devise) }}
                  </span>
                </p>
              </vs-td>
              <vs-td>
                <p v-if="tr.etat == 'init'" class="product-price">
                  <vs-chip>{{ $t("creation") }}</vs-chip>
                </p>
                <p v-if="tr.etat == 'actif'" class="product-price">
                  <vs-chip color="success">{{ $t("activate") }}</vs-chip>
                </p>
                <p v-if="tr.etat == 'inactif'" class="product-price">
                  <vs-chip color="danger">{{ $t("desactivate") }}</vs-chip>
                </p>
                <p v-if="tr.etat == 'cloture'" class="product-price">
                  <vs-chip color="dark">{{ $t("cloturer") }}</vs-chip>
                </p>
              </vs-td>
              <vs-td>
                <!--<vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block ">
                  <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"  @click="redirectDetails(tr)"/>
                </vx-tooltip>-->
                <vx-tooltip
                  v-if="admin && tr.type != 'caisse'"
                  :text="$t('delete')"
                  position="bottom"
                  class="inline-block ml-2"
                >
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    @click.stop="
                      popupActivo2 = true;
                      activite_selectionne = tr.id;
                    "
                  />
                </vx-tooltip>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>

    <!-- Membre -->
    <div v-if="!admin">
      <div
        class="w-full fixed z-20 top-0"
        style="height: 150px; background-color: #f8f8f8"
      />
      <div class="pt-16">
        <div class="ml-5 mr-5">
          <!-- <vx-card class="mb-5">
              <h4  class="mb-2"> {{ $t('listofgenericactivities') | CAPITALIZE }} </h4>
          </vx-card> -->
          <vx-card v-if="comptesData.length == 0">
            <p>{{ $t("noElementFound") }}</p>
          </vx-card>
        </div>
        <!-- Membre -->
        <div class="vx-row">
          <!-- Liste des toutes les activités du membre-->
          <div v-show="comptesData.length > 0" class="vx-col w-full">
            <vx-card
              :title="
                $t('listOfAllActivities') +
                ' ' +
                $t('ofTheMember').toLowerCase() +
                ' ' +
                memberName
              "
            >
              <div slot="no-body" class="mt-4">
                <div
                  class="vx-row justify-end flex pb-5 mr-5"
                  style="margin-top: -2.3rem !important"
                >
                  <vs-dropdown
                    vs-trigger-click
                    class="relative right-0 cursor-pointer self-end"
                  >
                    <small class="flex cursor-pointer">
                      <span>{{ $t("exports") }}</span>
                      <feather-icon
                        icon="ChevronDownIcon"
                        svgClasses="h-4 w-4"
                        class="ml-1"
                      />
                    </small>
                    <vs-dropdown-menu class="w-32">
                      <vs-dropdown-item @click.native="activitiesExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="activitiesExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item
                        @click.native="activitiesExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <vs-table
                  :data="comptesData"
                  class="table-dark-inverted overflow-auto"
                  style="max-height: 40rem"
                >
                  <template slot="thead">
                    <vs-th sort-key="type_activite">{{
                      $t("Type") | CAPITALIZE
                    }}</vs-th>
                    <vs-th sort-key="nom_activite">{{
                      $t("name") | CAPITALIZE
                    }}</vs-th>
                    <vs-th sort-key="solde"
                      ><span class="text-right w-full">{{
                        $t("balance") | CAPITALIZE
                      }}</span></vs-th
                    >
                    <vs-th sort-key="dettes"
                      ><span class="text-right w-full">{{
                        $t("debt") | CAPITALIZE
                      }}</span></vs-th
                    >
                    <vs-th sort-key="avoirs"
                      ><span class="text-right w-full">{{
                        $t("assets") | CAPITALIZE
                      }}</span></vs-th
                    >
                    <vs-th sort-key="interet"
                      ><span class="text-right w-full">{{
                        $t("interests") | CAPITALIZE
                      }}</span></vs-th
                    >
                    <vs-th sort-key="encaissement"
                      ><span class="text-right w-full">{{
                        $t("expectedPayment") | CAPITALIZE
                      }}</span></vs-th
                    >
                    <vs-th sort-key="decaissement"
                      ><span class="text-right w-full">{{
                        $t("expectedDisbursement") | CAPITALIZE
                      }}</span></vs-th
                    >
                  </template>
                  <template slot-scope="{ data }">
                    <vs-tr
                      class="cursor-pointer"
                      :key="indextr"
                      v-for="(tr, indextr) in data"
                      @click.native="redirectDetail(tr)"
                    >
                      <vs-td :data="data[indextr].type">
                        <p class="product-name">
                          <!-- Caisse -->
                          <span v-if="data[indextr].type_activite == 'caisse'">
                            <vx-tooltip
                              :text="$t('generique')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-tool-box"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>
                          <!-- Generique -->
                          <span
                            v-if="data[indextr].type_activite == 'Generique'"
                          >
                            <vx-tooltip
                              :text="$t('generique')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-tool-box"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>
                          <!-- Tontine -->
                          <span v-if="data[indextr].type_activite == 'Tontine'">
                            <vx-tooltip
                              :text="$t('tontine')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-money-bags"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>
                          <!-- Evenement -->
                          <span
                            v-if="data[indextr].type_activite == 'Evenement'"
                          >
                            <vx-tooltip
                              :text="$t('events')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-calendar-check-1"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>
                          <!-- Mutuelle -->
                          <span
                            v-if="data[indextr].type_activite == 'Mutuelle'"
                          >
                            <vx-tooltip
                              :text="$t('EpargneCredit')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-saving-piggy-coins"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>
                          <!-- Projet -->
                          <span v-if="data[indextr].type_activite == 'Projet'">
                            <vx-tooltip
                              :text="t('project')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-team-idea"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>
                          <!-- Solidarité -->
                          <span
                            v-if="data[indextr].type_activite == 'Solidarite'"
                          >
                            <vx-tooltip
                              :text="$t('solidarity')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-multiple-actions-heart"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>

                          <!-- Main levee -->
                          <span
                            v-if="data[indextr].type_activite == 'Main_levee'"
                          >
                            <vx-tooltip
                              :text="$t('handSUp')"
                              position="bottom"
                              class="inline-block"
                            >
                              <vs-icon
                                icon-pack="streameline"
                                icon="icon-cash-payment-bills-1"
                              ></vs-icon>
                            </vx-tooltip>
                          </span>
                        </p>
                      </vs-td>
                      <vs-td :data="data[indextr].nom_activite">
                        <p class="product-name">
                          {{ data[indextr].nom_activite }}
                        </p>
                      </vs-td>
                      <vs-td :data="data[indextr].solde" class="text-right">
                        <span
                          :class="{
                            redtextclass:
                              data[indextr].statistique.data.solde < 0,
                          }"
                        >
                          {{
                            data[indextr].statistique.data.solde
                              | formatMoney(devise)
                          }}
                        </span>
                      </vs-td>
                      <vs-td :data="data[indextr].dettes" class="text-right">
                        <span
                          :class="{
                            redtextclass:
                              data[indextr].statistique.data.dettes < 0,
                          }"
                        >
                          {{
                            data[indextr].statistique.data.dettes
                              | formatMoney(devise)
                          }}
                        </span>
                      </vs-td>
                      <vs-td :data="data[indextr].avoirs" class="text-right">
                        <span
                          :class="{
                            redtextclass:
                              data[indextr].statistique.data.avoirs < 0,
                          }"
                        >
                          {{
                            data[indextr].statistique.data.avoirs
                              | formatMoney(devise)
                          }}
                        </span>
                      </vs-td>
                      <vs-td :data="data[indextr].interet" class="text-right">
                        <span
                          :class="{ redtextclass: data[indextr].interet < 0 }"
                        >
                          {{ data[indextr].interet | formatMoney(devise) }}
                        </span>
                      </vs-td>
                      <vs-td
                        :data="data[indextr].encaissement"
                        class="text-right"
                      >
                        <span
                          :class="{
                            redtextclass:
                              data[indextr].statistique.data.encaissement < 0,
                          }"
                        >
                          {{
                            data[indextr].statistique.data.encaissement
                              | formatMoney(devise)
                          }}
                        </span>
                      </vs-td>
                      <vs-td
                        :data="data[indextr].decaissement"
                        class="text-right"
                      >
                        <span
                          :class="{
                            redtextclass:
                              data[indextr].statistique.data.decaissement < 0,
                          }"
                        >
                          {{
                            data[indextr].statistique.data.decaissement
                              | formatMoney(devise)
                          }}
                        </span>
                      </vs-td>

                      <!-- <vs-td>
                        <vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block ">
                          <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                           @click="redirectDetail(tr)"/>
                        </vx-tooltip>
                      </vs-td> -->
                    </vs-tr>
                  </template>
                </vs-table>
              </div>
            </vx-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Functions
import exports from "@/services/exports";
import { EventBus } from "@/services/EventBus.js";

import { mapGetters } from "vuex";
import checkRole from "../../../mixins/checkRole";

export default {
  props: ["selectactivitie"],
  mixins: [checkRole],
  data() {
    return {
      member: {},
      members: [],
      active: false,
      addNewDataSidebar: false,
      sidebarData: {},
      etat: "",
      generic_selectionne: "",
      generic: {},
      popupActivo2: false,
      activite_selectionne: "",
      itemsPerPage: 10,
      isMounted: false,
      devise: "",
      membre: null,

      /* Loading */
      backgroundLoading: "danger",
      colorLoading: "#fff",
      loader: true,
    };
  },
  computed: {
    admin() {
      return this.isSuperAdministrator;
    },
    ...mapGetters({
      activeUser: "authentificated/getAuth",
      currentAssociation: "association/getCurrentAssociation",
    }),
    memberName() {
      if (this.membre != null)
        return this.membre.firstName.replace(
          /^.{1}/g,
          this.membre.firstName[0].toUpperCase()
        );
      else return "";
    },
    activitesData() {
      return this.$store.state.association.activites_all;
    },
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx;
      }
      return 0;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.activitesData.length;
    },

    comptesData() {
      if (this.$store.state.association.user_accounts != null)
        return this.$store.state.association.user_accounts.map((account) => ({
          ...account,
          solde: account.statistique.data.solde,
          dettes:
            account.statistique.data.dettes_acquitements +
            account.statistique.data.dettes_cotisations,
          avoirs: account.statistique.data.avoirs,
          interet: account.statistique.data.interet,
          encaissement: account.statistique.data.encaissement,
          decaissement: account.statistique.data.decaissement,
        }));
      return [];
    },
  },
  methods: {
    /*
     *@param members
     *@return id  //retourne l'id membre de l'utilisateur connecté
     */
    extractMember(members) {
      var user = this.activeUser;
      var id;

      members.forEach((member) => {
        member.users.forEach((author) => {
          if (user.id == author.id) {
            id = member;
          }
        });
      });
      return id;
    },
    deleteItem(id) {
      this.openLoadingContained();
      var association_courante = this.currentAssociation;

      let payload = {
        resourceUrl:
          "/api/association/" + association_courante.id + "/activite/" + id,
        commitAction: "REMOVE_ACTIVITE",
        memberId: id,
      };

      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          this.popupActivo2 = false;
          this.$vs.notify({
            position: "top-center",
            text: this.$t("activityDeleteSuccessfully"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          let payload = {
            resourceUrl:
              "api/association/" + association_courante.id + "/activite/all",
            commitAction: "SET_ALL_ACTIVITIES",
          };

          this.$store
            .dispatch("association/fetchAssociationactivite", payload)
            .catch((error) => {
              window.console.log.error(error);
            });
        })
        .catch((err) => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          window.console.error(err);
        });
    },

    /* Loading */
    openLoadingContained() {
      this.loader = false;
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: "#button-with-loading",
        scale: 0.45,
      });
    },

    //Redirige sur la page d'accueil de l'activité côté admin
    redirectDetails(tr) {
      let association_courante = this.currentAssociation;
      let payload = {
        resourceUrl:
          "api/association/" + association_courante.id + "/activite/" + tr.id,
        commitAction: "SET_ACTIVITE",
      };

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then((res) => {
          let activite = res.data.data;

          let route,
            activity_type = activite.type;

          switch (activity_type) {
            case "Generique":
              route = this.admin
                ? "/association/administration/activities/generic/details"
                : "/association/my-activities/generic/details";
              break;
            case "caisse":
              route = this.admin
                ? "/association/administration/activities/generic/details"
                : "/association/my-activities/generic/details";
              break;

            case "Tontine":
              route = this.admin
                ? "/association/administration/activities/tontine/details"
                : "/association/my-activities/tontine/details";
              break;

            case "Evenement":
              route = this.admin
                ? "/association/administration/activities/event/details"
                : "/association/my-activities/event/details";
              break;

            case "Mutuelle":
              route = this.admin
                ? "/association/administration/activities/mutual/details"
                : "/association/my-activities/mutual/details";
              break;

            case "Solidarite":
              route = this.admin
                ? "/association/administration/activities/solidarity/details"
                : "/association/my-activities/solidarity/details";
              break;

            default:
              break;
          }

          localStorage.setItem("activity_id", JSON.stringify(tr.id));

          this.$router.push(route).catch(() => {});
        })
        .catch((error) => {
          window.console.log.error(error);
        });
    },

    //Redirige vers la pages d'accueil côté membre
    redirectDetail(tr) {
      let association_courante = this.currentAssociation;
      let payload = {
        resourceUrl:
          "api/association/" +
          association_courante.id +
          "/activite/" +
          tr.activites_id,
        commitAction: "SET_ACTIVITE",
      };

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then((res) => {
          let activite = res.data.data;

          let route,
            activity_type = activite.type;

          switch (activity_type) {
            case "Generique":
              route = "/association/my-activities/generic/details";
              break;
            case "caisse":
              route = "/association/my-activities/generic/details";
              break;

            case "Tontine":
              route = "/association/my-activities/tontine/details";
              break;

            case "Evenement":
              route = "/association/my-activities/event/details";
              break;

            case "Mutuelle":
              route = "/association/my-activities/mutual/details";
              break;

            case "Solidarite":
              route = "/association/my-activities/solidarity/details";
              break;

            default:
              break;
          }
          localStorage.setItem("activity_id", JSON.stringify(tr.activites_id));

          this.$router.push(route).catch(() => {});
        })
        .catch((error) => {
          window.console.log.error(error);
        });
    },

    // Export activities data to PDF format
    activitiesExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t(
        "listOfAllActivities"
      )}`;
      const types = {
        caisse: "generique",
        Generique: "generique",
        Tontine: "tontine",
        Evenement: "events",
        Mutuelle: "EpargneCredit",
        Projet: "project",
        Solidarite: "solidarity",
        Main_levee: "handSUp",
      };

      if (["pdf", "csv", "excel"].includes(type)) {
        exports[`${type}Export`](
          {
            title: title,
            documentHeader: {
              image: this.currentAssociation.logo,
              name: this.currentAssociation.nom,
              date: this.$options.filters.dateTime(new Date().getTime() / 1000),
            },
            headers: [
              this.$t("Type"),
              this.$t("name"),
              this.$t("balance"),
              this.$t("debt"),
              this.$t("assets"),
              this.$t("interests"),
              this.$t("expectedPayment"),
              this.$t("expectedDisbursement"),
            ],
            body: this.comptesData.map((account) => [
              this.$t(types[account.type_activite]),
              account.nom_activite,
              this.$options.filters.formatMoney(account.statistique.data.solde, this.currentAssociation.devise),
              this.$options.filters.formatMoney(account.statistique.data.dettes_acquitements +
                account.statistique.data.dettes_cotisations, this.currentAssociation.devise),
              this.$options.filters.formatMoney(account.statistique.data.avoirs, this.currentAssociation.devise),
              this.$options.filters.formatMoney(account.statistique.data.interet, this.currentAssociation.devise),
              this.$options.filters.formatMoney(account.statistique.data.encaissement, this.currentAssociation.devise),
              this.$options.filters.formatMoney(account.statistique.data.decaissement, this.currentAssociation.devise),
            ]),
          },
          title
        );
      }
    },
  },
  created() {
    EventBus.$emit("loader", true);
    //  if(! moduleActivite.isRegistered) {
    //     this.$store.registerModule('activite',  moduleActivite)
    //     moduleActivite.isRegistered = true
    //   }

    //   if(!moduleUserManagement.isRegistered) {
    //     this.$store.registerModule('userManagement', moduleUserManagement)
    //     moduleUserManagement.isRegistered = true
    //   }

    //   if(!moduleMember.isRegistered) {
    //       this.$store.registerModule('member', moduleMember)
    //       moduleMember.isRegistered = true
    //   }

    var current_association =
      this.$store.getters["association/getCurrentAssociation"];

    let payload = {
      resourceUrl:
        "api/association/" + current_association.id + "/activite/all",
      commitAction: "SET_ALL_ACTIVITIES",
    };

    this.$store
      .dispatch("association/fetchAssociationactivite", payload)
      .then(() => {
        let payload = {
          resourceUrl: "/api/association/" + current_association.id + "/membre",
          commitAction: "SET_MEMBERS",
        };

        this.$store
          .dispatch("association/fetchMembers", payload)
          .then((res) => {
            this.membre = this.extractMember(res.data.data);
            let payload = {
              resourceUrl: "/api/member/" + this.membre.id + "/comptes",
              commitAction: "SET_USER_ACCOUNTS",
            };

            this.$store
              .dispatch("association/fetchMemberActivities", payload)
              .then(() => {
                EventBus.$emit("loader", false);
              })
              .catch((error) => {
                EventBus.$emit("loader", false);
                window.console.error(error);
              });
          })
          .catch((error) => {
            window.console.error(error);
          });
      })
      .catch((error) => {
        window.console.error(error);
      });

    //Devise de l'association
    this.devise = current_association.devise;
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>
<style lang="css">
.customer-align .vs-table-text {
  text-align: right;
  display: block;
}
</style>


