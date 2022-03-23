<template>
  <div>
    <action-button />

    <!-- Popup pour supprimer un bon -->
    <vs-popup
      classContent="popup-example"
      :title="$t('deleteConfirmTitle')"
      :active.sync="popupVoucherDeletion"
    >
      <p>{{ $t("deleteConfirm") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button
          color="warning"
          @click="popupVoucherDeletion = false"
          type="border"
        >
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;

        <vs-button
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading"
          @click.stop="deleteVoucher(selectedVoucher)"
        >
          {{ $t("delete") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour valider un bon -->
    <vs-popup
      classContent="popup-example"
      :title="$t('validateConfirmTitle')"
      :active.sync="popupVoucherValidation"
    >
      <p>{{ $t("validateConfirm") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button
          color="warning"
          @click="popupVoucherValidation = false"
          type="border"
        >
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;

        <vs-button
          class="ml-3 vs-con-loading__container"
          color="success"
          ref="loadableButton"
          id="button-with-loading"
          @click.stop="validateVoucher(selectedVoucher)"
        >
          {{ $t("Validate") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour valider un bon -->
    <vs-popup
      classContent="popup-example"
      :title="$t('validateConfirmTitle')"
      :active.sync="popupVoucherInvalidation"
    >
      <p>{{ $t("validateConfirm") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button
          color="warning"
          @click="popupVoucherInvalidation = false"
          type="border"
        >
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;

        <vs-button
          class="ml-3 vs-con-loading__container"
          color="success"
          ref="loadableButton"
          id="button-with-loading"
          @click.stop="unvalidateVoucher(selectedVoucher)"
        >
          {{ $t("Invalidate") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- <Data-view-sidebar
      :isSidebarActive="isSidebarActive"
      @closeSidebar="isSidebarActive = false"
      :etat="sidebarName"
      :data="sidebarData"
    /> -->

    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />

    <div class="pt-16">
      <div>
        <vx-card class="mb-base">
          <h5>
            {{ $t("exitVouchers") | CAPITALIZE }} -
            {{ $t("allMoneyWidthdrawalPlans") | CAPITALIZE }}
          </h5>
          <p v-if="showOnlyValidated" class="mt-2 text-muted">
            {{ $t("listOfAllValidExitVouchers") }}.
          </p>
          <p v-else class="mt-2 text-muted">
            {{ $t("listOfAllPendingExitVouchers") }}.
          </p>
        </vx-card>
      </div>

      <div class="vx-row flex flex-wrapper mt-5">
        <div class="vx-col sm:w-1/2 md:w-1/3 lg:w-1/4 mb-5">
          <div class="flex justify-center">
            <span class="inline-block">
              <vs-switch v-model="showOnlyForMe" />
            </span>
            <span class="inline-block ml-2 font-bold">
              {{ $t("myExitVouchers") }}
            </span>
          </div>
        </div>
        <div class="vx-col sm:w-1/2 md:w-1/3 lg:w-1/4 mb-5 flex justify-center">
          <span class="inline-block">
            <vs-switch v-model="showOnlyForCurrentPeriod" />
          </span>
          <span class="inline-block ml-2 font-bold">
            {{ $t("currentPeriod") }}
          </span>
        </div>
        <div class="vx-col sm:w-1/2 md:w-1/3 lg:w-1/4 mb-5 flex justify-center">
          <span class="inline-block">
            <vs-switch
              v-model="showOnlyValidated"
              @change="showOnlyValidatedVouchers()"
            />
          </span>
          <span class="inline-block ml-2 font-bold">
            {{ $t("validatedVouchers") }}
          </span>
        </div>
        <div class="vx-col w-full lg:w-1/4 mb-5">
          <span class="flex w-full justify-end">
            <h2
              class="font-bold text-2xl"
              :class="{ redtextclass: totalDisbursements < 0 }"
            >
              {{ totalDisbursements | formatMoney(devise) }}
            </h2>
          </span>
          <span class="flex justify-end">
            {{ $t("totalDisbursement") }}
          </span>
        </div>
        <div class="vx-col w-full flex justify-start">
          <div
            class="
              btn-add-new
              p-3
              mb-4
              mr-4
              rounded-lg
              cursor-pointer
              flex
              items-center
              justify-center
              font-medium
              text-base text-primary
              border border-solid border-primary
            "
            @click="
              $router
                .push('/association/administration/finances/new-voucher')
                .catch(() => {})
            "
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">{{ $t("AddNew") }}</span>
          </div>
        </div>
      </div>
      <vx-card v-if="exitVouchers.length == 0">
        <p>{{ $t("noElementFound") }}</p>
      </vx-card>
      <div class="vx-row">
        <div v-show="exitVouchers.length > 0" class="vx-col w-full">
          <vx-card>
            <div slot="no-body" class="mt-4">
              <vs-table
                ref="vouchersTable"
                :data="exitVouchers"
                :max-items="exitVouchers.length"
                search
                style="max-height: 26rem; overflow: auto;"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t("exitVouchers") | CAPITALIZE }}
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
                      <vs-dropdown-item @click.native="vouchersExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="vouchersExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="vouchersExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>

                <template slot="thead">
                  <vs-th sort-key="membre">{{
                    $t("members") | CAPITALIZE
                  }}</vs-th>
                  <!-- <vs-th sort-key="debit_credit">{{$t('paymentDisbursement') | CAPITALIZE }}</vs-th> -->
                  <vs-th sort-key="libelle">{{
                    $t("wording") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="formattedLimitDate"
                    ><span class="text-right w-full">{{
                      $t("limitDate") | CAPITALIZE
                    }}</span></vs-th
                  >
                  <vs-th sort-key="formattedAmount"
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
                  <vs-tr :key="indextr" v-for="(echeance, indextr) in data">
                    <vs-td>
                      <p class="product-name font-medium truncate">
                        {{ data[indextr].membre }}
                      </p>
                    </vs-td>
                    <vs-td>
                      <p class="flex">
                        <feather-icon
                          v-if="
                            data[indextr].debit_credit == 'cotisation' ||
                            data[indextr].debit_credit == 'acquitement'
                          "
                          icon="ArrowDownCircleIcon"
                          svgClasses="w-5 h-5 text-success stroke-current"
                        />
                        <feather-icon
                          v-if="data[indextr].debit_credit == 'decaissement'"
                          icon="ArrowUpCircleIcon"
                          svgClasses="w-5 h-5 text-danger stroke-current"
                        />
                        <span class="ml-2"> {{ data[indextr].libelle }} </span>
                      </p>
                    </vs-td>
                    <vs-td class="text-right">
                      <span
                        v-if="data[indextr].formattedLimitDate == 0"
                        class="product-name"
                      >
                        {{ $t("nextCycle") }}
                      </span>
                      <span v-else class="product-name">
                        {{ data[indextr].formattedLimitDate }}
                      </span>
                    </vs-td>

                    <vs-td
                      class="text-right"
                      :class="{ redtextclass: data[indextr].formattedAmount < 0 }"
                    >
                      {{ data[indextr].formattedAmount }}
                    </vs-td>

                    <vs-td class="whitespace-no-wrap text-right">
                      <!-- ACTIVER UN BON DE SORTIE -->
                      <vx-tooltip
                        v-if="
                          isPresident &&
                          data[indextr].etat == 'init' &&
                          !data[indextr].validation
                        "
                        :text="$t('Validate')"
                        position="bottom"
                        class="inline-block"
                      >
                        <feather-icon
                          icon="CheckCircleIcon"
                          svgClasses="w-5 mr-1 h-5 hover:text-success stroke-current"
                          @click="
                            popupVoucherValidation = true;
                            selectedVoucher = data[indextr].id;
                          "
                        />
                      </vx-tooltip>

                      <!-- INVALIDER UN BON DE SORTIE -->
                      <vx-tooltip
                        v-if="
                          isPresident &&
                          data[indextr].etat == 'init' &&
                          data[indextr].validation
                        "
                        :text="$t('Invalidate')"
                        position="bottom"
                        class="inline-block"
                      >
                        <feather-icon
                          icon="XCircleIcon"
                          svgClasses="w-5 mr-1 h-5 hover:text-warning stroke-current"
                          @click="
                            popupVoucherInvalidation = true;
                            selectedVoucher = data[indextr].id;
                          "
                        />
                      </vx-tooltip>

                      <!-- SUPPRIMER UN BON DE SORTIE -->
                      <vx-tooltip
                        :text="$t('cancelTheOperation')"
                        position="bottom"
                        class="inline-block"
                      >
                        <feather-icon
                          icon="TrashIcon"
                          svgClasses="w-5 h-5 hover:text-danger stroke-current"
                          @click="
                            popupVoucherDeletion = true;
                            selectedVoucher = data[indextr].id;
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
// Action Button
import ActionButton from "../../components/administration/ActionButton.component";

// Sidebar for voucher creation
import DataViewSidebar from "../../../../components/sidebar/DataViewSidebar.component";

// Getters
import { mapGetters } from "vuex";

// Envent bus
import { EventBus } from "@/services/EventBus.js";

// Functions for CSV, Excel and PDF export
import exports from "@/services/exports";

// Some fuuctions to manage ags
import ags_functions from "../../../../services/functions.js";

// To check roles
import checkIfAdmin from "../../../../mixins/checkRole";

export default {
  mixins: [checkIfAdmin],

  components: {
    DataViewSidebar,
    ActionButton,
  },

  data() {
    return {
      // isSidebarActive: false,
      // sidebarData: { ags: [] },
      // sidebarName: "NewExitVoucher",
      showOnlyForMe: false,
      showOnlyForCurrentPeriod: false,
      showOnlyValidated: false,
      popupVoucherDeletion: false,
      popupVoucherValidation: false,
      popupVoucherInvalidation: false,
      selectedVoucher: -1,

      // Auth member_id
      member_id: 0,

      // Next ag
      nextAg: {},
    };
  },

  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
      getExitVouchers: "association/getExitVouchers",
      getMembers: "association/getMembers",
      getCycles: "association/getCycles",
      auth: "authentificated/getAuth",
    }),
    devise() {
      return this.currentAssociation.devise;
    },
    totalDisbursements() {
      let sum = 0;
      this.queriedVouchers.forEach((voucher) => (sum += voucher.montant));
      return sum;
    },
    exitVouchers() {
      let exitVouchers = this.getExitVouchers.map((voucher) => {
        let formattedVersion = { ...voucher };
        // Pre-format dates and amounts to increase the search engine performance
        formattedVersion.formattedLimitDate = this.$options.filters.dateTime(
          voucher.date_limite
        );
        formattedVersion.formattedAmount = this.$options.filters.formatMoney(
          voucher.montant,
          this.devise
        );

        return formattedVersion;
      });

      // Filter for authenticated user member account
      if (this.showOnlyForMe)
        exitVouchers = exitVouchers.filter(
          (voucher) => voucher.membres_id == this.member_id
        );

      // Filter to show only vouchers for the current period
      if (this.showOnlyForCurrentPeriod)
        exitVouchers = exitVouchers.filter(
          (voucher) =>
            voucher.formattedLimitDate ==
              this.$options.filters.dateTime(this.nextAg.date_ag) &&
            voucher.etat !== "cloture"
        );

      return exitVouchers;
    },
    queriedVouchers() {
      if (this.$refs['vouchersTable'])
        return this.$refs['vouchersTable'].queriedResults;

      return this.exitVouchers;
    }
  },

  methods: {
    vouchersExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t(
        "exitVouchers"
      )}`;
      const aggregates = {};
      aggregates[this.$t("totalDisbursement")] =
        this.$options.filters.formatMoney(this.totalDisbursements, this.devise);

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
              this.$t("limitDate"),
              this.$t("Amount"),
            ],
            body: this.queriedVouchers.map(
              (settlement) => [
                settlement.membre,
                settlement.libelle,
                this.$d(
                  settlement.date_limite * 1000
                ),
                settlement.formattedAmount,
              ]
            ),
          },
          title
        );
      }
    },

    // Show only validate vouchers so the president can unvalidate some
    async showOnlyValidatedVouchers() {
      EventBus.$emit("loader", true);
      try {
        // Fetch validated vouchers this time
        await this.$store.dispatch("association/fetchExitVouchers", {
          association_id: this.currentAssociation.id,
          state: Number(this.showOnlyValidated), // Pending exit vouchers
        });
      } catch (error) {
        this.$vs.notify({
          position: "top-center",
          text: error,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger",
        });
      }
      EventBus.$emit("loader", false);
    },

    // Validate an exit voucher
    async validateVoucher(voucher_id) {
      try {
        // Check again because we're never sure enough
        if (
          !this.hasRole("Président") &&
          !this.currentAssociation.validation_automatique
        )
          return;

        let voucher = this.getExitVouchers.find(
          (voucher) => voucher.id === voucher_id
        );

        // Asks the server to validate the voucher
        await this.$store.dispatch("association/getRequestUpdated", {
          resourceUrl: `/api/member/${voucher.membres_id}/compte/${voucher.comptes_id}/bon/sortie/${voucher.id}/validate`, // This is a real mess from the server. Activity id route param has no importance here
          commitAction: "NO_COMMIT",
        });

        this.popupVoucherValidation = false;
        this.$vs.notify({
          position: "top-center",
          text: this.$t("validatedVouchers"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "success",
        });

        // Fetch them again
        await this.$store.dispatch("association/fetchExitVouchers", {
          association_id: this.currentAssociation.id,
          state: 0, // Pending exit vouchers
        });

        this.$router.push("/association/administration/finances/exit-vouchers");
      } catch (error) {
        this.$vs.notify({
          position: "top-center",
          text: error,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger",
        });
      }
    },

    // Unvalidate an exit voucher
    async unvalidateVoucher(voucher_id) {
      try {
        // Check again because we're never sure enough
        if (
          !this.hasRole("Président") &&
          !this.currentAssociation.validation_automatique
        )
          return;

        let voucher = this.getExitVouchers.find(
          (voucher) => voucher.id === voucher_id
        );

        // Asks the server to validate the voucher
        await this.$store.dispatch("association/getRequestUpdated", {
          resourceUrl: `/api/member/${voucher.membres_id}/compte/${voucher.comptes_id}/bon/sortie/${voucher.id}/unvalidate`, // This is a real mess from the server. Activity id route param has no importance here
          commitAction: "NO_COMMIT",
        });

        this.popupVoucherInvalidation = false;
        this.$vs.notify({
          position: "top-center",
          text: this.$t("unvalidatedVouchers"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "success",
        });

        // Fetch them again
        await this.$store.dispatch("association/fetchExitVouchers", {
          association_id: this.currentAssociation.id,
          state: 1, // Valid exit vouchers
        });
      } catch (error) {
        this.$vs.notify({
          position: "top-center",
          text: error,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger",
        });
      }
    },

    // Delete an exit voucher
    async deleteVoucher(voucher_id) {
      try {
        // Asks the server to delete the voucher
        await this.$store.dispatch("association/removeRecord", {
          // This is a real mess from the server. Activity id route param has no importance here
          // So I pass 0 for the db not to be affected by side effects
          resourceUrl: `/api/activite/0/echeancier/${voucher_id}`,
          commitAction: "NO_COMMIT",
        });

        this.popupVoucherDeletion = false;
        this.$vs.notify({
          position: "top-center",
          text: this.$t("settlementDelete"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "success",
        });

        // Fetch them again
        await this.$store.dispatch("association/fetchExitVouchers", {
          association_id: this.currentAssociation.id,
          state: 0, // Pending exit vouchers
        });
      } catch (error) {
        this.$vs.notify({
          position: "top-center",
          text: error,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger",
        });
      }
    },
  },

  async created() {
    EventBus.$emit("loader", true);
    // Things to fetch

    // Get association members and extract the auth member account id
    await this.$store.dispatch("association/fetchMembers", {
      resourceUrl: `/api/association/${this.currentAssociation.id}/membre`,
      commitAction: "SET_MEMBERS",
    });

    this.member_id = this.getMembers.find(
      (member) => member.users.findIndex((user) => user.id == this.auth.id) > -1
    ).id;

    // Get pending vouchers
    await this.$store.dispatch("association/fetchExitVouchers", {
      association_id: this.currentAssociation.id,
      state: 0, // Pending exit vouchers
    });

    // Compute next general assembly date
    await this.$store.dispatch("association/fetchCycles", {
      resourceUrl: `/api/association/${this.currentAssociation.id}/cycle`,
      commitAction: "SET_CYCLES",
    });

    if (this.getCycles.length) {
      let activeCycle = ags_functions.afficherCycleActif(this.getCycles);
      if (activeCycle.ag.length) {
        this.nextAg = ags_functions.prochaineAg(activeCycle.ag);
        // this.sidebarData.ags = activeCycle.ag;
      }
    }

    EventBus.$emit("loader", false);
  },
};
</script>

<style lang="stylus" scoped></style>
