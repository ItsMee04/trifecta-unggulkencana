<template>
    <main class="p-8 space-y-6 font-sans">

        <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p class="text-sm text-slate-500 mt-0.5">Welcome back, Demo. Here's what's happening.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-start justify-between">
                <div class="space-y-2">
                    <span class="text-sm font-medium text-slate-400 block">Total Revenue</span>
                    <h3 class="text-2xl font-bold text-slate-900 tracking-tight">$45,231.89</h3>
                    <span
                        class="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        +20.1% <span class="text-slate-400 font-normal ml-1">mo.</span>
                    </span>
                </div>
                <div class="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl">
                    <DollarSign class="w-5 h-5" />
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-start justify-between">
                <div class="space-y-2">
                    <span class="text-sm font-medium text-slate-400 block">Active Users</span>
                    <h3 class="text-2xl font-bold text-slate-900 tracking-tight">16</h3>
                    <span
                        class="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        +180.1% <span class="text-slate-400 font-normal ml-1">mo.</span>
                    </span>
                </div>
                <div class="bg-sky-50 text-sky-600 p-3.5 rounded-xl">
                    <Users class="w-5 h-5" />
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-start justify-between">
                <div class="space-y-2">
                    <span class="text-sm font-medium text-slate-400 block">Sales</span>
                    <h3 class="text-2xl font-bold text-slate-900 tracking-tight">+12,234</h3>
                    <span
                        class="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        +19% <span class="text-slate-400 font-normal ml-1">mo.</span>
                    </span>
                </div>
                <div class="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl">
                    <ShoppingBag class="w-5 h-5" />
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-start justify-between">
                <div class="space-y-2">
                    <span class="text-sm font-medium text-slate-400 block">Active Now</span>
                    <h3 class="text-2xl font-bold text-slate-900 tracking-tight">+573</h3>
                    <span
                        class="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        +201 <span class="text-slate-400 font-normal ml-1">mo.</span>
                    </span>
                </div>
                <div class="bg-amber-50 text-amber-600 p-3.5 rounded-xl">
                    <Activity class="w-5 h-5" />
                </div>
            </div>

        </div>

        <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 class="font-bold text-slate-900 text-base">Recent Transactions</h2>
                <button class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">View All</button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="bg-slate-50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                            <th class="py-3 px-6">Customer</th>
                            <th class="py-3 px-6">Status</th>
                            <th class="py-3 px-6">Date</th>
                            <th class="py-3 px-6 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 text-sm">
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="py-4 px-6 font-medium text-slate-900">Alex Rivera</td>
                            <td class="py-4 px-6">
                                <span
                                    class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg">Success</span>
                            </td>
                            <td class="py-4 px-6 text-slate-500">Jul 8, 2026</td>
                            <td class="py-4 px-6 text-right font-semibold text-slate-900">$250.00</td>
                        </tr>
                        <tr class="hover:bg-slate-50/50 transition">
                            <td class="py-4 px-6 font-medium text-slate-900">Marcus Vance</td>
                            <td class="py-4 px-6">
                                <span
                                    class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg">Pending</span>
                            </td>
                            <td class="py-4 px-6 text-slate-500">Jul 7, 2026</td>
                            <td class="py-4 px-6 text-right font-semibold text-slate-900">$89.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </main>
</template>

<script setup>
import { DollarSign, Users, ShoppingBag, Activity } from 'lucide-vue-next';
</script>
