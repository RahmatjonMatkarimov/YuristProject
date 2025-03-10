<template>

<div class="fixed h-[100vh] z-50 flex justify-center items-center right-0">
  <div class="bg-blue-600 p-[10px] rounded-tl-xl rounded-bl-xl flex flex-col gap-6">
    <img  src="../public/telephone.png" alt="" class="cursor-pointer w-10">
    <img  src="../public/keyboard.png" alt="" class="cursor-pointer w-10">
  </div>
</div>

    <ErrorComponent v-if="errorCode" :errorCode="errorCode" />
    <RouterView v-else />
</template>

<script setup>
import { ref, inject, watchEffect, onMounted, provide } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import ErrorComponent from '@/components/error.vue';
import { URL } from './auth/url';
const dat = ref('datalotin');
const errorCode = ref(null);
provide("dat", dat);
const globalError = inject("globalError", null);
if (globalError) {
  watchEffect(() => {
    if (globalError.value !== null) {
      errorCode.value = globalError.value;
    }
  });
}

onMounted(async () => {
  try {
    await axios.get(URL);
  } catch (error) {
    errorCode.value = error.response?.status || 500;
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: white;
  font-family: "Times New Roman Custom";
}
</style>
