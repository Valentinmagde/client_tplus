<template>
  <div v-if="isReady" id="data-list-list-views" class="data-list-container">
    <!-- ACTION - DROPDOWN -->
    <action-button :activity="activite_courante" />

    <!-- Popup pour detail credit-->
    <vs-popup
      id="popup"
      classContent="popup-example"
      class="popup-position"
      :title="$t('previewSettlements')"
      :active.sync="popupNombreEcheance"
    >
      <p class="vs-input--label">{{ $t("numberOfDeadline") }}</p>
      <vs-input
        type="number"
        v-model="nombre"
        class="w-full"
        step="1"
        min="1"
      />

      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button
          color="#626262"
          @click="popupNombreEcheance = false"
          type="border"
          >{{ $t("cancel") }}</vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3"
          color="danger"
          @click.stop="changeEcheanceNumbers()"
          >{{ $t("redefine") }}</vs-button
        >
      </div>
    </vs-popup>
    <!-- Popup pour detail credit-->
    <vs-popup
      id="popup"
      classContent="popup-example"
      class="popup-position"
      :title="$t('previewSettlements')"
      :active.sync="popupDetail"
    >
      <p class="ml-4 mb-1 font-medium">{{ $t("creditDetail") }}</p>
      <table v-if="echeances" class="w-full border-collapse">
        <thead>
          <tr>
            <th class="w-1/2 px-4 py-2 th-bg">{{ $t("Capital") }}</th>
            <th class="w-1/2 px-4 py-2 th-bg">{{ $t("generalInterest") }}</th>
            <th class="w-1/2 px-4 py-2 th-bg">
              {{ $t("amountToBeReceived") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="w-1/2 px-4 py-2 text-base">
              <p :class="{ redtextclass: echeances.detail.montant_credit < 0 }">
                {{ echeances.detail.montant_credit | formatMoney(devise) }}
              </p>
            </td>
            <td class="w-1/2 px-4 py-2 text-base">
              <p :class="{ redtextclass: echeances.detail.interet < 0 }">
                {{ echeances.detail.montant_interet | formatMoney(devise) }}
              </p>
            </td>
            <td class="w-1/2 px-4 py-2 text-base">
              <p
                :class="{ redtextclass: echeances.detail.montant_a_payer < 0 }"
              >
                {{ echeances.detail.montant_restant | formatMoney(devise) }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <p class="ml-4 mt-5 mb-1 font-medium">{{ $t("settlementsDetail") }}</p>
      <table v-if="echeances" class="w-full border-collapse">
        <thead>
          <tr>
            <th class="w-1/2 px-4 py-2 th-bg">{{ $t("Amount") }}</th>
            <th class="w-1/2 px-4 py-2 th-bg">{{ $t("Deadlines") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="indextr" v-for="(echeance, indextr) in echeances.echeances">
            <td class="w-1/2 px-4 py-2 text-base">
              <p :class="{ redtextclass: echeance.montant < 0 }">
                {{ echeance.montant | formatMoney(devise) }}
              </p>
            </td>
            <td class="w-1/2 px-4 py-2 text-base">
              <p
                v-if="echeance.etat != 'cloture' && echeance.date_limite == 0"
                class="product-name"
              >
                {{ $t("nextCycle") }}
              </p>
              <p
                v-if="echeance.etat != 'cloture' && echeance.date_limite != 0"
                class="product-name"
              >
                {{ echeance.date_limite | dateTime }}
              </p>
              <p v-if="echeance.etat == 'cloture'" class="product-name">
                {{ $t("clotureState") }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="#626262" @click="popupDetail = false" type="border">{{
          $t("cancel")
        }}</vs-button
        >&nbsp;&nbsp;
        <!-- <vs-button class="ml-3" color="danger" @click.stop="deleteItem(mise_selectionnee)">{{$t('delete')}}</vs-button> -->
      </div>
    </vs-popup>

    <!-- Popup pour rejeter un credit-->
    <vs-popup
      classContent="popup-example"
      :title="$t('rejectionConfirmation')"
      :active.sync="popupActivo2"
    >
      <p>{{ $t("rejectConfirm") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="warning" @click="popupActivo2 = false" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3"
          color="danger"
          @click.stop="reject(credit_selectionne)"
        >
          {{ $t("reject") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour annuler un credit-->
    <vs-popup
      classContent="popup-example"
      :title="$t('cancelConfirmation')"
      :active.sync="popupActivo3"
    >
      <p>{{ $t("cancelConfirmationSubtitle") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="#626262" @click="popupActivo3 = false" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;
        <vs-button
          class="ml-3"
          color="#626262"
          @click.stop="cancelCredit(credit_selectionne)"
        >
          {{ $t("save") }}
        </vs-button>
      </div>
    </vs-popup>

    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
      :mutual="mutuelle"
    />

    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <vx-card class="mb-base">
        <h4 class="mb-2">
          {{ $t("ACtivityUpper") }} {{ activite_courante.nom | CAPITALIZE }}
        </h4>
        <p>{{ activite_courante.description }}</p>
        <div class="vx-row mt-4">
          <!-- Methode de calcul d'interet -->
          <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
            <span class="inline-block min-w-0"
              >{{ $t("interestCalculationMethod") }}:</span
            >
            <span class="ml-1 font-semibold">{{
              activite_courante.Mutuelle.methode_calcul_interet
            }}</span>

            <!-- Espaceur vertical -->
            <span class="ml-5 items-center">
              <span class="font-semibold">|</span>
            </span>
          </div>

          <!-- Montant maximum enpruntable -->
          <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
            <span class="inline-block min-w-0"
              >{{ $t("maximumBorrowableAmount") }}:</span
            >
            <span class="ml-1 font-semibold">{{
              activite_courante.Mutuelle.maximum_empruntable
                | formatMoney(devise)
            }}</span>

            <!-- Espaceur vertical -->
            <span class="ml-5 items-center">
              <span class="font-semibold">|</span>
            </span>
          </div>

          <!-- Remboursement -->
          <div class="vx-col sm:w-full md:w-auto w-auto items-center mb-2">
            <span class="inline-block min-w-0">{{ $t("refunds") }}:</span>
            <span class="ml-1 font-semibold">{{
              activite_courante.Mutuelle.remboursement | remboursement
            }}</span>
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
              @click.stop="sendData('ParametresMutuelle')"
            >
              {{ $t("seeMore") }}
            </p>
          </div>
        </div>
      </vx-card>

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
        <!-- SITUATION FINANCIERE-->
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
              <!-- Avoirs -->
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
              </li>

              <!-- Intérêts générés -->
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
            icon="cash-payment-coin-1"
            :paymentTitle="$t('saveAPayment')"
            :admin="admin"
            :paymentlink="
              admin
                ? '/association/administration/finances/payment'
                : '/association/finances/payment'
            "
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
            :statisticTitle="$t('expectedDisbursement')"
            :admin="admin"
            :paymentlink="
              admin ? '/association/administration/finances/withdrawal' : ''
            "
            :statistic="decaissement_activite | formatMoney(devise)"
            :paymentTitle="$t('makeADisbursement')"
            color="success"
          />
        </div>
      </div>

      <!-- LISTE DES TRANSACTIONS DU MEMBRE -->
      <div v-if="!admin && visibilite == 'OUVERT'" class="vx-row">
        <div
          v-if="transactions_membre.length > 0"
          class="vx-col w-full mb-base"
        >
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
                    <vs-dropdown-item
                      @click.native="transactionsExport('excel')"
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

      <!-- Liste des Crédits en cours -->
      <div class="vx-row mb-base">
        <div class="vx-col w-full">
          <vx-card>
            <div slot="no-body" class="mt-4">
              <vs-table
                search
                ref="currentCreditsTable"
                :data="creditsData"
                :max-items="creditsData.length"
                class="table-dark-inverted overflow-auto"
                style="max-height: 21rem"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">{{ $t("loansInProgress") }}</h4>
                  <div class="flex flex-row mr-2">
                    <vs-dropdown
                      vs-trigger-click
                      class="relative right-0 cursor-pointer self-end mr-2"
                    >
                      <small class="flex cursor-pointer">
                        <span>{{ $t("exports") }}</span>
                        <feather-icon
                          icon="ChevronDownIcon"
                          svgClasses="h-4 w-4"
                          class="mr-1"
                        />
                      </small>
                      <vs-dropdown-menu class="w-32">
                        <vs-dropdown-item @click.native="creditsExport('pdf')"
                          >PDF</vs-dropdown-item
                        >
                        <vs-dropdown-item @click.native="creditsExport('csv')"
                          >CSV</vs-dropdown-item
                        >
                        <vs-dropdown-item @click.native="creditsExport('excel')"
                          >EXCEL</vs-dropdown-item
                        >
                      </vs-dropdown-menu>
                    </vs-dropdown>
                    <vs-dropdown
                      v-if="admin"
                      vs-trigger-click
                      class="relative right-0 cursor-pointer self-end mr-2"
                    >
                      <small class="flex cursor-pointer">
                        <feather-icon
                          icon="FilterIcon"
                          svgClasses="h-4 w-4"
                          class="mr-1"
                        />
                        <span>{{ $t("filter") }}</span>
                      </small>
                      <vs-dropdown-menu class="w-32">
                        <vs-dropdown-item
                          @click.native="getCreditWithState('all')"
                          >{{ $t("all") }}</vs-dropdown-item
                        >
                        <vs-dropdown-item
                          @click.native="getCreditWithState('VALIDE')"
                          >{{ $t("validated") }}</vs-dropdown-item
                        >
                        <vs-dropdown-item
                          @click.native="getCreditWithState('EN_ATTENTE')"
                          >{{ $t("waiting") }}</vs-dropdown-item
                        >
                        <vs-dropdown-item
                          @click.native="getCreditWithState('cloture')"
                          >{{ $t("clotureState") }}</vs-dropdown-item
                        >
                        <vs-dropdown-item
                          @click.native="getCreditWithState('EN_COURS')"
                          >{{ $t("inProgress") }}</vs-dropdown-item
                        >
                        <vs-dropdown-item
                          @click.native="getCreditWithState('REJETE')"
                          >{{ $t("rejected") }}</vs-dropdown-item
                        >
                        <vs-dropdown-item
                          @click.native="getCreditWithState('ANNULE')"
                          >{{ $t("cancel") }}</vs-dropdown-item
                        >
                      </vs-dropdown-menu>
                    </vs-dropdown>
                  </div>
                </div>
                <template slot="thead">
                  <vs-th sort-key="membre">{{
                    $t("members") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="montant_credit"
                    ><span class="text-right w-full">{{
                      $t("creditAmount") | CAPITALIZE
                    }}</span></vs-th
                  >
                  <vs-th sort-key="montant_restant"
                    ><span class="text-right w-full">{{
                      $t("remainingAmount") | CAPITALIZE
                    }}</span></vs-th
                  >
                  <vs-th sort-key="date_demande"
                    ><span class="text-right w-full">{{
                      $t("startDate") | CAPITALIZE
                    }}</span>
                  </vs-th>
                  <vs-th sort-key="date_limite"
                    ><span class="text-right w-full">{{
                      $t("Deadlines") | CAPITALIZE
                    }}</span>
                  </vs-th>
                  <vs-th sort-key="etat"
                    ><span class="text-right w-full">{{
                      $t("state") | CAPITALIZE
                    }}</span></vs-th
                  >
                  <vs-th sort-key="action">
                    <span class="text-right w-full">{{
                      $t("actions") | CAPITALIZE
                    }}</span>
                  </vs-th>
                </template>

                <template slot-scope="{ data }">
                  <vs-tr v-for="(tr, indextr) in data" :key="indextr">
                    <vs-td :data="data[indextr].membre">
                      <p class="product-name font-medium truncate">
                        {{ data[indextr].membre }}
                      </p>
                    </vs-td>
                    <vs-td
                      :data="data[indextr].montant_credit"
                      class="text-right"
                      :class="{
                        redtextclass: data[indextr].montant_credit < 0,
                      }"
                    >
                      {{ data[indextr].montant_credit | formatMoney(devise) }}
                    </vs-td>
                    <vs-td
                      :data="data[indextr].montant_restant"
                      :class="{
                        redtextclass: data[indextr].montant_restant < 0,
                      }"
                      class="text-right"
                    >
                      {{ data[indextr].montant_restant | formatMoney(devise) }}
                    </vs-td>
                    <vs-td class="text-right" :data="data[indextr].date_demande">
                    {{ data[indextr].date_demande | dateTime }}
                    </vs-td>

                    <vs-td class="text-right" :data="data[indextr].date_limite">
                      {{
                          deadline(
                            data[indextr].date_demande,
                            data[indextr].date_limite
                          )
                        }}
                    </vs-td>

                    <vs-td class="flex flex-row justify-end" :data="data[indextr].etat">
                      <p
                        v-if="data[indextr].etat == 'EN_ATTENTE'"
                        class="product-price"
                      >
                        <vs-chip color="#FF9F42">{{ $t("waiting") }}</vs-chip>
                      </p>
                      <p
                        v-if="data[indextr].etat == 'VALIDE'"
                        class="product-price"
                      >
                        <vs-chip color="#28C76F">{{ $t("validated") }}</vs-chip>
                      </p>
                      <p
                        v-if="data[indextr].etat == 'REJETE'"
                        class="product-price"
                      >
                        <vs-chip color="#FF0100">{{ $t("rejected") }}</vs-chip>
                      </p>

                      <p
                        v-if="data[indextr].etat == 'EN_COURS'"
                        class="product-price"
                      >
                        <vs-chip color="#3383c8">{{
                          $t("inProgress")
                        }}</vs-chip>
                      </p>

                      <p
                        v-if="data[indextr].etat == 'cloture'"
                        class="product-price"
                      >
                        <vs-chip>{{ $t("fenced") }}</vs-chip>
                      </p>

                      <p
                        v-if="data[indextr].etat == 'ANNULE'"
                        class="product-price"
                      >
                        <vs-chip color="#626262">{{ $t("cancel") }}</vs-chip>
                      </p>
                    </vs-td>

                    <vs-td class="text-right">
                      <!-- detail un credit  -->
                      <vx-tooltip
                        :text="$t('detail')"
                        position="bottom"
                        class="inline-block ml-2"
                      >
                        <feather-icon
                          icon="EyeIcon"
                          svgClasses="w-5 h-5 hover:text-primary stroke-current"
                          @click="
                            detailCredit(data[indextr].id, 'CreditDetail')
                          "
                        />
                      </vx-tooltip>

                      <!-- modifier echeances un credit  -->
                      <vx-tooltip
                        v-if="
                          admin &&
                          data[indextr].etat != 'ANNULE' &&
                          data[indextr].etat != 'cloture' &&
                          data[indextr].etat != 'REJETE'
                        "
                        :text="$t('redefinePayment')"
                        position="bottom"
                        class="inline-block ml-2"
                      >
                        <feather-icon
                          icon="RotateCwIcon"
                          svgClasses="w-5 h-5 hover:text-primary stroke-current"
                          @click="
                            popupNombreEcheance = true;
                            creditId = data[indextr].id;
                          "
                        />
                      </vx-tooltip>

                      <!-- Valider un credit  -->
                      <vx-tooltip
                        v-if="admin && data[indextr].etat == 'EN_ATTENTE'"
                        :text="$t('Validate')"
                        position="bottom"
                        class="inline-block ml-2"
                      >
                        <feather-icon
                          icon="CheckSquareIcon"
                          svgClasses="w-5 h-5 hover:text-primary stroke-current"
                          @click="validerCredit(data[indextr].id)"
                        />
                      </vx-tooltip>

                      <!-- Rejeter un credit -->
                      <vx-tooltip
                        v-if="admin && data[indextr].etat == 'EN_ATTENTE'"
                        :text="$t('reject')"
                        position="bottom"
                        class="inline-block"
                      >
                        <feather-icon
                          icon="TrashIcon"
                          svgClasses="w-5 h-5 hover:text-danger stroke-current"
                          class="ml-2"
                          @click.stop="
                            popupActivo2 = true;
                            credit_selectionne = data[indextr].id;
                          "
                        />
                      </vx-tooltip>

                      <!-- Mettre à jour un credit -->
                      <vx-tooltip
                        v-if="!admin && data[indextr].etat == 'EN_ATTENTE'"
                        :text="$t('update')"
                        position="bottom"
                        class="inline-block ml-2"
                      >
                        <feather-icon
                          icon="EditIcon"
                          svgClasses="w-5 h-5 hover:text-primary stroke-current"
                          @click="addNewData('updateCredit', data[indextr])"
                        />
                      </vx-tooltip>

                      <!-- Annuler un credit -->
                      <vx-tooltip
                        v-if="!admin && data[indextr].etat == 'EN_ATTENTE'"
                        :text="$t('cancel')"
                        position="bottom"
                        class="inline-block"
                      >
                        <feather-icon
                          icon="TrashIcon"
                          svgClasses="w-5 h-5 hover:text-danger stroke-current"
                          class="ml-2"
                          @click.stop="
                            popupActivo3 = true;
                            credit_selectionne = data[indextr].id;
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
      <!-- Liste des membres inscris -->
      <div v-if="admin || visibilite == 'OUVERT'" class="vx-row">
        <!-- LISTES DES MEMBRES INSCRIS -->
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
                    $router.push(
                      `/association/administration/activities/${activite_courante.id}/add-accounts`
                    )
                  "
                >
                  <vs-icon
                    iconPack="streameline"
                    icon="icon-single-neutral-actions-add"
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
                      <span
                        :class="{ redtextclass: data[indextr].interet < 0 }"
                      >
                        {{ data[indextr].interet | formatMoney(devise) }}
                      </span>
                    </vs-td>
                    <vs-td
                      :data="data[indextr].encaissement"
                      class="text-right"
                    >
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
                    <vs-td
                      :data="data[indextr].decaissement"
                      class="text-right"
                    >
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
                  <tr :key="ind" v-for="(tr, ind) in comptesData">
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
              <p class="flex pt-16 justify-center">
                {{ $t("noElementFound") }}
              </p>
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
  </div>
</template>

<script>
//Component
import ActionButton from "../components/ActionButton.component.vue";
import DataViewSidebar from "../../../../../components/sidebar/DataViewSidebar.component";
import exports from "@/services/exports";
import { mapGetters } from "vuex";
import checkIfAdmin from "../../../../../mixins/checkRole";
import checkActivityType from "../../../mixins/checkActivityType";

//Store
// import moduleCompte from "@/store/compte/moduleCompte.js"
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

//Functions
import { EventBus } from "@/services/EventBus.js";

import { refund } from "../services/data/refundingPolicies";

import i18n from "@/services/i18n/i18n";
export default {
  mixins: [checkIfAdmin, checkActivityType],
  data() {
    return {
      creditId: 0,
      nombre: 0,
      solde_activite: 0,
      dette_activite: 0,
      avoir_activite: 0,
      interet_activite: 0,
      versement_activite: 0,
      decaissement_activite: 0,

      solde_membre: 0,
      dette_membre: 0,
      avoir_membre: 0,
      versement_membre: 0,
      decaissement_membre: 0,

      popupDetail: false,
      popupActivo2: false,
      popupActivo3: false,
      popupNombreEcheance: false,
      credit_selectionne: "",

      activite_courante: [],
      membres_incris: [],
      devise: "",
      details: true,
      contribution: false,
      visibilite: "",
      membre_id: null,
      transactions_membre: [],

      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: "",
      membres: [],
      membre_inscris: [],
      activite: null,
      mutuelle: null,
      echeances: null,
      mut: null,

      isReady: false,
    };
  },
  components: {
    ActionButton,
    DataViewSidebar,
  },
  computed: {
    admin() {
      return this.isSuperAdministrator;
    },
    ...mapGetters({
      activeUser: "authentificated/getAuth",
      currentAssociation: "association/getCurrentAssociation",
    }),
    comptesData() {
      if (this.$store.state.association.accounts) {
        let accounts = this.$store.state.association.accounts;
        return accounts
          .sort((a, b) => (a.membre > b.membre ? 1 : -1))
          .map((account) => ({
            ...account,
            solde: account.statistiques.solde,
            dettes:
              account.statistiques.dettes_acquitements +
              account.statistiques.dettes_cotisations,
            avoirs: account.statistiques.avoirs,
            interet: account.statistiques.interet,
            encaissement: account.statistiques.encaissement,
            decaissement: account.statistiques.decaissement,
          }));
      } else return [];
    },
    memberStatistics() {
      if (this.$store.state.association.statistics != null)
        return this.$store.state.association.statistics;
      else return [];
    },

    creditsData: {
      get() {
        let data = [];
        data = this.$store.state.association.credits.filter(
          (credit) =>
            credit.etat === "EN_COURS" ||
            credit.etat === "EN_ATTENTE" ||
            credit.etat === "VALIDE"
        );
        if (!this.admin)
          data = data.filter((credit) => credit.membres_id === this.membre_id);
        return data;
      },
      set(newValue) {
        let data = newValue;
        if (!this.admin)
          data = data.filter((credit) => credit.membres_id === this.membre_id);
        return data;
      },
    },
  },

  filters: {
    remboursement(remboursement) {
      return refund.reduce(
        (a, o) => (o.value == remboursement ? a.concat(i18n.t(o.i18n)) : a),
        ""
      );
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
    creditsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t(
        "loansInProgress"
      )}`;

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
              this.$t("members"),
              this.$t("creditAmount"),
              this.$t("remainingAmount"),
              this.$t("startDate"),
              this.$t("Deadlines"),
              this.$t("etat"),
            ],
            body: this.$refs['currentCreditsTable'].queriedResults.map(
              (settlement) => [
                settlement.membre,
                this.$options.filters.formatMoney(
                  settlement.montant_credit,
                  this.currentAssociation.devise
                ),
                this.$options.filters.formatMoney(
                  settlement.montant_restant,
                  this.currentAssociation.devise
                ),
                this.$d(settlement.date_demande * 1000),
                this.$d(settlement.date_limite * 1000),
                settlement.etat,
              ]
            ),
          },
          title
        );
      }
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
          "/association/administration/activities/mutual/member-transactions"
        );
      else
        this.$router.push("/association/activities/mutual/member-transactions");
    },
    //Date limite
    deadline(start_date, number) {
      let ags = this.$store.state.association.ags;
      let start = ags.find((e) => e.date_ag == start_date);

      var index = ags.indexOf(start);

      if (index + number >= ags.length) {
        return this.$t("nextCycle");
      } else {
        return this.$options.filters.dateTime(ags[index + number].date_ag);
      }
    },

    addNewData(etat, data) {
      this.etat = etat;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
      this.mutuelle = this.$store.state.association.activite;
    },

    sendData(etat) {
      this.etat = etat;
      this.sidebarData = {};
      this.toggleDataSidebar(true);
      this.mutuelle = this.$store.state.association.activite;
    },

    //detail un credit
    detailCredit(id, etat) {
      let payload = {
        resourceUrl: "api/mutuelle/credit/" + id + "/detail",
        commitAction: "SET_CREDIT",
      };

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then((res) => {
          // this.popupDetail = true
          // this.echeances = res.data.data
          this.etat = etat;
          this.sidebarData = {};
          this.toggleDataSidebar(true);
          this.mutuelle = res.data.data;
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            title: "error",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    //Valider un credit
    validerCredit(id) {
      let payload = {
        resourceUrl: "api/mutuelle/credit/" + id + "/approuve",
        commitAction: "SET_CREDIT",
      };

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then(() => {
          this.popupActivo2 = false;
          this.$vs.notify({
            position: "top-center",

            text: this.$t("creditValidateSuccessfully"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });

          //Recupperer tous les credits de l'activité
          let payload = {
            resourceUrl:
              "api/mutuelle/" + this.activite_courante.Mutuelle.id + "/credits",
            commitAction: "SET_CREDITS",
          };
          this.$store
            .dispatch("association/fetchAssociationactivite", payload)
            .then(() => {
              // Recupperer tous les comptes de l'activité
              this.getAccounts(this.activite_courante.id);
            })
            .catch((error) => {
              window.console.error(error);
            });
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            title: "error",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    //Rejet d'un credit
    reject(id) {
      let activite_courant = this.$store.state.association.activite;

      let payload = {
        resourceUrl:
          "api/activite/" +
          activite_courant.id +
          "/mutuelle/credit/" +
          id +
          "/reject",
        commitAction: "SET_CREDIT",
      };

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then(() => {
          this.popupActivo2 = false;
          this.$vs.notify({
            position: "top-center",

            text: this.$t("creditSuccessfullyRejected"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });

          //Recupperer tous les credits de l'activité
          let payload = {
            resourceUrl:
              "api/mutuelle/" + this.activite_courante.Mutuelle.id + "/credits",
            commitAction: "SET_CREDITS",
          };
          this.$store
            .dispatch("association/fetchAssociationactivite", payload)
            .then(() => {
              // Recupperer tous les comptes de l'activité
              this.getAccounts(this.activite_courante.id);
            })
            .catch((error) => {
              window.console.error(error);
            });
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            title: "error",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    //Annulation d'un credit
    cancelCredit(id) {
      let activite_courant = this.$store.state.association.activite;

      let payload = {
        resourceUrl:
          "api/activite/" +
          activite_courant.id +
          "/mutuelle/credit/" +
          id +
          "/annuler",
        commitAction: "SET_CREDIT",
      };

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then(() => {
          this.popupActivo3 = false;
          this.$vs.notify({
            position: "top-center",

            text: this.$t("creditCancelSuccessfully"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });

          //Recupperer tous les credits de l'activité
          let payload = {
            resourceUrl:
              "api/mutuelle/" + this.activite_courante.Mutuelle.id + "/credits",
            commitAction: "SET_CREDITS",
          };
          this.$store
            .dispatch("association/fetchAssociationactivite", payload)
            .then(() => {
              // Recupperer tous les comptes de l'activité
              this.getAccounts();
            })
            .catch((error) => {
              window.console.error(error);
            });
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            title: "error",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    // Reset aggregates elements before any update
    flushAggregates() {
      this.solde_activite = 0;
      this.dette_activite = 0;
      this.avoir_activite = 0;
      this.interet_activite = 0;
      this.versement_activite = 0;
      this.decaissement_activite = 0;

      this.solde_membre = 0;
      this.dette_membre = 0;
      this.avoir_membre = 0;
    },

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

          this.membres_incris = comptes;
          // Reset aggregates data
          this.flushAggregates();

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
        })
        .then(() => {
          EventBus.$emit("loader", false);
          this.isReady = true;
        })
        .catch((error) => {
          EventBus.$emit("loader", false);
          window.console.error(error);
        });
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

    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },

    // Method to finish the created() job in both cases
    finishCreatedJob(association_courante, activity_id) {
      //Recupperer tous les credits de l'activité
      let payload = {
        resourceUrl:
          "api/mutuelle/" + this.activite_courante.Mutuelle.id + "/credits",
        commitAction: "SET_CREDITS",
      };
      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then(() => {
          let payload = {
            resourceUrl:
              "/api/association/" + association_courante.id + "/membre",
            commitAction: "SET_MEMBERS",
          };

          this.$store
            .dispatch("association/fetchMembers", payload)
            .then((res) => {
              this.membre_id = this.extractMember(res.data.data);

              payload = {
                resourceUrl:
                  "/api/association/" +
                  association_courante.id +
                  "/membre/" +
                  this.membre_id,
                commitAction: "SET_STATISTICS",
              };
              this.$store
                .dispatch("association/fetchMemberActivities", payload)
                .then(() => {
                  //Recupperer la devise de la sociation
                  this.devise = association_courante.devise;

                  /* Visibilité de l'association courante */
                  this.visibilite = association_courante.visibilite_financiere;

                  this.getAccounts(activity_id);
                })
                .catch((error) => {
                  window.console.error(error);
                  this.isReady = true;
                });
            })
            .catch((error) => {
              window.console.error(error);
              this.isReady = true;
            });
        })
        .catch((error) => {
          window.console.error(error);
          this.isReady = true;
        });
    },
    changeEcheanceNumbers() {
      let payload = {
        resourceUrl:
          "api/mutuelle/credit/" +
          this.creditId +
          "/duree/" +
          this.nombre +
          "/redefinir",
        commitAction: "SET_CREDIT",
      };

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then(() => {
          this.popupNombreEcheance = false;
          this.$vs.notify({
            position: "top-center",
            text: this.$t("creditSuccessfullyCreated"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            title: "error",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
    getCreditWithState(etat) {
      let payload = {};
      if (etat == "all") {
        payload = {
          resourceUrl:
            "api/mutuelle/" + this.activite_courante.Mutuelle.id + "/credits",
          commitAction: "SET_CREDITS",
        };
      } else {
        payload = {
          resourceUrl:
            "api/mutuelle/" +
            this.activite_courante.Mutuelle.id +
            "/credits/" +
            etat,
          commitAction: "SET_CREDITS",
        };
      }

      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then((res) => {
          let data = [];
          data = res.data.data;
          if (!this.admin)
            data = data.filter(
              (credit) => credit.membres_id === this.membre_id
            );
          this.creditsData = data;
        })
        .catch((error) => {
          this.$vs.notify({
            position: "top-center",
            title: "error",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
  },
  created() {
    EventBus.$emit("loader", true);
    let association_courante =
      this.$store.getters["association/getCurrentAssociation"];

    let activityExists = this.$store.state.association.activite != "";
    let activity_id = activityExists
      ? this.$store.state.association.activite.id
      : localStorage.getItem("activity_id");

    this.mut = this.$store.state.association.activite.Mutuelle;

    let payload = {
      resourceUrl:
        "api/association/" +
        association_courante.id +
        "/activite/" +
        activity_id,
      commitAction: "SET_ACTIVITE",
    };

    this.$store
      .dispatch("association/fetchAssociationactivite", payload)
      .then((res) => {
        this.checkActivityType(res.data.data);
        this.activite_courante = res.data.data;
        this.finishCreatedJob(association_courante, activity_id);
      })
      .catch((error) => {
        window.console.log(error);
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
