<template>
    <div class="min-h-screen bg-gray-50 absolute flex justify-center flex-col items-center top-0 left-0 right-0 p-6">
        <div v-if="htmlContent" class="bg-white w-[800px] shadow-lg h-[900px] rounded-lg pt-16  mb-6">
            <div v-html="htmlContent" class=" max-w-none"></div>
        </div>
        
        <div v-if="data && data.videos.length" class="flex justify-center flex-wrap gap-6">
            <div v-for="item in data.videos" :key="item.id" class="bg-white shadow-md rounded-lg overflow-hidden">
                <video controls :src="URL + item.url" class="w-full h-64 object-cover" v-if="item.url"></video>
                <div v-else class="p-4 text-center text-gray-500">Videolar mavjud emas.</div>
                <div class="p-4">
                    <p class="text-gray-700 font-medium text-center">Video #{{ item.id }}</p>
                </div>
            </div>
        </div>
        
        <div v-else class="text-center text-gray-500 mt-6">Hech qanday video mavjud emas.</div>
    </div>
</template>

<script setup>
import { URL } from '@/auth/url';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const API_URL = 'http://45.146.166.100:3001';
const data = ref({ videos: [] });
const htmlContent = ref(null);
const route = useRoute();
const id = ref(route.params.id);

async function getdata() {
    try {
        const response = await axios.get(`${API_URL}/commoners/${id.value}`);
        data.value = response.data;
        if (data.value.file) {
            const htmlResponse = await axios.get(`${API_URL}${data.value.file}`);
            htmlContent.value = `
                <style>
                    * { color: black !important; font-family: sans-serif; }
                </style>
                ${htmlResponse.data}
            `;
        }
    } catch (error) {
        console.error('Ma\'lumot olishda xato:', error);
    }
}

onMounted(() => getdata());
</script>

<style lang="scss" scoped>
</style>
