<template>
  <div id="data-list-list-view" class="data-list-container">
    <!-- Popup pour supprimer une association -->
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
          id="button-with-loading1"
          :disabled="!loader"
          @click.stop="deleteItem(association_selectionnee)"
        >
          {{ $t("delete") }}
        </vs-button>
      </div>
    </vs-popup>

    <!-- Popup pour désactiver une association -->
    <!-- <vs-popup
      classContent="popup-example"
      :title="$t('changeAssociationState')"
      :active.sync="popupActivo1"
    >
      <p >
        {{ $t("changeAssociationStateMessage") }}
      </p>
       <p v-if="currentAssociation.emailVerifiedAt != null">
        {{ $t("changeAssociationStateMessage") }}
      </p> -->
    <!-- <p v-else>
        {{ $t('The email address') }}
        <span class="text-primary">{{ currentAssociation.email }}</span>
        {{ `of ${currentAssociation.nom} is not verified yet. We must verify it before activating your association.` }}
      </p> -->
      <!-- <vs-divider />
      <div class="vx-row w-full justify-end">
        <vs-button color="warning" @click="popupActivo1 = false" type="border">
          {{ $t("cancel") }} </vs-button
        >&nbsp;&nbsp; -->
<!-- 
        <vs-button
          v-if="currentAssociation.emailVerifiedAt != null"
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading2"
          :disabled="!loader"
          @click.stop="activerOudesactiverAssociation"
        >
          {{ $t("proceed") | Capitalize }}
        </vs-button> -->

        <!-- <vs-button
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading2"
          :disabled="!loader"
          @click.stop="activerOudesactiverAssociation"
        >
          {{ $t("proceed") | Capitalize }}
        </vs-button> -->

    <!-- <vs-button
          v-else
          class="ml-3 vs-con-loading__container"
          color="danger"
          ref="loadableButton"
          id="button-with-loading2"
          :disabled="!loader"
          @click.stop="sendEmailActivationCode"
        >
          {{ $t("Ok, Send me the activation code") }}
        </vs-button> -->
      <!-- </div>
    </vs-popup> -->
    <!-- <vx-card no-shadow class="mt-4 mb-5">
          <h4  class="mb-2"> {{ $t('listOfAssociation') | CAPITALIZE }} </h4>
        </vx-card> -->
    <vs-table :data="[currentAssociation]" class="mt-4">
      <template slot="thead">
        <vs-th>#</vs-th>
        <vs-th>{{ $t("name") | CAPITALIZE }}</vs-th>
        <vs-th>{{ $t("creationDate") | CAPITALIZE }}</vs-th>
        <vs-th>{{ $t("motto") | CAPITALIZE }}</vs-th>
        <vs-th>{{ $t("visibility") | CAPITALIZE }}</vs-th>
        <vs-th>{{ $t("state") | CAPITALIZE }}</vs-th>
        <vs-th>{{ $t("actions") | CAPITALIZE }}</vs-th>
      </template>

      <template slot-scope="{ data }">
        <vs-tr
          :data="association"
          :key="index"
          v-for="(association, index) in data"
        >
          <vs-td>
            <p>{{ index + 1 }}</p>
          </vs-td>
          <vs-td>
            <p>{{ association.nom }}</p>
          </vs-td>
          <vs-td>
            <p>{{ association.date_creation | dateTime }}</p>
          </vs-td>
          <vs-td>
            <p>{{ association.devise }}</p>
          </vs-td>
          <vs-td>
            <p>{{ afficheVisibilite(association.visibilite_financiere) }}</p>
          </vs-td>
          <vs-td>
            <p v-if="association.etat === true">
              <vs-chip color="success">{{ $t("activated") }}</vs-chip>
            </p>
            <p v-if="association.etat === false">
              <vs-chip>{{ $t("desactivated") }}</vs-chip>
            </p>
          </vs-td>
          <vs-td>
            <vx-tooltip
              v-if="etat_association"
              :text="$t('activate') + ' ' + $t('or') + ' ' + $t('desactivate')"
              position="bottom"
              class="inline-block"
            >
              <feather-icon
                icon="ToggleRightIcon"
                svgClasses="w-5 h-5 hover:text-success text-success stroke-current"
                @click.stop="activerOudesactiverAssociation()"
              />
            </vx-tooltip>
            <vx-tooltip
              v-else
              :text="$t('activate') + ' ' + $t('or') + ' ' + $t('desactivate')"
              position="bottom"
              class="inline-block"
            >
              <feather-icon
                icon="ToggleLeftIcon"
                svgClasses="w-5 h-5 hover:text-grey text-grey stroke-current"
                @click.stop="activerOudesactiverAssociation()"
              />
            </vx-tooltip>
            <vx-tooltip
              :text="$t('delete')"
              position="bottom"
              class="inline-block ml-2"
            >
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                @click.stop="
                  popupActivo2 = true;
                  association_selectionnee = association.id;
                "
              />
            </vx-tooltip>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
//Fonctions
import { frequence_seance } from "../services/data/sessionFrequency";
import { visibility } from "../../../services/data/visibility";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      cycle_actif: null,
      ags: null,
      // current_association: [],
      // popupActivo1: false,
      popupActivo2: false,
      association_selectionnee: "",
      etat_association: false,

      /* Loading */
      backgroundLoading: "danger",
      colorLoading: "#fff",
      loader: true,
    };
  },
  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
    }),
    afficheFrequenche() {
      const filtered = frequence_seance.reduce(
        (a, o) =>
          o.value == this.cycle_actif.frequence_seance ? a.concat(o.text) : a,
        ""
      );
      return filtered.toLowerCase();
    },
  },
  methods: {
    afficheVisibilite(visibilite) {
      return visibility.reduce(
        (a, o) => (o.value == visibilite ? a.concat(this.$t(o.i18n)) : a),
        ""
      );
    },
    activerOudesactiverAssociation() {
      // this.openLoadingContained(2);
      var association_courante =
        this.$store.state.association.currentAssociation;

      let payload = {
        resourceUrl: "/api/association/" + association_courante.id + "/state",
        commitAction: "SET_CURRENT_ASSOCIATION",
      };

      this.$store
        .dispatch("association/getRequest", payload)
        .then((res) => {
          this.loader = true;
          // this.current_association = [];
          // this.current_association.push(res.data.data);
          if (res.data.data.etat === true) this.etat_association = true;
          else this.etat_association = false;
          // this.popupActivo1 = false;
          this.$vs.loading.close("#button-with-loading2 > .con-vs-loading");
        })
        .catch((error) => {
          window.console.error(error);
        });
    },
    deleteItem(id) {
      this.openLoadingContained(1);
      var user = this.$store.state.authentificated.user;

      let payload = {
        resourceUrl: "/api/association/" + id + "/admin/" + user.id,
        commitAction: "NO_COMMIT",
      };

      this.$store
        .dispatch("association/removeRecord", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading1 > .con-vs-loading");
          this.popupActivo2 = false;
          this.$vs.notify({
            position: "top-center",

            text: this.$t("associationSuccessfullyDelete"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          setTimeout(() => this.$router.push("/associations"), 1000);
        })
        .catch((err) => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading1 > .con-vs-loading");
          window.console.error(err);
        });
    },

    /* Loading */
    openLoadingContained(idLoader) {
      this.loader = false;
      this.$vs.loading({
        background: this.backgroundLoading,
        color: this.colorLoading,
        container: `#button-with-loading${idLoader}`,
        scale: 0.45,
      });
    },
  },
  created() {
    this.etat_association = Boolean(
      this.$store.state.association.currentAssociation.etat
    );
  },
};
</script>


