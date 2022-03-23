import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)

import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use(CKEditor);
// axios
import axios from "./axios.js"
Vue.prototype.$http = axios

// API Calls
import "./services/http/requests"

// Theme Configurations
import '../themeConfig.js'

// Firebase
import '@/services/firebase/firebaseConfig'

// Auth0 Plugin
import AuthPlugin from "./services/plugins/auth";
Vue.use(AuthPlugin);

// ACL
import acl from './services/acl/acl'


// Globally Registered Components
import './components'

// Styles: SCSS
import './assets/scss/main.scss'

// Tailwind
import '@/assets/css/main.css'

// Vue Router
import router from './router'

// Vuex Store
import store from '@/store'

// i18n
import i18n from './services/i18n/i18n'
Vue.use(i18n);

// Vuexy Admin Filters
import './services/filters/filters'

// Clipboard
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

// Tour
import VueTour from 'vue-tour'
Vue.use(VueTour)
require('vue-tour/dist/vue-tour.css')

// Google Analytics
import VueAnalytics from 'vue-analytics'
if (process.env.VUE_APP_GOOGLE_ANALYTIC == 'true') {
    Vue.use(VueAnalytics, {
        id: 'UA-133718220-1',
        router
    })
}

// VeeValidate
import fr from 'vee-validate/dist/locale/fr';
import en from 'vee-validate/dist/locale/en';
// import VeeValidate, { Validator } from 'vee-validate';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, {
    i18nRootKey: "validations", // customize the root path for validation messages.
    i18n,
    dictionary: {
        en: en,
        fr: fr
    }
});

import jwt from "@/services/http/requests/auth/jwt/index.js"

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

// Vue autocomplete
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
Vue.use(Autocomplete)

// Date picker
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
Vue.use(FlatPickr)

import VueTelInput from 'vue-tel-input'
Vue.use(VueTelInput)

import Antd from 'ant-design-vue';
import '@/assets/css/ant-upload.css';
Vue.use(Antd)

import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect)

//Icon
import iconComponent from './components/Icon.vue'
Vue.component('icon', iconComponent);

// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// Feather font icon
require('./assets/css/iconfont.css')

// Small chat
router.beforeEach((to, from, next) => {
    var x = window.matchMedia("(max-width: 700px)")
    if (to.path == '/user/login' ||
        to.path == '/user/register' ||
        to.path == '/user/verify-code' ||
        to.path == '/user/forgot-password'||
        x.matches
    ) {
        removeTawkto()
    } else if (process.env.VUE_APP_TAWK_TO == 'true') {
        tawkto()
    }
    next()
})

Vue.config.productionTip = false

jwt.init();


new Vue({
    el:'#app',
    router,
    store,
    i18n,
    acl,

    render: (h) => h(App)

})


function tawkto() {
    var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/5f4fa79df0e7167d000cdc27/default';
    s1.charset = 'UTF-8';
    s1.setAttribute('id', 'tawkto');
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
}

function removeTawkto() {
    let s0 = document.getElementById("tawkto");

    let frame = document.getElementsByTagName('iframe')
    if (frame) {
        Array.from(frame).map(e => {
            e.remove();
        })
    }


    let checkExist = setInterval(function() {
        if (s0) {
            s0.style.display = "none"
            s0.remove(s0);
            clearInterval(checkExist);
        }
    }, 100);
}
