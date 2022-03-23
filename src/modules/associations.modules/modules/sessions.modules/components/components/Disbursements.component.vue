<template>
  <div>
    <!-- Membres -->
    <vs-popup
      classContent="popup-example"
      class="popup-position"
      :title="$t('selectedMembers')"
      :active.sync="popupActivo"
    >
      <ul class="centerx">
        <li :key="indextr" v-for="(membre, indextr) in membreData">
          <vs-checkbox
            @change="onChange(membre.id, membre.firstName, $event)"
            :checked="membresIdChecked.includes(membre.id)"
            class="ml-6 mb-3"
          >
            {{ membre.firstName }}
          </vs-checkbox>
        </li>
      </ul>
      <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button @click="popupActivo = false" type="border">{{
          $t("cancel")
        }}</vs-button
        >&nbsp;&nbsp;
        <vs-button @click="popupActivo = false" class="ml-3">{{
          $t("Ok")
        }}</vs-button>
      </div>
    </vs-popup>

    <div class="ml-4 mr-4">
      <vx-card no-shadow class="mb-6 pb-6" :title="$t('decaissementParams')" />
    </div>

    <div class="ml-4 mr-4">
      <div
        v-if="members.length == 0"
        class="flex flex-wrap-reverse items-center data-list-btn-container"
      ></div>
      <vx-card v-if="!members.length" class="mb-base">
        <p>{{ $t("noElementFound") }}</p>
      </vx-card>
    </div>

    <!-- Detail du decaissement -->
    <data-view
      @closeSidebar="toggleDataSidebarDetails"
      :isSidebarActive="addNewDataSidebarDetails"
      :data="emptyData"
    >
      <h4 slot="title">{{ $t("detailOfTransaction") }}</h4>

      <template slot="component">
        <div class="ep-association pb-12">
          <!-- IMAGE WINDOW MODAL -->
          <div id="myModal" class="modal">
            <span class="close">&times;</span>
            <img class="modal-content" id="img01" />
            <div id="caption"></div>
          </div>
          <div class="vx-row">
            <div class="vx-col w-full">
              <!-- OPERATION -->
              <table class="w-full border-collapse">
                <tr>
                  <td>{{ $t("account") }}</td>
                  <td>{{ objectToMap.username }}</td>
                </tr>
                <tr>
                  <td>{{ $t("montantAttendu") }}</td>
                  <td :class="{ redtextclass: objectToMap.in < 0 }">
                    {{ objectToMap.in | formatMoney(devise) }}
                  </td>
                </tr>

                <tr>
                  <td>{{ $t("montantRealise") }}</td>
                  <td :class="{ redtextclass: objectToMap.out < 0 }">
                    {{ objectToMap.out | formatMoney(devise) }}
                  </td>
                </tr>
              </table>

              <!-- TRANSACTION -->
              <h5
                class="mt-5 mb-4"
                v-if="
                  objectToMap.transactions && objectToMap.transactions.length
                "
              >
                {{ $t("transactions") }}
              </h5>
              <table
                class="w-full border-collapse"
                v-if="
                  objectToMap.transactions && objectToMap.transactions.length
                "
              >
                <thead>
                  <tr>
                    <th class="w-1/2 px-4 py-2 text-base th-bg">
                      {{ $t("activities") }}
                    </th>
                    <th class="w-1/2 px-4 py-2 text-base th-bg">
                      {{ $t("Amount") }}
                    </th>
                    <th class="w-1/2 px-4 py-2 text-base th-bg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    :key="indextr"
                    v-for="(transaction, indextr) in objectToMap.transactions"
                  >
                    <td class="w-1/2 px-4 py-2 text-base">
                      <p>{{ transaction.activite.nom }}</p>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                      <span>
                        <p class="product-name font-medium truncate">
                          {{ transaction.montant }}/{{
                            transaction.montant_attendu
                          }}
                        </p>
                      </span>
                    </td>
                    <td class="w-1/2 px-4 py-2 text-base">
                      <span>
                        <p class="product-name font-medium truncate">
                          {{ transaction.date_created | dateTime }}
                        </p>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <vs-button
        class="mr-6"
        type="border"
        color="success"
        @click="
          () => {
            addNewDataSidebarDetails = false;
            resetObjectToMap();
          }
        "
        >{{ $t("close") }}</vs-button
      >
    </data-view>

    <!-- Assigner avoir -->
    <data-view
      @closeSidebar="toggleDataSidebarAvoir"
      :isSidebarActive="addNewDataSidebarAvoir"
      :data="emptyData"
    >
      <h4 slot="title">{{ $t("paymentAssets") | CAPITALIZE }}</h4>

      <template slot="component">
        <div class="vx-col w-full mb-base" v-if="compte">
          <div class="clearfix w-full">
            <!-- COMPTE -->
            <p class="vs-input--label">{{ $t("members") }} *:</p>
            <v-select
              label="text"
              v-bind:class="{ disabled: true }"
              :options="selectOptions"
              v-model="compte.membre"
              @input="getMemberActivities"
              class="mt-1 w-full"
            />

            <!-- MONTANT -->
            <p class="vs-input--label mt-5">{{ $t("Amount") }} *:</p>
            <money
              v-model="montant"
              class="money-input mt-1 w-full"
              v-bind="money"
              @input="montantAvoirAssign"
            />

            <p class="vs-input--label mt-5">{{ $t("paymentMethod") }} *:</p>
            <v-select
              label="text"
              :options="paymentModSelectOptions"
              v-model="methode_payement_avoir"
              class="mt-1 w-full"
            />
          </div>
        </div>
      </template>
      <vs-button
        class="mr-6"
        type="border"
        color="danger"
        :disabled="processRequest"
        @click="
          () => {
            addNewDataSidebarAvoir = false;
            montant = 0;
            processRequest = false;
          }
        "
      >
        {{ $t("cancel") }}
      </vs-button>

      <!--<vs-button
        ref="loadableButton"
        class="vs-con-loading__container"
        id="button-with-loading-avoir"
        @click.prevent="assignerAvoir('button-with-loading-avoir')">
        {{ $t('save')}}
      </vs-button> -->
      <vs-button
        ref="loadableButton"
        class="vs-con-loading__container mr-6"
        id="button-with-loading-close"
        @click="
          () => {
            canBeClose = true;
            processRequest = true;
            assignerAvoir('button-with-loading-close');
          }
        "
        :disabled="processRequest || !montant"
      >
        {{ $t("saveAndClose") }}
      </vs-button>

      <vs-button
        ref="loadableButton"
        class="vs-con-loading__container"
        id="button-with-loading-continue"
        @click="
          () => {
            processRequest = true;
            assignerAvoir('button-with-loading-continue');
          }
        "
        :disabled="processRequest || !montant"
      >
        {{ $t("saveAndContinue") }}
      </vs-button>
    </data-view>

    <!-- Effectuer un decaissement -->
    <data-view
      @closeSidebar="addNewDataSidebar = false"
      @onFormCompleted="onWithdrawalSubmit($event)"
      :clickNotClose="true"
      :submitAndContinue="true"
      :isSidebarActive="addNewDataSidebar"
      :data="{ firstName: compte.username, ag: this.getCurrentAg }"
      :etat="sidebarName"
    />

    <!-- Tableau des decaissements -->
    <div v-show="members.length" class="vx-col ml-4 mr-4 mt-10 mb-base">
      <vx-card :title="$t('decaissementParams')">
        <div slot="no-body" class="mt-4">
          <vs-table
            :data="members"
            class="table-dark-inverted overflow-auto"
            style="max-height: 21rem"
          >
            <template slot="thead">
              <vs-th>{{ $t("members") | CAPITALIZE }}</vs-th>
              <vs-th>{{ $t("montantAttendu") | CAPITALIZE }}</vs-th>
              <vs-th>{{ $t("montantRetire") | CAPITALIZE }}</vs-th>
              <vs-th>{{ $t("status") | CAPITALIZE }}</vs-th>
              <vs-th>{{ $t("actions") | CAPITALIZE }}</vs-th>
            </template>
            <template slot-scope="{ data }" class="w-full">
              <vs-tr
                :key="indextr"
                v-for="(tr, indextr) in data"
                class="cursor-pointer"
              >
                <vs-td>
                  <p class="user-name truncate">{{ data[indextr].username }}</p>
                </vs-td>
                <vs-td>
                  <span :class="{ redtextclass: data[indextr].in < 0 }">
                    {{ data[indextr].in | formatMoney(devise) }}
                  </span>
                </vs-td>
                <vs-td>
                  <span :class="{ redtextclass: data[indextr].out < 0 }">
                    {{ data[indextr].out | formatMoney(devise) }}
                  </span>
                </vs-td>

                <vs-td :data="data[indextr]">
                  <vx-tooltip
                    v-if="data[indextr].in == 0"
                    :text="$t('cloturer')"
                    position="bottom"
                    class="inline-block"
                  >
                    <feather-icon
                      icon="CircleIcon"
                      svg-classes="w-6 h-6 stroke-current text-success bg-success rounded-full"
                      class="mr-1"
                    />
                  </vx-tooltip>

                  <vx-tooltip
                    v-else
                    :text="$t('encours')"
                    position="bottom"
                    class="inline-block"
                  >
                    <feather-icon
                      icon="CircleIcon"
                      svg-classes="w-6 h-6 stroke-current text-warning bg-warning rounded-full"
                      class="mr-1"
                    />
                  </vx-tooltip>
                </vs-td>

                <vs-td class="whitespace-no-wrap" :data="data[indextr]">
                  <!-- Detail decaissement -->
                  <vs-td :data="data[indextr]">
                    <vx-tooltip
                      :text="$t('detail')"
                      position="bottom"
                      class="inline-block mr-2"
                    >
                      <feather-icon
                        icon="EyeIcon"
                        @click.stop="
                          () => {
                            addNewDataSidebarDetails = true;
                            objectToMap = data[indextr];
                          }
                        "
                        svgClasses="w-5 h-5 hover:text-primary stroke-current"
                      />
                    </vx-tooltip>

                    <!-- Decaissement -->
                    <vx-tooltip
                      v-if="
                        data[indextr].in != 0 &&
                        (roles.includes('Administrateur') ||
                          roles.includes('Financier'))
                      "
                      :text="$t('decaissementParams')"
                      position="bottom"
                      class="inline-block"
                    >
                      <vs-icon
                        icon-pack="streameline"
                        @click.stop="
                          compte = data[indextr];
                          addNewDataSidebar = true;
                        "
                        icon="icon-cash-payment-bag"
                        style="font-size: 18px"
                        class="hover:text-primary"
                        size="small"
                      >
                      </vs-icon>
                    </vx-tooltip>
                  </vs-td>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </vx-card>
    </div>
    <!-- Tableau des avoirs -->
    <div v-show="avoirs.length" class="vx-col ml-4 mr-4">
      <vx-card :title="$t('paymentAssets')">
        <div slot="no-body" class="mt-4">
          <vs-table
            :data="avoirs"
            class="table-dark-inverted overflow-auto"
            style="max-height: 21rem"
          >
            <template slot="thead">
              <vs-th>{{ $t("members") | CAPITALIZE }}</vs-th>
              <vs-th>{{ $t("memberAccount") | CAPITALIZE }}</vs-th>
              <vs-th>{{ $t("assetAmount") | CAPITALIZE }}</vs-th>

              <vs-th>{{ $t("actions") | CAPITALIZE }}</vs-th>
            </template>
            <template slot-scope="{ data }" class="w-full">
              <vs-tr
                :key="indextr"
                v-for="(tr, indextr) in avoirs"
                class="cursor-pointer"
              >
                <vs-td>
                  <p class="user-name truncate">{{ tr.membre }}</p>
                </vs-td>
                <vs-td>
                  <span>{{ tr.nom_activite }}</span>
                </vs-td>
                <vs-td>
                  <span :class="{ redtextclass: tr.avoir < 0 }">
                    {{ tr.avoir | formatMoney(devise) }}
                  </span>
                </vs-td>

                <vs-td :data="data[indextr]">
                  <!-- Decaissement -->
                  <vx-tooltip
                    :text="$t('pay')"
                    v-if="
                      roles.includes('Administrateur') ||
                      roles.includes('Financier')
                    "
                    position="bottom"
                    class="inline-block"
                  >
                    <vs-icon
                      icon-pack="streameline"
                      @click.stop="
                        () => {
                          compte = data[indextr];
                          indexAvoir = indextr;
                          montant = data[indextr].avoir;

                          addNewDataSidebarAvoir = true;
                        }
                      "
                      icon="icon-cash-user-1"
                      style="font-size: 18px"
                      class="hover:text-primary"
                      size="small"
                    >
                    </vs-icon>
                  </vx-tooltip>

                  <ejs-tooltip
                    v-if="
                      !(
                        roles.includes('Administrateur') ||
                        roles.includes('Financier')
                      )
                    "
                    ref="tooltip"
                    :content="$t('noAccess')"
                    position="bottom"
                    class="mr-2 inline-block"
                  >
                    <feather-icon
                      icon="HelpCircleIcon"
                      svgClasses="w-4 h-4 hover:text-success stroke-current"
                      class="ml-1"
                    />
                  </ejs-tooltip>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </vx-card>
    </div>

    <div class="flex flex-wrapper mt-6 ml-4">
      <vs-button
        type="border"
        class="mr-6"
        id="button-loading"
        @click.native="previous(4)"
        >{{ $t("previous") }}
      </vs-button>

      <vs-button class="mr-6" id="button-loading" @click.native="next(6)"
        >{{ $t("next") }}
      </vs-button>
    </div>
  </div>
