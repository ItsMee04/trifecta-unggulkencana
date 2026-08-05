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
        <apexchart :key="chartCategories.join('-') + '-' + chartSeries.length" type="line" height="360"
            :options="chartOptions" :series="chartSeries" :class="[
                'transition-all duration-300',
                isLoading
                    ? 'opacity-20 blur-[2px]'
                    : 'opacity-100 blur-0'
            ]" />

        <!-- Loading Overlay -->
        <Transition name="fade">
            <div v-if="isLoading"
                class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl">

                <div class="flex flex-col items-center">

                    <LoaderCircle class="w-10 h-10 text-blue-700 animate-spin" />

                    <span class="mt-3 text-sm font-medium text-slate-500">
                        Memuat grafik transaksi...
                    </span>

                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import SkeletonChart from '../components/SkeletonCard.vue'
import { useHome } from '../composable/useHome'

const apexchart = VueApexCharts

const {
    isLoading,
    chartCategories,
    chartSeries,
    fetchTransaksiChart
} = useHome();

const chartOptions = computed(() => ({
    chart: {
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 900
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
    yaxis: {
        tickAmount: 4,
        forceNiceScale: true,

        labels: {
            minWidth: 90,
            maxWidth: 120,

            formatter(value) {
                return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
            }
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        y: {
            formatter(value) {
                return new Intl.NumberFormat(
                    'id-ID',
                    {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0
                    }
                ).format(value);
            }
        }
    },
    legend: {
        position: 'top'
    },
    colors: [
        '#2563eb',
        '#22c55e',
        '#f59e0b'
    ],
    grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
        padding: {
            left: 35
        }
    },
    markers: {
        size: 6,
        strokeWidth: 3,
        strokeColors: '#fff',
        hover: {
            size: 9
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
            if (value === 0) return '';
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
        }
    },
    fill: {
        opacity: 1
    },
    stroke: {
        width: 8,
        curve: 'smooth',
        lineCap: 'round'
    },
    xaxis: {
        categories: chartCategories.value,
        crosshairs: {
            show: true
        }
    },
}))

onMounted(() => {
    fetchTransaksiChart()
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
