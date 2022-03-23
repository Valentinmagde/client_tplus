<template>
  <div>
    <div
      class="fixed top-0 z-20 w-full"
      style="height: 150px; background-color: #f8f8f8"
    />
    <div class="pt-16">
      <vx-card v-if="invoice">
        <div class="vx-row">
          <div class="w-3/4 vx-col">
            <h5>TONTINE.PLUS</h5>
          </div>
          <div class="justify-end w-1/4 vx-col vx-row">
            <div>
              <p>
                {{ $t("Invoice") }} # <br />
                {{ invoice.id }}
              </p>
            </div>
          </div>
        </div>
        <vs-divider />
        <div class="mt-6 vx-row">
          <div v-if="association_courante" class="w-3/4 vx-col">
            <h5 class="mb-2">{{ association_courante.nom }}</h5>
            <p>
              {{ association_courante.ville }} - {{ association_courante.pays }}
            </p>
            <p>{{ association_courante.email }}</p>
            <p>{{ association_courante.telephone }}</p>
          </div>
          <div class="justify-end w-1/4 vx-col vx-row">
            <div>
              <p>
                {{ invoice.create_at | dateTime }}
              </p>

              <div class="flex items-center mt-2">
                <p class="inline-block mr-1">
                  <span>{{ $t("status") }}:</span>
                </p>
                <p class="inline-block">
                  <vs-chip
                    v-if="invoice.statut == 'EN_ATTENTE'"
                    color="danger"
                    >{{ $t("owing") }}</vs-chip
                  >
                  <vs-chip v-if="invoice.statut == 'PAYE'" color="success">{{
                    $t("paid")
                  }}</vs-chip>
                  <vs-chip v-if="invoice.statut == 'pending'" color="warning">{{
                    $t("pending")
                  }}</vs-chip>
                </p>
              </div>
            </div>
          </div>
        </div>
        <vs-divider />
        <div class="mt-6">
          <table class="z-10 w-full mt-4 border-collapse table-auto">
            <thead>
              <tr>
                <th class="px-4 py-2 text-base th-bg">#</th>
                <th class="px-4 py-2 text-base th-bg">{{ $t("wording") }}</th>
                <th class="px-4 py-2 text-base th-bg">
                  {{ $t("numberOfAccounts") }}
                </th>
                <th class="px-4 py-2 text-base th-bg">{{ $t("period") }}</th>
                <th class="px-4 py-2 text-base th-bg">{{ $t("unitPrice") }}</th>
                <th class="px-4 py-2 text-base th-bg">{{ $t("total") }}</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td class="px-4 py-2">1</td>
                <td class="px-4 py-2">
                  {{ invoice.libelle }}
                </td>
                <td class="px-4 py-2">
                  {{ invoice.nb_comptes }}
                </td>
                <td class="px-4 py-2">
                  {{ invoice.periode }}
                </td>
                <td class="px-4 py-2">
                  {{
                    invoice.prix_unitaire
                      | formatMoney(association_courante.devise)
                  }}
                </td>
                <td class="px-4 py-2">
                  {{
                    (invoice.nb_comptes * invoice.periode * invoice.prix_unitaire) | formatMoney(association_courante.devise)
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <vs-divider />
        <div class="mt-6 vx-row">
          <div class="w-3/4 vx-col">
            <h5 class="mb-2">{{ $t("termsAndConditions") }}</h5>
            <p>{{ $t("pleaseFillInTheActivityParametersFirst") }}</p>
          </div>
          <div class="justify-end w-1/4 vx-col vx-row">
            <div>
              <p>
                {{ $t("subTotal") }}:
                {{ (invoice.nb_comptes * invoice.periode * invoice.prix_unitaire) | formatMoney(association_courante.devise) }}
                <br />

                {{ $t("discount") }}:
                {{
                  invoice.reduction | formatMoney(association_courante.devise)
                }}
              </p>
            </div>
            <vs-divider />
            <h4>
              {{ invoice.montant | formatMoney(association_courante.devise) }}
            </h4>
          </div>
        </div>
        <div>
          <vs-divider />
          <div class="flex flex-row">
            <div class="flex flex-row w-1/2">
              <div class="flex flex-row w-100" v-if="!invoice.code_promo && invoice.statut == 'EN_ATTENTE'">
                <vs-input
                  v-model="coupon"
                  type="text"
                  :placeholder="$t('couponCodeHere')"
                ></vs-input>
                <vs-button
                  class="ml-2"
                  color="#2B3D51"
                  :disabled="!isCouponFormFilled"
                  @click="applyCoupon()"
                >
                  {{ $t("submit") }}
                </vs-button>
              </div>
              <div v-if="invoice.code_promo">
                <vs-button
                  color="warning"
                  type="border"
                  icon="refresh"
                  @click="revertCoupon()"
                >
                  {{ $t("Revert coupon") }}
                </vs-button>
              </div>
            </div>
            <div
              v-if="invoice.statut !== 'PAYE'"
              class="flex flex-row-reverse w-1/2"
            >
              <vs-button
                color="#039CFD"
                id="button-with-loading-payer"
                :disabled="!loader"
                class="inline-block mr-5"
                @click="redirectToPayment()"
              >
                {{ $t("pay") }}
              </vs-button>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { EventBus } from "@/services/EventBus";

export default {
  data() {
    return {
      /* Loading */
      backgroundLoading: "primary",
      colorLoading: "#fff",
      loader: true,

      coupon: "",
    };
  },

  computed: {
    ...mapGetters({
      association_courante: "association/getCurrentAssociation",
      invoice: "billing/getBill",
    }),

    isCouponFormFilled() {
      return this.coupon !== "";
    },
  },

  methods: {
    applyCoupon() {
      EventBus.$emit("loader", true);
      let payload = {
        credentials: {
          assId: this.association_courante.id,
          cyId: this.invoice.cycles_id,
          invId: this.invoice.id,
          coupon: this.coupon,
        },
        commitAction: "NO_COMMIT",
      };
      this.coupon = ""

      this.$store
        .dispatch("billing/applyCoupon", payload)
        .then(() => {
          let payload = {
            credentials: {
              assId: this.association_courante.id,
              invId: this.invoice.id,
            },
            commitAction: "SET_BILL",
          };
          this.$store
            .dispatch("billing/getInvoiceById", payload)
            .then(() => {
              EventBus.$emit("loader", false);
            })
            .catch((error) => {
              EventBus.$emit("loader", false);
              this.$vs.notify({
                position: "top-center",
                text: error.response.data.data.errMsg,
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "danger",
              });
            });
        })
        .catch((error) => {
          EventBus.$emit("loader", false);
          this.$vs.notify({
            position: "top-center",
            text: error.response.data.data.errMsg,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
    revertCoupon() {
      EventBus.$emit("loader", true);
      this.coupon = ""
      let payload = {
        credentials: {
          assId: this.association_courante.id,
          cyId: this.invoice.cycles_id,
          invId: this.invoice.id,
          coupon: this.invoice.code_promo,
        },
        commitAction: "NO_COMMIT",
      };

      this.$store
        .dispatch("billing/revertCoupon", payload)
        .then(() => {
          let payload = {
            credentials: {
              assId: this.association_courante.id,
              invId: this.invoice.id,
            },
            commitAction: "SET_BILL",
          };
          this.$store
            .dispatch("billing/getInvoiceById", payload)
            .then(() => {
              EventBus.$emit("loader", false);
            })
            .catch((error) => {
              EventBus.$emit("loader", false);
              this.$vs.notify({
                position: "top-center",
                text: error.response.data.data.errMsg,
                iconPack: "feather",
                icon: "icon-alert-circle",
                color: "danger",
              });
            });
        })
        .catch((error) => {
          EventBus.$emit("loader", false);
          this.$vs.notify({
            position: "top-center",
            text: error.response.data.data.errMsg,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger",
          });
        });
    },
    redirectToPayment() {
      localStorage.setItem("invoice_id", this.invoice.id);
      this.$router.push("/association/administration/billing/pay");
    },
  },

  created() {
    EventBus.$emit("loader", true);
    let bill_id = localStorage.getItem("invoice_id");
    let association_id = this.association_courante.id;

    let payload = {
      credentials: {
        assId: association_id,
        invId: bill_id,
      },
      commitAction: "SET_BILL",
    };

    this.$store
      .dispatch("billing/getInvoiceById", payload)
      .then(() => {
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
