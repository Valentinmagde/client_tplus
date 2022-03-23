<template>
<!-- left -->
<vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none z-10 mt-8" id="profile-tabs">

    <!--  <vs-tab  :label="!isSmallerScreen ? $t('paymentMode'): ''"
        icon-pack="streameline"
        icon="icon-cash-payment-bag">
        <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-0 ml-0">
            <paiement-tag></paiement-tag>
        </div>
      </vs-tab>  -->

    <vs-tab :label="!isSmallerScreen ? $t('sanctionType'): ''" icon-pack="streameline" icon="icon-single-neutral-actions-warning">
        <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-0 ml-0">
            <typesanction-tag></typesanction-tag>
        </div>
    </vs-tab>

    <vs-tab :label="!isSmallerScreen ? $t('exitVouchers'): ''" icon-pack="streameline" icon="icon-cash-payment-bag">
        <div id="setting" class="tab-general md:ml-0 md:mt-0 mt-0 ml-0">
            <vouchers-parameters-tag></vouchers-parameters-tag>
        </div>
    </vs-tab>

</vs-tabs>
</template>

<script>
import TypesanctionTag from './TypeSanction.component.vue'
import VouchersParametersTag from './VouchersParameters.component.vue'

export default {
    name: "layout-seance",
    components: {
        TypesanctionTag,
        VouchersParametersTag
    },

    computed: {
        isSmallerScreen() {
            return this.$store.state.windowWidth < 768
        }
    },
}
</script>

<style lang="scss">
#profile-tabs {
    .vs-tabs--content {
        padding: 0;
    }
}
</style>
