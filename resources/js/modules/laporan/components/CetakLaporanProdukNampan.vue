<template>
    <div class="min-h-screen bg-zinc-800 flex flex-col items-center justify-start p-6 print:bg-white print:p-0">
        <!-- Loading State -->
        <div v-if="isLoading" class="my-auto text-white font-semibold animate-pulse print:hidden">
            <div class="flex flex-col items-center gap-3">
                <svg class="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                    </circle>

                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <span>
                    Menyiapkan Laporan Produk Nampan...
                </span>
            </div>
        </div>
        <!-- Container A4 -->
        <div v-else-if="laporanData"
            class="w-[21cm] min-h-[29.7cm] bg-white p-8 text-slate-800 shadow-2xl border border-zinc-700 flex flex-col justify-between print:shadow-none print:border-none print:p-0 print:w-full print:min-h-0">
            <table class="w-full border-collapse">
                <thead class="print-header">
                    <!-- Kop -->
                    <tr>
                        <td colspan="7" class="pb-4">
                            <div class="grid grid-cols-12 gap-2 items-center border-b-2 border-slate-800 pb-3">
                                <!-- Logo + Identitas -->
                                <div class="col-span-8 flex gap-4 items-center">
                                    <img :src="logoToko" alt="Logo Toko"
                                        class="w-[70px] h-[70px] object-contain flex-shrink-0" />
                                    <div class="space-y-1">
                                        <span
                                            class="text-[9px] uppercase tracking-wider font-extrabold text-slate-800 block leading-none">
                                            Toko Emas
                                        </span>
                                        <h2
                                            class="text-[18px] font-black uppercase tracking-wide text-amber-500 leading-none">
                                            Unggul Kencana
                                        </h2>
                                        <p class="text-[9px] text-slate-500 font-medium leading-tight max-w-[320px]">
                                            Ruko No. 8 Jl. Patimura, Karang Lewas,
                                            Purwokerto, Jawa Tengah
                                        </p>
                                    </div>
                                </div>
                                <!-- Judul + Periode -->
                                <div class="col-span-4 flex flex-col justify-between items-end">
                                    <h1
                                        class="text-base font-black uppercase tracking-wider text-slate-800 border-b-2 border-amber-500 pb-0.5 mb-1 inline-block whitespace-nowrap">
                                        Laporan Nampan / Produk
                                    </h1>
                                    <div class="text-[9.5px] text-right font-medium text-slate-600">
                                        <span>Tanggal :</span>
                                        <span class="font-semibold text-slate-900">
                                            {{
                                                formatTanggalPeriode(
                                                    laporanData.periode?.tanggal_awal
                                                )
                                            }}
                                            s/d
                                            {{
                                                formatTanggalPeriode(
                                                    laporanData.periode?.tanggal_akhir
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- Header Tabel -->
                    <tr class="bg-slate-100 text-[9px] uppercase font-bold text-slate-800 border-y border-slate-300">
                        <th class="w-[5%] py-2 border-r border-slate-300 text-center">
                            No
                        </th>
                        <th class="w-[15%] py-2 border-r border-slate-300 text-center">
                            Tanggal
                        </th>
                        <th class="w-[15%] py-2 border-r border-slate-300 text-center">
                            Nampan
                        </th>
                        <th class="w-[10%] py-2 border-r border-slate-300 text-center">
                            ID Produk
                        </th>
                        <th class="w-[35%] py-2 border-r border-slate-300 text-left pl-3">
                            Nama Produk
                        </th>
                        <th class="w-[10%] py-2 border-r border-slate-300 text-center">
                            Jenis
                        </th>
                        <th class="w-[10%] py-2 text-center">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody class="text-[10px]">
                    <!-- Group Tanggal -->
                    <template v-for="(tanggalGroup, tanggal) in groupedData" :key="tanggal">
                        <!-- Tanggal -->
                        <tr class="bg-slate-700 text-white">
                            <td colspan="7" class="px-3 py-2 font-bold uppercase tracking-wide">
                                Tanggal :
                                {{ formatTanggalTable(tanggal) }}
                            </td>
                        </tr>

                        <!-- Group Nampan -->
                        <template v-for="(nampanGroup, nampan) in tanggalGroup" :key="`${tanggal}-${nampan}`">
                            <!-- Header Nampan -->
                            <tr class="bg-slate-100 border-y border-slate-300">
                                <td colspan="7" class="px-3 py-2">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <span class="font-bold text-slate-800">
                                                Nampan :
                                            </span>
                                            <span class="font-semibold text-amber-600 uppercase">
                                                {{ nampan }}
                                            </span>
                                        </div>
                                        <div class="flex gap-6 text-[9px]">
                                            <span>
                                                <strong>
                                                    Total Log :
                                                </strong>
                                                {{ nampanGroup.length }}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <!-- Produk -->
                            <tr v-for="(item, index) in nampanGroup" :key="`${item.id}-${index}`">
                                <td class="text-center py-2 border-r border-slate-200">
                                    {{ index + 1 }}
                                </td>
                                <td class="text-center font-mono border-r border-slate-200">
                                    {{ formatTanggalTable(item.tanggal) }}
                                </td>
                                <td class="text-center font-semibold border-r border-slate-200">
                                    {{ item.nampan || '-' }}
                                </td>
                                <td class="text-center font-mono border-r border-slate-200">
                                    {{ item.produk_id || '-' }}
                                </td>
                                <td class="px-3 border-r border-slate-200">
                                    <span class="font-semibold uppercase">
                                        {{ item.produk || '-' }}
                                    </span>
                                </td>
                                <td class="text-center uppercase border-r border-slate-200">
                                    {{ item.jenis || '-' }}
                                </td>
                                <td class="text-center">
                                    <span class="px-2 py-0.5 rounded text-[9px]" :class="Number(item.status) === 1
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'">
                                        {{
                                            Number(item.status) === 1
                                                ? 'AKTIF'
                                                : 'KELUAR'
                                        }}
                                    </span>
                                </td>
                            </tr>
                        </template>
                    </template>

                    <!-- Tidak ada data -->
                    <tr v-if="Object.keys(groupedData).length === 0">
                        <td colspan="7" class="py-10 text-center text-slate-400">
                            Tidak ada data pada periode ini.
                        </td>
                    </tr>
                </tbody>

                <!-- Footer -->
                <tfoot class="print-footer">
                    <tr>
                        <td colspan="7" class="pt-4">
                            <div class="border-t-2 border-slate-800 pt-3 break-inside-avoid">
                                <div class="flex justify-between items-start">
                                    <!-- Tanggal Cetak -->
                                    <div class="text-[9.5px] text-slate-700">
                                        <span>
                                            Di cetak tanggal :
                                        </span>
                                        <span class="font-semibold">
                                            {{ tanggalCetakHariIni }}
                                        </span>
                                    </div>


                                    <!-- Summary -->
                                    <div class="w-[280px] space-y-1 text-[10px]">
                                        <div class="flex justify-between border-b border-slate-200 pb-1">
                                            <span class="font-bold text-slate-700">
                                                Total Produk
                                            </span>
                                            <span class="font-mono font-bold">
                                                {{
                                                    laporanData.items?.length || 0
                                                }}
                                                Pt
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { laporanService } from '../services/laporanService'
import logoTokoImg from '@/assets/img/LOGOTOKO.png'

const route = useRoute()
const isLoading = ref(true)
const laporanData = ref(null)
const logoToko = ref(logoTokoImg)

const formatTanggalPeriode = (tanggalString) => {
    if (!tanggalString) {
        return '-'
    }
    return tanggalString
}

const formatTanggalTable = (tanggalString) => {
    if (!tanggalString) {
        return '-'
    }
    try {
        const date = new Date(`${tanggalString}T00:00:00`)
        const day = String(
            date.getDate()
        ).padStart(2, '0')
        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    } catch (error) {
        return tanggalString
    }
}

const tanggalCetakHariIni = computed(() => {
    return new Date().toLocaleDateString(
        'id-ID',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    )
})

const formatBerat = (angka) => {
    if (
        angka === undefined ||
        angka === null ||
        isNaN(Number(angka))
    ) {
        return '0.000'
    }
    return Number(angka).toLocaleString(
        'id-ID',
        {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        }
    )
}

const getTotalBeratNampan = (items) => {
    return items.reduce(
        (total, item) => {
            return total + Number(item.berat || 0)
        },
        0
    )
}

const groupedData = computed(() => {
    if (!laporanData.value?.items) {
        return {}
    }
    return laporanData.value.items.reduce(
        (result, item) => {
            const tanggal =
                item.tanggal || 'Tidak diketahui'
            const nampan =
                item.nampan || 'Tanpa Nampan'
            if (!result[tanggal]) {
                result[tanggal] = {}
            }
            if (!result[tanggal][nampan]) {
                result[tanggal][nampan] = []
            }
            result[tanggal][nampan].push(item)
            return result
        },
        {}
    )
})


/*
|--------------------------------------------------------------------------
| Fetch Laporan
|--------------------------------------------------------------------------
*/

const fetchLaporanData = async () => {
    isLoading.value = true;

    try {
        const tanggalAwal = route.query.tanggal_awal;
        const tanggalAkhir = route.query.tanggal_akhir;

        console.log('Tanggal Awal:', tanggalAwal);
        console.log('Tanggal Akhir:', tanggalAkhir);

        if (!tanggalAwal || !tanggalAkhir) {
            throw new Error(
                'Tanggal awal dan tanggal akhir wajib diisi.'
            );
        }

        const response = await laporanService.getLaporanProdukNampan({
            tanggal_awal: tanggalAwal,
            tanggal_akhir: tanggalAkhir
        });

        if (response?.status && response?.laporanData) {
            laporanData.value = response.laporanData;

            document.title =
                `LAPORAN-PRODUK-NAMPAN-${tanggalAwal}_sd_${tanggalAkhir}`;
        } else {
            throw new Error(
                response?.message ||
                'Data laporan produk nampan tidak ditemukan.'
            );
        }

    } catch (error) {
        console.error(
            'Gagal memuat data laporan produk nampan:',
            error
        );
    } finally {
        isLoading.value = false;

        if (laporanData.value) {
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }
};


/*
|--------------------------------------------------------------------------
| Mounted
|--------------------------------------------------------------------------
*/

onMounted(() => {
    fetchLaporanData()
})
</script>


<style>
@media print {
    @page {
        size: A4 portrait;
        margin: 1cm;
    }

    body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        background-color: #fff !important;
    }

    .print-header {
        display: table-header-group;
    }

    .print-footer {
        display: table-footer-group;
    }

    tr {
        page-break-inside: avoid;
    }
}
</style>
