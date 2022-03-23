<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <!-- CARD 1: WELCOME -->
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <vx-card
          slot="no-body"
          class="text-center bg-primary-gradient greet-user"
          style="min-height: 16.6rem"
        >
          <img
            src="@/assets/images/elements/decore-left.png"
            class="decore-left"
            alt="Decore Left"
            width="200"
          />
          <img
            src="@/assets/images/elements/decore-right.png"
            class="decore-right"
            alt="Decore Right"
            width="175"
          />
          <!-- <vs-avatar :src="user.photo_profil" class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow" size="40px" /> -->
          <img
            v-if="activeUserInfo.photo_profil"
            class="mb-2 inline-flex rounded-full text-white shadow img-logo"
            :src="activeUserInfo.photo_profil"
            width="77"
            height="77"
          />
          <img
            v-else
            class="
              mb-2
              bg-primary
              inline-flex
              rounded-full
              text-white
              shadow
              img-logo
            "
            src="@/assets/images/portrait/small/default.jpg"
            width="77"
            height="77"
          />

          <!-- <img :src="user.photo_profil" class="mb-8 bg-primary inline-flex rounded-full text-white shadow" width="63"> -->
          <h1 v-if="activeUserInfo.lastName" class="mb-3 text-white text-size">
            {{ $t("welcom") }} {{ activeUserInfo.lastName | Capitalize }}
          </h1>
          <h1
            v-else-if="activeUserInfo.firstName"
            class="mb-3 text-white text-size"
          >
            {{ $t("welcom") }} {{ activeUserInfo.firstName | Capitalize }}
          </h1>
          <p
            v-if="prochaine_ag"
            class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white"
          >
            {{ $t("theNextGeneralAssemblyIs") }}
            <strong>{{ prochaine_ag.date_ag | dateTime }}, </strong>
            <span v-if="prochaine_ag.lieu_ag == 'En ligne'">
              {{ $t("online") }}
            </span>
            <span
              v-else-if="
                prochaine_ag.lieu_ag == null || prochaine_ag.lieu_ag == 'null'
              "
            >
              {{ $t("homeOf") + " " + prochaine_ag.membre }}.
            </span>
            <span v-else>{{ prochaine_ag.lieu_ag }}</span>
          </p>

          <p
            v-if="currentAssociation.jitsi_room && membre && membre.firstName"
            @contextmenu.prevent="$refs.menu.open"
            id="jitsilink"
            class="
              flex
              items-center
              justify-center
              mt-2
              font-semibold
              text-white
              cursor-pointer
            "
            @click="
              openJitsiRoom(
                `${currentAssociation.jitsi_room}#userInfo.displayName='${membre.firstName}'`
              )
            "
          >
            <vs-icon
              iconPack="streameline"
              icon="icon-meeting-camera-circle"
              class="mr-1"
            />
            <span class="hover:underline">{{
              $t("toTakePartToAMeeting")
            }}</span>
          </p>

          <p
            v-if="currentAssociation.jitsi_room && membre && !membre.firstName"
            @contextmenu.prevent="$refs.menu.open"
            class="
              flex
              items-center
              justify-center
              mt-2
              font-semibold
              text-white
              cursor-pointer
            "
            @click="openJitsiRoom(currentAssociation.jitsi_room)"
          >
            <vs-icon
              iconPack="streameline"
              icon="icon-meeting-camera-circle"
              class="mr-1"
            />
            <span class="hover:underline">{{
              $t("toTakePartToAMeeting")
            }}</span>
          </p>

          <vue-context ref="menu" class="w-64">
            <li>
              <a
                href="#"
                @click="copyTocliboard(currentAssociation.jitsi_room)"
                class="flex items-center text-sm"
              >
                <!--<vs-icon iconPack="streameline" icon="icon-copy-paste"/>-->
                <span class="ml-2">{{ $t("toCopy") }}</span>
              </a>
            </li>
          </vue-context>
        </vx-card>
      </div>

      <!-- CARD 2: EXPECTED PAYMENT -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base pt-5 pb-8 statistic-card"
          icon="cash-payment-coin-1"
          :variant="1"
          :statistic="encaissement | formatMoney(devise)"
          :statisticTitle="$t('expectedPayment')"
          :viewDetail="$t('viewDetails')"
          :paymentDetail="$t('saveAPayment')"
          :statisticDetail="$t('detail')"
          :paymentTitle="$t('payment')"
          link="/association/my-payments"
          paymentlink="/association/finances/payment"
          color="warning"
        />
      </div>
      <!-- CARD 3: EXPECTED DISBURSEMENT -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base pt-5 pb-8 statistic-card"
          icon="cash-payment-coin"
          :variant="1"
          :statisticTitle="$t('expectedDisbursement')"
          :statistic="decaissement | formatMoney(devise)"
          :statisticDetail="$t('detail')"
          :viewDetail="$t('viewDetails')"
          link="/association/my-disbursements"
          color="success"
        />
      </div>
    </div>

    <div class="vx-row">
      <!-- CARD 4: TRANSACTIONS STATISTICS -->
      <div class="vx-col w-full md:w-1/2 mb-base">
        <vx-card>
          <div
            class="
              vx-row
              flex-col-reverse
              md:flex-col-reverse
              sm:flex-row
              lg:flex-row
            "
          >
            <!-- LEFT COL -->
            <div
              class="
                vx-col
                w-full
                md:w-full
                sm:w-1/3
                lg:w-1/3
                xl:w-1/3
                flex flex-col
                justify-between
              "
            >
              <div>
                <h2 class="mb-1 font-bold text-size">{{ $t("operations") }}</h2>
                <span class="font-medium">{{ $t("averageOn") }}</span>

                <!-- Previous Data Comparison -->
                <p class="mt-2 font-medium">
                  <span>{{ $t("lastSixMonth") }}</span>
                </p>
              </div>
              <vs-button
                icon-pack="feather"
                icon="icon-chevrons-right"
                @click="$router.push('/association/finances').catch(() => {})"
                icon-after
                class="shadow-md w-full lg:mt-0 mt-4"
                >{{ $t("viewDetails") }}</vs-button
              >
            </div>

            <!-- RIGHT COL -->
            <div
              class="
                vx-col
                w-full
                md:w-full
                sm:w-2/3
                lg:w-2/3
                xl:w-2/3
                flex flex-col
                lg:mb-0
                md:mb-base
                sm:mb-0
                mb-base
              "
            >
              <button
                class="vs-con-dropdown parent-dropdown cursor-pointer self-end"
              >
                <small class="flex cursor-pointer">
                  <span>{{ $t("lastSixMonth") }}</span>
                </small>
              </button>
              <vue-apex-charts
                type="bar"
                height="200"
                :options="chartOptions"
                :series="series"
              />
            </div>
          </div>
          <vs-divider class="my-6"></vs-divider>
        </vx-card>
      </div>
      <!-- CARD 5: SUPPORT TRACKER -->
      <div class="vx-col w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base">
        <vx-card style="height: 22.4rem; text-align: center">
          <h4 class="mt-4">{{ $t("financialSituation") }}</h4>
          <div
            class="flex items-center justify-center w-full"
            style="height: 18rem"
          >
            <ul class="w-3/4">
              <li class="flex mb-5 justify-between">
                <span class="flex items-center">
                  <span
                    class="
                      inline-block
                      h-4
                      w-4
                      rounded-full
                      mr-2
                      bg-white
                      border-3 border-solid border-success
                    "
                  ></span>
                  <span>{{ $t("assets") }}</span>
                </span>
                <span
                  class="font-semibold"
                  :class="{ redtextclass: avoir < 0 }"
                >
                  {{ avoir | formatMoney(devise) }}
                </span>
              </li>

              <li class="flex mb-5 justify-between">
                <span class="flex items-center">
                  <span
                    class="
                      inline-block
                      h-4
                      w-4
                      rounded-full
                      mr-2
                      bg-white
                      border-3 border-solid border-warning
                    "
                  ></span>
                  <span>{{ $t("balance") }}</span>
                </span>
                <span
                  class="font-semibold"
                  :class="{ redtextclass: solde < 0 }"
                >
                  {{ solde | formatMoney(devise) }}
                </span>
              </li>

              <li class="flex mb-5 justify-between">
                <span class="flex items-center">
                  <span
                    class="
                      inline-block
                      h-4
                      w-4
                      rounded-full
                      mr-2
                      bg-white
                      border-3 border-solid border-danger
                    "
                  ></span>
                  <span>{{ $t("debt") }}</span>
                </span>
                <span
                  class="font-semibold"
                  :class="{ redtextclass: dette < 0 }"
                >
                  {{ dette | formatMoney(devise) }}
                </span>
              </li>

              <!-- Intérêts générés -->
              <li class="flex mb-1 justify-between">
                <span class="flex items-center">
                  <span
                    class="
                      inline-block
                      h-4
                      w-4
                      rounded-full
                      mr-2
                      bg-white
                      border-3 border-solid border-blue
                    "
                  ></span>
                  <span>{{ $t("interestGenerated") }}</span>
                </span>
                <span
                  class="font-semibold"
                  :class="{ redtextclass: interet < 0 }"
                >
                  {{ interet | formatMoney(devise) }}
                </span>
              </li>
            </ul>
          </div>
        </vx-card>
      </div>
    </div>

    <div class="vx-row">
      <!-- CARD 9: DISPATCHED ORDERS -->
      <div v-show="comptesData.length > 0" class="vx-col w-full">
        <vx-card>
          <div slot="no-body" class="mt-4">
            <vs-table
              search
              ref="activitiesTable"
              :max-items="comptesData.length"
              :data="comptesData"
              class="table-dark-inverted overflow-auto"
              style="max-height: 23rem"
            >
              <div class="w-full flex flex-row justify-between" slot="header">
                <h4 class="ml-6">{{ $t("listOfAllActivities") }}</h4>
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
                    <vs-dropdown-item @click.native="activitiesExport('pdf')"
                      >PDF</vs-dropdown-item
                    >
                    <vs-dropdown-item @click.native="activitiesExport('csv')"
                      >CSV</vs-dropdown-item
                    >
                    <vs-dropdown-item @click.native="activitiesExport('excel')"
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
                <vs-th sort-key="interet"
                  ><span class="text-right w-full">{{
                    $t("interests") | CAPITALIZE
                  }}</span></vs-th
                >
                <vs-th sort-key="encaissement"
                  ><span class="text-right w-full">{{
                    $t("expectedPayment") | CAPITALIZE
                  }}</span></vs-th
                >
                <vs-th sort-key="decaissement"
                  ><span class="text-right w-full">{{
                    $t("expectedDisbursement") | CAPITALIZE
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
                  <vs-td :data="data[indextr].type">
                    <p class="product-name">
                      <!-- Caisse -->
                      <span v-if="data[indextr].type_activite == 'caisse'">
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
                      <span v-if="data[indextr].type_activite == 'Generique'">
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
                      <span v-if="data[indextr].type_activite == 'Tontine'">
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
                      <span v-if="data[indextr].type_activite == 'Evenement'">
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
                      <span v-if="data[indextr].type_activite == 'Mutuelle'">
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
                      <span v-if="data[indextr].type_activite == 'Projet'">
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
                      <span v-if="data[indextr].type_activite == 'Solidarite'">
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
                      <span v-if="data[indextr].type_activite == 'Main_levee'">
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
                    <p class="product-name truncate">
                      {{ data[indextr].nom_activite }}
                    </p>
                  </vs-td>
                  <vs-td :data="data[indextr].solde" class="text-right">
                    <span
                      :class="{
                        redtextclass: data[indextr].statistique.data.solde < 0,
                      }"
                    >
                      {{
                        data[indextr].statistique.data.solde
                          | formatMoney(devise)
                      }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].dettes" class="text-right">
                    <span
                      :class="{
                        redtextclass:
                          data[indextr].statistique.data.dettes_acquitements +
                            data[indextr].statistique.data.dettes_cotisations <
                          0,
                      }"
                    >
                      {{
                        (data[indextr].statistique.data.dettes_acquitements +
                          data[indextr].statistique.data.dettes_cotisations)
                          | formatMoney(devise)
                      }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].avoirs" class="text-right">
                    <span
                      :class="{
                        redtextclass: data[indextr].statistique.data.avoirs < 0,
                      }"
                    >
                      {{
                        data[indextr].statistique.data.avoirs
                          | formatMoney(devise)
                      }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].interet" class="text-right">
                    <span :class="{ redtextclass: data[indextr].interet < 0 }">
                      {{ data[indextr].interet | formatMoney(devise) }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].encaissement" class="text-right">
                    <span
                      :class="{
                        redtextclass:
                          data[indextr].statistique.data.encaissement < 0,
                      }"
                    >
                      {{
                        data[indextr].statistique.data.encaissement
                          | formatMoney(devise)
                      }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].decaissement" class="text-right">
                    <span
                      class="text-right"
                      v-if="data[indextr].statistique.data"
                    >
                      {{
                        data[indextr].statistique.data.decaissement
                          | formatMoney(devise)
                      }}
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
</template>

