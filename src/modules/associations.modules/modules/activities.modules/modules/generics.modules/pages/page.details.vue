<template>
  <div v-if="isReady" id="data-list-list-views" class="data-list-container">
    <!-- ACTION - DROPDOWN -->
    <action-button v-if="admin" :activity="activite_courante" />
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <vx-card class="mb-base">
        <h4 class="mb-2">
          {{ $t("ACtivityUpper") }} {{ activite_courante.nom | CAPITALIZE }}
        </h4>
        <p>{{ activite_courante.description }}</p>
        <p class="flex mt-4 justify-start">
          <span class="flex items-center">
            <span class="inline-block">{{ $t("creationDate") }}:</span>
            <span class="ml-1 font-semibold">{{
              activite_courante.date_created | dateTime
            }}</span>
          </span>
          <span
            v-if="activite_courante.taux_penalite != null"
            class="flex ml-5 mr-5 items-center"
          >
            <span class="font-semibold">|</span>
          </span>
          <span
            v-if="
              activite_courante.type_penalite == 'POURCENTAGE' &&
              activite_courante.taux_penalite != null
            "
            class="flex items-center"
          >
            <span class="inline-block">{{ $t("Penaltyrate") }}:</span>
            <span class="ml-1 font-semibold"
              >{{ activite_courante.taux_penalite }}%</span
            >
          </span>
          <span
            v-else-if="
              activite_courante.type_penalite == 'FORFAITAIRE' &&
              activite_courante.taux_penalite != null
            "
            class="flex items-center"
          >
            <span class="inline-block">{{ $t("Penaltyrate") }}:</span>
            <span
              class="ml-1 font-semibold"
              :class="{ redtextclass: activite_courante.taux_penalite < 0 }"
            >
              {{ activite_courante.taux_penalite | formatMoney(devise) }}
            </span>
          </span>
        </p>
      </vx-card>

      <!-- Total en caisse -->
      <div class="flex wrap justify-end mb-5">
        <div class="text-center mr-12">
          <span>
            <h2
              class="font-bold text-size"
              :class="{
                redtextclass:
                  solde_activite +
                    activite_courante.penalite +
                    activite_courante.interet <
                  0,
              }"
            >
              {{
                (solde_activite +
                  activite_courante.penalite +
                  activite_courante.interet)
                  | formatMoney(devise)
              }}
            </h2>
          </span>
          <span>
            {{ $t("cashTotal") }}
          </span>
        </div>
      </div>

      <div class="vx-row">
        <!-- SITUATION FINANCIERE -->
        <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3 mb-base">
          <vx-card :title="$t('financialSituation')">
            <div
              v-if="admin"
              class="absolute right-0 mr-4"
              style="margin-top: -3rem"
            >
              <vx-tooltip
                :text="$t('updateCheckout')"
                position="right"
                class="inline-block mr-4"
                @click.native="updateCheckout()"
              >
                <vs-icon
                  iconPack="streameline"
                  icon="icon-saving-piggy-coins-alternate"
                  class="text-lg cursor-pointer hover:text-success"
                />
              </vx-tooltip>
            </div>
            <ul>
              <!-- Avoirs -->
              <li class="flex -mt-4 mb-1 justify-between">
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
                <span :class="{ redtextclass: avoir_activite < 0 }">
                  {{ avoir_activite | formatMoney(devise) }}
                </span>
                <!-- <span v-if="!admin">{{ avoir_membre)}}</span> -->
              </li>

              <!-- Soldes -->
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
                      border-3 border-solid border-warning
                    "
                  ></span>
                  <span>{{ $t("balance") }}</span>
                </span>
                <span :class="{ redtextclass: solde_activite < 0 }">
                  {{ solde_activite | formatMoney(devise) }}
                </span>
                <!-- <span v-if="!admin">{{ solde_membre)}}</span> -->
              </li>

              <!-- Dettes -->
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
                      border-3 border-solid border-danger
                    "
                  ></span>
                  <span>{{ $t("debt") }}</span>
                </span>
                <span :class="{ redtextclass: dette_activite < 0 }">
                  {{ dette_activite | formatMoney(devise) }}
                </span>
                <!-- <span v-if="!admin">{{ formatMoney(dette_membre)}}</span> -->
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
                <span :class="{ redtextclass: interet_activite < 0 }">
                  {{ interet_activite | formatMoney(devise) }}
                </span>
                <!-- <span v-if="!admin">{{ formatMoney(dette_membre)}}</span> -->
              </li>

              <!-- Caisse -->
              <li class="flex justify-between">
                <span class="flex items-center">
                  <span
                    class="
                      inline-block
                      h-4
                      w-4
                      rounded-full
                      mr-2
                      bg-white
                      border-3 border-solid
                    "
                  ></span>
                  <span>{{ $t("checkout_penalty") }}</span>
                </span>
                <span :class="{ redtextclass: activite_courante.penalite < 0 }">
                  {{ activite_courante.penalite | formatMoney(devise) }}
                </span>
              </li>
              <li class="flex justify-between">
                <span class="flex items-center">
                  <span
                    class="
                      inline-block
                      h-4
                      w-4
                      rounded-full
                      mr-2
                      bg-white
                      border-3 border-solid
                    "
                  ></span>
                  <span>{{ $t("checkout_interet") }}</span>
                </span>
                <span :class="{ redtextclass: activite_courante.interet < 0 }">
                  {{ activite_courante.interet | formatMoney(devise) }}
                </span>
              </li>
            </ul>
          </vx-card>
        </div>
        <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3 mb-base">
          <statistics-card-line
            hideChart
            class="pb-4"
            :paymentTitle="$t('saveAPayment')"
            :admin="admin"
            :paymentlink="
              admin
                ? '/association/administration/finances/payment'
                : '/association/finances/payment'
            "
            icon="cash-payment-coin-1"
            :statistic="versement_activite | formatMoney(devise)"
            :statisticTitle="$t('expectedPayment')"
            color="warning"
          />
        </div>

        <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3 mb-base">
          <statistics-card-line
            hideChart
            class="pb-4"
            icon="cash-payment-coin"
            :admin="admin"
            :paymentlink="
              admin ? '/association/administration/finances/withdrawal' : ''
            "
            :statisticTitle="$t('expectedDisbursement')"
            :statistic="decaissement_activite | formatMoney(devise)"
            :paymentTitle="$t('makeADisbursement')"
            color="success"
          />
        </div>
      </div>

      <!-- LISTE DES TRANSACTIONS DU MEMBRE -->
      <div v-if="!admin && visibilite == 'OUVERT'" class="vx-row">
        <div
          v-if="transactions_membre.length > 0"
          class="vx-col w-full mb-base"
        >
          <vx-card>
            <div class="flex flex-row justify-between">
              <h5>{{ $t("transactions") }}</h5>
              <div class="flex flex-row justify-around">
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
                    <vs-dropdown-item @click.native="transactionsExport('pdf')"
                      >PDF</vs-dropdown-item
                    >
                    <vs-dropdown-item @click.native="transactionsExport('csv')"
                      >CSV</vs-dropdown-item
                    >
                    <vs-dropdown-item
                      @click.native="transactionsExport('excel')"
                      >EXCEL</vs-dropdown-item
                    >
                  </vs-dropdown-menu>
                </vs-dropdown>
              </div>
            </div>
            <div class="overflow-auto" style="max-height: 16.5rem">
              <table class="mt-4 w-full table-auto border-collapse z-10">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-base th-bg">#</th>
                    <th class="px-4 py-2 text-base th-bg">
                      {{ $t("creationDate") | CAPITALIZE }}
                    </th>
                    <th class="px-4 py-2 th-bg">
                      {{ $t("debitCredit") | CAPITALIZE }}
                    </th>
                    <th class="px-4 py-2 th-bg">
                      {{ $t("Amount") | CAPITALIZE }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr :key="ind" v-for="(tr, ind) in transactions_membre">
                    <td class="px-4 py-2 mr-0">
                      {{ ind + 1 }}
                    </td>

                    <td class="px-4 py-2 mr-0">
                      <p class="product-name font-medium truncate">
                        {{ tr.date_created | dateTime }}
                      </p>
                    </td>

                    <td>
                      <p class="product-name">
                        <feather-icon
                          v-if="tr.debit_credit == 'debit'"
                          icon="ArrowRightCircleIcon"
                          svgClasses="w-5 h-5 text-danger stroke-current"
                        />
                        <feather-icon
                          v-if="tr.debit_credit == 'credit'"
                          icon="ArrowRightCircleIcon"
                          svgClasses="w-5 h-5 text-success stroke-current"
                        />
                      </p>
                    </td>

                    <td class="px-4 py-2 mr-0">
                      <p
                        class="product-name font-medium truncate"
                        :class="{ redtextclass: tr.montant < 0 }"
                      >
                        {{ tr.montant | formatMoney(devise) }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </vx-card>
        </div>
      </div>

      <div v-if="admin || visibilite == 'OUVERT'" class="vx-row">
        <!-- CARD 9: DISPATCHED ORDERS -->
        <div v-if="comptesData.length" class="vx-col w-full">
          <vx-card :title="admin ? $t('registeredMembers') : ''">
            <div slot="no-body" class="mt-4">
              <div
                v-if="admin"
                class="float-right mr-4"
                style="margin-top: -2.5rem"
              >
                <vx-tooltip
                  :text="$t('updatingBalances')"
                  position="right"
                  class="inline-block mr-4"
                  @click.native="updateBalances()"
                >
                  <vs-icon
                    iconPack="streameline"
                    icon="icon-check-payment-sign"
                    class="text-lg cursor-pointer hover:text-success"
                  />
                </vx-tooltip>

                <vx-tooltip
                  :text="$t('addMembers')"
                  position="right"
                  class="inline-block"
                  @click.native="
                    $router.push(
                      `/association/administration/activities/${activite_courante.id}/add-accounts`
                    )
                  "
                >
                  <vs-icon
                    iconPack="streameline"
                    icon="icon-single-neutral-actions-add"
                    class="text-lg cursor-pointer hover:text-success"
                  />
                </vx-tooltip>
              </div>
              <vs-table
                search
                :data="comptesData"
                :max-items="comptesData.length"
                ref="accountsTable"
                class="table-dark-inverted overflow-auto"
                style="max-height: 25rem"
              >
                <div
                  :class="`w-full flex flex-row justify-${
                    admin ? 'end' : 'between'
                  }`"
                  slot="header"
                >
                  <h4 v-if="!admin" class="ml-6">
                    {{ $t("registeredMembers") }}
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
                      <vs-dropdown-item @click.native="accountsExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="accountsExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="accountsExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th sort-key="membre">{{ $t("name") | CAPITALIZE }}</vs-th>
                  <vs-th :sort-key="'nombre_noms'">
                    <span class="text-right w-full">{{
                      $t("numberOfNames") | CAPITALIZE
                    }}</span></vs-th
                  >
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
                    @click.native="redirectTransactions(tr)"
                  >
                    <vs-td :data="data[indextr].membre">
                      <p class="product-name truncate">
                        {{ data[indextr].membre }}
                      </p>
                    </vs-td>

                    <vs-td
                      :data="data[indextr].nombre_noms"
                      class="text-center"
                    >
                      <p class="product-name">
                        {{ data[indextr].nombre_noms }}
                      </p>
                    </vs-td>

                    <vs-td :data="data[indextr].solde" class="text-right">
                      <span
                        :class="{
                          redtextclass: data[indextr].statistiques.solde < 0,
                        }"
                      >
                        {{
                          data[indextr].statistiques.solde | formatMoney(devise)
                        }}
                      </span>
                    </vs-td>
                    <vs-td :data="data[indextr].dettes" class="text-right">
                      <span
                        :class="{
                          redtextclass:
                            data[indextr].dette_c +
                              data[indextr].dette_ai +
                              data[indextr].dette_ap <
                            0,
                        }"
                      >
                        {{
                          (data[indextr].dette_c +
                            data[indextr].dette_ai +
                            data[indextr].dette_ap)
                            | formatMoney(devise)
                        }}
                      </span>
                    </vs-td>
                    <vs-td :data="data[indextr].avoirs" class="text-right">
                      <span :class="{ redtextclass: data[indextr].avoir < 0 }">
                        {{ data[indextr].avoir | formatMoney(devise) }}
                      </span>
                    </vs-td>
                    <vs-td :data="data[indextr].interet" class="text-right">
                      <span
                        :class="{ redtextclass: data[indextr].interet < 0 }"
                      >
                        {{ data[indextr].interet | formatMoney(devise) }}
                      </span>
                    </vs-td>
                    <vs-td
                      :data="data[indextr].encaissement"
                      class="text-right"
                    >
                      <span
                        :class="{
                          redtextclass:
                            data[indextr].statistiques.encaissement < 0,
                        }"
                      >
                        {{
                          data[indextr].statistiques.encaissement
                            | formatMoney(devise)
                        }}
                      </span>
                    </vs-td>
                    <vs-td
                      :data="data[indextr].decaissement"
                      class="text-right"
                    >
                      <span
                        :class="{
                          redtextclass:
                            data[indextr].statistiques.decaissement < 0,
                        }"
                      >
                        {{
                          data[indextr].statistiques.decaissement
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

      <div v-if="!admin && visibilite == 'RESTREINT'" class="vx-row">
        <div class="vx-col md:w-1/2 w-full mb-base">
          <vx-card>
            <h5>{{ $t("registeredMembers") }}</h5>
            <!-- Afficher ce tableau pour un admin ou à tout membre lorsque la
                        visibilité financière de l'association est ouverte -->
            <div class="overflow-auto" style="height: 16.5rem">
              <table class="mt-4 w-full table-auto border-collapse z-10">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-base th-bg">#</th>
                    <th class="px-4 py-2 th-bg">
                      {{ $t("members") | CAPITALIZE }}
                    </th>
                    <th class="px-4 py-2 th-bg">
                      {{ $t("numberOfNames") | CAPITALIZE }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr :key="ind" v-for="(tr, ind) in comptesData">
                    <td class="px-4 py-2 mr-0">
                      {{ ind + 1 }}
                    </td>
                    <td class="px-4 py-2 mr-0">
                      <p class="product-name font-medium truncate">
                        {{ tr.membre }}
                      </p>
                    </td>
                    <td class="text-center">
                      <p class="product-name font-medium truncate">
                        {{ tr.nombre_noms }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </vx-card>
        </div>
        <div class="vx-col md:w-1/2 w-full mb-base">
          <vx-card>
            <h5>{{ $t("transactions") }}</h5>
            <!-- Afficher ce tableau pour un admin ou à tout membre lorsque la
                        visibilité financière de l'association est ouverte -->
            <div v-if="transactions_membre.length == 0" style="height: 16.5rem">
              <p class="flex pt-16 justify-center">
                {{ $t("noElementFound") }}
              </p>
            </div>
            <div
              v-if="transactions_membre.length > 0"
              class="overflow-auto"
              style="height: 16.5rem"
            >
              <table class="mt-4 w-full table-auto border-collapse z-10">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-base th-bg">#</th>
                    <th class="px-4 py-2 text-base th-bg">
                      {{ $t("date") | CAPITALIZE }}
                    </th>
                    <th class="px-4 py-2 th-bg">
                      {{ $t("Amount") | CAPITALIZE }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr :key="ind" v-for="(tr, ind) in transactions_membre">
                    <td class="px-4 py-2 mr-0">
                      {{ ind + 1 }}
                    </td>

                    <td class="px-4 py-2 mr-0">
                      <p class="product-name font-medium truncate">
                        {{ tr.date_created | dateTime }}
                      </p>
                    </td>

                    <td class="px-4 py-2 mr-0">
                      <p
                        class="product-name font-medium truncate"
                        :class="{ redtextclass: tr.montant < 0 }"
                      >
                        {{ tr.montant | formatMoney(devise) }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Component
import ActionButton from "../components/ActionButton.component.vue";

//Store
import { mapGetters } from "vuex";
import checkIfAdmin from "../../../../../mixins/checkRole";
import checkActivityType from "../../../mixins/checkActivityType";

//Functions
import { EventBus } from "@/services/EventBus.js";
import exports from "@/services/exports";

export default {
  mixins: [checkIfAdmin, checkActivityType],
  data() {
    return {
      solde_activite: 0,
      dette_activite: 0,
      avoir_activite: 0,
      interet_activite: 0,
      versement_activite: 0,
      decaissement_activite: 0,
      solde_membre: 0,
      dette_membre: 0,
      avoir_membre: 0,
      versement_membre: 0,
      decaissement_membre: 0,
      activite_courante: [],
      membres_incris: [],
      devise: "",
      details: true,
      contribution: false,
      visibilite: "",
      membre_id: null,
      transactions_membre: [],

      // Is data fetched already ?
      isReady: false,
    };
  },
  components: {
    ActionButton,
  },
  computed: {
    admin() {
      return this.isSuperAdministrator;
    },
    ...mapGetters({
      activeUser: "authentificated/getAuth",
      currentAssociation: "association/getCurrentAssociation",
    }),

    comptesData() {
      if (this.$store.state.association.accounts) {
        let accounts = this.$store.state.association.accounts;
        return accounts
          .sort((a, b) => (a.membre > b.membre ? 1 : -1))
          .map((account) => ({
            ...account,
            solde: account.statistiques.solde,
            dettes:
              account.statistiques.dettes_acquitements +
              account.statistiques.dettes_cotisations,
            avoirs: account.statistiques.avoirs,
            interet: account.statistiques.interet,
            encaissement: account.statistiques.encaissement,
            decaissement: account.statistiques.decaissement,
          }));
      } else return [];
    },

    memberStatistics() {
      if (this.$store.state.association.statistics != null)
        return this.$store.state.association.statistics;
      else return [];
    },

    queriedAccounts() {
      if (this.$refs['accountsTable'])
        return this.$refs['accountsTable'].queriedResults;

      return this.comptesData;
    }
  },
  methods: {
    // Redirect to checkout update
    updateCheckout() {
      this.$router.push(
        `/association/administration/activities/update-checkout/${this.$store.state.association.activite.id}`
      );
    },
    // Redirect to balances update
    updateBalances() {
      localStorage.setItem(
        "activity_id",
        JSON.stringify(this.$store.state.association.activite.id)
      );
      this.$router.push({
        name: "association:administration:activities:update-accounts",
      });
    },

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
      return transactions;
    },
    //Redirige vers la pages des transactions
    redirectTransactions(account) {
      let transactions = this.getTransactions(account);

      // Persistent storage of the member and the current activity, so the transactions could be reloaded if necessary
      localStorage.setItem("member_id", JSON.stringify(account.membres_id));
      this.$store.commit("association/SET_ACCOUNT", account);

      localStorage.setItem("activity_id", JSON.stringify(account.activites_id));

      this.$store.commit("association/SET_TRANSACTIONS", transactions);

      if (this.admin)
        this.$router.push(
          "/association/administration/activities/generic/member-transactions"
        );
      else
        this.$router.push(
          "/association/activities/generic/member-transactions"
        );
    },

    getAccounts(activity_id) {
      let payload = {
        resourceUrl: "/api/activite/" + activity_id + "/comptes/all",
        commitAction: "SET_ACCOUNTS",
      };

      this.$store
        .dispatch("association/fetchComptemembreActivite", payload)
        .then((res) => {
          let comptes = res.data.data;

          this.membres_incris = comptes;
          comptes.forEach((element) => {
            this.solde_activite += element.statistiques.solde;
            this.dette_activite +=
              element.statistiques.dettes_cotisations +
              element.statistiques.dettes_acquitements;
            this.avoir_activite += element.statistiques.avoirs;
            this.versement_activite += element.statistiques.encaissement;
            this.decaissement_activite += element.statistiques.decaissement;
            this.interet_activite += element.statistiques.interet;

            if (element.membres_id == this.membre_id) {
              this.transactions_membre = element.transactions.filter(
                (transaction) => transaction.etat !== "REJETE"
              );
              this.solde_membre += element.statistiques.solde;
              this.dette_membre +=
                element.statistiques.dettes_cotisations +
                element.statistiques.dettes_acquitements;
              this.avoir_membre += element.statistiques.avoirs;
            }
          });
        })
        .then(() => {
          this.isReady = true;
          EventBus.$emit("loader", false);
        })
        .catch((error) => {
          this.isReady = true;
          window.console.error(error);
        });
    },
    /*
     *@param members
     *@return id  //retourne l'id membre de l'utilisateur connecté
     */
    extractMember(members) {
      var user = this.activeUser;
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

    accountsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${
        this.activite_courante.nom
      } - ${this.$t("registeredMembers")}`;

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
            body: this.queriedAccounts.map((account) => [
              account.membre,
              account.nombre_noms,
              this.$options.filters.formatMoney(
                account.statistiques.solde,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistiques.dettes_acquitements +
                  account.statistiques.dettes_cotisations,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistiques.avoirs,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistiques.interet,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistiques.encaissement,
                this.currentAssociation.devise
              ),
              this.$options.filters.formatMoney(
                account.statistiques.decaissement,
                this.currentAssociation.devise
              ),
            ]),
          },
          title
        );
      }
    },

    transactionsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${
        this.activite_courante.nom
      } - ${this.$t("transactions")}`;
      const aggregates = {};
      aggregates[this.$t("member")] = this.membres_incris.find(
        (member) => member.membres_id === this.membre_id
      ).membre;

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
              "#",
              this.$t("creationDate"),
              this.$t("debitCredit"),
              this.$t("Amount"),
            ],
            body: this.transactions_membre.map((transaction, index) => [
              String(index + 1),
              this.$d(transaction.date_created * 1000),
              transaction.debit_credit,
              this.$options.filters.formatMoney(
                transaction.montant,
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

    var association_courante =
      this.$store.getters["association/getCurrentAssociation"];
    this.devise = association_courante.devise;
    /* Visibilité de l'association courante */
    this.visibilite = association_courante.visibilite_financiere;

    let activityExists = this.$store.state.association.activite != "";
    let activity_id = activityExists
      ? this.$store.state.association.activite.id
      : localStorage.getItem("activity_id");

    let payload = {
      resourceUrl:
        "api/association/" +
        association_courante.id +
        "/activite/" +
        activity_id,
      commitAction: "SET_ACTIVITE",
    };

    this.$store
      .dispatch("association/fetchAssociationactivite", payload)
      .then((res) => {
        this.checkActivityType(res.data.data);
        this.activite_courante = res.data.data;
      })
      .catch((error) => {
        window.console.log(error);
      });

    let payload_ = {
      resourceUrl: "/api/association/" + association_courante.id + "/membre",
      commitAction: "SET_MEMBERS",
    };

    this.$store
      .dispatch("association/fetchMembers", payload_)
      .then((res) => {
        this.membre_id = this.extractMember(res.data.data);
        let payload = {
          resourceUrl:
            "/api/association/" +
            association_courante.id +
            "/membre/" +
            this.membre_id,
          commitAction: "SET_STATISTICS",
        };
        this.$store
          .dispatch("association/fetchMemberActivities", payload)
          .then(() => {
            // Fetch member accounts
            this.getAccounts(activity_id);
          })
          .catch((error) => {
            window.console.log(error);
          });
      })
      .catch((error) => {
        window.console.log(error);
      });
  },

  beforeDestroy() {
    this.$store.state.association.accounts = [];
  },
};
</script>

<style lang="scss">
.customer-align .vs-table-text {
  text-align: right;
  display: block;
}

table {
  background: #f8f8f8;
  border: 2px solid #f8f8f8;

  .th-bg {
    background-color: #fff;
  }

  tr:nth-child(even) {
    background-color: #fff;
  }
}

.product-name {
  max-width: 13rem;
}
</style>
