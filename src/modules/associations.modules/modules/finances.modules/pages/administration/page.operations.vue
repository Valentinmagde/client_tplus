<template>
  <div id="data-list-list-view" class="data-list-container">
    <!-- ACTION - DROPDOWN -->
    <action-button v-if="admin" />
    <!-- IMAGE WINDOW MODAL -->
    <div id="myModal" class="modal">
      <span class="close">&times;</span>
      <img class="modal-content" id="img01" />
      <div id="caption"></div>
    </div>
    <!-- Popup pour rejeter une operation -->
    <vs-popup
      classContent="popup-example"
      :title="$t('rejectionConfirmation')"
      :active.sync="popupActivo2"
    >
      <p>{{ $t("rejectionConfirmationSubtitle") }}</p>
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
          @click.stop="reject(operation_selectionne)"
          >{{ $t("reject") }}</vs-button
        >
      </div>
    </vs-popup>

    <!-- Popup pour supprimer une operation -->
    <vs-popup
      classContent="popup-example"
      :title="$t('deleteConfirmTitle')"
      :active.sync="popupActivo3"
    >
      <p>{{ $t("deleteConfirm") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button
          color="warning"
          @click="popupActivo3 = false"
          type="border"
          >{{ $t("cancel") }}</vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3"
          color="danger"
          @click.stop="deleteItem(membre_selectionne, operation_selectionne)"
          >{{ $t("delete") }}</vs-button
        >
      </div>
    </vs-popup>

    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <vx-card class="mb-base">
          <h5>{{ $t("paymentsPendingValidation") }}</h5>
          <p class="mt-2 text-muted">{{ $t("listOfPayment") }}.</p>
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
                  .push('/association/administration/finances/payment')
                  .catch(() => {})
              "
            >
              <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
              <span class="ml-2 text-base text-primary">{{
                $t("AddNew")
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
          <vs-th sort-key="mode">{{ $t("paymentMethod") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="date_creation"
            ><span class="text-right w-full">{{
              $t("creationDate") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th sort-key="date_versement"
            ><span class="text-right w-full">{{
              $t("paymentDate") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th sort-key="montant"
            ><span class="text-right w-full">{{
              $t("Amount") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th sort-key="state"
            ><span class="text-right w-full">{{
              $t("state") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th
            ><span class="text-right w-full">{{
              $t("actions") | CAPITALIZE
            }}</span></vs-th
          >
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :key="ind" v-for="(operation, ind) in data">
              <vs-td>
                <p class="product-name font-medium truncate">
                  {{ operation.membre }}
                </p>
              </vs-td>
              <vs-td class="product-price">
                {{ operation.mode }}
              </vs-td>
              <vs-td class="text-right product-price">
                {{ operation.date_creation | dateTime }}
              </vs-td>
              <vs-td class="text-right product-price">
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
                <!-- VALIDER UNE OPERATION -->
                <vx-tooltip
                  :text="$t('Validate')"
                  position="bottom"
                  class="inline-block mr-2 cursor-pointer"
                >
                  <feather-icon
                    icon="CheckSquareIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click="redirectValidate(operation)"
                  />
                </vx-tooltip>

                <!-- SUPPRIMER UNE OPERATION -->
                <vx-tooltip
                  :text="$t('delete')"
                  position="bottom"
                  class="inline-block cursor-pointer"
                >
                  <feather-icon
                    icon="TrashIcon"
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

//Composants
import ActionButton from "../../components/administration/ActionButton.component";

//Fonctions
import { payment_mod } from "../../services/data/paymentMod.js";
import functions from "../../services/admin.functions";
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
    };
  },
  components: {
    ActionButton,
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),
    admin() {
      return this.hasRole("Financier") || this.hasRole("Contrôleur Financier");
    },
    operationsData() {
      var data = [];
      data = this.$store.state.association.operations;
      let transactions = [];
      if (data.length > 0) {
        data.forEach((element) => {
          if (element.operations.length > 0) {
            element.operations.forEach((operation) => {
              if (
                operation.etat == "EN_ATTENTE" &&
                operation.debit_credit == "credit"
              ) {
                if (operation.transactions.length > 0) {
                  transactions.push({
                    id: operation.id,
                    membre: element.membre,
                    membre_id: operation.membre_id,
                    date_versement: operation.date_realisation,
                    montant: operation.montant,
                    num_recu: operation.num_recu,
                    etat: operation.etat,
                    date_creation: operation.transactions[0].date_created,
                    mode: payment_mod.reduce(
                      (a, o) =>
                        o.value == operation.mode
                          ? a.concat(this.$t(o.i18n))
                          : a,
                      ""
                    ),
                    mod: operation.mode,
                    preuve: operation.preuve,
                    commentaire: operation.commentaire,
                    transactions: operation.transactions,
                  });
                }
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
    //Rediriger vers la page de validation
    redirectValidate(operation) {
      localStorage.setItem("operation_id", JSON.stringify(operation.id));
      this.$store.commit("association/SET_OPERATION", operation);

      localStorage.setItem("member_id", JSON.stringify(operation.membre_id));

      this.$router.push(
        "/association/administration/finances/validate-operation"
      );
    },
    //Rejeter une operation
    reject(operation) {
      let payload = {
        resourceUrl:
          "/api/membre/" +
          operation.membre_id +
          "/operation/" +
          operation.id +
          "/transaction/rejeter",
        commitAction: "SET_REJECTED_OPERATIONS",
      };
      this.$store
        .dispatch("association/fetchFinances", payload)
        .then(() => {
          (this.popupActivo2 = false),
            this.$vs.notify({
              position: "top-center",
              text: this.$t("operationSuccessfullyRejected"),
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "success",
            });
          //Lister toutes les operations de l'association
          var current_association =
            this.$store.state.association.currentAssociation;
          let payload = {
            resourceUrl:
              "/api/association/" + current_association.id + "/operations",
            commitAction: "SET_OPERATIONS",
          };
          this.$store.dispatch("association/fetchFinances", payload);
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
    //Supprimer une transaction
    deleteItem(member_id, operation_id) {
      var association_courante =
        this.$store.state.association.currentAssociation;

      let payload = {
        resourceUrl: "/api/membre/" + member_id + "/operation/" + operation_id,
        commitAction: "REMOVE_OPERATION",
      };
      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
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

      functions.csvExport(arrData, curr_ass);
    },

    exportPDF(arrData) {
      let current_ass = this.currentAssociation;

      functions.exportPDF(arrData, current_ass);
    },

    //exporation du tableau en csv
    exportExel(arrData) {
      let cur_ass = this.currentAssociation;

      functions.exportExel(arrData, cur_ass);
    },
    showPreview(src) {
      // Get the modal
      var modal = document.getElementById("myModal");

      // Get the image and insert it inside the modal - use its "alt" text as a caption
      var modalImg = document.getElementById("img01");

      modal.style.display = "flex";
      modalImg.src = src;

      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      span.onclick = function () {
        modal.style.display = "none";
      };
    },
  },
  created() {
    EventBus.$emit("loader", true);
    var current_association = this.$store.state.association.currentAssociation;

    // if(!moduleFinance.isRegistered) {
    //     this.$store.registerModule('finance', moduleFinance)
    //     moduleFinance.isRegistered = true
    // }

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
