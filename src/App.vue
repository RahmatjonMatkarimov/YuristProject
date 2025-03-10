<template>
  <!-- Loading holati barcha sahifalar uchun global -->
  <div v-if="isLoading" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <svg class="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
      </path>
    </svg>
  </div>

  <div
    class="bg-blue-600 hidden md:flex fixed right-0 z-50 top-[45%] p-[10px] rounded-tl-xl rounded-bl-xl flex-col gap-6">
    <img src="../public/telephone.png" alt="Telephone" class="cursor-pointer w-10" />
    <img src="../public/keyboard.png" alt="Keyboard" class="cursor-pointer w-10" />
  </div>

  <ErrorComponent v-if="errorCode" :errorCode="errorCode" />
  <RouterView v-else />
</template>

<script setup>
import { ref, provide, watchEffect, onMounted } from 'vue';
import axios from 'axios';
import ErrorComponent from '@/components/error.vue';
import { URL } from './auth/url';

const errorCode = ref(null);
const isLoading = ref(false);

// Global provide qilish
provide('isLoading', isLoading);

const fetchData = async (url) => {
  isLoading.value = true;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    errorCode.value = error.response?.status || 500;
    throw error;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchData(URL);
});

defineExpose({ fetchData });
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
  font-family: 'Times New Roman Custom';
}
</style>