<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

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
            {{ $t("overallFinancialSituation") | CAPITALIZE }} -
            {{ membre.nom | Capitalize }}
          </h5>
          <p class="mt-2 text-muted">{{ $t("financialSituationOfAMember") }}</p>
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

        <vx-card v-if="comptesData.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>

      <div class="vx-row">
        <!-- CARD 9: DISPATCHED ORDERS -->
        <div v-if="comptesData.length > 0" class="vx-col w-full">
          <vx-card>
            <div slot="no-body" class="mt-4">
              <vs-table
                ref="financialSituationTable"
                search
                :data="comptesData"
                :max-items="comptesData.length"
                class="table-dark-inverted overflow-auto"
                style="max-height: 24rem"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t("activities") | CAPITALIZE }}
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
                      <vs-dropdown-item
                        @click.native="financialSituationExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item
                        @click.native="financialSituationExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item
                        @click.native="financialSituationExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th sort-key="type_activite">{{
                    $t("Type") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="nom_activite">{{
                    $t("name") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="solde" class="customer-align">{{
                    $t("balance") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="dettes" class="customer-align">{{
                    $t("debt") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="avoirs" class="customer-align">{{
                    $t("assets") | CAPITALIZE
                  }}</vs-th>
                </template>
                <template slot-scope="{ data }">
                  <vs-tr
                    :key="indextr"
                    v-for="(tr, indextr) in data"
                    class="cursor-pointer"
                    @click.native="redirectDetail(tr)"
                  >
                    <vs-td :data="data[indextr].type_activite">
                      <p class="product-name">
                        <!-- Caisse -->
                        <span v-if="tr.type_activite == 'caisse'">
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
                        <span v-if="tr.type_activite == 'Generique'">
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
                        <span v-if="tr.type_activite == 'Tontine'">
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
                        <span v-if="tr.type_activite == 'Evenement'">
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
                        <span v-if="tr.type_activite == 'Mutuelle'">
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
                        <span v-if="tr.type_activite == 'Projet'">
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
                        <span v-if="tr.type_activite == 'Solidarite'">
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
                        <span v-if="tr.type_activite == 'Main_levee'">
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
                      <p class="product-name">{{ tr.nom_activite }}</p>
                    </vs-td>
                    <vs-td
                      :data="data[indextr].solde"
                      class="text-right"
                      v-if="tr.statistique.data"
                    >
                      <span
                        :class="{ redtextclass: tr.statistique.data.solde < 0 }"
                      >
                        {{ tr.statistique.data.solde | formatMoney(devise) }}
                      </span>
                    </vs-td>
                    <vs-td
                      :data="data[indextr].dettes"
                      class="text-right"
                      v-if="tr.statistique.data"
                    >
                      <span
                        :class="{
                          redtextclass:
                            tr.statistique.data.dettes_acquitements +
                              tr.statistique.data.dettes_cotisations <
                            0,
                        }"
                      >
                        {{
                          (tr.statistique.data.dettes_acquitements +
                            tr.statistique.data.dettes_cotisations)
                            | formatMoney(devise)
                        }}
                      </span>
                    </vs-td>
                    <vs-td
                      :data="data[indextr].avoirs"
                      class="text-right"
                      v-if="tr.statistique.data"
                    >
                      <span
                        :class="{
                          redtextclass: tr.statistique.data.avoirs < 0,
                        }"
                      >
                        {{ tr.statistique.data.avoirs | formatMoney(devise) }}
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
// Getters from vuex
import { mapGetters } from "vuex";

//Fonctions
import { EventBus } from "@/services/EventBus.js";
import exports from "@/services/exports";

export default {
  data() {
    return {
      devise: "",
      membre: null,
    };
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),
    comptesData() {
      if (this.$store.state.association.user_accounts) {
        let accounts = this.$store.state.association.user_accounts;
        return accounts
          .sort((a, b) => (a.membre > b.membre ? 1 : -1))
          .map((account) => ({
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
      } else return [];
    },

    solde() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          cpt += element.solde;
        });
      }

      return cpt;
    },

    dette() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          cpt += element.dettes_acquitements + element.dettes_cotisations;
        });
      }

      return cpt;
    },

    avoir() {
      let data = this.queriedResults;
      var cpt = 0;

      if (data.length > 0) {
        data.forEach((element) => {
          cpt += element.avoirs;
        });
      }

      return cpt;
    },

    queriedResults() {
      if (this.$refs["financialSituationTable"])
        return this.$refs["financialSituationTable"].queriedResults;

      return this.comptesData;
    },
  },
  methods: {
    //Redirige vers la pages d'accueil côté administrateur
    redirectDetail(tr) {
      let association_courante =
        this.$store.state.association.currentAssociation;
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
              route = "/association/administration/activities/generic/details";
              break;
            case "caisse":
              route = "/association/administration/activities/generic/details";
              break;

            case "Tontine":
              route = "/association/administration/activities/tontine/details";
              break;

            case "Evenement":
              route = "/association/administration/activities/event/details";
              break;

            case "Mutuelle":
              route = "/association/administration/activities/mutual/details";
              break;
            case "Solidarite":
              route =
                "/association/administration/activities/solidarity/details";
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

    financialSituationExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${
        this.membre.nom
      } - ${this.$t("overallFinancialSituation")}`;

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
              this.$t("numberOfNames"),
              this.$t("balance"),
              this.$t("debt"),
              this.$t("assets"),
              this.$t("interests"),
              this.$t("expectedPayment"),
              this.$t("expectedDisbursement"),
            ],
            body: this.queriedResults.map((account) => [
              account.membre,
              account.nombre_noms,
              this.$options.filters.formatMoney(
                account.statistique.data.solde,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistique.data.dettes_acquitements +
                  account.statistique.data.dettes_cotisations,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistique.data.avoirs,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistique.data.interet,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistique.data.encaissement,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistique.data.decaissement,
                this.currentAssociation.devise
              ),
            ]),
          },
          title
        );
      }
    },
  },
  created() {
    EventBus.$emit("loader", true);

    this.membre = this.$store.state.association.account;

    let member_id = this.membre
      ? this.membre.membres_id
      : localStorage.getItem("member_id");

    //Les differents comptes de l'utilisateur
    let payload = {
      resourceUrl: "/api/member/" + member_id + "/comptes",
      commitAction: "SET_USER_ACCOUNTS",
    };

    this.$store
      .dispatch("association/fetchMemberActivities", payload)
      .then((response) => {
        let accounts = response.data.data;
        if (accounts.length) {
          this.membre = {
            id: accounts[0].membres_id,
            nom: accounts[0].membre,
          };
        }
        EventBus.$emit("loader", false);
      })
      .catch((error) => {
        EventBus.$emit("loader", false);
        window.console.error(error);
      });
    //Devise de l'association
    this.devise = this.currentAssociation.devise;
  },
};
</script>

<style lang="scss">
.customer-align .vs-table-text {
  text-align: right;
  display: block;
}

.product-name {
  max-width: 13rem;
}
</style>
