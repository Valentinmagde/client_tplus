<template>
  <div v-if="isReady">
    <!-- Popup pour ajouter un membre -->
    <vs-popup
      classContent="popup-example"
      class="popup-position select-member"
      :title="$t('addMember')"
      :active.sync="popupActivo4"
    >
      <!-- Membre -->
      <span v-if="!usersData.length">
        <p class="vs-input--label">{{ $t("members") + " *" }}</p>
        <v-select
          :placeholder="$t('noMember')"
          label="firstName"
          :options="usersData"
          class="w-full mb-5"
          v-model="membre"
        />
      </span>
      <span v-else>
        <p class="vs-input--label">{{ $t("members") + " *" }}</p>
        <v-select
          label="firstName"
          :options="usersData"
          class="w-full mb-5"
          v-model="membre"
        />
      </span>
      <!-- Nombre de noms -->
      <p class="vs-input--label mt-5">{{ $t("numberOfNames") + " *" }}</p>
      <vs-input
        type="number"
        class="w-full mb-5"
        v-model="nombre_noms"
        @keydown="filterKey"
      />

      <!-- Montant cotisation -->
      <span v-if="activite_courante.Tontine.type == 'VARIABLE'">
        <p class="vs-input--label mt-5">
          {{ $t("contributionAmount") + " *" }}
        </p>
        <money
          v-model="montant_cotisation"
          v-bind="money"
          class="money-input w-full"
        />
      </span>

      <vs-checkbox
        v-model="checkbox_create_another"
        class="mt-6"
        style="margin-left: -1px"
      >
        {{ $t("addAnother") }}
      </vs-checkbox>

      <vs-divider class="my-5" />
      <div class="vx-row w-full justify-end">
        <vs-button @click="popupActivo4 = false" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3 vs-con-loading__container"
          ref="loadableButton"
          id="button-loading-add"
          :disabled="!validateForm"
          @click="addMember('button-loading-add')"
        >
          {{ $t("save") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour enlever un membre -->
    <vs-popup
      classContent="popup-example"
      class="popup-position delete-member"
      :title="$t('removeMember')"
      :active.sync="popupActivo5"
    >
      <!-- Membre -->
      <span>
        <p class="vs-input--label">{{ $t("members") + " *" }}</p>
        <v-select
          label="membre"
          :options="comptesData"
          class="w-full mb-5"
          v-model="compte"
        />
      </span>

      <vs-checkbox
        v-model="checkbox_remove_another"
        class="mt-6"
        style="margin-left: -1px"
      >
        {{ $t("removeAnother") }}
      </vs-checkbox>

      <vs-divider class="my-6" />
      <div class="vx-row w-full justify-end mb-4">
        <vs-button @click="popupActivo5 = false" color="danger" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-loading-remove"
          :disabled="compte == ''"
          @click="deleteItem('button-loading-remove')"
        >
          {{ $t("delete") }}
        </vs-button>
      </div>
    </vs-popup>
    <!-- ACTION - DROPDOWN -->
    <action-button v-if="admin" :activity="activite_courante" />
    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
      :activity="activite_courante"
    />
    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <vx-card class="mb-base pb-4" :data="parameterTab">
        <!--Voir plus-->
        <!-- <div class="flex flex-wrap items-center absolute right-0 justify-end ag-grid-table-actions-right mr-8 mb-5 cursor-pointer"> -->
        <!--  <vx-tooltip :text="$t('seeMore')" position="bottom" @click.native="addNewData('ParametresTontine')">
                        <small class="flex">
                            <feather-icon icon='MoreVerticalIcon' svgClasses='h-4 w-4' />
                        </small>
                    </vx-tooltip>
            </div> -->
        <div class="grid grid-cols-1 gap-2">
          <div class="col-star-1">
            <h5>{{ "TONTINE - " }} {{ activite_courante.nom | CAPITALIZE }}</h5>
            <p class="mt-2 text-muted">{{ $t("tontineState") }}</p>
            <div class="vx-row mt-4">
              <!-- Type tontine -->
              <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                <span class="inline-block">{{ $t("tontineType") }}:</span>
                <span class="ml-1 font-semibold">
                  {{ activite_courante.Tontine.type }}
                </span>

                <!-- Espaceur vertical -->
                <span class="ml-5 items-center">
                  <span class="font-semibold">|</span>
                </span>
              </div>

              <!-- Montant part -->
              <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                <span
                  v-if="
                    activite_courante.Tontine.part_cotisation == 0 &&
                    activite_courante.Tontine.type == 'VARIABLE'
                  "
                  class="inline-block"
                >
                  {{ $t("minimumAmount") }}:
                </span>
                <span v-else class="inline-block"
                  >{{ $t("amountShare") }}:</span
                >

                <span class="ml-1 font-semibold">
                  {{
                    activite_courante.Tontine.montant_part | formatMoney(devise)
                  }}
                </span>

                <!-- Espaceur vertical -->
                <span class="ml-5 items-center">
                  <span class="font-semibold">|</span>
                </span>
              </div>

              <!-- Montant cagnote -->
              <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                <span class="inline-block">{{ $t("amountOfPot") }}:</span>

                <span class="ml-1 font-semibold">
                  {{
                    activite_courante.Tontine.montant_cagnote
                      | formatMoney(devise)
                  }}
                </span>
              </div>

              <!-- Voir plus -->
              <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
                <p
                  class="
                    inline-block
                    min-w-0
                    link-color
                    hover:italic
                    cursor-pointer
                  "
                  @click.stop="addNewData('ParametresTontine')"
                >
                  {{ $t("seeMore") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
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
            <!--  Avoirs -->
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
              <!-- <span v-if="!admin">{{ formatMoney(avoir_membre)}}</span> -->
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
              <!-- <span v-if="!admin">{{ formatMoney(solde_membre)}}</span> -->
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

            <!-- Intérêt générés -->
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
    <!-- Tour de bouffe -->
    <div
      v-if="!admin && lots_membre.length > 0 && visibilite == 'RESTREINT'"
      class="vx-row"
      id="dashboard-analytics"
    >
      <div class="vx-col w-full mb-base">
        <vx-card
          slot="no-body"
          class="text-center bg-primary-gradient greet-user"
        >
          <img
            src="@/assets/images/elements/decore-left.png"
            class="decore-left"
            alt="Decore Left"
            width="200"
          />
          <img
            src="@/assets/images/elements/decore-right.png"
            class="decore-right"
            alt="Decore Right"
            width="175"
          />
          <h4 class="mb-base text-white mb-12">
            {{ $t("winningMethod") }}
          </h4>
          <div
            v-show="lots_membre.length > 0"
            class="vx-row justify-center text-white mb-2"
            v-for="(lot, index) in lots_membre"
            :key="index"
          >
            <!-- Date de bouffe -->
            <div class="vx-col sm:w-full md:w-auto w-auto">
              <span class="inline-block">{{ $t("winningDate") }}:</span>
              <vs-chip class="float-none ml-2 inline-block">{{
                lot.date_bouffe | dateTime
              }}</vs-chip>

              <!-- Espaceur vertical -->
              <span class="ml-5 items-center">
                <span class="font-semibold"> - </span>
              </span>
            </div>

            <!-- Montant -->
            <div class="vx-col sm:w-full md:w-auto w-auto">
              <span class="inline-block">{{ $t("Amount") }}:</span>
              <vs-chip class="float-none ml-2 inline-block">{{
                lot.montant
              }}</vs-chip>

              <!-- Espaceur vertical -->
              <span class="ml-5 items-center">
                <span class="font-semibold"> - </span>
              </span>
            </div>

            <!-- Statut -->
            <div class="vx-col sm:w-full md:w-auto w-auto">
              <span class="inline-block">{{ $t("state") }}:</span>
              <vs-chip
                v-if="lot.etat != 'init'"
                class="float-none ml-2 inline-block"
              >
                {{ $t("won") }}
              </vs-chip>
              <vs-chip
                v-if="lot.etat == 'init'"
                class="float-none ml-2 inline-block"
              >
                {{ $t("notWon") }}
              </vs-chip>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <!-- Tour de bouffe côté admin -->
    <div
      v-if="
        (admin && beneficiairesData.length > 0) ||
        (visibilite == 'OUVERT' && beneficiairesData.length > 0)
      "
      class="vx-row"
    >
      <div class="vx-col w-full">
        <vx-card class="mb-base" style="min-height: 15rem">
          <div>
            <div class="flex justify-between">
              <h5 class="mb-2">{{ $t("tontineBeneficiaries") }}</h5>

              <!-- Actions-->
              <div
                class="
                  flex flex-wrap
                  items-center
                  justify-end
                  ag-grid-table-actions-right
                  mr-5
                  mb-5
                "
              >
                <!-- Permuter lots -->
                <vx-tooltip
                  v-if="admin"
                  :text="$t('swapBeneficiary')"
                  position="bottom"
                >
                  <small
                    class="
                      hover:text-success
                      mr-4
                      flex
                      items-center
                      cursor-pointer
                    "
                    @click.stop="addNewData('PermuterBeneficiaire')"
                  >
                    <vs-icon
                      iconPack="streameline"
                      icon="icon-single-neutral-actions-up-down"
                      class="text-lg"
                    />
                  </small>
                </vx-tooltip>

                <!-- Déplacer un lot -->
                <vx-tooltip
                  v-if="admin"
                  :text="$t('moveBeneficiary')"
                  position="bottom"
                >
                  <small
                    class="
                      hover:text-success
                      mr-3
                      flex
                      items-center
                      cursor-pointer
                    "
                    @click.stop="addNewData('DeplacerLot')"
                  >
                    <vs-icon
                      iconPack="streameline"
                      icon="icon-user-logout"
                      class="text-lg"
                    />
                  </small>
                </vx-tooltip>

                <!-- Export tour de bouffe -->
                <vx-tooltip
                  v-if="admin"
                  :text="$t('exports')"
                  position="bottom"
                >
                  <vs-dropdown
                    vs-trigger-click
                    class="cursor-pointer hover:text-success mt-2"
                  >
                    <small class="flex">
                      <vs-icon
                        iconPack="streameline"
                        icon="icon-download-menu"
                        class="text-lg"
                      />
                      <!--<feather-icon icon='MoreVerticalIcon' svgClasses='h-4 w-4' />-->
                    </small>

                    <vs-dropdown-menu class="w-32">
                      <vs-dropdown-item
                        @click.native="exportPDF(beneficiairesData)"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item
                        @click.native="csvExport(beneficiairesData)"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item
                        @click.native="exportExel(beneficiairesData)"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </vx-tooltip>
              </div>
            </div>
            <div class="left">
              <vs-button
                id="left-button"
                @click="swipeLeft"
                class="mt-auto swipe z-10"
                radius
                color="#fff"
                icon-pack="feather"
                icon="icon-chevron-left"
              />
            </div>
            <div
              v-if="beneficiairesData.length > 0"
              class="center"
              id="content"
              ref="content"
            >
              <div
                class="inline-block"
                v-for="(timeline, index) in beneficiairesData"
                :key="index"
              >
                <div class="Timeline">
                  <div
                    class="event2"
                    :id="timeline.etat_ag == 'current' ? 'actualLot' : ''"
                  >
                    <!-- AGS CLOTUREES -->
                    <span
                      v-if="
                        timeline.etat_ag == 'past' ||
                        timeline.etat_ag == 'cloture'
                      "
                    >
                      <div class="event2Bubble">
                        <div
                          class="eventTitle"
                          v-for="(member, ind) in timeline.subtitle"
                          :key="ind"
                        >
                          <vs-chip class="float-none inline-block">{{
                            member
                          }}</vs-chip>
                        </div>
                      </div>
                      <!-- <div class="event2Author">by Tom Eggleston</div> -->
                      <svg height="20" width="20">
                        <circle cx="10" cy="11" r="5" fill="#ccc" />
                      </svg>
                    </span>

                    <!-- AG EN COURS -->
                    <span v-if="timeline.etat_ag == 'current'">
                      <div class="event2Bubble">
                        <div
                          class="eventTitle"
                          v-for="(member, ind) in timeline.subtitle"
                          :key="ind"
                        >
                          <vs-chip
                            color="#28C76F"
                            class="float-none inline-block"
                            >{{ member }}</vs-chip
                          >
                        </div>
                      </div>
                      <!-- <div class="event2Author">by Tom Eggleston</div> -->
                      <svg height="20" width="20">
                        <circle cx="10" cy="11" r="5" fill="#28C76F" />
                      </svg>
                    </span>

                    <!-- AGS FUTURS -->
                    <span v-if="timeline.etat_ag == 'future'">
                      <div class="event2Bubble">
                        <div
                          class="eventTitle"
                          v-for="(member, ind) in timeline.subtitle"
                          :key="ind"
                        >
                          <vs-chip
                            color="#3383c8"
                            class="float-none inline-block"
                            >{{ member }}</vs-chip
                          >
                        </div>
                      </div>
                      <!-- <div class="event2Author">by Tom Eggleston</div> -->
                      <svg height="20" width="20">
                        <circle cx="10" cy="11" r="5" fill="#3383c8" />
                      </svg>
                    </span>
                    <div class="time2">
                      {{ timeline.title | dateTime }}
                    </div>
                  </div>

                  <!-- AGS CLOTURES -->
                  <svg
                    v-if="
                      (index != beneficiairesData.length - 1 &&
                        timeline.etat_ag == 'past') ||
                      (index != beneficiairesData.length - 1 &&
                        timeline.etat_ag == 'cloture')
                    "
                    height="5"
                    width="200"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="300"
                      y2="0"
                      style="stroke: #ccc; stroke-width: 5"
                    />
                    Sorry, your browser does not support inline SVG.
                  </svg>

                  <!-- AG EN COURS -->
                  <svg
                    v-if="
                      index != beneficiairesData.length - 1 &&
                      timeline.etat_ag == 'current'
                    "
                    height="5"
                    width="200"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="300"
                      y2="0"
                      style="stroke: #28c76f; stroke-width: 5"
                    />
                    Sorry, your browser does not support inline SVG.
                  </svg>
                  <!-- AGS FUTURS -->
                  <svg
                    v-if="
                      index != beneficiairesData.length - 1 &&
                      timeline.etat_ag == 'future'
                    "
                    height="5"
                    width="200"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="300"
                      y2="0"
                      style="stroke: #3383c8; stroke-width: 5"
                    />
                    Sorry, your browser does not support inline SVG.
                  </svg>
                </div>
              </div>
            </div>
            <div class="right">
              <vs-button
                id="right-button"
                @click="swipeRight"
                class="mt-auto swipe z-10"
                radius
                color="#fff"
                icon-pack="feather"
                icon="icon-chevron-right"
              />
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <!-- LISTE DES TRANSACTIONS DU MEMBRE -->
    <div v-if="!admin && visibilite == 'OUVERT'" class="vx-row">
      <div v-if="transactions_membre.length > 0" class="vx-col w-full mb-base">
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
                  <vs-dropdown-item @click.native="transactionsExport('excel')"
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
      <!-- Membres Inscrits -->
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
                  () => {
                    popupActivo4 = true;
                    montant_cotisation = 0;
                  }
                "
              >
                <vs-icon
                  iconPack="streameline"
                  icon="icon-single-neutral-actions-add"
                  class="text-lg cursor-pointer hover:text-success mr-4"
                />
              </vx-tooltip>

              <vx-tooltip
                :text="$t('removeMember')"
                position="right"
                class="inline-block"
                @click.native="
                  () => {
                    popupActivo5 = true;
                  }
                "
              >
                <vs-icon
                  iconPack="streameline"
                  icon="icon-single-neutral-actions-remove"
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
                <vs-th></vs-th>
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

                  <vs-td>
                    <span
                      v-if="getEtatLot(data[indextr].membres_id).length > 0"
                    >
                      <span
                        :key="ind"
                        v-for="(etat, ind) in getEtatLot(
                          data[indextr].membres_id
                        )"
                      >
                        <feather-icon
                          v-if="etat == 'init'"
                          icon="CircleIcon"
                          svg-classes=" w-4 h-4 stroke-current"
                        />

                        <feather-icon
                          v-if="etat == 'paye' || etat == 'recu'"
                          icon="CircleIcon"
                          svg-classes=" w-4 h-4 stroke-current text-success"
                          class="bg-success rounded-full"
                        />
                      </span>
                    </span>
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
                    <span :class="{ redtextclass: data[indextr].interet < 0 }">
                      {{ data[indextr].interet | formatMoney(devise) }}
                    </span>
                  </vs-td>
                  <vs-td :data="data[indextr].encaissement" class="text-right">
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
                  <vs-td :data="data[indextr].decaissement" class="text-right">
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
                </tr>
              </thead>

              <tbody>
                <tr :key="ind" v-for="(tr, ind) in membres_incris">
                  <td class="px-4 py-2 mr-0">
                    {{ ind + 1 }}
                  </td>
                  <td class="px-4 py-2 mr-0">
                    <p class="product-name font-medium truncate">
                      {{ tr.membre }}
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
            <p class="flex pt-16 justify-center">{{ $t("noElementFound") }}</p>
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
</template>

<script>
import { Money } from "v-money";

import vSelect from "vue-select";
//Component
import ActionButton from "../components/ActionButton.component.vue";
import DataViewSidebar from "../../../../../components/sidebar/DataViewSidebar.component.vue";

//Functions
import functions from "../services/functions.js";
import { penality_type } from "../services/data/penalityTypes.js";
import { tontine_type } from "../services/data/tontineTypes.js";
import { allocation_lots } from "../services/data/allocationOfLots.js";
import { EventBus } from "@/services/EventBus.js";
import exports from "@/services/exports";

import { tontineRegisterMembers, deleteMember } from "../../../services/api";
import checkIfAdmin from "../../../../../mixins/checkRole";
import checkActivityType from "../../../mixins/checkActivityType";

//Stores
import { mapGetters } from "vuex";

export default {
  props: ["activite"],
  mixins: [checkIfAdmin, checkActivityType],
  data() {
    return {
      association_courante: null,
      /* Paramettre de l'activité */
      solde_activite: 0,
      dette_activite: 0,
      avoir_activite: 0,
      interet_activite: 0,
      caisse_activite: 0,
      total_caisse: 0,
      versement_activite: 0,
      decaissement_activite: 0,

      /* Paramettre de la statistique du membre */
      solde_membre: 0,
      dette_membre: 0,
      avoir_membre: 0,
      versement_membre: 0,
      decaissement_membre: 0,
      lots_membre: [],

      activite_courante: [],
      membres_incris: [],
      parameterTab: [],
      membre_incris: [],
      id_activite: "",
      tontineTab: [],
      //parametres de la tontine
      popupActive3: false,
      popupActivo2: false,
      type_tontine: {
        text: this.$t(tontine_type[0].i18n),
        value: tontine_type[0].value,
      },
      allocation_of_lot: {
        text: this.$t(allocation_lots[0].i18n),
        value: allocation_lots[0].value,
      },
      date_premier_tour: "",
      montant_part: "",
      montant_cagnote: "",
      tontine_selectionne: "",
      tontine_courante: [],
      lots: [],
      steps: 3,
      step: undefined,
      demoSteps: [],
      devise: "",
      visibilite: "",
      membre_id: "",
      transactions_membre: [],
      isReady: false,

      /* Parametres ajout membres */
      compte: "",
      membre: "",
      nombre_noms: "1",
      montant_cotisation: 0,
      money: {
        decimal: ",",
        thousands: ".",
        precision: 2,
        masked: false /* doesn't work with directive */,
      },
      popupActivo4: false,
      popupActivo5: false,
      checkbox_create_another: false,
      checkbox_remove_another: false,

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: "",

      /* Loading */
      backgroundLoading: "primary",
      colorLoading: "#fff",
      loader: true,
    };
  },
  components: {
    ActionButton,
    DataViewSidebar,
    Money,
    vSelect,
  },
  computed: {
    ...mapGetters({
      activeUser: "authentificated/getAuth",
      ags: "association/getAgs",
      currentAssociation: "association/getCurrentAssociation",
    }),
    admin() {
      return this.isSuperAdministrator;
    },
    lotsData() {
      return this.$store.state.association.lots;
    },

    beneficiairesData() {
      if (this.lotsData != null) return this.newTimeline(this.lotsData);
    },

    comptesData() {
      return this.selectOptionAccount();
    },

    usersData() {
      return this.selectOptionMembers();
    },

    validateForm() {
      return (
        (this.activite_courante.Tontine.type == "FIXE" &&
          this.membre != "" &&
          this.nombre_noms != "" &&
          this.loader) ||
        (this.activite_courante.Tontine.type == "VARIABLE" &&
          this.membre != "" &&
          this.nombre_noms != "" &&
          this.loader &&
          this.montant_cotisation != 0)
      );
    },

    // Computes the end date of a tontine
    tontineEndDate() {
      let ags = this.$store.state.association.ags;

      if (
        this.activite_courante.Tontine.type == "VARIABLE" &&
        this.activite_courante.Tontine.part_cotisation == 1
      )
        return this.activite_courante.Tontine.date_fin;
      else if (
        this.activite_courante.Tontine.type == "VARIABLE" &&
        this.activite_courante.Tontine.part_cotisation == 0 &&
        this.activite_courante.Tontine.date_fin
      )
        return ags[
          ags.findIndex(
            (ag) => ag.date_ag == this.activite_courante.Tontine.date_debut
          ) +
            this.activite_courante.Tontine.date_fin -
            1
        ].date_ag;
      else if (this.activite_courante.Tontine.type == "FIXE") {
        let duree = 0;

        duree = parseInt(
          this.activite_courante.Tontine.montant_cagnote /
            this.activite_courante.Tontine.montant_part
        );

        return ags[
          ags.findIndex(
            (ag) => ag.date_ag == this.activite_courante.Tontine.date_debut
          ) +
            duree -
            1
        ].date_ag;
      } else return ags[ags.length - 1].date_ag;
    },
  },
  methods: {
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
              this.$t("balance"),
              this.$t("debt"),
              this.$t("assets"),
              this.$t("interests"),
              this.$t("expectedPayment"),
              this.$t("expectedDisbursement"),
            ],
            body: this.$refs['accountsTable'].queriedResults.map((account) => [
              account.membre,
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
    /* Fonction pour filtrer vles caractères */
    filterKey(e) {
      const key = e.key;

      // If is '.' key, stop it
      if (key === ".") return e.preventDefault();

      // OPTIONAL
      // If is 'e' key, stop it
      if (key === "e" || key === "E") return e.preventDefault();
    },

    /* Option de selection des membres */
    selectOptionMembers() {
      let data = this.$store.state.association.members;
      let membres = [];
      if (data.length && this.comptesData.length)
        data.forEach((membre) => {
          if (
            !this.comptesData.some((compte) => compte.membres_id == membre.id)
          ) {
            membres.push(membre);
          }
        });
      if (membres.length) this.membre = membres[0];

      return membres;
    },

    selectOptionAccount() {
      let comptes = this.$store.state.association.accounts;
      let data = comptes.sort((a, b) => (a.membre > b.membre ? 1 : -1));
      let accounts = [];

      this.solde_activite = 0;
      this.dette_activite = 0;
      this.avoir_activite = 0;
      this.versement_activite = 0;
      this.decaissement_activite = 0;
      this.interet_activite = 0;

      if (data.length)
        data.forEach((acc) => {
          if (acc.deleted_at == null) {
            accounts.push(acc);
          }

          this.solde_activite += acc.statistiques.solde;
          this.dette_activite +=
            acc.statistiques.dettes_cotisations +
            acc.statistiques.dettes_acquitements;
          this.avoir_activite += acc.statistiques.avoirs;
          this.versement_activite += acc.statistiques.encaissement;
          this.decaissement_activite += acc.statistiques.decaissement;
          this.interet_activite += acc.statistiques.interet;
        });
      if (accounts.length) this.compte = accounts[0];

      return accounts;
    },

    /* Ajouter un membre dans une tontine */
    addMember(idLoader) {
      this.openLoadingContained(idLoader, "primary");
      let cotisation = 0;

      if (this.activite_courante.Tontine.type == "FIXE") {
        cotisation = this.activite_courante.Tontine.montant_part;
      } else {
        cotisation = this.montant_cotisation;
      }
      tontineRegisterMembers({
        actId: this.activite_courante.id,
        memId: this.membre.id,
        data: {
          activites_id: this.activite_courante.id,
          membres_id: this.membre.id,
          nombre_noms: this.nombre_noms,
          montant_cotisation: cotisation,
        },
      })
        .then(() => {
          if (!this.checkbox_create_another) this.popupActivo4 = false;
          this.loader = true;
          this.$vs.loading.close(`#${idLoader} > .con-vs-loading`);
          this.$vs.notify({
            position: "top-center",
            text: this.$t("notifContent"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          this.getAccounts(this.activite_courante.id);
        })
        .catch((err) => {
          this.loader = true;
          this.$vs.loading.close(`#${idLoader} > .con-vs-loading`);
          this.$vs.notify({
            position: "top-center",
            text: err.response.data.data.errMsg,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    /* Ajouter un membre dans une tontine */
    deleteItem(idLoader) {
      this.openLoadingContained(idLoader, "danger");
      deleteMember({
        actId: this.activite_courante.id,
        cptId: this.compte.id,
      })
        .then((res) => {
          if (!this.checkbox_remove_another) this.popupActivo5 = false;
          this.loader = true;
          this.$vs.loading.close(`#${idLoader} > .con-vs-loading`);
          this.$vs.notify({
            position: "top-center",
            text: res.data.data,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          this.getAccounts(this.activite_courante.id);
        })
        .catch((err) => {
          this.loader = true;
          this.$vs.loading.close(`#${idLoader} > .con-vs-loading`);
          this.$vs.notify({
            position: "top-center",
            text: err.response.data.data.errMsg,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    attributionLot(att) {
      return allocation_lots.reduce(
        (a, o) => (o.value == att ? a.concat(this.$t(o.i18n)) : a),
        ""
      );
    },

    addNewData(etat) {
      this.etat = etat;
      this.sidebarData = {};
      this.toggleDataSidebar(true);
    },

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
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
    //Retourne la liste des membres inscris à la tontine
    getAccounts(activity_id) {
      let payload = {
        resourceUrl: "/api/activite/" + activity_id + "/comptes/all",
        commitAction: "SET_ACCOUNTS",
      };

      this.$store
        .dispatch("association/fetchComptemembreActivite", payload)
        .then((res) => {
          EventBus.$emit("loader", false);
          let comptes = res.data.data;
          this.$store.commit("association/SET_ACCOUNTS", comptes);

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

          this.total_caisse += this.solde_activite;
          let payload = {
            resourceUrl:
              "/api/association/" +
              this.association_courante.id +
              "/tontine/" +
              this.activite_courante.Tontine.id +
              "/lots",
            commitAction: "SET_LOTS",
          };
          this.$store
            .dispatch("association/fetchAssociationactivite", payload)
            .then((res) => {
              this.$store.commit("association/SET_LOTS", res.data.data);
            })
            .catch((error) => {
              window.console.error(error);
            });
        })
        .then(() => {
          EventBus.$emit("loader", false);
          this.isReady = true;
        })
        .catch((error) => {
          EventBus.$emit("loader", false);
          window.console.error(error);
          this.isReady = true;
        });
    },
    //Retourne les dates de bouffe d'un membre
    getEtatLot(membre_id) {
      let dates = [];
      this.lotsData.forEach((lot) => {
        if (lot.membres_id == membre_id) {
          dates.push(lot.etat);
        }
      });

      return dates;
    },
    //Retourne les lots d'un membre
    getLots(membre_id) {
      let lots = [];
      this.lotsData.forEach((lot) => {
        if (lot.membres_id == membre_id && lot.date_bouffe != null) {
          lots.push(lot);
        }
      });

      return lots;
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
          "/association/administration/activities/tontine/member-transactions"
        );
      else
        this.$router.push(
          "/association/activities/tontine/member-transactions"
        );
    },

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

    extractTimeLine(lots) {
      var lots_tries = [];

      //trié les lots par date
      lots.sort((a, b) => (a.date_bouffe > b.date_bouffe ? 1 : -1));

      //Grouper les lots en date de bouffe
      var current = 0;
      var index = 0;
      var cnt = 1;
      lots_tries.push({
        date_bouffe: lots[0].date_bouffe,
        beneficiaires: new Array(lots[0].membre),
        bouffent: 1,
        etat_ag: lots[0].etat_ag,
        montant: lots[0].montant,
      });
      for (var i = 1; i < lots.length; i++) {
        if (lots[i].date_bouffe != lots[current].date_bouffe) {
          cnt = 1;
          /* window.console.log(lots[i].date_bouffe) */
          lots_tries.push({
            date_bouffe: lots[i].date_bouffe,
            beneficiaires: new Array(lots[i].membre),
            bouffent: cnt,
            etat_ag: lots[i].etat_ag,
            montant: lots[i].montant,
          });
          current = i;
          index++;
        } else {
          lots_tries[index].beneficiaires.push(lots[i].membre);
          lots_tries[index].bouffent++;
        }
      }

      //Retrait des lots ayant une date de bouffe égale à null dans le tableau
      lots_tries.forEach((lot) => {
        if (lot.date_bouffe == null) {
          let index = lots_tries.indexOf(lot);
          delete lots_tries[index];
        }
      });
      return lots_tries;
    },

    newTimeline(lots) {
      let tour_bouffe = [];

      let ags = this.ags;
      let tontine_courante = this.activite_courante.Tontine;

      if (ags != null) {
        let ags = this.ags;
        let benef = [];

        /* window.console.log(ags) */
        lots.forEach((value) => {
          ags.forEach((element) => {
            if (element.date_ag === value.date_bouffe) {
              benef.push({
                id: value.id,
                montant: value.montant,
                date_bouffe: value.date_bouffe,
                created_by: value.created_by,
                date_created: value.date_created,
                updated_by: value.updated_by,
                date_updated: value.date_updated,
                tontines_id: value.tontines_id,
                comptes_id: value.comptes_id,
                echeanciers_id: value.echeanciers_id,
                etat: value.etat,
                type: value.type,
                montant_recu: value.montant_recu,
                membre: value.membre,
                membres_id: value.membres_id,
                etat_ag: element.etat,
              });
            }
          });
        });

        ags.forEach((value) => {
          if (
            !benef.some((element) => element.date_bouffe === value.date_ag) &&
            value.date_ag >= tontine_courante.date_debut &&
            value.date_ag <= this.tontineEndDate
          ) {
            benef.push({
              id: value.id,
              montant: 0,
              date_bouffe: value.date_ag,
              date_created: value.create_at,
              date_updated: value.update_at,
              etat: value.etat,
              montant_recu: 0,
              membre: this.$t("undetermined"),
              membres_id: value.membres_id,
              etat_ag: value.etat,
            });
          }
        });

        /* window.console.log(benef) */
        let timeline = [];

        if (benef.length > 0) timeline = this.extractTimeLine(benef);
        if (timeline.length > 0) {
          timeline.forEach((element) => {
            tour_bouffe.push({
              icon: "report_problem",
              name: element.beneficiaires[0],
              title: element.date_bouffe,
              subtitle: element.beneficiaires,
              completed: true,
              etat_ag: element.etat_ag,
              montant: element.montant,
            });
          });
        }
      }
      return tour_bouffe;
    },
    //Regrouper les beneficiaires par ags
    groupBeneficiaries(lots) {
      let tour_bouffe = [];

      if (lots.length > 0) {
        let ags = this.ags;
        let benef = [];

        /* window.console.log(ags) */
        lots.forEach((value) => {
          ags.forEach((element) => {
            if (element.date_ag === value.date_bouffe) {
              benef.push({
                id: value.id,
                montant: value.montant,
                date_bouffe: value.date_bouffe,
                created_by: value.created_by,
                date_created: value.date_created,
                updated_by: value.updated_by,
                date_updated: value.date_updated,
                tontines_id: value.tontines_id,
                comptes_id: value.comptes_id,
                echeanciers_id: value.echeanciers_id,
                etat: value.etat,
                type: value.type,
                montant_recu: value.montant_recu,
                membre: value.membre,
                membres_id: value.membres_id,
                etat_ag: element.etat,
              });
            }
          });
        });

        lots.forEach((value) => {
          if (
            !benef.some((element) => element.id === value.id) &&
            value.date_bouffe != null
          ) {
            benef.push({
              id: value.id,
              montant: value.montant,
              date_bouffe: value.date_bouffe,
              created_by: value.created_by,
              date_created: value.date_created,
              updated_by: value.updated_by,
              date_updated: value.date_updated,
              tontines_id: value.tontines_id,
              comptes_id: value.comptes_id,
              echeanciers_id: value.echeanciers_id,
              etat: value.etat,
              type: value.type,
              montant_recu: value.montant_recu,
              membre: value.membre,
              membres_id: value.membres_id,
              etat_ag: "past",
            });
          }
        });

        /* window.console.log(benef) */
        let timeline = [];

        if (benef.length > 0) timeline = this.extractTimeLine(benef);
        if (timeline.length > 0) {
          timeline.forEach((element) => {
            tour_bouffe.push({
              icon: "report_problem",
              name: element.beneficiaires[0],
              title: element.date_bouffe,
              subtitle: element.beneficiaires,
              completed: true,
              etat_ag: element.etat_ag,
              montant: element.montant,
            });
          });
        }
      }
      return tour_bouffe;
    },

    //Extraire les membres inscris et leur nombre de noms
    extractMembers(lots) {
      var membres_tries = [];
      var membres = [];

      lots.forEach((element) => {
        membres.push(element.membre);
      });
      for (var i = 0; i < membres.length - 1; i++) {
        var cnt = 1;
        for (var j = i + 1; j < membres.length; j++) {
          if (membres[i] == membres[j]) cnt = cnt + 1;
        }
        membres_tries.push({
          nom: membres[i],
          part: cnt,
        });
      }
      return membres_tries;
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
    //Retourne la valeur de proprieté "text" de l'objet type tontine
    fetchTextPropertyTontineType(value) {
      return tontine_type.reduce(
        (a, o) => (o.value == value ? a.concat(this.$t(o.i18n)) : a),
        ""
      );
    },

    //Retourne la valeur de proprieté "text" de l'objet type penalite
    fetchTextPropertyPenalityType(value) {
      return penality_type.reduce(
        (a, o) => (o.value == value ? a.concat(this.$t(o.i18n)) : a),
        ""
      );
    },
    /**
     * scrollTo - Horizontal Scrolling
     * @param {(HTMLElement ref)} element - Scroll Container
     * @param {number} scrollPixels - pixel to scroll
     * @param {number} duration -  Duration of scrolling animation in millisec
     */
    scroll(timestamp, duration, startTime, element, scrollPixels, scrollPos) {
      //Calculate the timeelapsed
      const timeElapsed = timestamp - startTime;
      //Calculate progress
      const progress = Math.min(timeElapsed / duration, 1);
      //Set the scrolleft
      element.scrollLeft = scrollPos + scrollPixels * progress;
      //Check if elapsed time is less then duration then call the requestAnimation, otherwise exit
      if (timeElapsed < duration) {
        //Request for animation
        /* window.requestAnimationFrame(scroll); */
      } else {
        return;
      }
    },
    scrollTo(element, scrollPixels, duration) {
      const scrollPos = element.scrollLeft;
      // Condition to check if scrolling is required
      if (
        !(
          (scrollPos === 0 || scrollPixels > 0) &&
          (element.clientWidth + scrollPos === element.scrollWidth ||
            scrollPixels < 0)
        )
      ) {
        // Get the start timestamp
        const startTime =
          "now" in window.performance
            ? performance.now()
            : new Date().getTime();

        this.scroll(
          new Date().getTime(),
          duration,
          startTime,
          element,
          scrollPixels,
          scrollPos
        );
        //Call requestAnimationFrame on scroll function first time
        /* window.requestAnimationFrame(scroll); */
      }
    },
    swipeLeft() {
      const content = this.$refs.content;
      this.scrollTo(content, -300, 800);
    },
    swipeRight() {
      const content = this.$refs.content;
      this.scrollTo(content, 300, 800);
    },

    //exporation du tableau en csv
    csvExport(arrData) {
      let curr_ass = this.currentAssociation;

      functions.csvExportTourBouffe(arrData, curr_ass);
    },

    exportPDF(arrData) {
      let current_ass = this.currentAssociation;

      functions.exportPDFTourBouffe(arrData, current_ass);
    },

    //exporation du tableau en csv
    exportExel(arrData) {
      let cur_ass = this.currentAssociation;

      functions.exportExelTourBouffe(arrData, cur_ass);
    },

    // Method to finish the created() job in both cases
    finishCreatedJob(association_courante, activity_id) {
      let payload = {
        resourceUrl: "/api/association/" + association_courante.id + "/membre",
        commitAction: "SET_MEMBERS",
      };

      this.$store
        .dispatch("association/fetchMembers", payload)
        .then((res) => {
          this.membre_id = this.extractMember(res.data.data);

          //Recupperer les lots d'un membre
          this.lots_membre = this.getLots(this.membre_id);

          //Initialisation de l'objet tontine(parameterTab)
          let lots = this.activite_courante.Tontine.lots;
          this.$store.commit("association/SET_LOTS", lots);
          //Exraction de noms des membres inscris et le nombre de part à partir des lots
          var membres = this.extractMembers(lots);

          membres.forEach((element) => {
            this.membre_incris.push({
              nom: element.nom,
              part: element.part,
            });
          });
          //Recupperer la devise de la sociation
          this.devise = association_courante.devise;

          /* Visibilité de l'association courante */
          this.visibilite = association_courante.visibilite_financiere;

          //Recupperer la liste des comptes de l'activité
          this.getAccounts(activity_id);
        })
        .catch((error) => {
          window.console.error(error);
          this.isReady = true;
        });
    },

    openLoadingContained(idLoader, background) {
      this.loader = false;
      this.$vs.loading({
        background: background,
        color: this.colorLoading,
        container: `#${idLoader}`,
        scale: 0.45,
      });
    },
  },
  mounted() {
    let interval = setInterval(() => {
      let currentLotDiv = document.querySelector("#actualLot");
      if (currentLotDiv !== null) {
        currentLotDiv.scrollIntoViewIfNeeded(true);
        clearInterval(interval);
      }
    }, 1000);
  },
  created() {
    EventBus.$emit("loader", true);
    this.association_courante =
      this.$store.getters["association/getCurrentAssociation"];

    let activityExists = this.$store.state.association.activite != "";
    let activity_id = activityExists
      ? this.$store.state.association.activite.id
      : localStorage.getItem("activity_id");

    let payload = {
      resourceUrl:
        "api/association/" +
        this.association_courante.id +
        "/activite/" +
        activity_id,
      commitAction: "SET_ACTIVITE",
    };

    this.$store
      .dispatch("association/fetchAssociationactivite", payload)
      .then((res) => {
        this.activite_courante = res.data.data;
        this.checkActivityType(this.activite_courante);
        this.finishCreatedJob(this.association_courante, activity_id);
      })
      .catch((error) => {
        window.console.error(error);
        this.isReady = true;
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

.swipe {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
}

.swipe .vs-icon {
  color: #000;
}

.list-member {
  overflow: auto;
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
<style lang="scss">
.Timeline {
  display: flex;
  align-items: center;
  margin-top: 25px;
}

.event1,
.event2,
.event3 {
  position: relative;
}

.event1Bubble {
  position: absolute;
  background-color: rgba(158, 158, 158, 0.1);
  width: 139px;
  height: 60px;
  top: -70px;
  left: -15px;
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(158, 158, 158, 0.64);
}

.event2Bubble {
  position: absolute;
  margin: 0 auto;
  left: -55px;
  top: 33px;
}

/* .event1Bubble:after,
    .event1Bubble:before,
    .event2Bubble:after,
    .event2Bubble:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
        border-color: transparent;
        border-bottom: 0;
    } */

.event1Bubble:before {
  bottom: -10px;
  left: 13px;
  border-top-color: rgba(222, 222, 222, 0.66);
  border-width: 12px;
}

.event1Bubble:after {
  bottom: -8px;
  left: 13px;
  border-top-color: #f6f6f6;
  border-width: 12px;
}

.event2Bubble:before {
  bottom: 59px;
  left: 103px;
  border-top-color: rgba(222, 222, 222, 0.66);
  border-width: 12px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.event2Bubble:after {
  bottom: 57px;
  left: 103px;
  border-top-color: #f6f6f6;
  border-width: 12px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.eventTime {
  display: flex;
}

.DayDigit {
  font-size: 27px;
  margin-left: 10px;
  color: #4c4a4a;
}

.Day {
  font-size: 11px;
  margin-left: 5px;
  font-weight: bold;
  margin-top: 10px;
  color: #4c4a4a;
}

.MonthYear {
  font-weight: 600;
  line-height: 10px;
  color: #9e9e9e;
  font-size: 9px;
}

.eventTitle {
  font-size: 11px;
  text-transform: uppercase;
  display: flex;
  flex: 1;
  align-items: center;
  margin-left: 12px;
  margin-top: -2px;
}

.time {
  position: absolute;
  width: 50px;
  font-size: 8px;
  margin-top: -3px;
  margin-left: -5px;
  color: #9e9e9e;
}

.eventAuthor {
  position: absolute;
  color: #9e9e9e;
  font-size: 8px;
  width: 100px;
  top: -8px;
  left: 63px;
}

.event2Author {
  position: absolute;
  color: #9e9e9e;
  font-size: 8px;
  width: 100px;
  top: 96px;
  left: -32px;
}

.time2 {
  position: absolute;
  margin-top: -41px;
  margin-left: -35px;
}

.Timeline {
  .vs-chip--text {
    display: -webkit-box;
    display: -ms-flexbox;
    display: block;
    -webkit-box-align: left;
    -ms-flex-align: left;
    align-items: left;
    -webkit-box-pack: left;
    -ms-flex-pack: left;
    justify-content: left !important;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 110px;
    overflow: hidden;
  }
}

.futureGray {
  filter: grayscale(1);
  -webkit-filter: grayscale(1);
}

.futureOpacity {
  -webkit-filter: opacity(0.3);
  filter: opacity(0.3);
}

/*! rtl:begin:ignore */
#dashboard-analytics {
  .greet-user {
    position: relative;
    min-height: 13rem;

    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }

    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media (max-width: 576px) {
    .decore-left,
    .decore-right {
      width: 140px;
    }
  }
}

.product-name {
  max-width: 13rem;
}

.pop_up .vs-popup {
  width: 900px !important;
}

.select-member {
  .vs__dropdown-menu {
    height: 150px !important;
  }
}

.delete-member {
  .vs__dropdown-menu {
    height: 150px !important;
  }
}
</style>
