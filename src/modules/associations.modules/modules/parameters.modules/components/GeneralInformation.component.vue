<template>
  <div class="clearfix mr-auto max-w-3xl">
    <!--HEAD -->
    <vx-card no-shadow class="mt-4 mb-5">
      <h4 class="mb-2">
        {{ $t("generalInformationOnYourAssociation") | CAPITALIZE }}
      </h4>
    </vx-card>
    <vx-card no-shadow>
      <!-- Nom de l'association -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("associationName") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input
            name="nom"
            v-validate="'required'"
            data-vv-validate-on="blur"
            v-model="nom"
            class="w-full mt-4"
          />
        </div>
      </div>
      <!-- Description de l'association -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("description") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input
            name="description"
            v-validate="'required'"
            data-vv-validate-on="blur"
            v-model="description"
            class="w-full mt-4"
          />
        </div>
      </div>
      <!-- Siège social - Pays -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("headOfficeCountry") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <country-select
            :usei18n="false"
            v-model="pays"
            :country="pays"
            topCountry="US"
            class="mt-5 w-full selectCountry"
          />
        </div>
      </div>
      <!-- Siège social - Ville -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("headOfficeCity") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input
            name="ville"
            v-validate="'required'"
            data-vv-validate-on="blur"
            v-model="ville"
            class="w-full mt-5"
          />
        </div>
      </div>
      <!-- Siège social - Ville -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("currencyUsed") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <v-select
            label="text"
            :placeholder="$t('currencyUsed')"
            :options="currency"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            class="select-large mt-5 w-full"
            v-model="devise"
          />
        </div>
      </div>
      <!-- Visibilité financière -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">
            {{ $t("financialVisibility") }}*:
          </p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <v-select
            v-validate="'required'"
            label="text"
            name="visibilite-financiere"
            :options="visibilityOptions"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            v-model="visibilite"
            class="select-large mt-4 w-full"
          />
        </div>
      </div>
      <!-- Validation des bons de sortie -->
      <!-- <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">
            {{ $t("exitVouchersValidation") }}*:
          </p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <v-select
            v-validate="'required'"
            label="text"
            name="validation-bon-sortie"
            :options="vouchersOptions"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            v-model="vouchersValidation"
            class="select-large mt-4 w-full"
          />
        </div>
      </div> -->
      <!-- Fuseau horaire -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("timeZone") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <v-select
            label="text"
            :placeholder="$t('timeZone')"
            :options="timeZone"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            class="select-large mt-4 w-full select-timezone"
            v-model="fuseau"
          />
        </div>
      </div>

      <!-- E-mail -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("email") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input
            v-validate="'required|email'"
            data-vv-validate-on="blur"
            name="email"
            type="email"
            v-model="email"
            class="w-full mt-4"
          />
        </div>
      </div>
      <!-- Téléphone -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("phone") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vue-tel-input
            validate
            name="telephone"
            :placeholder="$t('phone')"
            @input="onInput"
            validCharactersOnly
            disabledFetchingCountry
            v-model="telephone.number"
            class="select-large mt-4 w-full telephone"
          >
          </vue-tel-input>
        </div>
      </div>

      <!-- Date de création -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("createdDate") }}*:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <flat-pickr class="select-large mt-4 w-full" v-model="date">
          </flat-pickr>
        </div>
      </div>

      <!-- Langue -->
      <div class="vx-row mt-4">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("language") }}:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <v-select
            label="text"
            :options="selectLanguageOptions"
            :dir="$vs.rtl ? 'rtl' : 'ltr'"
            class="w-full"
            v-model="langue"
          />
        </div>
      </div>

      <!-- Slogan -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("slogan") }}:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input name="slogan" v-model="slogan" class="w-full mt-4" />
        </div>
      </div>

      <!-- Présentation -->
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("presentation") }}:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-textarea
            name="presentation"
            v-model="presentation"
            class="w-full mt-4"
          />
        </div>
      </div>

      <!-- <div v-if="managers.length" class="vx-row flex">
        <div class="vx-col sm:w-1/3">
          <p class="vx-row mt-4 justify-end">Manager(s):</p>
        </div>
        <div class="vx-col sm:w-1/2 content-end flex flex-wrap">
          <span
            class="text-primary cursor-pointer mr-2"
            v-for="(manager, index) in managers"
            :key="index"
          >
            {{ `${manager.firstName} ${manager.lastName}` }}
          </span>
        </div>
      </div> -->

      <!-- Téléverser votre logo -->
      <div class="vx-row mt-4">
        <div class="vx-col sm:w-1/3 w-full">
          <p class="vx-row mt-4 justify-end">{{ $t("selectYourLogo") }}:</p>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <a-upload
            name="avatar"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="$store.getters['authentificated/uploadUrl']"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <img
              class="ant-upload object-contain h-24"
              v-if="imageUrl"
              :src="imageUrl"
              alt="avatar"
            />

            <img
              class="ant-upload object-contain h-24"
              v-else
              src="@/assets/images/pages/media.png"
              alt="avatar"
            />
            <!-- <div v-else>
                        <a-icon :type="loading ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">{{$t('selectYourLogo')}}</div>
                    </div> -->
          </a-upload>

          <div>
            <vs-button class="mt-4 mr-4" type="border" @click.native="cancel">
              {{ $t("cancel") }}
            </vs-button>
            <vs-button
              class="mt-4"
              id="button-with-loading"
              @click="updateAssociation"
              :disabled="disableSaveButton || !validateForm"
            >
              {{ $t("save") }}
            </vs-button>
          </div>
        </div>
      </div>
    </vx-card>
  </div>
