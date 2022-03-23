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
            {{ $t("deadlines") | CAPITALIZE }} -
            {{ $t("genericActivities") | CAPITALIZE }} -
            {{ nom_activite | CAPITALIZE }}
          </h5>
          <p class="mt-2 text-muted">
            {{ $t("forMoreOptionsClickActionButtonRight") }}.
          </p>
        </vx-card>
        <div class="vx-row flex flex-wrapper mt-5">
          <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
            <div v-if="admin" class="flex justify-center">
              <span class="inline-block">
                <vs-switch v-model="switch1" />
              </span>
              <span class="inline-block ml-2 font-bold">
                {{ $t("myDeadlines") }}
              </span>
            </div>
            <div v-else class="flex justify-center">
              <span class="inline-block">
                <vs-switch v-model="switch1" :disabled="true" />
              </span>
              <span class="inline-block ml-2 font-bold">
                {{ $t("myDeadlines") }}
              </span>
            </div>
          </div>
          <div
            class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 flex justify-center mb-5"
          >
            <span class="inline-block">
              <vs-switch v-model="switch2" />
            </span>
            <span class="inline-block ml-2 font-bold">
              {{ $t("currentPeriod") }}
            </span>
          </div>
          <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
            <span class="flex justify-center">
              <h2
                class="font-bold text-size"
                :class="{ redtextclass: credit < 0 }"
              >
                {{ credit | formatMoney(devise) }}
              </h2>
            </span>
            <span class="flex justify-center">
              {{ $t("totalPayment") }}
            </span>
          </div>
          <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
            <span class="flex justify-center">
              <h2
                class="font-bold text-size"
                :class="{ redtextclass: debit < 0 }"
              >
                {{ debit | formatMoney(devise) }}
              </h2>
            </span>
            <span class="flex justify-center">
              {{ $t("totalDisbursement") }}
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
                    {{ $t("deadlines") | CAPITALIZE }}
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
                  <vs-th sort-key="firstName">{{
                    $t("accounts") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="libelle">{{
                    $t("wording") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="date_limite"><span class="w-full text-right">{{
                    $t("limitDate") | CAPITALIZE
                  }}</span></vs-th>
                  <vs-th sort-key="montant"><span class="w-full text-right">{{
                    $t("Amount") | CAPITALIZE
                  }}</span></vs-th>
                  <vs-th><span class="w-full text-right">{{ $t("actions") | CAPITALIZE }}</span></vs-th>
                </template>

                <template slot-scope="{ data }">
                  <vs-tr :key="indextr" v-for="(echeance, indextr) in data">
                    <vs-td :data="data[indextr].membre">
                      <p class="product-name font-medium truncate">
                        {{ data[indextr].membre }}
                      </p>
                    </vs-td>
                    <vs-td :data="data[indextr].libelle">
                      <p>
                        <feather-icon
                          v-if="
                            data[indextr].debit_credit == 'cotisation' ||
                            data[indextr].debit_credit == 'acquitement'
                          "
                          icon="ArrowRightCircleIcon"
                          svgClasses="w-5 h-5 text-success stroke-current"
                        />
                        <feather-icon
                          v-if="data[indextr].debit_credit == 'decaissement'"
                          icon="ArrowRightCircleIcon"
                          svgClasses="w-5 h-5 text-danger stroke-current"
                        />
                        <span class="ml-2"> {{ data[indextr].libelle }} </span>
                      </p>
                    </vs-td>
                    <vs-td class="text-right" :data="data[indextr].date_limite">
                      <span v-if="data[indextr].date_limite == 0" class="product-name">
                        {{ $t("nextCycle") }}
                      </span>
                      <span v-else class="product-name">
                        {{ data[indextr].date_limite | dateTime }}
                      </span>
                    </vs-td>
                    <vs-td class="text-right" :data="data[indextr].montant">
                      <p :class="{ redtextclass: data[indextr].montant < 0 }">
                        {{ data[indextr].montant | formatMoney(devise) }}
                      </p>
                    </vs-td>

                    <vs-td class="whitespace-no-wrap text-right">
                      <!-- SUPPRIMER UNE OPERATION -->
                      <vx-tooltip
                        :text="$t('cancelTheOperation')"
                        position="bottom"
                        class="inline-block"
                      >
                        <feather-icon
                          icon="XCircleIcon"
                          svgClasses="w-5 h-5 hover:text-danger stroke-current"
                          @click="
                            popupActivo2 = true;
                            echeance_selectionne = data[indextr].id;
                          "
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
import ActionButton from "../components/ActionButton.component";

//Fonctions
import exports from "@/services/exports";
import ag_function from "../../../../../services/functions";
import { EventBus } from "@/services/EventBus.js";
import checkIfAdmin from "../../../../../mixins/checkRole";
import checkActivityType from "../../../mixins/checkActivityType";

export default {
  mixins: [checkIfAdmin, checkActivityType],
  data() {
    return {
      switch1: true,
      switch2: true,
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
        data.forEach((element) => {
          if (this.switch2) {
            if (element.length > 0) {
              element.forEach((echeance) => {
                if (
                  echeance.date_limite == this.ags.date_ag &&
                  echeance.etat != "cloture"
                ) {
                  if (this.switch1) {
                    if (this.membre_id == echeance.membres_id) {
                      echeances.push(echeance);
                    }
                  } else {
                    echeances.push(echeance);
                  }
                }
              });
            }
          } else {
            if (this.switch1) {
              if (element.length > 0) {
                element.forEach((echeance) => {
                  if (
                    this.membre_id == echeance.membres_id &&
                    echeance.etat != "cloture"
                  ) {
                    echeances.push(echeance);
                  }
                });
              }
            } else {
              if (element.length > 0) {
                element.forEach((echeance) => {
                  if (echeance.etat != "cloture") {
                    echeances.push(echeance);
                  }
                });
              }
            }
          }
        });
      }
      return echeances;
    },
    credit() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          if (this.switch2) {
            if (element.date_limite == this.ags.date_ag) {
              if (this.switch1) {
                if (this.membre_id == element.membres_id) {
                  if (
                    element.debit_credit == "cotisation" ||
                    element.debit_credit == "acquitement"
                  )
                    cpt += element.montant;
                }
              } else {
                if (
                  element.debit_credit == "cotisation" ||
                  element.debit_credit == "acquitement"
                ) {
                  cpt += element.montant;
                }
              }
            }
          } else {
            if (this.switch1) {
              if (this.membre_id == element.membres_id) {
                if (
                  element.debit_credit == "cotisation" ||
                  element.debit_credit == "acquitement"
                ) {
                  cpt += element.montant;
                }
              }
            } else {
              if (
                element.debit_credit == "cotisation" ||
                element.debit_credit == "acquitement"
              ) {
                cpt += element.montant;
              }
            }
          }
        });
      }

      return cpt;
    },
    debit() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          if (this.switch2) {
            if (element.date_limite == this.ags.date_ag) {
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
      if (this.$refs['settlementsTable'])
        return this.$refs['settlementsTable'].queriedResults;

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
    settlementsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t("settlement")}`;
      const aggregates = {};
      aggregates[this.$t("totalPayment")] = this.$options.filters.formatMoney(
        this.credit,
        this.currentAssociation.devise
      );
      aggregates[this.$t("totalDisbursement")] =
        this.$options.filters.formatMoney(
          this.debit,
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
              this.$t("wording"),
              this.$t("limitDate"),
              this.$t("Amount"),
            ],
            body: this.queriedResults.map(
              (settlement) => [
                settlement.membre,
                settlement.libelle,
                this.$d(settlement.date_limite * 1000),
                this.$options.filters.formatMoney(
                  settlement.montant,
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
            let activite_courante = this.$store.state.association.activite;
            this.nom_activite = activite_courante.nom;
            let payload = {
              resourceUrl:
                "/api/activite/" + activite_courante.id + "/echeancier/active",
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
