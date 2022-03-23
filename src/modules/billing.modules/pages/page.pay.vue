<template>
  <div v-if="isReady">
    <div
      class="fixed top-0 z-20 w-full"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16 mt-5">
      <vs-popup :title="$t('sorry') | Capitalize" :active.sync="popupActive">
        <p>{{ $t("thisServiceIsUnavailableForCurrency") }}</p>
      </vs-popup>
      <div class="flex flex-col md:flex-row">
        <div class="w-full md:w-8/12">
          <vx-card :title="$t('paymentMethod')" noShadow cardBorder>
            <vs-list>
              <a
                class="paymentOption"
                v-for="(item, index) in paymentOptions"
                :key="index"
                @click="loadPaymentMethod(index)"
                :class="{ selected: choosenMethodIndex === index }"
              >
                <vs-list-item class="py-4">
                  <template slot="title"
                    ><span class="pl-3">{{ $t(item.text) }}</span></template
                  >
                  <template slot="avatar">
                    <img height="30" width="30" :src="item.avatar" />
                  </template>
                  <div
                    v-if="item.image !== ''"
                    v-bind:style="{
                      backgroundImage: 'url(' + item.image + ')',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      minWidth: '10rem',
                      minHeight: '2rem',
                    }"
                    :class="{ minWidth4: item.value === 'mobile' }"
                  ></div>
                </vs-list-item>
              </a>
            </vs-list>

            <template v-if="choosenMethodIndex !== -1">
              <vs-divider />
              <!-- Stripe -->
              <div v-if="choosenMethod.value === 'stripe'">
                <!-- Numéro de la carte -->
                <vs-input
                  autofocus
                  type="text"
                  :label="$t('cardholderName') + ' ' + '*'"
                  v-model="cardholderName"
                  class="w-full mt-5"
                />
                <vs-input
                  autofocus
                  type="text"
                  :label="$t('cardNumber') + ' ' + '*'"
                  v-model="cardNumber"
                  class="w-full mt-5"
                />
                <div class="flex items-center justify-between">
                  <div class="inline-block w-full mt-1 mr-4">
                    <!-- Date d'expiration-->
                    <p class="mt-5 vs-input--label">
                      {{ $t("expirationDate") + " *" }}
                    </p>
                    <vue-monthly-picker
                      v-model="expiryDate"
                      placeHolder="MM/YY"
                      dateFormat="MM/YY"
                      :monthLabels="monthLabels"
                      selectedBackgroundColor="#28C76F"
                    >
                    </vue-monthly-picker>
                  </div>
                  <div class="inline-block">
                    <!-- CVC-->
                    <vs-input
                      type="number"
                      :label="$t('CVC') + ' ' + '*'"
                      v-model="cvc"
                      class="w-full mt-5"
                    />
                  </div>
                </div>
              </div>

              <!-- Paypal -->
              <div v-else-if="choosenMethod.value === 'paypal'">
                <p v-if="paypalLink">
                  {{ $t("followThis") }}
                  <a :href="paypalLink">{{ $t("link") }}</a>
                  {{ $t("toReachPaypalServices") }}.
                  {{ $t("onceYouAreDoneProceed") }}.
                </p>
              </div>

              <!-- Mobile transfer -->
              <div v-else-if="choosenMethod.value === 'mobile'">
                <v-select
                  v-model="choosenMobileOperator"
                  placeholder="Mobile operator"
                  label="text"
                  :options="choosenMethod.subItems"
                  class="w-full mb-5 select-large"
                />
                <div v-if="choosenMobileOperator">
                  <!-- Numéro de reçu de transfert mobile -->
                  <!-- Payments instructions -->
                  <p class="mt-1">
                    <b><u>Instructions:</u></b> {{ $t('pleaseSendTheAmountOfYourBill') }} <b>{{ $t('fees') }}</b> {{ $t('toThisNumber') }}
                    <span class="text-primary font-semibold">{{ choosenMobileOperator.number }}</span>.
                  </p>
                  <p>
                    {{ $t('whenDoneSendUsThe') }} <span class="text-primary">{{ choosenMobileOperator.text }}</span> <b>transaction ID</b>.
                  </p>
                  <vs-input
                    autofocus
                    type="text"
                    :label="$t('Receipt No') + ' ' + '*'"
                    v-model="receiptNumber"
                    class="w-full mt-5"
                  />
                </div>
              </div>
            </template>
          </vx-card>

          <!-- Bill Summary -->
        </div>
        <div class="w-1/2 mt-5 md:mt-0 md:ml-10 md:w-4/12">
          <vx-card :title="$t('summary')" noShadow cardBorder>
            <div class="flex flex-row">
              <div class="w-2/3">
                <p class="text-left">{{ $t("subTotal") }}</p>
              </div>
              <div class="w-2/3">
                <p class="font-semibold text-right">
                  {{
                    (bill.nb_comptes * bill.periode * bill.prix_unitaire)
                      | formatMoney(currentAssociation.devise)
                  }}
                </p>
              </div>
            </div>
            <div class="flex flex-row mt-5">
              <div class="w-2/3">
                <p class="text-left">{{ $t("discount") }}</p>
              </div>
              <div class="w-2/3">
                <p class="font-semibold text-right">
                  {{ bill.reduction | formatMoney(currentAssociation.devise) }}
                </p>
              </div>
            </div>
            <div class="flex flex-row mt-5">
              <div class="invisible w-2/3 lg:visible">
                <p class="text-lg text-left">Total</p>
              </div>
              <div class="w-2/3">
                <p class="text-lg font-semibold text-right">
                  {{ bill.montant | formatMoney(currentAssociation.devise) }}
                </p>
              </div>
            </div>
            <vs-divider />
            <div>
              <vs-button
                class="w-full"
                color="primary"
                id="proceedButton"
                :disabled="!canProceed"
                @click="payment()"
              >
                {{ $t("proceed") | Capitalize }}
              </vs-button>
            </div>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/services/EventBus";
