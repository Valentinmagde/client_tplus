<template>
  <div>
    <!-- ACTION - DROPDOWN -->
    <action-button v-if="admin" />
    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :activity="activite"
      :etat="etat"
    />
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <vx-card class="mb-base">
          <h5>{{ $t("stateOfCash") | CAPITALIZE }}</h5>
          <p class="mt-2 text-muted">{{ $t("stateOfCashSubtitle") }}</p>
        </vx-card>
        <vx-card v-if="tresoreriesData.length == 0">
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>
      <!-- Total en caisse -->
      <div v-if="tresoreriesData.length > 0" class="flex wrap justify-end mb-5">
        <div class="text-center mr-12">
          <span>
            <h2
              class="font-bold text-size"
              :class="{ redtextclass: totalTresorerie < 0 }"
            >
              {{ totalTresorerie | formatMoney(devise) }}
            </h2>
          </span>
          <span>
            {{ $t("cashTotal") }}
          </span>
        </div>
      </div>

      <div class="vx-row">
        <div
          v-if="tresoreriesData.length > 0"
          class="vx-col w-full ml-4 mr-4 mb-base"
        >
          <vx-card>
            <!-- Download Actions -->
            <div slot="no-body" class="mt-4">
              <vs-table
                ref="treasuryTable"
                search
                :data="tresoreriesData"
                :max-items="tresoreriesData.length"
                class="table-dark-inverted overflow-auto"
                style="max-height: 26rem"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t("treasury") }}
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
                      <vs-dropdown-item @click.native="treasuryExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="treasuryExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="treasuryExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th style="width: 25%" sort-key="heading">{{
                    $t("heading")
                  }}</vs-th>
                  <vs-th style="width: 25%" sort-key="name">{{
                    $t("name")
                  }}</vs-th>
                  <vs-th
                    style="width: 25%"
                    class="customer-align"
                    sort-key="amount"
                    >{{ $t("Amount") }}</vs-th
                  >
                  <vs-th
                    style="width: 25%"
                    class="customer-align"
                    sort-key="actions"
                    >{{ $t("actions") }}</vs-th
                  >
                </template>

                <template slot-scope="{ data }">
                  <tbody>
                    <vs-tr :key="ind" v-for="(activite, ind) in data">
                      <vs-td>
                        <p class="product-name font-medium truncate">
                          {{ activite.type }}
                        </p>
                      </vs-td>
                      <vs-td>
                        <p>{{ activite.nom }}</p>
                      </vs-td>
                      <vs-td class="text-right">
                        <p :class="{ redtextclass: activite.tresorerie < 0 }">
                          {{ activite.tresorerie | formatMoney(devise) }}
                        </p>
                      </vs-td>

                      <vs-td class="text-right whitespace-no-wrap">
                        <!-- Voir les détails d'une activité -->
                        <vx-tooltip
                          :text="$t('detail')"
                          position="bottom"
                          class="mr-2 inline-block"
                        >
                          <feather-icon
                            icon="EyeIcon"
                            svgClasses="w-5 h-5 hover:text-primary stroke-current"
                            @click="redirectDetail(activite.id)"
                          />
                        </vx-tooltip>

                        <!-- Retirer de l'argent -->
                        <vx-tooltip
                          :text="$t('withdrawMoney')"
                          v-if="
                            activite.type == 'caisse' ||
                            activite.type == 'Generique' ||
                            activite.type == 'Evenement'
                          "
                          position="bottom"
                          class="inline-block"
                        >
                          <vs-icon
                            icon-pack="streameline"
                            icon="icon-cash-payment-bag"
                            style="font-size: 18px"
                            class="hover:text-primary"
                            size="small"
                            @click.stop="sendData('RetraitArgent', activite)"
                          >
                          </vs-icon>
                        </vx-tooltip>

                        <div v-else class="inline-block">
                          <vs-icon
                            icon-pack="streameline"
                            style="font-size: 18px"
                            class="hover:text-primary"
                            size="small"
                          />
                        </div>
                      </vs-td>
                    </vs-tr>
                  </tbody>
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
//Composants
import ActionButton from "../../components/administration/ActionButton.component";
import DataViewSidebar from "../../../../components/sidebar/DataViewSidebar.component";

//Fonctions
import { EventBus } from "@/services/EventBus.js";
import exports from "@/services/exports";

//Store
import { mapGetters } from "vuex";
import checkIfAdmin from "../../../../mixins/checkRole";

export default {
  mixins: [checkIfAdmin],

  data() {
    return {
      devise: "",
      itemsPerPage: 10,

      addNewDataSidebar: false,
      sidebarData: {},
      etat: "",
      activite: {},
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
      return this.hasRole("Financier") || this.hasRole("Contrôleur Financier");
    },
    tresoreriesData() {
      return this.$store.state.association.tresoreries.map((element) => ({
        ...element.activite,
        tresorerie: element.tresorerie,
      }));
    },

    totalTresorerie() {
      let data = this.queriedResults;

      let sum = 0;

      if (data.length) {
        data.forEach((element) => {
          sum += element.tresorerie;
        });
      }

      return sum;
    },
     queriedResults() {
      if (this.$refs["treasuryTable"])
        return this.$refs["treasuryTable"].queriedResults;

      return this.tresoreriesData;
    }
  },
  methods: {
    sendData(etat, activite) {
      this.etat = etat;
      this.activite = activite;
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },

    treasuryExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t("treasury")}`;
      const aggregates = {};
      aggregates[this.$t("cashTotal")] = this.totalTresorerie;

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
            headers: [this.$t("heading"), this.$t("name"), this.$t("Amount")],
            body: this.queriedResults.map((treasury) => [
              treasury.type,
              treasury.nom,
              this.$options.filters.formatMoney(
                treasury.tresorerie,
                this.currentAssociation.devise
              ),
            ]),
          },
          title
        );
      }
    },

    //Redirige vers la pages d'accueil côté administrateur
    redirectDetail(id) {
      let association_courante =
        this.$store.state.association.currentAssociation;
      let payload = {
        resourceUrl:
          "api/association/" + association_courante.id + "/activite/" + id,
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
          localStorage.setItem("activity_id", JSON.stringify(id));

          this.$router.push(route).catch(() => {});
        })
        .catch((error) => {
          window.console.log.error(error);
        });
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
  },
  created() {
    EventBus.$emit("loader", true);
    var association_courante = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl:
        "api/association/" + association_courante.id + "/activites/tresorerie",
      commitAction: "SET_TRESORERIES",
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

    this.devise = association_courante.devise;
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="css">
.customer-align .vs-table-text {
  text-align: right;
  margin-left: auto;
  display: block;
}
</style>
