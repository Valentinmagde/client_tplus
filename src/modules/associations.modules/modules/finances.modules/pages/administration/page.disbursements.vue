<template>
  <div>
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div>
        <vx-card class="mb-base">
          <h5>
            {{ $t("disbursementDetail") | CAPITALIZE }} -
            {{ $t("allActivities") | CAPITALIZE }}
          </h5>
          <p class="mt-2 text-muted">{{ $t("listOfSettlementAndAssets") }}</p>
        </vx-card>

        <div class="vx-row flex flex-wrapper justify-end mt-5">
          <!-- Total échéance -->
          <div class="vx-col vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
            <span class="flex justify-center">
              <h2
                class="font-bold text-size"
                :class="{ redtextclass: credit < 0 }"
              >
                {{ credit | formatMoney(devise) }}
              </h2>
            </span>
            <span class="flex justify-center">
              {{ $t("totalDisbursement") }}
            </span>
          </div>
          <!-- Total avoir -->
          <!-- <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
                        <span class="flex justify-center">
                            <h2 class="font-bold"> {{formatMoney(debit)}}</h2>
                        </span>
                        <span class="flex justify-center">
                            {{$t('totalAssets')}}
                        </span>
                    </div> -->
        </div>
        <vx-card v-if="echeancesData.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>

      <!-- Echeances -->
      <div class="vx-row mb-base">
        <!-- CARD 9: DEADLINES -->
        <div v-show="echeancesData.length > 0" class="vx-col w-full">
          <vx-card>
            <div slot="no-body" class="mt-4">
              <vs-table
                search
                ref="disbursementsTable"
                :data="echeancesData"
                :max-items="echeancesData.length"
                class="table-dark-inverted overflow-auto"
                style="max-height: 24rem"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t("settlement") + " & " + $t("assets") }}
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
                    $t("members") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="libelle">{{
                    $t("wording") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="date_limite">
                    <span class="text-right w-full">{{
                      $t("limitDate") | CAPITALIZE
                    }}</span></vs-th
                  >
                  <vs-th sort-key="montant"
                    ><span class="text-right w-full">{{
                      $t("Amount") | CAPITALIZE
                    }}</span></vs-th
                  >
                </template>

                <template slot-scope="{ data }">
                  <vs-tr :key="indextr" v-for="(echeance, indextr) in data">
                    <vs-td :data="data[indextr].membre">
                      <p class="product-name font-medium truncate">
                        {{ data[indextr].membre }}
                      </p>
                    </vs-td>
                    <vs-td :data="data[indextr].libelle">
                      <p class="flex">
                        <feather-icon
                          v-if="
                            data[indextr].debit_credit == 'cotisation' ||
                            data[indextr].debit_credit == 'acquitement'
                          "
                          icon="ArrowRightCircleIcon"
                          svgClasses="w-5 h-5 text-danger stroke-current"
                        />
                        <feather-icon
                          v-if="
                            data[indextr].debit_credit == 'decaissement' ||
                            data[indextr].debit_credit == 'avoir'
                          "
                          icon="ArrowRightCircleIcon"
                          svgClasses="w-5 h-5 text-success stroke-current"
                        />
                        <span class="ml-2"> {{ data[indextr].libelle }} </span>
                      </p>
                    </vs-td>
                    <vs-td class="text-right" :data="data[indextr].date_limite">
                      <span
                        v-if="data[indextr].date_limite == 0"
                        class="product-name"
                      >
                        {{ $t("nextCycle") }}
                      </span>
                      <span v-else class="product-name">
                        {{ data[indextr].date_limite | dateTime }}
                      </span>
                    </vs-td>
                    <vs-td class="text-right" :data="data[indextr].montant">
                      <span :class="{ redtextclass: data[indextr].montant < 0 }">
                        {{ data[indextr].montant | formatMoney(devise) }}
                      </span>
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

//Fonctions
import exports from "@/services/exports";
import ag_function from "../../../../services/functions.js";
import { EventBus } from "@/services/EventBus.js";
import checkIfAdmin from "../../../../mixins/checkRole";

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleFinance from "@/store/finance/moduleFinance.js"
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleMember from "@/store/member/moduleMember.js"

export default {
  mixins: [checkIfAdmin],
  data() {
    return {
      searchQuery: "",
      ags: [],
      itemsPerPage: 10,
      isMounted: false,
      popupActivo2: false,
      operation_selectionne: "",
      membre_selectionne: "",
      devise: "",
      avoir: 0,

      membre_id: null,
    };
  },

  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),

    admin() {
      return this.hasRole("Contrôleur Financier");
    },
    comptesData() {
      if (this.$store.state.association.accounts != null)
        return this.$store.state.association.accounts;
      else return [];
    },

    echeancesData() {
      /* var ags = JSON.parse(localStorage.getItem('ags')) */
      var data1 = this.$store.state.association.echeanciers;
      /* var data2 = this.comptesData
          var date_ag_courante = null */

      let echeances = [];

      /* ag courante */
      /* ags.forEach(ag=>{
              if(ag.etat == 'current')
                date_ag_courante = ag.date_ag
          }) */

      if (data1.length > 0) {
        data1.forEach((element) => {
          if (element.length > 0) {
            element.forEach((echeance) => {
              if (
                echeance.date_limite == this.ags.date_ag &&
                echeance.etat != "cloture"
              ) {
                if (echeance.debit_credit == "decaissement")
                  echeances.push({
                    libelle: echeance.libelle,
                    date_limite: echeance.date_limite,
                    montant: echeance.montant,
                    membres_id: echeance.membres_id,
                    debit_credit: echeance.debit_credit,
                    membre: echeance.membre,
                  });
              }
            });
          }
        });
      }

      /* if(data2.length > 0){
            data2.forEach(dette => {
                let avoirs = dette.statistique.avoirs
                if(avoirs > 0)
                    echeances.push(
                        {
                            libelle: this.$t('assets')+ ' - ' + dette.nom_activite,
                            date_limite: date_ag_courante ? date_ag_courante: new Date().getTime()/1000,
                            montant: dette.statistique.avoirs,
                            membres_id: this.membre_id,
                            debit_credit: 'avoir',
                            membre: dette.membre
                        }
                    )
            })
          } */
      return echeances;
    },
    credit() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          if (element.debit_credit == "decaissement") {
            cpt += element.montant;
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
          if (element.debit_credit == "avoir") {
            cpt += element.montant;
          }
        });
      }

      return cpt;
    },
    regroupeComptes() {
      //Exraction de noms des membres inscris et le nombre de part à partir des lots
      let comptes = this.$store.state.association.accounts
        ? this.$store.state.association.accounts
        : [];
      var comptes_tries = [];

      if (comptes.length > 0) {
        //Compter les noms en double dans le tableau membre et
        //les stokés dans le tableau membres_tries avec leurs occurrences
        for (let i = 0; i < comptes.length - 1; i++) {
          let solde = comptes[i].statistique.solde;
          let dettes = comptes[i].dette_a + comptes[i].dette_c;
          let avoir = comptes[i].statistique.avoirs;
          let encaissements = comptes[i].statistique.encaissement;
          let decaissements = comptes[i].statistique.decaissement;

          for (let index = i + 1; index < comptes.length; index++) {
            if (comptes[i].activites_id == comptes[index].activites_id) {
              solde += comptes[index].statistique.solde;
              dettes += comptes[index].dette_a + comptes[index].dette_c;
              avoir += comptes[index].statistique.avoirs;
              encaissements += comptes[index].statistique.encaissement;
              decaissements += comptes[index].statistique.decaissement;
            }
          }
          /* window.console.log(som) */
          if (
            !comptes_tries.some(
              (element) => element.activites_id === comptes[i].activites_id
            )
          ) {
            comptes[i].statistique.solde = solde;
            comptes[i].statistique.dettes = dettes;
            comptes[i].statistique.avoirs = avoir;
            comptes[i].statistique.encaissement = encaissements;
            comptes[i].statistique.decaissement = decaissements;

            comptes_tries.push(comptes[i]);
          }
        }

        let $index = 1;
        /* window.console.log(membres[membres.length-1].nom) */
        for (let j = 0; j < comptes.length - 1; j++) {
          if (
            comptes[comptes.length - 1].activites_id == comptes[j].activites_id
          ) {
            $index++;
            /* window.console.log(membres[j].nom) */
          }
        }
        if ($index == 1) {
          comptes_tries.push(comptes[comptes.length - 1]);
        }
      }
      return comptes_tries.sort((a, b) =>
        a.activites_id > b.activites_id ? 1 : -1
      );
    },

    totalMontant() {
      let data = this.regroupeComptes.length ? this.regroupeComptes : [];
      let comptes = {
        solde: 0,
        dettes: 0,
        avoir: 0,
        encaissements: 0,
        decaissements: 0,
      };

      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          comptes.solde += data[i].statistique.solde;
          comptes.dettes += data[i].dette_a + data[i].dette_c;
          comptes.avoir += data[i].statistique.avoirs;
          comptes.encaissements += data[i].statistique.encaissement;
          comptes.decaissements += data[i].statistique.decaissement;
        }
      }
      return comptes;
    },

    queriedResults() {
      if (this.$refs["disbursementsTable"])
        return this.$refs["disbursementsTable"].queriedResults;

      return this.echeancesData;
    },
  },
  methods: {
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
      const title = `${this.currentAssociation.nom} - ${
        this.$t("settlement") + " & " + this.$t("assets")
      }`;
      const aggregates = {};
      aggregates[this.$t("totalDisbursement")] =
        this.$options.filters.formatMoney(
          this.credit,
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
              this.$t("members"),
              this.$t("wording"),
              this.$t("type"),
              this.$t("limitDate"),
              this.$t("Amount"),
            ],
            body: this.queriedResults.map(
              (settlement) => [
                settlement.membre,
                settlement.libelle,
                settlement.debit_credit,
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
    var current_association = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl: "/api/association/" + current_association.id + "/membre",
      commitAction: "SET_MEMBERS",
    };

    this.$store
      .dispatch("association/fetchMembers", payload)
      .then((res) => {
        this.membre_id = this.extractMember(res.data.data);

        let payload = {
          resourceUrl:
            "/api/member/all/association/" +
            current_association.id +
            "/echeances",
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
                EventBus.$emit("loader", false);
                let donnees = res.data;
                //Verifier s'il ya des cycles dans l'association
                if (donnees.data.length > 0) {
                  //Nous voullons reccuperer le cycle actif de l'association
                  var cycle = donnees.data;
                  var cycleActif = ag_function.afficherCycleActif(cycle);
                  //Assignation du cycle actigf à notre variable utilisée dans le template
                  if (cycleActif != null) {
                    if (cycleActif.ag.length > 0)
                      this.ags = ag_function.prochaineAg(cycleActif.ag);
                  }
                }
                //Les differents comptes de l'utilisateur
                let payload = {
                  resourceUrl:
                    "/api/association/" + current_association.id + "/comptes",
                  commitAction: "SET_ACCOUNTS",
                };

                this.$store
                  .dispatch("association/fetchMemberActivities", payload)
                  .then((res) => {
                    let donnees = res.data.data;

                    donnees.forEach((element) => {
                      this.avoir += element.statistique.avoirs;
                    });
                  })
                  .catch((error) => {
                    window.console.error(error);
                  });
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

    /* Devise de l'association courante */
    this.devise = current_association.devise;

    /* Visibilité de l'association courante */
    this.visibilite = current_association.visibilite_financiere;
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
