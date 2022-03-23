<template>
  <vs-sidebar
    :click-not-close="clickNotClose"
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4 v-if="this.etat == 'AjoutCompte' || this.etat == 'AjoutCompteMasse'">
        {{ $t("addAccount") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AjoutNouvelle'">
        {{ $t("addNew") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'ModifierNouvelle'">
        {{ $t("updateNew") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AjoutDocument'">
        {{ $t("addDocument") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'Invitation'">
        {{ $t("memberInvitation") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'Detail'">{{ $t("userDetail") | CAPITALIZE }}</h4>
      <h4 v-if="this.etat == 'Import'">
        {{ $t("importFromCsv") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'ModifierCompte'">
        {{ $t("updateAccount") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'DetailCompte'">
        {{ $t("accountDetail") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'DetailActivite'">
        {{ $t("activityDetail") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'DetailOperation'">
        {{ $t("operationDetail") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AllouerSomme'">
        {{ $t("allocateSum") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'PermuterBeneficiaire'">
        {{ $t("swapBeneficiary") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AjusterPart'">
        {{ $t("adjustParts") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'ImporterFonds'">
        {{ $t("importFromFile") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'MisePourTous'">
        {{ $t("downPaymentForAllMembers") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'MiseMembre'">
        {{ $t("downPaymentForAMember") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'EmpruntEnCours'">
        {{ $t("recordingCreditsInProgress") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'DetailNouvelle'">
        {{ $t("newsDetail") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'DemandeCredit'">
        {{ $t("creditApplication") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'DeplacerLot'">
        {{ $t("moveABatch") | CAPITALIZE }}
      </h4>
      <slot name="title"> </slot>

      <h4 v-if="this.etat == 'DetailFonds'">
        {{ $t("downPaymentDetail") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AjoutTypeAssistance'">
        {{ $t("addingATypeOfAssistance") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AjoutTypeAssistancePassee'">
        {{ $t("addingPastAssistance") | CAPITALIZE }}
      </h4>

      <h4 v-if="this.etat == 'AjoutAssistance'">
        {{ $t("declarationOfAssistance") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'updateCredit'">
        {{ $t("creditUpdate") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AjoutAvoir'">
        {{ $t("newAssets") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'ParametresMutuelle'">
        {{ `${$t("activitySettings")} - ${mutual.nom}` | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'CreditDetail'">
        {{ `${$t("creditDetail")} ` | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'ParametresTontine'">
        {{ `${$t("activitySettings")} - ${activity.nom}` | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'RetraitArgent'">
        {{ `${$t("disbursementActivity")} - ${activity.nom}` | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'AjouterNote'">
        {{ $t("addANote") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'ModifierNote'">
        {{ $t("updateANote") | CAPITALIZE }}
      </h4>
      <h4 v-if="this.etat == 'Decaissement'">
        {{ $t("decaissementParams") }}
      </h4>
      <h4 v-if="this.etat == 'NewExitVoucher'">
        {{ $t("newExitVoucher") }}
      </h4>

      <feather-icon
        icon="XCircleIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="p-6">
        <slot name="component"></slot>
        <!--Modifier compte membre via formulaire -->
        <update-member
          v-if="this.etat == 'ModifierCompte'"
          :member="this.data"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :idLoader="'button-loading'"
        />

        <!--Ajout compte membre via formulaire -->
        <add-account
          v-if="this.etat == 'AjoutCompte'"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :idLoader="'button-loading'"
        />

        <!-- Ajouter compte membre en masse -->
        <bulk
          v-if="this.etat == 'AjoutCompteMasse'"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :idLoader="'button-loading'"
        />

        <!--Ajout compte membre via fichier csv -->
        <add-accounts-CSV
          v-if="this.etat == 'Import'"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :idLoader="'button-loading'"
        />

        <!-- /Fin Ajout compte membre via fichier csv -->

        <!-- Afficher le formulaire pour inviter un utisateur à joindre un compte membre -->
        <invite-user
          v-if="this.etat == 'Invitation'"
          :member="this.data"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :idLoader="'button-loading'"
        />

        <!-- Afficher les informations d'un utilisateur associé à un compte membre -->
        <user-details
          v-if="this.etat == 'Detail'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :userData="this.data"
          :userRoles="userRoles"
          :roles="roles"
          :member="member"
        />

        <!-- Afficher les informations d'un compte membre -->
        <member-details
          v-if="this.etat == 'DetailCompte'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :member="this.data"
          :userRoles="userRoles"
          :roles="roles"
        />
        <!-- /Fin Afficher les informations d'un  compte membre -->

        <!-- Formulaire pour ajouter une nouvelle -->
        <add-new
          v-if="this.etat == 'AjoutNouvelle' || this.etat == 'ModifierNouvelle'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :nouvelles="this.data"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour ajouter une nouvelle -->
        <new-details
          v-if="this.etat == 'DetailNouvelle'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :nouvelles="this.data"
        />

        <!-- Formulaire pour ajouter un document -->
        <add-document
          v-if="this.etat == 'AjoutDocument'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :idLoader="'button-loading'"
        />

        <!-- Voir le detail d'une operation -->
        <operation-details
          v-if="this.etat == 'DetailOperation'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :operation="this.data"
        />

        <!-- Voir le detail d'une activite -->
        <activity-details
          v-if="this.etat == 'DetailActivite'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :activite="this.data"
        />

        <!-- Allouer la même somme à tous les utilisateurs -->
        <allocate-sum
          v-if="this.etat == 'AllouerSomme'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :activite="activity"
          @disable="disable = $event"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour permuter deux bénéficiaires -->
        <swap-beneficiaries
          v-if="this.etat == 'PermuterBeneficiaire'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membres="this.members"
          :activite="this.activity"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour ajuster la part d'un membre -->
        <adjust-parts
          v-if="this.etat == 'AjusterPart'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :nouvelles="this.members"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour la mise de fonds de tous les membres-->
        <payment-for-all
          v-if="this.etat == 'MisePourTous'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membres="this.members"
          :mutuelle="this.mutual"
          :activite="this.activity"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour la mise de fonds d'un membre-->
        <payment-of-member
          v-if="this.etat == 'MiseMembre'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membre="this.data"
          :mutuelle="this.mutual"
          :activite="this.activity"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour importer la mise de fonds des membres-->
        <import-payment
          v-if="this.etat == 'ImporterFonds'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membres="this.members"
          :mutuelle="this.mutual"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour enregistrer un emprunt-->
        <loans-in-progress
          v-if="this.etat == 'EmpruntEnCours'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membres="this.members"
          :activite="this.activity"
          :mutuelle="this.mutual"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour effectuer une demande de credit-->
        <credit-application
          v-if="this.etat == 'DemandeCredit'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membres="this.members"
          :activite="this.activity"
          :mutuelle="this.mutual"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour mettre à jour un credit-->
        <update-credit
          v-if="this.etat == 'updateCredit'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :credit="this.data"
          :preview="false"
          :mutuelle="this.mutual"
          :idLoader="'button-loading'"
        />

        <!-- Voir le detail d'une mise de fonds -->
        <down-payment-detail
          v-if="this.etat == 'DetailFonds'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :membre="this.data"
          :mutuelle="this.mutual"
        />

        <!-- Formulaire pour ajouter un type d'assistance-->
        <assist-type
          v-if="this.etat == 'AjoutTypeAssistance'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membre="this.data"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour ajouter une assistance-->
        <assistance
          v-if="this.etat == 'AjoutAssistance'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membre="this.data"
          :activity="activity"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour ajouter une assistance passé-->
        <assist-list
          v-if="this.etat == 'AjoutTypeAssistancePassee'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membre="this.data"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour ajouter un avoir -->
        <add-assets
          v-if="this.etat == 'AjoutAvoir'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membre="this.data"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour retirer de l'argent dans une activité -->
        <withdraw-money
          v-if="this.etat == 'RetraitArgent'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :activite="activity"
          :idLoader="'button-loading'"
        />

        <!-- Formulaire pour deplacer un lot-->
        <move-lot
          v-if="this.etat == 'DeplacerLot'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :activite="activity"
          :idLoader="'button-loading'"
        />

        <!-- Paramètres de la Mutuelle-->
        <mutual-parameter
          v-if="this.etat == 'ParametresMutuelle'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :activite="mutual"
        />

        <!-- detail credit-->
        <credit-detail
          v-if="this.etat == 'CreditDetail'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :credit="mutual"
        />

        <!-- Paramètres de la Tontine-->
        <tontine-parameter
          v-if="this.etat == 'ParametresTontine'"
          class="ep-association"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :activite="activity"
        />

        <!-- Ajouter une note-->
        <add-note
          v-if="this.etat == 'AjouterNote'"
          class="ep-association"
          ref="form"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :membre="this.data"
          :idLoader="'button-loading'"
          :activite="activity"
        />

        <!-- Mise à jour d'une note-->
        <update-note
          v-if="this.etat == 'ModifierNote'"
          class="ep-association"
          ref="form"
          :idLoader="'button-loading'"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @disable="disable = $event"
          :activite="activity"
          :note="data"
        />

        <!-- Withdrawal form -->
        <withdrawal
          v-if="this.etat == 'Decaissement'"
          class="ep-association"
          ref="form"
          :idLoader="'button-loading'"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          @onFormValidation="onFormValidation($event);"
          @onFormSubmitted="onFormSubmitted($event);"
          @onFormCompleted="onFormCompleted($event);"
          :propRecipient="data.firstName"
          :propGeneralAssembly="data.ag"
          @disable="disable = $event"
        />

        <!-- Create a new exit voucher -->
        <new-exit-voucher
          v-if="this.etat == 'NewExitVoucher'"
          class="ep-association"
          ref="form"
          :idLoader="'button-loading'"
          @isSidebarActiveLocal="isSidebarActiveLocal = $event"
          :ags="data.ags"
          @disable="disable = $event"
        />
      </div>
    </VuePerfectScrollbar>
    <div
      v-if="
        this.etat != 'Detail' &&
        this.etat != 'Import' &&
        this.etat != 'DetailOperation' &&
        this.etat != 'AjoutDocument' &&
        this.etat != 'DetailCompte' &&
        this.etat != 'DetailActivite' &&
        this.etat != 'DetailFonds' &&
        this.etat != 'ImporterFonds' &&
        this.etat != 'DetailNouvelle' &&
        this.etat != 'DetailsTransactionsUwallet' &&
        this.etat != 'DetailsCashinoutUwallet' &&
        this.etat != 'ParametresMutuelle' &&
        this.etat != 'CreditDetail' &&
        this.etat != 'ParametresTontine'
      "
      class="flex flex-wrap items-center p-6"
      slot="footer"
    >
      <slot>
        <vs-button
          class="mr-6"
          type="border"
          color="danger"
          @click="isSidebarActiveLocal = false"
        >
          {{ $t("cancel") }}
        </vs-button>

        <vs-button
          class="ml-3 vs-con-loading__container"
          ref="loadableButton"
          id="button-loading"
          :disabled="disable"
          @click.prevent="submit"
        >
          {{ $t(`${ submitAndContinue ? 'save' : 'submit'}`) }}
        </vs-button>
        <vs-button
          v-if="submitAndContinue"
          class="ml-3 vs-con-loading__container"
          ref="loadableButton"
          id="button-loading"
          :disabled="disable"
          @click.prevent="submitNext"
        >
          {{ $t("saveAndContinue") }}
        </vs-button>
      </slot>
    </div>
    <slot name="footer" v-else></slot>
  </vs-sidebar>
</template>

<script>
//Composants
import UpdateMember from "./components/UpdateMember.component.vue";
import AddAccount from "./components/AddAccount.component.vue";
// import Bulk from './bulk.vue'
import AddAccountsCSV from "./components/AddAccountsCSV.component.vue";
import InviteUser from "./components/InviteUser.component.vue";
import UserDetails from "./components/UserDetails.component";
import MemberDetails from "./components/MemberDetails.component.vue";
import AddNew from "./components/AddNew.component.vue";
import AddDocument from "./components/AddDocument.component.vue";
import OperationDetails from "./components/OperationDetails.component.vue";
import AllocateSum from "./components/AllocateSum.component.vue";
import ActivityDetails from "./components/ActivityDetails.component.vue";
import SwapBeneficiaries from "./components/SwapBeneficiaries.component.vue";
// import AdjustParts from './adjustParts.vue'
import ImportPayment from "./components/PaymentsFromFile.component";
import PaymentForAll from "./components/PaymentForAll.component.vue";
// import PaymentOfMember from './paymentOfAMember.vue'
import LoansInProgress from "./components/LoansInProgress.component.vue";
import DownPaymentDetail from "./components/FundingDetails.component.vue";
import AssistType from "./components/AssistType.component.vue";
import AssistList from "./components/AssistList.component.vue";
import Assistance from "./components/Assistance.component.vue";
import NewDetails from "./components/NewDetails.component.vue";
import CreditApplication from "./components/CreditApplication.component.vue";
import UpdateCredit from "./components/UpdateCredit.component.vue";
import AddAssets from "./components/AddAssets.component.vue";
import MoveLot from "./components/MoveLot.component.vue";
import MutualParameter from "./components/MutualParameter.component.vue";
import CreditDetail from "./components/CreditDetails.component.vue";
import TontineParameter from "./components/TontineParameter.component.vue";
import WithdrawMoney from "./components/WithdrawMoney.component.vue";
import AddNote from "./components/AddNote.component.vue";
import UpdateNote from "./components/UpdateNote.component.vue";
import Withdrawal from "./components/Withdrawal.component.vue";
import NewExitVoucher from "./components/NewExitVoucher.component";

import Vue from "vue";
import VueTelInput from "vue-tel-input";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { VueCsvImport } from "vue-csv-import";
import Antd from "ant-design-vue";

import "flatpickr/dist/flatpickr.css";

import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";

import VueTimepicker from "vuejs-timepicker";
import { TooltipPlugin } from "@syncfusion/ej2-vue-popups";

//Importation des feuilles de style
import "@/assets/scss/vuexy/pages/profile.scss";
import "@/assets/css/ant-upload.css";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-vue-popups/styles/material.css";
import CreditDetailsComponent from './components/CreditDetails.component.vue';

Vue.use(VueTimepicker);
Vue.use(Antd);
Vue.use(VueTelInput);
Vue.use(TooltipPlugin);
Vue.component("VueCtkDateTimePicker", VueCtkDateTimePicker);
export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    clickNotClose: {
      type: Boolean,
      default: true,
    },
    submitAndContinue: {
      type: Boolean,
      default: false,
    },
    etat: String,
    member: {
      type: Object,
      default: () => {},
    },
    activity: {
      type: Object,
      default: () => {},
    },

    credit: {
      type: Object,
      default: () => {},
    },

    mutual: {
      type: Object,
      default: () => {},
    },

    members: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: null,
      default: () => {},
    },
    userRoles: {
      type: null,
      default: null,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    isSidebarActive(val) {
      if (!val) return;
      if (Object.entries(this.data).length === 0) {
        this.$validator.reset();
      } else {
        let { id } = JSON.parse(JSON.stringify(this.data));
        this.dataId = id;
      }
    },
  },
  data() {
    return {
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },

      disable: true,
      preview: false,
    };
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) this.$emit("closeSidebar");
      },
    },
  },
  components: {
    UpdateMember,
    AddAccount,
    // Bulk,
    AddAccountsCSV,
    InviteUser,
    UserDetails,
    MemberDetails,
    AddNew,
    AddDocument,
    OperationDetails,
    ActivityDetails,
    AllocateSum,
    SwapBeneficiaries,
    // AdjustParts,
    ImportPayment,
    PaymentForAll,
    // PaymentOfMember,
    LoansInProgress,
    DownPaymentDetail,
    Assistance,
    AssistType,
    NewDetails,
    CreditApplication,
    UpdateCredit,
    AssistList,
    MoveLot,
    AddAssets,
    MutualParameter,
    CreditDetail,
    TontineParameter,
    WithdrawMoney,
    AddNote,
    UpdateNote,
    Withdrawal,
    NewExitVoucher,

    VuePerfectScrollbar,
    VueCsvImport,
    VueTimepicker,
    CreditDetailsComponent,
  },
  methods: {
    onFormValidation($event) {
      this.disable = !$event;
      this.$emit('onFormValidation', $event);
    },
    onFormSubmitted($event) {
      this.disable = true;
      this.$emit('onFormSubmitted', $event);
    },
    onFormCompleted($event) {
      this.disable = false;
      this.$emit('onFormCompleted', $event);
    },
    submit() {
      this.$refs.form.submit();
    },
    submitNext() {
      this.$refs.form.submitNext()
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/vuexy/pages/profile.scss";

.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 600px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }

    .ajout-masse {
      height: 145px !important;
    }

    .col-padding {
      padding: 0 0.5rem !important;
    }
  }
}

.scroll-area--data-list-add-new {
  height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  // height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
}
</style>
