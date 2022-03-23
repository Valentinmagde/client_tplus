<template>
  <div>
    <!-- Activity in which we perform the withdrawal -->
    <p class="vs-input--label">{{ $t("activity") + " *" }}</p>
    <v-select
      label="text"
      :options="activitiesOptions"
      v-model="selectedActivity"
      @input="getActivityAccounts()"
      class="w-full mb-5"
    />

    <!-- Create a voucher for all members ? -->
    <vs-checkbox
      class="w-full mb-5"
      v-model="allAccounts"
      v-if="Object.entries(selectedActivity).length"
      >{{ $t("allMembers") }}</vs-checkbox
    >

    <!-- Select members -->
    <template v-if="Object.entries(selectedActivity).length && !allAccounts">
      <p class="vs-input--label">{{ $t("selectedMembers") + " *" }}</p>
      <v-select
        label="text"
        :options="accountsOptions"
        v-model="selectedAccounts"
        multiple
        class="w-full mb-5"
      />
    </template>

    <!-- Amount -->
    <p class="vs-input--label mt-4">{{ $t("Amount") + " *" }}</p>
    <money
      v-model="amount"
      v-bind="moneyInputConfigs"
      class="money-input p-3 w-full mb-5"
    />

    <!-- Label -->
    <vs-input :label="$t('wording')" v-model="label" class="w-full mb-5" />

    <!-- Description -->
    <vs-input
      :label="$t('description') + ' *'"
      v-model="description"
      class="w-full mb-5"
    />

    <!-- Exit voucher withdrawal mode -->
    <p class="vs-input--label">{{ $t("disbursementMethod") + " *" }}</p>
    <v-select
      label="text"
      :options="disbursementMethodOptions"
      v-model="disbursementMethod"
      class="w-full mb-5"
    />

    <!-- Exit voucher type -->
    <p class="vs-input--label">Type *</p>
    <v-select
      label="text"
      :options="exitVoucherTypeOptions"
      v-model="exitVoucherType"
      class="w-full mb-5"
    />

    <!-- Limit date -->
    <p class="vs-input--label">{{ $t("limitDate") + " *" }}</p>
    <v-select
      label="text"
      :options="agsOptions"
      v-model="limitDate"
      class="w-full mb-5"
    />

    <div class="mt-4 vx-col w-full" v-if="showFormButtons">
      <vs-button class="mr-4" type="border" @click.native="resetForm">{{
        $t("cancel")
      }}</vs-button>
      <vs-button
        id="button-with-loading"
        @click="submit()"
        :disabled="!isFormValid"
        >{{ $t("save") }}</vs-button
      >
    </div>
  </div>
</template>

<script>
// Money input
import { Money } from "v-money";

// Map getters from vuex
import { mapGetters } from "vuex";

// Some fuuctions to manage ags
import ags_functions from "../../../services/functions.js";

// Disbursement options
import { disbursement_mod as disbursementOptions } from "../../../services/data/disbursementMod.js";

// Exit voucher types
import { exitVoucherTypes } from "../../../services/data/exitVoucherTypes.js";

import vSelect from "vue-select";

import { EventBus } from "@/services/EventBus";

