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

    <active-admin-dashboard v-if="association.etat === true"></active-admin-dashboard>

    <inactive-admin-dashboard v-if="association.etat === false"></inactive-admin-dashboard>

  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import ActiveAdminDashboard from '../../components/dashboards/ActiveAdminDashboard.component'
import InactiveAdminDashboard from '../../components/dashboards/InactiveAdminDashboard.component'

export default {
    data() {
        return {
            association: '',
            // checkpointReward: {},
            // subscribersGained: {},
            // ordersRecevied: {},
            // salesBarSession: {},
            // supportTracker: {},
            // productsOrder: {},
            // salesRadar: {},
            // dispatchedOrders: [],
        }
    },
    components: {
        VueApexCharts,
        ActiveAdminDashboard,
        InactiveAdminDashboard,
    },
    created(){
      this.association = this.$store.state.association.currentAssociation
    }
}
</script>

<style lang="scss">
/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user{
    position: relative;

    .decore-left{
      position: absolute;
      left:0;
      top: 0;
    }
    .decore-right{
      position: absolute;
      right:0;
      top: 0;
    }
  }

  @media(max-width: 576px) {
    .decore-left, .decore-right{
      width: 140px;
    }
  }
}
/*! rtl:end:ignore */
.img-logo {
  object-fit: cover;
  background-color: #fff;
}
</style>
