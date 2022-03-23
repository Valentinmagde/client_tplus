<template>
  <div>
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div>
        <vx-card class="mb-base">
          <h5>{{ $t("overallFinancialSituation") | CAPITALIZE }}</h5>
          <p class="mt-2 text-muted">
            {{ $t("financialSituationOfAllMembers") }}
          </p>
        </vx-card>

        <div class="vx-row flex flex-wrapper justify-end mt-5">
          <!-- Total solde -->
          <div class="vx-col vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
            <span class="flex justify-center">
              <h2
                class="font-bold text-size"
                :class="{ redtextclass: solde < 0 }"
              >
                {{ solde | formatMoney(devise) }}
              </h2>
            </span>
            <span class="flex justify-center">
              {{ $t("totalBalance") }}
            </span>
          </div>

          <!-- Total dette -->
          <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
            <span class="flex justify-center">
              <h2
                class="font-bold text-size"
                :class="{ redtextclass: dette < 0 }"
              >
                {{ dette | formatMoney(devise) }}
              </h2>
            </span>
            <span class="flex justify-center">
              {{ $t("totalDebts") }}
            </span>
          </div>

          <!-- Total avoir -->
          <div class="vx-col sm:w-1/2 md:w-1/4 lg:w-1/4 mb-5">
            <span class="flex justify-center">
              <h2
                class="font-bold text-size"
                :class="{ redtextclass: avoir < 0 }"
              >
                {{ avoir | formatMoney(devise) }}
              </h2>
            </span>
            <span class="flex justify-center">
              {{ $t("totalAssets") }}
            </span>
          </div>
        </div>

        <vx-card v-if="regroupeComptes.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>

      <!-- Situation financière globale -->
      <div class="vx-row mb-base">
        <div v-show="regroupeComptes.length > 0" class="vx-col w-full">
          <vx-card>
            <div slot="no-body" class="mt-4">
              <vs-table
                search
                ref="financesTable"
                :data="regroupeComptes"
                :max-items="regroupeComptes.length"
                class="table-dark-inverted overflow-auto"
                style="max-height: 30rem"
              >
                <div class="w-full flex flex-row justify-end" slot="header">
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
                      <vs-dropdown-item @click.native="financesExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="financesExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="financesExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th sort-key="membre">{{
                    $t("members") | CAPITALIZE
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
                </template>

                <template slot-scope="{ data }">
                  <vs-tr
                    :key="indextr"
                    v-for="(tr, indextr) in data"
                    class="cursor-pointer"
                    @click.native="redirectDetail(tr)"
                  >
                    <vs-td :data="data[indextr].membre">
                      <p class="product-name font-medium truncate">
                        {{ data[indextr].membre }}
                      </p>
                    </vs-td>
                    <vs-td :data="data[indextr].solde" class="text-right">
                      <span
                        :class="{
                          redtextclass: data[indextr].statistique.solde < 0,
                        }"
                      >
                        {{
                          data[indextr].statistique.solde | formatMoney(devise)
                        }}
                      </span>
                    </vs-td>
                    <vs-td :data="data[indextr].dettes" class="text-right">
                      <span
                        :class="{
                          redtextclass: data[indextr].statistique.dettes < 0,
                        }"
                      >
                        {{
                          data[indextr].statistique.dettes | formatMoney(devise)
                        }}
                      </span>
                    </vs-td>
                    <vs-td :data="data[indextr].avoirs" class="text-right">
                      <span
                        :class="{
                          redtextclass: data[indextr].statistique.avoirs < 0,
                        }"
                      >
                        {{
                          data[indextr].statistique.avoirs | formatMoney(devise)
                        }}
                      </span>
                    </vs-td>
                    <!-- <vs-td class="whitespace-no-wrap text-center">
                                            <vx-tooltip :text="$t('detail')" position="bottom"  class="inline-block mr-2"
                                                @click.native="redirectDetail(tr)">
                                                <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"/>
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
</template>
<script>
//Fonctions
import { EventBus } from "@/services/EventBus.js";
import exports from "@/services/exports";