</template>

<script>
import sidebar from "../../services/mixins/sidebar";
import dataProprety from "../../services/mixins/data";

import { payment_mod } from "../../services/data/paymentMod.js";

import { disbursement_mod } from "../../services/data/disbursementMod.js";

import { Money } from "v-money";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import vSelect from "vue-select";
import { EventBus } from "@/services/EventBus.js";
import { mapGetters } from "vuex";

//Store
// import moduleMember from "@/store/member/moduleMember.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'
// import moduleFinance from "@/store/finance/moduleFinance.js"

import { getStatisiqueDecaissementApi, getAvoirs } from "../../services/api";

export default {
  mixins: [sidebar, dataProprety],
  props: {
    uuid: {
      required: true,
    },
    roles: {
      required: true,
    },
  },
  data: () => ({
    itemsPerPage: 10,
    addNewDataSidebar: false,
    addNewDataSidebarDetails: false,
    sidebarName: "Decaissement",
    addNewDataSidebarAvoir: false,
    currentId: 0,
    currentUser: "",
    montant: 0,
    compte: "",
    date_retrait: new Date(),
    methode_payement: "",
    methode_payement_avoir: "",
    methode_decaissement: "",
    objectToMap: "",
    commentaire: "",
    members: [],
    membres: [],
    money: {
      decimal: ",",
      thousands: ".",
      precision: 2,
      masked: false /* doesn't work with directive */,
    },
    inputs: [
      /*{
              comptes_id: '',
              montant: '',
              debit_credit: 'debit',
              solde: 0,
            }*/
    ],

    membre_actuel: null,
    avoirs: [],

    /* Loading */
    backgroundLoading: "primary",
    colorLoading: "#fff",
    loader: true,
    processRequest: false,
    canBeClose: false,
    indexAvoir: 0,
    indexDecaissement: 0,

    popupActivo: false,
    membresIdChecked: [],
    selected: [],
  }),
  components: {
    flatPickr,
    vSelect,
    Money,
  },
  methods: {
    async onWithdrawalSubmit($event) {
      // Assert event contain informations about the disbursement
      // and a status telling wether we should move to the next one or not

      // On withdrawal, refresh members array
      let {
        data: { data: operations },
      } = await getStatisiqueDecaissementApi({
        assId: this.getCurrentAssociation.id,
        agId: this.uuid,
      });

      // Format members array
      this.members = operations
        .map((operation) => ({
          id: this.currentId + 1,
          username: operation.membre,
          out: operation.montant_realise,
          in: operation.montant_attendu,
          membre_id: operation.membre_id,
          transactions: operation.transactions,
        }))
        .filter((operation) => operation.in !== 0 || operation.out !== 0);

      // If we must continue, look for the next unpaid disbursement
      if ($event.continue) {
        let nextAccount = this.members.find((member) => member.in !== 0);
        if (nextAccount)
          // If we find one we move, otherwise sidebar is closed
          this.compte = nextAccount;
        else this.addNewDataSidebar = false;
      }

      // Update assets
      let {
        data: { data: assets },
      } = await getAvoirs({
        assId: this.getCurrentAssociation.id,
      });
      this.avoirs = assets.filter((asset) => asset.avoir > 0);

      // Update treasury
      await this.$store.dispatch("association/fetchFinances", {
        resourceUrl: `api/association/${this.getCurrentAssociation.id}/activites/tresorerie`,
        commitAction: "SET_TRESORERIES",
      });
    },

    onChange(id, libelle, $event) {
      if ($event.target.checked && !this.membresIdChecked.includes(id)) {
        this.membresIdChecked.push(id);
        this.selected.push(libelle);
      } else if (!$event.target.checked && this.membresIdChecked.includes(id)) {
        var index = this.membresIdChecked.indexOf(id);
        delete this.membresIdChecked[index];
        delete this.selected[index];
      }
    },

    changeToPay(montant, index) {
      let amount = 0;
      this.inputs.forEach((element) => {
        amount += element.comptes_id.montant_attendu;
      });

      /* window.console.log(montant) */
      this.inputs[index].montant =
        this.inputs[index].comptes_id.montant_attendu;
      this.montant = amount;
    },

    updateAmount(montant, index) {
      this.inputs[index].montant = montant;

      let amount = 0;
      this.inputs.forEach((element) => {
        amount += element.montant;
      });
      this.montant = amount;
    },

    goNext() {
      this.inputs = [];
      this.montant = 0;
      /* this.methode_payement = ''; */
      this.date_retrait = new Date();
      this.commentaire = "";

      let Elementfound = false;
      const stopLoop = this.members.length - 1;
      while (this.indexDecaissement <= stopLoop) {
        this.indexDecaissement += 1;

        if (this.indexDecaissement > stopLoop) break;

        if (this.members[this.indexDecaissement].in == 0) {
          continue;
        } else {
          this.compte = this.members[this.indexDecaissement];
          this.montant = this.compte.in;
          this.getMemberActivities();
          this.processRequest = false;
          Elementfound = true;
          break;
        }
      }

      if (!Elementfound) {
        this.toggleDataSidebar(true);
        this.processRequest = false;
      }
    },

    goToNext(index, montantAvoir, montantRetire) {
      if (montantRetire != montantAvoir) this.indexAvoir = index + 1;

      if (this.indexAvoir > this.avoirs.length - 1) {
        this.toggleDataSidebarAvoir();
        return false;
      }

      this.compte = this.avoirs[this.indexAvoir];
      this.montant = this.compte.avoir;
    },
    openLoadingContained(id) {
      this.loader = false;
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: `#${id}`,
        scale: 0.45,
      });
    },

    resetObjectToMap() {
      this.objectToMap = "";
    },
    toggleDataSidebarDetails(val = false) {
      this.addNewDataSidebarDetails = val;
    },
    formatData(tab) {
      return tab.length
        ? tab.map((e) => ({
            id: e.id,
            text: e.username || e.name,
            value: e.id,
          }))
        : [];
    },

    reset() {
      this.inputs = [
        /*{
                  comptes_id: '',
                  montant: '',
                  debit_credit: 'debit',
                  solde: 0,}*/
      ];
      this.montant = 0;
      /* this.methode_payement = '' */
      this.date_retrait = new Date();
      this.commentaire = "";
    },
    addItem() {
      var compte = this.memberActivities[0];

      let libelle = compte.activite.nom;
      if (
        compte.activite.type != "caisse" &&
        compte.activite.type != "Generique"
      )
        libelle = compte.activite.type + " - " + compte.activite.nom;

      this.inputs.push({
        comptes_id: {
          id: compte.compte.id,
          text: libelle + "(" + compte.a_retirer + ")",
          value: compte.compte.id,
          montant_attendu: compte.a_retirer,
        },
        montant: compte.a_retirer,
        solde: compte.a_retirer,
        debit_credit: "debit",
      });

      this.montant += compte.a_retirer;
    },

    //Enlever un block d'allocation de retrait
    remove(index, amount) {
      this.inputs.splice(index, 1);
      this.montant -= amount;
    },
    //Retourne les activités du membre inscrit
    selectOptionActivities() {
      if (this.memberActivities != null) {
        return this.memberActivities.map((activity) => {
          let libelle = activity.activite.nom;
          if (
            activity.activite.type != "caisse" &&
            activity.activite.type != "Generique"
          )
            libelle = activity.activite.type + " - " + activity.activite.nom;

          return {
            id: activity.compte.id,
            text: libelle + "(" + activity.a_retirer + ")",
            value: activity.compte.id,
            solde: activity.a_retirer,
            montant_attendu: activity.a_retirer,
          };
        });
      }
    },

    getMemberActivities() {
      var association_courante =
        this.$store.state.association.currentAssociation;
      this.inputs = [];

      var membre_id = this.compte.membre_id;

      let payload = {
        resourceUrl:
          "/api/association/" +
          association_courante.id +
          "/membre/" +
          membre_id +
          "/activites",
        commitAction: "SET_MEMBER_ACTIVITIES",
      };
      this.$store
        .dispatch("association/fetchMemberActivities", payload)
        .then((response) => {
          let activites = response.data.data;

          return activites;
        })
        .then((activites) => {
          var account = activites;
          let current_montant = this.montant;

          account
            .sort((a, b) => b.a_retirer - a.a_retirer)
            .filter((e) => e.a_retirer != 0)
            .map((compte) => {
              if (compte.a_retirer == current_montant) {
                this.inputs.push({
                  comptes_id: {
                    id: compte.compte.id,
                    text: compte.activite.nom + "(" + compte.a_retirer + ")",
                    value: compte.compte.id,
                    montant_attendu: compte.a_retirer,
                  },
                  montant: current_montant,
                  debit_credit: "debit",
                });
                current_montant = 0;
              } else {
                if (
                  compte.a_retirer < current_montant &&
                  current_montant != 0
                ) {
                  this.inputs.push({
                    comptes_id: {
                      id: compte.compte.id,
                      text: compte.activite.nom + "(" + compte.a_retirer + ")",
                      value: compte.compte.id,
                      montant_attendu: compte.a_retirer,
                    },
                    montant: compte.a_retirer,
                    debit_credit: "debit",
                  });
                  current_montant = current_montant - compte.a_retirer;
                } else {
                  if (
                    compte.a_retirer > current_montant &&
                    current_montant != 0
                  ) {
                    this.inputs.push({
                      comptes_id: {
                        id: compte.compte.id,
                        text:
                          compte.activite.nom + "(" + compte.a_retirer + ")",
                        value: compte.compte.id,
                        montant_attendu: compte.a_retirer,
                      },
                      montant: current_montant,
                      debit_credit: "debit",
                    });
                    current_montant = 0;
                  }
                }
              }
            });
          return account;
        })
        .then(() => {
          this.montant = this.inputs.reduce(
            (montant, e) => montant + e.montant,
            0
          );

          if (this.inputs.length == 0)
            this.inputs = [
              {
                comptes_id: "",
                montant: "",
                debit_credit: "debit",
                solde: 0,
              },
            ];
        })
        .catch((err) => {
          window.console.log(err);
        });
    },

    /*
     *@param members
     *@return id  //retourne l'id membre de l'utilisateur connecté
     */
    extractMember(members) {
      var user = this.$store.state.authentificated.user;
      var membre;

      members.forEach((member) => {
        member.users.forEach((author) => {
          if (user.id == author.id) {
            membre = member;
          }
        });
      });
      return membre;
    },
    /* Assigner Avoir */
    assignerAvoir(id) {
      let association_courante =
        this.$store.state.association.currentAssociation;
      this.openLoadingContained(id);

      let payload = {
        resourceUrl: "/api/compte/" + this.compte.id + "/assigner/avoir",
        commitAction: "SET_OPERATIONS",
        data: {
          mode: this.methode_payement_avoir.value,
          montant: this.montant,
        },
      };
      this.$store
        .dispatch("association/postRequest", payload)
        .then(() => {
          this.loader = true;

          //this.addNewDataSidebarAvoir = false
          this.$vs.notify({
            position: "top-center",
            text: this.$t("operationSuccess"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });

          getStatisiqueDecaissementApi({
            assId: association_courante.id,
            agId: this.uuid,
          })
            .then((e) => {
              EventBus.$emit("loader", true);

              return e.data.data;
            })
            .then((t) =>
              t.map((e) => {
                return {
                  id: this.currentId++,
                  username: e.membre,
                  out: e.montant_realise,
                  in: e.montant_attendu,
                  membre_id: e.membre_id,
                  transactions: e.transactions,
                };
              })
            )
            .then(
              (val) =>
                (this.members = val.filter((e) => !(e.in == 0 && e.out == 0)))
            )
            .then(() => {
              /* Listes des avoirs */

              getAvoirs({
                assId: association_courante.id,
              })
                .then((res) => {
                  let donnees = res.data.data;
                  this.avoirs = [];
                  if (donnees.length) {
                    donnees.forEach((element) => {
                      if (element.avoir > 0) {
                        this.avoirs.push(element);
                      }
                    });
                  }

                  //this.addNewDataSidebarAvoir = false
                })
                .then(() => {
                  EventBus.$emit("loader", false);
                  if (this.canBeClose) {
                    this.addNewDataSidebarAvoir = false;
                    this.canBeClose = false;
                  } else {
                    this.goToNext(
                      this.indexAvoir,
                      this.compte.avoir,
                      this.montant
                    );
                  }
                  this.$vs.loading.close(`#${id} > .con-vs-loading`);
                  this.processRequest = false;

                  /* Recharger les données de la trésorei */
                  let payload = {
                    resourceUrl:
                      "api/association/" +
                      association_courante.id +
                      "/activites/tresorerie",
                    commitAction: "SET_TRESORERIES",
                  };

                  this.$store
                    .dispatch("association/fetchFinances", payload)
                    .catch((error) => {
                      window.console.log(error);
                    });
                })
                .catch(() => {
                  this.loader = true;
                  this.$vs.loading.close(`#${id} > .con-vs-loading`);
                  EventBus.$emit("loader", false);
                  this.processRequest = false;
                });
            });
        })
        .catch((error) => {
          this.loader = true;
          this.$vs.loading.close(`#${id} > .con-vs-loading`);
          this.addNewDataSidebarAvoir = false;
          this.processRequest = false;
          window.console.log(error);
          EventBus.$emit("loader", false);

          this.$vs.notify({
            position: "top-center",

            text: error,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    // //Faire un retrait
    // saveWithdrawal(membre_id, id) {
    //   /* EventBus.$emit('loader', true) */
    //   let association_courante =
    //     this.$store.state.association.currentAssociation;
    //   var cpt = 0;
    //   var montant_transaction = 0;
    //   //Verifier si le montant de la transaction est inferieur ou égal au montant de l'operation'
    //   this.inputs.forEach((element) => {
    //     /*window.console.log(element) */
    //     cpt += element.montant;
    //     if (element.montant > element.comptes_id.solde) montant_transaction = 1;
    //   });
    //   if (cpt > this.montant) {
    //     EventBus.$emit("loader", false);
    //     this.processRequest = false;
    //     this.$vs.notify({
    //       position: "top-center",
    //       text: this.$t("withdrawalWarning1"),
    //       iconPack: "feather",
    //       icon: "icon-alert-circle",
    //       color: "warning",
    //     });
    //   } else if (montant_transaction > 0) {
    //     EventBus.$emit("loader", false);
    //     this.processRequest = false;
    //     this.$vs.notify({
    //       position: "top-center",
    //       text: this.$t("withdrawalWarning2"),
    //       iconPack: "feather",
    //       icon: "icon-alert-circle",
    //       color: "warning",
    //     });
    //   } else {
    //     this.openLoadingContained(id);

    //     var user = this.$store.state.association.currentAssociation;
    //     //Conversion de la date en Date UTC
    //     var dateUtc = new Date(this.date_retrait).getTime() / 1000;
    //     var formData = new FormData();
    //     var transactions = [];

    //     //formattage de l'objet operation
    //     var operation = {
    //       date_realisation: dateUtc,
    //       montant: this.montant,
    //       debit_credit: "debit",
    //       commentaire: this.commentaire,
    //       mode: this.methode_payement.value,
    //       enregistre_par: user.id,
    //     };
    //     this.inputs.forEach((element) => {
    //       transactions.push({
    //         comptes_id: element.comptes_id.id,
    //         montant: element.montant,
    //         debit_credit: element.debit_credit,
    //       });
    //     });

    //     formData.append("operation", JSON.stringify(operation));
    //     formData.append("methode_paiement", this.methode_decaissement.value);
    //     formData.append("transactions", JSON.stringify(transactions));
    //     if (this.methode_decaissement.value == "membres") {
    //       formData.append("comptes", JSON.stringify(this.membresIdChecked));
    //     }

    //     let payload = {
    //       resourceUrl: "/api/membre/" + membre_id + "/operation/en/seance",
    //       commitAction: "SET_OPERATIONS",
    //       data: formData,
    //     };
    //     this.$store
    //       .dispatch("association/postRequest", payload)
    //       .then(() => {
    //         this.loader = true;
    //         //this.$vs.loading.close(`#${id} > .con-vs-loading`)

    //         getStatisiqueDecaissementApi({
    //           assId: this.$store.state.association.currentAssociation.id,
    //           agId: this.uuid,
    //         })
    //           .then((e) => {
    //             return e.data.data;
    //           })
    //           .then((t) =>
    //             t.map((e) => ({
    //               id: this.currentId++,
    //               username: e.membre,
    //               out: e.montant_realise,
    //               in: e.montant_attendu,
    //               membre_id: e.membre_id,
    //               transactions: e.transactions,
    //             }))
    //           )
    //           .then(
    //             (val) =>
    //               (this.members = val.filter((e) => !(e.in == 0 && e.out == 0)))
    //           )
    //           .then(() => {
    //             /* Listes des avoirs */

    //             getAvoirs({
    //               assId: this.$store.state.association.currentAssociation.id,
    //             })
    //               .then((res) => {
    //                 let donnees = res.data.data;
    //                 this.avoirs = [];
    //                 if (donnees.length) {
    //                   donnees.forEach((element) => {
    //                     if (element.avoir > 0) {
    //                       this.avoirs.push(element);
    //                     }
    //                   });
    //                 }
    //               })
    //               .then(() => {
    //                 if (this.canBeClose) {
    //                   this.addNewDataSidebar = false;
    //                   this.canBeClose = false;
    //                   this.processRequest = false;
    //                 } else {
    //                   this.goNext();
    //                   this.processRequest = false;
    //                 }
    //                 this.$vs.loading.close(`#${id} > .con-vs-loading`);

    //                 this.processRequest = false;

    //                 /* Recharger les données de la trésorei */
    //                 let payload = {
    //                   resourceUrl:
    //                     "api/association/" +
    //                     association_courante.id +
    //                     "/activites/tresorerie",
    //                   commitAction: "SET_TRESORERIES",
    //                 };

    //                 this.$store
    //                   .dispatch("association/fetchFinances", payload)
    //                   .catch((error) => {
    //                     window.console.log(error);
    //                   });
    //               })
    //               .catch((error) => {
    //                 this.loader = true;
    //                 this.processRequest = false;
    //                 this.$vs.loading.close(`#${id} > .con-vs-loading`);
    //                 EventBus.$emit("loader", false);
    //                 window.console.error(error);
    //               });
    //           })
    //           .catch((error) => {
    //             this.loader = true;
    //             this.processRequest = false;
    //             this.$vs.loading.close(`#${id} > .con-vs-loading`);
    //             EventBus.$emit("loader", false);
    //             window.console.error(error);
    //           });
    //       })
    //       .catch((error) => {
    //         //Loader
    //         this.toggleDataSidebar(true);
    //         this.reset();
    //         this.loader = true;
    //         this.processRequest = false;
    //         this.$vs.loading.close(`#${id} > .con-vs-loading`);
    //         EventBus.$emit("loader", false);
    //         this.$vs.notify({
    //           position: "top-center",
    //           text: error,
    //           iconPack: "feather",
    //           icon: "icon-alert-circle",
    //           color: "danger",
    //         });
    //         window.console.error(error);
    //       });
    //   }
    // },
    toggleDataSidebarAvoir(val = false) {
      this.addNewDataSidebarAvoir = val;
    },

    montantAvoirAssign() {
      if (this.montant > this.compte.avoir) this.montant = this.compte.avoir;
    },
    montantToRemove() {
      if (this.montant > this.compte.in) this.montant = this.compte.in;
    },
  },
  computed: {
    ...mapGetters({
      getCurrentAg: "association/getcurrentAssociationAg",
      getCurrentAssociation: "association/getCurrentAssociation",
    }),
    membreData() {
      return this.$store.state.association.members;
    },

    memberActivities() {
      return this.$store.state.association.member_activities;
    },

    selectOptions() {
      if (this.membreData != null)
        return this.membreData.map((membre) => ({
          id: membre.id,
          text: membre.firstName,
          value: membre.id,
        }));
    },

    selectOptionsActivities() {
      return this.selectOptionActivities();
    },

    paymentModSelectOptions() {
      return payment_mod.map((type) => ({
        text: this.$t(type.i18n),
        value: type.value,
      }));
    },

    paymentModSelectOptionsDisbursement() {
      return payment_mod.map((type) => ({
        text: this.$t(type.i18n),
        value: type.value,
      }));
    },

    disbursementModSelectOptions() {
      return disbursement_mod.map((type) => ({
        text: this.$t(type.i18n),
        value: type.value,
      }));
    },

    validateForm() {
      return (
        this.compte == "" ||
        this.montant == 0 ||
        this.date_retrait == "" ||
        (this.inputs[this.inputs.length - 1] &&
          this.inputs[this.inputs.length - 1].comptes_id == "") ||
        (this.inputs[this.inputs.length - 1] &&
          this.inputs[this.inputs.length - 1].montant == "") ||
        this.methode_payement == ""
      );
    },
  },
  created() {
    EventBus.$emit("loader", true);
    this.devise = this.$store.state.association.currentAssociation.devise;

    getStatisiqueDecaissementApi({
      assId: this.$store.state.association.currentAssociation.id,
      agId: this.uuid,
    })
      .then((e) => e.data.data)
      .then((t) =>
        t.map((e) => ({
          id: this.currentId++,
          username: e.membre,
          out: e.montant_realise,
          in: e.montant_attendu,
          membre_id: e.membre_id,
          transactions: e.transactions,
        }))
      )
      .then(
        (val) => (this.members = val.filter((e) => !(e.in == 0 && e.out == 0)))
      )
      .then(() => {
        /* Listes des avoirs */
        getAvoirs({
          assId: this.$store.state.association.currentAssociation.id,
        })
          .then((res) => {
            let donnees = res.data.data;
            this.avoirs = [];
            if (donnees.length) {
              donnees.forEach((element) => {
                if (element.avoir > 0) {
                  this.avoirs.push(element);
                }
              });
            }
          })
          .catch((error) => {
            window.console.error(error);
          });
      })
      .then(() => EventBus.$emit("loader", false));

    // if (!moduleFinance.isRegistered) {
    //     this.$store.registerModule('finance', moduleFinance)
    //     moduleFinance.isRegistered = true
    // }
    // if (!moduleMember.isRegistered) {
    //     this.$store.registerModule('member', moduleMember)
    //     moduleMember.isRegistered = true
    // }
    // if (!moduleUserManagement.isRegistered) {
    //     this.$store.registerModule('userManagement', moduleUserManagement)
    //     moduleUserManagement.isRegistered = true
    // }

    let current_association = this.$store.state.association.currentAssociation;

    let payload = {
      resourceUrl: "/api/association/" + current_association.id + "/membre",
      commitAction: "SET_MEMBERS",
    };

    this.$store
      .dispatch("association/fetchMembers", payload)
      .then((res) => {
        this.membres = res.data.data;
        this.membre_actuel = this.extractMember(res.data.data);

        getStatisiqueDecaissementApi({
          assId: this.$store.state.association.currentAssociation.id,
          agId: this.uuid,
        })
          .then((e) => e.data.data)
          .then((t) =>
            t.map((e) => {
              return {
                id: this.currentId++,
                username: e.membre,
                out: e.montant_realise,
                in: e.montant_attendu,
                membre_id: e.membre_id,
                transactions: e.transactions,
              };
            })
          )
          .then(
            (val) =>
              (this.members = val.filter((e) => !(e.in == 0 && e.out == 0)))
          )
          .then(() => {
            /* Listes des avoirs */
            getAvoirs({
              assId: this.$store.state.association.currentAssociation.id,
            })
              .then((res) => {
                let donnees = res.data.data;
                this.avoirs = [];
                if (donnees.length) {
                  donnees.forEach((element) => {
                    if (element.avoir > 0) {
                      this.avoirs.push(element);
                    }
                  });
                }
              })
              .catch((error) => {
                window.console.error(error);
              });
          })
          .then(() => EventBus.$emit("loader", false));
      })
      .catch((error) => {
        window.console.log(error);
      });
  },
  mounted() {
    this.methode_payement = {
      text: this.$t(payment_mod[0].i18n),
      value: payment_mod[0].value,
    };

    this.methode_decaissement = {
      text: this.$t(disbursement_mod[1].i18n),
      value: disbursement_mod[1].value,
    };

    this.methode_payement_avoir = {
      text: this.$t(payment_mod[0].i18n),
      value: payment_mod[0].value,
    };
  }, //
};
</script>

<style lang="scss">
.text-center .vs-input--input.normal {
  text-align: center !important;
}

/* .vs-table--content {
        width: 100%;
        overflow: auto;
        margin-top: -13px;
    } */
.allocate-btn {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}

.ajout-masse {
  min-height: 50px !important;
  padding: 0;
}

.activite {
  .vs__dropdown-menu {
    max-height: 180px !important;
  }
}

.disabled {
  pointer-events: none;
  color: #bfcbd9;
  cursor: not-allowed;
  background-image: none;
  background-color: #eef1f6;
  border-color: #d1dbe5;
}

.user-name {
  max-width: 15rem;
}
</style>
