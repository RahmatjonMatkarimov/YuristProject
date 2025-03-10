<script setup>
import { URL } from "@/auth/url";
import axios from "axios";
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";

const isLoading = inject('isLoading'); // Global loadingni olish
const route = useRoute();
const fileId = route.params.id;
const fileUrl = ref(null);

const getData = async () => {
    isLoading.value = true;
    try {
        const res = await axios.get(`http://45.146.166.100:3000/signingFiles/signing/${fileId}`);
        console.log(res.data.filePath);
        fileUrl.value = `${URL}${res.data.filePath}`
    } catch (error) {
        console.error("Ma'lumot yuklashda xatolik:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    getData();
});
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <h1 class="text-xl font-bold mb-4">Faylni ko‘rish</h1>
        <iframe v-if="fileUrl" :src="fileUrl" width="80%" height="600px" class="border border-gray-300" />
        <p v-else class="text-gray-500">Fayl yuklanmoqda...</p>
    </div>
</template>
