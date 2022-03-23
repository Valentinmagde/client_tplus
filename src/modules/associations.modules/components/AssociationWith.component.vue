<template>
  <div class="slide-swipe">
    <swiper
      :options="swiperOption"
      :dir="$vs.rtl ? 'rtl' : 'ltr'"
      :key="$vs.rtl"
      ref="swiper"
      @click.native="sliderClicked"
    >
      <swiper-slide
        v-for="(association, index) in associationsData"
        v-bind:key="association.id"
        v-on:remove="associationsData.splice(index, 1)"
      >
        <div
          class="ml-6 mr-6"
          :class="{ inactiveAssociation: !association.etat }"
        >
          <!-- Liste des associations -->
          <vx-card no-shadow class="p-2 cursor-pointer p-as card-shadow">
            <div class="flex flex-row-reverse">
              <div class="flex flex-row-reverse w-1/2">
                <vs-chip v-if="!association.etat">{{
                  $t("inactive") | Capitalize
                }}</vs-chip>
              </div>
              <div class="flex flex-row w-1/2">
                <vs-chip
                  v-if="association.membres_wallets_id"
                  :color="association.color"
                  >{{ association.devise }}</vs-chip
                >
              </div>
            </div>

            <div class="col-12">
              <div class="mb-1 bloc-120c">
                <div
                  v-if="association.logo"
                  class="text-center tpimg-circle"
                  :style="{ backgroundImage: 'url(' + association.logo + ')' }"
                ></div>
                <div v-else class="text-center tpimg-circle"></div>
              </div>
            </div>
            <div class="ml-4 mr-4">
              <h4 class="flex flex-wrap justify-center mx-auto">
                {{ association.nom }}
              </h4>
              <div
                class="
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mt-3
                  text-sm text-center text-gray-500
                "
              >
                {{ association.description }}
              </div>
            </div>
            <template slot="footer">
              <vs-divider />
              <div class="p-0 text-sm text-gray-500 vx-row">
                <div class="w-full p-0 vx-col sm:w-1/3">
                  <vs-icon icon="group" size="small" class="flex"></vs-icon>
                  <span class="flex"
                    >{{ association.nombre }} {{ $t("members") }}</span
                  >
                </div>
                <div
                  v-if="
                    association.ags &&
                    association.ags.length > 0 &&
                    prochaineAg(association.ags)
                  "
                  class="w-full p-0 vx-col sm:w-2/3"
                >
                  <span class="flex justify-end pr-3 text-right">
                    {{
                      prochaineAg(association.ags).date_ag | fullDateTime
                    }}</span
                  >
                  <span
                    class="flex justify-end pr-3 text-right"
                    v-if="
                      prochaineAg(association.ags).lieu_ag &&
                      prochaineAg(association.ags).lieu_ag == 'En ligne'
                    "
                  >
                    {{ $t("online") }}
                  </span>
                  <span
                    v-else-if="prochaineAg(association.ags).lieu_ag"
                    class="flex justify-end pr-3 text-right"
                  >
                    {{ prochaineAg(association.ags).lieu_ag }}
                  </span>
                  <span v-else class="flex justify-end pr-3 text-right">
                    {{
                      $t("atTheHomeOf") +
                      " " +
                      prochaineAg(association.ags).membre
                    }}
                  </span>
                </div>
                <div v-else class="w-full p-0 vx-col sm:w-2/3">
                  <span class="flex justify-end pr-3 vx-row">{{
                    association.date_creation | fullDateTime
                  }}</span>
                  <span class="justify-end pr-3 vx-row">{{
                    $t("toDetermined")
                  }}</span>
                </div>
              </div>
            </template>
          </vx-card>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <div class="justify-center vx-row _translate">
      <div>
        <vs-chip
          color="#fff"
          class="cursor-pointer vs-chip-link hover:text-primary"
          @click.native="createAssociation()"
        >
          <vs-icon
            icon-pack="streameline"
            icon="icon-multiple-circle"
            style="font-size: 18px"
            class="mr-1"
            size="small"
            color="#3EB2FB"
          />
          {{ $t("create") }}
        </vs-chip>
      </div>
      <div>
        <vs-chip
          color="#fff"
          class="cursor-pointer vs-chip-link hover:text-primary"
          @click.native="joinAssociation()"
        >
          <vs-icon
            icon-pack="streameline"
            icon="icon-multiple-actions-add"
            style="font-size: 18px"
            class="mr-1"
            size="small"
            color="#3EB2FB"
          >
          </vs-icon>
          {{ $t("join") }}
        </vs-chip>
      </div>
    </div>
  </div>
