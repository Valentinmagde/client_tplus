<!-- =========================================================================================
  File Name: DashboardAnalytics.vue
  Description: Dashboard Analytics
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <!-- CARD 1: WELCOME -->
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <vx-card
          slot="no-body"
          class="text-center greet-user"
          style="min-height: 16.6rem; background: #ffaf43"
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
            v-if="association.logo"
            class="mb-2 inline-flex rounded-full text-white shadow img-logo"
            :src="association.logo"
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
            src="@/assets/images/pages/media.png"
            width="77"
            height="77"
          />

          <!-- <img :src="user.photo_profil" class="mb-8 bg-primary inline-flex rounded-full text-white shadow" width="63"> -->
          <h1 v-if="activeUserInfo.lastName" class="mb-3 text-white text-size">
            {{ $t("administratorDashboard") }}
          </h1>
          <p
            v-if="prochaine_ag"
            class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white"
          >
            {{ $t("theNextGeneralAssemblyIs") }}
            <strong
              class="cursor-pointer hover:underline"
              @click="handleSeance(prochaine_ag)"
            >
              {{ prochaine_ag.date_ag | dateTime }},
            </strong>
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
          :statistic="totalMontant.encaissements | formatMoney(devise)"
          :statisticTitle="$t('expectedPayment')"
          :statisticDetail="$t('detail')"
          :viewDetail="$t('viewDetails')"
          :paymentDetail="$t('saveAPayment')"
          :paymentTitle="$t('payment')"
          paymentlink="/association/administration/finances/payment"
          link="/association/administration/payments"
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
          :statistic="totalMontant.decaissements | formatMoney(devise)"
          :statisticDetail="$t('detail')"
          :viewDetail="$t('viewDetails')"
          :paymentDetail="$t('makeADisbursement')"
          :paymentTitle="$t('disbursement')"
          paymentlink="/association/administration/finances/withdrawal"
          link="/association/administration/disbursements"
          color="success"
        />
      </div>
    </div>

    <!-- Total en caisse -->
    <div class="flex wrap justify-end mb-5">
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
          {{ $t("generalTreasury") }}
        </span>
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
                @click="
                  $router
                    .push('/association/administration/finances/history')
                    .catch(() => {})
                "
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
                  :class="{ redtextclass: totalMontant.avoir < 0 }"
                >
                  {{ totalMontant.avoir | formatMoney(devise) }}
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
                  :class="{ redtextclass: totalMontant.solde < 0 }"
                >
                  {{ totalMontant.solde | formatMoney(devise) }}
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
                  :class="{ redtextclass: totalMontant.dettes < 0 }"
                >
                  {{ totalMontant.dettes | formatMoney(devise) }}
                </span>
              </li>

              <!-- Intérêts générés -->
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
                      border-3 border-solid border-blue
                    "
                  ></span>
                  <span>{{ $t("interestGenerated") }}</span>
                </span>
                <span
                  class="font-semibold"
                  :class="{ redtextclass: totalMontant.interet < 0 }"
                >
                  {{ totalMontant.interet | formatMoney(devise) }}
                </span>
              </li>

              <!-- Total caisse -->
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
                      border-3 border-solid border-blue
                    "
                  ></span>
                  <span>{{ $t("checkout_penalty") }}</span>
                </span>
                <span
                  class="font-semibold"
                  :class="{ redtextclass: totalCaisse < 0 }"
                >
                  {{ totalCaisse | formatMoney(devise) }}
                </span>
              </li>
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
                  <span>{{ $t("checkout_interet") }}</span>
                </span>
                <span
                  class="font-semibold"
                  :class="{ redtextclass: totalCaisse < 0 }"
                >
                  {{ totalCaisseInteret | formatMoney(devise) }}
                </span>
              </li>
            </ul>
          </div>
        </vx-card>
      </div>
    </div>

    <div class="vx-row">
      <!-- CARD 9: DISPATCHED ORDERS -->
      <div v-show="regroupeComptes.length > 0" class="vx-col w-full">
        <vx-card>
          <div slot="no-body" class="mt-4">
            <vs-table
              search
              ref="activitiesTable"
              :max-items="comptesData.length"
              :data="regroupeComptes"
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
                  <vs-td :data="data[indextr].interet" class="text-right">
                    <span
                      :class="{
                        redtextclass: data[indextr].statistique.interet < 0,
                      }"
                    >
                      {{
                        data[indextr].statistique.interet | formatMoney(devise)
                      }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].encaissement" class="text-right">
                    <span
                      :class="{
                        redtextclass:
                          data[indextr].statistique.encaissement < 0,
                      }"
                    >
                      {{
                        data[indextr].statistique.encaissement
                          | formatMoney(devise)
                      }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].decaissement" class="text-right">
                    <span
                      :class="{
                        redtextclass:
                          data[indextr].statistique.decaissement < 0,
                      }"
                    >
                      {{
                        data[indextr].statistique.decaissement
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

import { mapGetters } from "vuex";

import { extractMember } from "../../services/helpers.js";
//Fonctions
import functions from "../../services/functions";
import exports from "@/services/exports";
import { EventBus } from "@/services/EventBus.js";

export default {
  data() {
    return {
      association: "",
      user: null,
      devise: "",
      solde: 0,
      dette: 0,
      avoir: 0,
      interet: 0,
      decaissement: 0,
      encaissement: 0,
      caisse: 0,
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
      activeUser: "authentificated/getAuth",
      currentAssociation: "association/getCurrentAssociation",
    }),
    activeUserInfo() {
      return this.activeUser;
    },

    tresoreriesData() {
      return this.$store.state.association.tresoreries;
    },

    totalTresorerie() {
      let data = this.tresoreriesData;

      let sum = 0;

      if (data.length) {
        data.forEach((element) => {
          sum += element.tresorerie;
        });
      }

      return sum;
    },

    totalCaisse() {
      let data = this.tresoreriesData;

      let sum = 0;

      if (data.length) {
        data.forEach((element) => {
          sum += element.activite.penalite;
        });
      }

      return sum;
    },

    totalCaisseInteret() {
      let data = this.tresoreriesData;

      let sum = 0;

      if (data.length) {
        data.forEach((element) => {
          sum += element.activite.interet;
        });
      }

      return sum;
    },

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
      var association_courante = this.currentAssociation;
      var devise_association = association_courante.devise;

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
              transactions.push({
                date_realisation: operation.date_realisation,
                montant: operation.montant,
                debit_credit: operation.debit_credit,
                etat: operation.etat,
              });
            });
          }
        });
      }
      return transactions;
    },

    regroupeComptes() {
      //Exraction de noms des membres inscris et le nombre de part à partir des lots
      let comptes = this.$store.state.association.all_accounts
        ? this.$store.state.association.all_accounts
        : [];
      var comptes_tries = [];

      if (comptes.length > 0) {
        //Compter les noms en double dans le tableau membre et
        //les stokés dans le tableau membres_tries avec leurs occurrences
        for (let i = 0; i < comptes.length - 1; i++) {
          let solde = comptes[i].statistique.solde;
          let dettes = comptes[i].dette_a + comptes[i].dette_c;
          let avoir = comptes[i].statistique.avoirs;
          let interet = comptes[i].statistique.interet;
          let encaissements = comptes[i].statistique.encaissement;
          let decaissements = comptes[i].statistique.decaissement;

          for (let index = i + 1; index < comptes.length; index++) {
            if (comptes[i].activites_id == comptes[index].activites_id) {
              solde += comptes[index].statistique.solde;
              dettes += comptes[index].dette_a + comptes[index].dette_c;
              avoir += comptes[index].statistique.avoirs;
              interet += comptes[index].statistique.interet;
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
            comptes[i].solde = solde;
            comptes[i].statistique.dettes = dettes;
            comptes[i].dettes = dettes;
            comptes[i].statistique.avoirs = avoir;
            comptes[i].avoirs = avoir;
            comptes[i].statistique.interet = interet;
            comptes[i].interet = interet;
            comptes[i].statistique.encaissement = encaissements;
            comptes[i].encaissement = encaissements;
            comptes[i].statistique.decaissement = decaissements;
            comptes[i].decaissement = decaissements;

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
        interet: 0,
        encaissements: 0,
        decaissements: 0,
      };

      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          comptes.solde += data[i].statistique.solde;
          comptes.dettes += data[i].dette_a + data[i].dette_c;
          comptes.avoir += data[i].statistique.avoirs;
          comptes.interet += data[i].statistique.interet;
          comptes.encaissements += data[i].statistique.encaissement;
          comptes.decaissements += data[i].statistique.decaissement;
        }
      }
      return comptes;
    },

    comptesData() {
      if (this.$store.state.association.all_accounts != null)
        return this.$store.state.association.all_accounts;
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
      /* copyText.setSelectionRange(0, 99999) */
      document.execCommand("copy");
      document.body.removeChild(copyText);
    },

    // Initialise compte
    compteInitialise(solde, dettes, avoir, encaissement, decaissement) {
      this.solde += solde;
      this.dette += dettes;
      this.avoir += avoir;
      this.encaissement += encaissement;
      this.decaissement += decaissement;
    },
    handleSeance(ag) {
      this.$store.commit("association/SET_AG", ag);
      // localStorage.setItem('seance_courante', JSON.stringify(ag))
      EventBus.$emit("loader", true);
      this.$router
        .push(`/association/administration/sessions/${ag.id}`)
        .catch((error) => window.console.log(error));
    },

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
                  account.statistique.solde,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  account.statistique.dettes_acquitements +
                    account.statistique.dettes_cotisations,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  account.statistique.avoirs,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  account.statistique.interet,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  account.statistique.encaissement,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  account.statistique.decaissement,
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
    this.user = this.$store.state.authentificated.user;

    var association_courante = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl: "/api/association/" + association_courante.id + "/cycle",
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
            "/api/association/" + association_courante.id + "/operations",
          commitAction: "SET_OPERATIONS",
        };

        this.$store
          .dispatch("association/fetchFinances", payload)
          .then(() => {
            //Les differents comptes de l'utilisateur
            let payload = {
              resourceUrl:
                "/api/association/" + association_courante.id + "/comptes",
              commitAction: "SET_ALL_ACCOUNTS",
            };

            this.$store
              .dispatch("association/fetchMemberActivities", payload)
              .then(() => {
                let payload = {
                  resourceUrl:
                    "/api/association/" +
                    this.currentAssociation.id +
                    "/membre",
                  commitAction: "SET_MEMBERS",
                };

                this.$store
                  .dispatch("association/fetchMembers", payload)
                  .then((res) => {
                    this.membre = extractMember(this.user, res.data.data);
                    let payload = {
                      resourceUrl:
                        "api/association/" +
                        this.currentAssociation.id +
                        "/activites/tresorerie",
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
                  })
                  .catch((error) => {
                    EventBus.$emit("loader", false);
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

    //Devise de l'association
    this.devise = association_courante.devise;
    this.association = association_courante;
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
