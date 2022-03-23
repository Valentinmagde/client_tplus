<!-- =========================================================================================
    File Name: StatisticsCard.vue
    Description: Statistics card component
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<!-- <div> -->
  <vx-card v-if="variant == 1" class="overflow-hidden">
      <div slot="no-body">
          <div class="p-2" :class="{
                'flex justify-between flex-row-reverse items-center': iconRight,
                'text-center': !iconRight && hideChart,
                'pb-0': !hideChart
              }">
              <span class="p-4 inline-flex" style="border-radius: 100%" :class="[`text-${color}`, {'mb-4': !iconRight}]" :style="{background: `rgba(var(--vs-${color}),.15)`}">
                  <icon :name="icon" style="margin: 0px"/>
              </span>
              <div class="truncate">
                  <h2 class="font-bold text-size">{{ statistic }}</h2>
                  <p class="mb-5">{{ statisticTitle }}</p>
                  <div v-if="link || paymentlink" class="flex justify-center">
                      <vx-tooltip v-if="link" :text="viewDetail" position="bottom">
                          <vs-button class="mx-2 mb-2 px-3 view-detail-btn shadow-md flex flex-wrap justify-center" :color="color" @click="$router.push(link).catch(() => {})">
                              {{ statisticDetail }}
                          </vs-button>
                      </vx-tooltip>
                      <vx-tooltip v-if="color=='warning' && paymentlink" :text="paymentDetail" position="bottom">
                          <vs-button class="mb-2 px-3 view-detail-btn shadow-md flex flex-wrap justify-center" :color="color" @click="$router.push(paymentlink).catch(() => {})">
                              {{paymentTitle}}
                          </vs-button>
                      </vx-tooltip>

                      <vx-tooltip v-if="color=='success' && paymentlink" :text="paymentDetail" position="bottom">
                          <vs-button class="mb-2 px-3 view-detail-btn shadow-md flex flex-wrap justify-center" :color="color" @click="$router.push(paymentlink).catch(() => {})">
                              {{paymentTitle}}
                          </vs-button>
                      </vx-tooltip>
                  </div>
              </div>
          </div>

          <div class="line-area-chart" v-if="!hideChart">
              <vue-apex-charts ref="apexChart" :type="type" height=100 width='100%' :options="chartOptions" :series="chartData" />
          </div>
      </div>
  </vx-card>

  <vx-card v-else class="overflow-hidden" style="min-height: 14.7rem;">
    <div slot="no-body">
        <div class="p-6" :class="{
              'flex justify-between flex-row-reverse items-center': iconRight,
              'text-center': !iconRight && hideChart,
              'pb-0': !hideChart
            }">
            <span class="p-4 inline-flex" style="border-radius: 100%" :class="[`text-${color}`, {'mb-4': !iconRight}]" :style="{background: `rgba(var(--vs-${color}),.15)`}">
                <icon :name="icon" style="margin: 0px"/>
            </span>
            <div class="truncate">
                <h2 class="font-bold text-size">{{ statistic }}</h2>
                <p class="mt-1">{{ statisticTitle }}</p>
                <ul v-if="admin || color=='warning'" class="inline-block mt-2" style="color:#65B0F3;">
                    <li color="#65B0F3" class="inline-block hover:italic cursor-pointer" @click="$router.push(paymentlink).catch(() => {})">{{paymentTitle}}</li>
                </ul>
            </div>
        </div>

        <div class="line-area-chart" v-if="!hideChart">
            <vue-apex-charts ref="apexChart" :type="type" height=100 width='100%' :options="chartOptions" :series="chartData" />
        </div>
    </div>
  </vx-card>
<!-- </div> -->

</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import chartConfigs from "./chartConfigs.js"
import _color from '@/assets/utils/color.js'

export default {
    props: {
        variant: {
          type: Number,
          default: 0,
        },
        icon: {
            type: String,
            required: true
        },
        statistic: {
            type: [Number, String],
            required: true,
        },
        statisticTitle: {
            type: String,
        },
        viewDetail: {
            type: String,
        },
        paymentDetail: {
            type: String,
        },
        statisticDetail: {
            type: String,
        },
        paymentTitle: {
            type: String,
        },
        chartData: {
            // type: Array,
            // required: true
        },
        color: {
            type: String,
            default: 'primary',
        },
        link: {
            type: String,
            default: '',
        },
        paymentlink: {
            type: String,
            default: '',
        },
        colorTo: {
            type: String
        },
        // chartType: {
        //     type: String,
        //     default: 'line-chart',
        // },
        type: {
            type: String,
            default: 'line'
        },
        iconRight: {
            type: Boolean,
            default: false
        },
        hideChart: {
            type: Boolean,
            default: false,
        },
        admin: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            chartOptions: null
        }
    },
    watch: {
        themePrimaryColor() {
            this.$refs.apexChart.updateOptions({
                theme: {
                    monochrome: {
                        color: this.getHex(this.color)
                    }
                }
            });
        }
    },
    computed: {
        themePrimaryColor() {
            return this.$store.state.themePrimaryColor;
        }
    },
    methods: {
        getHex(color) {
            if (_color.isColor(color)) {
                let rgb = window.getComputedStyle(document.documentElement).getPropertyValue(`--vs-${color}`);
                rgb = rgb.split(",");
                return "#" + ((1 << 24) + (Number(rgb[0]) << 16) + (Number(rgb[1]) << 8) + Number(rgb[2])).toString(16).slice(1);
            }
            return color
        },
        gradientToColor(color) {
            let gradientToColors = {
                "primary": "#A9A2F6",
                "success": "#55DD92",
                "warning": "#ffc085",
                "danger": "#F97794"
            }

            return gradientToColors[color] ? gradientToColors[color] : gradientToColors["primary"]
        }
    },
    components: {
        VueApexCharts
    },
    created() {
        if (this.type == 'area') {
            // assign chart options
            this.chartOptions = Object.assign({}, chartConfigs.areaChartOptions)

            this.chartOptions['theme'] = {
                monochrome: {
                    enabled: true,
                    color: this.getHex(this.color),
                    shadeTo: 'light',
                    shadeIntensity: 0.65
                }
            }
        } else if (this.type == "line") {
            // Assign chart options
            this.chartOptions = JSON.parse(JSON.stringify(chartConfigs.lineChartOptions))

            this.chartOptions.fill.gradient.gradientToColors = [this.gradientToColor(this.colorTo || this.color)]
            this.chartOptions.colors = [this.getHex(this.color)]
        }
    }
}
</script>

<style>
.view-detail-btn {
    font-size: 13px !important;
    padding-top: 3px !important;
    padding-bottom: 3px !important;
}
</style>
