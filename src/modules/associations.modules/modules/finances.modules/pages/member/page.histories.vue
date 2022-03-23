<template>
  <div>
    <!-- ACTION - DROPDOWN -->
    <action-button />
    <!-- IMAGE WINDOW MODAL -->
    <div id="myModal" class="modal">
      <span class="close">&times;</span>
      <img class="modal-content" id="img01" />
      <div id="caption"></div>
    </div>
    <!-- Popup pour supprimer une operation -->
    <vs-popup
      classContent="popup-example"
      :title="$t('deleteConfirmTitle')"
      :active.sync="popupActivo2"
    >
      <p>{{ $t("deleteConfirm") }}</p>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="warning" @click="popupActivo2 = false" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp;

        <vs-button
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading"
          :disabled="!loader"
          @click.stop="deleteItem(membre_selectionne, operation_selectionne)"
        >
          {{ $t("delete") }}
        </vs-button>
      </div>
    </vs-popup>

    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
      :mutual="mutuelle"
      :activity="activite"
    />

    <div
      class="w-full fixed z-20 top-0"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <div class="ml-5 mr-5">
        <vx-card class="mb-base">
          <h5>{{ $t("transactionHistory") | CAPITALIZE }}</h5>
          <p class="mt-2 text-muted">{{ $t("transactionHistorySubtitle") }}.</p>
        </vx-card>
        <div
          class="flex flex-wrap-reverse items-center data-list-btn-container"
        >
          <!-- ADD NEW -->
          <!-- <div v-if="operationsData.length == 0" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
                @click="$router.push('/association/finances/payment').catch(() => {})">
                  <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                  <span class="ml-2 text-base text-primary">{{$t('newOperation')}}</span>
              </div> -->
        </div>
        <vx-card
          v-if="
            operationsData.length == 0 &&
            echeances.length == 0 &&
            regroupeMises.length == 0
          "
        >
          <p>{{ $t("noElementFound") }}</p>
        </vx-card>
      </div>

      <div class="vx-row mb-base">
        <div v-show="operationsData.length > 0" class="vx-col w-full mx-4">
          <vx-card class="z-10">
            <div slot="no-body" class="mt-4">
              <vs-table
                search
                class="table-dark-inverted overflow-auto"
                style="max-height: 26rem"
                ref="operationsTable"
                :data="operationsData"
                :max-items="operationsData.length"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t("operations") | CAPITALIZE }}
                  </h4>
                  <vs-dropdown
                    vs-trigger-click
                    class="
                      relative
                      my-auto
                      right-0
                      cursor-pointer
                      self-end
                      mr-2
                    "
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
                      <vs-dropdown-item @click.native="operationsExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="operationsExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item
                        @click.native="operationsExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th sort-key="membre">{{
                    $t("members") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="debit_credit">{{
                    $t("Type") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="mode">{{
                    $t("paymentMethod") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="date_versement"><span class="w-full text-right">{{
                    $t("paymentDate") | CAPITALIZE
                  }}</span></vs-th>
                  <vs-th sort-key="montant"><span class="w-full text-right">{{
                    $t("Amount") | CAPITALIZE
                  }}</span></vs-th>
                  <!-- <vs-th sort-key="creation_date">{{$t('creationDate') | CAPITALIZE }}</vs-th>-->
                  <vs-th sort-key="etat"><span class="w-full text-right">{{ $t("state") | CAPITALIZE }}</span></vs-th>
                  <vs-th><span class="w-full text-right">{{ $t("actions") | CAPITALIZE }}</span></vs-th>
                </template>

                <template slot-scope="{ data }">
                  <tbody>
                    <vs-tr :key="indextr" v-for="(operation, indextr) in data">
                      <vs-td :data="data[indextr].membre">
                        <p class="product-name font-medium truncate">
                          {{ data[indextr].membre }}
                        </p>
                      </vs-td>
                      <vs-td :data="data[indextr].debit_credit">
                        <p
                          v-if="data[indextr].debit_credit == 'credit'"
                          class="product-price"
                        >
                          {{ $t("payment") }}
                        </p>
                        <p
                          v-if="data[indextr].debit_credit == 'debit'"
                          class="product-price"
                        >
                          {{ $t("withdrawal") }}
                        </p>
                      </vs-td>
                      <vs-td :data="data[indextr].mode">
                        <p class="product-price">{{ data[indextr].mode }}</p>
                      </vs-td>
                      <vs-td class="text-right" :data="data[indextr].date_versement">
                        <p class="product-name">
                          {{ data[indextr].date_versement | dateTime }}
                        </p>
                      </vs-td>
                      <vs-td class="text-right" :data="data[indextr].montant">
                        <p
                          class="product-name"
                          :class="{ redtextclass: data[indextr].montant < 0 }"
                        >
                          {{ data[indextr].montant | formatMoney(devise) }}
                        </p>
                      </vs-td>
                      <vs-td class="flex justify-end" :data="data[indextr].etat">
                        <div
                          v-if="data[indextr].etat == 'EN_ATTENTE'"
                          class="product-price"
                        >
                          <vs-chip color="warning">{{ $t("waiting") }}</vs-chip>
                        </div>
                        <div
                          v-if="data[indextr].etat == 'VALIDE'"
                          class="product-price"
                        >
                          <vs-chip color="success">{{
                            $t("validated")
                          }}</vs-chip>
                        </div>
                        <div
                          v-if="data[indextr].etat == 'REJETE'"
                          class="product-price"
                        >
                          <vs-chip color="danger">{{ $t("rejected") }}</vs-chip>
                        </div>
                      </vs-td>
                      <vs-td class="whitespace-no-wrap text-right">
                        <!-- EDITER UNE OPERATION -->
                        <vx-tooltip
                          v-if="data[indextr].etat == 'EN_ATTENTE'"
                          :text="$t('update')"
                          position="bottom"
                          class="inline-block mr-2"
                        >
                          <feather-icon
                            icon="EditIcon"
                            svgClasses="w-5 h-5 hover:text-primary stroke-current"
                            @click="redirectEdit(data[indextr])"
                          />
                        </vx-tooltip>

                        <!-- APERCUE DE L'OPERATION -->
                        <vx-tooltip
                          v-if="data[indextr].etat != 'EN_ATTENTE'"
                          :text="$t('detail')"
                          position="bottom"
                          class="inline-block mr-2"
                        >
                          <feather-icon
                            icon="EyeIcon"
                            svgClasses="w-5 h-5 hover:text-primary stroke-current"
                            @click.stop="
                              sendData('DetailOperation', data[indextr])
                            "
                          />
                        </vx-tooltip>

                        <!-- SUPPRIMER UNE OPERATION -->
                        <vx-tooltip
                          v-if="data[indextr].etat == 'EN_ATTENTE'"
                          :text="$t('delete')"
                          position="bottom"
                          class="inline-block"
                        >
                          <feather-icon
                            icon="TrashIcon"
                            svgClasses="w-5 h-5 hover:text-danger stroke-current"
                            @click.stop="
                              popupActivo2 = true;
                              operation_selectionne = data[indextr].id;
                              membre_selectionne = data[indextr].membre_id;
                            "
                          />
                        </vx-tooltip>
                      </vs-td>
                    </vs-tr>
                  </tbody>
                </template>
              </vs-table>
            </div>
          </vx-card>
        </div>
      </div>

      <div class="vx-row mb-base">
        <div v-show="regroupeMises.length > 0" class="vx-col w-full mx-4">
          <vx-card class="z-10">
            <div slot="no-body" class="mt-4">
              <vs-table
                search
                class="table-dark-inverted overflow-auto"
                style="max-height: 26rem"
                v-show="regroupeMises.length > 0"
                ref="downPaymentsTable"
                :data="regroupeMises"
                :max-items="regroupeMises.length"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t('downPayment') | CAPITALIZE }}
                  </h4>
                  <vs-dropdown
                    vs-trigger-click
                    class="
                      relative
                      my-auto
                      right-0
                      cursor-pointer
                      self-end
                      mr-2
                    "
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
                      <vs-dropdown-item @click.native="fundingsExport('pdf')"
                        >PDF</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="fundingsExport('csv')"
                        >CSV</vs-dropdown-item
                      >
                      <vs-dropdown-item @click.native="fundingsExport('excel')"
                        >EXCEL</vs-dropdown-item
                      >
                    </vs-dropdown-menu>
                  </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th sort-key="nom_membre">{{
                    $t("members") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="date_versement"
                    ><span class="w-full text-right">{{ $t("registrationDate") | CAPITALIZE }}</span>
                  </vs-th>
                  <vs-th sort-key="montant">
                    <span class="w-full text-right">{{ $t("downPayment") | CAPITALIZE }}</span>
                  </vs-th>
                  <vs-th>
                    <span class="w-full text-right">{{ $t("actions") | CAPITALIZE }}</span>
                  </vs-th>
                </template>

                <template slot-scope="{ data }">
                  <tbody>
                    <vs-tr
                      :data="data"
                      v-for="(tr, indextr) in data"
                      :key="indextr"
                    >
                      <vs-td :data="data[indextr].nom_membre">
                        <p class="product-name font-medium truncate">
                          {{ data[indextr].membre.firstName }}
                        </p>
                      </vs-td>
                      <vs-td class="text-right" :data="data[indextr].date_versement">
                        <p>{{ data[indextr].date_versement | dateTime }}</p>
                      </vs-td>
                      <vs-td class="text-right" :data="data[indextr].montant">
                        <p :class="{ redtextclass: data[indextr].montant < 0 }">
                          {{ data[indextr].montant | formatMoney(devise) }}
                        </p>
                      </vs-td>

                      <vs-td class="text-right">
                        <vx-tooltip
                          :text="$t('detail')"
                          position="bottom"
                          class="inline-block"
                        >
                          <feather-icon
                            icon="EyeIcon"
                            svgClasses="w-5 h-5 hover:text-primary stroke-current"
                            @click.stop="addNewData('DetailFonds', tr)"
                          />
                        </vx-tooltip>
                      </vs-td>
                    </vs-tr>
                  </tbody>
                </template>
              </vs-table>
            </div>
          </vx-card>
        </div>
      </div>

      <div class="vx-row mb-base">
        <div v-show="echeances.length > 0" class="vx-col w-full mx-4">
          <vx-card class="z-10">
            <div slot="no-body" class="mt-4">
              <vs-table
                search
                class="table-dark-inverted overflow-auto z-10"
                style="max-height: 26rem"
                v-show="echeances.length > 0"
                ref="settlementsTable"
                :data="echeances"
                :max-items="echeances.length"
              >
                <div class="w-full flex flex-row justify-between" slot="header">
                  <h4 class="ml-6">
                    {{ $t('settlement') | CAPITALIZE }}
                  </h4>
                  <vs-dropdown
                  vs-trigger-click
                  class="relative my-auto right-0 cursor-pointer self-end mr-2"
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
                    <vs-dropdown-item @click.native="settlementsExport('pdf')"
                      >PDF</vs-dropdown-item
                    >
                    <vs-dropdown-item @click.native="settlementsExport('csv')"
                      >CSV</vs-dropdown-item
                    >
                    <vs-dropdown-item @click.native="settlementsExport('excel')"
                      >EXCEL</vs-dropdown-item
                    >
                  </vs-dropdown-menu>
                </vs-dropdown>
                </div>
                <template slot="thead">
                  <vs-th sort-key="membre">{{
                    $t("members") | CAPITALIZE
                  }}</vs-th>
                  <!-- <vs-th sort-key="debit_credit">{{$t('paymentDisbursement') | CAPITALIZE }}</vs-th> -->
                  <vs-th sort-key="libelle">{{
                    $t("wording") | CAPITALIZE
                  }}</vs-th>
                  <vs-th sort-key="date_limite"><span class="w-full text-right">{{
                    $t("limitDate") | CAPITALIZE
                  }}</span></vs-th>
                  <vs-th sort-key="montant"><span class="w-full text-right">{{
                    $t("Amount") | CAPITALIZE
                  }}</span></vs-th>
                </template>

                <template slot-scope="{ data }">
                  <tbody>
                    <vs-tr :key="indextr" v-for="(echeance, indextr) in data">
                      <vs-td :data="data[indextr].membre">
                        <p class="product-name font-medium truncate">
                          {{ echeance.membre }}
                        </p>
                      </vs-td>
                      <vs-td :data="data[indextr].libelle">
                        <p class="flex">
                          <feather-icon
                            v-if="
                              echeance.debit_credit == 'cotisation' ||
                              echeance.debit_credit == 'acquitement'
                            "
                            icon="ArrowRightCircleIcon"
                            svgClasses="w-5 h-5 text-danger stroke-current"
                          />
                          <feather-icon
                            v-if="echeance.debit_credit == 'decaissement'"
                            icon="ArrowRightCircleIcon"
                            svgClasses="w-5 h-5 text-success stroke-current"
                          />
                          <span class="ml-2"> {{ echeance.libelle }} </span>
                        </p>
                      </vs-td>
                      <vs-td class="text-right" :data="data[indextr].date_limite">
                        <p
                          v-if="echeance.date_limite == 0"
                          class="product-name"
                        >
                          {{ $t("nextCycle") }}
                        </p>
                        <p v-else class="product-name">
                          {{ echeance.date_limite | dateTime }}
                        </p>
                      </vs-td>
                      <vs-td class="text-right">
                        <p :class="{ redtextclass: echeance.montant < 0 }">
                          {{ echeance.montant | formatMoney(devise) }}
                        </p>
                      </vs-td>
                    </vs-tr>
                  </tbody>
                </template>
              </vs-table>
            </div>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//Composants
import Withdrawal from "./page.withdrawal.vue";
import ActionButton from "../../components/member/ActionButton.component";
import DataViewSidebar from "../../../../components/sidebar/DataViewSidebar.component";

//Fonctions
import { payment_mod } from "../../services/data/paymentMod.js";
import exports from "@/services/exports";
import { EventBus } from "@/services/EventBus.js";

//Store
// import moduleFinance from "@/store/finance/moduleFinance.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      admin: false,
      popupActivo2: false,
      operation_selectionne: "",
      membre_selectionne: "",
      membre_id: null,
      devise: "",
      visibilite: "",
      recherche_operations: "",
      recherche_mises_fonds: "",
      recherche_echeances: "",

      // Data Sidebar
      etat: "",
      addNewDataSidebar: false,
      sidebarData: {},

      /* Loading */
      backgroundLoading: "danger",
      colorLoading: "#fff",
      loader: true,

      operations: [],
      echeances: [],
      mises_fonds: [],

      activite: null,
      mutuelle: null,
    };
  },
  components: {
    Withdrawal,
    ActionButton,
    DataViewSidebar,
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
      activeUser: "authentificated/getAuth",
    }),
    operationsData() {
      var data = [];
      data = this.operations;
      let transactions = [];
      if (data.length > 0) {
        data.forEach((operation) => {
          // Afficher la liste des operations de tous les membres de l'association lorsque
          // la visibilité financière de l'association est ouverte
          if (this.visibilite == "OUVERT") {
            transactions.push({
              id: operation.id,
              membre: operation.membre,
              membre_id: operation.membre_id,
              date_versement: operation.date_realisation,
              montant: operation.montant,
              num_recu: operation.num_recu,
              etat: operation.etat,
              debit_credit: operation.debit_credit,
              mode: payment_mod.reduce(
                (a, o) =>
                  o.value == operation.mode ? a.concat(this.$t(o.i18n)) : a,
                ""
              ),
              mod: operation.mode,
              preuve: operation.preuve,
              commentaire: operation.commentaire,
              transactions: operation.transactions,
            });
          }
          // Afficher la liste des operations du membre connecté uniquement lorsque
          // la visibilité financière de l'association est restreinte
          else if (
            this.membre_id == operation.membre_id &&
            this.visibilite == "RESTREINT"
          ) {
            transactions.push({
              id: operation.id,
              membre: operation.membre,
              membre_id: operation.membre_id,
              date_versement: operation.date_realisation,
              montant: operation.montant,
              num_recu: operation.num_recu,
              etat: operation.etat,
              mode: payment_mod.reduce(
                (a, o) =>
                  o.value == operation.mode ? a.concat(this.$t(o.i18n)) : a,
                ""
              ),
              mod: operation.mode,
              debit_credit: operation.debit_credit,
              preuve: operation.preuve,
              commentaire: operation.commentaire,
              transactions: operation.transactions,
            });
          }
        });
      }
      return transactions.sort((a, b) =>
        a.date_versement < b.date_versement ? 1 : -1
      );
    },

    regroupeMises() {
      //Exraction de noms des membres inscris et le nombre de part à partir des lots
      let mises = this.mises_fonds;
      var mises_tries = [];

      if (mises.length > 0) {
        //Compter les noms en double dans le tableau membre et
        //les stokés dans le tableau membres_tries avec leurs occurrences
        for (let i = 0; i < mises.length - 1; i++) {
          let som = mises[i].montant;
          for (let index = i + 1; index < mises.length; index++) {
            if (mises[i].membres_id == mises[index].membres_id) {
              som += mises[index].montant;
            }
          }
          /* window.console.log(som) */
          if (
            !mises_tries.some(
              (element) => element.membres_id === mises[i].membres_id
            )
          ) {
            mises[i].montant = som;
            mises_tries.push(mises[i]);
          }
        }

        let $index = 1;
        /* window.console.log(membres[membres.length-1].nom) */
        for (let j = 0; j < mises.length - 1; j++) {
          if (mises[mises.length - 1].membres_id == mises[j].membres_id) {
            $index++;
            /* window.console.log(membres[j].nom) */
          }
        }
        if ($index == 1) {
          mises_tries.push(mises[mises.length - 1]);
        }
      }
      return mises_tries
        .sort((a, b) => (a.membres_id > b.membres_id ? 1 : -1))
        .map((element) => ({
          ...element,
          nom_membre: element.membre.firstName,
        }));
    },
  },
  methods: {
    //Voir le destail d'une operation
    sendData(etat, data) {
      this.etat = etat;
      this.sidebarData = data;
      this.toggleDataSidebar(true);
    },

    addNewData(etat, data) {
      this.etat = etat;
      this.sidebarData = data;
      this.mutuelle = data.mutuelle;
      this.toggleDataSidebar(true);
    },

    //Data Side bar
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },

    //Retourne le format de la monnaie
    formatMoney(number) {
      if (number == null || isNaN(number)) number = 0;

      return number.toLocaleString("en-US", {
        style: "currency",
        currency: this.devise,
        minimumFractionDigits: 2,
      });
    },
    //Supprimer une transaction
    deleteItem(member_id, operation_id) {
      this.openLoadingContained();
      var association_courante = this.currentAssociation;

      let payload = {
        resourceUrl: "/api/membre/" + member_id + "/operation/" + operation_id,
        commitAction: "REMOVE_OPERATION",
      };
      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          (this.popupActivo2 = false),
            this.$vs.notify({
              position: "top-center",
              text: this.$t("operationDelete"),
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "success",
            });

          let payload = {
            resourceUrl:
              "/api/association/" + association_courante.id + "/operations",
            commitAction: "SET_OPERATIONS",
          };

          this.$store
            .dispatch("association/fetchFinances", payload)
            .catch((error) => {
              this.loader = true;
              this.$vs.loading.close("#button-with-loading > .con-vs-loading");
              window.console.error(error);
            });
        })
        .catch((error) => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          this.$vs.notify({
            position: "top-center",
            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
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
    //Rediriger vers la page de validation
    redirectEdit(operation) {
      this.$router.push(`/association/finances/payment/edit/${operation.id}`);
    },
    operationsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t("operations")}`;

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
              this.$t("paymentDate"),
              this.$t("Amount"),
              this.$t("Type"),
              this.$t("paymentMethod"),
              this.$t("state"),
            ],
            body: this.$refs["operationsTable"].queriedResults.map(
              (operation) => [
                operation.membre,
                this.$d(operation.date_versement * 1000),
                this.$options.filters.formatMoney(
                  operation.montant,
                  this.currentAssociation.devise
                ),
                operation.debit_credit,
                operation.mode,
                operation.etat,
              ]
            ),
          },
          title
        );
      }
    },
    fundingsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t(
        "downPayment"
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
              this.$t("registrationDate"),
              this.$t("downPayment"),
            ],
            body: this.$refs["downPaymentsTable"].queriedResults.map(
              (downPayment) => [
                downPayment.nom_membre,
                this.$d(downPayment.date_versement * 1000),
                this.$options.filters.formatMoney(
                  downPayment.montant,
                  this.currentAssociation.devise
                ),
              ]
            ),
          },
          title
        );
      }
    },
    settlementsExport(type = "pdf") {
      const title = `${this.currentAssociation.nom} - ${this.$t("settlement")}`;

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
              this.$t("wording"),
              this.$t("limitDate"),
              this.$t("Amount"),
            ],
            body: this.$refs["settlementsTable"].queriedResults.map(
              (settlement) => [
                settlement.membre,
                settlement.libelle,
                this.$d(settlement.date_limite * 1000),
                this.$options.filters.formatMoney(
                  settlement.montant,
                  this.currentAssociation.devise
                ),
              ]
            ),
          },
          title
        );
      }
    },
    openLoadingContained() {
      this.loader = false;
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: "#button-with-loading",
        scale: 0.45,
      });
    },
  },
  created() {
    EventBus.$emit("loader", true);
    var current_association = this.currentAssociation;

    // if(!moduleFinance.isRegistered) {
    //     this.$store.registerModule('finance', moduleFinance)
    //     moduleFinance.isRegistered = true
    // }
    // if(!moduleUserManagement.isRegistered) {
    //   this.$store.registerModule('userManagement', moduleUserManagement)
    //   moduleUserManagement.isRegistered = true
    // }
    let payload = {
      resourceUrl: "/api/association/" + current_association.id + "/membre",
      commitAction: "SET_MEMBERS",
    };

    this.$store
      .dispatch("association/fetchMembers", payload)
      .then((res) => {
        this.membre_id = this.extractMember(res.data.data);

        let payload = {
          resourceUrl:
            "/api/association/" + current_association.id + "/membres/histories",
          commitAction: "SET_HISTORIES",
        };

        this.$store
          .dispatch("association/fetchFinances", payload)
          .then((res) => {
            let historiques = res.data.data;

            if (historiques.length) {
              this.operations = [];
              historiques.forEach((historique) => {
                if (historique.general.operations.length) {
                  historique.general.operations.forEach((operation) => {
                    this.operations.push({
                      commentaire: operation.commentaire,
                      date_realisation: operation.date_realisation,
                      debit_credit: operation.debit_credit,
                      en_ligne: operation.en_ligne,
                      enregistre_par: operation.enregistre_par,
                      etat: operation.etat,
                      id: operation.id,
                      membre_id: operation.membres_id_wallet,
                      membres_id_wallet: operation.membres_id_wallet,
                      mode: operation.mode,
                      montant: operation.montant,
                      num_recu: operation.num_recu,
                      preuve: operation.preuve,
                      transactions: operation.transactions,
                      membre: historique.membre.firstName,
                    });
                  });
                }

                if (historique.general.mises_de_fonds.length) {
                  historique.general.mises_de_fonds.forEach((mise) => {
                    this.mises_fonds.push({
                      created_by: mise.created_by,
                      date_created: mise.date_created,
                      date_updated: mise.date_updated,
                      date_versement: mise.date_versement,
                      id: mise.id,
                      membres_id: mise.membres_id,
                      montant: mise.montant,
                      mutuelle: mise.mutuelle,
                      updated_by: mise.updated_by,
                      membre: historique.membre,
                      activite: mise.activite.nom,
                    });
                  });
                }

                if (historique.general.echeanciers.length) {
                  historique.general.echeanciers.forEach((echeance) => {
                    this.echeances.push({
                      comptes_id: echeance.comptes_id,
                      created_by: echeance.created_by,
                      date_created: echeance.date_created,
                      date_limite: echeance.date_limite,
                      debit_credit: echeance.debit_credit,
                      etat: echeance.etat,
                      id: echeance.id,
                      libelle: echeance.libelle,
                      membres_id: echeance.membre_id,
                      montant: echeance.montant,
                      montant_realise: echeance.montant_realise,
                      next_date_in: echeance.next_date_in,
                      priorite: echeance.priorite,
                      serie: echeance.serie,
                      type: echeance.type,
                      membre: historique.membre.firstName,
                    });
                  });
                }
              });
            }
            EventBus.$emit("loader", false);
          })
          .catch((error) => {
            EventBus.$emit("loader", false);
            window.console.error(error);
          });
      })
      .catch((error) => {
        window.console.error(error);
      });

    /* Devise de l'association courante */
    this.devise = current_association.devise;

    /* Visibilité de l'association courante */
    this.visibilite = current_association.visibilite_financiere;

    //Verifier si l'utilisateur est sur la page admin
    var path = localStorage.getItem("route");
    if (path == "/home/admin") this.admin = true;
  },
};
</script>
<style>
.vs-con-table .vs-con-tbody {
  width: 100%;
  overflow: auto;
  margin-top: -10px;
}
</style>
