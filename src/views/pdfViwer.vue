<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const fileId = route.params.id;
const fileUrl = ref("");

onMounted(() => {
    fileUrl.value = `http://45.146.166.100:3000/${fileId}`;
});
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <h1 class="text-xl font-bold mb-4">Faylni ko‘rish</h1>
        <iframe v-if="fileUrl" :src="fileUrl" width="80%" height="600px" class="border border-gray-300" />
        <p v-else class="text-gray-500">Fayl yuklanmoqda...</p>
    </div>
</template>
