
<template>
	<div id="app" :class="vueAppClasses">
    <link rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
        crossorigin="anonymous">
      <loader v-if="activeLoader"/>
      <router-view @setAppClasses="setAppClasses" />

	</div>
</template>

<script>


import {EventBus} from '@/services/EventBus.js'

import themeConfig from '@/../themeConfig.js'
//import jwt         from "@/http/requests/auth/jwt/index.js"
import Loader from '@/components/Loader.vue'

export default {


  data() {
    return {
      vueAppClasses: [],
      isActive: false,
      loading:true
    }
  },

  computed:{
    activeLoader:{

      get(){
        return this.isActive
      },
      set(e){
        this.isActive = e
      }

    },

  },
  components:{
    Loader
  },
  watch: {
    '$store.state.theme'(val) {
      this.toggleClassInBody(val)
    },
    '$vs.rtl'(val) {
      document.documentElement.setAttribute("dir", val ? "rtl" : "ltr")
    },

  },
  methods: {

    toggleClassInBody(className) {
      if (className == 'dark') {
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark')
        document.body.classList.add('theme-dark')
      }
      else if (className == 'semi-dark') {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark')
        document.body.classList.add('theme-semi-dark')
      }
      else {
        if (document.body.className.match('theme-dark'))      document.body.classList.remove('theme-dark')
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark')
      }
    },
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr)
    },
    handleWindowResize() {
      this.$store.commit('UPDATE_WINDOW_WIDTH', window.innerWidth)

      // Set --vh property
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    },
    handleScroll() {
      this.$store.commit('UPDATE_WINDOW_SCROLL_Y', window.scrollY)
    },
    canBeRender(){
      let check = this.$router.currentRoute.meta.rule;
      return ('editor' === check) ? true : false

    }
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme)
    this.$store.commit('UPDATE_WINDOW_WIDTH', window.innerWidth)

    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);


  },

  async created() {

    EventBus.$on('loader',  (e)=>{this.activeLoader = e});

    /*this.unsubscribe = this.$store.subscribe((mutation) => {
          window.console.log(mutation.type)

      })*/

    //this.initApp();

    let dir = this.$vs.rtl ? "rtl" : "ltr"
    document.documentElement.setAttribute("dir", dir)

    window.addEventListener('resize', this.handleWindowResize)
    window.addEventListener('scroll', this.handleScroll)



  },
  destroyed() {
    window.removeEventListener('resize', this.handleWindowResize)
    window.removeEventListener('scroll', this.handleScroll)
  },
}

</script>
