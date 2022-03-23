<template>
<div>
    <!-- Nom -->
    <vs-input :label="$t('name')+ '*'" v-model="nom" class="w-full" @onchange="validateForms" />
    <!-- Type -->
    <p class="vs-input--label mt-5">{{$t('Type')+ ' '+'*'}}</p>
    <v-select label="text" :options="selectOptions" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="type_assistance" class="w-full" />

    <!-- Autre Titre -->
    <vs-input v-if="type_assistance.value == 'Autre'" :label="$t('other')+ '*'" name="titre" v-model="autre_type_assistance" class="w-full mt-5" @onchange="validateForms" />

    <!-- Description -->
    <p class="vs-input--label mt-5">{{$t('description')}}</p>
    <vs-textarea name="description" v-model="description" class="w-full" />

    <!-- Montant-->
    <p class="vs-input--label mt-5">{{$t('Amount')+ ' '+'*'}}</p>
    <money v-model="montant" v-bind="money" class="money-input pt-3 pb-3 w-full" @onchange="validateForms" />

    <!-- Maximum -->
    <span class="flex">
        <p class="vs-input--label mt-5 inline-block">{{$t('maximumAssistance')}}</p>
        <p class="vs-input--label mt-5 inline-block">
            <ejs-tooltip ref="tooltip" :content="$t('maximumNumberOfTimesMemberCanBenefitFromAssistance')" position="bottom" class="mr-2 inline-block">
                <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
            </ejs-tooltip>
        </p>
    </span>
    <vs-input type="number" v-model="max" class="w-full" step="1" min="0" @keydown="filterKey" @onchange="validateForms" />
    <!-- Assistance maximum par cycle -->
    <span class="flex">
        <p class="vs-input--label mt-5 inline-block">{{$t('maximumAssistancePerCycle')}}</p>
        <p class="vs-input--label mt-5 inline-block">
            <ejs-tooltip ref="tooltip" :content="$t('maximumNumberOfTimesMemberCanBenefitFromAssistanceInCycle')" position="bottom" class="mr-2 inline-block">
                <feather-icon icon="HelpCircleIcon" svgClasses="w-4 h-4 hover:text-success stroke-current" class="ml-1 mt-1" />
            </ejs-tooltip>
        </p>
    </span>
    <vs-input type="number" v-model="max_cycle" class="w-full" step="1" min="0" @keydown="filterKey" @onchange="validateForms" />

    <vs-checkbox v-model="checkbox_create_another" class="mt-6" style="margin-left: -1px">
        {{$t('addAnother')}}
    </vs-checkbox>
</div>
</template>

<script>
import {
    Money
} from 'v-money'
import {
    categorie
} from "../../../services/data/news-categories"
import vSelect from 'vue-select'

//Store
// import moduleActivite from "@/store/activite/moduleActivite.js"

export default {
    props: ['idLoader'],
    data() {
        return {
            nom: '',
            type_assistance: '',
            autre_type_assistance: '',
            categorie: '',
            categories: categorie,
            description: '',
            montant: 0,
            max: 0,
            max_cycle: 0,
            money: {
                decimal: ',',
                thousands: '.',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
            checkbox_create_another: false,

            /* Loading */
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            loader: true,
        }
    },
    components: {
        vSelect,
        Money
    },
    computed: {
        selectOptions() {
            return categorie.map(categori => ({
                text: this.$t(categori.i18n),
                value: categori.value
            }))
        },
        validateForms() {
            if (this.type_assistance != '' &&
                this.montant != 0 &&
                this.nom != '' &&
                !isNaN(parseInt(this.max)) &&
                !isNaN(parseInt(this.max_cycle))
            ) return this.$emit('disable', false)
            else if (!this.loader) return this.$emit('disable', false)
            else return this.$emit('disable', true)
        },
    },
    mounted() {
        this.type_assistance = {
            text: this.$t(categorie[0].i18n),
            value: categorie[0].value
        }
    },
    methods: {
        filterKey(e) {
            const key = e.key;

            // If is '.' key, stop it
            if (key === '.')
                return e.preventDefault();

            // OPTIONAL
            // If is 'e' key, stop it
            if (key === 'e' || key === 'E')
                return e.preventDefault();
        },
        /* Loader */
        openLoadingContained() {
            this.loader = false
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: `#${this.idLoader}`,
                scale: 0.45
            });
        },

        submit() {
            if (this.max > 0 && this.max_cycle > this.max) {
                this.$vs.notify({
                    position: 'top-center',
                    text: this.$t('maximumAssistancePerCycleMustBeLessThanMaximumAssistance'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                })
            } else {
                this.openLoadingContained()
                var association = this.$store.state.association.currentAssociation
                let type = this.autre_type_assistance != '' ? this.autre_type_assistance : this.type_assistance.value

                let payload = {
                    resourceUrl: "/api/association/" + association.id + "/types/assistances",
                    commitAction: 'SET_TYPE_ASSISTANCES',
                    data: {
                        nom: this.nom,
                        type: type,
                        montant: this.montant,
                        max: this.max,
                        max_cycle: this.max_cycle,
                        description: this.description
                    }
                }
                this.$store.dispatch("association/postRequest", payload)
                    .then(() => {
                        this.loader = true
                        this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)

                        if (!this.checkbox_create_another) {
                            this.$emit('isSidebarActiveLocal', false)
                        }

                        this.nom = ''
                        this.montant = 0
                        this.description = ''
                        this.max = 0
                        this.max_cycle = 0

                        this.$vs.notify({
                            position: 'top-center',

                            text: this.$t('assistanceTypeSuccessfullyAdded'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'success'
                        })

                        let payload = {
                            resourceUrl: "/api/association/" + association.id + "/types/assistances",
                            commitAction: 'SET_TYPES_ASSISTANCES'
                        }
                        this.$store.dispatch("association/fetchAssociationactivite", payload)
                            .catch((error) => {
                                window.console.error(error)
                            })
                    })
                    .catch(error => {
                        this.loader = true
                        this.$vs.loading.close(`#${this.idLoader} > .con-vs-loading`)
                        this.$vs.notify({
                            position: 'top-center',
                            text: error,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            }
        }
    },
}
</script>
