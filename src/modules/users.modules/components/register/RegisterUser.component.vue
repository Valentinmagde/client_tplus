<template>
  <div class="clearfix">
    <vs-input
      v-validate="'required|min:3'"
      data-vv-validate-on="blur"
      :label-placeholder="$t('lastName') + ' ' + '*'"
      name="nom"
      v-model="nom"
      class="w-full"
    />
    <span class="text-sm text-danger">{{ errors.first("nom") }}</span>

    <vs-input
      v-validate="'required|min:3'"
      data-vv-validate-on="blur"
      :label-placeholder="$t('firstName') + ' ' + '*'"
      name="prenom"
      v-model="prenom"
      class="w-full mt-6"
    />

    <vue-tel-input
      :required="true"
      validate
      name="telephone"
      :placeholder="$t('phone') + ' ' + '*'"
      @input="onInput"
      validCharactersOnly
      class="w-full mt-6 select-large telephone v-validate"
    />

    <vs-input
      ref="password"
      type="password"
      data-vv-validate-on="blur"
      v-validate="'required|min:6|max:15'"
      name="password"
      :label-placeholder="$t('password') + ' ' + '*'"
      v-model="password"
      class="w-full mt-6"
    />
    <span class="text-sm text-danger">{{ errors.first("password") }}</span>

    <vs-input
      type="password"
      v-validate="'min:6|max:15|confirmed:password'"
      data-vv-validate-on="blur"
      data-vv-as="password"
      name="confirmPassword"
      :label-placeholder="$t('confirmPassword') + ' ' + '*'"
      v-model="confirmPassword"
      class="w-full mt-6"
    />
    <span class="text-sm text-danger">{{
      errors.first("confirmPassword")
    }}</span>

    <vs-checkbox v-model="termsCondition" class="w-full mt-6">{{
      $t("termsConditionAccepted")
    }}</vs-checkbox>
    <vs-button
      class="w-full mt-6"
      id="button-with-loading"
      @click="register()"
      :disabled="!validateForm"
    >
      {{ $t("register") }}
    </vs-button>

    <div class="justify-center w-full mt-6 vx-row">
      <span class="text-black">{{ $t("haveAccount") + " ?" }}</span>
      <router-link class="link-color" :to="{ name: 'user:login' }">{{
        $t("connect")
      }}</router-link>
    </div>
  </div>
</template>

<script>
import { HTTP } from "@/services/http";
import Vue from "vue";
import VueTelInput from "vue-tel-input";

// Firebase to log out any authenticated user at this point
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueTelInput);
export default {
  data() {
    return {
      prenom: "",
      nom: "",
      code: "",
      telephone: {
        number: "",
        valid: false,
        country: undefined,
        label: "*",
      },
      password: "",
      confirmPassword: "",
      pays: "",
      ville: "",
      sexe: "",
      anniversaire: "",
      termsCondition: false,
      backgroundLoading: "primary",
      colorLoading: "#fff",
      loading: true,
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.prenom != "" &&
        this.nom != "" &&
        this.password != "" &&
        this.confirmPassword != "" &&
        this.termsCondition === true &&
        this.loading
      );
    },
  },
  methods: {
    onInput(formattedNumber, { number, valid, country }) {
      this.telephone.number = number.e164;
      this.telephone.valid = valid;
      this.telephone.country = country && country.name;
    },

    autoCompleteFunc(event) {
      window.console.log(event);
    },
    openLoadingContained() {
      if (this.telephone.valid) {
        this.loading = false;
        this.$vs.loading({
          background: this.backgroundLoading,
          color: this.colorLoading,
          container: "#button-with-loading",
          scale: 0.45,
        });
      }
    },

    checkLogin() {
      // If user is already logged in notify
      if (this.$store.state.authentificated.isUserLoggedIn()) {
        // Close animation if passed as payload
        // this.$vs.loading.close()

        this.$vs.notify({
          title: "Login Attempt",
          text: this.$t("youAreAlreadyLoggedIn"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "warning",
        });

        return false;
      }
      return true;
    },
    register() {
      if (!this.validateForm || !this.checkLogin()) return;
      if (!this.telephone.valid) {
        this.$vs.notify({
          position: "top-center",
          text: this.$t("invalidPhoneNumber"),
          color: "danger",
          icon: "close",
        });
        return;
      }
      this.openLoadingContained();
      HTTP.post("/api/user/register", {
        firstName: this.prenom,
        lastName: this.nom,
        phone: this.telephone.number,
        password: this.password,
        c_password: this.confirmPassword,
      })
        .then((response) => {
          this.nom = "";
          this.prenom = "";
          this.password = "";
          this.confirmPassword = "";

          // this.loading = true
          // this.$vs.loading.close("#button-with-loading > .con-vs-loading")
          this.$store.commit("association/SET_USER", response.data.data);
          this.$store.commit("association/SET_PHONE", this.telephone.number);
          return true;
          //localStorage.setItem('user', JSON.stringify(response.data.data))
        })
        .then(() => {
          this.$router.push({ name: "user:verify-code" }).catch((erreur) => {
            return erreur;
          });
        })
        .catch((error) => {
          this.loading = true;
          this.$vs.loading.close("#button-with-loading > .con-vs-loading");
          this.$vs.notify({
            position: "top-center",
            text: error.response.data.data.errMsg,
            color: "danger",
            icon: "close",
          });
        });
    },
  },

  created() {
    // Firebase logout
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Clear caches
        localStorage.clear();
        sessionStorage.clear();

        // Set store to default store
        this.$store.commit("authentificated/LOG_OUT");
      })
      .catch((error) => window.console.error(error));
  },
};
</script>

