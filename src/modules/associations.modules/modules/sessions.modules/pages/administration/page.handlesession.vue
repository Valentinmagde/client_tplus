<template>
    <div>
        <management-view :roles="getRoles" :ag="ag" :uuid="uuid" :assId="currentAssociation.id" :admin="admin" :users="users" :rubriques="rubriques" :key="rendering" :isCurrentAg="isCurrentAg" :selecTab="current_selectab" :rapportId="rapportId" :allRapportParameters="allRapportParameters" @delete:rubrique="del" @update:rapport="val => updateRapport(val)" @update:rubrique="val => updateRubrique(val)" />
    </div>
</template>

<script>
import Vue from 'vue'

import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Rx from 'rxjs/Rx'

import ManagementView from '../../components/ManagementView.component.vue'
import topics from '../../services/mixins/topics'
import dataHandle from '../../services/mixins/data'
import sidebar  from '../../services/mixins/sidebar'

import checkRoles from '../../../../mixins/checkRole'

import {
    EventBus
} from '@/services/EventBus.js'

import {
    getRapportAg,
    getAssociationMembres,
    deleteRubrique,
    clotureAg
} from "../../services/api"

import {
    mapGetters
} from 'vuex'

Vue.use(CKEditor);

const proxy = (request) => request.map(e => ({
    name: e.firstName,
    username: e.lastName,
    phone: e.phone,
    id: e.id
}))

const fluck = (request) => request.data.data

const membres$ = (credentials) => Rx.Observable.from(getAssociationMembres(credentials)
    .then(e => ({
        membres: fluck(e)
    }))
)


/* const checkAg = (uuid) => allAgs.find(e => e.id == uuid && e.etat == 'current') */

const checkIfAgRapportExist$ = (credentials, allAgs) =>
    Rx.Observable.from(allAgs)
    .filter(e => e.id == credentials.agId && e.etat == 'current')
    .switchMap(() => Rx.Observable.from(
        getRapportAg(credentials)
        .then(e => ({
            rapport: fluck(e)
        }))
    ))
    .defaultIfEmpty({
        rapport: null
    })

export default {
    name: "layout-seance",
    mixins: [topics, sidebar, dataHandle, checkRoles],
    props: {
        // admin: {
        //     type: Boolean,
        //     default: false,
        // },
        uuid: {
            default: true
        }
    },

    async created() {
        this.roles = this.getRoles

        EventBus.$emit('loader', true);

        const checkifAgExist = this.checkAg(this.uuid)

        if (checkifAgExist) {
            this.stream = Rx.Observable.merge(
                membres$({
                    id: this.$store.state.association.currentAssociation.id
                }),
                checkIfAgRapportExist$({
                    assId: this.$store.state.association.currentAssociation.id,
                    agId: this.uuid
                }, this.$store.state.association.ags))
            await this.stream.subscribe(

                e => {

                    if (e.hasOwnProperty('membres'))
                        this.users = proxy(e.membres)

                    if (e.hasOwnProperty('rapport')) {

                        if (e.rapport) {
                            this.rapportId = e.rapport.id
                            this.allRapportParameters = e.rapport
                            this.rubriques = e.rapport.sections

                            this.$store.commit('association/SET_REPORT', e.rapport);

                            if (this.$store.state.authentificated.user.id == e.rapport.secretaire)
                                if (!this.roles.includes("Secretaire"))
                                    this.roles.push("Secretaire")

                            this.isCurrentAg = true
                            this.rendering += 1

                        } else {
                            this.allRapportParameters = {
                                canAcess: false
                            }
                        }
                    }
                },
                /* eslint-disable no-unused-vars */
                err => {
                    this.allRapportParameters = {
                        todo: 'list'
                    }
                    EventBus.$emit('loader', false);
                    this.ag = this.checkAg(this.uuid)
                },
                () => {

                    EventBus.$emit('loader', false);
                    if (this.allRapportParameters && !this.allRapportParameters.hasOwnProperty('canAcess'))
                        this.rendering += 1

                }
            )

        } else {
            if (this.$router.history.current.path.startsWith('/association/administration/sessions/'))
                this.$router.push('/association/administration/sessions')
            else
                this.$router.push('/association/sessions')
        }

    },
    methods: {
        checkAg(uuid) {
            let ags = this.$store.state.association.ags
            let ag_courrante = null

            if(ags.length)
                ag_courrante = ags.find(e => e.id == uuid && e.etat == 'current')

            if (ag_courrante) {
                return true
            } else
                return false
        },
        onReady(editor) {
            // Insert the toolbar before the editable area.
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        },
        updateRapport(val) {

            this.rapportId = val.id

            if (this.$store.state.authentificated.user.id == val.all.secretaire)
                this.roles.push(["Secretaire"])

            this.allRapportParameters = val
            this.current_selectab = 1
            this.rendering += 1

        },
        async updateRubrique(val) {
            const newRubriques = this.rubriques.map(e => {
                if (e.id == val.sectionID)
                    return Object.assign({}, e, {
                        titre: val.title,
                        contenu: e.contenu
                    })
                else
                    return e
            })
            this.rubriques = newRubriques
            this.rendering += 1
        },
        //loturer une ag
        cloturerAg() {
            clotureAg({
                    agId: this.uuid,
                })
                .then(() => {
                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('notifContent'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })

                }).then(() => this.$router.push('/association/administration/sessions'))
                .catch((error) => {
                    window.console.error(error)
                })

        },

        del(val) {
            deleteRubrique({
                    assId: this.$store.state.association.currentAssociation.id,
                    secId: val,
                })
                .then(() => {
                    const newTab = this.rubriques.filter(
                        e => e.id != val
                    )
                    this.rubriques = newTab

                    this.rendering += 1
                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('notifContent'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                })
                .catch((error) => {
                    window.console.error(error)
                })

        },
        /* saveNewRubrique() {
            createSection({
                    assId: this.$store.state.association.id,
                    rapportId: this.rapportId,
                    title: this.rubriqueTitle,
                    contenu: this.rubriqueComment
                })
                .then(e => {

                    this.rubriqueTitle = ''
                    this.rubriqueComment = ""

                    this.toggleDataSidebar()

                    this.rubriques.push({
                        id: e.data.data.id,
                        titre: e.data.data.titre,
                        contenu: e.data.data.contenu
                    })
                    this.$vs.notify({
                        position: 'top-center',
                        text: this.$t('notifContent'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    })
                    this.current_selectab = 3 + this.rubriques.length
                    this.rendering += 1
                })
        } */
    },
    computed: {
        admin() {
          return this.hasRole('Contrôleur financier');
        },
        ...mapGetters({
            getRoles: 'authentificated/getRoles',
            getReport: 'association/getReport',
            currentAssociation: 'association/getCurrentAssociation'
        }),
        hasEditRoles() {
            return this.roles
        },
        disable() {
            return (this.rubriqueTitle.length >= 3) ? false : true
        }
    },
    components: {
        ManagementView
    },

    data: () => ({
        rubriqueTitle: '',
        ag: null,
        allRapportParameters: null,
        rapportId: null,
        rubriqueComment: '',
        rendering: 0,
        users: [],
        roles: [],
        stream: null,
        current_selectab: 0,

        editor: ClassicEditor,
        isCurrentAg: false,

        editorConfig: {
            height: 450
        },
    }),

    destroyed() {
        this.setparamSeanceInfos()
    }

}
</script>
