<template>
  <div>
    <vs-dropdown
      vs-trigger-click
      class="fixed z-50 ml-auto cursor-pointer md:block"
      style="right: 35px"
    >
      <vs-button icon="icon-settings" icon-pack="feather">{{
        $t("actions")
      }}</vs-button>

      <vs-dropdown-menu style="min-width: 14.5rem">
        <!-- Tableau de bord -->
        <vs-dropdown-item v-if="admin">
          <div
            class="flex items-center"
            @click="
              $router
                .push('/association/administration/activities/mutual/details')
                .catch(() => {})
            "
          >
            <!-- <feather-icon icon="HomeIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("Dashboard") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Echéances -->
        <vs-dropdown-item v-if="admin">
          <div
            class="flex items-center"
            @click="
              $router
                .push(
                  '/association/administration/activities/mutual/settlements'
                )
                .catch(() => {})
            "
          >
            <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("settlement") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Impayés -->
        <vs-dropdown-item v-if="admin">
          <div
            class="flex items-center"
            @click="
              $router
                .push('/association/administration/activities/mutual/debt')
                .catch(() => {})
            "
          >
            <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("debt") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Transactions -->
        <vs-dropdown-item v-if="admin">
          <div class="flex items-center" @click="redirectTransactions">
            <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("transactions") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Notes -->
        <vs-dropdown-item v-if="admin">
          <div
            class="flex items-center"
            @click="
              $router
                .push('/association/administration/activities/mutual/notes')
                .catch(() => {})
            "
          >
            <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("notes") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Ajouter un avoir -->
        <vs-dropdown-item v-if="admin">
          <div class="flex items-center" @click="addNewData('AjoutAvoir')">
            <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("addAssets") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Mise de fonds  -->
        <vs-dropdown-item v-if="admin && etat_activite != 'cloture'">
          <div
            class="flex items-center"
            @click="
              $router
                .push('/association/administration/activities/mutual/fundings')
                .catch(() => {})
            "
          >
            <!-- <feather-icon icon="CircleIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("makeADownPayment") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Demande de mise de fonds -->
        <vs-dropdown-item v-if="admin && etat_activite != 'cloture'">
          <div
            @click="
              $router
                .push(
                  '/association/administration/activities/mutual/funding-request'
                )
                .catch(() => {})
            "
            class="flex items-center"
          >
            <!-- <feather-icon icon="DollarSignIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("requestDownPayment") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Demande de credit -->
        <vs-dropdown-item v-if="etat_activite != 'cloture'">
          <div @click="addNewData('DemandeCredit')" class="flex items-center">
            <!-- <feather-icon icon="ListIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("applyForCredit") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Demande de cotisation -->
        <vs-dropdown-item v-if="admin && etat_activite != 'cloture'">
          <div
            @click="
              $router
                .push(
                  '/association/administration/activities/mutual/ask-for-contribution'
                )
                .catch(() => {})
            "
            class="flex items-center"
          >
            <!-- <feather-icon icon="DollarSignIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("askForBond") }}</span>
          </div>
        </vs-dropdown-item>

        <vs-divider v-if="admin" class="m-1" />

        <!-- Activer une activité -->
        <vs-dropdown-item
          v-if="admin && etat_activite != 'actif' && etat_activite != 'cloture'"
        >
          <div class="flex items-center" @click="activerActivite">
            <!-- <feather-icon icon="ToggleRightIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("activate") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Mettre à jour une activité -->
        <vs-dropdown-item
          v-if="admin && etat_activite != 'actif' && etat_activite != 'cloture'"
        >
          <div @click="redirectUpdate" class="flex items-center">
            <!-- <feather-icon icon="EditIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("update") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Clôturer -->
        <vs-dropdown-item v-if="admin && etat_activite != 'cloture'">
          <div @click="redirectClose" class="flex items-center">
            <!-- <feather-icon icon="EditIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("cloturer") }}</span>
          </div>
        </vs-dropdown-item>

        <!-- Afficher la liste des activités -->
        <vs-dropdown-item v-if="admin">
          <div
            @click="
              $router
                .push('/association/administration/activities/mutual/all')
                .catch(() => {})
            "
            class="flex items-center"
          >
            <!-- <feather-icon icon="ListIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("list") }}</span>
          </div>
        </vs-dropdown-item>

        <vs-divider v-if="admin" class="m-1" />

        <!-- Afficher la liste de toutes les activités -->
        <vs-dropdown-item v-if="admin">
          <div
            class="flex items-center mb-3"
            @click="
              $router
                .push('/association/administration/activities')
                .catch(() => {})
            "
          >
            <!-- <feather-icon icon="ToggleRightIcon" class="inline-block mr-2" svgClasses="w-4 h-4" /> -->
            <span>{{ $t("allActivities") }}</span>
          </div>
        </vs-dropdown-item>
      </vs-dropdown-menu>
    </vs-dropdown>

    <Data-view-sidebar
      :isSidebarActive="addNewDataSidebar"
      @closeSidebar="toggleDataSidebar"
      :data="sidebarData"
      :etat="etat"
      :members="membres"
      :activity="activite"
      :mutual="mutuelle"
    />
  </div>
</template>

<script>
//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

import DataViewSidebar from "../../../../../components/sidebar/DataViewSidebar.component";
import checkIfAdmin from "../../../../../mixins/checkRole";
// Map getters from vuex
import { mapGetters } from "vuex";