</template>

<script>
import { visibility } from "../../../services/data/visibility";
// import { vouchersOptions } from "../services/data/vouchersOptions";
import { language } from "../../../services/data/language";

import { currency } from "../../../services/data/currency";
import { timezone } from "../../../services/data/timezone";
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
// import { EventBus } from "@/services/EventBus.js";

// store
// import moduleAssociation from "@/store/association/moduleAssociation.js"

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
      // vouchersValidation: "", // Méthode de validation des bons de sortie
      fuseau: "",
      email: "",
      date: "",
      slogan: "",
      langue: "",
      logo: "",
      presentation: "",
      locale: this.$i18n.locale,
      currency: currency,
      timeZone: timezone,

      // managers: [],

      telephone: {
        number: "",
        valid: false,
        country: undefined,
        label: "",
        defaultCountry: "",
      },

      backgroundLoading: "primary",
      colorLoading: "#fff",
      loading: false,
      imageUrl: "",
      loader: true,
    };
  },
  components: {
    flatPickr,
    "v-select": vSelect,
  },
  computed: {
    currentAssociation() {
      return this.$store.state.association.currentAssociation;
    },
    visibilityOptions() {
      return visibility.map((visible) => ({
        text: this.$t(visible.i18n),
        value: visible.value,
      }));
    },
    // vouchersOptions() {
    //   return vouchersOptions.map((option) => ({
    //     text: this.$t(option.i18n),
    //     value: option.value,
    //   }));
    // },

    selectLanguageOptions() {
      return language.map((lang) => ({
        text: this.$t(lang.i18n),
        value: lang.value,
      }));
    },

    validateForm() {
      return (
        !this.errors.any() &&
        this.nom != "" &&
        this.description != "" &&
        this.telephone.valid &&
        this.email != "" &&
        this.pays != "" &&
        this.ville != "" &&
        this.devise != "" &&
        this.visibilite != "" &&
        this.fuseau != "" &&
        this.date != "" &&
        this.langue != ""
      );
    },

    dateIsTheSame() {
      let newCreationDate = new Date(this.date);
      return (
        this.$options.filters.dateTime(this.currentAssociation.date_creation) ==
        this.$options.filters.dateTime(newCreationDate.getTime() / 1000)
      );
    },

    disableSaveButton() {
      return (
        this.nom == this.currentAssociation.nom &&
        this.description == this.currentAssociation.description &&
        this.pays == this.currentAssociation.pays &&
        this.email == this.currentAssociation.email &&
        this.ville == this.currentAssociation.ville &&
        this.telephone.number == this.currentAssociation.telephone &&
        this.devise.value == this.currentAssociation.devise &&
        this.visibilite.value == this.currentAssociation.visibilite_financiere &&
        // this.vouchersValidation.value == this.currentAssociation.validation_automatique &&
        this.langue.value == this.currentAssociation.langue &&
        this.slogan ==
          (this.currentAssociation.slogan == "null" ||
          this.currentAssociation.slogan == null
            ? ""
            : this.currentAssociation.slogan) &&
        this.presentation ==
          (this.currentAssociation.presentation == "null" ||
          this.currentAssociation.presentation == null
            ? ""
            : this.currentAssociation.presentation) &&
        this.imageUrl == this.currentAssociation.logo &&
        this.dateIsTheSame
      );
    },
  },
  // created() {
  //   EventBus.$emit("loader", true);
  //   this.$store
  //     .dispatch("association/getAssociationManagers", {
  //       association_id: this.currentAssociation.id,
  //     })
  //     .then((response) => {
  //       this.managers = response.data.data;
  //       EventBus.$emit('loader', false)
  //     })
  //     .catch((error) => {
  //       EventBus.$emit('loader', false)
  //       this.$vs.notify({
  //         position: "top-center",
  //         text: error.data.errMsg,
  //         iconPack: "feather",
  //         icon: "icon-alert-circle",
  //         color: "danger",
  //       });
  //     });
  // },
  methods: {
    //Initialisation des variables
    cancel() {
      let association_courante = this.currentAssociation;

      this.nom = association_courante.nom;
      this.description = association_courante.description;
      this.pays = association_courante.pays;
      (this.ville = association_courante.ville),
        (this.telephone = {
          number: association_courante.telephone,
          valid: true,
          country: undefined,
          label: association_courante.telephone,
        }),
        (this.devise = {
          text: association_courante.devise,
          value: association_courante.devise,
        }),
        (this.visibilite = {
          text: visibility.reduce(
            (a, o) =>
              o.value == association_courante.visibilite_financiere
                ? a.concat(o.text)
                : a,
            ""
          ),
          value: association_courante.visibilite_financiere,
        });

      this.langue = {
        text: language.reduce(
          (a, o) =>
            o.value == association_courante.langue ? a.concat(o.text) : a,
          ""
        ),
        value: association_courante.langue,
      };

      // this.vouchersValidation = this.vouchersOptions.find(
      //   (option) => option.value == association_courante.validation_automatique
      // )

      this.fuseau = {
        text: timezone.reduce(
          (a, o) =>
            o.value == association_courante.fuseau_horaire
              ? a.concat(o.text)
              : a,
          ""
        ),
        value: association_courante.fuseau_horaire,
      };
      this.email = association_courante.email;
      this.date = association_courante.date_creation * 1000;
      (this.slogan =
        association_courante.slogan == "null" ||
        this.currentAssociation.slogan == null
          ? ""
          : association_courante.slogan),
        (this.imageUrl = association_courante.logo),
        (this.presentation =
          association_courante.presentation == "null" ||
          this.currentAssociation.presentation == null
            ? ""
            : association_courante.presentation);
      /* this.telephone.number = association_courante.phone */
    },
    updateAssociation() {
      var association_courante = this.currentAssociation;
      //Conversion de la date en Date UTC
      var d = new Date(this.date);
      var dateUtc;
      const fuseau_horaire =
        parseInt(this.fuseau.value) >= 0 &&
        this.fuseau.value != association_courante.fuseau_horaire
          ? `+${this.fuseau.value}`
          : `${this.fuseau.value}`;

      dateUtc = d.getTime() / 1000;

      let formData = new FormData();
      formData.append("id", association_courante.id);
      formData.append("file", this.logo);
      formData.append("nom", this.nom);
      formData.append("telephone", this.telephone.number);
      formData.append("description", this.description);
      formData.append("devise", this.devise.value);
      formData.append("visibilite_financiere", this.visibilite.value);
      // formData.append("validation_automatique", this.vouchersValidation.value);
      formData.append("fuseau_horaire", fuseau_horaire);
      formData.append("email", this.email);
      formData.append("langue", this.langue.value);
      formData.append("slogan", this.slogan);
      formData.append("presentation", this.presentation);
      formData.append("pays", this.pays);
      formData.append("ville", this.ville);
      formData.append("date_creation", dateUtc);
      formData.append("admin_id", this.$store.state.authentificated.user.id);

      let payload = {
        resourceUrl: "/api/association/updateParams",
        commitAction: "SET_CURRENT_ASSOCIATION",
        data: formData,
      };
      //laoding
      this.openLoadingContained();

      this.$store
        .dispatch("association/postRequest", payload)
        .then(() => {
          this.loader = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          this.$vs.notify({
            position: "top-center",

            text: this.$t("updateCompletedSuccessfully"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
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
    homme() {
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
        this.loader = false;
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
          color: "warning",
          icon: "close",
        });
      }
      return isValid && isLt2M;
    },
  },
  mounted() {
    this.cancel();
  },
};
</script>
<style>
.selectCountry {
  height: 38px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.7);
}
</style>
