<template>
  <!-- ACTION - DROPDOWN -->
  <vs-dropdown
    vs-trigger-click
    class="ml-auto md:block cursor-pointer fixed z-50"
    style="right: 35px"
  >
    <vs-button icon="icon-settings" icon-pack="feather">{{
      $t("actions")
    }}</vs-button>

    <vs-dropdown-menu class="w-64">
      <!-- Versement en cours de validation -->
      <vs-dropdown-item>
        <div
          @click="
            $router
              .push('/association/administration/finances/operations')
              .catch(() => {})
          "
          class="ml-2 flex items-center"
        >
          <span>{{ $t("paymentsInValidation") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Effectuer un versement -->
      <vs-dropdown-item>
        <div
          @click="
            $router
              .push('/association/administration/finances/payment')
              .catch(() => {})
          "
          class="ml-2 flex items-center"
        >
          <span>{{ $t("saveAPayment") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Historique des opérations -->
      <vs-dropdown-item>
        <div
          @click="
            $router
              .push('/association/administration/finances/history')
              .catch(() => {})
          "
          class="ml-2 flex items-center"
        >
          <span>{{ $t("paymentwithdrawalHistory") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Echéances -->
      <vs-dropdown-item>
        <div
          class="ml-2 flex items-center"
          @click="
            $router
              .push('/association/administration/finances/settlements')
              .catch(() => {})
          "
        >
          <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
          <span>{{ $t("settlement") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Impayes -->
      <vs-dropdown-item>
        <div
          class="ml-2 flex items-center"
          @click="
            $router
              .push('/association/administration/finances/debt')
              .catch(() => {})
          "
        >
          <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
          <span>{{ $t("debt") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Bon de sortie -->
      <vs-dropdown-item>
        <div
          class="ml-2 flex items-center"
          @click="
            $router
              .push('/association/administration/finances/exit-vouchers')
              .catch(() => {})
          "
        >
          <span>{{ $t("Bons de sortie") }}</span>
        </div>
      </vs-dropdown-item>

      <vs-divider class="mt-1 mb-1" />

      <!-- Demande de cotisation -->
      <vs-dropdown-item>
        <div
          @click="
            $router
              .push('/association/administration/finances/contribution')
              .catch(() => {})
          "
          class="ml-2 flex items-center"
        >
          <!-- <feather-icon icon="DollarSignIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
          <span>{{ $t("askForBond") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Retrait -->
      <vs-dropdown-item>
        <div
          @click="
            $router
              .push('/association/administration/finances/withdrawal')
              .catch(() => {})
          "
          class="ml-2 flex items-center"
        >
          <span>{{ $t("makeWithdrawals") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Versement en séance -->
      <vs-dropdown-item>
        <div
          @click="
            $router
              .push('/association/administration/finances/session-payment')
              .catch(() => {})
          "
          class="ml-2 flex items-center"
        >
          <span>{{ $t("sessionPayments") }}</span>
        </div>
      </vs-dropdown-item>

      <!-- Trésorerie -->
      <!-- <vs-dropdown-item>
                    <div @click="$router.push('/apps/finances/treasury').catch(() => {})" class="ml-2 flex items-center">
                        <span>{{$t('treasury')}}</span>
                    </div>
                </vs-dropdown-item> -->

      <!-- Virement -->
      <vs-dropdown-item>
        <div
          @click="
            $router
              .push('/association/administration/finances/transfer')
              .catch(() => {})
          "
          class="ml-2 flex items-center"
        >
          <span>{{ $t("moveFunds") }}</span>
        </div>
      </vs-dropdown-item>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>
