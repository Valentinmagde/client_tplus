<template>
  <div id="data-list-list-view" class="data-list-container">
    <div class="ml-4 mr-4">
      <vx-card no-shadow class="mb-6 pb-6" :title="$t('exitVouchers')" />
      <vx-card no-shadow class="mb-6 pb-6">
        <div class="mt-2 vx-col">
          <p class="mb-4 font-bold">{{ $t('exitVouchersValidation') }}:</p>
          <div class="flex flex-row justify-start">
            <vs-switch
              class="mr-2"
              @input="toggleVoucherValidationMethod"
              v-model="voucherAutoValidation"
            />
            {{
              voucherAutoValidation
                ? $t("automatedAtCreation")
                : $t("validatedByPresident")
            }}
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
// Map getters from vuex
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      voucherAutoValidation: false,
    };
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),
  },
  methods: {
    toggleVoucherValidationMethod() {
      // Get association data
      let data = {
        id: this.currentAssociation.id,
        validation_automatique: this.voucherAutoValidation,
      };

      // Update request
      this.$store
        .dispatch("association/postRequest", {
          resourceUrl: "api/association/updateParams",
          commitAction: "SET_CURRENT_ASSOCIATION",
          data: data,
        })
        .then(() => {
          this.$vs.notify({
            position: "top-center",
            text: this.$t("updateCompletedSuccessfully"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
  },
  created() {
    this.voucherAutoValidation = this.currentAssociation.validation_automatique;
  },
};
</script>

<style>
</style>
