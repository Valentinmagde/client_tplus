<template>
  <div v-if="isReady">
    <!-- ACTION - DROPDOWN -->
    <action-button v-if="admin" :activity="activity" />
    <!-- Popup pour supprimer une échéance -->
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
          @click.stop="deleteItem(echeance_selectionne)"
          >{{ $t("delete") }}</vs-button
        >
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
      <div>
        <vx-card class="mb-base">
          <h5>
            {{ $t("debt") | CAPITALIZE }} -
            {{ $t("genericActivities") | CAPITALIZE }} -
            {{ nom_activite | CAPITALIZE }}
          </h5>
          <p class="mt-2 text-muted">
            {{ $t("forMoreOptionsClickActionButtonRight") }}.
          </p>
        </vx-card>
        <div class="vx-row flex flex-wrapper mt-5">
          <div class="vx-col sm:w-1/3 md:w-1/3 lg:w-1/3 mb-5">
            <div v-if="admin" class="flex justify-center">
              <span class="inline-block">
                <vs-switch v-model="switch1" />
              </span>
              <span class="inline-block ml-2 font-bold">
                {{ $t("myDebt") }}
              </span>
            </div>
            <div v-else class="flex justify-center">
              <span class="inline-block">
                <vs-switch v-model="switch1" :disabled="true" />
              </span>
              <span class="inline-block ml-2 font-bold">
                {{ $t("myDebt") }}
              </span>
            </div>
          </div>
          <div class="vx-col sm:w-1/3 md:w-1/3 lg:w-1/3 mb-5">
            <div v-if="admin" class="flex justify-center">
              <span class="inline-block">
                <vs-switch v-model="switch2" />
              </span>
              <span class="inline-block ml-2 font-bold">
                {{ $t("lostProfit") }}
              </span>
            </div>
            <div v-else class="flex justify-center">
              <span class="inline-block">
                <vs-switch v-model="switch2" :disabled="true" />
              </span>
              <span class="inline-block ml-2 font-bold">
                {{ $t("lostProfit") }}
              </span>
            </div>
          </div>
          <div class="vx-col sm:w-1/3 md:w-1/3 lg:w-1/3 mb-5">
            <span class="flex justify-center">
              <h2
                class="font-bold text-size"
                :class="{ redtextclass: montant_restant < 0 }"
              >
                {{ montant_restant | formatMoney(devise) }}
              </h2>
            </span>
            <span class="flex justify-center">
              {{ $t("totalPayment") }}
            </span>
          </div>
        </div>
        <vx-card v-if="echeancesData.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>
      <div class="vx-row">
        <!-- CARD 9: DEADLINES -->
        <div v-show="echeancesData.length > 0" class="vx-col w-full">
          <vx-card>
            <div slot="no-body" class="mt-4">
              <vs-table
                ref="settlementsTable"
                search
                :data="echeancesData"
                :max-items="echeancesData.length"
                class="table-dark-inverted overflow-auto"
                style="max-height: 26rem"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t("debt") | CAPITALIZE }}
                  </h4>
                  <vs-dropdown
                    vs-trigger-click
                    class="relative right-0 cursor-pointer self-end mr-2"
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
                      <vs-dropdown-item @click.native="settlementsExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="settlementsExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item
                        @click.native="settlementsExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th sort-key="membre">{{
                    $t("accounts") | CAPITALIZE
                  }}</vs-th>
                  <!-- <vs-th sort-key="debit_credit">{{$t('paymentDisbursement') | CAPITALIZE }}</vs-th> -->
                  <vs-th sort-key="type">{{ $t("type") | CAPITALIZE }}</vs-th>
                  <vs-th sort-key="libelle">{{
                    $t("wording") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="date_creation"
                    ><span class="text-right w-full">{{
                      $t("dateCreation") | CAPITALIZE
                    }}</span></vs-th
                  >
                  <vs-th sort-key="date_solde"><span class="text-right w-full">{{
                    $t("dateSolde") | CAPITALIZE
                  }}</span></vs-th>
                  <vs-th sort-key="montant"><span class="text-right w-full">{{
                    $t("montantAttendu") | CAPITALIZE
                  }}</span></vs-th>
                  <vs-th sort-key="montant_paye"><span class="text-right w-full">{{
                    $t("montantRealise") | CAPITALIZE
                  }}</span></vs-th>
                  <vs-th><span class="text-right w-full">{{ $t("status") | CAPITALIZE }}</span></vs-th>
                </template>

                <template slot-scope="{ data }">
                  <vs-tr :key="indextr" v-for="(echeance, indextr) in data">
                    <vs-td>
                      <p class="product-name font-medium truncate">
                        {{ data[indextr].membre }}
                      </p>
                    </vs-td>
                    <vs-td>
                      {{ data[indextr].type }}
                    </vs-td>
                    <vs-td>
                      <p>
                        <span class="ml-2"> {{ data[indextr].libelle }} </span>
                      </p>
                    </vs-td>
                    <vs-td class="text-right">
                      <p
                        v-if="data[indextr].date_creation == 0"
                        class="product-name"
                      ></p>
                      <p v-else class="product-name">
                        {{ data[indextr].date_creation | dateTime }}
                      </p>
                    </vs-td>
                    <vs-td class="text-right">
                      <p
                        v-if="data[indextr].date_solde == 0"
                        class="product-name"
                      ></p>
                      <p v-else class="product-name">
                        {{ data[indextr].date_solde | dateTime }}
                      </p>
                    </vs-td>
                    <vs-td class="text-right">
                      <p>{{ data[indextr].montant | formatMoney(devise) }}</p>
                    </vs-td>
                    <vs-td class="text-right">
                      <p>
                        {{ data[indextr].montant_paye | formatMoney(devise) }}
                      </p>
                    </vs-td>
                    <vs-td class="text-right">
                      <vx-tooltip
                        v-if="data[indextr].montant_paye == 0"
                        :text="$t('encours')"
                        position="bottom"
                        class="inline-block"
                      >
                        <vs-radio
                          class="flex mb-1 items-center"
                          color="danger"
                        />
                      </vx-tooltip>

                      <vx-tooltip
                        v-else-if="
                          data[indextr].montant_paye > 0 &&
                          data[indextr].montant_paye < data[indextr].montant
                        "
                        :text="$t('encours')"
                        position="bottom"
                        class="inline-block"
                      >
                        <vs-radio
                          class="flex mb-1 items-center"
                          color="warning"
                        />
                      </vx-tooltip>

                      <vx-tooltip
                        v-else
                        :text="$t('cloturer')"
                        position="bottom"
                        class="inline-block"
                      >
                        <vs-radio
                          class="flex mb-1 items-center"
                          color="success"
                        />
                      </vx-tooltip>
                    </vs-td>
                  </vs-tr>
                </template>
              </vs-table>
            </div>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import DataViewSidebar from "../../../../../components/sidebar/DataViewSidebar.component";
//Composants
/* import Withdrawal from './withdrawal.vue' */
import ActionButton from "../components/ActionButton.component";

//Fonctions
import exports from "@/services/exports";
import ag_function from "../../../../../services/functions";
import { EventBus } from "@/services/EventBus.js";
import checkIfAdmin from "../../../../../mixins/checkRole";
import checkActivityType from "../../../mixins/checkActivityType";

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleFinance from "@/store/finance/moduleFinance.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

export default {
  mixins: [checkIfAdmin, checkActivityType],
  data() {
    return {
      switch1: true,
      switch2: false,
      ags: [],
      searchQuery: "",
      itemsPerPage: 10,
      isMounted: false,
      popupActivo2: false,
      operation_selectionne: "",
      echeance_selectionne: "",
      devise: "",
      nom_activite: "",

      // Data Sidebar
      etat: "",
      addNewDataSidebar: false,
      sidebarData: {},
      membre_id: null,

      isReady: false,
    };
  },
  components: {
    /* Withdrawal, */
    ActionButton,
    DataViewSidebar,
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),
    activity() {
      return this.$store.state.association.activite;
    },
    admin() {
      return this.isSuperAdministrator;
    },
    echeancesData() {
      var data = [];
      data = this.$store.state.association.echeanciers;
      let echeances = [];
      if (data.length > 0) {
        if (this.switch1) {
          if (this.switch2) {
            data.forEach((element) => {
              if (
                this.membre_id == element.membre_id &&
                element.date_solde != 0 &&
                element.montant > element.montant_paye &&
                element.etat == "cloture"
              ) {
                echeances.push(element);
              }
            });
          } else {
            data.forEach((element) => {
              if (this.membre_id == element.membre_id) {
                echeances.push(element);
              }
            });
          }
        } else {
          if (this.switch2) {
            data.forEach((element) => {
              if (
                element.date_solde != 0 &&
                element.montant > element.montant_paye &&
                element.etat == "cloture"
              ) {
                echeances.push(element);
              }
            });
          } else {
            data.forEach((element) => {
              echeances.push(element);
            });
          }
        }
      }

      return echeances;
    },
    montant_restant() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        if (this.switch1) {
          if (this.switch2) {
            data.forEach((element) => {
              if (
                this.membre_id == element.membre_id &&
                element.date_solde != 0 &&
                element.montant > element.montant_paye &&
                element.etat == "cloture"
              ) {
                cpt += element.montant - element.montant_paye;
              }
            });
          } else {
            data.forEach((element) => {
              if (this.membre_id == element.membre_id) {
                cpt += element.montant - element.montant_paye;
              }
            });
          }
          // data.forEach(element => {

          //   if(this.membre_id == element.membre_id){
          //       cpt += element.montant_paye + element.montant;
          //   }
          // })
        } else {
          if (this.switch2) {
            data.forEach((element) => {
              if (
                element.date_solde != 0 &&
                element.montant > element.montant_paye &&
                element.etat == "cloture"
              ) {
                cpt += element.montant - element.montant_paye;
              }
            });
          } else {
            data.forEach((element) => {
              cpt += element.montant - element.montant_paye;
            });
          }
        }
      }

      return cpt;
    },
    debit() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          if (this.switch2) {
            if (this.ags && element.date_limite == this.ags.date_ag) {
              if (this.switch1) {
                if (this.membre_id == element.membres_id) {
                  if (element.debit_credit == "decaissement")
                    cpt += element.montant;
                }
              } else {
                if (element.debit_credit == "decaissement") {
                  cpt += element.montant;
                }
              }
            }
          } else {
            if (this.switch1) {
              if (this.membre_id == element.membres_id) {
                if (element.debit_credit == "decaissement") {
                  cpt += element.montant;
                }
              }
            } else {
              if (element.debit_credit == "decaissement") {
                cpt += element.montant;
              }
            }
          }
        });
      }

      return cpt;
    },

    queriedResults() {
      if (this.$refs["settlementsTable"])
        return this.$refs["settlementsTable"].queriedResults;

      return this.echeancesData;
    }
  },
  methods: {
    //Voir le destail d'une operation
    sendData(etat, data) {
      this.etat = etat;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },
    //Supprimer une échéance
    deleteItem(echeance_id) {
      var activite_courante = this.$store.state.association.activite;

      let payload = {
        resourceUrl:
          "/api/activite/" +
          activite_courante.id +
          "/echeancier/" +
          echeance_id,
        commitAction: "NO_COMMIT",
      };
      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
          (this.popupActivo2 = false),
            this.$vs.notify({
              position: "top-center",
              text: this.$t("settlementDelete"),
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "success",
            });

          let payload = {
            resourceUrl:
              "/api/activite/" + activite_courante.id + "/echeancier/active",
            commitAction: "SET_ECHEANCIERS",
          };
          this.$store
            .dispatch("association/fetchAssociationactivite", payload)
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
    /*
     *@param members
     *@return id  //retourne l'id membre de l'utilisateur connecté
     */
    extractMember(members) {
      var user = this.$store.state.authentificated.user;
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
    // Export data from table
    settlementsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t("debt")}`;
      const aggregates = {};
      aggregates[this.$t("totalPayment")] = this.$options.filters.formatMoney(
        this.montant_restant,
        this.currentAssociation.devise
      );

      if (["pdf", "csv", "excel"].includes(type)) {
        exports[`${type}Export`](
          {
            title: title,
            documentHeader: {
              image: this.currentAssociation.logo,
              name: this.currentAssociation.nom,
              date: this.$options.filters.dateTime(new Date().getTime() / 1000),
              aggregates,
            },
            headers: [
              this.$t("accounts"),
              this.$t("type"),
              this.$t("wording"),
              this.$t("dateCreation"),
              this.$t("dateSolde"),
              this.$t("montantAttendu"),
              this.$t("montantRealise"),
            ],
            body: this.$refs["settlementsTable"].queriedResults.map(
              (settlement) => [
                settlement.membre,
                settlement.type,
                settlement.libelle,
                this.$d(settlement.date_creation * 1000),
                settlement.date_solde === 0
                  ? ""
                  : this.$d(settlement.date_solde * 1000),
                this.$options.filters.formatMoney(
                  settlement.montant,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  settlement.montant_paye,
                  this.currentAssociation.devise
                ),
              ]
            ),
          },
          title
        );
      }
    },
    //Data Side bar
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
  },
  created() {
    EventBus.$emit("loader", true);
    let current_association = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl: "/api/association/" + current_association.id + "/membre",
      commitAction: "SET_MEMBERS",
    };

    this.$store
      .dispatch("association/fetchMembers", payload)
      .then((res) => {
        this.membre_id = this.extractMember(res.data.data);
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
            let activite_courante = res.data.data;
            this.nom_activite = activite_courante.nom;
            let payload = {
              resourceUrl:
                "/api/activite/" + activite_courante.id + "/impayes/all",
              commitAction: "SET_ECHEANCIERS",
            };
            this.$store
              .dispatch("association/fetchAssociationactivite", payload)
              .then(() => {
                let payload = {
                  resourceUrl:
                    "/api/association/" + current_association.id + "/cycle",
                  commitAction: "SET_CYCLES",
                };

                this.$store
                  .dispatch("association/fetchCycles", payload)
                  .then((res) => {
                    let donnees = res.data;
                    //Verifier s'il ya des cycles dans l'association
                    if (donnees.data.length > 0) {
                      //Nous voullons reccuperer le cycle actif de l'association
                      var cycle = donnees.data;
                      var cycleActif = ag_function.afficherCycleActif(cycle);
                      //Assignation du cycle actif à notre variable utilisée dans le template
                      if (cycleActif != null) {
                        if (cycleActif.ag.length > 0)
                          this.ags = ag_function.prochaineAg(cycleActif.ag);
                      }
                      EventBus.$emit("loader", false);
                      this.isReady = true;
                    }
                  })
                  .catch((error) => {
                    window.console.error(error);
                    this.isReady = true;
                  });
              })
              .catch((error) => {
                window.console.error(error);
                this.isReady = true;
              });
          })
          .catch((error) => {
            window.console.error(error);
            this.isReady = true;
          });

        /* Devise de l'association courante */
        this.devise = current_association.devise;
        /* Visibilité de l'association courante */
        this.visibilite = current_association.visibilite_financiere;
      })
      .catch((error) => {
        window.console.error(error);
        this.isReady = true;
      });
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>
<style>
.vs-con-table .vs-con-tbody {
  width: 100%;
  overflow: auto;
  margin-top: -10px;
}
</style>