import { mapGetters } from "vuex";
import { paymentMethod } from "../services/data/paymentMethod";
import VueMonthlyPicker from "vue-monthly-picker";
import vSelect from "vue-select";

export default {
  data() {
    return {
      choosenMethodIndex: -1,
      choosenMethod: { value: -1 },

      // Stripe
      expiryDate: "",
      cardNumber: "",
      cardholderName: "",
      cvc: "",
      monthLabels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],

      // Paypal
      paypalLink: "",
      popupActive: false,

      // Mobile transfer
      choosenMobileOperator: "",
      receiptNumber: "",

      isReady: false,
    };
  },

  components: {
    VueMonthlyPicker,
    vSelect,
  },

  computed: {
    ...mapGetters({
      currentAssociation: "association/getCurrentAssociation",
      bill: "billing/getBill",
    }),

    paymentOptions() {
      return paymentMethod;
    },

    canProceed() {
      if (this.choosenMethodIndex < 0) return false;

      let method = this.paymentOptions[this.choosenMethodIndex].value;

      if (method === "paypal") return this.paypalLink !== "";

      if (method === "mobile")
        return this.choosenMobileOperator !== "" && this.receiptNumber !== "";

      return (
        this.expiryDate !== "" &&
        this.cardNumber !== "" &&
        this.cvc !== "" &&
        this.cardholderName !== ""
      );
    },
  },

  methods: {
    loadPaymentMethod(index) {
      EventBus.$emit("loader", true);
      setTimeout(() => {
        this.choosenMethodIndex = index;
        this.choosenMethod = this.paymentOptions[this.choosenMethodIndex];
        if (this.choosenMethod.value === "paypal") {
          this.paypalPayment();
        } else EventBus.$emit("loader", false);
        this.reset();
      }, 300);
    },

    paypalPayment() {
      let payload = {
        credentials: {
          assocId: this.currentAssociation.id,
          cycle_id: this.bill.cycles_id,
          facture_id: this.bill.id,
          mode: this.choosenMethod.value,
          data: {},
        },
        commitAction: "NO_COMMIT",
      };
      this.$store
        .dispatch("billing/buyInvoice", payload)
        .then((response) => {
          EventBus.$emit("loader", false);
          this.paypalLink = response.data.data.redirect;
          setTimeout(() => {
            window.open(response.data.data.redirect, "__blank");
          }, 300);
        })
        .catch(() => {
          EventBus.$emit("loader", false);
          this.popupActive = true;
        });
    },

    stripePayment() {
      let splitExpiryDate = this.expiryDate._i.split("/");
      let payload = {
        credentials: {
          assocId: this.currentAssociation.id,
          cycle_id: this.bill.cycles_id,
          facture_id: this.bill.id,
          mode: this.choosenMethod.value,
          data: {
            card: {
              number: this.cardNumber,
              exp_month: splitExpiryDate[1],
              exp_year: splitExpiryDate[0],
              cvc: this.cvc,
              name: this.cardholderName,
            },
          },
        },
        commitAction: "NO_COMMIT",
      };

      this.$store
        .dispatch("billing/buyInvoice", payload)
        .then(() => {
          this.closeLoadingContained("proceedButton");
          this.$vs.notify({
            position: "top-center",
            text: this.$t("paymentSuccessful"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          localStorage.setItem("invoice_id", this.bill.id);
          this.$router.push("/association/administration/bill/details");
        })
        .catch((error) => {
          this.closeLoadingContained("proceedButton");
          this.$vs.notify({
            position: "top-center",
            text: error.response.data.data.errMsg,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    mobilePayment() {
      let payload = {
        credentials: {
          assocId: this.currentAssociation.id,
          cycle_id: this.bill.cycles_id,
          facture_id: this.bill.id,
          mode: this.choosenMobileOperator.slug,
          data: {},
        },
        commitAction: "NO_COMMIT",
      };
      if (this.choosenMobileOperator.value == "orange money")
        payload.credentials.data.card = {
          codeom: this.receiptNumber,
        };
      this.$store
        .dispatch("billing/buyInvoice", payload)
        .then(() => {
          this.closeLoadingContained("proceedButton");
          this.$vs.notify({
            position: "top-center",
            text: this.$t("paymentSuccessful"),
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "success",
          });
          localStorage.setItem("invoice_id", this.bill.id);
          this.$router.push("/association/administration/bill/details");
        })
        .catch((error) => {
          this.closeLoadingContained("proceedButton");
          this.$vs.notify({
            position: "top-center",
            text: error.response.data.data.errMsg,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },

    payment() {
      this.openLoadingContained("proceedButton", "#fff", "primary");

      switch (this.choosenMethod.value) {
        case "paypal":
          this.$router.push("/association/administration/bill/details");
          break;
        case "stripe":
          this.stripePayment();
          break;
        case "mobile":
          this.mobilePayment();
          break;
      }
    },

    openLoadingContained(idLoader, loadingColor, background) {
      this.$vs.loading({
        background: background,
        color: loadingColor,
        container: `#${idLoader}`,
        scale: 0.45,
      });
    },

    closeLoadingContained(idLoader) {
      this.$vs.loading.close(`#${idLoader} > .con-vs-loading`);
    },

    reset() {
      this.expiryDate = "";
      this.cardNumber = "";
      this.cvc = "";
      this.choosenMobileOperator = "";
      this.receiptNumber = "";
    },
  },

  created() {
    EventBus.$emit("loader", true);

    let bill_id = localStorage.getItem("invoice_id");
    let payload = {
      credentials: {
        assId: this.currentAssociation.id,
        invId: bill_id,
      },
      commitAction: "SET_BILL",
    };

    this.$store
      .dispatch("billing/getInvoiceById", payload)
      .then(() => {
        this.isReady = true;
        EventBus.$emit("loader", false);
      })
      .catch(() => {
        this.$router.push("/association/administration/bills");
        this.$vs.notify({
          position: "top-center",
          text: this.$t("noBillHasBeenSelected"),
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger",
        });
      });
  },
};
</script>

<style lang="scss" scoped>
a.paymentOption {
  color: inherit;
  cursor: pointer;
  > div.vs-list--item {
    transition: all ease 0.5s;
  }
  > div.vs-list--item.selected {
    background-color: #1bb9994f;
  }
}
a.paymentOption:hover div.vs-list--item,
a.paymentOption.selected div.vs-list--item {
  background-color: #1bb9994f;
}
.minWidth4 {
  min-width: 4rem !important;
}
</style>
