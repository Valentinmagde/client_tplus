<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-content mt-6 mb-6">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col sm:w-full md:w-full lg:w-full d-theme-dark-bg">
              <div class="px-8 pt-8 login-tabs-container">
                <div class="vx-card__title mb-4">
                  <div class="flex justify-center flex-wrap">
                    <img
                      src="@/assets/images/logo/logo.png"
                      alt="login"
                      class="mx-auto"
                    />
                  </div>
                  <br />
                  <h4 class="flex justify-center flex-wrap mb-4">
                    {{ $t("createOfAnAssociation") }}
                  </h4>
                </div>
                <div class="clearfix">
                  <div class="vx-row">
                    <!-- Nom -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <vs-input
                        v-validate="'required'"
                        data-vv-validate-on="blur"
                        :label="$t('associationName') + ' *'"
                        name="nom"
                        v-model="nom"
                        class="w-full mt-5"
                      />
                      <span class="text-danger text-sm">{{
                        errors.first("nom")
                      }}</span>
                    </div>
                    <!-- Description -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <vs-input
                        v-validate="'required'"
                        data-vv-validate-on="blur"
                        :label="$t('description') + ' *'"
                        name="description"
                        v-model="description"
                        class="w-full mt-5"
                      />
                      <span class="text-danger text-sm">{{
                        errors.first("description")
                      }}</span>
                    </div>
                  </div>
                  <div class="vx-row">
                    <!-- Pays -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <p class="vs-input--label mt-6">
                        {{ $t("headOfficeCountry") + " *" }}
                      </p>
                      <country-select
                        :usei18n="false"
                        v-model="pays"
                        :country="pays"
                        topCountry="US"
                        placeholder=""
                        class="w-full selectCountry"
                      />
                    </div>
                    <!-- Ville -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <vs-input
                        v-validate="'required'"
                        data-vv-validate-on="blur"
                        :label="$t('headOfficeCity') + ' *'"
                        name="ville"
                        v-model="ville"
                        class="w-full mt-5"
                      />
                      <span class="text-danger text-sm">{{
                        errors.first("ville")
                      }}</span>
                    </div>
                  </div>
                  <div class="vx-row">
                    <!-- Monnaie -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <p class="vs-input--label mt-5">
                        {{ $t("currencyUsed") + " *" }}
                      </p>
                      <v-select
                        label="text"
                        :options="currency"
                        :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        class="select-large w-full"
                        v-model="devise"
                      />
                    </div>
                    <!-- Visibilité financière -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <p class="vs-input--label mt-5">
                        {{ $t("financialVisibility") + " *" }}
                      </p>
                      <v-select
                        v-validate="'required'"
                        label="text"
                        :options="selectOptions"
                        name="visibilite-financiere"
                        v-model="visibilite"
                        class="select-largew-full"
                      />
                    </div>
                  </div>
                  <div class="vx-row mt-5">
                    <!-- Fuseau horaire -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <p class="vs-input--label">{{ $t("timeZone") + " *" }}</p>
                      <v-select
                        label="text"
                        :options="timeZone"
                        :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        class="select-large select-timezone"
                        v-model="fuseau"
                      />
                    </div>
                    <!-- Languae -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <p class="vs-input--label">{{ $t("language") + " *" }}</p>
                      <v-select
                        label="text"
                        :options="selectLanguageOptions"
                        :dir="$vs.rtl ? 'rtl' : 'ltr'"
                        class="w-full"
                        v-model="langue"
                      />
                    </div>
                  </div>
                  <div class="vx-row">
                    <!-- Téléphone -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <p class="vs-input--label mt-5">
                        {{ $t("phone") + " *" }}
                      </p>
                      <vue-tel-input
                        v-validate="'required'"
                        name="telephone"
                        placeholder=""
                        @input="onInput"
                        validCharactersOnly
                        class="select-large w-full telephone"
                      >
                      </vue-tel-input>
                    </div>
                    <!-- Date de creation -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <p class="vs-input--label mt-5">
                        {{ $t("createdDate") + " *" }}
                      </p>
                      <flat-pickr
                        :config="MyConfig"
                        class="select-large w-full"
                        v-model="date"
                      >
                      </flat-pickr>
                    </div>
                  </div>
                  <div class="vx-row mt-5">
                    <!-- Email -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <vs-input
                        v-validate="'required|email'"
                        data-vv-validate-on="blur"
                        name="email"
                        type="email"
                        :label="$t('email') + ' *'"
                        v-model="email"
                        class="w-full"
                      />
                      <span class="text-danger text-sm">{{
                        errors.first("email")
                      }}</span>
                    </div>
                    <!-- Slogan -->
                    <div class="vx-col sm:w-1/2 w-full">
                      <vs-input
                        :label="$t('slogan')"
                        name="slogan"
                        v-model="slogan"
                        class="w-full"
                      />
                    </div>
                  </div>
                  <!-- Presentation -->
                  <p class="vs-input--label mt-5">{{ $t("presentation") }}</p>
                  <vs-textarea
                    name="presentation"
                    v-model="presentation"
                    class="mb-5 w-full"
                  />


                  <div class="vx-row mt-5">
                    <!-- Logo -->
                    <a-upload
                      name="avatar"
                      listType="picture-card"
                      class="avatar-uploader w-full"
                      :showUploadList="false"
                      :action="$store.getters['authentificated/uploadUrl']"
                      :beforeUpload="beforeUpload"
                      @change="handleChange"
                    >
                      <img
                        class="ant-upload object-contain h-24 w-full"
                        v-if="imageUrl"
                        :src="imageUrl"
                        alt="avatar"
                      />
                      <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                          {{ $t("selectYourLogo") }}
                        </div>
                      </div>
                    </a-upload>
                  </div>

                  <div class="vx-row">
                    <div class="vx-col sm:w-1/2 w-full">
                      <vs-button
                        class="w-full mt-4"
                        type="border"
                        @click.native="home()"
                        >{{ $t("back") }}</vs-button
                      >
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                      <vs-button
                        class="w-full mt-4"
                        id="button-with-loading"
                        @click="createAssociation()"
                        :disabled="!validateForm"
                        >{{ $t("create") }}</vs-button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div class="flex justify-center flex-wrap _translate">
                <span
                  class="cursor-pointer link-color"
                  v-show="locale == 'fr'"
                  @click="updateLocale('en')"
                  >English</span
                >
                <span
                  class="cursor-pointer link-color"
                  v-show="locale == 'en'"
                  @click="updateLocale('fr')"
                  >Français</span
                >
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>


