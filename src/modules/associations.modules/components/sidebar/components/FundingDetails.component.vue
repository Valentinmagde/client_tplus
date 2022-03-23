<template>
<div class="ep-association">
    <!-- Popup pour supprimer une mise de fonds -->
    <vs-popup id="popup" classContent="popup-example" :title="$t('deleteConfirmTitle')" :active.sync="popupActivo2">
        <p>{{$t('deleteConfirm')}}</p>
        <vs-divider />
        <div class="vx-row w-full justify-end">
            <vs-button color="warning" @click="popupActivo2=false" type="border">
                {{$t('cancel')}}
            </vs-button>&nbsp;&nbsp;

            <vs-button class="ml-3 vs-con-loading__container" color="danger" ref="loadableButton" id="button-with-loading" :disabled="!loader" @click.stop="deleteItem(mise_selectionnee)">
                {{$t('delete')}}
            </vs-button>
        </div>
    </vs-popup>
    <div class="vx-row">
        <div class="vx-col w-full">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('members') | CAPITALIZE}} </th>
                        <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('registrationDate') | CAPITALIZE}} </th>
                        <th class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('downPayment') | CAPITALIZE}} </th>
                        <th v-if="membre.activite" class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('activities') | CAPITALIZE}} </th>
                        <th v-if="admin" class="w-1/2 px-4 py-2 text-base th-bg">{{ $t('actions') | CAPITALIZE}} </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr, index) in mises" :key="index">
                        <td v-if="tr.membres_id == membre.membres_id" class="w-1/2 px-4 py-2 text-base">
                            <p class="product-name font-medium truncate">{{tr.membre}}</p>
                        </td>
                        <td v-if="tr.membres_id == membre.membres_id" class="w-1/2 px-4 py-2 text-base">
                            <p>
                                {{ (tr.date_versement) | dateTime }}
                            </p>
                        </td>
                        <td v-if="tr.membres_id == membre.membres_id" class="w-1/2 px-4 py-2 text-base">
                            <span>
                                <p :class="{redtextclass: tr.montant < 0}">
                                    {{ (tr.montant) | formatMoney(devise) }}
                                </p>
                            </span>
                        </td>
                        <td v-if="tr.membres_id == membre.membres_id && membre.activite" class="w-1/2 px-4 py-2 text-base">
                            <span>
                                <p>
                                    {{membre.activite}}
                                </p>
                            </span>
                        </td>
                        <td v-if="tr.membres_id == membre.membres_id && admin" class="w-1/2 px-4 py-2 text-base">
                            <ejs-tooltip ref="tooltip" :content="$t('delete')" position="bottom" class="inline-block">
                                <feather-icon icon="TrashIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2 mt-1" @click.stop="popupActivo2=true; mise_selectionnee=tr.id" />
                            </ejs-tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
import checkIfAdmin from '@/modules/associations.modules/mixins/checkRole'
export default {
    props: ['membre', 'mutuelle'],
    mixins: [checkIfAdmin],
    data() {
        return {
            devise: '',
            misesFonds: [],
            popupActivo2: false,
            mise_selectionnee: null,

            /* Loading */
            backgroundLoading: 'danger',
            colorLoading: '#fff',
            loader: true
        }
    },
    computed: {
        admin() {
          return this.isSuperAdministrator;
        },
        mises() {
            return this.$store.state.association.mises_fonds
        },
    },
    methods: {
        deleteItem(id) {
            this.openLoadingContained()
            let payload = {
                resourceUrl: '/api/mutuelle/mise/' + id + '/delete',
                commitAction: 'NO_COMMIT',
            }

            this.$store.dispatch("association/removeRecord", payload)
                .then(() => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    this.popupActivo2 = false
                    this.$vs.notify({
                        position: 'top-center',

                        text: this.$t('downPaymentSuccessfullyRemoved'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    //Recupperer tous les mises de fonds de la mutuelle
                    let epargne_courante = this.mutuelle;
                    let payload = {
                        resourceUrl: "/api/mutuelle/" + epargne_courante.id + "/misedefonds",
                        commitAction: 'SET_MISES_FONDS'
                    }
                    this.$store.dispatch("association/fetchAssociationactivite", payload)
                        .then((res) => {
                            this.misesFonds = res.data.data
                            this.$emit('isSidebarActiveLocal', false)
                        })
                        .catch((error) => {
                            window.console.error(error)
                        })
                })
                .catch(err => {
                    this.loader = true
                    this.$vs.loading.close("#button-with-loading > .con-vs-loading")
                    window.console.error(err)
                })
        },

        /* Loading */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            });
        },
    },
    created() {
        let epargne_courante = this.mutuelle;
        this.devise = this.$store.state.association.currentAssociation.devise

        let payload = {
          resourceUrl: "/api/mutuelle/" + epargne_courante.id + "/misedefonds",
          commitAction: 'SET_MISES_FONDS'
        }
        this.$store.dispatch("association/fetchAssociationactivite", payload)
        .then((res) => {
          this.misesFonds = res.data.data
        })
        .catch((error) => {
          window.console.error(error)
        })
      }
}
</script>

<style lang="scss">
table {
    td {
        padding: 5px;
    }
}

.con-vs-popup {
    z-index: 52020 !important;
}
</style>
