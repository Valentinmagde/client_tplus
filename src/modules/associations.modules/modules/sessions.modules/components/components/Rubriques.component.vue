<template>
    <div>
        <data-view
        @closeSidebar="toggleDataSidebar"
        :isSidebarActive="addNewDataSidebar"
        :data="emptyData">
        <h4 slot="title">{{$t('sectionTitleButton') | CAPITALIZE }}</h4>
        <template slot="component">

            <!-- Titre -->
            <vs-input
                :label="$t('title')"
                v-model="title"
                class="w-full mb-5"/>

            <!-- Description -->
            <p class="vs-input--label">{{$t('description')}}</p>
            <!-- <vs-textarea
                v-model="rubriqueComment"
                class="w-full" /> -->
            <div class="pb-12 mb-12">
                <ckeditor :editor="editor" v-model="content" @ready="onReady" :config="editorConfig"></ckeditor>
            </div>

        </template>


        <vs-button class="mr-6" type="border" color="danger" @click="isSidebarActiveLocal = false">{{$t('cancel')}}</vs-button>
        <vs-button id="button-loading" @click.stop="update" >{{$t('update')}}</vs-button>


   </data-view>
        <vx-card no-shadow :title="item.titre" style="min-height: 18rem">
            <div>
                <div class="vx-row mt-5">
                    <div :contentEditable="true" allowHTML="true" class="vx-col  w-full">
                        <span v-html="item.contenu"></span>
                    </div>
                </div>
            </div>

            <div class="mt-12 mb-3" v-if="roles.includes('Administrateur') || roles.includes('Secretaire')">
                <vs-button
                    type="border"
                    color="danger"
                    class="mr-6"
                    @click.native="del">
                        {{$t('delete')}}
                    </vs-button>
                <vs-button
                    :disabled="!validateForm"
                     @click.stop="() => addNewDataSidebar = !addNewDataSidebar ">
                    {{$t('update')}}
                </vs-button>
            </div>
        </vx-card>
    </div>
</template>

<script>
import Vue from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

/* import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'; */

import {updateSection} from '../../services/api'

import sidebar from '../../services/mixins/sidebar'

import data from '../../services/mixins/data'
Vue.use( CKEditor );

/* const display = (error) => window.console.log(error) */

export default {
    mixins : [data,sidebar],
    data(){
        return {
            title: this.item.titre,
            content: this.item.contenu,

            editor: ClassicEditor,

            editorConfig: {
                // The configuration of the editor.
                /* toolbar: [ 'bold', 'italic', 'underline','|', 'superscript', 'tabletoolbar' ] */
            },

            editorOption: {
                modules: {
                    toolbar: '#toolbar',
                }
            },
        }
    },
	props:{
		item: {
			type: Object,
			required: true
		},
        roles:{
            required: true
        },
        assId:{
            required: true
        }
	},
    created(){
        /* window.console.log(this.item) */
    },
    methods: {
        onReady( editor )  {
            // Insert the toolbar before the editable area.
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );
        },
        del(){
            this.$emit('delete:rubrique', this.item.id)
        },
        update(){
            /* display('update rubrique with emit') */
            //this.startLoding('button-with-loading-update')
            updateSection({
                sectionId: this.item.id,
                assId: this.assId,
                contenu: this.content,
                titre: this.title,
            })
            .then(e => {
                this.item.titre = this.title,
                this.item.contenu = this.content
                //this.stopLoding('button-with-loading-update')

                this.$vs.notify({
                    position:'top-center',
                    text: this.$t('notifContent'),
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'success'
                })
                this.addNewDataSidebar = false
                return e
            })
            /* .then(e => this.$emit('update:rubrique', {
                    sectionId: this.item.id,
                    assId: this.assId,
                    contenu: this.item.contenu,
                    titre: this.item.titre,
                    render:e
                })
            ) */
            .catch(e => window.console.log(e))

        }
    },
    computed: {
        validateForm(){
            return (this.item.titre) ? true  : false
        },
    },
}
</script>
<style lang="scss">
    [dir] .ql-container.ql-snow {
        border: 1px solid #ccc;
        min-height: 200px;
    }
</style>
