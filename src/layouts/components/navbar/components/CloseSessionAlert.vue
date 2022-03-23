<template>
<div class="flex flex-col text-left">
  <p class="font-semibold close-session blink_me">{{fetchAlert}}</p>
</div>
</template>

<script>
import Vue from 'vue'
// i18n
import i18n from '@/services/i18n/i18n'
Vue.use(i18n);
export default {
    computed: {
        fetchAlert() {
            if (i18n.locale == 'en')
                return 'The current session is over, please close it'
            else
                return 'La séance en cours est terminée, clôturez-la !!!'
        },
    },
}
</script>

<style>
.close-session {
  font-style: italic;
  z-index: 51000;
  color: rgba(243, 52, 52, 0.979);
}

.blink_me {
    animation: blinker 10s linear infinite;
}

@keyframes blinker {
    50% {
        opacity: 0;
    }
}
</style>