// Acl role checker mixins
import checkIfAdmin from "../../../../mixins/checkRole";

// Map getters from vuex
import { mapGetters } from "vuex";

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
      membre_id: null,
    };
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),
    admin() {
      return this.hasRole("Financier") || this.hasRole("Contrôleur Financier");
    },
    comptesData() {
      if (this.$store.state.association.all_accounts != null)
        return this.$store.state.association.all_accounts;
      else return [];
    },

    regroupeComptes() {
      //Exraction de noms des membres inscris et le nombre de part à partir des lots
      let comptes = this.comptesData;
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
            if (comptes[i].membres_id == comptes[index].membres_id) {
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
              (element) => element.membres_id === comptes[i].membres_id
            )
          ) {
            comptes[i].statistique.solde = solde;
            comptes[i].solde = solde;
            comptes[i].statistique.dettes = dettes;
            comptes[i].dettes = dettes;
            comptes[i].statistique.avoirs = avoir;
            comptes[i].avoirs = avoir;
            comptes[i].statistique.encaissement = encaissements;
            comptes[i].statistique.decaissement = decaissements;

            comptes_tries.push(comptes[i]);
          }
        }

        let $index = 1;
        /* window.console.log(membres[membres.length-1].nom) */
        for (let j = 0; j < comptes.length - 1; j++) {
          if (comptes[comptes.length - 1].membres_id == comptes[j].membres_id) {
            $index++;
            /* window.console.log(membres[j].nom) */
          }
        }
        if ($index == 1) {
          comptes_tries.push(comptes[comptes.length - 1]);
        }
      }
      return comptes_tries.sort((a, b) =>
        a.membres_id > b.membres_id ? 1 : -1
      );
    },

    solde() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          cpt += element.statistique.solde;
        });
      }

      return cpt;
    },

    dette() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          cpt += element.statistique.dettes;
        });
      }

      return cpt;
    },

    avoir() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          cpt += element.statistique.avoirs;
        });
      }

      return cpt;
    },

    queriedResults() {
      if (this.$refs['financesTable'])
        return this.$refs['financesTable'].queriedResults;

      return this.regroupeComptes;
    },
  },
  methods: {
    //Redirection vers la page de situation financière du membre selectionné
    redirectDetail(membre) {
      localStorage.setItem("member_id", JSON.stringify(membre.membres_id));
      this.$store.commit("association/SET_ACCOUNT", membre);
      this.$router.push(
        "/association/administration/finances/overview/details"
      );
    },
    financesExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t(
        "financialSituationOfAllMembers"
      )}`;
      const aggregates = {};
      aggregates[this.$t("totalBalance")] = this.$options.filters.formatMoney(
        this.solde,
        this.currentAssociation.devise
      );
      aggregates[this.$t("totalDebts")] = this.$options.filters.formatMoney(
        this.dette,
        this.currentAssociation.devise
      );
      aggregates[this.$t("totalAssets")] = this.$options.filters.formatMoney(
        this.avoir,
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
              this.$t("balance"),
              this.$t("debt"),
              this.$t("assets"),
            ],
            body: this.queriedResults.map(
              (settlement) => [
                settlement.membre,
                this.$options.filters.formatMoney(
                  settlement.solde,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  settlement.dettes,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  settlement.avoirs,
                  this.currentAssociation.devise
                ),
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
    var current_association = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl: "/api/association/" + current_association.id + "/comptes",
      commitAction: "SET_ALL_ACCOUNTS",
    };

    this.$store
      .dispatch("association/fetchMemberActivities", payload)
      .then(() => {
        EventBus.$emit("loader", false);
        /* let donnees = res.data.data

            donnees.forEach(element=>{
                this.dette += element.statistique.dettes_cotisations + element.statistique.dettes_acquitements
            }) */
      })
      .catch((error) => {
        EventBus.$emit("loader", false);
        window.console.error(error);
      });

    /* Devise de l'association courante */
    this.devise = current_association.devise;

    /* Visibilité de l'association courante */
    this.visibilite = current_association.visibilite_financier;
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
