<template>
<vs-dropdown vs-custom-content vs-trigger-click class="hover:text-blue cursor-pointer">
    <span class="cursor-pointer flex items-center i18n-locale">
        <img class="h-4 w-5 md:hidden lg:hidden xl:hidden" :src="i18n_locale_img" :alt="$i18n.locale" />
        <span class="hidden sm:hidden md:block lg:block xl:block ml-2">{{ getCurrentLocaleData.lang }}</span>
    </span>
    <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
        <vs-dropdown-item @click="updateLocale('fr')"> &nbsp;Français</vs-dropdown-item>
        <vs-dropdown-item @click="updateLocale('en')">&nbsp;English</vs-dropdown-item>
    </vs-dropdown-menu>
</vs-dropdown>
</template>

<script>
export default {
    computed: {
        i18n_locale_img() {
            return require(`@/assets/images/flags/${this.$i18n.locale}.png`)
        },
        getCurrentLocaleData() {
            const locale = this.$i18n.locale;
            if (locale == "en") return {
                flag: "us",
                lang: 'Français'
            }
            else if (locale == "pt") return {
                flag: "br",
                lang: 'Portuguese'
            }
            else if (locale == "fr") return {
                flag: "fr",
                lang: 'English'
            }
            else if (locale == "de") return {
                flag: "de",
                lang: 'German'
            }
        },
    },
    methods: {
        updateLocale(locale) {
            this.$i18n.locale = locale;
        },
    }
}
</script>