export default {
  props: ["activity"],
  mixins: [checkIfAdmin],
  data() {
    return {
      // Data Sidebar
      addNewDataSidebar: false,
      sidebarData: {},
      etat: "",
      membres: [],
      membre_inscris: [],
      activite: null,
      mutuelle: null,
    };
  },
  components: {
    DataViewSidebar,
  },
  computed: {
    ...mapGetters({
      getAuthenticated: "authentificated/getAuth",
      getCurrentAssociation: "association/getCurrentAssociation",
      getMembers: "association/getMembers",
      getAccounts: "association/getAccounts",
    }),
    admin() {
      return this.isSuperAdministrator;
    },
    etat_activite() {
      return this.activity != "" ? this.activity.etat : "";
    },
  },
  methods: {
    //Redirige vers la pages des transactions
    redirectTransactions() {
      let payload = {
        resourceUrl: "/api/activite/" + this.activity.id + "/comptes/all",
        commitAction: "SET_ACCOUNTS",
      };

      this.$store
        .dispatch("association/fetchComptemembreActivite", payload)
        .then((res) => {
          let comptes = res.data.data;

          if (comptes.length > 0) {
            let transactions = [];

            comptes.forEach((element) => {
              if (element.transactions.length > 0) {
                element.transactions.forEach((transaction) => {
                  transactions.push({
                    comptes_id: transaction.comptes_id,
                    created_by: transaction.created_by,
                    date_created: transaction.date_created,
                    debit_credit: transaction.debit_credit,
                    etat: transaction.etat,
                    id: transaction.id,
                    libelle: transaction.libelle,
                    montant: transaction.montant,
                    montant_attendu: transaction.montant_attendu,
                    operations_id: transaction.operations_id,
                    membre: element.membre,
                    membres_id: element.membres_id,
                  });
                });
              }
            });

            this.$store.commit("association/SET_TRANSACTIONS", transactions);
            // Remove member_id to trigger the printing of all transactions
            this.$store.commit("association/SET_ACCOUNT", "");
            this.$store.commit("association/SET_MEMBER", null);
            localStorage.removeItem("member_id");
          }
          this.$router.push(
            "/association/administration/activities/mutual/member-transactions"
          );
        });
    },
    //Activer l'activite
    activerActivite() {
      var association_courante = this.getCurrentAssociation;
      var activite_courante = this.activity;

      let payload = {
        resourceUrl:
          "api/association/" +
          association_courante.id +
          "/activite/" +
          activite_courante.id +
          "/state/actif",
        commitAction: "SET_ACTIVITES",
      };
      this.$store
        .dispatch("activite/fetchAssociationactivite", payload)
        .then(() => {
          activite_courante.etat = "actif";
          this.$store.commit("association/SET_ACTIVITE", activite_courante);

          // localStorage.setItem('activite_parameter', JSON.stringify(activite_courante))
          this.etat_activite = activite_courante.etat;
          this.$vs.notify({
            position: "top-center",

            text: this.$t("activityActivatedSuccessfully"),
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

    //Desactiver l'activite
    desactiverActivite() {
      var association_courante = this.getCurrentAssociation;
      var activite_courante = this.activity;

      let payload = {
        resourceUrl:
          "api/association/" +
          association_courante.id +
          "/activite/" +
          activite_courante.id +
          "/state/inactif",
        commitAction: "SET_ACTIVITES",
      };
      this.$store
        .dispatch("association/fetchAssociationactivite", payload)
        .then(() => {
          activite_courante.etat = "inactif";
          this.$store.commit("association/SET_ACTIVITE", activite_courante);

          // localStorage.setItem('activite_parameter', JSON.stringify(activite_courante))
          this.etat_activite = activite_courante.etat;
          this.$vs.notify({
            position: "top-center",

            text: this.$t("notifContent"),
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
    /* Demande de crédit */
    addNewData(etat) {
      this.etat = etat;
      this.sidebarData = {};
      this.membres = this.admin ? this.getAccounts : this.membre_inscris;
      this.activite = this.$store.state.association.activite;
      this.mutuelle = this.$store.state.association.activite.Mutuelle;
      this.toggleDataSidebar(true);
    },
    //Redirection vers la page de modification de la tontine
    redirectUpdate() {
      localStorage.setItem("activity_id", JSON.stringify(this.activity.id));
      this.$router.push({
        name: "association:administration:activity:mutual:edit",
      });
    },

    //Redirection vers la page de clôture de l'activité'
    redirectClose() {
      var activite_cloture = this.activity;

      localStorage.setItem("activity_id", JSON.stringify(activite_cloture.id));
      this.$router.push(
        `/association/administration/activities/${activite_cloture.id}/closure`
      );
    },

    //Extraire le membre connecté
    extractMember(members) {
      var user = this.getAuthenticated;
      var id;

      members.forEach((member) => {
        member.users.forEach((author) => {
          if (user.id == author.id) {
            id = member;
          }
        });
      });
      return id;
    },
    toggleDataSidebar(val = false) {
      this.addNewDataSidebar = val;
    },
  },
  created() {
    const payload = {
      resourceUrl:
        "/api/association/" + this.getCurrentAssociation.id + "/membre",
      commitAction: "SET_MEMBERS",
    };

    this.$store
      .dispatch("association/fetchMembers", payload)
      .then((res) => {
        let membre_courant = this.extractMember(res.data.data);
        const compte_courant = this.getAccounts.find(account => account.membres_id === membre_courant.id);

        if(compte_courant)
          this.membre_inscris.push(compte_courant);
      })
      .catch((error) => {
        window.console.log(error);
      });
  },
};
</script>