export default {
  // Ajouter type (décaissement, ... comme sur clickup)
  // Ajouter mode de décaissement
  data() {
    return {
      selectedActivity: {},

      moneyInputConfigs: {
        decimal: ",",
        thousands: ".",
        precision: 2,
        masked: false,
      },
      amount: 0.0,

      label: "",
      description: "",

      disbursementMethod: {},
      exitVoucherType: {},

      limitDate: null,
      agsData: [],

      allAccounts: false,
      selectedAccounts: [],
    };
  },

  props: {
    ags: {
      type: Array,
      required: false,
      default: function () {
        return new Array();
      },
    },
    showFormButtons: false,
  },

  components: {
    vSelect,
    Money,
  },

  methods: {
    resetForm() {
      this.selectedActivity = {};
      this.amount = 0.0;
      this.label = this.description = "";
      this.disbursementMethod = {};
      this.exitVoucherType = {};
      this.limitDate = null;
    },

    async getActivityAccounts() {
      try {
        EventBus.$emit("loader", true);

        await this.$store.dispatch("association/fetchActivityAccounts", {
          activity_id: this.selectedActivity.id,
        });

        EventBus.$emit("loader", false);
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

    async submit() {
      try {
        // Format data to cope with different cases
        let settlements = {
          montant: this.amount,
          description: this.description,
          date_limite: this.limitDate.value,
          mode: this.disbursementMethod.value,
          type: this.exitVoucherType.value,
          debit_credit: "decaissement",
          libelle: this.label.length
            ? this.label
            : `${this.$t("withdrawal")}  -  ${this.selectedActivity.text} - ${
                this.description
              }`,
        };

        let payload;
        // Differenciate between both cases
        if (this.allAccounts)
          payload = {
            data: settlements,
            resourceUrl: `/api/activite/${this.selectedActivity.id}/echeancier`,
          };
        else
          payload = {
            data: {
              echeancier: settlements,
              membres: this.selectedAccounts.map((member) => member.id),
            },
            resourceUrl: `/api/activite/${this.selectedActivity.id}/echeancier/some`,
          };

        // Async request to save exit voucher - Sweet server :)
        await this.$store.dispatch("association/postRequest", {
          commitAction: "NO_COMMIT",
          ...payload,
        });

        this.$vs.notify({
          position: "top-center",
          text: this.$t("updateCompletedSuccessfully"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "success",
        });

        // Reset form
        this.resetForm();
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

  computed: {
    ...mapGetters({
      getAssociation: "association/getCurrentAssociation",
      getActivities: "association/getActivities",
      getCycles: "association/getCycles",
      getAccounts: "association/getAccounts",
    }),

    isFormValid() {
      return (
        Object.getOwnPropertyNames(this.selectedActivity).length &&
        this.amount > 0 &&
        this.description !== "" &&
        Object.getOwnPropertyNames(this.disbursementMethod).length &&
        Object.getOwnPropertyNames(this.exitVoucherType).length &&
        this.limitDate && this.limitDate !== ""
      );
    },

    activitiesOptions() {
      return this.getActivities.map((activity) => ({
        text: activity.nom,
        id: activity.id,
      }));
    },

    disbursementMethodOptions() {
      return disbursementOptions.map((method) => ({
        text: this.$t(method.i18n),
        value: method.value,
      }));
    },

    exitVoucherTypeOptions() {
      return exitVoucherTypes.map((method) => ({
        text: this.$t(method.i18n),
        value: method.value,
      }));
    },

    agsOptions() {
      let ags = this.ags.length ? this.ags : this.agsData;

      return ags.map((ag, index) => ({
        id: ag.id,
        text: `AG-${index + 1}: ${this.$options.filters.dateTime(ag.date_ag)}`,
        value: ag.date_ag,
      }));
    },

    accountsOptions() {
      return this.getAccounts.map((account) => ({
        text: account.membre,
        id: account.membres_id,
      }));
    },
  },

  async created() {
    EventBus.$emit("loader", true);

    // Fetch association activities
    await this.$store.dispatch("association/fetchAssociationActivities", {
      association_id: this.getAssociation.id,
    });

    // Fetch ags if none has been passed in props
    if (!this.ags.length) {
      // Compute next general assembly date
      await this.$store.dispatch("association/fetchCycles", {
        resourceUrl: `/api/association/${this.getAssociation.id}/cycle`,
        commitAction: "SET_CYCLES",
      });

      if (this.getCycles.length) {
        let activeCycle = ags_functions.afficherCycleActif(this.getCycles);
        if (activeCycle.ag.length);
        this.agsData = activeCycle.ag;
      }
    }

    EventBus.$emit("loader", false);
  },
};
</script>

<style>
ul[role="listbox"] {
  max-height: 150px;
}
</style>
