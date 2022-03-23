/*=========================================================================================
  File Name: globalComponents.js
  Description: Here you can register components globally
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VxTooltip from './vx-tooltip/VxTooltip.vue'
import VxCard  from './vx-card/VxCard.vue'
import VxList  from './vx-list/VxList.vue'
import VxBreadcrumb  from './VxBreadcrumb.vue'
import FeatherIcon  from './FeatherIcon.vue'
import VxInputGroup  from './vx-input-group/VxInputGroup.vue'
import VxTimeline from './timeline/VxTimeline.vue'
import StatisticsCardLine from './statistics-cards/StatisticsCardLine.vue'

Vue.component(VxTooltip.name, VxTooltip)
Vue.component(VxCard.name, VxCard)
Vue.component(VxList.name, VxList)
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component(VxInputGroup.name, VxInputGroup)
Vue.component(VxTimeline.name, VxTimeline)
Vue.component('statistics-card-line', StatisticsCardLine)


// v-select component
import vSelect from 'vue-select'

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'XIcon',
        svgClasses: 'w-4 h-4 mt-1'
      }
    }),
  },
  OpenIndicator: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'ChevronDownIcon',
        svgClasses: 'w-5 h-5'
      }
    }),
  },
});

Vue.component(vSelect)
