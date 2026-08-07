<template>
    <div
        class="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-6">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                    Grafik Transaksi
                </h2>

                <p class="text-sm text-slate-500">
                    Nominal transaksi 7 hari terakhir
                </p>
            </div>
        </div>

        <!-- Chart -->
        <apexchart v-if="chartSeries.length" ref="chartRef" type="line" height="360" :options="chartOptions"
            :series="chartSeries" :class="[
                'transition-all duration-300',
                isLoading
                    ? 'opacity-20 blur-[2px]'
                    : 'opacity-100 blur-0'
            ]" />

        <!-- Loading -->
        <Transition name="fade">
            <div v-if="isLoading"
                class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl">

                <div class="flex flex-col items-center">
                    <LoaderCircle class="w-10 h-10 text-blue-700 animate-spin" />

                    <span class="mt-3 text-sm text-slate-500">
                        Memuat grafik transaksi...
                    </span>
                </div>

            </div>
        </Transition>

    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { LoaderCircle } from 'lucide-vue-next'
import { useHome } from '../composable/useHome'

const apexchart = VueApexCharts

const chartRef = ref(null)

const {
    isLoading,
    chartCategories,
    chartSeries,
    fetchTransaksiChart
} = useHome()

const chartOptions = computed(() => ({
    chart: {
        type: 'line',

        toolbar: {
            show: false
        },

        zoom: {
            enabled: false
        },

        redrawOnParentResize: true,
        redrawOnWindowResize: true,

        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 700
        },

        dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            color: '#2563eb',
            opacity: 0.25
        }
    },

    colors: [
        '#2563eb',
        '#22c55e',
        '#f59e0b'
    ],

    stroke: {
        width: 6,
        curve: 'smooth',
        lineCap: 'round'
    },

    markers: {
        size: 6,
        hover: {
            size: 8
        },
        strokeWidth: 3,
        strokeColors: '#fff'
    },

    fill: {
        opacity: 1
    },

    grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4,
        padding: {
            left: 25,
            right: 10
        }
    },

    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontWeight: 500,
        itemMargin: {
            horizontal: 16,
            vertical: 8
        },
        markers: {
            width: 10,
            height: 10,
            radius: 12
        }
    },

    xaxis: {
        categories: chartCategories.value,

        crosshairs: {
            show: true
        },

        labels: {
            rotate: 0,
            trim: false
        }
    },

    yaxis: {
        tickAmount: 4,

        labels: {
            formatter(value) {
                return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
            }
        }
    },

    dataLabels: {
        enabled: true,

        offsetY: -8,

        style: {
            fontSize: '11px',
            fontWeight: 600
        },

        formatter(value) {

            if (value == 0) return ''

            return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)

        }
    },

    tooltip: {
        shared: true,
        intersect: false,

        y: {
            formatter(value) {
                return new Intl.NumberFormat(
                    'id-ID',
                    {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                    }
                ).format(value)
            }
        }
    },

    responsive: [

        {
            breakpoint: 1024,
            options: {

                stroke: {
                    width: 5
                },

                markers: {
                    size: 5
                }
            }
        },

        {
            breakpoint: 768,
            options: {

                legend: {
                    position: 'bottom'
                },

                dataLabels: {
                    enabled: false
                },

                stroke: {
                    width: 4
                },

                markers: {
                    size: 4
                },

                yaxis: {
                    labels: {
                        formatter(value) {
                            return new Intl.NumberFormat('id-ID', {
                                notation: 'compact'
                            }).format(value)
                        }
                    }
                }
            }
        },

        {
            breakpoint: 480,
            options: {

                chart: {
                    height: 260
                },

                stroke: {
                    width: 3
                },

                markers: {
                    size: 3
                },

                grid: {
                    padding: {
                        left: 5,
                        right: 5
                    }
                },

                dataLabels: {
                    enabled: false
                },

                legend: {
                    position: 'bottom'
                },

                yaxis: {
                    labels: {
                        formatter(value) {
                            return new Intl.NumberFormat('id-ID', {
                                notation: 'compact'
                            }).format(value)
                        }
                    }
                }
            }
        }

    ]
}))

onMounted(async () => {
    await fetchTransaksiChart()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: .25s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
