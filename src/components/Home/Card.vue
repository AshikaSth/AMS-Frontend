<!-- <script setup>
import { defineProps } from 'vue';

defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: 'No description provided.'
    }
});
</script>
<template>
     <div class="bg-white rounded-2xl shadow p-6 text-center">
        <h3 class="text-xl font-bold text-indigo-700 mb-2">{{title}}</h3>
        <p class="text-gray-600">{{ description }}</p>
      </div>
</template> -->
<script setup>
import { defineProps } from 'vue';

defineProps({
    icon: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: 'No description provided.'
    }
});
</script>

<template>
    <div class="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
        <div class="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
            <component :is="icon" class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-700" />
        </div>
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">{{ description }}</p>
    </div>
</template>