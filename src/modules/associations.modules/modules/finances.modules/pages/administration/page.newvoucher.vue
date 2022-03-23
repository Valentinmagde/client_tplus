<template>
  <div>
    <action-button />

    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <vx-card
        class="mr-4"
        no-shadow
        :title="$t('newVoucher') | CAPITALIZE"
      >
        <div class="ep-association">
          <create-voucher-form :showFormButtons="true"/>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
// Action Button
import ActionButton from "../../components/administration/ActionButton.component";

// Import form
import CreateVoucherForm from "../../../../components/sidebar/components/NewExitVoucher.component";
export default {
  components: {
    ActionButton,
    CreateVoucherForm,
  },
};
</script>

<style>
</style>
