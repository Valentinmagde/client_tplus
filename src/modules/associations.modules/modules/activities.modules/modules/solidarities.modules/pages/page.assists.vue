<template>
  <div id="data-list-list-view" class="data-list-container">
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
          >{{ $t("cancel") }}</vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3"
          color="danger"
          @click.stop="deleteItem(assistance_selectionne)"
          >{{ $t("delete") }}</vs-button
        >
      </div>
    </vs-popup>

    <Data-view-sidebar
      v-if="isReady"
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
      :activity="activity"
    />

    <action-button v-if="admin" :activity="activity" />
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <div
          v-if="activitesData.length == 0"
          class="flex flex-wrap-reverse items-center data-list-btn-container"
        >
          <!-- ADD NEW -->
          <div
            v-if="admin"
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
            @click.stop="addNewData('AjoutAssistance')"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">{{
              $t("newAssistance")
            }}</span>
          </div>
        </div>

        <vx-card v-if="activitesData.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>
      <!-- Tableau des activites -->
      <vs-table
        v-show="activitesData.length > 0"
        ref="assistsTable"
        :data="activitesData"
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
                  w-32
                "
              >
                <span class="mr-2">{{ $t("exports") }}</span>
                <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
              </div>

              <vs-dropdown-menu style="width: 10rem">
                <vs-dropdown-item>
                  <span
                    class="flex items-center"
                    @click.stop="assistsExport('pdf')"
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
                    @click.stop="assistsExport('csv')"
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
                    @click.stop="assistsExport('excel')"
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
              v-if="admin"
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
              @click.stop="addNewData('AjoutAssistance')"
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{
                $t("newAssistance")
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
          <vs-th sort-key="membre">{{ $t("name") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="montant_alloue"
            ><span class="text-right w-full">{{
              $t("Amount") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th sort-key="date_evenement"
            ><span class="text-right w-full">{{
              $t("eventDate") | CAPITALIZE
            }}</span>
          </vs-th>
          <vs-th sort-key="etat"
            ><span class="text-right w-full"
              >{{ $t("state") | CAPITALIZE }}
            </span></vs-th
          >
          <vs-th
            ><span class="text-right w-full"
              >{{ $t("actions") | CAPITALIZE }}
            </span></vs-th
          >
        </template>

        <template slot-scope="{ data }">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td :data="data[indextr].membre">
              <p class="product-name font-medium truncate">
                {{ data[indextr].membre }}
              </p>
            </vs-td>

            <vs-td :data="data[indextr].montant_alloue" class="product-name text-right"
                :class="{ redtextclass: data[indextr].montant_alloue < 0 }">

                {{ data[indextr].montant_alloue | formatMoney(devise) }}
            </vs-td>

            <vs-td class="product-name text-right" :data="data[indextr].date_evenement">
                {{ data[indextr].date_evenement | dateTime }}
            </vs-td>
            <vs-td class="flex flex-row justify-end" :data="data[indextr].etat">
              <p v-if="data[indextr].etat == 'init'" class="product-price">
                <vs-chip>{{ $t("creation") }}</vs-chip>
              </p>
              <p v-if="data[indextr].etat == 'actif'" class="product-price">
                <vs-chip color="success">{{ $t("activate") }}</vs-chip>
              </p>
              <p v-if="data[indextr].etat == 'inactif'" class="product-price">
                <vs-chip color="danger">{{ $t("desactivate") }}</vs-chip>
              </p>
            </vs-td>
            <vs-td class="text-right">
              <!-- <vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block ">
                <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"  @click="redirectDetails(data[indextr])"/>
              </vx-tooltip> -->
              <vx-tooltip
                v-if="admin"
                :text="$t('delete')"
                position="bottom"
                class="inline-block ml-2"
              >
                <feather-icon
                  icon="TrashIcon"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  @click.stop="
                    popupActivo2 = true;
                    assistance_selectionne = data[indextr].id;
                  "
                />
              </vx-tooltip>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>

<script>
import DataViewSidebar from "../../../../../components/sidebar/DataViewSidebar.component";
import ActionButton from "../components/ActionButton.component";
import { EventBus } from "@/services/EventBus";

//Fonctions
import exports from "@/services/exports";
import checkIfAdmin from "../../../../../mixins/checkRole";
import checkActivityType from "../../../mixins/checkActivityType";

// Vuex store
import { mapGetters } from "vuex";

export default {
  mixins: [checkIfAdmin, checkActivityType],
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
      assistance_selectionne: "",
      itemsPerPage: 10,
      isMounted: false,
      devise: "",

      isReady: false,
    };
  },
  components: {
    ActionButton,
    DataViewSidebar,
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),
    admin() {
      return this.isSuperAdministrator;
    },
    activity() {
      return this.$store.state.association.activite;
    },
    activitesData() {
      return this.$store.state.association.assistances;
    },
    currentPage() {
      if (this.isMounted) {
        return this.$refs["assistsTable"].currentx;
      }
      return 0;
    },
    queriedItems() {
      return this.$refs["assistsTable"]
        ? this.$refs["assistsTable"].queriedResults.length
        : this.activitesData.length;
    },
  },
  methods: {
    addNewData(etat) {
      this.etat = etat;
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },

    deleteItem(id) {
      let payload = {
        resourceUrl: "/api/assistance/" + id + "/delete",
        commitAction: "NO_COMMIT",
        memberId: id,
      };

      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
          this.popupActivo2 = false;
          this.$vs.notify({
            position: "top-center",

            text: this.$t("assistanceSuccessfullyRemoved"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });

          let activite_courante = this.$store.state.association.activite;
          let payload = {
            resourceUrl:
              "api/activite/" + activite_courante.id + "/assistances",
            commitAction: "SET_ASSISTANCES",
          };
          this.$store
            .dispatch("association/fetchAssociationactivite", payload)
            .then(() => {
              let association_courante =
                this.$store.state.association.currentAssociation;
              let payload = {
                resourceUrl:
                  "api/association/" + association_courante.id + "/activite",
                commitAction: "SET_ACTIVITES",
              };

              this.$store
                .dispatch("association/fetchAssociationactivite", payload)
                .catch((error) => {
                  window.console.error(error);
                });
            })
            .catch((err) => {
              window.console.error(err);
            });
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
    assistsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t("assistance")}`;

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
              this.$t("name"),
              this.$t("Amount"),
              this.$t("eventDate"),
              this.$t("etat"),
            ],
            body: this.$refs["assistsTable"].queriedResults.map(
              (settlement) => [
                settlement.membre,
                this.$options.filters.formatMoney(
                  settlement.montant_alloue,
                  this.currentAssociation.devise
                ),
                this.$d(settlement.date_evenement * 1000),
                settlement.etat,
              ]
            ),
          },
          title
        );
      }
    },
  },
  created() {
    EventBus.$emit("loader", true);
    let current_association = this.$store.state.association.currentAssociation;
    this.devise = current_association.devise;
    let activity_id = localStorage.getItem("activity_id");

    let payload = {
      resourceUrl:
        "api/association/" +
        current_association.id +
        "/activite/" +
        activity_id,
      commitAction: "SET_ACTIVITE",
    };
    this.$store
      .dispatch("association/fetchAssociationactivite", payload)
      .then((res) => {
        this.checkActivityType(res.data.data);
        let payload = {
          resourceUrl: "api/activite/" + res.data.data.id + "/assistances",
          commitAction: "SET_ASSISTANCES",
        };
        this.$store
          .dispatch("association/fetchAssociationactivite", payload)
          .then(() => {
            this.isReady = true;
            EventBus.$emit("loader", false);
          })
          .catch((error) => {
            window.console.error(error), (this.isReady = true);
          });
      })
      .catch((error) => {
        window.console.error(error), (this.isReady = true);
      });
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>


