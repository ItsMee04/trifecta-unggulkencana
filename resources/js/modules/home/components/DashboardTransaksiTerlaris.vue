<template>
    <div
        class="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-6">

        <!-- Header -->
        <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">
                Jenis Produk Terlaris
            </h2>

            <p class="text-sm text-slate-500">
                Total produk terjual 7 hari terakhir
            </p>
        </div>

        <apexchart :key="pieLabels.join('-')" type="donut" height="375" :options="chartOptions" :series="pieSeries"
            :class="[
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
                        Memuat grafik...
                    </span>

                </div>

            </div>
        </Transition>

    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { LoaderCircle } from 'lucide-vue-next'
import { useHome } from '../composable/useHome'

const apexchart = VueApexCharts

const {
    isLoading,
    pieLabels,
    pieSeries,
    fetchProdukTerlarisChart
} = useHome()

const chartOptions = computed(() => ({
    labels: pieLabels.value.map(item => item.toUpperCase()),
    chart: {
        type: 'donut',
        toolbar: {
            show: false
        }
    },
    legend: {
        position: 'bottom',
        fontSize: '14px'
    },
    dataLabels: {
        enabled: true,
        formatter(val) {
            return val.toFixed(0) + '%'
        }
    },
    stroke: {
        width: 2,
        colors: ['#fff']
    },
    plotOptions: {
        pie: {
            donut: {
                size: '68%',
                labels: {
                    show: true,

                    total: {
                        show: true,
                        label: 'TOTAL',
                        fontSize: '14px',
                        formatter() {
                            return pieSeries.value.reduce((a, b) => a + b, 0) + ' Produk';
                        }
                    },

                    value: {
                        formatter(value) {
                            return `${value} Produk`;
                        }
                    }
                }
            }
        }
    },
    tooltip: {
        y: {
            formatter(value) {
                return `${value} Produk`
            }
        },
        x: {
            formatter(value) {
                return value.toUpperCase()
            }
        }
    },
    colors: [
        '#2563eb',
        '#22c55e',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#06b6d4',
        '#84cc16'
    ],
    responsive: [
        {
            breakpoint: 1024,
            options: {
                chart: {
                    height: 320
                },

                legend: {
                    position: 'bottom'
                }
            }
        },

        {
            breakpoint: 768,
            options: {
                chart: {
                    height: 300
                },

                legend: {
                    position: 'bottom',
                    fontSize: '12px'
                },

                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%'
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

                legend: {
                    position: 'bottom',
                    fontSize: '11px'
                },

                dataLabels: {
                    enabled: false
                },

                plotOptions: {
                    pie: {
                        donut: {
                            size: '60%',

                            labels: {
                                total: {
                                    fontSize: '12px'
                                },

                                value: {
                                    fontSize: '14px'
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
}))

onMounted(() => {
    fetchProdukTerlarisChart()
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
