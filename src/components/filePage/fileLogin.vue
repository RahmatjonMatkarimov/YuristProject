<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div>
        <h1 class="text-3xl font-bold text-center text-teal-800 mb-8">Tizimga kirish</h1>
        <form @submit.prevent="setData" class="space-y-6">
          <input v-model="username" placeholder="login" type="text" required
            class="w-full p-3 text-black rounded-lg border border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none placeholder-gray-400" />
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'"
              class="w-full p-3 rounded-lg border text-black border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none placeholder-gray-400"
              placeholder="Parol" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center">
              <img :src="showPassword ? '/eyes.png' : '/eye.png'" alt="Ko'rinishni almashtirish"
                class="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <button @click="setData"
            class="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white p-3 rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
            Tizimga Kirish
          </button>
        </form>
        <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { URL1 } from "@/auth/url";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
const showPassword = ref(false);
const password = ref("");
const username = ref("");
const error = ref("");
const router = useRouter();
const url = `${URL1}/commoners/login`;
const id = ref(null);

const setData = async () => {
  try {
    const res = await axios.post(url, {
      username: username.value.trim(),
      password: password.value.trim(),
    });
    console.log();
    id.value = res.data.user.id;
    if (id.value) {
      router.push('/fileProfile/' + id.value)
    }

  } catch (err) {
    error.value = err.response?.data?.message || "Login yoki parol noto'g'ri.";
  }
};
</script>