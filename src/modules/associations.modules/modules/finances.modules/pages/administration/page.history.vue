<template>
  <div id="data-list-list-view" class="data-list-container">
    <!-- ACTION - DROPDOWN -->
    <action-button v-if="admin" />

    <!-- Popup pour supprimer une operation -->
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
          @click.stop="deleteItem(membre_selectionne, operation_selectionne)"
        >
          {{ $t("delete") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour annuler une operation -->
    <vs-popup
      classContent="popup-example"
      :title="$t('cancelConfirmation')"
      :active.sync="popupActivo3"
    >
      <p>{{ $t("cancelConfirmationSubtitle") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="warning" @click="popupActivo2 = false" type="border">
          {{ $t("close") }} </vs-button
        >&nbsp;&nbsp;

        <vs-button
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading"
          :disabled="!loader"
          @click.stop="cancelItem(membre_selectionne, operation_selectionne)"
        >
          {{ $t("cancel") }}
        </vs-button>
      </div>
    </vs-popup>

    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
    />
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <vx-card class="mb-6">
          <h5>{{ $t("paymentWithdrawalHistory") }}</h5>
          <p class="mt-2 text-muted">
            {{ $t("paymentWithdrawalHistorySubtitle") }}.
          </p>
        </vx-card>
        <vx-card v-if="operationsData.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>
      <vs-table
        v-show="operationsData.length > 0"
        ref="table"
        pagination
        :max-items="itemsPerPage"
        search
        :data="operationsData"
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
                    @click.stop="exportPDF(operationsData)"
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
                    @click.stop="csvExport(operationsData)"
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
                    @click.stop="exportExel(operationsData)"
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
                  operationsData.length - currentPage * itemsPerPage > 0
                    ? currentPage * itemsPerPage
                    : operationsData.length
                }}
                of {{ queriedItems }}</span
              >
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
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
          <vs-th sort-key="membre">{{ $t("accounts") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="type">{{ $t("Type") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="mode">{{ $t("paymentMethod") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="date_versement"
            ><span class="w-full text-right">{{
              $t("paymentDate") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th sort-key="montant"
            ><span class="w-full text-right">{{
              $t("Amount") | CAPITALIZE
            }}</span></vs-th
          >
          <!-- <vs-th sort-key="creation_date">{{$t('creationDate') | CAPITALIZE }}</vs-th> -->
          <vs-th sort-key="method"
            ><span class="w-full text-right">{{
              $t("state") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th
            ><span class="w-full text-right">{{
              $t("actions") | CAPITALIZE
            }}</span></vs-th
          >
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr
              :data="operation"
              :key="ind"
              v-for="(operation, ind) in data"
            >
              <vs-td>
                <p class="product-name font-medium truncate">
                  {{ operation.membre }}
                </p>
              </vs-td>

              <vs-td>
                <p
                  v-if="operation.debit_credit == 'credit'"
                  class="product-price"
                >
                  {{ $t("payment") }}
                </p>
                <p
                  v-if="operation.debit_credit == 'debit'"
                  class="product-price"
                >
                  {{ $t("withdrawal") }}
                </p>
              </vs-td>

              <vs-td class="product-price">
                {{ operation.mode }}
              </vs-td>

              <vs-td class="product-name text-right">
                {{ operation.date_versement | dateTime }}
              </vs-td>
              <vs-td
                class="product-name text-right"
                :class="{ redtextclass: operation.montant < 0 }"
              >
                {{ operation.montant | formatMoney(devise) }}
              </vs-td>

              <vs-td class="flex flex-row justify-end">
                <p v-if="operation.etat == 'EN_ATTENTE'" class="product-price">
                  <vs-chip color="warning">{{ $t("waiting") }}</vs-chip>
                </p>
                <p v-if="operation.etat == 'VALIDE'" class="product-price">
                  <vs-chip color="success">{{ $t("validated") }}</vs-chip>
                </p>
                <p v-if="operation.etat == 'REJETE'" class="product-price">
                  <vs-chip color="danger">{{ $t("rejected") }}</vs-chip>
                </p>
              </vs-td>

              <vs-td class="whitespace-no-wrap text-right">
                <!-- APERCUE DE L'OPERATION -->
                <vx-tooltip
                  :text="$t('detail')"
                  position="bottom"
                  class="inline-block mr-2 cursor-pointer"
                >
                  <feather-icon
                    icon="EyeIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="sendData('DetailOperation', operation)"
                  />
                </vx-tooltip>
                <!-- SUPPRIMER UNE OPERATION -->
                <vx-tooltip
                  :text="$t('delete')"
                  position="bottom"
                  class="inline-block mr-2 cursor-pointer"
                >
                  <feather-icon
                    icon="TrashIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    @click.stop="
                      popupActivo2 = true;
                      operation_selectionne = operation.id;
                      membre_selectionne = operation.membre_id;
                    "
                  />
                </vx-tooltip>

                <!-- ANNULER UNE OPERATION -->
                <vx-tooltip
                  :text="$t('cancel')"
                  position="bottom"
                  class="inline-block cursor-pointer"
                >
                  <feather-icon
                    icon="XCircleIcon"
                    svgClasses="w-5 h-5 hover:text-danger stroke-current"
                    @click.stop="
                      popupActivo3 = true;
                      operation_selectionne = operation.id;
                      membre_selectionne = operation.membre_id;
                    "
                  />
                </vx-tooltip>
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import DataViewSidebar from "../../../../components/sidebar/DataViewSidebar.component";
//Composants
import ActionButton from "../../components/administration/ActionButton.component";

//Fonctions
import { payment_mod } from "../../services/data/paymentMod.js";
import functions from "../../services/admin.functions.js";
import { EventBus } from "@/services/EventBus.js";

import checkIfAdmin from "../../../../mixins/checkRole";

//Store
// import moduleFinance from "@/store/finance/moduleFinance.js"

export default {
  mixins: [checkIfAdmin],

  data() {
    return {
      itemsPerPage: 10,
      isMounted: false,
      popupActivo2: false,
      popupActivo3: false,
      operation_selectionne: "",
      membre_selectionne: "",
      devise: "",

      // Data Sidebar
      etat: "",
      addNewDataSidebar: false,
      sidebarData: {},

      /* Loading */
      backgroundLoading: "danger",
      colorLoading: "#fff",
      loader: true,
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
      return this.hasRole("Contrôleur Financier");
    },
    operationsData() {
      let data = this.$store.state.association.operations;
      let transactions = [];
      if (data.length > 0) {
        data.forEach((element) => {
          if (element.operations.length > 0) {
            element.operations.forEach((operation) => {
              if (operation.etat == "VALIDE") {
                transactions.push({
                  id: operation.id,
                  membre: element.membre,
                  membre_id: operation.membre_id,
                  date_versement: operation.date_realisation,
                  debit_credit: operation.debit_credit,
                  etat: operation.etat,
                  montant: operation.montant,
                  num_recu: operation.num_recu,
                  /* date_creation: operation.transactions[0].date_created, */
                  mode: payment_mod.reduce(
                    (a, o) =>
                      o.value == operation.mode ? a.concat(this.$t(o.i18n)) : a,
                    ""
                  ),
                  preuve: operation.preuve,
                  commentaire: operation.commentaire,
                  transactions: operation.transactions,
                });
              }
            });
          }
        });
      }
      return transactions.sort((a, b) =>
        a.date_versement < b.date_versement ? 1 : -1
      );
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
        : this.operationsData.length;
    },
  },
  methods: {
    //Voir le destail d'une operation
    sendData(etat, data) {
      this.etat = etat;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    //Supprimer une transaction
    deleteItem(member_id, operation_id) {
      this.openLoadingContained();
      var association_courante =
        this.$store.state.association.currentAssociation;

      let payload = {
        resourceUrl: "/api/membre/" + member_id + "/operation/" + operation_id,
        commitAction: "REMOVE_OPERATION",
      };
      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          (this.popupActivo2 = false),
            this.$vs.notify({
              position: "top-center",
              text: this.$t("operationDelete"),
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "success",
            });

          let payload = {
            resourceUrl:
              "/api/association/" + association_courante.id + "/operations",
            commitAction: "SET_OPERATIONS",
          };

          this.$store
            .dispatch("association/fetchFinances", payload)
            .catch((error) => {
              window.console.error(error);
            });
        })
        .catch((error) => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          this.$vs.notify({
            position: "top-center",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    //Annuler une opération
    cancelItem(member_id, operation_id) {
      this.openLoadingContained();
      var association_courante =
        this.$store.state.association.currentAssociation;

      let payload = {
        resourceUrl:
          "/api/membre/" +
          member_id +
          "/operation/" +
          operation_id +
          "/transaction/unvalidate",
        commitAction: "SET_OPERATION",
      };
      this.$store
        .dispatch("association/fetchFinances", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          (this.popupActivo3 = false),
            this.$vs.notify({
              position: "top-center",
              text: this.$t("operationDelete"),
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "success",
            });

          let payload = {
            resourceUrl:
              "/api/association/" + association_courante.id + "/operations",
            commitAction: "SET_OPERATIONS",
          };

          this.$store
            .dispatch("association/fetchFinances", payload)
            .catch((error) => {
              window.console.error(error);
            });
        })
        .catch((error) => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          this.$vs.notify({
            position: "top-center",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    //exporation du tableau en csv
    csvExport(arrData) {
      let curr_ass = this.currentAssociation;

      functions.csvExportHistoric(arrData, curr_ass);
    },

    exportPDF(arrData) {
      let current_ass = this.currentAssociation;

      functions.exportPDFHistoric(arrData, current_ass);
    },

    //exporation du tableau en csv
    exportExel(arrData) {
      let curr_ass = this.currentAssociation;

      functions.exportExelHistoric(arrData, curr_ass);
    },
    //Data Side bar
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
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
  },
  created() {
    EventBus.$emit("loader", true);
    var current_association = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl: "/api/association/" + current_association.id + "/operations",
      commitAction: "SET_OPERATIONS",
    };

    this.$store
      .dispatch("association/fetchFinances", payload)
      .then(() => {
        EventBus.$emit("loader", false);
      })
      .catch((error) => {
        EventBus.$emit("loader", false);
        window.console.log(error);
      });
    this.devise = current_association.devise;
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>
