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
    <action-button v-if="admin && isReady" :activity="activity" />
    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
    />

    <!-- Tableau des activités d'un membre -->
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <!-- <div class="ml-5 mb-base pr-5">
          <vx-card>
              <h4  class="mb-2"> {{ $t('listOfAccounts') | CAPITALIZE }} </h4>
          </vx-card>
        </div> -->
        <vx-card v-if="transactions.length == 0 && gotTransactions">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>
      <vs-table
        v-show="transactions.length > 0 && gotTransactions"
        ref="transactionsTable"
        pagination
        :max-items="itemsPerPage"
        search
        :data="transactions"
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
                    @click.stop="transactionsExport('pdf')"
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
                    @click.stop="transactionsExport('csv')"
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
                    @click.stop="transactionsExport('excel')"
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
                  transactions.length - currentPage * itemsPerPage > 0
                    ? currentPage * itemsPerPage
                    : transactions.length
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
          <vs-th sort-key="members">{{ $t("members") | CAPITALIZE }}</vs-th>
          <vs-th sort-key="debit_credit">{{
            $t("debitCredit") | CAPITALIZE
          }}</vs-th>
          <vs-th sort-key="date"
            ><span class="text-right w-full">{{
              $t("creationDate") | CAPITALIZE
            }}</span></vs-th
          >
          <vs-th sort-key="amount"
            ><span class="text-right w-full">{{
              $t("Amount") | CAPITALIZE
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
            <vs-tr :key="ind" v-for="(transaction, ind) in data">
              <vs-td>
                <p class="product-name font-medium truncate">
                  {{ transaction.membre }}
                </p>
              </vs-td>

              <vs-td>
                <p class="product-name">
                  <feather-icon
                    v-if="transaction.debit_credit == 'debit'"
                    icon="ArrowRightCircleIcon"
                    svgClasses="w-5 h-5 text-danger stroke-current"
                  />
                  <feather-icon
                    v-if="transaction.debit_credit == 'credit'"
                    icon="ArrowRightCircleIcon"
                    svgClasses="w-5 h-5 text-success stroke-current"
                  />
                </p>
              </vs-td>

              <vs-td class="text-right">
                <span class="product-name truncate">
                  {{ transaction.date_created | dateTime }}
                </span>
              </vs-td>

              <vs-td class="text-right">
                <span
                  class="product-category"
                  :class="{ redtextclass: transaction.montant < 0 }"
                >
                  {{ transaction.montant | formatMoney(devise) }}
                </span>
              </vs-td>

              <vs-td class="whitespace-no-wrap text-right">
                <vx-tooltip
                  :text="$t('operationDetail')"
                  position="bottom"
                  class="inline-block"
                >
                  <feather-icon
                    icon="EyeIcon"
                    svgClasses="w-5 h-5 hover:text-primary stroke-current"
                    @click.stop="getOperation(transaction)"
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
//Components
import ActionButton from "../components/ActionButton.component";
import DataViewSidebar from "../../../../../components/sidebar/DataViewSidebar.component";

//Functions
import { EventBus } from "@/services/EventBus.js";
import { mapGetters } from "vuex";
import exports from "@/services/exports";
import checkIfAdmin from "../../../../../mixins/checkRole";
import checkActivityType from "../../../mixins/checkActivityType";

export default {
  mixins: [checkIfAdmin, checkActivityType],
  components: {
    DataViewSidebar,
    ActionButton,
  },
  data() {
    return {
      selected: [],
      transactions: [],
      // usersData: [],
      itemsPerPage: 10,
      isMounted: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: "",
      membre_selectionne: "",
      visibilite: "",
      popupActivo2: false,
      popupActivo3: false,
      devise: "",

      isReady: false,
      gotTransactions: false,
    };
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation"
    }),
    admin() {
      return this.isSuperAdministrator;
    },
    activity() {
      return this.$store.state.association.activite;
    },
    activeUserInfo() {
      return this.$store.state.authentificated.user;
    },
    usersData() {
      return this.$store.state.association.member_activities;
    },
    currentPage() {
      if (this.isMounted) {
        return this.$refs['transactionsTable'].currentx;
      }
      return 0;
    },
    queriedItems() {
      return this.transactions.length;
    },
  },
  methods: {
    sendData(etat, data) {
      this.etat = etat;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
    transactionsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t("transactions")}`;

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
              this.$t("members"),
              this.$t("date"),
              this.$t("Amount"),
              this.$t("type")
            ],
            body: this.$refs['transactionsTable'].queriedResults.map((settlement) => [
              settlement.membre,
              this.$d(settlement.date_created * 1000),
              this.$options.filters.formatMoney(settlement.montant, this.currentAssociation.devise),
              settlement.debit_credit
            ]),
          },
          title
        );
      }
    },
    //Retourne l'operation à partire de son id
    getOperation(operation) {
      let payload = {
        resourceUrl:
          "/api/membre/" +
          operation.membres_id +
          "/operation/" +
          operation.operations_id,
        commitAction: "SET_OPERATION",
      };

      this.$store
        .dispatch("association/fetchFinances", payload)
        .then((res) => {
          var data = res.data.data;
          var operation = null;
          window.console.log(data != "undefined");
          if (data != "undefined") {
            operation = {
              id: data.operation.id,
              date_versement: data.operation.date_realisation,
              debit_credit: data.operation.debit_credit,
              enregistre_par: data.operation.enregistre_par,
              montant: data.operation.montant,
              etat: data.operation.etat,
              mode: data.operation.mode,
              preuve: data.operation.preuve,
              en_ligne: data.operation.en_ligne,
              membre_id: data.operation.membre_id,
              num_recu: data.operation.num_recu,
              commentaire: data.operation.commentaire,
              transactions: data.transactions,
            };
          }
          if (operation != null) this.sendData("DetailOperation", operation);
        })
        .catch((error) => {
          window.console.log(error);
        });
    },
    // Retrieves a member transactions (just in case we had to recompute)
    getTransactions(account) {
      let transactions = [];
      if (account.transactions.length > 0) {
        account.transactions.forEach((element) => {
          transactions.push({
            comptes_id: element.comptes_id,
            created_by: element.created_by,
            date_created: element.date_created,
            debit_credit: element.debit_credit,
            etat: element.etat,
            id: element.id,
            libelle: element.libelle,
            montant: element.montant,
            montant_attendu: element.montant_attendu,
            operations_id: element.operations_id,
            membre: account.membre,
            membres_id: account.membres_id,
          });
        });
      }
      this.gotTransactions = true;
      EventBus.$emit("loader", false);
      return transactions;
    },
    // Retrieves transactions from all accounts
    getAllTransactions(activity_id) {
      let payload = {
        resourceUrl: "/api/activite/" + activity_id + "/comptes/all",
        commitAction: "SET_ACCOUNTS",
      };

      this.$store
        .dispatch("association/fetchComptemembreActivite", payload)
        .then((res) => {
          let comptes = res.data.data;

          if (comptes.length > 0) {
            let transactions = [];

            comptes.forEach((element) => {
              if (element.transactions.length > 0) {
                element.transactions.forEach((transaction) => {
                  transactions.push({
                    comptes_id: transaction.comptes_id,
                    created_by: transaction.created_by,
                    date_created: transaction.date_created,
                    debit_credit: transaction.debit_credit,
                    etat: transaction.etat,
                    id: transaction.id,
                    libelle: transaction.libelle,
                    montant: transaction.montant,
                    montant_attendu: transaction.montant_attendu,
                    operations_id: transaction.operations_id,
                    membre: element.membre,
                    membres_id: element.membres_id,
                  });
                });
              }
            });

            this.transactions = transactions;
            this.gotTransactions = true;
            EventBus.$emit("loader", false);
          }
        })
        .catch((error) => {
          window.console.error(error);
          this.gotTransactions = true;
        });
    },
  },
  created() {
    EventBus.$emit("loader", true);
    // if(!moduleMember.isRegistered) {
    //     this.$store.registerModule('member', moduleMember)
    //     moduleMember.isRegistered = true
    // }

    // if(!moduleFinance.isRegistered) {
    //     this.$store.registerModule('finance', moduleFinance)
    //     moduleFinance.isRegistered = true
    // }

    var current_association = this.$store.state.association.currentAssociation;

    var current_activity_id = !this.$store.state.association.activite
      ? JSON.parse(localStorage.getItem("activity_id"))
      : this.$store.state.association.activite.id;

    var current_member_id = !this.$store.state.association.member
      ? JSON.parse(localStorage.getItem("member_id"))
      : this.$store.state.association.member.id;

    let transactionsExists =
      this.$store.state.association.transactions.length > 0;

    let payload = {
      resourceUrl:
        "api/association/" +
        current_association.id +
        "/activite/" +
        current_activity_id,
      commitAction: "SET_ACTIVITE",
    };
    this.$store
      .dispatch("association/fetchAssociationactivite", payload)
      .then((res) => {
        this.checkActivityType(res.data.data);
        this.isReady = true;
        if (transactionsExists) {
          this.transactions = this.$store.state.association.transactions;
          this.gotTransactions = true;
          EventBus.$emit("loader", false);
        } else {
          if (this.$store.state.association.account != "") {
            this.transactions = this.getTransactions(
              this.$store.state.association.account
            );
          } else {
            if (current_member_id) {
              this.$store
                .dispatch("association/fetchMemberAccount", {
                  activityId: current_activity_id,
                  memberId: current_member_id,
                })
                .then((result) => {
                  this.transactions = this.getTransactions(result.data.data);
                })
                .catch((error) => {
                  window.console.log(error);
                });
            } else {
              this.getAllTransactions(current_activity_id);
            }
          }
        }
      })
      .catch((error) => {
        window.console.error(error);
        this.gotTransactions = true;
      });

    /* Visibilité de l'association courante */
    this.visibilite = current_association.visibilite_financiere;

    //Devise de l'association
    this.devise = current_association.devise;
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>