<script>
import Vue from "vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { vsSelect } from "vuesax";
import VueTelInput from "vue-tel-input";
import vSelect from "vue-select";

import Antd from "ant-design-vue";
import "@/assets/css/ant-upload.css";
import vueCountryRegionSelect from "vue-country-region-select";

// Functions
import { currency } from "../services/data/currency.js";
import { timezone } from "../services/data/timezone.js";
import { visibility } from "../services/data/visibility.js";
import { language } from "../services/data/language.js";

// store
// import moduleAssociation from "@/store/association/moduleAssociation.js"
// import moduleRole from "@/store/role/moduleRole.js"
// import moduleUser from "@/store/user/moduleUser.js"
import { mapGetters } from "vuex";

Vue.use(Antd);
Vue.use(vueCountryRegionSelect);
Vue.use(VueTelInput);
Vue.use(vsSelect);

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      nom: "",
      description: "",
      pays: "",
      ville: "",
      devise: "",
      visibilite: "",
      fuseau: "",
      email: "",
      date: "",
      langue: "",
      slogan: "",
      logo: "",
      presentation: "",
      popupManagerPicker: false,
      managerCode: "",
      manager: null,
      locale: this.$i18n.locale,
      currency: currency,
      timeZone: timezone,
      telephone: {
        number: "",
        valid: false,
        country: undefined,
      },
      backgroundLoading: "primary",
      colorLoading: "#fff",
      loading: false,
      disabled: true,
      imageUrl: "",

      MyConfig: {
        altFormat: "F j, Y",
        dateFormat: "d M Y",
      },
    };
  },
  components: {
    flatPickr,
    "v-select": vSelect,
  },
  computed: {
    ...mapGetters({
      user: "authentificated/getAuth",
    }),
    selectOptions() {
      return visibility.map((visible) => ({
        text: this.$t(visible.i18n),
        value: visible.value,
      }));
    },

    selectLanguageOptions() {
      return language.map((lang) => ({
        text: this.$t(lang.i18n),
        value: lang.value,
      }));
    },

    i18n_locale_img() {
      return require(`@/assets/images/flags/${this.$i18n.locale}.png`);
    },
    getCurrentLocaleData() {
      const locale = this.$i18n.locale;
      if (locale == "en") return { flag: "us", lang: "English" };
      else if (locale == "pt") return { flag: "br", lang: "Portuguese" };
      else if (locale == "fr") return { flag: "fr", lang: "French" };
      else if (locale == "de") return { flag: "de", lang: "German" };
    },
    validateForm() {
      return (
        !this.errors.any() &&
        this.nom != "" &&
        this.description != "" &&
        this.pays != "" &&
        this.telephone.valid &&
        this.email != "" &&
        this.ville != "" &&
        this.devise != "" &&
        this.visibilite != "" &&
        this.fuseau != "" &&
        this.date != "" &&
        this.langue != "" &&
        this.disabled
      );
    },
  },
  created() {
    /*if(! moduleAssociation.isRegistered) {
        this.$store.registerModule('association',  moduleAssociation)
        moduleAssociation.isRegistered = true
      }

      if(! moduleUser.isRegistered) {
        this.$store.registerModule('user',  moduleUser)
        moduleUser.isRegistered = true
      }

      if(!moduleRole.isRegistered) {
        this.$store.registerModule('roles', moduleRole)
        moduleRole.isRegistered = true
      }*/
  },
  methods: {
    createAssociation() {
      if (!this.telephone.valid) {
        this.$vs.notify({
          position: "top-center",
          text: this.$t("invalidPhoneNumber"),
          color: "danger",
          icon: "close",
        });
        return;
      }
      let fuseau_horaire =
        this.fuseau.value >= 0 ? "+" + this.fuseau.value : this.fuseau.value;
      //Conversion de la date en Date UTC
      var current_date = new Date();
      var hours = current_date.getHours();
      var minutes = "0" + current_date.getMinutes();
      var seconds = "0" + current_date.getSeconds();
      var formattedTime =
        hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

      var d = new Date(
        this.date + " " + formattedTime + " GMT" + fuseau_horaire
      );
      var dateUtc;
      //convert the offset to seconds, add to targetTime, and make a new Date
      dateUtc = d.getTime() / 1000;

      let formData = new FormData();
      formData.append("file", this.logo);
      formData.append("nom", this.nom);
      formData.append("telephone", this.telephone.number);
      formData.append("description", this.description);
      formData.append("devise", this.devise.value);
      formData.append("visibilite_financiere", this.visibilite.value);
      formData.append("fuseau_horaire", fuseau_horaire);
      formData.append("email", this.email);
      formData.append("langue", this.langue.value);
      formData.append("slogan", this.slogan);
      formData.append("presentation", this.presentation);
      formData.append("pays", this.pays);
      formData.append("ville", this.ville);
      formData.append("date_creation", dateUtc);
      formData.append("admin_id", this.user.id);

      let payload = {
        resourceUrl: "/api/association",
        commitAction: "FETCH_USER_ASSOCIATION",
        data: formData,
      };
      //laoding
      this.openLoadingContained();

      this.$store
        .dispatch("association/postRequest", payload)
        .then((res) => {
          //localStorage.setItem('association_id', res.data.data.id)
          var association = res.data.data;
          //localStorage.setItem('association_create', JSON.stringify(assoc))
          this.createAccount(association);
        })
        .catch((error) => {
          this.disabled = true;
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
    createAccount(association_create) {
      var that = this;
      var user = this.user;
      var today = new Date();
      var rand = Math.floor(Math.random() * 1000);
      var username;
      var dateUtc;

      dateUtc = today.getTime() / 1000;

      if (user.firstName != "") username = user.firstName;
      else if (user.lastName != "") username = user.lastName;
      else username = "member" + rand;

      let payload = {
        resourceUrl: "/api/association/" + association_create.id + "/membre",
        commitAction: "FETCH_USER_ASSOCIATION",
        data: {
          firstName: username,
          date_created: dateUtc,
          created_by: user.id,
        },
      };
      this.$store
        .dispatch("association/postRequest", payload)
        .then((res) => {
          if (res.data.status === "OK") {
            // recupere le membre cree
            var membre = res.data.data;
            var payload2 = {
              resourceUrl:
                "/api/association/" +
                association_create.id +
                "/membre/" +
                membre.id +
                "/connect",
              commitAction: "SET_MEMBER_HAS",
              data: {
                user_id: user.id,
                admin_id: association_create.admin_id,
              },
            };
            that.$store
              .dispatch("association/postRequest", payload2)
              .then((connect_resp) => {
                if (connect_resp.data.status === "OK") {
                  //Assigner le role Administrateur à l'utilisateur
                  var payload2 = {
                    resourceUrl:
                      "/api/association/" +
                      association_create.id +
                      "/membre/" +
                      membre.id +
                      "/user/" +
                      user.id +
                      "/assignrole",
                    commitAction: "SET_USER_ROLES",
                    data: {
                      role_id: [1],
                    },
                  };
                  this.$store
                    .dispatch("authentificated/postRequest", payload2)
                    .then(() => {
                      this.nom = "";
                      this.description = "";
                      this.pays = "";
                      this.ville = "";
                      this.devise = "";
                      this.visibilite = "";
                      this.fuseau = "";
                      this.email = "";
                      this.date = "";
                      this.slogan = "";
                      this.logo = "";
                      this.presentation = "";
                      (this.telephone.number = ""), (this.disabled = true);
                      this.$vs.loading.close(
                        "#button-with-loading > .con-vs-loading"
                      );

                      this.$vs.notify({
                        position: "top-center",
                        text: this.$t("associationSuccessfullyCreated"),
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                        color: "success",
                      });

                      this.$router.push("/associations");
                    })
                    .catch((err) => {
                      this.disabled = true;
                      this.$vs.loading.close(
                        "#button-with-loading > .con-vs-loading"
                      );
                      window.console.error(err);
                    });
                } else {
                  // affiche le message d'erreur renvoyer par le serveur.
                  // il est possible que l'association soit tout de meme deja cree donc il faudra soit
                  // effacer l'association soit reprendre la connection
                }
              })
              .catch((error) => {
                this.disabled = true;
                this.$vs.loading.close(
                  "#button-with-loading > .con-vs-loading"
                );
                this.$vs.notify({
                  position: "top-center",
                  text: error,
                  iconPack: "feather",
                  icon: "icon-alert-circle",
                  color: "danger",
                });
              });
          }
        })
        .catch((error) => {
          this.disabled = true;
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
    successUpload() {
      this.$vs.notify({
        color: "success",
        title: "Upload Success",
        text: "Lorem ipsum dolor sit amet, consectetur",
      });
    },
    onInput(formattedNumber, { number, valid, country }) {
      this.telephone.number = number.e164;
      this.telephone.valid = valid;
      this.telephone.country = country && country.name;
    },
    home() {
      this.$router.push("/associations");
    },
    thumbUrl(file) {
      return file.myThumbUrlProperty;
    },
    onFileChange(file) {
      // Handle files like:
      this.fileUploaded = file;
    },
    updateLocale(locale) {
      this.$i18n.locale = locale;
      this.locale = this.$i18n.locale;
    },
    openLoadingContained() {
      if (this.telephone.valid) {
        this.disabled = false;
        this.$vs.loading({
          background: this.backgroundLoading,
          color: this.colorLoading,
          container: "#button-with-loading",
          scale: 0.45,
        });
      }
    },
    // myUploadHandler(onSuccess, onError, onProgress)
    // {
    //   const fileRef = rootRef.child(path + '/' + fileName)
    //   fileRef.put(file)
    //       .then(() => onSuccess())
    //   .catch(err => {
    //       onError()
    //       })
    // },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
          this.logo = info.file.originFileObj;
          window.console.log(this.logo);
        });
      }
    },
    beforeUpload(file) {
      let isValid = false;
      const extensions = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
      for (var i = 0; i < extensions.length; i++) {
        if (extensions[i] === file.type) isValid = true;
      }
      if (!isValid) {
        this.$vs.notify({
          position: "top-center",
          text: this.$t("uploadImageRestrictionExtension"),
          color: "warning",
          icon: "close",
        });
      }
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$vs.notify({
          position: "top-center",
          text: this.$t("uploadImageRestrictionSize"),
          color: "danger",
          icon: "close",
        });
      }
      return isValid && isLt2M;
    },
  },
};
</script>
