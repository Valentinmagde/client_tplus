<template>
    <div>
        <!-- Assemmblée générale -->
        <vx-card no-shadow :title="$t('archives')" :subtitle="$t('archivesSubtitle')">
            <p class="vs-input--label">{{$t('cycles')}}</p>
            <v-select
                :placeholder="$t('chooseCycle')"
                :options="selectCyclesClotures"
                v-model="cycle_clotures_selected"
                class="mb-2 w-full"/>
        </vx-card>
        <vx-card v-if="!cycle_clotures_selected" no-shadow class="empty-card"></vx-card>

        <!-- Voir le rapport d'une ag -->
        <div v-if="cycle_clotures_selected">
            <vx-card no-shadow class="mt-4" v-if="cycle_clotures_selected.value.length == 0">
            <p>
                {{$t('noGeneralMeeting')}}
            </p>
            </vx-card>
            <vx-card v-else no-shadow class="mt-4" :key="index" v-for="(ag, index) in cycle_clotures_selected.value">
            <div class="vx-row">
                <div class="vx-col w-1/2">
                <span class="block">
                    <icon name="calendar"/>
                    Date: {{new Date(ag.date_ag*1000).toLocaleDateString()}}
                </span>
                <span class="block">
                    <icon name="single-neutral-actions-home"/>
                    Hôte: {{ag.membre}}
                </span>
                <span class="block">
                    <icon name="pin-location-1"/>
                    Lieu: Chez {{ag.membre}}
                </span>
                </div>
                <div class="vx-row vx-col w-1/2 items-center justify-end">
                <vs-button type="border" :disabled="!ag.file" @click="openReportFile(ag.file)">{{$t('seeTheReport')}}</vs-button>
                </div>
            </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import { EventBus } from  '@/services/EventBus.js'

export default {
    props: ['cycle_clotures'],
    data() {
        return {
            cycles: [],
            cycle_clotures_selected: null,
        }
    },
    components: {
        vSelect
    },
    computed: {
        selectCyclesClotures(){
        if(this.cycles != null)
        return this.cycles.map(cycle=> ({
            label: `${new Date(cycle.cycle.date_premiere_assemblee*1000).toLocaleDateString()} -
                    ${ new Date(new Date(cycle.cycle.date_premiere_assemblee*1000).setMonth(new Date(cycle.cycle.date_premiere_assemblee*1000).getMonth() + cycle.cycle.duree_cycle)).toLocaleDateString()}`,
            value: cycle.ag
        }))
        },
    },

    methods: {
         /* Ouvrir le rapport */
        openReportFile(link){
            window.open(link, '_blank');
        },
    },
    created(){
         EventBus.$emit('loader', true)

            var current_association = this.$store.state.association.currentAssociation

            let payload = {
                resourceUrl: '/api/association/' + current_association.id + '/cycle',
                commitAction: 'SET_CYCLES'
            }
            this.$store.dispatch("association/fetchCycles",payload)
            .then((res)=>{
                //Loader
                EventBus.$emit('loader', false)

                let donnees = res.data.data

                if(donnees.length){
                    donnees.forEach(element => {
                        if(element.cycle.etat == 'cloture'){
                            this.cycles.push(element)
                        }
                    });
                }
            })
            .catch((error)=>{
                //Loader
                EventBus.$emit('loader', false)
                window.console.log(error)
            })
    }
}
</script>
