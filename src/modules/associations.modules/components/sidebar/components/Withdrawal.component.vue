<template>
  <div>
    <div class="clearfix w-full">
      <!-- Recipient -->
      <template v-if="!propRecipient">
        <p class="vs-input--label">{{ $t("recipient") | Capitalize }} *:</p>
        <autocomplete
          :getResultValue="getResultValue"
          :search="search"
          @submit="handleSubmit"
        >
          <template v-bind:inputProps="dataRecipient" #default> </template>
        </autocomplete>
      </template>

      <div v-else class="w-full justify-between">
        <p class="vs-input--label">{{ $t("recipient") | Capitalize }} *:</p>
        <vs-input class="w-full" type="text" v-model="propRecipient" disabled />
      </div>

      <!-- Date -->
      <p class="mt-4 vs-input--label">{{ $t("dateOfWithdrawal") }} *:</p>
      <flat-pickr class="select-large mt-1 w-full" v-model="paymentDate">
      </flat-pickr>

      <!-- Payment method -->
      <p class="mt-4 vs-input--label">{{ $t("paymentMethod") }} *:</p>
      <v-select
        label="text"
        :options="paymentMethods"
        v-model="paymentMethod"
        class="mt-1 w-full"
      />

      <!-- Comments -->
      <p class="mt-4 vs-input--label">{{ $t("comment") }}:</p>
      <vs-textarea v-model="comments" class="w-full mt-1 mb-4" />

      <!-- Amount -->
      <div class="mt-4 vx-row">
        <div class="vx-col w-full">
          <div class="flex wrap justify-end">
            <div class="vx-col sm:w-1/2 w-full text-center">
              <h6
                class="font-bold text-lg"
                :class="{ redtextclass: amount < 0 }"
              >
                {{ amount | formatMoney(devise) }}
              </h6>
              {{ $t("totalAmount") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Exit vouchers -->
      <p class="mt-4 vs-input--label">{{ $t("exitVouchers") }} *:</p>
      <v-select
        label="text"
        :options="exitVouchers"
        v-model="selectedVouchers"
        multiple
        class="mt-1 w-full"
      />

      <!-- Disbursements allocation -->
      <div class="vx-row" v-if="selectedVouchers.length">
        <div class="w-full vx-col">
          <p class="mt-4 vs-input--label">{{ $t("paymentAllowance") }} *:</p>
        </div>
        <div class="vx-col w-full mb-base">
          <div
            v-for="(voucher, index) in selectedVouchers"
            :key="index"
            class="vx-row flex flex-row justify-between mt-2 w-full"
          >
            <div class="vx-col w-4/5">
              <v-select
                label="text"
                disabled
                v-model="selectedVouchers[index]"
              ></v-select>
            </div>
            <div class="vx-col w-1/5">
              <money
                @input="handleAmountChange($event, index)"
                class="money-input"
                :style="{ borderColor: selectedVouchers[index].valid && selectedVouchers[index].disbursedAmount !== 0 ? '#28C76F' : '#EA5455' }"
                v-model="selectedVouchers[index].disbursedAmount"
                v-bind="{ decimal: ',', thousands: '.', precision: 2, masked: false }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 vx-col w-full" v-if="!propRecipient">
      <vs-button class="mr-4" type="border" @click="resetForm(true)">{{
        $t("cancel")
      }}</vs-button>
      <vs-button
        id="button-with-loading"
        class="mr-4"
        @click="saveWithdrawal()"
        :disabled="!isFormValid"
        >{{ $t("save") }}</vs-button
      >
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

// Money input
import { Money } from "v-money";

import { payment_mod as paymentOptions } from "../../../services/data/paymentMod.js";

// Getters from vuex
import { mapGetters } from "vuex";

import { EventBus } from "@/services/EventBus.js";
export default {
  data() {
    return {
      paymentDate: new Date(),
      dataRecipient: null,
      paymentMethod: {},
      comments: "",

      admin_account: {},

      selectedVouchers: [],
    };
  },

  props: {
    propRecipient: {
      type: String,
      default: "",
    },
    propGeneralAssembly: {
      type: Object,
      default: null,
    },
  },

  components: {
    "v-select": vSelect,
    Money,
  },

  computed: {
    ...mapGetters({
      getExitVouchers: "association/getExitVouchers",
      getMembers: "association/getMembers",
      getAssociation: "association/getCurrentAssociation",
      getAuthenticated: "authentificated/getAuth",
    }),

    recipient() {
      if (this.propRecipient) return this.propRecipient;
      return this.dataRecipient;
    },

    // Compute the correct recipient id. That is
    // The current admin member id if the recipient isn't a member of the association
    // The recipient member's id otherwise
    computeRecipient() {
      if (!this.recipient || this.recipient == "") return false;

      let recipient = this.getMembers.find(
        (member) => member.firstName == this.recipient.trim()
      );
      if (recipient) return recipient;

      // Simply return the admin member id if no recipient specified
      return this.admin_account;
    },

    amount() {
      let sum = 0.0;
      this.selectedVouchers.forEach((voucher) => (sum += voucher.disbursedAmount));
      return sum;
    },

    devise() {
      return this.getAssociation.devise;
    },

    exitVouchers() {
      // Filter vouchers for this one
      let vouchers = this.vouchersOptions(
        this.filterVouchers(this.propRecipient, this.propGeneralAssembly)
      );

      return vouchers;
    },

    isFormValid() {
      if (
        !this.paymentMethod ||
        !this.selectedVouchers ||
        !this.recipient ||
        !this.paymentDate
      )
        return false;

      return (
        this.recipient != "" &&
        this.paymentDate != "" &&
        Object.entries(this.paymentMethod).length &&
        this.selectedVouchers.length &&
        !this.selectedVouchers.some(voucher => !voucher.valid || voucher.disbursedAmount == 0)
      );
    },

    paymentMethods() {
      return paymentOptions.map((method) => ({
        text: this.$t(method.i18n),
        value: method.value,
      }));
    },
  },

  watch: {
    propRecipient: function (newRecipient) {
      this.selectedVouchers = this.vouchersOptions(
        this.filterVouchers(newRecipient, this.propGeneralAssembly)
      );
    },
    isFormValid: function (isValid) {
      this.$emit("onFormValidation", isValid);
    },
  },

  methods: {
    handleAmountChange(newValue, selectedVoucherIndex) {
      this.selectedVouchers[selectedVoucherIndex].valid = newValue <= this.selectedVouchers[selectedVoucherIndex].montant

    },
    async submit() {
      // Submission event
      this.$emit("onFormSubmitted");
      let submitNext = false,
        closeSidebar = true;
      await this.saveWithdrawal(submitNext, closeSidebar);
    },

    async submitNext() {
      // Submission event
      this.$emit("onFormSubmitted");
      let submitNext = true,
        closeSidebar = false;
      await this.saveWithdrawal(submitNext, closeSidebar);
    },

    handleSubmit(result) {
      this.dataRecipient = result.firstName;
    },

    filterVouchers(member = null, ag = null) {
      let vouchers = this.getExitVouchers;

      if (member)
        vouchers = vouchers.filter(
          (voucher) => voucher.membre.trim() == member.trim()
        );

      if (ag)
        vouchers = vouchers.filter(
          (voucher) => voucher.date_limite === ag.date_ag
        );

      return vouchers;
    },

    vouchersOptions(vouchers) {
      return vouchers.map((voucher) => ({
        text: `${voucher.membre} - ${
          voucher.libelle
        } (${this.$options.filters.formatMoney(voucher.montant, this.devise)})`,
        value: voucher.id,
        montant: voucher.montant,
        valid: true, // Is the disbursedAmount lower or equal than 'montant'
        disbursedAmount: voucher.montant, // Disbursed amount is the voucher amount by default
      }));
    },

    search(input) {
      this.dataRecipient = input;
      if (input.length < 1) {
        return [];
      }
      return this.getMembers
        .filter((member) => {
          return member.firstName.toLowerCase().includes(input.toLowerCase());
        })
        .map((member) => ({
          id: member.id,
          firstName: member.firstName,
        }));
    },

    getResultValue(input) {
      if (input) return input.firstName;
    },

    resetForm(closeSidebar = false) {
      this.paymentDate = null;
      this.paymentMethod = {};
      this.selectedVouchers = [];
      this.dataRecipient = null;
      this.recipient == ""

      // Emit a close event for any sidebar using the component
      if (closeSidebar) this.$emit("isSidebarActiveLocal", false);
    },

    async saveWithdrawal(submitNext = false, closeSidebar = false) {
      // Never send that to the server
      if (!this.amount) return;

      try {
        let operation = {
          date_realisation: new Date(this.paymentDate).getTime() / 1000,
          montant: this.amount,
          debit_credit: "debit",
          commentaire: this.comments,
          enregistre_par: this.getAuthenticated.id,
          mode: this.paymentMethod.value,
        };

        // Precise the recipient name if not a member
        if (
          this.computeRecipient.id === this.member_id &&
          this.dataRecipient != this.computeRecipient.firstName
        )
          operation.nom_membre = this.dataRecipient;

        // Prepare form data
        let formData = new FormData();
        formData.append("operation", JSON.stringify(operation));
        formData.append("methode_payement", this.paymentMethod.value);
        formData.append(
          "transactions",
          JSON.stringify(
            this.selectedVouchers.map((selectedVoucher) => ({
              echId: selectedVoucher.value,
              montant: selectedVoucher.disbursedAmount,
            }))
          )
        );

        // Async request
        await this.$store.dispatch("association/createWidthrawal", {
          member_id: this.computeRecipient.id,
          data: formData,
        });

        // Emit a completion event for whatever care about
        this.$emit("onFormCompleted", {
          continue: submitNext,
        });

        this.$emit("isSidebarActiveLocal", !closeSidebar);

        this.$vs.notify({
          position: "top-center",
          text: this.$t("operationSuccess"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "success",
        });
        this.resetForm()
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

    // Get association members
    await this.$store.dispatch("association/fetchMembers", {
      resourceUrl: `/api/association/${this.getAssociation.id}/membre`,
      commitAction: "SET_MEMBERS",
    });

    // Admin member account
    this.admin_account = this.getMembers.find(
      (member) =>
        member.users.findIndex((user) => user.id == this.getAuthenticated.id) >
        -1
    );

    // Fetch validated vouchers this time
    await this.$store.dispatch("association/fetchExitVouchers", {
      association_id: this.getAssociation.id,
      state: 1, // Pending exit vouchers
    });

    EventBus.$emit("loader", false);
  },
};
</script>

<style>
ul[role="listbox"] {
  max-height: 12rem;
}
</style>
