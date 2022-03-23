<template>
    <div class="ep-association">
        <div class="vx-row">
            <div class="vx-col w-full">
                <!-- ACTIVITE -->
                <table class="w-full border-collapse">
                    <tr>
                        <td class="font-semibold">{{$t('Type')}}</td>
                        <td>{{ activite.activite.type }}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('name')}}</td>
                        <td>
                            {{activite.activite.nom}}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('creationDate')}}</td>
                        <td>{{ (activite.activite.date_created) | dateTime }}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('state')}}</td>
                        <td>
                            <p v-if="activite.activite.etat == 'actif'" class="product-price">
                                <vs-chip color="success">{{$t('activated')}}</vs-chip>
                            </p>
                            <p v-if="activite.activite.etat == 'inactif'" class="product-price">
                                <vs-chip color="danger">{{$t('desactivated')}}</vs-chip>
                            </p>
                            <p v-if="activite.activite.etat == 'init'" class="product-price">
                                <vs-chip>{{$t('creation')}}</vs-chip>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('numberOfNames')}}</td>
                        <td>{{activite.compte.nombre_noms}}</td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('amountContribution')}}</td>
                        <td>
                            <p class="product-name font-medium truncate"
                                :class="{redtextclass: activite.compte.montant_cotisation < 0}">
                                {{ (activite.compte.montant_cotisation) | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('anteriorBalance')}}</td>
                        <td>
                            <p class="product-name font-medium truncate"
                                :class="{redtextclass: activite.compte.solde_anterieur < 0}">
                                {{ (activite.compte.solde_anterieur) | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">{{$t('balance')}}</td>
                        <td>
                            <p class="product-name font-medium truncate"
                                :class="{redtextclass: activite.compte.solde < 0}">
                                {{ (activite.compte.solde) | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td class="font-semibold">{{$t('debtPenalityLate')}}</td>
                        <td>
                            <p class="product-name font-medium truncate"
                                :class="{redtextclass: activite.compte.dette_a < 0}">
                                {{ (activite.compte.dette_a) | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td class="font-semibold">{{$t('debtBond')}}</td>
                        <td>
                            <p class="product-name font-medium truncate"
                                :class="{redtextclass: activite.compte.dette_c < 0}">
                                {{ (activite.compte.dette_c) | formatMoney(devise) }}
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
//Fonctions
// import i18n_date from '@/i18n_date.js'

export default {
    props: ['activite'],
    data(){
        return {
            devise: '',
        }
    },
    created(){
        var association_courante = this.$store.state.association.currentAssociation
        this.devise = association_courante.devise
    }
}
</script>
<style lang="scss">
table {
        background: #f8f8f8;
        border: 2px solid #f8f8f8;

        .th-bg {
            background-color: #fff;
        }
        tr:nth-child(even) {
            background-color: #fff;
        }
        td {
            padding: 5px;
        }
    }
</style>
