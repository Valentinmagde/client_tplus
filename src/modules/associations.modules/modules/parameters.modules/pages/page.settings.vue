<template>
    <div>
        <div class="fixed top-0 z-20 w-full" style="height:150px; background-color: #f8f8f8;"/>
        <div class="pt-16 mt-5">
            <vs-tabs alignment="fixed">
                <!-- Information générale -->
                <vs-tab :label="$t('generalInformation')">
                    <general-information />
                </vs-tab>

                <!-- Autres paramètres -->
                <vs-tab :label="$t('sanctionAdmin')">
                    <other-parameters />
                </vs-tab>

                <!-- Facturation -->
                <!-- <vs-tab :label="$t('billing')">
                    <facturation />
                </vs-tab> -->

                <!-- Actions -->
                <vs-tab :label="$t('actions')">
                    <actions/>
                </vs-tab>
            </vs-tabs>
        </div>
    </div>
</template>
<script>

import GeneralInformation from '../components/GeneralInformation.component.vue'
import Actions from '../components/Actions.component.vue'
// import Facturation from '../components/Facturation.component.vue'
import OtherParameters from '../components/OtherParameters.component.vue'

export default {
    data(){
        return {

        }
    },
    components: {
        GeneralInformation,
        Actions,
        // Facturation,
        OtherParameters,
    }
}
</script>
