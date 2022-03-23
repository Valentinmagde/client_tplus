


<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <!-- Headers -->


        <!-- Headers -->
        <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">
      <div class="p-6">
        <slot name="component"></slot>

        <!-- Content -->

    </div>
    </VuePerfectScrollbar>
    <div class="flex flex-wrap items-center p-6" slot="footer">
      <slot>
        <vs-button
          class="mr-6"
          type="border"
          color="danger"
          @click="isSidebarActiveLocal = false">
          {{$t('cancel')}}
        </vs-button>

        <vs-button
          class="ml-3 vs-con-loading__container"
          ref="loadableButton"
          id="button-loading"
          :disabled="disable" @click.prevent="submit" >
          {{$t('submit')}}
        </vs-button>
      </slot>
    </div>
  </vs-sidebar>
</template>


<script>
// Import components



import Vue from 'vue'
import VueTelInput from 'vue-tel-input'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { VueCsvImport } from 'vue-csv-import';
import Antd from 'ant-design-vue';

import 'flatpickr/dist/flatpickr.css';

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

import VueTimepicker from 'vuejs-timepicker'
import { TooltipPlugin } from "@syncfusion/ej2-vue-popups";

//Importation des feuilles de style
import "@/assets/scss/vuexy/pages/profile.scss";
import '@/assets/css/ant-upload.css';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-vue-popups/styles/material.css";

Vue.use(VueTimepicker)
Vue.use(Antd);
Vue.use(VueTelInput)
Vue.use(TooltipPlugin);
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => {},
    }
  },
  watch: {
    isSidebarActive(val) {
      if(!val) return
      if(Object.entries(this.data).length === 0) {
        this.$validator.reset()
      }else {
        let {id} = JSON.parse(JSON.stringify(this.data))
        this.dataId = id
      }
    }
  },
  data() {
    return {
      settings: { // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: .60,
      },

      disable: true,
      preview: false
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive
      },
      set(val) {
        if(!val) {
          this.$emit('closeSidebar')
        }
      }
    },
  },
   components: {
    // Register components

    VuePerfectScrollbar,
    VueCsvImport,
    VueTimepicker,
  },
  methods: {
    submit(){
      this.$refs.form.submit()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/vuexy/pages/profile.scss";
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }
  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 600px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }
      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
    .ajout-masse {
        height: 145px !important;
    }

    .col-padding {
      padding: 0 .5rem !important;
    }
  }
}

.scroll-area--data-list-add-new {
    height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    // height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
}
</style>


