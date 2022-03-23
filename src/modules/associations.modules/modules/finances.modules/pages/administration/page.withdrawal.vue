<template>
  <div>
    <!-- ACTION - DROPDOWN -->
    <action-button />

    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />

    <div class="pt-16">
      <vx-card class="mb-6">
        <h5>{{ $t("makeAWithdrawals") | CAPITALIZE }}</h5>
        <p class="mt-2 text-muted">{{ $t("makeAWithdrawalsSubtitle") }}</p>
      </vx-card>
      <div class="vx-row">
        <div class="vx-col sm:w-full md:w-full lg:w-3/5 mb-base">

          <!-- Disbursement component -->
          <withdrawal-form :propGeneralAssembly="getCurrentAg" />

        </div>

        <div class="vx-col sm:w-full md:w-full lg:w-2/5">
          <vx-card class="overflow-auto" style="max-height: 41rem">
            <h5 class="mt-4">{{ $t("stateOfCash") | CAPITALIZE }}</h5>
            <table class="mt-4 w-full table-auto border-collapse z-10">
              <thead>
                <tr>
                  <th class="px-4 py-2 text-base th-bg">{{ $t("heading") }}</th>
                  <th class="px-4 py-2 text-base th-bg">{{ $t("name") }}</th>
                  <th class="px-4 py-2 text-base th-bg">{{ $t("Amount") }}</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  :key="index"
                  v-for="(treasuryElement, index) in getTreasury"
                >
                  <td class="px-4 py-2">
                    {{ treasuryElement.activite.type }}
                  </td>
                  <td class="px-4 py-2">
                    {{ treasuryElement.activite.nom }}
                  </td>
                  <td class="px-4 py-2">
                    <p
                      class="product-name font-medium truncate"
                      :class="{ redtextclass: treasuryElement.tresorerie < 0 }"
                    >
                      {{ treasuryElement.tresorerie | formatMoney(devise) }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Action button
import ActionButton from "../../components/administration/ActionButton.component";

import WithdrawalForm from "@/modules/associations.modules/components/sidebar/components/Withdrawal.component.vue";

// Getters from vuex
import { mapGetters } from "vuex";

import { EventBus } from "@/services/EventBus.js";

export default {
  components: {
    ActionButton,
    WithdrawalForm
  },

  computed: {
    ...mapGetters({
      getTreasury: "association/getTresoreries",
      getAssociation: "association/getCurrentAssociation",
      getCurrentAg: "association/getcurrentAssociationAg"
    }),

    devise() {
      return this.getAssociation.devise;
    }
  },

  async created() {
    EventBus.$emit("loader", true);

    // Get association treasury elements
    await this.$store.dispatch("association/fetchTreasury", {
      association_id: this.getAssociation.id,
    });

    EventBus.$emit("loader", false);
  },
};
</script>