</template>

<script>
//Fonctions
import functions from "../services/functions.js";

import { randomBackground } from "../services/helpers.js";

require("@syncfusion/ej2-base/styles/material.css");
require("@syncfusion/ej2-layouts/styles/material.css");

import "swiper/dist/css/swiper.min.css";

import { swiper, swiperSlide } from "vue-awesome-swiper";

//import moduleAssociation from "@/store/association/moduleAssociation.js"

import * as moment from "moment";
import localisation from "moment/locale/fr";

import { mapGetters } from "vuex";

moment.updateLocale("en", localisation);

export default {
  data() {
    return {
      card_4: {},
      swiperOption: {
        loop: true,
        // Disallow touch & scroll feature - Added @4.2.0
        allowTouchMove: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  components: {
    swiper,
    swiperSlide,
  },
  props: ["associations"],
  computed: {
    swiper() {
      return this.$refs.swiper.swiper;
    },

    ...mapGetters({
      user: "authentificated/getAuth",
    }),

    associationsData() {
      return this.associationsList();
    },
  },
  created() {
    this.$store.commit("authentificated/SET_RESET_ROLES");
    this.$store.commit("association/FETCH_USER_ASSOCIATION_ROLES", null);
    this.$acl.change("editor");
  },
  methods: {
    associationsList() {
      let data = this.associations;

      if (data.length) {
        let $inc = 0;
        data.forEach((element) => {
          if (element.ags && element.ags.length) {
            element.ag_courante = this.prochaineAg(element.ags);
            element.color = randomBackground($inc);
          } else {
            element.ag_courante = null;
            element.color = randomBackground($inc);
          }

          $inc++;
        });
      }
      return data;
    },
    //Afficher la date au format Long Date en fonction de la langue, par exemple (23 mars 2020 à 17h)
    getTime(date_time, hour) {
      let date_ag = moment.unix(date_time).format("L");

      let current_date = new Date(date_ag + " " + hour);

      let timestamp_date = current_date.getTime() / 1000;

      return timestamp_date;
    },

    //Prochaine ag
    prochaineAg(ags) {
      return functions.prochaineAg(ags);
    },
    sliderClicked: function (event) {
      if (
        !event.target.classList.contains("swiper-pagination-bullet") &&
        !event.target.classList.contains("swiper-button-next") &&
        !event.target.classList.contains("swiper-button-prev")
      ) {
        let item = this.$refs.swiper.swiper.realIndex;
        this.associationRedirect(this.associations[item]);
      }
    },
    associationRedirect(passociation) {
      localStorage.setItem("association_id", passociation.id);
      var user = this.user;

      let payloadUserRoles = {
        resourceUrl:
          "/api/association/" + passociation.id + "/user/" + user.id + "/roles",
        commitAction: "FETCH_USER_ASSOCIATION_ROLES",
      };

      this.$store
        .dispatch("association/fetchUserRoles", payloadUserRoles)
        .then((res) => {
          let roles = res.data.data ? res.data.data : [];
          this.$store.commit("authentificated/SET_USER_ROLES", roles);

          //this.$store.commit("association/FETCH_USER_ASSOCIATION_ROLES", Array.from(roles))

          if (passociation.etat || roles.includes("Administrateur")) {
            this.$store.commit(
              "association/SET_CURRENT_ASSOCIATION",
              passociation
            );
            if (passociation.ags && passociation.ags.length) {
              const current_ag = passociation.ags.find(
                (e) => e.etat == "current"
              );
              const ags = passociation.ags;
              this.$store.commit("association/SET_CURRENT_AG", current_ag);
              this.$store.commit("association/SET_AGS", ags);
            }

            if (!passociation.etat && roles.includes("Administrateur")) {
              if (passociation.souscription)
                this.$router.push({
                  name: "association:administration",
                });
              else
                this.$router.push({
                  name: "association:administration:bills",
                });
            } else {
              this.$router.push({
                name: "association:home",
              });
            }
          } else {
            this.$vs.notify({
              position: "top-center",
              text: this.$t("thisAssociationIsNotActive"),
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "warning",
            });
          }
        })
        .catch((err) => {
          window.console.error(err);
        });
    },
    createAssociation() {
      this.$router.push({
        name: "association:create",
      });
    },
    joinAssociation() {
      this.$router.push({
        name: "association:join",
      });
    },
  },
};
</script>

<style scoped>
.inactiveAssociation {
  opacity: 0.6 !important;
}
</style>