<script>
import { VueContext } from "vue-context";
import VueApexCharts from "vue-apexcharts";
import analyticsData from "../../services/data/analyticsData.js";

// Store Module
// import moduleCycle from "@/store/cycle/moduleCycle.js"
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleFinance from "@/store/finance/moduleFinance.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleMember from "@/store/member/moduleMember.js"

//Fonctions
import functions from "../../services/functions.js";
import exports from "@/services/exports";

import { extractMember } from "../../services/helpers.js";

import { EventBus } from "@/services/EventBus.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      devise: "",
      solde: 0,
      dette: 0,
      avoir: 0,
      interet: 0,
      decaissement: 0,
      encaissement: 0,
      prochaine_ag: null,
      membre: null,

      analyticsData: analyticsData,
      dispatchedOrders: [],
    };
  },
  components: {
    VueApexCharts,
    VueContext,
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
      activeUserInfo: "authentificated/getAuth",
      user: "authentificated/getAuth",
    }),

    //Retourne les indexes des six derniers mois
    lastSixMonthsIndex() {
      var current_month = new Date().getMonth();
      var last_six_months_index = [];

      //Reccupperer les indexes des mois
      for (var i = 0; i < 6; i++) {
        var loop = current_month - i;
        if (loop < 0) loop = 12 + loop;

        last_six_months_index.unshift(loop);
      }

      return last_six_months_index;
    },
    //Retourne les six derniers mois
    lastSixMonths() {
      var index = this.lastSixMonthsIndex;
      var last_six_months = [];
      var months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      //Reccupperer les mois
      for (var j = 0; j < index.length; j++) {
        last_six_months.push(this.$t(months[index[j]]).substring(0, 3));
      }

      return last_six_months;
    },
    //L'option de l'histogramme
    chartOptions() {
      var themeColors = ["#FF9F43", "#28C76F", "#EA5455", "#7367F0", "#1E1E1E"];
      //var association_courante = JSON.parse(localStorage.getItem('association_courante'))
      var devise_association = this.currentAssociation.devise;

      return {
        colors: themeColors,
        plotOptions: {
          bar: {
            horizontal: false,
            endingShape: "rounded",
            columnWidth: "55%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },

        xaxis: {
          categories: this.lastSixMonths,
        },
        fill: {
          opacity: 1,
        },
        legend: {
          show: false,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              if (devise_association == "XAF") return "FCFA " + val.toFixed(2);
              else if (devise_association == "USD")
                return "$ " + val.toFixed(2);
              else return devise_association + " " + val.toFixed(2);
            },
          },
        },
      };
    },
    //Retourne les series de l'histogramme
    series() {
      var last_months = this.lastSixMonthsIndex;
      var debit = [0, 0, 0, 0, 0, 0];
      var credit = [0, 0, 0, 0, 0, 0];
      var operations = this.operationsData;

      operations.forEach((operation) => {
        let month = new Date(operation.date_realisation * 1000).getMonth();

        if (last_months.includes(month)) {
          let index = last_months.indexOf(month);
          if (
            operation.debit_credit == "credit" &&
            operation.etat == "VALIDE"
          ) {
            credit[index] += operation.montant;
          } else if (operation.debit_credit == "debit") {
            debit[index] += operation.montant;
          }
        }
      });

      for (let i = 0; i < last_months.length; i++) {
        debit[i] = debit[i].toFixed(2);
        credit[i] = credit[i].toFixed(2);
      }

      return [
        {
          name: this.$t("credit"),
          data: credit,
        },
        {
          name: this.$t("debit"),
          data: debit,
        },
      ];
    },

    operationsData() {
      var data = [];
      data = this.$store.state.association.operations;
      let transactions = [];
      if (data.length > 0) {
        data.forEach((element) => {
          if (element.operations.length > 0) {
            element.operations.forEach((operation) => {
              // Afficher la liste des operations de tous les membres de l'association lorsque
              // la visibilité financière de l'association est ouverte
              if (this.membre && this.membre.id == operation.membre_id) {
                transactions.push({
                  date_realisation: operation.date_realisation,
                  montant: operation.montant,
                  debit_credit: operation.debit_credit,
                  etat: operation.etat,
                });
              }
            });
          }
        });
      }
      return transactions;
    },

    comptesData() {
      if (this.$store.state.association.user_accounts != null)
        return this.$store.state.association.user_accounts.map((account) => ({
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
      else return [];
    },
  },
  methods: {
    openJitsiRoom(link) {
      window.open(link);
    },

    copyTocliboard(text) {
      var copyText = document.createElement("textarea");
      copyText.value = text;
      document.body.appendChild(copyText);
      copyText.select();
      document.execCommand("copy");
      document.body.removeChild(copyText);
    },
    /*
     *@param members
     *@return id  //retourne l'id membre de l'utilisateur connecté
     */

    //Redirige vers la pages d'accueil côté membre
    redirectDetail(tr) {
      let payload = {
        resourceUrl:
          "api/association/" +
          this.currentAssociation.id +
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
              route = "/association/my-activities/generic/details";
              break;
            case "caisse":
              route = "/association/my-activities/generic/details";
              break;

            case "Tontine":
              route = "/association/my-activities/tontine/details";
              break;

            case "Evenement":
              route = "/association/my-activities/event/details";
              break;

            case "Mutuelle":
              route = "/association/my-activities/mutual/details";
              break;
            case "Solidarite":
              route = "/association/my-activities/solidarity/details";
              break;

            default:
              break;
          }
          localStorage.setItem("activity_id", JSON.stringify(tr.activites_id));

          this.$router.push(route).catch(() => {});
        })
        .catch((error) => {
          window.console.log.error(error);
        });
    },

    // Export activities data to PDF format
    activitiesExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t(
        "listOfAllActivities"
      )}`;
      const types = {
        caisse: "generique",
        Generique: "generique",
        Tontine: "tontine",
        Evenement: "events",
        Mutuelle: "EpargneCredit",
        Projet: "project",
        Solidarite: "solidarity",
        Main_levee: "handSUp",
      };

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
              this.$t("Type"),
              this.$t("name"),
              this.$t("balance"),
              this.$t("debt"),
              this.$t("assets"),
              this.$t("interests"),
              this.$t("expectedPayment"),
              this.$t("expectedDisbursement"),
            ],
            body: this.$refs["activitiesTable"].queriedResults.map(
              (account) => [
                this.$t(types[account.type_activite]),
                account.nom_activite,
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

    let payload = {
      resourceUrl: "/api/association/" + this.currentAssociation.id + "/cycle",
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
          var cycleActif = functions.afficherCycleActif(cycle);
          //Assignation du cycle actigf à notre variable utilisée dans le template
          if (cycleActif != null) {
            if (cycleActif.ag.length > 0)
              this.prochaine_ag = functions.prochaineAg(cycleActif.ag);
          }
        }

        let payload = {
          resourceUrl:
            "/api/association/" + this.currentAssociation.id + "/operations",
          commitAction: "SET_OPERATIONS",
        };

        this.$store
          .dispatch("association/fetchFinances", payload)
          .then(() => {
            let payload = {
              resourceUrl:
                "/api/association/" + this.currentAssociation.id + "/membre",
              commitAction: "SET_MEMBERS",
            };

            this.$store
              .dispatch("association/fetchMembers", payload)
              .then((res) => {
                this.membre = extractMember(this.user, res.data.data);
                let payload = {
                  resourceUrl:
                    "/api/association/" +
                    this.currentAssociation.id +
                    "/membre/" +
                    this.membre.id,
                  commitAction: "SET_STATISTICS",
                };
                this.$store
                  .dispatch("association/fetchMemberActivities", payload)
                  .then(() => {
                    //Les differents comptes de l'utilisateur
                    let payload = {
                      resourceUrl: "/api/member/" + this.membre.id + "/comptes",
                      commitAction: "SET_USER_ACCOUNTS",
                    };

                    this.$store
                      .dispatch("association/fetchMemberActivities", payload)
                      .then((response) => {
                        var data = response.data.data;

                        data.forEach((element) => {
                          let statistique = element.statistique.data;
                          this.encaissement += statistique.encaissement;
                          this.decaissement += statistique.decaissement;
                          this.solde += statistique.solde;
                          this.avoir += statistique.avoirs;
                          this.dette +=
                            statistique.dettes_cotisations +
                            statistique.dettes_acquitements;
                          this.interet += statistique.interet;
                        });

                        EventBus.$emit("loader", false);
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
          })
          .catch((error) => {
            window.console.error(error);
          });
      })
      .catch((error) => {
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

/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user {
    position: relative;

    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }

    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 576px) {
    .decore-left,
    .decore-right {
      width: 140px;
    }
  }
}

.statistic-card h2 {
  /*  h2{ */
  margin-top: 0.5rem !important;
  margin-bottom: 1.25rem !important;
  /* } */
}

.product-name {
  max-width: 13rem;
}

/*! rtl:end:ignore */
</style>
